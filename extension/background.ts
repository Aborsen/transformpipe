import { extract } from './extract';
import { openInViewer } from './lib/clipboard';

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
chrome.runtime.onMessage.addListener((message, _sender, respond) => {
  if (message?.type !== 'tp-close-panel') {
    return;
  }

  void (async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab?.id !== undefined) {
      await chrome.sidePanel.setOptions({ tabId: tab.id, enabled: false });
      await chrome.sidePanel.setOptions({
        tabId: tab.id,
        path: 'panel.html',
        enabled: true,
      });
    }

    if (message.thenPopup) {
      try {
        await chrome.action.openPopup();
      } catch {
        /* Older Chrome: the panel is closed, and the toolbar button is one click away. */
      }
    }

    respond?.({ closed: true });
  })();

  return true;
});

chrome.runtime.onInstalled.addListener(() => {
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
