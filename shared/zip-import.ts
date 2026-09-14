/*
 * What Notion's and Confluence's exports have in common: several files in one .zip, each a page,
 * that this app turns into one document rather than several — a `.zip` is one thing dropped, and
 * the app's existing "chain several files" convention already says what several parts joining into
 * one document looks like: trimmed, joined on `\n\n---\n\n`, oldest/first to last. This file is
 * that convention plus the zip reading both importers share; what a *page* inside the zip becomes
 * is each importer's own job — a Notion page and a Confluence page start from different markup
 * entirely.
 *
 * `fflate` rather than the more familiar `jszip`: pure JavaScript, no native bindings, and it is
 * the same code path in the browser (where every other conversion in this app already runs) and in
 * the one server-side case that needs it — see server/v1.ts's word-to-markdown handling for why an
 * API caller cannot run the browser's own copy.
 */

export interface ZipPage {
  /** The full path inside the archive, e.g. `Space/Sub page abc123….md`. */
  path: string;
  text: string;
}

/** Every entry in the archive matching `extension`, as text — skips directories and empty files. */
export async function readZipTextFiles(
  bytes: Uint8Array,
  extension: string
): Promise<ZipPage[]> {
  const { unzipSync, strFromU8 } = await import('fflate');

  let files: Record<string, Uint8Array>;

  try {
    files = unzipSync(bytes);
  } catch (cause) {
    throw new Error(
      `That is not a readable .zip: ${cause instanceof Error ? cause.message : 'it could not be opened'}`
    );
  }

  return Object.entries(files)
    .filter(([path, data]) => path.toLowerCase().endsWith(extension) && data.length > 0)
    // A stable order matters: it decides the order pages appear in the merged document, and the
    // path is the only thing here that does not change between two exports of the same space.
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, data]) => ({ path, text: strFromU8(data) }));
}

/**
 * A page's own first line is usually already its title as an H1 — printed once by whatever
 * produced this page's markdown, and once more by the `# ${title}` this importer is about to add
 * on top of every page for the table of contents to point at. Without this, every single page in
 * the merged document would carry its title twice.
 */
export function withoutDuplicateTitle(markdown: string, title: string): string {
  const lines = markdown.replace(/^﻿/, '').split('\n');
  const first = lines.findIndex((line) => line.trim().length > 0);

  if (first === -1) {
    return markdown;
  }

  const heading = lines[first].match(/^#\s+(.*)$/);

  if (heading && heading[1].trim().toLowerCase() === title.toLowerCase()) {
    return lines.slice(first + 1).join('\n');
  }

  return markdown;
}

export interface TocPage {
  title: string;
  markdown: string;
}

/**
 * One document out of several pages: a table of contents, then every page in order, each
 * separated the same way "chain several files" already separates unrelated uploads — see
 * `src/lib/merge.ts`. Kept here rather than imported from there: that module is the browser app's
 * own merge feature, and this file has to run on the server too.
 */
export function buildTocDocument(title: string, pages: TocPage[]): string {
  const toc = pages.map((page) => `- ${page.title}`).join('\n');

  const sections = pages.map((page) => page.markdown.trim());

  return [`# ${title}\n\n${toc}`, ...sections].join('\n\n---\n\n');
}
