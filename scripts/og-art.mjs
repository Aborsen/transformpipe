/* Draws the object that sits on each cover, once, with an image model.
 *
 *   node scripts/og-art.mjs                 # everything missing
 *   node scripts/og-art.mjs some-slug ...   # just these, redrawn
 *
 * Separate from `npm run og` on purpose. That script is deterministic: the same slug produces the
 * same picture on any machine, for free, forever. This one costs money and cannot be reproduced —
 * ask twice for the same prompt and you get two different objects. So it runs by hand, writes PNGs
 * into public/og/art, and those files are committed and treated as source from then on. `og` picks
 * them up if they are there and falls back to its own isometric drawing if they are not, which is
 * what keeps a new article from blocking on an API key.
 *
 * Only the object comes from the model, on a transparent background. The frame around it — the
 * ground, the glow, the accent, the 1200 by 630 — stays ours, because that is what makes sixty
 * separately generated pictures look like one set rather than sixty.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import puppeteer from 'puppeteer-core';

const ROOT = resolve('.');
/*
 * Source, not output: these are the model's own renders, kept out of public/ deliberately. In
 * public/ they would be served to every visitor and shipped in every deploy — 74 MB of 1024px PNGs
 * nobody asked for — when the only thing that needs them is `npm run og`, at build time, to
 * composite each one onto a cover.
 */
const OUT = join(ROOT, 'content', 'og-art');

/*
 * The key lives in .env.local, which this reads by hand: the script is plain Node with no bundler
 * and no dotenv, the same reason `og-images.mjs` writes out its own locale list.
 */
function keyFromEnvFile() {
  const path = join(ROOT, '.env.local');

  if (!existsSync(path)) {
    return undefined;
  }

  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*OPENAI_API_KEY\s*=\s*(.+)\s*$/);

    if (match) {
      return match[1].replace(/^["']|["']$/g, '');
    }
  }

  return undefined;
}

const KEY = process.env.OPENAI_API_KEY ?? keyFromEnvFile();

if (!KEY) {
  console.error(
    'No OPENAI_API_KEY. Add it to .env.local — it is only needed here, never at runtime.'
  );
  process.exit(1);
}

/*
 * One style block, repeated word for word in every prompt.
 *
 * This is the whole reason the set holds together. An image model drifts between calls, so
 * everything that must not drift is stated the same way every time: the projection, the light, the
 * surface, the framing, and the palette as a single hue. The negatives are not decoration either —
 * left to itself the model writes labels on things, and garbled lettering is exactly what these
 * covers exist to avoid.
 */
const STYLE = [
  'Clean isometric 3D render, viewed from the upper-left corner at a 30 degree angle.',
  'Smooth matte surfaces with softly rounded edges, gentle ambient occlusion, one clear light from the upper left and a thin brighter rim along the top edges.',
  'Strictly monochrome: only shades of {COLOUR}. Muted and desaturated, in the mid-to-dark range — this sits on a near-black page, so it must read as a quiet object lit in a dark room, not a bright pastel toy. Deep shadow tones, a restrained mid tone, and only small pale highlights on the top edges. No other hue anywhere.',
  'A single object, centred, filling about 70 percent of the frame with even margins on all sides. No floor, no wall, no room, no props around it.',
  'The background is a perfectly flat, uniform, very dark near-black field, hex #0F0E14, filling every pixel the object does not cover. Nothing else in the background: no gradient, no vignette, no glow, no texture, no horizon line. A soft contact shadow directly beneath the object is welcome.',
  'Absolutely no text, no letters, no numbers, no symbols, no logos, no watermarks, no user interface labels of any kind.',
].join(' ');

/** The same stable hash `og-images.mjs` uses, so a slug always lands on the same variant. */
function seedOf(slug) {
  let h = 2166136261;

  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }

  return h >>> 0;
}

/*
 * What each article is a picture of.
 *
 * The same topic mapping `og-images.mjs` uses for its drawn fallback, so the two never disagree
 * about what an article is about — written here as the sentence a model needs rather than as
 * boxes and cylinders.
 */
