import type { Locale } from './i18n/locales';

/*
 * What has shipped, one entry per thing a reader would notice.
 *
 * A typed array rather than the Markdown file this replaced. The file read well in the repository
 * and could not carry what a card needs: an entry has a date that has to sort and be handed to
 * `Intl`, and a version only when it shipped in a tagged release. Both were prose in the headings
 * — "9 September 2026" — so the page could not order entries without parsing an English month
 * name, and the sitemap got no date at all.
 *
 * The body stays Markdown and is rendered by the product's own converter, which was the good half
 * of the file and is kept: a release note that breaks the renderer breaks a customer's document
 * too, and this is a better place to find that out.
 *
 * The rule that keeps this file true is in CLAUDE.md: a tagged release is not shipped until its
 * entry is here, and anything a person using the product would notice gets an entry between tags.
 * Nothing enforces it — a missing entry breaks no build, which is exactly why it is written down.
 *
 * English, deliberately. The chrome around these is translated; five translations per entry is a
 * cost that gets skipped after the second release, and `src/lib/i18n/content.ts` draws the same
 * line for the blog.
 */
export interface ChangelogEntry {
  /** ISO, and the only order that matters: the page sorts on it rather than trusting this list. */
  date: string;
  /** The tag it shipped in, where there is one. Most entries shipped between tags. */
  version?: string;
  title: string;
  /** Markdown. Kept to a few sentences — a card that needs scrolling is an article. */
  body: string;
  /**
   * The address of this entry's own page, when it has earned one.
   *
   * Optional, and most entries will never have it. A slug means there is more to say than a card
   * should hold — what the thing does, why it works the way it does, what it replaced — and that
   * the words are worth a page a search engine can land somebody on. An entry with no slug is a
   * card and nothing else, which is what a changelog mostly is.
   *
   * Kebab-case, unique, and permanent once shipped: it is a URL from the day it deploys.
   */
  slug?: string;
  /**
   * The long version, by language. Required wherever there is a slug and meaningless without one.
   *
   * English is not optional and the rest are: this is the one place the English-only rule bends,
   * because a release note that somebody searched for is worth having in their language, and there
   * are a handful of these rather than one per release. A language with nothing written falls back
   * to English, which is what the reader would have got anyway.
   */
  detail?: ChangelogDetail;
}

/** One entry's page, in English and in whatever else somebody has written. */
export type ChangelogDetail = { en: ChangelogDetailText } & Partial<
  Record<Locale, ChangelogDetailText>
>;

export interface ChangelogDetailText {
  /**
   * Markdown, capped at DETAIL_LIMIT characters, and the cap is the point: this is the piece a
   * reader arrives at from a search, and the question it answers is "what is this and does it help
   * me". Past three thousand characters it stops answering that and starts being an article, which
   * is what content/blog is for.
   */
  body: string;
  /** 100-165 characters, like the blog's, and checked at build time for the same reason. */
  description: string;
  /** Comma-separated. The phrases somebody would have typed, not the words. */
  keywords: string;
}

/** What a detail page may weigh. See `detail` — past this it is an article, not a release note. */
export const DETAIL_LIMIT = 3000;

