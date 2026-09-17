/* Checks the things that pass locally and fail on the platform.
 *
 *   npm run deploy:check
 *
 * Both of these broke production today, and neither was caught by `tsc`, by `vite build` or by the
 * dev server — because all three resolve modules and parse config the way a bundler does, and the
 * deployed function does neither.
 *
 *   1. An import without its extension. The API function runs as ESM on Node, where a relative
 *      specifier must end in `.js`. `server/mcp.ts` reads two modules out of `src/lib`, so the
 *      server's import graph reaches into application code that is written the other way — and one
 *      line of it took every /api route down with FUNCTION_INVOCATION_FAILED.
 *
 *   2. A `source` pattern in vercel.json that path-to-regexp refuses. An invalid one is rejected
 *      before a build starts, so the symptom is not a failing deploy: it is no deploy at all, and
 *      production quietly staying on the commit before.
 *
 *   3. A JSON import in that same graph. `import { version } from '../package.json'` type-checks,
 *      builds, and runs in the dev server; the deployed bundle does not carry the file, so the
 *      import throws at module load — which is every request, so the whole API answered 500.
 *
 *   4. `shared/version.ts` disagreeing with `package.json`. The version is a copy because a JSON
 *      import is what item 3 is about, and a copy nobody checks is a copy that goes stale.
 *
 * Exits non-zero, and runs inside `npm run build`, so neither can reach a push again.
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const problems = [];

/* ------------------------------------------------------------------ 1. the server's import graph */

/*
 * Walked rather than grepped.
 *
 * The rule only applies to files the function actually loads, and that set is not "everything under
 * server/" — it follows imports wherever they go, which is how `src/lib/faq.ts` came to be part of
 * the server in the first place. So start at the entry point and follow.
 */
const RELATIVE = /^import\s+(?:type\s+)?[\s\S]*?from\s+['"](\.[^'"]*)['"]/gm;
const TYPE_ONLY = /^import\s+type\s/;

/** Every `import ... from '...'` statement, with whether it was a type-only one. */
function importsOf(file) {
  const source = readFileSync(file, 'utf8');
  const found = [];

  for (const match of source.matchAll(RELATIVE)) {
    found.push({
      specifier: match[1],
      /*
       * A type-only import is erased at compile time, so its specifier never becomes something the
       * runtime has to resolve. That is why the i18n catalogue's `@shared/...` aliases are harmless
       * and why an extensionless one among them would be too.
       */
      typeOnly: TYPE_ONLY.test(match[0]),
      line: source.slice(0, match.index).split('\n').length,
    });
  }

  return found;
}

/** `../src/lib/faq.js` next to a .ts file means `../src/lib/faq.ts`. */
function onDisk(from, specifier) {
  const asked = resolve(dirname(from), specifier);

  for (const candidate of [
    asked.replace(/\.js$/, '.ts'),
    asked.replace(/\.js$/, '.tsx'),
    `${asked}.ts`,
    `${asked}.tsx`,
    asked,
  ]) {
    if (existsSync(candidate) && !candidate.endsWith('/')) {
      return candidate;
    }
  }

  return null;
}

const ENTRY = resolve('api/index.ts');
const seen = new Set();
const queue = [ENTRY];

/*
 * `api/index.ts` imports `../server/app.js`, which is the whole function. Anything reachable from
 * here is loaded by the deployed handler; anything not is somebody else's problem.
 */
while (queue.length > 0) {
  const file = queue.pop();

  if (seen.has(file)) {
    continue;
  }

  seen.add(file);

  for (const { specifier, typeOnly, line } of importsOf(file)) {
    /*
     * A .json in this graph is the failure above: the function's bundle carries modules, not the
     * repository, so the file is simply not there at runtime. Whatever was wanted out of it belongs
     * in a .ts module beside it.
     */
    if (!typeOnly && specifier.endsWith('.json')) {
      problems.push(
        `${file.replace(resolve('.'), '.')}:${line} imports "${specifier}" — the deployed function ` +
          'does not carry JSON files, so this throws on every request. Put the value in a .ts module.'
      );
    }

    if (!typeOnly && !/\.(js|json|css)$/.test(specifier)) {
      problems.push(
        `${file.replace(resolve('.'), '.')}:${line} imports "${specifier}" with no extension — ` +
          'the function resolves this as ESM on Node, where that does not resolve. Add `.js`.'
      );
    }

    const next = onDisk(file, specifier);

    if (next && !typeOnly) {
      queue.push(next);
    }
  }
}

/* ------------------------------------------------------------------ the one copied number */

const declared = readFileSync(resolve('shared/version.ts'), 'utf8').match(
  /VERSION\s*=\s*'([^']+)'/
)?.[1];
const packaged = JSON.parse(readFileSync(resolve('package.json'), 'utf8')).version;

if (declared !== packaged) {
  problems.push(
    `shared/version.ts says ${declared} and package.json says ${packaged}. They are one number: ` +
      'the extension manifest and the release tag read one, the connector reads the other.'
  );
}

/* ------------------------------------------------------------------ 2. the platform's own config */

const config = JSON.parse(readFileSync('vercel.json', 'utf8'));

/*
 * Parsed with the library the platform parses it with, because the failure mode is silent: an
 * invalid `source` is rejected before the build, so nothing appears in the deployment list at all.
 *
 * A dependency that is only here is not installed in CI, so a missing one is a warning rather than
 * a failure — the point is to catch the mistake on the machine where it is being made.
 */
let pathToRegexp;

try {
  ({ pathToRegexp } = await import('path-to-regexp'));
} catch {
  console.warn(
    'path-to-regexp is not installed, so vercel.json patterns were not checked.\n' +
      '  npm i -D path-to-regexp@6'
  );
}

if (pathToRegexp) {
  for (const group of ['rewrites', 'redirects', 'headers']) {
    for (const rule of config[group] ?? []) {
      try {
        pathToRegexp(rule.source);
      } catch (cause) {
        problems.push(
          `vercel.json ${group}: "${rule.source}" is not a pattern the platform accepts — ${cause.message}`
        );
      }
    }
  }
}

/* ------------------------------------------------------------------ say so */

if (problems.length === 0) {
  console.log(
    `${seen.size} modules reachable from api/index.ts, every specifier resolvable; ` +
      'vercel.json patterns parse.'
  );
  process.exit(0);
}

console.error(
  `\n${problems.length} thing${problems.length === 1 ? '' : 's'} that would fail on deploy:\n` +
    problems.map((one) => `  ${one}`).join('\n')
);
process.exit(1);