const BY_TOPIC = [
  /*
   * Broad buckets carry several subjects rather than one.
   *
   * Twenty subjects across sixty-three articles is fine until you notice where the repeats fall:
   * every "best X converter" matched one rule and the index showed three magnifying glasses in a
   * row, next to three near-identical titles. So the widest buckets — comparisons, and the plain
   * "one format into another" pieces that are most of this blog — spread across a few subjects
   * picked by the slug's own hash.
   */
  [/obsidian|vault|wikilink/, 'a cluster of glossy spheres of two sizes joined by slender rods into a knowledge graph, one larger sphere at its centre'],
  [/confluence|wiki|documentation-that-lives|static-site/, 'an open book with softly curved pages and a ribbon bookmark, a few loose pages lifting from it'],
  [/notion|zip|archive|export/, 'a sturdy storage box with its lid lifted off and floating just above it, several document pages rising out of the open box'],
  [/summar|assistant|chatgpt|mcp|ai-output/, 'a rounded cube with a large four-pointed sparkle hovering above it and two smaller sparkles beside it'],
  [/excel|csv|tsv|spreadsheet|table/, 'a spreadsheet slab built from a neat grid of raised square cells, a few cells standing taller than the rest like a small bar chart'],
  [/json|database/, 'three stacked cylindrical discs forming a database, with a small ring of cables looping out of one side'],
  [/command-line|\bcli\b|terminal|pandoc/, 'a chunky monitor on a small stand, its screen showing a few simple raised bars and a single blinking caret block'],
  [/github-actions|automat|batch|publish-markdown-from/, 'two interlocking cog wheels of different sizes, the larger one lying at an angle'],
  [/\bapi\b|connector/, 'a rounded plug sliding into a socket block, a short looping cable trailing from it'],
  [/safe|saniti|xss|secure/, 'a rounded shield standing upright with a raised check mark on its face and a row of small studs along its rim'],
  [/share|link|shareable/, 'two thick interlocking rings, one passing through the other, with a small sphere resting where they meet'],
  [/merg|combine|many-markdown/, 'three flat document plates funnelling into one larger plate below them, arrows implied by their angle'],
  [/escap|syntax|footnote|flavour|commonmark|line-breaks|code-blocks|front-matter/, [
    'two facing curly brace shapes carved as thick solid blocks, with a small cube floating between them',
    'a row of small tiles standing on edge, one of them flipped over to face the other way',
    'a short chain of linked cubes with one cube lifted slightly out of line',
  ]],
  [/editor|vs-code|typora|dillinger|stackedit|live-preview|in-javascript|in-python/, [
    'a wide monitor on a stand, its screen carrying a few raised bars and a small floating panel drifting off one corner',
    'a laptop standing half open, a few raised bars on its screen',
    'a floating rectangular window panel with a thick cursor arrow resting on it',
  ]],
  [/best-|compare|alternative|choosing|converters|what-not-to-keep/, [
    'a magnifying glass with a thick rim hovering over a flat slab, a few raised bars visible through its lens',
    'a balance scale with a small cube resting on each of its two pans',
    'a three-step podium with a small rounded cube standing on the tallest step',
    'two flat panels standing side by side with a thin gap between them, the left one raised slightly higher',
  ]],
  [/release-notes|changelog|schedule/, 'a round clock lying at an angle with simple raised hands, a small stack of pages beside it'],
  [/repo|folder|docs-in|how-to-open|open-md/, 'an open folder with three documents rising out of it in a fan'],
  [/google-docs|cloud|web-page|save-a-web|online-document/, 'a rounded cloud with a document page descending from it on a small arrow'],
  [/workflow|toolbox|mammoth|turndown|libraries/, [
    'an open toolbox with a thick handle, a few simple tools standing up inside it',
    'a short segment of conveyor belt with a small box riding on it',
    'three thick tubes joined into a pipeline, a small cube travelling through the middle one',
  ]],
  [/pdf|word|docx|plain-text|html|markdown-to/, [
    'a stack of three flat document pages offset from each other, the top one lifting away',
    'a single document page curling and folding into a different shape in mid-air',
    'two document pages facing each other with a small thick arrow block between them',
    'a document page sliding out of a narrow slot in a solid block',
  ]],
];

const FALLBACK = 'a stack of three flat document pages offset from each other, the top one lifting away';

/* The accent per tag, named rather than given as a hex: a model reads a word, not a number. */
const COLOURS = {
  Converting: 'teal cyan',
  Syntax: 'periwinkle blue',
  Publishing: 'warm amber',
  Automation: 'mint green',
  Safety: 'coral red',
  Workflow: 'violet purple',
  Code: 'sky blue',
};

const DEFAULT_COLOUR = COLOURS.Converting;

/*
 * The pages that are not articles.
 *
 * They have no frontmatter to read a topic from, so a hash was picking their subject — which put a
 * knowledge graph on the front page, a picture that belongs to an article about Obsidian and says
 * nothing about a converter. Named here instead, with the same accent `og-images.mjs` gives each
 * one, so the whole site shares one set rather than the blog having a set and everything else
 * having whatever came up.
 */
