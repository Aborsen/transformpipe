import { extract } from './extract';
import { openInViewer } from './lib/clipboard';
import { closePanelForTab, opensPanelByClick, openPanel } from './lib/panel';
import { applySurface, storedSurface, SURFACE_KEY } from './lib/surface';

/*
 * The service worker: two entries in a right-click menu, and nothing else.
 *
 * There is no state here and no long-lived connection. Manifest V3 stops this worker whenever it is
 * idle, which is the right shape for what it does — a menu is registered once on install, and each
 * click starts the same work the popup does and then lets the worker go back to sleep.
 *
 * The conversion itself does not happen here. A worker has no DOM, and `from-page.ts` needs one to
 * read a page with; the viewer is a page, so the worker's job is to open it with the raw material
 * and step out of the way.
 */
const MENU_PAGE = 'tp-convert-page';
const MENU_SELECTION = 'tp-convert-selection';

/*
 * Closing the side panel, which the panel cannot reliably do for itself.
 *
 * `window.close()` is the documented way and it does not always take — so the panel asks for this
 * as well: disabling the panel for a tab closes it, and it is enabled again immediately so the
 * next press of the icon opens it. Then the compact panel is opened in its place, which is what
 * somebody leaving the side panel is asking for; `openPopup` is recent enough to be worth guarding.
 */
/* The remembered surface, put back after every restart and whenever it changes. */
const restoreSurface = async () => applySurface(await storedSurface());

chrome.runtime.onStartup.addListener(() => void restoreSurface());

/*
 * Where the browser has no "open the panel instead of the popup" setting, an empty popup sends the
 * click here instead — and a click is the gesture opening a sidebar requires. In Chrome this
 * listener is never registered: the behaviour flag handles it and the click never arrives.
 */
if (opensPanelByClick) {
  chrome.action.onClicked.addListener((tab) => void openPanel(tab.windowId));
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && SURFACE_KEY in changes) {
    void restoreSurface();
  }
});

chrome.runtime.onMessage.addListener((message, _sender, respond) => {
  if (message?.type !== 'tp-close-panel') {
    return;
  }

  void (async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab?.id !== undefined) {
      await closePanelForTab(tab.id);
    }

    /*
     * No attempt to open the compact panel from here. `chrome.action.openPopup` wants a gesture
     * the worker does not have and refuses about half the time, which is exactly the "sometimes it
     * works" this replaced: the choice is stored instead, so the next press of the button — and
     * every press after it — opens the one that was asked for.
     */

    respond?.({ closed: true });
  })();

  return true;
});

chrome.runtime.onInstalled.addListener(() => {
  void restoreSurface();

  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: MENU_PAGE,
      title: 'Convert this page to Markdown',
      contexts: ['page'],
    });

    chrome.contextMenus.create({
      id: MENU_SELECTION,
      title: 'Convert selection to Markdown',
      contexts: ['selection'],
    });
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab?.id || (info.menuItemId !== MENU_PAGE && info.menuItemId !== MENU_SELECTION)) {
    return;
  }

  const [result] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: extract,
  });

  const page = result?.result;

  if (!page?.html) {
    return;
  }

  /*
   * Handed over raw: the worker cannot convert it, so the viewer is given the page and does both
   * halves itself. `from-page.ts` runs once, in the place that has a DOM to run it in.
   */
  await openInViewer({
    title: page.title,
    name: 'page.md',
    markdown: '',
    source: page,
  });
});
