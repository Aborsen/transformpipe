import { buildStandaloneHtml } from '../shared/markdown.js';
import { markdownToHtml } from './render.js';

/*
 * Markdown → .docx, through the same HTML this app already produces rather than a second
 * Markdown parser. `@turbodocx/html-to-docx` is pure JavaScript — no headless browser, no native
 * binary — which is what makes it safe to load inside a Vercel Function; the maintained fork of a
 * package whose original has been dormant since 2023. Loaded lazily, like `mammoth` in `v1.ts`, so
 * no request that isn't asking for a .docx pays for it.
 */
export async function markdownToDocx(markdown: string, title: string): Promise<Buffer> {
  const HtmlToDocx = (await import('@turbodocx/html-to-docx')).default;

  const html = buildStandaloneHtml({
    title,
    body: markdownToHtml(markdown),
    theme: 'light',
  });

  const buffer = await HtmlToDocx(html, null, {
    title,
    font: 'Calibri',
  });

  return Buffer.from(buffer as ArrayBuffer);
}
