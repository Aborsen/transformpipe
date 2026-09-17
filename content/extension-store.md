# The Chrome Web Store listing

Everything the submission form asks for, written once and kept here rather than typed into a form
and then lost. A rejected review is answered by changing words in this file and resubmitting, not by
remembering what was said last time.

The listing is English. The extension's interface is in five languages — see `_locales/`, generated
from `src/lib/i18n/messages/*` — and the store shows the name and description from the manifest,
which are localised with it.

## Identity

| Field | Value |
| --- | --- |
| Name | TransformPipe — page and file to Markdown |
| Category | Productivity → Workflow & Planning |
| Language | English (interface: English, German, French, Spanish, Italian) |
| Homepage | https://transformpipe.com/extension |
| Support | https://github.com/raudarlabs/transformpipe/issues |
| Privacy policy | https://transformpipe.com/privacy |

## Short description

132 characters is the ceiling; this is 118.

> Turn the page you are on, or a file on your machine, into clean Markdown. In your browser,
> offline, no account needed.

## Detailed description

> **The page you are looking at, as Markdown, in one click.**
>
> Press the toolbar button and TransformPipe reads the rendered page, picks the article out of the
> navigation and the cookie banners, makes every link and image address absolute, and hands you
> Markdown. Copy it, download it as `.md`, or save the page as a self-contained `.html` file — its
> own design, its pictures inside the file, no requests to anything.
>
> **A file on your machine, converted without uploading it.**
>
> Word documents, PDFs, spreadsheets, HTML, CSV, JSON, EPUB and more — ten conversions, all of them
> running in your browser. Nothing is uploaded, and none of it needs a network connection.
>
> **Why it reads pages better than a copy and paste**
>
> Documentation, articles, a wiki page, a ticket — anything that exists only rendered. It reads
> what your browser already has on screen, so a page only you can see converts without anyone
> handing over a password: Confluence, Jira and Notion convert without an administrator, an export
> or an API token.
>
> **Two ways to look at it**
>
> The toolbar button opens a compact panel over the page. The side panel is the same thing kept
> open beside it, following you as you browse — useful when you are working through a set of pages
> rather than converting one.
>
> **Signed out, it never talks to us at all.** Converting is done in the page, on your machine.
> With a free TransformPipe account you can also save a document and share it — as a link, or with
> the people you name — which is the only time anything leaves your browser.
>
> Open source: https://github.com/raudarlabs/transformpipe

## Single purpose

> Converting a web page or a local file into Markdown, and saving or sharing the result through the
> user's own TransformPipe account.

Everything in the extension serves that sentence. There is no second feature bolted on: the panel,
the side panel, the context menu and the viewer are four ways into the same conversion.

## Permission justifications

One per permission, as the form asks. Each answers "why does this extension need it", in the words
a reviewer needs rather than ours.

**`activeTab`** — The conversion reads the page the user pressed the button on. `activeTab` grants
that for exactly that tab, at that moment, and for nothing else; it is why the extension can be
useful with no host permission at all.

**`scripting`** — Reading the page means running one function in it: `extract.ts`, which returns the
selection if there is one and otherwise the document's HTML and address. It reads and never writes,
and it is injected only in response to a click or to the side panel being opened.

**`contextMenus`** — Two entries on the right-click menu: convert the page, and convert the
selection. They are the same conversion the toolbar button runs, reached the way people expect to
reach it on a selection.

**`storage`** — Three things, all of them the user's own: the OAuth token for whoever signed in,
the chosen interface language and which surface the toolbar button opens, and — in
`chrome.storage.session`, which never touches the disk — the converted document on its way from the
panel to the tab that displays it.

**`sidePanel`** — The side panel is one of the two surfaces: the same conversion kept open beside
the page, so somebody working through a set of pages does not reopen a popup at each one.

**`identity`** — Signing in. `launchWebAuthFlow` opens the product's own OAuth approval page and
returns a token; the alternative was asking people to paste an API key, which is a worse experience
and a worse credential. No password is seen or stored by the extension.

**Host permission `https://transformpipe.com/*` (optional)** — Where a saved document goes. It is
requested at the moment somebody connects an account, not at install: until there is a token the
extension has no reason to talk to the service at all, and an origin in the install dialog reads
the same whether it is ever used or not.

**Host permission `<all_urls>` (optional)** — Asked for only when the user turns on the side panel,
and refusable: the panel then explains what it is for and does nothing else.

The reason it is needed, and the reason it is optional: the side panel stays open while the user
browses and converts whatever tab they move to. `activeTab` is granted per click on the toolbar
button and does not survive a tab switch, so a panel that follows the user cannot be built on it —
there is no narrower permission that expresses "the tab in front of the open panel". The whole of
the popup path works without it, and the extension is fully useful with it refused.

## Remote code

None. Everything is bundled: the two typefaces are in the package as `.woff2` files, and nothing is
fetched from a CDN, `eval`ed or loaded as a remote script. The only network requests the extension
ever makes go to `transformpipe.com`, after sign-in, to save or share a document.

## Data the extension handles

What the form's checkboxes should say, and what backs each answer:

| Category | Collected | Why |
| --- | --- | --- |
| Personally identifiable information | Yes — email address | Only after sign-in, and only as the account identity. Shown in the panel so a person with two accounts can see which one they are saving to. |
| Health, financial, location, personal communications | No | — |
| Authentication information | Yes — an OAuth token | Kept in the browser's extension storage. Revocable on the account page. No password is handled. |
| Web history | No | No record is kept of which pages were converted, in the extension or on the server. |
| User activity | No | No analytics, no telemetry, no click tracking of any kind in the extension. |
| Website content | Yes — the page being converted | Read in the page, converted in the page. It is sent to TransformPipe only when the user presses Save or Share, and then it is one document, deliberately. |

The three certifications the form ends with are all true: the data is not sold, it is not used for
anything unrelated to the single purpose above, and it is not used to determine creditworthiness.

## Screenshots

Five, 1280×800, drawn by `npm run ext:art` from the extension's own interface — not mock-ups. The
captions are part of the picture:

1. **The page you are on, as Markdown** — the panel over a documentation page.
2. **Read it beside the page** — the side panel, following a tab.
3. **Save the page as it looks, or as text** — the HTML menu open.
4. **Ten formats, converted in your browser** — the viewer with a `.docx` open.
5. **Share a link, or name the people** — the share dialog.

Plus the small promotional tile, 440×280, from the same script.

## When a version is submitted

The manifest's version is `package.json`'s, so a resubmission is a release: bump, tag, changelog
entry, `npm run ext:zip`, upload. A review takes days that nobody controls, so the week that
submits is never the week that has nothing else in it.
