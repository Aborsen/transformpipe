import {
  mdArticleSurface,
  mdDocTheme,
  MD_DOC_STYLE,
  MD_PREVIEW_STYLE,
} from '@shared/md-doc-css';
import { useEffect, useRef } from 'react';
import { renderDiagrams } from '@/lib/mermaid';
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
  const sheet = useRef<HTMLDivElement>(null);

  /*
   * Diagrams are drawn after the fragment is in the DOM, because mermaid needs to measure text.
   *
   * The `key` below is what makes a theme switch work: a drawn diagram is an <svg>, not the
   * <pre> this looks for, so React is asked to rebuild the fragment from the html it was given
   * and the diagrams are drawn again in the other palette.
   */
  useEffect(() => {
    if (sheet.current) void renderDiagrams(sheet.current, theme);
  }, [html, theme]);

  return (
    <>
      {/* The frame around the sheet paints the page background, so it needs the palette too. */}
      <style>{`${mdDocTheme(theme, '.md-doc, .md-sheet, .md-preview-frame')}\n${MD_DOC_STYLE}\n${MD_PREVIEW_STYLE}\n${mdArticleSurface(theme)}`}</style>

      <div className={cn('md-sheet', className)}>
        <div
          className="md-doc"
          key={theme}
          ref={sheet}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized with DOMPurify in markdownToHtml
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </>
  );
}
