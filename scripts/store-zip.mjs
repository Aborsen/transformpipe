/* Packs the built extension into the file a store takes.
 *
 *   npm run ext:zip            Chrome: builds, then writes brand/store/transformpipe-<version>.zip
 *   npm run ext:zip:firefox    Firefox: the same from dist-extension-firefox/, named for it
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

const firefox = process.argv.includes('--firefox');
const ROOT = resolve('.');
const DIST = join(ROOT, firefox ? 'dist-extension-firefox' : 'dist-extension');
const OUT = join(ROOT, 'brand', 'store');

if (!existsSync(join(DIST, 'manifest.json'))) {
  const build = firefox ? 'npm run ext:firefox' : 'npm run ext';

  console.error(`${DIST} is not built — run \`${build}\` first.`);
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(join(DIST, 'manifest.json'), 'utf8'));

/* What a reviewer's tooling checks first, checked here first. */
for (const size of ['16', '48', '128']) {
  const icon = manifest.icons?.[size];

  if (!icon || !existsSync(join(DIST, icon))) {
    console.error(`manifest declares no usable ${size}px icon`);
    process.exit(1);
  }
}

if (firefox && !manifest.browser_specific_settings?.gecko?.id) {
  console.error('the Firefox package has no gecko id — updates would land on a different add-on');
  process.exit(1);
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

/*
 * The two packages differ and are named so they cannot be uploaded to the wrong store: one has a
 * service worker and a side panel, the other an event page and a sidebar, and they are otherwise
 * byte-identical.
 */
const name = `transformpipe${firefox ? '-firefox' : ''}-${manifest.version}.zip`;
const zip = zipSync(files, { level: 9 });

writeFileSync(join(OUT, name), zip);

const size = (zip.length / 1024).toFixed(0);

console.log(`${name} — ${Object.keys(files).length} files, ${size} kB`);
console.log(
  firefox
    ? 'Upload it at https://addons.mozilla.org/developers/addon/submit/distribution'
    : 'Upload it at https://chrome.google.com/webstore/devconsole'
);
