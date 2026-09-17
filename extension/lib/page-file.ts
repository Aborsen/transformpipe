import type { PageDocument } from '@shared/from-page';
import { buildStandaloneHtml } from '@shared/markdown';
import { markdownToHtml } from '@/lib/markdown';
import { snapshot } from '../snapshot';

/*
 * Saving a page as HTML, the two ways somebody can mean it.
 *
 * **As it looks** is a snapshot: the live document with its stylesheets, images and fonts carried
 * inside the file. It is what a browser's own "save page" would produce if it wrote one file, and
 * it is the answer for anything that is not an article — a landing page has no prose to extract, so
 * converting it gives you its words in a column with none of its design. See `snapshot.ts`.
 *
 * **The article** is what the rest of this product does: find the prose, convert it, render it in
 * the document stylesheet the site and the exported file both use. Headings, lists, tables and code
 * survive; the page's own layout does not, which is the point — it is the version somebody is going
 * to read or edit rather than archive.
 *
 * The second goes through `buildStandaloneHtml`, so it is one file with its styles inline and no
 * requests of any kind. The first is already one file, for the same reason.
 */

/** How much of a page is worth carrying inside it. */
const MAX_IMAGE = 2 * 1024 * 1024;
const MAX_TOTAL = 12 * 1024 * 1024;

/**
 * Fetches images from inside the tab that is showing them, and answers with data URIs.
 *
 * It runs in the page rather than in the extension for two reasons, and the second is the one that
 * matters: the page's own cache almost certainly has these bytes already, and the page is the only
 * context allowed to ask for them without this extension holding permission for every site on the
 * web. `activeTab` covers the tab somebody just pressed the button on, and nothing else.
 *
 * Serialised into that page, so it closes over nothing.
 */
function fetchImages(urls: string[], maxImage: number, maxTotal: number) {
  const read = async (url: string): Promise<[string, string] | null> => {
    try {
      const response = await fetch(url, { credentials: 'include' });

      if (!response.ok) {
        return null;
      }

      const blob = await response.blob();

      if (blob.size > maxImage || !blob.type.startsWith('image/')) {
        return null;
      }

      const data: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
      });

      return [url, data];
    } catch {
      return null;
    }
  };

  return Promise.all(urls.map(read)).then((results) => {
    const found: Record<string, string> = {};
    let total = 0;

    for (const result of results) {
      if (!result) {
        continue;
      }

      total += result[1].length;

      if (total > maxTotal) {
        break;
      }

      found[result[0]] = result[1];
    }

    return found;
  });
}

/**
 * The article's own HTML with its pictures inside it.
 *
 * An image that cannot be fetched keeps its address — a file with one remote picture is better than
 * a file with a hole in it, and the addresses are absolute by the time they get here.
 */
async function withImages(html: string, tabId?: number): Promise<string> {
  if (tabId === undefined) {
    return html;
  }

  const parsed = new DOMParser().parseFromString(html, 'text/html');
  const images = [...parsed.querySelectorAll('img[src]')];
  const urls = [
    ...new Set(
      images
        .map((image) => image.getAttribute('src') ?? '')
        .filter((url) => /^https?:\/\//i.test(url))
    ),
  ];

  if (urls.length === 0) {
    return html;
  }

  try {
    const [result] = await chrome.scripting.executeScript({
      target: { tabId },
      func: fetchImages,
      args: [urls, MAX_IMAGE, MAX_TOTAL],
    });

    const found = (result?.result ?? {}) as Record<string, string>;

    for (const image of images) {
      const source = image.getAttribute('src') ?? '';

      if (found[source]) {
        image.setAttribute('src', found[source]);
      }
    }
  } catch {
    /* No pictures carried is the old behaviour, not a failure worth stopping a download for. */
  }

  return parsed.body.innerHTML;
}

export type HtmlFlavour = 'snapshot' | 'article';

/** What a snapshot may weigh before it stops carrying things. */
const MAX_ASSET = 4 * 1024 * 1024;
const MAX_SNAPSHOT = 24 * 1024 * 1024;

/**
 * The file itself. `tabId` is what makes pictures possible, so the viewer — which has no tab to ask
 * — gets the page's structure with its images still as addresses, and the popup gets both.
 */
export async function pageHtmlFile(
  document_: PageDocument,
  flavour: HtmlFlavour,
  theme: 'dark' | 'light',
  tabId?: number
): Promise<string> {
  /*
   * A snapshot has to be taken from the tab; there is nothing in a converted document to rebuild it
   * from. Asked for without one — in the viewer, where the page is long gone — the article is the
   * honest answer rather than an error about a tab nobody mentioned.
   */
  if (flavour === 'snapshot' && tabId !== undefined) {
    const [result] = await chrome.scripting.executeScript({
      target: { tabId },
      func: snapshot,
      args: [MAX_ASSET, MAX_SNAPSHOT],
    });

    const taken = result?.result as { html: string } | undefined;

    if (taken?.html) {
      return taken.html;
    }
  }

  const body = document_.html
    ? await withImages(document_.html, tabId)
    : markdownToHtml(document_.markdown);

  return buildStandaloneHtml({ title: document_.title, body, theme });
}
