# The roadmap: twenty-six weeks, one release a week

A shipping schedule, not a wish list. Every row is one week of work that a person using
TransformPipe would notice, which is the same bar `src/lib/changelog.ts` sets — an item that cannot
be written as a changelog card does not belong here, because a week that ships nothing visible is a
week the changelog page says nothing happened.

The order is deliberate but not load-bearing. Months are themes so that a month reads as one story
on the changelog page ("December was the month it started writing *to* other tools"), and inside a
month the weeks can be swapped freely. What must not happen is a theme half-shipped: four weeks of
new import formats and no week spent on what the output looks like leaves the product wider and no
better.

Sizes assume the patterns already in the repository: a new conversion is `shared/from-*.ts` plus a
row in `shared/conversions.ts` plus labels in five locales, and that shape is a known quantity now —
ten of them exist. A week that has to invent a pattern instead of following one is marked.

## The four kinds of week

| Kind | What it does for the product | How many |
| --- | --- | --- |
| A new format | Brings a search intent nobody here answers yet. The cheapest growth this product has | 9 |
| The output | Makes the document that comes out better, for every format at once | 6 |
| The link | The shared page is the part strangers see; it is the thinnest part today | 4 |
| The desk | History, account, speed — what a returning person feels and a first-time visitor never sees | 7 |

---

## Month 1 — what comes out the other end

Six weeks of new formats first would be the obvious order and the wrong one. Everything here
improves every conversion that already exists, including the ten that shipped before it.

| Week | Ships | Notes |
| --- | --- | --- |
| 1 | **Mermaid diagrams** render in the preview and in the HTML and PDF export | A fenced ```mermaid block is dead text today. Client-side render; the PDF path needs the SVG rasterised, which is the one unknown |
| 2 | **Math**: `$…$` and `$$…$$` rendered with KaTeX | Same shape as week 1 and much smaller. Obsidian and Confluence exports are full of it |
| 3 | **Syntax highlighting** in code blocks, with a theme that matches the page | Wanted by every reader of a shared document; the shared page is where it shows |
| 4 | **Self-contained HTML**: images embedded rather than linked | The honest fix for the thing a Word or Notion import loses today. A single file a person can email |

## Month 2 — formats, going in

Four imports, each a real export format of a tool people already use, each following
`shared/from-*.ts`.

| Week | Ships | Notes |
| --- | --- | --- |
| 5 | **PowerPoint → Markdown** — one slide, one section, speaker notes kept | `.pptx` is a zip of XML; `fflate` is already a dependency |
| 6 | **EPUB → Markdown** — a book becomes one document with its own table of contents | Zip plus XHTML, and `htmlToMarkdown()` already exists. Mostly plumbing |
| 7 | **ODT and RTF → Markdown** — LibreOffice and Google Docs exports | Two formats in one week only because ODT is a zip of XML and RTF is small |
| 8 | **Evernote → Markdown** — an `.enex` export, notes merged, attachments named | The one format here with an unhappy user base actively looking for the door |

## Month 3 — formats, going out

The half nobody does well. Ten conversions read into Markdown; almost nothing writes back out of
it, and "I have the Markdown, I need it in Confluence" is a question with no good answer on the
internet today.

| Week | Ships | Notes |
| --- | --- | --- |
| 9 | **Markdown → Confluence storage format** — paste it straight into a Confluence page | XHTML with Confluence's own macro elements. Needs a real renderer, not a filter — the one invented pattern this quarter |
| 10 | **Markdown → Jira wiki markup**, and **→ Slack mrkdwn** | Both are line-level transforms of the token stream; small enough to share a week |
| 11 | **Markdown → EPUB** — a set of chained files becomes a readable book | Zip, XHTML, a manifest. The inverse of week 6 and it reuses its vocabulary |
| 12 | **Markdown → AsciiDoc and reStructuredText** | Two token-stream writers. Docs teams migrating between static-site generators |

## Month 4 — the link somebody else opens

`/s/<token>` is the only page a stranger sees, and it has one setting.

| Week | Ships | Notes |
| --- | --- | --- |
| 13 | **A password on a shared link** | Hash on the row, one gate before the render. The shared page has no scripts by design, so the gate is server-side |
| 14 | **An expiry date, and a view count** | Two columns and a sweep. Answers "is this link still live" without asking anyone |
| 15 | **A chosen address** instead of a token, and **a QR code** for it | Collision handling is the whole feature; the QR is an afternoon |
| 16 | **The shared page grows up**: a table of contents, a print stylesheet, its own preview image | The image is the interesting half — a per-document OG card, drawn the way the blog covers are |

## Month 5 — the desk

Everything here is invisible to a first visit and the reason a second one happens.

| Week | Ships | Notes |
| --- | --- | --- |
| 17 | **Tags in the history**, filterable, alongside the existing chips | The chip plumbing exists; this adds a source of chips |
| 18 | **A trash**: deletes recoverable for thirty days | `deleted_at` rather than a delete, and one honest sentence about it in the privacy page |
| 19 | **Export everything** — every document as one zip | Small, and it is the thing that makes trusting an account cheap |
| 20 | **A usage page**: conversions, AI summaries and API calls this month, against the limits | The numbers exist in `m2h_call` and `m2h_ai_summary_call` and nobody can see them |

## Month 6 — speed, for the person who is here every day

| Week | Ships | Notes |
| --- | --- | --- |
| 21 | **A command palette** and keyboard shortcuts | Convert, search, jump to a conversion, open a recent document |
| 22 | **Drop a folder** and get a zip back, converted file by file | The dropzone already takes several files; this is the batch behaviour people ask about |
| 23 | **Edit in place**: change the Markdown on the page and save it as the next version | The version chain shipped; this gives it a second author besides a re-upload |
| 24 | **Offline**: the client-side conversions work with no network, and the app installs | A service worker and a manifest. Genuinely true today — most conversions never touch the server |
| 25 | **A document check**: dead links, duplicate anchors, empty headings, images with no alt text | A panel beside the preview. Nothing is rewritten without being asked |
| 26 | **Assets out**: every image in a converted document, as a zip beside it | The other half of week 4, for people who want the files rather than one blob |

---

## Spares

Weeks slip. These are sized to drop into a gap without planning, and none of them depends on
anything above.

- **Sign in with GitHub.** One provider added to an existing flow.
- **An API playground on `/docs`** — a real request, from the page, against the caller's own key.
- **Rate-limit headers** on every public API response, and an honest `Retry-After`.
- **`tp watch`** in the CLI: a folder, converted on save.
- **Comparison pages** — a conversion of ours against the tool people currently use for it. Content,
  not code, and it is the cheapest traffic on the list.
- **The translation backlog**: 63 English articles, 63 German, four each in French, Spanish and
  Italian. A week buys roughly eight articles in one language.

## The rules that do not move

- One entry in `src/lib/changelog.ts`, in the commit that ships the thing. A release with no card is
  a release nobody hears about.
- A new conversion means a page, five locales, a how-to page and a sitemap entry — the shape is set
  by the ten that exist, and half of it is not optional.
- A new article ships in five languages the same day. Nothing above changes that.
- `npm run check-types && npm run build` green before the deploy, every week, no exceptions.
