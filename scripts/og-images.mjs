/* Draws a cover for every page, once, into public/og.
 *
 *   npm run og
 *
 * They do two jobs. They are the `og:image` a link gets when somebody shares it — without one, a
 * post about this site is a grey rectangle with a URL in it — and they are the picture on the cards
 * in the blog index and on the front page, which is what stops fifty articles reading as a wall of
 * identical text.
 *
 * Rendered in a real browser rather than composed as SVG, because the titles are set in DM Sans
 * with the app's own weights and a text layout engine is the only thing that knows where the lines
 * break. The font is loaded from public/fonts, so this runs offline and produces the same file
 * twice.
 *
 * The motif is the product: three lines of Markdown, the brand caret, the same three as HTML. The
 * accent comes from the tag, so the blog index reads as seven colours rather than one.
 */
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';

/*
 * `puppeteer-core` carries no browser of its own, so it needs telling where Chrome lives — and
 * where that is depends on the machine running this script, not on the project.
 */
const CHROME =
  process.env.CHROME_PATH ??
  {
    darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    win32: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  }[process.platform] ??
  'google-chrome';
const ROOT = resolve('.');
const OUT = join(ROOT, 'public', 'og');
const WIDTH = 1200;

const HEIGHT = 630;

/*
 * One composition, drawn twice at different sizes.
 *
 * 1200 by 630 is what a share expects — every scraper is built for 1.91:1 — and the card in the
 * blog index is the same picture at two thirds the size, so the layout is identical and only the
 * pixels differ. That is `deviceScaleFactor`, not a second template: the earlier version had two
 * templates, one of which omitted the title, and they drifted every time the design changed.
 *
 * The card being smaller matters. It is shown about 390px wide in a three-column grid, so a
 * 1200px source was four times the pixels the browser needed on every card on the page.
 */
const VARIANTS = {
  og: { scale: 1, type: 'jpeg', quality: 78, ext: 'jpg' },
  card: { scale: 2 / 3, type: 'webp', quality: 90, ext: 'webp' },
};

/*
 * One accent per tag, all of them chosen against #0f0e14 rather than taken from a ramp. Teal is the
 * brand's own; the rest sit far enough apart in hue to tell a Safety piece from a Syntax one at
 * card size, and close enough in chroma that a page of them is not a fruit bowl.
 */
const ACCENTS = {
  Converting: '#14a8af',
  Syntax: '#7c8cf8',
  Publishing: '#e0a34a',
  Automation: '#4ec9a0',
  Safety: '#e0685f',
  Workflow: '#b07cf8',
  Code: '#5aa9e6',
};

const DEFAULT_ACCENT = ACCENTS.Converting;

const escape = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** The same flat frontmatter the app's loader reads. */
function frontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);

  if (!match) {
    return {};
  }

  const data = {};

  for (const line of match[1].split(/\r?\n/)) {
    const at = line.indexOf(':');

    if (at > 0) {
      data[line.slice(0, at).trim()] = line
        .slice(at + 1)
        .trim()
        .replace(/^["']|["']$/g, '');
    }
  }

  return data;
}

const fontUrl = pathToFileURL(
  join(ROOT, 'public', 'fonts', 'dm-sans-latin-normal.woff2')
).href;

/*
 * The picture, drawn as shape and carrying no words at all.
 *
 * It used to print the headline into the image. That cost twice: on the blog index the title was
 * read once in the picture and again in the card underneath it, which is what made the page feel
 * loud; and because the words were in the picture, a translated article needed its own copy of
 * every cover, so 63 articles in five languages meant 276 files to draw and keep in step.
 *
 * With no text, one picture serves every language, and the grid stops repeating itself — see
 * `src/lib/covers.ts`, which no longer takes a locale.
 *
 * What replaces the words is a scene built per article rather than one motif reused: the same
 * vocabulary of document parts — paragraphs, a heading, a table, a list, a code block, a quote, an
 * image — arranged from a hash of the slug, so every cover differs and all of them are obviously
 * the same family. The composition itself is the product's own claim: flat text on the left, the
 * caret, structure on the right.
 */

/** A small, stable hash: the same slug draws the same picture on every machine, forever. */
function seedOf(slug) {
  let h = 2166136261;

  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }

  return h >>> 0;
}

