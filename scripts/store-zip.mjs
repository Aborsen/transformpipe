/* Packs the built extension into the file the Chrome Web Store takes.
 *
 *   npm run ext:zip        builds first, then writes brand/store/transformpipe-<version>.zip
 *
 * A script rather than a line in a README, for the reason every release step ends up as one: the
 * store takes a zip of the *contents* of the folder and not of the folder itself, and a zip made
 * by hand from the Finder is a zip of the folder about half the time. It also checks the two
 * things that get a package rejected before a human ever sees it — a missing icon, a version that
 * is already in the store — because finding that out three days later is the expensive way.
 *
 * `fflate` is already a dependency: it is what reads a .zip on the way into a conversion.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { zipSync } from 'fflate';

const ROOT = resolve('.');
const DIST = join(ROOT, 'dist-extension');
const OUT = join(ROOT, 'brand', 'store');

if (!existsSync(join(DIST, 'manifest.json'))) {
  console.error('dist-extension is not built — run `npm run ext` first.');
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(join(DIST, 'manifest.json'), 'utf8'));

/* What the store checks first, checked here first. */
for (const size of ['16', '48', '128']) {
  const icon = manifest.icons?.[size];

  if (!icon || !existsSync(join(DIST, icon))) {
    console.error(`manifest declares no usable ${size}px icon`);
    process.exit(1);
  }
}

if (manifest.default_locale && !existsSync(join(DIST, '_locales', manifest.default_locale))) {
  console.error(`default_locale is ${manifest.default_locale} and there is no _locales entry for it`);
  process.exit(1);
}

/** Every file under dist-extension, keyed by its path inside the package. */
function collect(directory, into = {}) {
  for (const entry of readdirSync(directory)) {
    const full = join(directory, entry);

    if (statSync(full).isDirectory()) {
      collect(full, into);
    } else if (!entry.endsWith('.map')) {
      /* Source maps are the whole source tree, and the package is public. */
      into[relative(DIST, full).split('\\').join('/')] = readFileSync(full);
    }
  }

  return into;
}

const files = collect(DIST);

mkdirSync(OUT, { recursive: true });

const name = `transformpipe-${manifest.version}.zip`;
const zip = zipSync(files, { level: 9 });

writeFileSync(join(OUT, name), zip);

const size = (zip.length / 1024).toFixed(0);

console.log(`${name} — ${Object.keys(files).length} files, ${size} kB`);
console.log('Upload it at https://chrome.google.com/webstore/devconsole');
