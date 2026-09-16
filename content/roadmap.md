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

## The five kinds of week

| Kind | What it does for the product | How many |
| --- | --- | --- |
| Where it runs | Puts the converter where the file already is — a tab, a repository — instead of waiting to be visited | 5 |
| A new format | Brings a search intent nobody here answers yet. The cheapest growth this product has | 8 |
| The output | Makes the document that comes out better, for every format at once | 5 |
| The link | The shared page is the part strangers see; it is the thinnest part today | 4 |
| The desk | History and speed — what a returning person feels and a first-time visitor never sees | 4 |

---

## Month 1 — where it runs

Moved to the front deliberately. Everything else on this list makes the product better for people
who already arrive at it; this month is the only one that changes who arrives. It is also the month
with a queue in it — a browser store reviews a first submission on its own schedule, days to weeks —
so the work is sequenced to keep shipping while that runs rather than waiting on it.

| Week | Ships | Notes |
| --- | --- | --- |
| 1 | **The extension, converting**: the page you are on, or the part of it you selected, as Markdown — copied, or downloaded | Manifest V3, Chrome first. The conversion is `shared/from-html.ts`, which already runs in a browser, so nothing is sent anywhere and the promise the site makes stays true inside the extension. `activeTab` and `scripting` only — no "read all your data on every website", which is both the honest permission set and the one that gets reviewed quickly |
| 2 | **The extension, signed in**: an API key in the options page, then "save to my account" and "share this" from the toolbar | The public API already does all of it; this is the client. Firefox packaging in the same week — same code, a different manifest — and the Chrome listing goes in for review at the start of it |
| 3 | **The Action on the GitHub Marketplace** | The Action exists and works; a listing needs `branding` in `action.yml`, a tagged release, categories and the publisher agreement. Mostly paperwork and a README, which is why it sits beside a heavier week |
| 4 | **Self-contained HTML**: images embedded rather than linked | Shipping while the store queue runs. The honest fix for what a Word or Notion import loses today — one file a person can email |

Worth knowing about the extension, because it settles an older question: it reads the rendered page,
so a Confluence space or a Jira attachment page converts from the browser of somebody who can
already see it. That needs no Jira administrator and works the same on Cloud and Server — the thing
the push-from-Jira guide had to route around.

## Month 2 — what the document looks like

Every week here improves every conversion at once, including the ten that already shipped.