/** A deterministic sequence from that seed. Not random: reproducible, which is the whole point. */
function pickerFor(slug) {
  let state = seedOf(slug) || 1;

  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;

    return state / 4294967296;
  };
}

const MUTED = '#34344a';
const MUTED_SOFT = '#2b2b3d';
const LINE = '#474760';

const bars = (widths, colour, thickness, gap) =>
  widths
    .map(
      (width, index) =>
        `<div style="width:${width}%;height:${thickness}px;border-radius:999px;background:${colour};${index ? `margin-top:${gap}px;` : ''}"></div>`
    )
    .join('');

/*
 * The vocabulary. Each piece takes the accent and the picker, so the same kind of block is never
 * drawn at quite the same proportions twice, and returns a fragment sized in percentages — the
 * scene decides how much room it gets, not the piece.
 */
const PIECES = {
  paragraph: (accent, rand) => {
    const count = 3 + Math.floor(rand() * 2);
    const widths = Array.from({ length: count }, () => 58 + Math.floor(rand() * 42));

    return `<div>${bars(widths, MUTED, 15, 18)}</div>`;
  },

  heading: (accent, rand) => `
    <div>
      <div style="width:${46 + Math.floor(rand() * 26)}%;height:21px;border-radius:999px;background:${accent}"></div>
      <div style="margin-top:18px">${bars([100, 72 + Math.floor(rand() * 24)], LINE, 15, 18)}</div>
    </div>`,

  table: (accent, rand) => {
    const cols = 2 + Math.floor(rand() * 2);
    const rows = 2 + Math.floor(rand() * 2);
    const cells = Array.from({ length: cols * rows }, () => '<span></span>').join('');

    return `<div class="grid" style="grid-template-columns:repeat(${cols},1fr)">${cells}</div>`;
  },

  list: (accent, rand) => {
    const count = 3 + Math.floor(rand() * 2);

    return `<div>${Array.from({ length: count }, (unused, index) => {
      const width = 54 + Math.floor(rand() * 40);

      return `<div style="display:flex;align-items:center;gap:14px;${index ? 'margin-top:15px;' : ''}">
        <span style="width:16px;height:16px;border-radius:999px;background:${accent};flex:none"></span>
        <span style="width:${width}%;height:15px;border-radius:999px;background:${MUTED}"></span>
      </div>`;
    }).join('')}</div>`;
  },

  checklist: (accent, rand) => {
    const count = 3 + Math.floor(rand() * 2);

    return `<div>${Array.from({ length: count }, (unused, index) => {
      const width = 52 + Math.floor(rand() * 40);

      return `<div style="display:flex;align-items:center;gap:14px;${index ? 'margin-top:15px;' : ''}">
        <span style="width:20px;height:20px;border-radius:5px;border:3px solid ${index === 0 ? accent : LINE};flex:none"></span>
        <span style="width:${width}%;height:15px;border-radius:999px;background:${MUTED}"></span>
      </div>`;
    }).join('')}</div>`;
  },

  code: (accent, rand) => `
    <div style="border:3px solid ${LINE};border-radius:12px;padding:24px 26px">
      ${bars([38 + Math.floor(rand() * 20), 76, 56 + Math.floor(rand() * 26)], MUTED, 13, 16)}
    </div>`,

  quote: (accent, rand) => `
    <div style="display:flex;gap:18px">
      <span style="width:7px;border-radius:999px;background:${accent};flex:none"></span>
      <div style="flex:1 1 0">${bars([100, 64 + Math.floor(rand() * 30)], MUTED, 15, 18)}</div>
    </div>`,

  media: (accent, rand) => `
    <div style="border:3px solid ${LINE};border-radius:12px;height:${118 + Math.floor(rand() * 44)}px;position:relative;overflow:hidden">
      <span style="position:absolute;left:26px;top:24px;width:28px;height:28px;border-radius:999px;background:${accent}"></span>
      <span style="position:absolute;left:-6%;bottom:-38px;width:112%;height:76px;background:${MUTED_SOFT};transform:rotate(-7deg)"></span>
    </div>`,
};