const ENTRIES: ChangelogEntry[] = [
  {
    date: '2026-09-18',
    title: 'The blog reads in French',
    body:
      'Thirty more articles now exist in French alongside the English and German, and the rest are '
      + 'on their way. They are written rather than machine-translated: the prose is rebuilt, and '
      + 'the search terms are the ones a French reader actually types.',
  },
  {
    date: '2026-09-18',
    title: 'Publishing a public link waits for a confirmed address',
    body:
      'Sharing a document with named people works as it always has, whether or not the address on '
      + 'the account has been confirmed. Publishing one to a link anybody can open now asks for '
      + 'the confirmation first — on every route that can do it, which was the actual bug: two of '
      + 'the three were not asking.',
  },
  {
    date: '2026-09-18',
    title: 'A daily limit on share notices, and a rate limit on the rest',
    body:
      'An account may send fifty share notices a day. Adding somebody to a document still works '
      + 'past that — they simply get no email about it. The app\'s own endpoints are now rate '
      + 'limited the way the public API has always been, so a script in a loop gets a 429 instead '
      + 'of everything it asks for.',
  },
  {
    date: '2026-09-18',
    title: 'Install it, and it works without a network',
    slug: 'install-as-an-app',
    detail: {
      en: {
        description:
          'TransformPipe installs as an app in Chrome, Edge and Safari, opens in its own window, and converts documents with no connection at all.',
        keywords:
          'offline markdown converter, install markdown converter as an app, markdown to html without internet, progressive web app document converter, convert documents offline',
        body: `The browser now offers to install TransformPipe: its own window, its own icon in the dock or the Start menu, no address bar. Chrome and Edge show an install button in the address bar; Safari on macOS and iOS uses **Add to Dock** and **Add to Home Screen**.

### Why it works with no connection

Every conversion here has always run in the browser — the Markdown parser, the HTML reader, the \`.docx\` and \`.xlsx\` readers, the zip reader for a Notion or Obsidian export. None of them ever needed a server, which is the same reason nothing you convert is uploaded. Installing simply removes the last thing that needed the network: fetching the page itself.

So an installed copy opened on a plane, on a train, or on a locked-down machine starts, accepts a file, converts it, and downloads the result. A page you visited before is cached at its own address, so the documentation and the articles you have read are there too.

### What still needs the network

Anything that involves the account: the saved document list, saving, sharing, the AI summary, and signing in. Those are asked for the moment you use them, and say so plainly when there is no connection rather than hanging.

Nothing about the account's data is cached — \`/api\` is never stored, and neither is a shared document at \`/s/\`. A cache that held somebody's documents on a shared machine would be a worse bargain than a slower page.

### It changes nothing if you do not install it

The site is the same site. Installing is an option the browser offers once the page says it is installable; ignoring it costs nothing, and uninstalling leaves no trace beyond the browser's own cache.`,
      },
    },
    body:
      'Chrome, Edge and Safari now offer to install TransformPipe as an app — its own window, its '
      + 'own icon, no address bar. Opened with no connection it still starts and still converts: '
      + 'every conversion runs in the browser anyway. Documents on the account need the network, '
      + 'as they always did.',
  },
  {
    date: '2026-09-18',
    title: 'A document in a chat looks like a document',
    slug: 'assistant-connector-cards',
    detail: {
      en: {
        description:
          'The TransformPipe connector draws a real card for a document an assistant saves or opens — name, size, counts, first lines, and a button that opens it.',
        keywords:
          'mcp connector document converter, claude markdown connector, convert documents from an assistant, mcp apps card, save a document from a chat',
        body: `Connect TransformPipe to an assistant and ask it to convert or keep something, and the answer is a card rather than a paragraph: the document's name, what it weighs, its word and heading counts, its opening lines, and a button that opens it on the site.

### What changed

The connector always returned the facts; it returned them as sentences, which is what a tool result is. A chat full of "Saved as report.md, 12 KB, id 3f1a…" is a chat you have to read carefully to use. Now:

- Saving or converting a document draws the document.
- Asking what is on the account draws a list whose rows open, instead of printing an id per line.
- A delete that has not been confirmed draws the document it is about to remove, by name, with the button that removes it — which is the one place where "are you sure" should show you the thing rather than its id.

### It degrades to what it was

An assistant that does not draw these yet gets exactly the sentences it always did. The card is an extra payload alongside the text, not instead of it, so nothing breaks and nothing is missing — a host learns to draw it and the same connector starts looking different.

### What the connector can do

Convert in either direction, save, list, search, summarise, share — privately, by link, or to named addresses — read a document's version history, and report what the account is using. A read-only connection is genuinely read-only: it cannot save, share or delete, and that is enforced on the credential rather than on the tools.

Connect it at \`https://transformpipe.com/api/mcp\`. It signs in with your account; nothing is shared with the assistant's operator.`,
      },
    },
    body:
      'An assistant that saves or opens a document through the connector can now draw a card for '
      + 'it — the name, what it weighs, the counts, the first lines, and a button that opens it '
      + 'here — instead of a paragraph of text. Asking what is on the account draws a list whose '
      + 'rows open the document rather than printing an id per line, and a delete that has not been '
      + 'confirmed draws the document it would remove, by name, with the button that removes it. '
      + 'Hosts that do not draw cards yet get the same sentences they always did.',
  },
  {
    date: '2026-09-18',
    title: 'Contact is Support, and it opens on the form',
    body:
      '`/contact` is now `/support`, and the first thing on it is two fields: what happened, and '
      + 'what you expected. The button opens a GitHub issue with both already written into it — '
      + 'nothing is sent from the page, and the issue exists once you press Submit there. The old '
      + 'address redirects, so a link to it still lands in the right place.',
  },
  {
    date: '2026-09-18',
    title: 'Words that CSS held apart stay apart',
    body:
      'A row like `39 words · 1 heading · 1 table` is usually built as separate elements with the '
      + 'space between them coming from the layout rather than from the markup — so it converted as '
      + '`39words1heading1table`. The extension now reads the page with its layout in hand and puts '
      + 'those spaces back before converting. Stat rows, tag lists and breadcrumbs come out as '
      + 'sentences again.',
  },
  {
    date: '2026-09-18',
    title: 'A document somebody shared with you is a document',
    body:
      'The page a share link opens now carries the same card every other screen puts above a '
      + 'document — the name, what it weighs, when it was made, and the counts — instead of a line '
      + 'of small print. **Save a copy** puts it on your own account, **Share** publishes that copy, '
      + 'and **Copy Markdown** takes the text. Signed out, those buttons open the sign-in dialog '
      + 'rather than sitting there disabled.',
  },
  {
    date: '2026-09-18',
    title: 'The connector says who it is',
    body:
      'An assistant adding TransformPipe as a connector now sees its icon, its name and a sentence '
      + 'about what it does before connecting, rather than after. Nothing about an account is '
      + 'readable without signing in — that has not changed.',
  },
  {
    date: '2026-09-17',
    title: 'A browser extension',
    slug: 'browser-extension',
    detail: {
      en: {
        description:
          'The TransformPipe extension turns the page you are reading into Markdown from the toolbar — in Chrome, Edge and Firefox, with nothing uploaded.',
        keywords:
          'markdown converter chrome extension, save web page as markdown, html to markdown browser extension, convert article to markdown, web clipper markdown, firefox markdown extension',
        body: `Press the toolbar button and the page you are reading comes back as Markdown — the article, without the navigation, the sidebar, the newsletter box or the cookie notice. Copy it, download the \`.md\`, or take the whole page as a single self-contained \`.html\` file with its pictures embedded, which opens anywhere with no connection at all.

### What it does that a copy and paste does not

A web page is not a document. Selecting an article and pasting it into an editor brings the menus with it, loses the table structure, and turns every code block into prose. The extension reads the page the way a reader sees it: it finds the article, drops the furniture, keeps the headings, the tables, the lists and the code fences, and puts back the spaces that CSS was holding — a row of stats laid out as flex items serialises as \`39words\` in every other clipper, and arrives here as "39 words".

Selecting part of the page first converts the selection instead of the article, which is the fastest way to lift one table out of a documentation page.

### The side panel

The same thing, kept open beside the page. It converts each tab as you arrive at it, so moving through a set of search results means reading the Markdown of each one rather than pressing a button per page. It remembers whether you prefer the panel or the popup.

### All ten conversions, offline

The extension carries the site's converters rather than calling it: Markdown to HTML, HTML to Markdown, \`.docx\`, \`.csv\`, \`.xlsx\`, JSON, plain text, a Notion or Confluence export, an Obsidian vault. Nothing is uploaded, nothing needs a network, and none of it depends on an account.

### With an account

Signed in, **Save** puts the document on the account and **Share** opens the same dialogue the site has: private, anybody with the link, or named addresses who each sign in. The extension asks for no host permissions — it can only read a page at the moment you press the button, which is what \`activeTab\` means and why the permission list is as short as it is.

Chrome and Edge install it from the Web Store; Firefox from its own listing.`,
      },
    },
    body:
      'The page you are on, as Markdown, without leaving it: press the button in the toolbar and '
      + 'the article comes back without the navigation, the sidebar or the cookie notice. Copy it, '
      + 'download it, or save the page as a self-contained `.html` file with its pictures inside. '
      + 'The side panel is the same thing kept open beside the page, converting each tab as you '
      + 'arrive at it, and the ten conversions the site has run inside the extension too — nothing '
      + 'is uploaded and none of it needs a network. Signed in, Save and Share put a document on '
      + 'your account and publish a link or name the people who may read it. '
      + '[What it is and what it never does](/extension).',
  },
  {
    date: '2026-09-17',
    title: 'A shared document says where it came from',
    body:
      'Somebody who opens a link you shared now finds a line at the foot of it about what made the '
      + 'page, and a way to convert something of their own. The downloaded `.html` carries the same '
      + 'line, quietly, in its footer. Nothing about the document itself changed.',
  },
  {
    date: '2026-09-17',
    title: 'Your documents, two letters away',
    body:
      '`⌘K` now opens on the five documents you converted last, and typing searches them by name '
      + 'alongside the conversions and the pages — every document in the list, not only the five. '
      + '`See all documents` goes to the history.',
  },
  {
    date: '2026-09-17',
    title: 'The cookie question, asked properly',
    body:
      'A banner on a first visit, with three answers of one click each: accept, only necessary, or '
      + 'open the switches. Analytics is the single optional thing on this site and it stays off '
      + 'until it is allowed — before an answer, Google’s tags write nothing to your browser. The '
      + 'answer is kept in this browser, so the banner is asked once; the button at the foot of the '
      + '[cookies page](/cookies) reopens it, and the privacy and cookies pages now say all of this.',
  },
  {
    date: '2026-09-16',
    title: 'A bar you can type into',
    body:
      'The header is rebuilt around a search box: press `⌘K` — `Ctrl K` away from a Mac — and every '
      + 'conversion and every page in the app is two letters away. The bar itself now sits under the '
      + 'page rather than on top of it, the conversion you are on is the first thing on it, and the '
      + 'trail saying where you are moved out of the page and into a line of its own underneath.',
  },
  {
    date: '2026-09-16',
    title: 'A new mark',
    body:
      'The name is now a drawing rather than six characters of monospace: a `T` and a `p` sharing '
      + 'one stem. The same pair, on its own, is the icon — so the tab, the bookmark, the phone '
      + 'home screen and the Android launcher all get a real icon instead of a letter the browser '
      + 'guessed at.',
  },
  {
    date: '2026-09-14',
    title: 'An Obsidian vault, in one document',
    slug: 'obsidian-vault-to-markdown',
    detail: {
      en: {
        description:
          'Zip an Obsidian vault, drop it on TransformPipe, and get one Markdown document back — every note in order with a table of contents, converted in your browser.',
        keywords:
          'obsidian vault to markdown, export obsidian notes to one file, merge obsidian notes, obsidian to html, convert obsidian wikilinks',
        body: `Zip the vault folder, drop it, and get one Markdown document back: every note in order, each under its own heading, with a table of contents at the top. From there it is one step to HTML, to a \`.docx\`, to a PDF, or to a link somebody else can open.

### What it is for

A vault is a good place to write and an awkward place to hand something over. Sending somebody two hundred files is not sending them anything; this makes the readable object that a vault does not have — one document you can print, publish, attach, or read on a phone.

### Wikilinks

\`[[Some note]]\` keeps its words and drops its address. Once every note is one document there is nowhere for the link to point: the file it named is now a heading in the same page. Keeping a dead link that looks live is worse than keeping the phrase, so the phrase is what survives. An ordinary Markdown link to an outside address is untouched.

### What is skipped

Anything that is not a note: \`.obsidian/\` and its settings, attachments, templates that are not written as notes, and the plugins' own data. Nested folders keep their order, so a vault organised by folder reads in the order it was organised in.

### Nothing is uploaded

The archive is unpacked and converted in your browser. A vault is usually somebody's private notes, and the only safe way to convert private notes is not to send them anywhere — which is the same reason this site has no upload step for any of its ten conversions.`,
      },
    },
    body:
      'A tenth conversion: drop a zipped Obsidian vault and get one Markdown document back — every '
      + 'note in order, with a table of contents. `[[Wikilinks]]` keep their words; merged into one '
      + 'document there is nowhere left for them to point, so the address does not carry over, the '
      + 'same rule this app already applies to a Notion or Confluence export.',
  },
  {
    date: '2026-09-14',
    title: 'Plain text and Excel, converted honestly',
    body:
      'Two more conversions. Raw text → Markdown escapes Markdown\'s own characters before '
      + 'converting, so a `.txt` file with a literal asterisk or underscore in it comes out saying '
      + 'the same thing rather than gaining accidental emphasis — `.txt` used to be accepted on '
      + 'Markdown → HTML as though it already were Markdown, and no longer is. Excel → Markdown '
      + 'table turns an `.xlsx` workbook into one table per sheet, with a table of contents once '
      + 'there is more than one.',
  },
  {
    date: '2026-09-14',
    title: 'Notion and Confluence exports, in one document',
    slug: 'notion-and-confluence-exports',
    detail: {
      en: {
        description:
          'Drop a Notion or Confluence export .zip on TransformPipe and get one Markdown document back — every page in order, with a table of contents.',
        keywords:
          'notion export to markdown, confluence to markdown, convert notion zip to markdown, confluence space export html to markdown, merge notion pages into one document',
        body: `Both tools export a folder of files, one per page, with names nobody chose. Two conversions read that folder and give back a single Markdown document instead: every page in order, under its own heading, with a table of contents at the top.

### Notion

Export a page or a workspace with **Export as Markdown & CSV**, include subpages, and drop the \`.zip\` exactly as it downloaded. Notion appends a 32-character id to every file name; those come off. A database exported alongside a page arrives as a \`.csv\` and becomes a Markdown table in place, where the page referred to it.

### Confluence

Export a space with **Export → HTML** and drop that \`.zip\`. Confluence's HTML carries a great deal of furniture — breadcrumbs, the page tree, the footer with the export date, the attachment table — and none of it is content, so none of it survives. Macros that render to text keep their text; macros that render to a Confluence-only widget do not.

### Links between pages

A link from one exported page to another keeps its words and loses its address. Merged into one document there is nowhere left for it to point: the file it named does not exist any more, and a link to a missing file is worse than a phrase. The same rule applies to an Obsidian vault's \`[[Wikilinks]]\`, which are the same problem in a different syntax.

### It runs in your browser

The zip is read, unpacked and converted on your own machine. Nothing is uploaded, which matters more here than usual: a Confluence space export is a company's internal documentation, and the shortest safe path for it is the one that never leaves.`,
      },
    },
    body:
      'Two new conversions: drop the .zip from Notion\'s "Export as Markdown & CSV" or a '
      + 'Confluence space\'s "Export → HTML", and get one Markdown document back — every page in '
      + 'order, with a table of contents, a Notion database included as a table. A link from one '
      + 'page to another in the export keeps its words; merged into one document there is nowhere '
      + 'left for it to point, so the address does not carry over.',
  },
  {
    date: '2026-09-11',
    title: 'A PDF from the API, without a browser',
    slug: 'markdown-to-pdf-api',
    detail: {
      en: {
        description:
          'GET /api/v1/documents/:id.pdf turns a saved Markdown document into a PDF on the server — no headless Chrome, no build step, one authenticated request.',
        keywords:
          'markdown to pdf api, convert markdown to pdf without a browser, md to pdf command line, generate pdf in ci, markdown to pdf rest api',
        body: `\`GET /api/v1/documents/:id.pdf\`, with an API key, returns a laid-out PDF of a saved document. It is meant for the case that has no browser in it: a scheduled job, a CI step that attaches a report to a release, a script that mails a weekly summary.

### Why this exists separately from printing

Most Markdown-to-PDF tools are a headless Chrome in a trench coat. That gives an exact rendering and costs a browser: several hundred megabytes of dependency, a sandbox to keep it in, a start-up per request, and a memory ceiling that a long document reaches before a person does. None of that fits inside a serverless function, and a service that quietly starts a browser per request is a service that is slow and expensive for the one case that could have been neither.

This lays the document out directly — headings, paragraphs, lists, tables, code blocks and rules — with no browser anywhere in the path. It starts immediately and finishes in milliseconds.

### What it is not

It is not a pixel-for-pixel copy of the preview. The app's own **Print or save as PDF** still uses the browser's own rendering, which is exact, and that has not changed: if you want the page as you see it, print it. If you want a PDF from a machine, ask for one.

### Using it

    curl -H "Authorization: Bearer tp_live_…" \\
      https://transformpipe.com/api/v1/documents/<id>.pdf -o report.pdf

The same document is available as \`.docx\`, \`.html\` and \`.md\` by changing the extension, so one saved document is four formats without a second conversion.`,
      },
    },
    body:
      '`GET /api/v1/documents/:id.pdf` lays a document out as a PDF on the server, for a script '
      + 'or a CI job that has no browser to print from. The app itself still uses "Print or save '
      + 'as PDF" for that — it is the browser\'s own, exact rendering, and this does not replace it.',
  },
  {
    date: '2026-09-11',
    title: 'Download a saved document as Word',
    slug: 'markdown-to-word',
    detail: {
      en: {
        description:
          'Convert Markdown to a real .docx on TransformPipe: headings, tables, lists and code survive, and Word opens it without a plugin or a headless browser.',
        keywords:
          'markdown to word, convert md to docx, markdown to docx converter, download markdown as word document, markdown table to word',
        body: `A saved document can be downloaded as a \`.docx\`, built from the same HTML the preview already shows. Word, Pages, LibreOffice and Google Docs all open it as an ordinary document — headings are Word headings, tables are Word tables, lists nest, and code keeps its monospace.

### What survives the trip

Headings one to six, paragraphs, bold and italic, ordered and unordered lists with their nesting, tables with their header row, block quotes, horizontal rules, links with their text and their address, and fenced code. What does not: anything that only exists in a browser — a live embed, a collapsible section, a mermaid diagram that was never rendered to an image.

Remote images are deliberately left out. A converter that fetches every picture a document mentions is a converter that makes a request to any address the document's author chose, and the trade — a picture, for a server that follows strangers' links — is not worth making.

### Why it needs a save first

The conversion runs on the account's copy of the document, which is what the download endpoint reads. Converting a file you have only just dropped is the browser's job and does not involve the account at all; \`.docx\` is the one direction that does.

### The other direction

Dropping a \`.docx\` on the converter reads it back into Markdown — headings, tables, lists and all — which is the round trip most people actually want: a Word document out of a colleague's mailbox, into Markdown, into a repository.

### From a script

\`GET /api/v1/documents/:id.docx\` with an API key returns the same file, for a build that publishes documentation as Word for people who want it that way.`,
      },
    },
    body:
      'The download menu on a saved document now offers a `.docx`, built on the spot from the '
      + 'same HTML the preview already renders. No headless browser involved — it needs a save '
      + 'first, since the conversion runs on the account\'s copy.',
  },
  {
    date: '2026-09-11',
    title: 'Webhooks: a signed notice when a document is created or shared',
    body:
      'Account menu → Webhooks registers a URL that gets a signed POST for two events, '
      + '`document.created` and `document.shared`. Session-only to manage, on purpose — it stays '
      + 'off the scriptable API, so a leaked API key cannot turn into a standing feed of every '
      + 'document that comes after it.',
  },
  {
    date: '2026-09-11',
    title: 'Link a document to an earlier one, and see what changed',
    body:
      'A push can now say it is a new version of an earlier document — `?replaces=` in the API, '
      + '`--replaces` from the CLI, a `replaces` input in the Action. It is opt-in: nothing links '
      + 'documents on its own, and a plain push stays the unrelated document it has always been. '
      + 'Linked documents get a chain icon in the history and a line-by-line diff against the '
      + 'version before them.',
  },
  {
    date: '2026-09-11',
    title: 'History search now looks inside your documents',
    body:
      'Searching your history used to match file names only. Signed in, it now also finds a '
      + 'document by what is written inside it — the name box still works exactly as before, it '
      + 'just stops being the only way in.',
  },
  {
    date: '2026-09-11',
    title: 'A Summary tab, generated once and kept',
    body:
      'A saved document now has a third tab beside Preview and Markdown: three to five sentences '
      + 'that say what it says, so you can tell what something is without opening it. The first '
      + 'open generates it; after that, reading it again is free. Regenerate is one click, for a '
      + 'document that has moved on since.',
  },
  {
    date: '2026-09-11',
    title: 'Nothing reaches your account until you save it',
    slug: 'conversions-stay-in-your-browser',
    detail: {
      en: {
        description:
          'Converting a file on TransformPipe no longer touches your account: the conversion stays in your browser until you press Save, and signing in uploads nothing.',
        keywords:
          'convert documents without uploading, private markdown converter, does an online converter upload my file, browser based document conversion, secure file converter',
        body: `Converting a file used to put it in your account. Drop something, look at it, close the tab — and it was there, along with everything else you had ever glanced at. Signing in was worse: whatever that browser had converted went up in one go, so twenty-five things you had looked at became twenty-five documents you had never asked to keep.

Now a conversion stays in the browser that made it. **Save** is what puts it in the account, and nothing else does.

### What that means in practice

- Drop a file, read it, download the result, close the tab: nothing left our machine and nothing is on the account.
- Signing in uploads nothing. The history shows what is local and what is saved, and says which is which.
- Sharing needs a saved document, because a link has to point at something that exists — and it says so, instead of the Share button being mysteriously unavailable.
- Deleting a saved document deletes it. The local copy is the browser's, and clearing site data removes it.

### Why the conversion never needed a server

Every one of the ten conversions runs in JavaScript in your browser: Markdown, HTML, \`.docx\`, \`.csv\`, \`.xlsx\`, JSON, plain text, and the zip readers for a Notion, Confluence or Obsidian export. There was never a technical reason to send the file anywhere — the upload existed because the account existed, which is the wrong way round.

An account is for the documents you decide to keep, not a record of everything you looked at. If you never sign in, this site never receives a file at all.`,
      },
    },
    body:
      'Converting a file used to put it in your account. Drop, look, close the tab — and it was '
      + 'there, along with everything else you had ever glanced at. Signing in was worse: whatever '
      + 'this browser had converted was uploaded in one go, so twenty-five things you had looked '
      + 'at became twenty-five documents you had never asked to keep.\n\n'
      + 'Now a conversion stays in this browser, and **Save** puts it in the account. The history '
      + 'shows both and says which is which; sharing still needs a saved document, and says so '
      + 'rather than being mysteriously unavailable.\n\n'
      + 'The connector and the API always worked this way — `tp_convert_markdown` saves '
      + 'nothing, `tp_save_document` saves — so this is the interface catching up with them.',
  },
  {
    date: '2026-09-11',
    title: 'Paste it, or type it and watch',
    body:
      'Everything here needed a file, which is an odd thing to ask of somebody holding the '
      + 'Markdown in their clipboard. The converter now takes pasted text as well as a dropped '
      + 'file — for every conversion except Word, where there is nothing to paste — and '
      + 'what comes back is the same document, with the same preview, download, save and share.\n\n'
      + 'And a page for the other question: `/markdown-live-preview` is Markdown on the left and '
      + 'the document on the right, as it is typed. Nothing is uploaded and nothing is saved; the '
      + 'text stays in the tab. It is the converter underneath, so what is on the right is what a '
      + 'downloaded file contains.\n\n'
      + 'Both panes take their height from the window, so a tall screen is a tall editor, and '
      + 'there is a fullscreen for when that is still not enough. Text pasted on the converter '
      + 'arrives here already rendered, and '
      + '`Convert and keep` sends it back the other way — to the document screen, with the '
      + 'history, the share link and the other formats.',
  },
  {
    date: '2026-09-11',
    title: 'Every conversion, everywhere it can go',
    body:
      'The app converted five things and the other two ways in did not. An assistant could only '
      + 'be handed Markdown, and the API refused Word outright.\n\n'
      + 'Now `tp_convert_to_markdown` takes HTML, CSV, TSV or JSON through the connector, and '
      + '`tp_save_document` takes the same with `from`, so a document is stored knowing what it '
      + 'was made from. And the API accepts a `.docx` as the request body — the one place a Word '
      + 'file can go, because a file is bytes and a tool call is JSON: an assistant never holds '
      + 'the file, only the text somebody extracted from it.',
  },
  {
    date: '2026-09-11',
    title: 'The Connect button now connects',
    body:
      'Approving an assistant did nothing. The page said the form had not come from here, and it '
      + 'was right in a way that was wrong: the approval page asked browsers not to send a '
      + 'referrer, and Chrome takes a page’s origin off the same setting — so the page’s own '
      + 'form arrived claiming to come from nowhere, and the check that stops another site '
      + 'approving things for you stopped the page itself.\n\n'
      + 'Nothing had ever been connected through it. The tests could not see this, because a test '
      + 'is not a browser and sends whichever headers it is told to; the database could, and said '
      + 'so plainly: every request shown, none ever approved.\n\n'
      + 'Behind that sat a second one. The page tells the browser it may only send you to the '
      + 'assistant that asked — and it had been saying it may send you nowhere but back to '
      + 'us, so approving worked and the trip back to the assistant was refused by the page '
      + 'itself. It now names that one address, and nothing else.',
  },
  {
    date: '2026-09-11',
    title: 'An assistant can say who it is without registering',
    body:
      'Connecting an assistant used to mean it registered itself here first, and Claude made a '
      + 'new client every time somebody connected. It can now identify itself with a metadata '
      + 'document instead — an address it publishes, which this server reads — which is '
      + 'what the MCP specification prefers. Registration still works for clients that do not.\n\n'
      + 'The approval page changed with it. It now says where a client’s description was '
      + 'published, and warns when the only place it can be sent back to is a program on your own '
      + 'computer, because anything running there can ask to be sent there too.',
  },
  {
    date: '2026-09-10',
    title: 'This page',
    body:
      'A changelog, at `/changelog` and linked from the footer. Every release and, between them, ' +
      'the changes worth naming — read from one typed list and rendered by the converter the ' +
      'product sells.',
  },
  {
    date: '2026-09-10',
    title: 'A page for an address that is not a page',
    body:
      'There was none: an unmatched address got the host’s own error page, with nothing to ' +
      'click. There is now a 404 carrying the site’s chrome and three ways out, written once ' +
      'and re-rendered in the reader’s language.\n\n' +
      'Two soft 404s came out with it. A link to an article that does not exist answered 200, ' +
      'which a crawler indexes as a real page; and `/de/history` was a plain 404 in four ' +
      'languages, so the screen worked until somebody reloaded it.',
  },
  {
    date: '2026-09-10',
    title: 'The blog in German',
    body:
      'Twenty-nine of the fifty-six articles are in German, and the blog can now be translated ' +
      'one article at a time.\n\n' +
      'The rule throughout is that a language has what it has. Its index lists only its own ' +
      'articles, an article claims an `hreflang` only for the languages that actually have text, ' +
      'and a language with nothing translated gets no index at all rather than a heading over an ' +
      'empty list. Covers are drawn per language, because the headline is part of the picture.',
  },
  {
    date: '2026-09-09',
    title: 'Email that arrives',
    body:
      'A welcome message, sent once when an account is first used, and a notice to somebody a ' +
      'document has been shared with.\n\n' +
      'Both took three attempts. The notice was wired to an endpoint the app never calls, then ' +
      'fired after the response so the request never left the function, then blocked by a key ' +
      'that was genuinely absent from the first builds. Deliverability needed DMARC, not just ' +
      'SPF and DKIM.',
  },
  {
    date: '2026-09-09',
    title: 'Signing in with an email address',
    body:
      'Google was the only way in. There is now a dialogue with sign-in, sign-up, a password ' +
      'reset and a one-time code, and an unconfirmed account is held back: no publishing by ' +
      'link, and ten documents rather than five hundred, until the address is confirmed.',
  },
  {
    date: '2026-09-09',
    title: 'Five languages',
    body:
      'The interface, the documentation and the pages of words are in English, German, French, ' +
      'Spanish and Italian, with the words in one typed catalogue and a build step that walks ' +
      'every language against English: same keys, same array lengths, nothing empty, the same ' +
      'placeholders. It found 192 missing keys on its first run.\n\n' +
      'The language is in the address — `/de/docs`, `/fr/csv-to-markdown` — and English keeps the ' +
      'bare paths, because sixty-eight pages were already indexed at them.',
  },
  {
    date: '2026-09-09',
    title: 'An embed, and the frame policy the app never had',
    body:
      '`/embed` is the converter with no chrome, for a page that wants to host it, and it talks ' +
      'to its host with `postMessage`. Adding it meant writing the rule that was missing: every ' +
      'other route now refuses to be framed at all, which nothing had said before.',
  },
  {
    date: '2026-09-09',
    title: 'The connector has its own dialogue',
    body:
      'Adding TransformPipe to an assistant used to open the API keys dialogue — a screen headed ' +
      '"API keys" with a key generator at the top, so a person who chose "MCP connector" had to ' +
      'work out they were in the right place. It is its own dialogue now, with the address, the ' +
      'one-line command and the assistants already connected.',
  },
  {
    date: '2026-09-09',
    title: 'A guard for the failures that only happen on the platform',
    body:
      'Two things had taken production down and neither could fail locally: an extensionless ' +
      'import that a bundler hides and Node refuses, and a `vercel.json` pattern that produces ' +
      'no deployment at all. Both are now checked before the build, and the guard was proved by ' +
      'reintroducing each bug.',
  },
  {
    date: '2026-09-09',
    title: 'Share an article',
    body: 'X, LinkedIn and Reddit, under the prose rather than above it — somebody shares an ' +
      'article they have read.',
  },
  {
    date: '2026-09-09',
    version: '2.0.0',
    title: 'TransformPipe, and four conversions',
    body:
      'The rename, at transformpipe.com, and four formats in rather than one: HTML, Word, CSV ' +
      'and TSV, and JSON. Each conversion has an address of its own, because "word to markdown" ' +
      'is a thing people type into a search box.\n\n' +
      'JSON picks a rendering per shape rather than one rule for everything — an array of flat ' +
      'objects becomes a table, an array of scalars a list, an object a heading per nested key, ' +
      'and anything past three levels a fenced block, because a heading at depth seven is not a ' +
      'heading.\n\n' +
      'Also: an assistant can act on an account through a connector that needs no API key ' +
      'pasted anywhere; fifty-six articles, up from twenty, each with a cover the build refuses ' +
      'to ship without; and the blog stopped being sent to everybody who opened the converter, ' +
      'which had been 952 kB of Markdown in the main bundle.',
  },
  {
    date: '2026-09-08',
    version: '1.1.0',
    title: 'A blog, and real HTML for every page',
    body:
      'Twenty articles at `/blog`, rendered by the converter they describe. An FAQ under the ' +
      'dropzone and again in the documentation, from one list.\n\n' +
      'Every page a stranger arrives on is now a real file with its own title, description, ' +
      'canonical link and structured data, plus `sitemap.xml` and `robots.txt`. And the ' +
      'downloaded `.html` became genuinely self-contained — it used to link its typeface from ' +
      'Google Fonts.',
  },
  {
    date: '2026-09-08',
    version: '1.0.0',
    title: 'Markdown in, a document out',
    body:
      'The first release. A converter with a preview, an HTML source view and a self-contained ' +
      'download; accounts and history across devices; sharing by link or by address, with a ' +
      'read-only page.\n\n' +
      'A public API with revocable keys and quotas, a dependency-free CLI, and a GitHub Action ' +
      'that comments rendered links on a pull request. Documentation at `/docs`, with ' +
      'screenshots captured from the running app.',
  },
];

