/*
 * The panel beside the page, in the two browsers that have one and do not agree about it.
 *
 * Chrome has `chrome.sidePanel`: a panel per tab, opened by the extension, with a behaviour flag
 * that makes the toolbar button open it instead of the popup. Firefox has `browser.sidebarAction`:
 * one sidebar per window, declared in the manifest as `sidebar_action`, opened and closed by the
 * extension and by the browser's own sidebar switcher. Neither API is a superset of the other and
 * neither exists in the other browser, so every call to either is in this file.
 *
 * The rest of the extension asks for what it wants — open the panel, close it, make the button
 * open this one — and does not know which browser it is in. That is the whole Firefox port: one
 * manifest that differs in three keys (see `vite.extension.config.ts`) and this file.
 */

/** Firefox's sidebar, as much of it as is used here. Undefined in Chrome. */
interface SidebarAction {
  open: () => Promise<void>;
  close: () => Promise<void>;
}

const sidebar = (
  globalThis as { browser?: { sidebarAction?: SidebarAction } }
).browser?.sidebarAction;

/** Chrome's, which is absent in Firefox — and in a Chrome older than 114, which the manifest bars. */
const panel = (chrome as { sidePanel?: typeof chrome.sidePanel }).sidePanel;

/**
 * Opens it.
 *
 * Both browsers want a user gesture for this, which is why it is called from a click and never
 * from the worker waking up.
 */
export async function openPanel(windowId?: number): Promise<void> {
  if (sidebar) {
    await sidebar.open();

    return;
  }

  /* One of the two is required, and the window is what a click from the popup knows. */
  if (windowId !== undefined) {
    await panel?.open({ windowId });
  }
}

/**
 * Closes it, from inside the panel.
 *
 * Firefox lets the sidebar close itself and means it. Chrome's `window.close()` in a side panel
 * document works sometimes, so the worker is asked as well — disabling the panel for the tab and
 * enabling it again always closes it, and leaves it ready for the next press of the button.
 */
export async function closePanel(): Promise<void> {
  if (sidebar) {
    await sidebar.close();

    return;
  }

  void chrome.runtime.sendMessage({ type: 'tp-close-panel' });
  window.close();
}

/** The worker's half of that, and a no-op where the panel closes itself. */
export async function closePanelForTab(tabId: number): Promise<void> {
  if (!panel) {
    return;
  }

  await panel.setOptions({ tabId, enabled: false });
  await panel.setOptions({ tabId, path: 'panel.html', enabled: true });
}

/**
 * Which surface the toolbar button opens.
 *
 * Chrome answers this with a behaviour flag; Firefox has no such flag, so an empty popup means the
 * click reaches `action.onClicked`, and the worker opens the sidebar from there — which is a
 * gesture, and allowed.
 */
export async function applyPanelBehavior(opensPanel: boolean): Promise<void> {
  await panel?.setPanelBehavior({ openPanelOnActionClick: opensPanel });
}

/** True where a click on the toolbar button has to be turned into an open sidebar by hand. */
export const opensPanelByClick = !panel && Boolean(sidebar);
