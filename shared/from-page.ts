import { Readability } from '@mozilla/readability';
import DOMPurify from 'dompurify';
import { htmlToMarkdown } from './from-html.js';
import { ALLOWED_ATTR, ALLOWED_TAGS } from './markdown.js';

/*
 * A rendered page, as Markdown.
 *
 * `from-html.ts` converts a file of HTML: whatever is in it is what somebody meant to convert. A
 * page in a browser is not that. It is an article inside a site — with a navigation bar, a cookie
 * notice, a sidebar of related links and a footer of legal text — and running the converter over
 * the whole of it produces a document whose first two hundred words are a menu.
 *
 * So this file is the part that decides what the document *is*, and then hands that to the same
 * converter the rest of the product uses. Two jobs, and neither belongs in `from-html.ts`:
 *
 *   1. Find the article. `@mozilla/readability` is the library behind Firefox's reader mode; it
 *      scores the blocks of a page and keeps the one that reads like prose. Writing that heuristic
 *      here would be a worse version of a thing that already exists and is tested against the
 *      actual web.
 *
 *   2. Make the addresses work somewhere else. A link in a page is usually `/docs/install`, and a
 *      Markdown file with `/docs/install` in it is a broken link the moment it leaves the tab it
 *      was taken from.
 *
 * It takes HTML and an address rather than a live `Document` on purpose. Readability rewrites the
 * document it is given, and the document in the extension's case is somebody's open page — taking
 * a copy is the difference between a converter and a thing that edits pages while you read them.
 *
 * Browser-only, unlike its neighbours here: it needs `DOMParser`. It lives in `shared/` all the
 * same, because the app wants it as well — "paste the HTML of a page" is the same question asked
 * from a different room — and a converter that exists only inside an extension is a converter
 * nobody looks at again.
 */

export interface PageSource {
  /** The page's HTML: the whole document, or just what was selected. */
  html: string;
  /** Where it came from, so its links still point at something. */
  url: string;
  /** The tab's title, used when the page does not name itself. */
  title?: string;
  /**
   * Whether this is a selection rather than a whole page.
   *
   * A selection has already been chosen by a person, so the article-finding step is skipped: it
   * would routinely throw away a paragraph somebody had deliberately highlighted.
   */
  selection?: boolean;
}

export interface PageDocument {
  /** What to call it — the article's own title where it has one. */
  title: string;
  /** A file name for that title, extension included. */
  name: string;
  markdown: string;
  /**
   * The article as HTML, sanitised, with its own structure kept.
   *
   * Markdown is a smaller language than a web page: a figure with a caption becomes an image and a
   * paragraph, a two-level table header becomes one row, and anything the syntax has no word for is
   * flattened into text. That is the right trade for a document somebody is going to edit, and the
   * wrong one for "save this page" — so both come back, and the person choosing which to save is
   * the person who knows which they meant.
   */
  html: string;
  /**
   * Whether an article was found, or whether this is the page for want of one.
   *
   * A dashboard, a board of cards, a search result: there is no prose in them to score, so what
   * comes back is the whole body — menus, buttons and all — and it reads like a broken conversion
   * rather than like a page that was never an article. The caller can say which it got.
   */
  article: boolean;
}

