import {
  mdArticleSurface,
  mdDocTheme,
  MD_DOC_STYLE,
  MD_PREVIEW_STYLE,
} from '@shared/md-doc-css';
import { useEffect, useState } from 'react';
import { inlineDiagrams } from '@/lib/mermaid';
import { useTheme } from '@/lib/theme';
import { cn } from '@/ui/lib/utils';

interface DocumentPreviewProps {
  html: string;
  className?: string;
}

/**
 * Renders the converted fragment with exactly the stylesheet that ships inside the exported file,
 * so "preview" and "downloaded .html" always match — right down to the sheet's own background,
 * which follows the app theme in both places.
 */
export function DocumentPreview({ html, className }: DocumentPreviewProps) {
  const { theme } = useTheme();

  /*
   * The fragment with its diagrams drawn into it, once there are any.
   *
   * Drawn into the markup rather than into the DOM, and that is the whole point. The obvious
   * version swaps each `pre.md-mermaid` for an `<svg>` in place — and it works for about a second:
   * mermaid takes that long to load, React rebuilds this subtree when the theme resolves, and the
   * swap either lands in a node that is no longer on the page or is undone by the next render.
   * Nothing throws; the diagram simply is not there. Here the drawn fragment is state, so React
   * renders it and no re-render can take it away.
   *
   * `html` goes up first, so the document appears at once and the diagram fills in behind it. A
   * document with no fence in it never waits, and never loads mermaid.
   */
  const [shown, setShown] = useState(html);

  useEffect(() => {
    setShown(html);

    let live = true;

    void inlineDiagrams(html, theme).then((drawn) => {
      if (live) setShown(drawn);
    });

    return () => {
      live = false;
    };
  }, [html, theme]);

  return (
    <>
      {/* The frame around the sheet paints the page background, so it needs the palette too. */}
      <style>{`${mdDocTheme(theme, '.md-doc, .md-sheet, .md-preview-frame')}\n${MD_DOC_STYLE}\n${MD_PREVIEW_STYLE}\n${mdArticleSurface(theme)}`}</style>

      <div className={cn('md-sheet', className)}>
        <div
          className="md-doc"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitised in markdownToHtml, and the diagrams again in inlineDiagrams
          dangerouslySetInnerHTML={{ __html: shown }}
        />
      </div>
    </>
  );
}
