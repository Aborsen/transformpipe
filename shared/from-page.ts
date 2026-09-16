import { Readability } from '@mozilla/readability';
import { htmlToMarkdown } from './from-html.js';

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

  const pageTitle = parsed.title || title || '';

  /*
   * Readability parses, or it does not. A page that is mostly an application — a dashboard, a board
   * of cards, a search result — has no article in it to find, and answering with nothing at all
   * would be worse than answering with the page. So the fallback is the body as it stands.
   */
  const article = selection
    ? null
    : new Readability(parsed.cloneNode(true) as Document, {
        charThreshold: 200,
      }).parse();

  const body = article?.content ?? parsed.body.innerHTML;
  const finalTitle = (article?.title || pageTitle || title || 'Page').trim();

  if (!article) {
    absolutise(parsed, url);
  }

  const converted = htmlToMarkdown(
    article ? body : parsed.body.innerHTML
  ).trim();

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

  return {
    title: finalTitle,
    name: fileName(finalTitle),
    markdown,
  };
}
