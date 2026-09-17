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
 * Which surface the toolbar button opens, restored on every start.
 *
 * `chrome.action.setPopup` is not remembered across browser restarts, so the choice lives in
 * storage and is applied here — clearing the popup is what lets a click open the side panel
 * instead, because an action with a popup always shows the popup.
 */
async function applySurface() {
  const stored = await chrome.storage.local.get('tp.panel');
  const asPanel = Boolean(stored['tp.panel']);

  await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: asPanel });
  await chrome.action.setPopup({ popup: asPanel ? '' : 'popup.html' });
}

chrome.runtime.onStartup.addListener(() => void applySurface());
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && 'tp.panel' in changes) {
    void applySurface();
  }
});

chrome.runtime.onInstalled.addListener(() => {
  void applySurface();

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