const PAGES = {
  home: ['a flat document page on the left and a structured slab of stacked bars on the right, with a thick chevron arrow block between them pointing right', 'teal cyan'],
  blog: ['a small stack of closed books lying flat with one open book resting on top of them', 'periwinkle blue'],
  docs: ['a thick manual standing upright with a ribbon bookmark trailing from it', 'sky blue'],
  about: ['three rounded cubes of different sizes grouped closely together', 'violet purple'],
  contact: ['a paper envelope lying at an angle with its flap slightly open', 'violet purple'],
  privacy: ['a chunky padlock with a rounded body and a thick shackle, closed', 'coral red'],
  terms: ['a folded document with a round seal disc pressed onto its corner', 'coral red'],
  cookies: ['a round cookie-shaped disc with a few raised round chips on its top face', 'coral red'],
};

function frontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const data = {};

  if (!match) {
    return data;
  }

  for (const line of match[1].split(/\r?\n/)) {
    const at = line.indexOf(':');

    if (at > 0) {
      data[line.slice(0, at).trim()] = line.slice(at + 1).trim().replace(/^["']|["']$/g, '');
    }
  }

  return data;
}

function subjectFor(slug) {
  if (PAGES[slug]) {
    return PAGES[slug][0];
  }

  for (const [pattern, subject] of BY_TOPIC) {
    if (pattern.test(slug)) {
      return Array.isArray(subject)
        ? subject[seedOf(slug) % subject.length]
        : subject;
    }
  }

  return FALLBACK;
}

async function draw(slug, colour) {
  const prompt = `${subjectFor(slug)}. ${STYLE.replace('{COLOUR}', colour)}`;

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt,
      size: '1024x1024',
      quality: 'high',
      output_format: 'webp',
      n: 1,
    }),
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${await response.text()}`);
  }

  const body = await response.json();
  const b64 = body.data?.[0]?.b64_json;

  if (!b64) {
    throw new Error(`no image came back: ${JSON.stringify(body).slice(0, 300)}`);
  }

  return Buffer.from(b64, 'base64');
}

/*
 * Why there is no chroma key here.
 *
 * The first attempt asked for a flat magenta backdrop and cut it out in a canvas. It worked on the
 * teal objects and destroyed the violet one: magenta and violet are neighbours, so the key ate the
 * subject. Any single key colour has the same problem against a palette of seven hues.
 *
 * So the background stays in the picture, asked for as the page's own near-black, and the cover
 * fades the square's edges into that same ground — a mismatch of a few values disappears in the
 * fade, where a keyed edge would have left a coloured fringe.
 */
/*
 * What comes back from the model is a 1024px image at full quality: about a megabyte each, 70 MB
 * across the set, for something the cover then draws at 560px. So each one is shrunk on the way in.
 * Done in the browser that already draws the covers rather than with an image library, for the same
 * reason `og-images.mjs` renders there: a canvas is three lines and needs no new dependency.
 */
const CHROME =
  process.env.CHROME_PATH ??
  {
    darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    win32: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  }[process.platform] ??
  'google-chrome';

const SAVED_AT = 768;

async function shrink(page, image) {
  const smaller = await page.evaluate(
    async (url, size) => {
      const picture = new Image();

      await new Promise((done) => {
        picture.onload = done;
        picture.src = url;
      });

      const canvas = document.createElement('canvas');

      canvas.width = size;
      canvas.height = size;
      canvas.getContext('2d').drawImage(picture, 0, 0, size, size);

      return canvas.toDataURL('image/webp', 0.86);
    },
    `data:image/webp;base64,${image.toString('base64')}`,
    SAVED_AT
  );

  return Buffer.from(smaller.split(',')[1], 'base64');
}

const articles = readdirSync(join(ROOT, 'content', 'blog'))
  .filter((name) => name.endsWith('.md'))
  .map((name) => name.replace(/\.md$/, ''));

const asked = process.argv.slice(2);
const pages = Object.keys(PAGES);
const wanted =
  asked.length > 0 ? asked : [...articles, ...pages];

mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
const page = await browser.newPage();

let drawn = 0;
let skipped = 0;

for (const slug of wanted) {
  const file = join(OUT, `${slug}.webp`);

  // Never redraw by accident: these cost money and cannot be reproduced.
  if (asked.length === 0 && existsSync(file)) {
    skipped += 1;
    continue;
  }

  if (!articles.includes(slug) && !PAGES[slug]) {
    console.error(`${slug}: neither an article nor a page`);
    continue;
  }

  const colour = PAGES[slug]
    ? PAGES[slug][1]
    : COLOURS[
        frontmatter(readFileSync(join(ROOT, 'content', 'blog', `${slug}.md`), 'utf8')).tag
      ] ?? DEFAULT_COLOUR;

  try {
    writeFileSync(file, await shrink(page, await draw(slug, colour)));
    drawn += 1;
    console.log(`drew ${slug} (${colour})`);
  } catch (cause) {
    console.error(`${slug}: ${cause.message}`);
  }
}

await browser.close();

console.log(`\n${drawn} drawn, ${skipped} already there, in content/og-art`);
