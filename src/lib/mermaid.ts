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
 */

type Theme = 'dark' | 'light';

/** Drawn diagrams, by theme and source. A document redrawn on a theme switch costs one lookup. */
const drawn = new Map<string, string>();

let loading: Promise<typeof import('mermaid').default> | null = null;
let count = 0;

async function mermaidFor(theme: Theme) {
  loading ??= import('mermaid').then((module) => module.default);

  const mermaid = await loading;

  /*
   * Re-initialised per batch rather than once: the theme is a global in mermaid, and the app's is
   * not. `strict` is what keeps a diagram from carrying script or click handlers into a document
   * that later gets emailed around; `suppressErrorRendering` is what keeps a typo in a fence from
   * replacing the diagram with mermaid's own error graphic — the source stays instead.
   */
  const md = mdDocVars(theme);

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
  const key = `${theme}::${source}`;
  const already = drawn.get(key);

  if (already) return already;

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
    return null;
  }
}

/** Replaces every `pre.md-mermaid` under `root` with the diagram it describes. */
export async function renderDiagrams(
  root: ParentNode,
  theme: Theme
): Promise<void> {
  const blocks = [...root.querySelectorAll<HTMLElement>('pre.md-mermaid')];

  for (const block of blocks) {
    const svg = await draw(block.textContent ?? '', theme);

    /* The preview may have moved on to another document while mermaid was loading. */
    if (!svg || !block.isConnected) continue;

    const figure = block.ownerDocument.createElement('figure');

    figure.className = 'md-diagram';
    figure.innerHTML = svg;
    block.replaceWith(figure);
  }
}

/** The same, for a fragment on its way into a file rather than onto the screen. */
export async function inlineDiagrams(
  html: string,
  theme: Theme
): Promise<string> {
  if (!html.includes('md-mermaid')) return html;

  const parsed = new DOMParser().parseFromString(html, 'text/html');

  await renderDiagrams(parsed.body, theme);

  return parsed.body.innerHTML;
}
