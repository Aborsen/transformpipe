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
   * The page as it reads: what is on the screen, with the spaces CSS was providing.
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
   * The second job is dropping what is not on the screen, and it is the one that matters more. An
   * application does not throw a screen away when you leave it: the route you came from stays
   * mounted and hidden, the dialog you closed is still there, the menu that is shut is markup.
   * Reading the document gets all of them at once — a dashboard came back as its overview, its
   * logs and its deployments in one pile, under whichever title was set first, and no amount of
   * listening for navigation fixes that, because every one of those screens really is in the page.
   *
   * The one place that can tell is here, inside the page, where `getComputedStyle` and
   * `getClientRects` still exist. So the document is cloned first and the clone is walked beside
   * the living one: what draws nothing is taken out, and what draws a box gets its space.
   *
   * The walkers stay in step because only text nodes are inserted and the walkers see elements, so
   * the sequence one is reading does not change under it.
   *
   * Declared in here rather than beside `extract`, and that is not style: `executeScript` takes
   * this one function, stringifies it and evaluates the string in the page. A helper in the module
   * around it exists in the extension's world and nowhere the page can reach — it would be a
   * ReferenceError at the top of every conversion.
   */
  function asItReads(root: HTMLElement): HTMLElement {
    const copy = root.cloneNode(true) as HTMLElement;
    const living = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
    const twin = document.createTreeWalker(copy, NodeFilter.SHOW_ELEMENT);
    const hidden: Element[] = [];

    while (living.nextNode() && twin.nextNode()) {
      const element = living.currentNode as Element;
      const style = getComputedStyle(element);
      const mirror = twin.currentNode as Element;

      /*
       * `contents` draws no box of its own and its children draw theirs, so it is neither hidden
       * nor spaced — the walk passes straight through it.
       */
      if (style.display === 'contents') continue;

      if (
        style.display === 'none' ||
        style.visibility === 'hidden' ||
        style.visibility === 'collapse' ||
        style.opacity === '0' ||
        element.getClientRects().length === 0
      ) {
        /*
         * Collected rather than removed here: the two walkers are stepping through matching trees
         * and taking a node out from under one of them ends the correspondence. Removing an
         * ancestor later takes its descendants with it, so the repeats cost nothing.
         */
        hidden.push(mirror);
        continue;
      }

      mirror.after(document.createTextNode(' '));
    }

    for (const node of hidden) {
      node.remove();
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
    html: asItReads(document.documentElement).outerHTML,
    url: document.location.href,
    title: document.title,
    selection: false,
  };
}
