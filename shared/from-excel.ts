import { markdownTable } from './from-table.js';
import { buildTocDocument, type TocPage } from './zip-import.js';

/*
 * An .xlsx workbook, as Markdown tables — one per sheet that has rows in it, a table of contents
 * added the moment there is more than one, the same convention `zip-import.ts` uses for a Notion
 * or Confluence export: several parts of one file becoming one document rather than several.
 *
 * `read-excel-file/universal` rather than the more commonly reached-for `xlsx` (SheetJS): its own
 * npm releases lag its actual development by a long way — the maintainers push newer builds
 * through their own site instead — and `/universal` here runs identically in the browser and in
 * this app's one server-side case (an API caller with no browser to run the client copy in).
 */

function cellText(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return String(value);
}

export async function excelToMarkdown(bytes: ArrayBuffer, title: string): Promise<string> {
  const { default: readXlsxFile } = await import('read-excel-file/universal');

  let sheets: Array<{ sheet: string; data: unknown[][] }>;

  try {
    sheets = await readXlsxFile(bytes);
  } catch (cause) {
    throw new Error(
      `That is not a readable .xlsx: ${cause instanceof Error ? cause.message : 'it could not be opened'}`
    );
  }

  const populated = sheets.filter((sheet) => sheet.data.length > 0);

  if (populated.length === 0) {
    throw new Error('That workbook has no rows in it');
  }

  const table = (rows: unknown[][]) => {
    const cells = rows.map((row) => row.map(cellText));

    return markdownTable(cells[0], cells.slice(1));
  };

  if (populated.length === 1) {
    return `# ${title}\n\n${table(populated[0].data)}`;
  }

  const pages: TocPage[] = populated.map((sheet) => ({
    title: sheet.sheet,
    markdown: `# ${sheet.sheet}\n\n${table(sheet.data)}`,
  }));

  return buildTocDocument(title, pages);
}
