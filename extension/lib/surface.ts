/*
 * Which panel the toolbar button opens, and remembering it.
 *
 * Chrome shows the popup whenever the action has one, so the two surfaces are exclusive and the
 * switch is a runtime call rather than a build: clearing the popup is what lets a click open the
 * side panel. Neither `setPopup` nor `setPanelBehavior` survives a browser restart, so the choice
 * lives in storage and the service worker applies it — on install, on startup, and whenever it
 * changes here.
 *
 * It is written by the two icons that switch surfaces rather than by a settings page, because that
 * is where somebody making the choice already is: pressing "open in the side panel" is the whole
 * statement, and having to say it again in a preference screen is the kind of thing that makes a
 * person press the icon twice.
 */
export type Surface = 'popup' | 'panel';

export const SURFACE_KEY = 'tp.surface';

export async function storedSurface(): Promise<Surface> {
  const stored = await chrome.storage.local.get(SURFACE_KEY);

  return stored[SURFACE_KEY] === 'panel' ? 'panel' : 'popup';
}

/** Remembers the choice. The worker is listening for this and applies it. */
export async function chooseSurface(surface: Surface) {
  await chrome.storage.local.set({ [SURFACE_KEY]: surface });
}

/** What the choice means to the browser, applied wherever it can be. */
export async function applySurface(surface: Surface) {
  await chrome.sidePanel.setPanelBehavior({
    openPanelOnActionClick: surface === 'panel',
  });
  await chrome.action.setPopup({
    popup: surface === 'panel' ? '' : 'popup.html',
  });
}
