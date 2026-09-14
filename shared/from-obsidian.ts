import {
  buildTocDocument,
  readZipTextFiles,
  withoutDuplicateTitle,
  type TocPage,
} from './zip-import.js';

/*
 * An Obsidian vault, zipped — either the vault folder itself compressed as-is, or the output of a
 * vault-export plugin. Either way it is a tree of `.md` files, and a note's title is its file name,
 * not something written inside it the way Confluence's `<title>` is.
 *
 * The one thing worth doing beyond the zip-and-merge every importer here shares is wikilinks:
 * `[[Note]]`, `[[Note|Shown text]]`, `[[Note#Heading]]`, and their `![[...]]` embed form. Obsidian
 * resolves these against the vault at read time; merged into one document there is no vault left to
 * resolve them against, so — the same call this app already made for Notion's links — only the
 * words survive. Frontmatter (a `---` block of properties at the top) is Obsidian's own metadata,
 * meaningless outside the vault that defined those properties, so it is dropped rather than shown
 * as a document's opening paragraph.
 */

/** `[[Note]]`, `[[Note|Text]]`, `[[Note#Heading]]`, `[[Note#Heading|Text]]`, and `![[...]]`. */
const WIKILINK = /!?\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]+))?\]\]/g;

const EMBEDDED_FILE = /\.(png|jpe?g|gif|svg|webp|bmp|pdf|mp3|mp4|wav|mov)$/i;

function rewriteWikilinks(markdown: string): string {
  return markdown.replace(WIKILINK, (whole, target: string, shown?: string) => {
    const text = (shown ?? target).trim();

    // An embedded image or other attachment has no file to carry over into a merged document.
    return whole.startsWith('!') && EMBEDDED_FILE.test(target) ? `*${text}*` : text;
  });
}

/** The `---`-delimited properties block Obsidian writes at the top of a note, if there is one. */
function stripFrontmatter(markdown: string): string {
  const match = markdown.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);

  return match ? markdown.slice(match[0].length) : markdown;
}

function titleFromFileName(path: string): string {
  return path.split('/').pop()!.replace(/\.md$/i, '').trim() || 'Untitled';
}

export async function obsidianZipToMarkdown(bytes: Uint8Array): Promise<string> {
  const pages = await readZipTextFiles(bytes, '.md');

  if (pages.length === 0) {
    throw new Error('No Markdown notes found in that .zip — is it an Obsidian vault?');
  }

  const tocPages: TocPage[] = pages.map((page) => {
    const title = titleFromFileName(page.path);
    const body = rewriteWikilinks(withoutDuplicateTitle(stripFrontmatter(page.text), title));

    return { title, markdown: `# ${title}\n\n${body}` };
  });

  return buildTocDocument('Contents', tocPages);
}
