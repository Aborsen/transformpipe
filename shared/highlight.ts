import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import csharp from 'highlight.js/lib/languages/csharp';
import css from 'highlight.js/lib/languages/css';
import diff from 'highlight.js/lib/languages/diff';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import go from 'highlight.js/lib/languages/go';
import graphql from 'highlight.js/lib/languages/graphql';
import ini from 'highlight.js/lib/languages/ini';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import kotlin from 'highlight.js/lib/languages/kotlin';
import makefile from 'highlight.js/lib/languages/makefile';
import markdown from 'highlight.js/lib/languages/markdown';
import php from 'highlight.js/lib/languages/php';
import plaintext from 'highlight.js/lib/languages/plaintext';
import powershell from 'highlight.js/lib/languages/powershell';
import python from 'highlight.js/lib/languages/python';
import ruby from 'highlight.js/lib/languages/ruby';
import rust from 'highlight.js/lib/languages/rust';
import scss from 'highlight.js/lib/languages/scss';
import sql from 'highlight.js/lib/languages/sql';
import swift from 'highlight.js/lib/languages/swift';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';

/*
 * Code, coloured — in both runtimes, like the maths beside it.
 *
 * Registered one grammar at a time rather than importing the package whole. The full build is 386
 * languages and most of a megabyte; this list is what turns up in the documents this product
 * converts, and it costs a tenth of that. A fence in a language not on the list is not a failure —
 * it comes out as the plain code block it has always been.
 *
 * `hljs` emits classes and never inline colours, which is what lets the palette below live in the
 * document's own stylesheet beside every other `--md-*` value, and lets a highlighted block
 * survive the sanitiser on nothing more than `class`.
 */
const GRAMMARS = {
  bash, c, cpp, csharp, css, diff, dockerfile, go, graphql, ini, java,
  javascript, json, kotlin, makefile, markdown, php, plaintext, powershell,
  python, ruby, rust, scss, sql, swift, typescript, xml, yaml,
};

/*
 * Registered under these keys, not under the name each grammar reports.
 *
 * A grammar calls itself "Bash" and "JSON", capitals and all, while `getLanguage` looks a fence up
 * by the lower-case word somebody typed after the backticks. Registering by the reported name got
 * ```ts highlighted and ```json not — `ts` is a declared alias and happens to be lower case, while
 * `json` is the grammar's own name and is not. The keys above are the words fences are written
 * with, which is the only spelling that matters here.
 */
for (const [name, language] of Object.entries(GRAMMARS)) {
  hljs.registerLanguage(name, language);
}

/** The spellings people write in a fence that no grammar claims for itself. */
const ALSO: Record<string, string> = {
  htm: 'xml',
  jsonc: 'json',
  mdx: 'markdown',
  toml: 'ini',
  tsx: 'typescript',
  jsx: 'javascript',
  console: 'bash',
  shell: 'bash',
  sh: 'bash',
  zsh: 'bash',
  yml: 'yaml',
  text: 'plaintext',
  txt: 'plaintext',
};

/**
 * Highlighted markup for a fence, or `null` when this is not a language we know.
 *
 * `null` rather than a guess: `highlightAuto` exists and will happily decide that a three-line
 * config file is Perl. A fence with no language, or one nobody registered, is left alone.
 */
export function highlightCode(code: string, language: string): string | null {
  const name = ALSO[language] ?? language;

  if (!name || !hljs.getLanguage(name)) return null;

  try {
    return hljs.highlight(code, { language: name, ignoreIllegals: true }).value;
  } catch {
    return null;
  }
}
