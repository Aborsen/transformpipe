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
  /**
   * Puts back the spaces that CSS was providing.
   *
   * `<span>39</span><span>words</span>` laid out side by side reads as "39 words" on the screen and
   * serialises as `39words`: the gap between them is a layout property and there is no whitespace
   * in the markup at all. Every converter downstream of this — ours included — sees the string, not
   * the page, so the words arrive glued together. It is not a rare shape either; it is what a row
   * of stats, a tag list, a breadcrumb trail or a table built out of divs looks like in any current
   * framework.
   *
   * The test is the element's own display, and everything that is not `inline` gets a space after
   * it. The first version asked whether the *parent* was flex or grid, which covered the common
   * case and missed the one that matters most: a header row of a div-table, where the cells are
   * blocks inside something laid out another way, arrived as `TimeMethodStatusHostRequestMessage`.
   * Anything that generates a box of its own is separated from its neighbour on screen, so a space
   * after it is what the page already means.
   *
   * The one place that can tell is here, inside the page, where `getComputedStyle` still exists. So
   * the document is cloned first and the clone is walked beside the living one.
   *
   * The walkers stay in step because only text nodes are inserted and the walkers see elements, so
   * the sequence one is reading does not change under it.
   *
   * Declared in here rather than beside `extract`, and that is not style: `executeScript` takes
   * this one function, stringifies it and evaluates the string in the page. A helper in the module
   * around it exists in the extension's world and nowhere the page can reach — it would be a
   * ReferenceError at the top of every conversion.
   */
  function withLayoutSpacing(root: HTMLElement): HTMLElement {
    const copy = root.cloneNode(true) as HTMLElement;
    const living = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
    const twin = document.createTreeWalker(copy, NodeFilter.SHOW_ELEMENT);

    while (living.nextNode() && twin.nextNode()) {
      const display = getComputedStyle(living.currentNode as Element).display;

      if (display === 'inline' || display === 'none' || display === 'contents') {
        continue;
      }

      (twin.currentNode as Element).after(document.createTextNode(' '));
    }

    return copy;
  }

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
    html: withLayoutSpacing(document.documentElement).outerHTML,
    url: document.location.href,
    title: document.title,
    selection: false,
  };
}