| Week | Ships | Notes |
| --- | --- | --- |
| 5 | **Mermaid diagrams** render in the preview and in the HTML export | A fenced ```mermaid block is dead text today. Mermaid needs a browser to measure text, so the shared page and the API render what the browser produced rather than drawing it again — the one week here that has to invent a pattern |
| 6 | **Math**: `$…$` and `$$…$$` rendered with KaTeX | KaTeX runs in Node as well as in the browser, so this one is genuinely the same everywhere. Obsidian and Confluence exports are full of it |
| 7 | **Syntax highlighting** in code blocks, in a palette that matches the page | Same in the app, the download, the shared link and the blog — one renderer, four surfaces |
| 8 | **A document check**: dead links, duplicate anchors, empty headings, images with no alt text | A panel beside the preview. Nothing is rewritten without being asked |

## Month 3 — formats, going in

Four imports, each a real export format of a tool people already use, each following
`shared/from-*.ts`.

| Week | Ships | Notes |
| --- | --- | --- |
| 9 | **PowerPoint → Markdown** — one slide, one section, speaker notes kept | `.pptx` is a zip of XML; `fflate` is already a dependency |
| 10 | **EPUB → Markdown** — a book becomes one document with its own table of contents | Zip plus XHTML, and `htmlToMarkdown()` already exists. Mostly plumbing |
| 11 | **ODT and RTF → Markdown** — LibreOffice and Google Docs exports | Two formats in one week only because ODT is a zip of XML and RTF is small |
| 12 | **Evernote → Markdown** — an `.enex` export, notes merged, attachments named | The one format here with an unhappy user base actively looking for the door |

## Month 4 — formats, going out

The half nobody does well. Ten conversions read into Markdown; almost nothing writes back out of
it, and "I have the Markdown, I need it in Confluence" is a question with no good answer on the
internet today.

| Week | Ships | Notes |
| --- | --- | --- |
| 13 | **Markdown → Confluence storage format** — paste it straight into a Confluence page | XHTML with Confluence's own macro elements. Needs a real renderer, not a filter |
| 14 | **Markdown → Jira wiki markup**, and **→ Slack mrkdwn** | Both are line-level transforms of the token stream; small enough to share a week |
| 15 | **Markdown → EPUB** — a set of chained files becomes a readable book | Zip, XHTML, a manifest. The inverse of week 10 and it reuses its vocabulary |
| 16 | **Markdown → Word, properly** — styles, headings and tables a Word user can edit | The `.docx` export exists; this is the week it stops looking like converted HTML |

## Month 5 — the pull request

The second half of "where it runs". The Action publishes on a push because somebody wired it up; an
app installs once and then works on every repository it is given, which is a different reach.

| Week | Ships | Notes |
| --- | --- | --- |
| 17 | **The GitHub App**: install it, and every pull request that touches Markdown gets a comment with a rendered link per changed file | App registration, `pull_request` webhook, installation tokens, and the public API doing the conversion. The first of two weeks and the heaviest single item on this list |
| 18 | **The same app, useful**: a check run rather than a comment thread, links that survive a force-push, and a listing on the Marketplace | Comments pile up on a long review; a check run updates in place |
| 19 | **A password on a shared link** | Hash on the row, one gate before the render. The shared page has no scripts by design, so the gate is server-side |
| 20 | **An expiry date, and a view count** | Two columns and a sweep. Answers "is this link still live" without asking anyone |

## Month 6 — the link, and the desk

| Week | Ships | Notes |
| --- | --- | --- |
| 21 | **A chosen address** instead of a token, and **a QR code** for it | Collision handling is the whole feature; the QR is an afternoon |
| 22 | **The shared page grows up**: a table of contents, a print stylesheet, its own preview image | The image is the interesting half — a per-document OG card, drawn the way the blog covers are |
| 23 | **A command palette that finds documents** | ⌘K shipped with the new header and searches conversions and pages; this is the week it searches what you saved, which needs the server-side content search under it |
| 24 | **Tags in the history**, filterable, alongside the existing chips | The chip plumbing exists; this adds a source of chips |
| 25 | **A trash**: deletes recoverable for thirty days | `deleted_at` rather than a delete, and one honest sentence about it in the privacy page |
| 26 | **Drop a folder** and get a zip back, converted file by file | The dropzone already takes several files; this is the batch behaviour people ask about |

---

## Spares

Weeks slip. These are sized to drop into a gap without planning, and none of them depends on
anything above.

- **Edit in place**: change the Markdown on the page and save it as the next version. The version
  chain shipped; this gives it a second author besides a re-upload.
- **Export everything** — every document as one zip. Small, and it makes trusting an account cheap.
- **A usage page**: conversions, AI summaries and API calls this month, against the limits. The
  numbers are in the database and nobody can see them.
- **Assets out**: every image in a converted document, as a zip beside it.
- **Offline**: the client-side conversions work with no network, and the app installs. Genuinely
  true today — most conversions never touch the server.
- **Markdown → AsciiDoc and reStructuredText.** Two token-stream writers, for docs teams migrating
  between static-site generators.
- **Sign in with GitHub.** One provider added to an existing flow, and it reads differently once
  there is a GitHub App in the Marketplace.
- **An API playground on `/docs`** — a real request, from the page, against the caller's own key.
- **Rate-limit headers** on every public API response, and an honest `Retry-After`.
- **`tp watch`** in the CLI: a folder, converted on save.
- **Comparison pages** — a conversion of ours against the tool people currently use for it. Content,
  not code, and the cheapest traffic on the list.
- **The translation backlog**: 63 English articles, 63 German, four each in French, Spanish and
  Italian. A week buys roughly eight articles in one language.

## The rules that do not move

- One entry in `src/lib/changelog.ts`, in the commit that ships the thing. A release with no card is
  a release nobody hears about.
- A new conversion means a page, five locales, a how-to page and a sitemap entry — the shape is set
  by the ten that exist, and half of it is not optional.
- A new article ships in five languages the same day. Nothing above changes that.
- `npm run check-types && npm run build` green before the deploy, every week, no exceptions.
- Anything published outside this repository — a browser store, the GitHub Marketplace — is reviewed
  by somebody else on their own schedule. Submit early in a week and ship something else while it
  sits; a roadmap that waits on a queue is a roadmap with a gap in it.