/**
 * Newest first, sorted here rather than trusted from the list above.
 *
 * An entry added in the wrong place is the likeliest edit to this file, and it would put a March
 * change above a September one with nothing failing.
 */
export const CHANGELOG: ChangelogEntry[] = [...ENTRIES].sort((a, b) =>
  b.date.localeCompare(a.date)
);

/** The newest entry's date, for the sitemap. Real, unlike the deploy date. */
export const CHANGELOG_UPDATED = CHANGELOG[0].date;

export interface ChangelogMonth {
  /** `YYYY-MM`, which is what `formatMonth` turns into the reader's words. */
  key: string;
  entries: ChangelogEntry[];
}

export interface ChangelogYear {
  year: string;
  months: ChangelogMonth[];
}

/**
 * The entries as a year of months of entries, newest first at every level.
 *
 * Grouping here rather than in the page, because the prerenderer needs the same shape and the two
 * must not disagree about which month an entry falls in. Both take it from this.
 *
 * A year holds one month today and the page is built for the year it holds three: the grouping is
 * what makes a changelog readable once it is longer than a screen, and adding it later would mean
 * restructuring a page somebody had already learned.
 */
export function changelogByYear(): ChangelogYear[] {
  const years: ChangelogYear[] = [];

  for (const entry of CHANGELOG) {
    const year = entry.date.slice(0, 4);
    const key = entry.date.slice(0, 7);

    let holding = years.find((one) => one.year === year);

    if (!holding) {
      holding = { year, months: [] };
      years.push(holding);
    }

    let month = holding.months.find((one) => one.key === key);

    if (!month) {
      month = { key, entries: [] };
      holding.months.push(month);
    }

    month.entries.push(entry);
  }

  return years;
}

