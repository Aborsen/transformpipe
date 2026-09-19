import { mdDocVars } from '@shared/md-doc-css';
import DOMPurify from 'dompurify';

/*
 * The half of a ```mermaid fence that needs a browser.
 *
 * `shared/markdown.ts` leaves such a fence as a code block wearing `md-mermaid`, because mermaid
 * lays a diagram out by measuring text and there is nothing to measure in a serverless function.
 * Everything here runs in a page: the preview swaps the block for a picture in place, and the
 * exported .html and the print frame get the same picture inlined before the file is handed over,
 * so what somebody downloads is what they were looking at.
 *
 * Mermaid is ~1 MB parsed and most documents have no diagram in them, so it is imported on the
 * first fence that actually turns up and never before.
 *
 * Drawing is split in two on purpose, and the reason is a bug this cost a while: mermaid takes a
 * second or two to load, React rebuilds the preview's subtree whenever the theme resolves, and a
 * <pre> captured before that await is a detached node by the time there is an SVG to put in its
 * place. Nothing throws — the diagram simply never appears. So `warmDiagrams` holds no DOM at all
 * and only fills the cache, and `paintDiagrams` is synchronous over whatever is on the page at the
 * moment it runs.
 */

type Theme = 'dark' | 'light';

/** Drawn diagrams, by theme and source. `null` is a fence that will not parse; it is not retried. */
const drawn = new Map<string, string | null>();

/** One promise per diagram being drawn, so six callers at once cost one render. */
const pending = new Map<string, Promise<string | null>>();

let loading: Promise<typeof import('mermaid').default> | null = null;
let count = 0;

const keyFor = (source: string, theme: Theme) => `${theme}::${source}`;

async function mermaidFor(theme: Theme) {
  loading ??= import('mermaid').then((module) => module.default);

  const mermaid = await loading;
  const md = mdDocVars(theme);

  /*
   * Re-initialised per batch rather than once: the theme is a global in mermaid, and the app's is
   * not. `strict` is what keeps a diagram from carrying script or click handlers into a document
   * that later gets emailed around; `suppressErrorRendering` is what keeps a typo in a fence from
   * replacing the diagram with mermaid's own error graphic — the source stays instead.
   */
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    suppressErrorRendering: true,
    /*
     * `base` plus the document's own palette, rather than one of mermaid's themes.
     *
     * Its light default paints every box lavender, which is nobody's brand and certainly not one
     * that appears anywhere else on this page. Base derives the rest — actors, clusters, notes —
     * from these few, so a diagram ends up the colour of the document it is sitting in.
     */
    theme: 'base',
    themeVariables: {
      background: md['--md-page'],
      primaryColor: md['--md-card-2'],
      primaryBorderColor: md['--md-brand-3'],
      primaryTextColor: md['--md-ink'],
      secondaryColor: md['--md-page'],
      tertiaryColor: md['--md-card'],
      lineColor: md['--md-secondary'],
      textColor: md['--md-body'],
      fontSize: '15px',
    },
    fontFamily: '"DM Sans", ui-sans-serif, system-ui, -apple-system, sans-serif',
    /*
     * Labels as <text>, not as HTML in a <foreignObject>.
     *
     * Two reasons, and the first one is fatal: a sanitiser that allows SVG does not allow
     * foreignObject, because foreignObject is how you put HTML inside an SVG — so the boxes
     * arrived drawn and empty. The second is that this picture ends up in a file somebody
     * emails, prints or opens in something that is not a browser, and foreignObject is the one
     * part of SVG that most of those renderers ignore.
     */
    htmlLabels: false,
    flowchart: { htmlLabels: false },
    class: { htmlLabels: false },
  });

  return mermaid;
}

async function draw(source: string, theme: Theme): Promise<string | null> {
  const key = keyFor(source, theme);

  try {
    const mermaid = await mermaidFor(theme);
    const { svg } = await mermaid.render(`md-diagram-${(count += 1)}`, source);
    /* Mermaid sanitises labels; this sanitises mermaid. The file leaves the browser after this. */
    const clean = DOMPurify.sanitize(svg, {
      USE_PROFILES: { svg: true, svgFilters: true, html: true },
    });

    drawn.set(key, clean);

    return clean;
  } catch {
    /* An unparseable fence keeps its source, which is more use to the author than an error box. */
    drawn.set(key, null);

    return null;
  } finally {
    pending.delete(key);
  }
}

/** The source of every fence under `root`. */
function diagramSources(root: ParentNode): string[] {
  return [...root.querySelectorAll('pre.md-mermaid')].map(
    (block) => block.textContent ?? ''
  );
}

/** Draws each source into the cache. Touches no DOM, so nothing here can go stale. */
async function warmDiagrams(
  sources: string[],
  theme: Theme
): Promise<void> {
  await Promise.all(
    sources.map((source) => {
      const key = keyFor(source, theme);

      if (drawn.has(key)) return drawn.get(key);

      const already = pending.get(key);

      if (already) return already;

      const job = draw(source, theme);

      pending.set(key, job);

      return job;
    })
  );
}

/** Swaps every fence under `root` for its drawn diagram, from the cache, in one synchronous pass. */
function paintDiagrams(root: ParentNode, theme: Theme): void {
  for (const block of [...root.querySelectorAll('pre.md-mermaid')]) {
    const svg = drawn.get(keyFor(block.textContent ?? '', theme));

    if (!svg) continue;

    const figure = block.ownerDocument.createElement('figure');

    figure.className = 'md-diagram';
    figure.innerHTML = svg;
    block.replaceWith(figure);
  }
}

/**
 * A fragment with every diagram drawn into it.
 *
 * The only entry point, and it returns markup rather than touching a page: what the preview shows
 * and what a downloaded file contains are then the same string, produced the same way.
 */
export async function inlineDiagrams(
  html: string,
  theme: Theme
): Promise<string> {
  if (!html.includes('md-mermaid')) return html;

  const parsed = new DOMParser().parseFromString(html, 'text/html');

  await warmDiagrams(diagramSources(parsed.body), theme);
  paintDiagrams(parsed.body, theme);

  return parsed.body.innerHTML;
}
