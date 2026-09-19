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
  function asItReads(root: Element): HTMLElement {
    const copy = root.cloneNode(true) as HTMLElement;
    const living = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
    const twin = document.createTreeWalker(copy, NodeFilter.SHOW_ELEMENT);
    const hidden: Element[] = [];
    /*
     * Structural edits, held back until the walk is over.
     *
     * The two walkers step through matching trees and only text nodes may be inserted while they
     * do — an element put into one of them shifts the sequence the other is reading, and every
     * element after that point is measured against the wrong one. The shadow content below was
     * spliced in during the walk at first, and everything after the first web component on the
     * page stopped being classified correctly.
     */
    const swaps: { mirror: Element; with: Node[]; inside?: boolean }[] = [];

    /*
     * One element and its copy, considered. Named rather than inlined because the root has to go
     * through it too: a TreeWalker's first `nextNode` is the root's first descendant, so a walk
     * alone never looks at the node it was given — and the recursion below hands this function a
     * single `<slot>` or a shadow child and means that node, not merely what is under it.
     */
    const consider = (element: Element, mirror: Element) => {
      const style = getComputedStyle(element);

      /*
       * `contents` draws no box of its own and its children draw theirs, so it is neither hidden
       * nor spaced — the walk passes straight through it.
       */
      if (style.display === 'contents') return;

      /*
       * The options of a closed menu draw no box at all, and they are not hidden in the sense this
       * is testing for: they are the answers a form is offering, and the one chosen is text on the
       * screen. So the test is skipped for them, and which is selected is recorded below.
       */
      const formChoice =
        element instanceof HTMLOptionElement ||
        element instanceof HTMLOptGroupElement;

      /*
       * Three tests, and not a fourth.
       *
       * `getClientRects().length === 0` was the fourth, and it was wrong about containers: an
       * element can be perfectly visible and generate no box of its own — `content-visibility`
       * skips one, a scroll container can suppress one — and dropping it takes everything under
       * it. A settings page came back as seven words because of it.
       *
       * What is left is safe for a subtree rather than merely true of the element: `display: none`
       * is not rendered at all and no descendant can undo it, and `opacity: 0` multiplies through
       * a stacking context so a fully opaque child of it is still invisible. `visibility` a
       * descendant can undo, which is the one imperfection here, and it is rare enough to be worth
       * the words it would take to check.
       */
      if (
        !formChoice &&
        (style.display === 'none' ||
          style.visibility === 'hidden' ||
          style.visibility === 'collapse' ||
          style.opacity === '0')
      ) {
        /*
         * Collected rather than removed here: the two walkers are stepping through matching trees
         * and taking a node out from under one of them ends the correspondence. Removing an
         * ancestor later takes its descendants with it, so the repeats cost nothing.
         */
        hidden.push(mirror);

        return;
      }

      /*
       * What somebody typed, rather than what the page was served with.
       *
       * A field's `value` is a property; the attribute keeps whatever the markup said. Serialising
       * the DOM therefore hands back an empty search box and a form with none of the answers in
       * it, which on a page somebody filled in is the part they wanted.
       */
      if (element instanceof HTMLInputElement) {
        const twinInput = mirror as HTMLInputElement;

        if (element.type === 'checkbox' || element.type === 'radio') {
          if (element.checked) twinInput.setAttribute('checked', '');
          else twinInput.removeAttribute('checked');
        } else {
          twinInput.setAttribute('value', element.value);
        }
      } else if (element instanceof HTMLTextAreaElement) {
        mirror.textContent = element.value;
      } else if (element instanceof HTMLOptionElement) {
        if (element.selected) mirror.setAttribute('selected', '');
        else mirror.removeAttribute('selected');
      }

      /*
       * A slot stands for the light-DOM nodes a component was given. In a clone it stands for
       * nothing, so the nodes it is showing are put in its place — which is what the screen shows.
       */
      if (element instanceof HTMLSlotElement) {
        swaps.push({
          mirror,
          with: element
            .assignedNodes({ flatten: true })
            .map((node) =>
              node.nodeType === Node.ELEMENT_NODE
                ? asItReads(node as Element)
                : node.cloneNode(true)
            ),
        });

        return;
      }

      /*
       * A shadow root is where a web component's markup actually lives, and `outerHTML` does not
       * reach into one: a page built out of custom elements serialises as a list of empty tags. So
       * the shadow tree is read the same way this one is and takes the host's place — the light
       * children go with it, because the slots above put back whichever of them are on screen.
       */
      if (element.shadowRoot) {
        swaps.push({
          mirror,
          with: [...element.shadowRoot.childNodes].flatMap(expand),
          inside: true,
        });
      }

      /*
       * `::before` and `::after` are text on the screen and nowhere in the markup — a "Warning:"
       * in front of a message, the numbering of a step. Kept only when the content is a plain
       * string with a letter or a digit in it, which is what separates a label from the private-use
       * glyph an icon font puts there.
       */
      for (const side of ['::before', '::after'] as const) {
        const generated = getComputedStyle(element, side).content;
        const text =
          generated && /^"(.*)"$/s.test(generated)
            ? generated.slice(1, -1).replace(/\\"/g, '"')
            : '';

        if (!/[\p{L}\p{N}]/u.test(text)) continue;

        const node = document.createTextNode(text);

        if (side === '::before') mirror.prepend(node);
        else mirror.append(node);
      }

      mirror.after(document.createTextNode(' '));
    };

    consider(root, copy);

    while (living.nextNode() && twin.nextNode()) {
      consider(living.currentNode as Element, twin.currentNode as Element);
    }

    for (const swap of swaps) {
      if (swap.inside) swap.mirror.replaceChildren(...swap.with);
      else swap.mirror.replaceWith(...swap.with);
    }

    /*
     * The removals, unless they would empty the document.
     *
     * Deciding what is on the screen is a judgement, and a judgement that takes a page down to
     * nothing is wrong whatever its reasoning — a page mid-animation, a framework that fades a
     * route in, a shape nobody here anticipated. Measuring before and after costs one pass over
     * the text and makes the whole filter fail towards showing too much, which is recoverable,
     * rather than towards showing nothing, which is not.
     */
    const whole = readable(copy);
    /* Kept with every other repair in it, so falling back is not also falling back to glued text. */
    const unfiltered = copy.cloneNode(true) as HTMLElement;

    for (const node of hidden) {
      node.remove();
    }

    if (whole > 400 && readable(copy) < whole / 10) {
      return unfiltered;
    }

    return copy;
  }

  /**
   * How much of this is words, for the measurement the fail-safe makes.
   *
   * `textContent` would do it in one property read and count the wrong thing: the source of every
   * script and the body of every stylesheet, which on a modern page outweighs the prose and would
   * let a page of nothing but embedded JSON look full while its visible half was thrown away.
   */
  function readable(node: Node): number {
    const walk = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    let total = 0;

    while (walk.nextNode()) {
      const parent = walk.currentNode.parentElement?.localName ?? '';

      if (
        parent === 'script' ||
        parent === 'style' ||
        parent === 'noscript' ||
        parent === 'template'
      ) {
        continue;
      }

      total += (walk.currentNode.textContent ?? '').trim().length;
    }

    return total;
  }

  /**
   * A node of a shadow tree, read, with any slot at the top of it filled in.
   *
   * The slot is handled here rather than left to `asItReads` for one reason: a slot that is the
   * root of its own read has no parent to be replaced within, so the substitution there would be
   * a `replaceWith` on a detached node — which does nothing, silently, and loses whatever the
   * component was given. A slot deeper inside a shadow tree has a parent and goes the usual way.
   */
  function expand(node: Node): Node[] {
    if (node.nodeType !== Node.ELEMENT_NODE) return [node.cloneNode(true)];

    const element = node as Element;

    if (element instanceof HTMLSlotElement) {
      return element.assignedNodes({ flatten: true }).flatMap(expand);
    }

    return [asItReads(element)];
  }

  const selection = window.getSelection();
  const hasSelection =
    selection !== null && !selection.isCollapsed && selection.rangeCount > 0;

  if (hasSelection) {
    const holder = document.createElement('div');

    for (let index = 0; index < selection.rangeCount; index++) {
      holder.append(selection.getRangeAt(index).cloneContents());
    }

    /*
     * The same spacing applied to a selection, and without touching the page to get it.
     *
     * A range is cloned out of the document, so the copy has none of the page's layout attached
     * and two cells of a div-table arrive glued together exactly as they did for a whole page.
     * Measuring the copy would mean putting it in the document first, and this file's promise is
     * that reading a page changes nothing in it.
     *
     * So the live elements the range covers are listed in document order beside the copies, which
     * `cloneContents` produces in the same order, and each copy is spaced according to the element
     * it came from. The ancestors the range merely passes through are not in the copy, so they are
     * left out of the list; if the two still fail to line up, nothing is done rather than
     * something wrong.
     *
     * Only spacing. What is hidden inside a selection stays: a person drew a line around this, and
     * second-guessing that is not the same problem as deciding what a page is.
     */
    const live: Element[] = [];

    for (let index = 0; index < selection.rangeCount; index++) {
      const range = selection.getRangeAt(index);
      const around = range.commonAncestorContainer;
      const from =
        around.nodeType === Node.ELEMENT_NODE
          ? (around as Element)
          : around.parentElement;

      if (!from) continue;

      const walk = document.createTreeWalker(from, NodeFilter.SHOW_ELEMENT);

      while (walk.nextNode()) {
        const element = walk.currentNode as Element;

        if (range.intersectsNode(element) && !element.contains(around)) {
          live.push(element);
        }
      }
    }

    const copies = [...holder.querySelectorAll('*')];

    if (copies.length === live.length) {
      for (const [at, mirror] of copies.entries()) {
        const display = getComputedStyle(live[at]).display;

        if (display !== 'inline' && display !== 'contents') {
          mirror.after(document.createTextNode(' '));
        }
      }
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
