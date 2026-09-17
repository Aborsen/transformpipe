import type { PageDocument } from '@shared/from-page';
import { buildStandaloneHtml } from '@shared/markdown';
import { markdownToHtml } from '@/lib/markdown';

/*
 * Saving a page as HTML, the two ways somebody can mean it.
 *
 * **Text** is what the rest of this product does: the page converted to Markdown and rendered back
 * as a clean document. Headings, lists, tables and code survive; a figure becomes an image and a
 * caption, a two-level table header becomes one row, and everything the syntax has no word for is
 * flattened. It is the version somebody is going to edit.
 *
 * **The page** keeps the article's own markup — figures with their captions, nested tables, the
 * structure as it was written — and embeds the pictures in the file itself, so what is saved still
 * has its illustrations next year, on a machine with no network, after the site has reorganised its
 * media folder. That last part is the whole point: a saved page whose images are still addresses on
 * somebody else's server is a saved page that quietly empties out.
 *
 * Both go through `buildStandaloneHtml`, so both are one file with its styles inline and no
 * requests of any kind — the same promise the download on the site makes.
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
async function withImages(html: string, tabId: number): Promise<string> {
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

export type HtmlFlavour = 'page' | 'text';

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
  const body =
    flavour === 'text' || !document_.html
      ? markdownToHtml(document_.markdown)
      : tabId
        ? await withImages(document_.html, tabId)
        : document_.html;

  return buildStandaloneHtml({ title: document_.title, body, theme });
}
