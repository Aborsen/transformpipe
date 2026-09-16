/* Draws every icon the browsers and the phones ask for, from one drawing.
 *
 *   npm run icons
 *
 * The drawing is `brand/mark.svg`: the T and the p of the wordmark, fused, on a dark square. It is
 * the only file to edit — everything in `public/` that has an icon in its name comes out of this
 * script, so the set cannot drift the way a folder of hand-exported PNGs does.
 *
 * Why there is more than the SVG. Every current browser takes `favicon.svg` and that would be the
 * end of it, except for the two places that still want pixels: iOS, which has never read an SVG
 * for a home-screen icon, and Android's launcher, which wants a version it is allowed to crop.
 * Those two, plus one small PNG for whatever is left, is the whole list — there is no `.ico` here
 * on purpose, and no 70-file set from an icon generator either.
 *
 * Rendered in the same headless Chrome as the covers, for the same reason: it is the renderer the
 * icon will actually be seen in.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import puppeteer from 'puppeteer-core';

const CHROME =
  process.env.CHROME_PATH ??
  {
    darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    win32: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  }[process.platform] ??
  'google-chrome';

const ROOT = resolve('.');
const SOURCE = join(ROOT, 'brand', 'mark.svg');
const OUT = join(ROOT, 'public');

/*
 * The source, taken apart into a background and a glyph.
 *
 * Both halves have to be adjustable separately: a maskable icon needs the glyph smaller inside the
 * same square, and an Apple icon needs the corners square because iOS rounds them itself — round
 * them here too and the result is a rounded icon inside a rounded mask, with a dark rind.
 */
const source = readFileSync(SOURCE, 'utf8');
const BACKGROUND_RECT = /<rect\b[^>]*\/>/;
const BACKGROUND = (source.match(/<rect\b[^>]*fill="(#[0-9A-Fa-f]{3,8})"/) ?? [])[1] ?? '#070A10';
const GLYPH = source
  .replace(/<\?xml[^>]*\?>/, '')
  .replace(/<svg\b[^>]*>/, '')
  .replace(/<\/svg>/, '')
  .replace(/<(title|desc)\b[^>]*>[\s\S]*?<\/\1>/g, '')
  .replace(BACKGROUND_RECT, '')
  .trim();

if (!GLYPH.includes('<path')) {
  throw new Error(`No glyph left after stripping the frame out of ${SOURCE} — check its shape.`);
}

/**
 * One icon as an SVG string.
 *
 * `radius` is in the 32-unit grid the mark is drawn on, `scale` shrinks the glyph about the centre
 * of the square without moving it.
 */
function mark({ radius, scale }) {
  const glyph =
    scale === 1
      ? GLYPH
      : `<g transform="translate(16 16) scale(${scale}) translate(-16 -16)">${GLYPH}</g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%">
    <rect width="32" height="32" rx="${radius}" fill="${BACKGROUND}"/>
    ${glyph}
  </svg>`;
}

/*
 * What each file is for, which is the only reason any of them exist.
 *
 * `scale` on the maskable one is the part worth keeping straight: Android may crop the icon to
 * anything inside a circle of 80% of its width, so the glyph has to sit well inside that or a
 * launcher with round icons takes the corners off the letters. 0.7 leaves room for the roundest
 * mask anybody ships.
 */
const ICONS = [
  { file: 'favicon-96.png', size: 96, radius: 6, scale: 1 },
  { file: 'apple-touch-icon.png', size: 180, radius: 0, scale: 1 },
  { file: 'icon-192.png', size: 192, radius: 6, scale: 1 },
  { file: 'icon-512.png', size: 512, radius: 6, scale: 1 },
  { file: 'icon-maskable-512.png', size: 512, radius: 0, scale: 0.7 },
];

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

/* The SVG favicon is the source itself, byte for byte — nothing to render and nothing to drift. */
writeFileSync(join(OUT, 'favicon.svg'), source);
console.log('favicon.svg');

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
const page = await browser.newPage();

for (const icon of ICONS) {
  await page.setViewport({ width: icon.size, height: icon.size, deviceScaleFactor: 1 });
  await page.setContent(
    `<body style="margin:0">${mark({ radius: icon.radius, scale: icon.scale })}</body>`
  );
  writeFileSync(join(OUT, icon.file), await page.screenshot({ type: 'png' }));
  console.log(icon.file);
}

await browser.close();