/** Every year with an entry in it, newest first — what a year navigation is built from. */
export const CHANGELOG_YEARS: string[] = [
  ...new Set(CHANGELOG.map((entry) => entry.date.slice(0, 4))),
];

/** Every entry that has a page of its own, newest first. */
export const CHANGELOG_PAGES: ChangelogEntry[] = CHANGELOG.filter(
  (entry) => Boolean(entry.slug)
);

/**
 * One entry's page in the language asked for, falling back to English.
 *
 * The fallback is not a failure: the rule for this file is English, and a translation is the
 * exception somebody wrote on purpose. A reader in a language nobody has written yet gets the
 * English piece under a translated heading, which is what the changelog list already does.
 */
export function detailIn(
  detail: ChangelogDetail,
  locale: Locale
): ChangelogDetailText {
  return detail[locale] ?? detail.en;
}

/** One entry by its slug, for the router and the page. */
export function changelogEntryBySlug(
  slug: string
): ChangelogEntry | undefined {
  return CHANGELOG_PAGES.find((entry) => entry.slug === slug);
}

/**
 * What is wrong with the entries, as sentences, or nothing.
 *
 * Called by the prerenderer, so a bad entry fails the build rather than shipping a page with an
 * empty body or two entries at the same address. The rules are the blog's, for the same reasons:
 * a description a search result can show whole, a body that is not endless, and one page per URL.
 */