/** The last readable part of an address, for a page that names itself nowhere. */
function titleFromUrl(url: string): string {
  try {
    const { hostname, pathname } = new URL(url);
    const last = pathname.split('/').filter(Boolean).pop();

    return last
      ? `${decodeURIComponent(last).replace(/[-_]+/g, ' ')} — ${hostname.replace(/^www\./, '')}`
      : hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

/** `Docs — Install & setup` becomes `docs-install-setup.md`. */
function fileName(title: string): string {
  const slug =
    title
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'page';

  return `${slug}.md`;
}

/**
 * Relative addresses, resolved against the page they came from.
 *
 * Readability does this for the article it returns; a selection never goes through Readability, and
 * the fallback for a page it cannot read does not either. Doing it on the parsed copy means the
 * converter downstream sees only absolute addresses and needs to know nothing about any of this.
 */
function absolutise(root: Document | Element, base: string) {
  const fix = (element: Element, attribute: string) => {
    const value = element.getAttribute(attribute);

    if (!value || /^[a-z][a-z0-9+.-]*:/i.test(value) || value.startsWith('#')) {
      return;
    }

    try {
      element.setAttribute(attribute, new URL(value, base).href);
    } catch {
      /* A value that is not a URL is left exactly as it was found. */
    }
  };

  for (const link of root.querySelectorAll('a[href]')) {
    fix(link, 'href');
  }

  for (const image of root.querySelectorAll('img[src]')) {
    fix(image, 'src');
  }
}

/*
 * Images that are not loaded yet, made real before anything else looks at them.
 *
 * Most of the web lazy-loads: `src` holds a one-pixel placeholder or a blurred thumbnail and the
 * address of the actual image sits in `data-src`, `data-original` or the largest candidate of a
 * `srcset`. Converted as found, that is a document whose every illustration is a grey dot — which
 * is exactly what "it saved the text and none of the pictures" looks like from the outside.
 */
function unlazy(root: Document) {
  for (const image of root.querySelectorAll('img')) {
    const source =
      image.getAttribute('data-src') ??
      image.getAttribute('data-original') ??
      image.getAttribute('data-lazy-src') ??
      widest(
        image.getAttribute('srcset') ?? image.getAttribute('data-srcset') ?? ''
      );

    const current = image.getAttribute('src') ?? '';
    const placeholder =
      !current || current.startsWith('data:') || /\bblank\.|1x1|spacer/.test(current);

    if (source && placeholder) {
      image.setAttribute('src', source);
    }

    /* A picture element's own candidates are resolved the same way, then it is just an image. */
    const picture = image.closest('picture');

    if (picture) {
      const best = widest(
        [...picture.querySelectorAll('source')]
          .map((one) => one.getAttribute('srcset') ?? '')
          .join(', ')
      );

      if (best && !image.getAttribute('src')) {
        image.setAttribute('src', best);
      }
    }

    image.removeAttribute('loading');
    image.removeAttribute('srcset');
    image.removeAttribute('sizes');
  }
}

/** The biggest candidate in a `srcset`, by the width each one declares. */
function widest(srcset: string): string {
  let best = '';
  let bestWidth = -1;

  for (const candidate of srcset.split(',')) {
    const [url, size] = candidate.trim().split(/\s+/);

    if (!url) {
      continue;
    }

    const width = size?.endsWith('w') ? Number.parseInt(size, 10) : 0;

    if (width >= bestWidth) {
      best = url;
      bestWidth = width;
    }
  }

  return best;
}

/*
 * What is never part of the document, whatever a scoring heuristic thinks of it. Readability drops
 * most of this already; a selection and the fallback path do not, and these are the tags whose text
 * is always furniture rather than prose.
 */
const FURNITURE = 'script, style, noscript, iframe, svg, form, nav, footer';

export function pageToMarkdown({
  html,
  url,
  title,
  selection,
}: PageSource): PageDocument {
  const parsed = new DOMParser().parseFromString(html, 'text/html');

  /*
   * A parsed copy has the extension's own address as its base, so `/docs` in the page would resolve
   * against `chrome-extension://…`. Declaring the real one first is what makes every later
   * resolution — Readability's included — land on the site the page came from.
   */
  const base = parsed.createElement('base');

  base.href = url;
  parsed.head.prepend(base);

  for (const node of parsed.querySelectorAll(FURNITURE)) {
    node.remove();
  }

  unlazy(parsed);

  const pageTitle = parsed.title || title || '';

  /*
   * Readability parses, or it does not. A page that is mostly an application — a dashboard, a board
   * of cards, a search result — has no article in it to find, and answering with nothing at all
   * would be worse than answering with the page. So the fallback is the body as it stands.
   */
  const found = selection
    ? null
    : new Readability(parsed.cloneNode(true) as Document, {
        charThreshold: 200,
      }).parse();

  /*
   * Whether what it found is the page, or a corner of it.
   *
   * Readability always answers if anything scores over its threshold, and on an application it
   * finds *a* block rather than none — a sidebar of labels, one card, a table of figures — and
   * hands that back as though it were the article. A dashboard came out as ninety-seven words of
   * menu, which is worse than the whole page, because the whole page at least contains the part
   * somebody wanted.
   *
   * So the answer is measured against the page it came from, and a third is the line. A written
   * article is most of the words on the page it is published on — the navigation and the footer
   * around it are not half of a news site. One section of a marketing page is a fifth of it, and
   * a fifth was passing a tenth: a landing page came back as the middle of itself, with the
   * headline it was built around missing.
   */
  const pageText = (parsed.body.textContent ?? '').replace(/\s+/g, ' ').trim();
  const articleText = (found?.textContent ?? '').replace(/\s+/g, ' ').trim();
  const article =
    found && (pageText.length < 1000 || articleText.length >= pageText.length / 3)
      ? found
      : null;

  /*
   * A name from the address when nothing else offers one, rather than the word "Page".
   *
   * `/vicgorlenko-6241s-projects/transformpipe` is not a title, but it says which page this was,
   * and it is the name the file will be saved under.
   */
  const finalTitle = (
    article?.title ||
    pageTitle ||
    title ||
    titleFromUrl(url) ||
    'Page'
  ).trim();

  /*
   * Readability resolves addresses itself; the other two paths — a selection, and a page it could
   * not read — do not, so they are resolved here before anything reads the markup. Both halves of
   * the answer come off the same string for that reason: the Markdown and the HTML cannot disagree
   * about where an image lives.
   */
  if (!article) {
    absolutise(parsed, url);
  }

  const body = article?.content ?? parsed.body.innerHTML;
  const converted = htmlToMarkdown(body).trim();

  /*
   * The title as a heading, unless the article already starts with one.
   *
   * A clipped page with no `#` at the top is a document whose name lives only in its file name, and
   * the file name is the first thing lost when somebody pastes the text somewhere else.
   */
  const markdown =
    selection || /^#\s/.test(converted)
      ? converted
      : `# ${finalTitle}\n\n${converted}`;

  /*
   * The HTML half, sanitised with the same allow-list the rest of the product uses plus the four
   * tags a page has and a converted document does not. It is foreign HTML from somebody else's
   * site; it is never inserted into a page of ours without going through this.
   */
  const sanitised = DOMPurify.sanitize(body, {
    ALLOWED_TAGS: [...ALLOWED_TAGS, 'figure', 'figcaption', 'picture', 'source'],
    ALLOWED_ATTR: [...ALLOWED_ATTR, 'srcset', 'width', 'height', 'loading'],
  });

  return {
    title: finalTitle,
    name: fileName(finalTitle),
    markdown,
    html: sanitised,
    /* A selection is a person's own choice of what the document is, so it counts as one. */
    article: Boolean(article) || Boolean(selection),
  };
}