/** What can sit on the left: the document before anything read it. */
const FLAT = ['paragraph', 'quote', 'code', 'paragraph'];

/** And on the right: what the conversion made of it. */
const STRUCTURED = ['table', 'list', 'heading', 'checklist', 'media', 'table'];

function stack(names, accent, rand) {
  return `<div class="stack">${names
    .map((name, index) => `<div${index ? ' style="margin-top:34px"' : ''}>${PIECES[name](accent, rand)}</div>`)
    .join('')}</div>`;
}

/**
 * One article's scene.
 *
 * Two pieces a side at most: three fits, and at card size a frame with six blocks in it reads as
 * texture rather than as a document. The caret between them is the brand's own mark and the only
 * glyph in the picture — a shape by now, not a word.
 */
function scene(accent, slug) {
  const rand = pickerFor(slug);
  const of = (list) => list[Math.floor(rand() * list.length)];

  const left = [of(FLAT)];
  const right = [of(STRUCTURED)];

  left.push(of(FLAT.filter((name) => name !== left[0])));
  right.push(of(STRUCTURED.filter((name) => name !== right[0])));

  return `
    <div class="shape">
      ${stack(left, accent, rand)}
      <div class="arrow">&gt;</div>
      ${stack(right, accent, rand)}
    </div>`;
}

/**
 * The card, as a page: a ground, an accent wash, and the scene across it.
 *
 * Both sizes are this same composition — the share image and the index card differ only in how
 * many pixels come out of the screenshot, which is what keeps them from drifting apart.
 */