export function changelogProblems(): string[] {
  const problems: string[] = [];
  const seen = new Set<string>();

  for (const entry of CHANGELOG) {
    const where = `${entry.date} "${entry.title}"`;

    if (!entry.slug) {
      if (entry.detail) {
        problems.push(`${where}: has a detail but no slug, so nothing can reach it`);
      }

      continue;
    }

    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(entry.slug)) {
      problems.push(`${where}: slug "${entry.slug}" is not kebab-case`);
    }

    if (seen.has(entry.slug)) {
      problems.push(`${where}: slug "${entry.slug}" is used twice`);
    }

    seen.add(entry.slug);

    if (!entry.detail) {
      problems.push(`${where}: has a slug and no detail`);

      continue;
    }

    for (const [language, text] of Object.entries(entry.detail)) {
      const said = `${where} [${language}]`;

      if (!text.body.trim()) {
        problems.push(`${said}: empty body`);
      }

      if (text.body.length > DETAIL_LIMIT) {
        problems.push(
          `${said}: body is ${text.body.length} characters, over ${DETAIL_LIMIT}`
        );
      }

      /* The page supplies the h1, so a heading in the body would be a second one. */
      if (/^#\s/m.test(text.body)) {
        problems.push(`${said}: body has a top-level heading of its own`);
      }

      const length = text.description.length;

      if (length < 100 || length > 165) {
        problems.push(`${said}: description is ${length} characters, want 100-165`);
      }

      if (text.keywords.split(',').filter((one) => one.trim()).length < 4) {
        problems.push(`${said}: keywords should be at least four phrases`);
      }
    }
  }

  return problems;
}
