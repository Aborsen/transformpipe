/*
 * The page as it actually looks, in one file.
 *
 * The other way of saving a page — find the article, convert it, render it in this product's own
 * stylesheet — is the right answer for something somebody is going to read or edit, and the wrong
 * one for a landing page: there is no article in a landing page to find, so what comes back is its
 * words in a column with none of its design and none of its pictures. That is what "it saved the
 * text and nothing else" means, and it is a fair complaint about the wrong tool rather than a bug
 * in this one.
 *
 * So this is the other tool. It takes the live document, inlines what it needs to stand alone —
 * stylesheets as text, images and fonts as data URIs — drops everything that would reach out to a
 * network or run, and hands back one string. It is what a browser's own "save page" would do if it
 * wrote a single file.
 *
 * Every line of it runs inside the page, serialised into `chrome.scripting.executeScript`, so it
 * closes over nothing and can use the page's own credentials and cache to read the assets it is
 * inlining. That last part is why this cannot happen in the extension: a stylesheet behind a login
 * is fetched here the way the page itself fetched it.
 */
export interface Snapshot {
  html: string;
  title: string;
  /** What had to be left as an address, so the caller can say so if it matters. */
  missed: number;
}

export async function snapshot(
  maxAsset: number,
  maxTotal: number
): Promise<Snapshot> {
  let spent = 0;
  let missed = 0;

  const asDataUri = async (url: string): Promise<string | null> => {
    if (!/^https?:\/\//i.test(url) || spent > maxTotal) {
      return null;
    }

    try {
      const response = await fetch(url, { credentials: 'include' });

      if (!response.ok) {
        return null;
      }

      const blob = await response.blob();

      if (blob.size > maxAsset || spent + blob.size > maxTotal) {
        return null;
      }

      spent += blob.size;

      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  };

  /* `url(...)` inside a stylesheet, resolved against wherever that stylesheet lives. */
  const inlineCssUrls = async (css: string, base: string): Promise<string> => {
    const seen = new Map<string, string>();
    const urls = [...css.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)]
      .map((match) => match[1])
      .filter((one) => one && !one.startsWith('data:'));

    for (const one of new Set(urls)) {
      let absolute: string;

      try {
        absolute = new URL(one, base).href;
      } catch {
        continue;
      }

      const data = await asDataUri(absolute);

      if (data) {
        seen.set(one, data);
      } else {
        seen.set(one, absolute);
        missed++;
      }
    }

    return css.replace(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g, (whole, one: string) =>
      seen.has(one) ? `url("${seen.get(one)}")` : whole
    );
  };

  /*
   * Minified CSS, given its line breaks back.
   *
   * A snapshot is a file for a browser to open, not for a person to read — but it is still a file
   * somebody will open in an editor one day, and a site's stylesheets arrive as one line each, so
   * the whole thing lands as four unreadable lines. One rule per line costs nothing at render time
   * and is the difference between a file you can look through and a wall.
   */
  const readable = (css: string) =>
    css.includes('\n') ? css : css.replace(/}\s*/g, '}\n');

  const copy = document.documentElement.cloneNode(true) as HTMLElement;

  /* Nothing that runs, and nothing that asks the network for more of the page. */
  for (const node of copy.querySelectorAll(
    'script, noscript, link[rel~="preload"], link[rel~="prefetch"], link[rel~="modulepreload"], iframe, object, embed'
  )) {
    node.remove();
  }

  /*
   * Stylesheets, in the order the document has them.
   *
   * `cssRules` is read first because it is already parsed and already resolved; a cross-origin
   * sheet refuses that, and then the file is fetched as text the way the page would have. One of
   * the two works for almost everything.
   */
  const sheets = [...copy.querySelectorAll('link[rel~="stylesheet"]')];

  for (const sheet of sheets) {
    const href = sheet.getAttribute('href');

    if (!href) {
      sheet.remove();
      continue;
    }

    let absolute: string;

    try {
      absolute = new URL(href, document.baseURI).href;
    } catch {
      sheet.remove();
      continue;
    }

    let css: string | null = null;

    const live = [...document.styleSheets].find((one) => one.href === absolute);

    try {
      if (live?.cssRules) {
        css = [...live.cssRules].map((rule) => rule.cssText).join('\n');
      }
    } catch {
      /* Cross-origin and not readable this way: fetched below instead. */
    }

    if (css === null) {
      try {
        const response = await fetch(absolute, { credentials: 'include' });

        css = response.ok ? await response.text() : null;
      } catch {
        css = null;
      }
    }

    if (css === null) {
      missed++;
      continue;
    }

    const style = document.createElement('style');

    style.textContent = readable(await inlineCssUrls(css, absolute));
    sheet.replaceWith(style);
  }

  /* Style elements the page wrote itself can still point at images. */
  for (const style of copy.querySelectorAll('style')) {
    if (style.textContent?.includes('url(')) {
      style.textContent = await inlineCssUrls(style.textContent, document.baseURI);
    }

    style.textContent = readable(style.textContent ?? '');
  }

  /* Pictures: the tag, the lazy attributes it may be hiding behind, and inline backgrounds. */
  const images = [...copy.querySelectorAll('img')];

  for (const image of images) {
    /*
     * A lazy image keeps its real address in `data-src` and a one-pixel placeholder in `src`, so
     * the placeholder is what a naive read carries into the file: a saved page full of grey dots.
     * The lazy attributes win whenever `src` is one of those.
     */
    const current = image.getAttribute('src') ?? '';
    const lazy =
      image.getAttribute('data-src') ||
      image.getAttribute('data-original') ||
      image.getAttribute('data-lazy-src') ||
      '';
    const placeholder =
      !current || current.startsWith('data:') || /\b1x1|spacer|blank\./.test(current);
    const candidate = placeholder && lazy ? lazy : current || lazy;

    let absolute = '';

    try {
      absolute = candidate ? new URL(candidate, document.baseURI).href : '';
    } catch {
      absolute = '';
    }

    if (!absolute) {
      continue;
    }

    const data = await asDataUri(absolute);

    image.setAttribute('src', data ?? absolute);
    image.removeAttribute('srcset');
    image.removeAttribute('loading');
    image.removeAttribute('data-src');

    if (!data) {
      missed++;
    }
  }

  for (const source of copy.querySelectorAll('picture source')) {
    source.remove();
  }

  for (const element of copy.querySelectorAll<HTMLElement>('[style*="url("]')) {
    element.setAttribute(
      'style',
      await inlineCssUrls(element.getAttribute('style') ?? '', document.baseURI)
    );
  }

  /*
   * A base, so anything that could not be carried still resolves, and a note saying where this came
   * from and when — a saved page with no provenance is a file nobody can place a year later.
   */
  const head = copy.querySelector('head') ?? copy.insertBefore(document.createElement('head'), copy.firstChild);
  const base = document.createElement('base');

  base.href = document.baseURI;
  head.prepend(base);

  const note = document.createComment(
    ` Saved from ${document.location.href} on ${new Date().toISOString()} by TransformPipe `
  );

  head.prepend(note);

  /*
   * A line break between the things a head and a body are made of. Whitespace between elements is
   * whitespace the renderer collapses, so this changes nothing about how the page looks and a great
   * deal about whether the file can be read at all.
   */
  for (const parent of [head, copy.querySelector('body')]) {
    if (!parent) {
      continue;
    }

    for (const child of [...parent.children]) {
      parent.insertBefore(document.createTextNode('\n'), child);
    }

    parent.append(document.createTextNode('\n'));
  }

  return {
    html: `<!doctype html>\n${copy.outerHTML}`,
    title: document.title,
    missed,
  };
}