function card({ accent, slug = '' }) {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    position: relative;
    overflow: hidden;
    /*
     * Two lifts rather than one: the accent glow behind the structured half, where the colour
     * belongs, and a colder one behind the flat half so neither side sits on a flat rectangle.
     */
    background:
      radial-gradient(85% 115% at 82% 14%, ${accent}22 0%, ${accent}00 62%),
      radial-gradient(70% 90% at 12% 82%, #1c1c28 0%, #1c1c2800 70%),
      linear-gradient(160deg, #14141d 0%, #0f0e14 64%);
    font-family: system-ui, sans-serif;
    color: #f9fafb;
  }

  /* The scene sits in the frame rather than bleeding off it: with no words beside it, it is the picture. */
  .frame {
    position: absolute;
    inset: 0;
    padding: 76px 86px;
    display: flex;
    align-items: center;
  }

  .shape {
    display: flex;
    align-items: center;
    gap: 72px;
    width: 100%;
  }

  .stack { flex: 1 1 0; min-width: 0; }

  .arrow {
    font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
    font-size: 96px;
    font-weight: 600;
    line-height: 1;
    color: ${accent};
    flex: none;
  }

  .grid {
    display: grid;
    gap: 8px;
  }

  .grid span {
    height: 34px;
    border: 3px solid ${LINE};
    border-radius: 5px;
  }
</style>
</head>
<body>
  <div class="frame">${scene(accent, slug)}</div>
</body>
</html>`;
}

/* ------------------------------------------------------------------ what to draw */

const cards = [];

/*
 * One cover per article, not one per language.
 *
 * The picture carries no words, so a German reader and an English one can be shown the same file —
 * which is why this reads only the English directory. It is also why adding a language costs no
 * images at all: `src/lib/covers.ts` resolves every locale to the same path.
 */
const articleDir = join(ROOT, 'content', 'blog');

for (const name of readdirSync(articleDir).sort()) {
  if (!name.endsWith('.md')) {
    continue;
  }

  const slug = name.replace(/\.md$/, '');
  const data = frontmatter(readFileSync(join(articleDir, name), 'utf8'));
  const one = { slug, accent: ACCENTS[data.tag] ?? DEFAULT_ACCENT };

  // The same picture twice: full size for a share, two thirds for the card that shows it.
  cards.push({ ...one, dir: 'blog', variant: 'og' });
  cards.push({ ...one, dir: 'card', variant: 'card' });
}

/*
 * The rest of the site. Hand-written rather than read from `shared/conversions.ts`, because this
 * script is plain Node with no bundler in front of it and importing a .ts file would need one.
 * `npm run og` prints the count, so a page added without a card is visible.
 */
const PAGES = [
  ['home', 'A document converter that runs in your browser', 'Converter', ACCENTS.Converting],
  ['blog', 'Markdown, and what to do with it', 'Blog', ACCENTS.Syntax],
  ['docs', 'Everything TransformPipe does', 'Documentation', ACCENTS.Code],
  ['markdown-to-html', 'Markdown to HTML', 'Convert', ACCENTS.Converting],
  ['html-to-markdown', 'HTML to Markdown', 'Convert', ACCENTS.Converting],
  ['word-to-markdown', 'Word to Markdown', 'Convert', ACCENTS.Publishing],
  ['csv-to-markdown', 'CSV to a Markdown table', 'Convert', ACCENTS.Automation],
  ['json-to-markdown', 'JSON to Markdown', 'Convert', ACCENTS.Code],
  ['notion-to-markdown', 'Notion to Markdown', 'Convert', ACCENTS.Workflow],
  ['confluence-to-markdown', 'Confluence to Markdown', 'Convert', ACCENTS.Workflow],
  ['obsidian-to-markdown', 'Obsidian to Markdown', 'Convert', ACCENTS.Workflow],
  ['text-to-markdown', 'Raw text to Markdown', 'Convert', ACCENTS.Syntax],
  ['excel-to-markdown', 'Excel to a Markdown table', 'Convert', ACCENTS.Automation],
  ['about', 'About TransformPipe', 'Company', ACCENTS.Workflow],
  ['contact', 'Contact us', 'Company', ACCENTS.Workflow],
  ['privacy', 'Privacy', 'Legal', ACCENTS.Safety],
  ['terms', 'Terms of use', 'Legal', ACCENTS.Safety],
  ['cookies', 'Cookies', 'Legal', ACCENTS.Safety],
];

for (const [name, title, eyebrow, accent] of PAGES) {
  cards.push({ slug: name, title, eyebrow, accent, variant: 'og' });
}

/* ------------------------------------------------------------------ draw them */

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--hide-scrollbars', '--force-device-scale-factor=1'],
});

const page = await browser.newPage();

for (const one of cards) {
  const { scale, type, quality, ext } = VARIANTS[one.variant];
  const file = join(OUT, ...(one.dir ? [one.dir] : []), `${one.slug}.${ext}`);

  mkdirSync(dirname(file), { recursive: true });
  /*
   * The layout is always drawn at 1200 by 630; the scale factor decides how many pixels come out.
   * So the card is the same composition, not a second one that has to be kept in step.
   */
  await page.setViewport({
    width: WIDTH,
    height: HEIGHT,
    deviceScaleFactor: scale,
  });
  await page.setContent(card(one), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  writeFileSync(file, await page.screenshot({ type, quality }));
}

await browser.close();

const articles = (cards.length - PAGES.length) / 2;

console.log(
  `drew ${cards.length} covers into public/og: ${articles} articles (a share image and a card image each) and ${PAGES.length} pages`
);
