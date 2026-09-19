import { rewriteWikilinks, stripFrontmatter } from './notes.js';
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
 * resolve them against, so only the words survive. That rule and the one about frontmatter now
 * live in `notes.ts`, because the shared renderer needs them too: a note pasted on its own used to
 * keep both, so the same file converted two ways came out two different documents.
 */

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
