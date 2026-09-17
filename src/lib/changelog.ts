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
}

const ENTRIES: ChangelogEntry[] = [
  {
    date: '2026-09-18',
    title: 'Install it, and it works without a network',
    body:
      'Chrome, Edge and Safari now offer to install TransformPipe as an app — its own window, its '
      + 'own icon, no address bar. Opened with no connection it still starts and still converts: '
      + 'every conversion runs in the browser anyway. Documents on the account need the network, '
      + 'as they always did.',
  },
  {
    date: '2026-09-18',
    title: 'A document in a chat looks like a document',
    body:
      'An assistant that saves or opens a document through the connector can now draw a card for '
      + 'it — the name, what it weighs, the counts, the first lines, and a button that opens it '
      + 'here — instead of a paragraph of text. Asking what is on the account draws a list whose '
      + 'rows open the document rather than printing an id per line. Hosts that do not draw cards '
      + 'yet get the same sentences they always did.',
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
    body:
      '`GET /api/v1/documents/:id.pdf` lays a document out as a PDF on the server, for a script '
      + 'or a CI job that has no browser to print from. The app itself still uses "Print or save '
      + 'as PDF" for that — it is the browser\'s own, exact rendering, and this does not replace it.',
  },
  {
    date: '2026-09-11',
    title: 'Download a saved document as Word',
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
