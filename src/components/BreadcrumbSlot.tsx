import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

interface Slot {
  /** Where a trail should render, once the header has mounted the strip. */
  node: HTMLElement | null;
  /** The header, handing over the element it made for the purpose. */
  setNode: (node: HTMLElement | null) => void;
  /** Whether anything is currently rendering into it, so the strip can stay out of the way. */
  filled: boolean;
  /** Called by a trail on mount; the returned function releases it again. */
  claim: () => () => void;
}

const SlotContext = createContext<Slot | null>(null);

/**
 * One place for the breadcrumb trail, filled from wherever the page happens to render it.
 *
 * The trail belongs to the page: every view builds its own from `src/lib/breadcrumbs.ts`, and the
 * article pages build theirs from the article. It now has to appear in the bar at the top of the
 * app instead of above the heading, and the honest way to do that is not to lift seven trails into
 * `App` and pass them back down — it is to leave each page rendering its own and move where that
 * lands. So the header mounts an empty strip, puts it here, and `AppBreadcrumbs` portals into it.
 *
 * `filled` is why this is a context rather than a ref. A page with no trail — the history, for one —
 * would otherwise leave an empty bordered strip under the bar, and an element that is empty is not
 * something CSS can reliably hide across the browsers this has to work in.
 */
export function BreadcrumbSlotProvider({ children }: { children: ReactNode }) {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [claims, setClaims] = useState(0);

  const claim = useCallback(() => {
    setClaims((count) => count + 1);

    return () => setClaims((count) => count - 1);
  }, []);

  const value = useMemo<Slot>(
    () => ({ node, setNode, filled: claims > 0, claim }),
    [node, claims, claim]
  );

  return <SlotContext.Provider value={value}>{children}</SlotContext.Provider>;
}

export function useBreadcrumbSlot(): Slot | null {
  return useContext(SlotContext);
}
