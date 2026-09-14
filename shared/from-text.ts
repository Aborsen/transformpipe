/*
 * Plain text isn't Markdown, even though the two often look identical — and where they differ, it
 * is exactly the part a person never meant: an asterisk used for real emphasis in a `.md` file
 * means the same thing as an asterisk typed as a literal asterisk in a `.txt` file, but a Markdown
 * renderer cannot tell the two apart. Treating a plain-text file as if it were already Markdown (as
 * this app already does for `.txt` on the default conversion, unchanged) means "Add *stars* next
 * to failing tests" comes out with "stars" in italics — a sentence about a review convention,
 * accidentally reformatted.
 *
 * This conversion is the other answer to the same file: escape every character Markdown would
 * otherwise notice, so the words render exactly as typed, and turn plain text's own convention —
 * a wrapped line means the same sentence, a blank line means a new paragraph — into Markdown's,
 * since Markdown collapses a single line break into a space by default.
 */

const INLINE_METACHARACTERS = /([*_`[\]~])/g;

/** Markdown that only means something at the start of a line — a heading, a quote, a list item. */
function escapeLeadingMarker(line: string): string {
  return line
    .replace(/^(\s*)#/, '$1\\#')
    .replace(/^(\s*)>/, '$1\\>')
    .replace(/^(\s*)([-+])(\s|$)/, '$1\\$2$3')
    .replace(/^(\s*)(\d+)([.)])(\s|$)/, '$1$2\\$3$4');
}

function escapeLine(line: string): string {
  // Backslash first, and only once — every other escape below adds backslashes of its own, and
  // re-running this after them would double-escape those rather than the text's own.
  const backslashed = line.replace(/\\/g, '\\\\');

  return escapeLeadingMarker(backslashed.replace(INLINE_METACHARACTERS, '\\$1'));
}

export function textToMarkdown(text: string): string {
  const normalized = text.replace(/\r\n?/g, '\n').replace(/^﻿/, '');

  return normalized
    .split(/\n{2,}/)
    .map((paragraph) =>
      paragraph
        .split('\n')
        .map(escapeLine)
        // A backslash at the end of a line is a hard break in CommonMark — visible in the source,
        // unlike the two-trailing-spaces convention, which an editor's "trim trailing whitespace"
        // deletes without anyone noticing the paragraph it used to be five separate lines quietly
        // became one.
        .join('\\\n')
    )
    .join('\n\n')
    .trim();
}
