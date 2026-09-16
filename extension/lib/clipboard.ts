/*
 * What the two pages of this extension share, and it is deliberately almost nothing.
 *
 * Everything a converted document needs — the conversions, the preview, the stats, the downloads,
 * the words — is imported from the app itself. What is left here is the three things that only make
 * sense inside an extension: getting text onto the clipboard from a popup, handing a document from
 * the popup to the viewer, and finding out what tab we were opened over.
 */
import type { PageDocument, PageSource } from '@shared/from-page';

/**
 * What is waiting in memory for the viewer to pick up.
 *
 * Either a document that is already converted — the popup did it and the viewer is only showing it
 * bigger — or the raw page, from the right-click menu: the service worker that handles that click
 * has no DOM to convert with, so it hands over what it read and the viewer does both halves.
 */
export interface Handoff extends Partial<PageDocument> {
  source?: PageSource;
}

const HANDOFF_KEY = 'tp.handoff';

/**
 * The popup and the viewer are two pages, and a converted document has to cross between them.
 *
 * `chrome.storage.session` is memory: it lives as long as the browser is open and is never written
 * to disk. A document somebody converted from a page they are signed into has no business being
 * persisted by us on the way to being shown, and `local` would do exactly that.
 */
export async function putHandoff(id: string, document: Handoff) {
  await chrome.storage.session.set({ [`${HANDOFF_KEY}.${id}`]: document });
}

export async function takeHandoff(id: string): Promise<Handoff | null> {
  const key = `${HANDOFF_KEY}.${id}`;
  const stored = await chrome.storage.session.get(key);
  const found = stored[key] as Handoff | undefined;

  /* Read once. A reload of the viewer keeps what React already has rather than a stale copy. */
  await chrome.storage.session.remove(key);

  return found ?? null;
}

/** Opens the viewer on a document that is already converted. */
export async function openInViewer(document: Handoff) {
  const id = Math.random().toString(36).slice(2, 10);

  await putHandoff(id, document);
  await chrome.tabs.create({
    url: chrome.runtime.getURL(`viewer.html?doc=${id}`),
  });
}

/** Opens the viewer with nothing in it, which is where the file picker lives. */
export async function openViewerForFiles() {
  await chrome.tabs.create({ url: chrome.runtime.getURL('viewer.html?open=1') });
}

/**
 * `navigator.clipboard.writeText` needs a focused document, and a popup that is closing is not one.
 * The fallback is the old way, which works in a page that is still on screen.
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);

    return true;
  } catch {
    try {
      const area = document.createElement('textarea');

      area.value = text;
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.append(area);
      area.select();

      const copied = document.execCommand('copy');

      area.remove();

      return copied;
    } catch {
      return false;
    }
  }
}
