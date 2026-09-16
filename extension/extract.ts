/*
 * The one piece of code that runs inside somebody else's page.
 *
 * It is injected by `chrome.scripting.executeScript` when the toolbar button is pressed, which is
 * what `activeTab` allows and the reason this extension asks for no host permissions: there is no
 * content script sitting in every tab, and nothing runs anywhere until a person presses a button.
 *
 * It must stand alone. The function is serialised and evaluated in the page's own world, so it
 * cannot close over an import, a constant from another module, or anything this file does not
 * declare inside it — which is also why it returns strings rather than nodes: what crosses back is
 * JSON, and a DOM node is not.
 *
 * It reads and returns. Nothing in the page is changed, including when a selection is involved:
 * the fragment is cloned out of the range rather than lifted from the document.
 */
export interface Extracted {
  html: string;
  url: string;
  title: string;
  selection: boolean;
}

export function extract(): Extracted {
  const selection = window.getSelection();
  const hasSelection =
    selection !== null && !selection.isCollapsed && selection.rangeCount > 0;

  if (hasSelection) {
    const holder = document.createElement('div');

    for (let index = 0; index < selection.rangeCount; index++) {
      holder.append(selection.getRangeAt(index).cloneContents());
    }

    return {
      html: holder.innerHTML,
      url: document.location.href,
      title: document.title,
      selection: true,
    };
  }

  return {
    html: document.documentElement.outerHTML,
    url: document.location.href,
    title: document.title,
    selection: false,
  };
}
