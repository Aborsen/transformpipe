---
title: "A Free Notion to Markdown Converter: Every Option, and Where Free Has a Catch"
description: Compare the free ways to turn Notion pages into Markdown — the export button, a browser converter, notion-to-md, Obsidian Importer — and where free has a catch
date: 2026-09-14
tag: Converting
keywords: free notion to markdown converter, notion to markdown converter, notion to markdown free, convert notion to markdown online, notion markdown converter free, best notion to markdown tool, notion to md converter
---

Search for a Notion to Markdown converter and almost everything that comes back is free, which is a strange result for a search with money in it. It is also true. Notion's own export costs nothing, the open-source packages cost nothing, the browser converters cost nothing, the editors that import a workspace cost nothing. Nobody is charging for the conversion itself, because the conversion is not where the difficulty is.

The difficulty is that each of these free options is free in a different way, and each sends a different bill later. One produces filenames with a 32-character hexadecimal id welded to the end. One needs an integration token, a permission step inside Notion, and a rate limit handled properly in code. One sends your workspace to a server you have never heard of. One takes an afternoon of your own time, which is the only genuinely expensive thing on this list.

So this is a comparison written on the axis that separates them: not price, but what free costs. Every tool below is really free — not free-trial free, not free-tier-with-a-wall free — and beside each one is the honest answer to "and then what". For the mechanics of a particular route rather than a choice between them, [the full how-to covers every route step by step](/blog/convert-notion-export-to-markdown).

### TL;DR

All the serious options are free, so pick on shape. **Notion's own "Export as Markdown & CSV"** is what everything else starts from: real Markdown, but every filename and cross-page link carries the page's 32-hex id. **A browser converter that merges the export** — [the Notion to Markdown conversion here](/notion-to-markdown) is one — takes that same zip and gives you one document with a table of contents, no ids and no script, nothing uploaded when you are signed out; the trade is that pages become sections rather than files. **`notion-to-md`** reads pages through Notion's API from Node and lets you name the output yourself: right for a build step, wrong for a one-off, since a token and a permission grant come before the first line of code. **Obsidian Importer** is free and MIT licensed and is the route when the destination is a vault. **Pandoc** converts the richer HTML export locally. **Copy and paste** stops working at about page five.

The catch, in every case, is time, setup, shape or privacy — never money.

## Why this conversion is harder than it sounds

Notion identifies a page by an id, not by its title. Titles change, two pages can share one, and the export needs unique filenames, so it writes the id into the name of every file and folder it creates: `Meeting notes 21f4c8a1b2c34d5e8f90123456789abc.md`. Every link from one exported page to another points at that exact filename, percent-encoded. Rename the file to something readable and the link breaks silently, because a dead relative link produces no error at all until a reader clicks it.

That single fact separates the tools. A converter either leaves you holding the ids, rewrites them in a pass that also rewrites every link, or removes the need for them to resolve at all by merging the pages into one document. There is no fourth option, and no amount of paying would produce one.

There is a second difficulty with nothing to do with ids. A Notion page is not only text: it is databases with views, formula columns, synced blocks shown in several places, and comment threads attached to the page rather than written into it. Markdown has a table and nothing else in that list, so some loss is structural — it happens in the export, before any converter is involved.

And a third, which is where the free question gets interesting. A Notion workspace is usually the most sensitive collection of documents a small company has: hiring notes, salaries, strategy, half-finished legal drafts. A free online converter that uploads your export is free because you paid in a different currency — fine for a public handbook, a data transfer for everything else, and worth deciding on purpose rather than by dragging a file onto whichever page ranked first.

## Quick comparison: the cheat sheet

| Tool | Best for | Key capability | Price |
| --- | --- | --- | --- |
| Notion's "Export as Markdown & CSV" | Getting the content out at all | Real Markdown for every page, CSV for every database | Free, built in |
| A browser converter (this site's `/notion-to-markdown`) | One document to read, archive or hand over | Merges the export zip into one document with a table of contents, in the browser | Free |
| The export plus your own rewrite script | A folder of files that must stay files | Renames files and rewrites links from one id map | Free, costs your time |
| `notion-to-md` | A build step or a scheduled sync | Reads pages through the Notion API and writes files you name | Free, open source |
| Obsidian Importer | A destination that is an Obsidian vault | Imports a Notion HTML export or reads the API directly | Free, MIT |
| Pandoc on the HTML export | One page at a time, or a longer document pipeline | HTML in, Markdown out, plus every other format it writes | Free, GPL |
| Copy and paste | Three pages, once, today | Nothing to install, nothing to learn | Free |

## The free options, one at a time

### Notion's own export — best for getting the content out at all

Every other route here either starts with this export or replaces it with the API. Notion's export lives under the page or workspace menu and offers PDF, HTML, and Markdown & CSV; the Markdown option writes one `.md` per page and one `.csv` per full-page database, images and other assets saved into folders alongside (checked on notion.com, 14 September 2026).

| Pros | Cons |
| --- | --- |
| Genuinely free, built in, no account beyond the one you have | Every filename and every cross-page link carries the 32-hex id |
| The output is real Markdown that opens in any editor | Only the current or default view of a database is exported |
| Databases come out as CSV, which is at least machine-readable | A form view cannot be exported at all |
| Assets are included rather than left as expiring URLs | A large export arrives as an emailed link, and the link expires |

**Price:** free. One nearby feature is not: "Include subpages" for a **PDF** export is described on Notion's own help page as a Business or Enterprise plan feature (checked on notion.com, 14 September 2026). The Markdown & CSV route is not gated that way, which is worth knowing if somebody on your team has concluded that exporting a workspace needs an upgrade.

**Technical details.** The id suffix is 32 lowercase hexadecimal characters, separated from the title by a space or an underscore depending on the client version that produced the export. "Create folders for subpages" can be switched off to shorten paths, which matters on Windows, where a deeply nested workspace produces paths longer than the operating system accepts. Very large exports are not downloaded immediately: Notion emails a link instead, it expires after seven days, and processing is documented as taking up to thirty hours — so an export started the afternoon of a migration may not arrive in time for it.

**Who is this for?** Everybody, first. Whatever route you pick afterwards, this is the official way to get a copy of your content out of a hosted product, and doing it once before you need it is cheap insurance.

### A browser converter that merges the export — best for one document

Drop the same zip into [TransformPipe's Notion to Markdown conversion](/notion-to-markdown) and every page becomes a section of one document, in the export's own order, under a generated table of contents. A cross-page link keeps the words it displayed and drops the address, because once two pages are sections of one document there is no separate address to point at. Databases arrive as Markdown tables rather than CSV files off to one side.

| Pros | Cons |
| --- | --- |
| No id map, no rename, no script, no install | Produces one document, so pages do not stay separate files with their own URLs |
| A table of contents is generated from the page titles | A cross-page link keeps its text, not its target |
| Runs in the browser: signed out, the zip is not uploaded anywhere | One zip at a time, not a scheduled job |
| Databases arrive as tables in the same document as the pages | Comments and non-default views are still missing, because the export never had them |

**Price:** free in the plainest sense — the conversion runs locally in the page, so there is no server cost to recoup and no per-file quota to hit. An account adds history, sharing and an API, also free.

**Technical details.** The zip is read in the browser with a pure-JavaScript unzip, entries sorted by their path inside the archive so the same export converts the same way twice, and each section's title is the filename with its id suffix stripped. A page whose first line already repeats its title as a heading does not get that heading twice, and pages are separated by a horizontal rule — the convention [merging many Markdown files into one](/blog/merging-many-markdown-files) uses anywhere else.

**Who is this for?** Anybody whose real goal was a document rather than a folder: a workspace archived as one readable file, a project wiki handed to a client, a knowledge base pasted into a repository. If the destination needs one URL per page, this is the wrong shape and the next two options are the right ones.

### The export plus your own rewrite script — best for files that stay files

If the destination is a docs site, a wiki import or anything where each page needs its own address, the ids have to come off properly: build a map from each file's id to the name you want, then rewrite every filename and every link from that one map, in one pass. Doing the rename without the link rewrite is what produces a folder that looks correct and is full of dead links.

| Pros | Cons |
| --- | --- |
| No dependency, no token, no account, nothing uploaded | The most expensive option here, measured in your own time |
| The output is real files with real names, which is what a docs site wants | Half a job breaks every internal link, quietly |
| Works offline, on the export you already have | The database CSV is not joined back to the page it belonged to |
| Repeatable once written, and reviewable because you wrote it | Ten pages by hand is an evening; a thousand by hand is not realistic |

**Price:** free, unless you count the afternoon. Which you should: at any hourly rate, a careful script plus testing is the most costly line on this page, and the only one where the cost stays invisible until you are three hours into it.

**Technical details.** The id extraction has to run against the URL-decoded link target, not the raw percent-encoded one, or the space in `Meeting%20notes` will not match a pattern written for a literal space. The rest — the regex, the CSV join, the folder flattening — is set out in [the step-by-step how-to](/blog/convert-notion-export-to-markdown) rather than here.

**Who is this for?** Teams migrating a documentation set into a system that expects one file per URL, where the filenames and the links between them are part of the deliverable rather than incidental to it.

### `notion-to-md` — best for a build step

Reading the workspace through Notion's official API rather than through the export button avoids the id problem entirely, because nothing forces an id into a filename when you are the one writing the file. `notion-to-md` is the commonly used Node package for this: it pulls a page's block tree through the API and converts it to Markdown, with a hook for handling block types it does not cover by default.

| Pros | Cons |
| --- | --- |
| No id suffix ever, because you choose every filename | Needs an integration token and that integration shared onto each page — a permission step, not a code step |
| Fits a build script, a static site, or a scheduled mirror into git | One page or database query at a time; walking a workspace is your own recursion |
| Runs in CI with no browser and no manual export click | Image blocks come back as Notion's own temporary URLs, which expire unless you download them |
| Extensible: unsupported block types can be handled with your own transformer | The API is rate limited, and a script that ignores that appears to hang |

**Price:** free, open source. The licence is worth stating carefully: the published package declares ISC in its npm metadata, while the repository's own `LICENSE` file — and the 4.0 alpha line — carry MIT (checked on registry.npmjs.org and github.com/souvikinator/notion-to-md, 14 September 2026). Both are permissive; if your organisation records licences formally, record which artefact you took.

**Technical details.** Notion's API is limited to an average of three requests per second per integration, with a separate workspace-wide limit on top (checked on developers.notion.com, 14 September 2026). Over the limit, a request returns `429` with a `Retry-After` header instead of data, so a wait-and-retry loop belongs in the first version of the script rather than the one written after the first failure — for a large workspace that is the difference between a job that finishes and one you kill assuming it crashed.

**Who is this for?** Anybody for whom this is not a one-off: a site that builds its pages from Notion, a nightly mirror of a handbook into a repository, a pipeline where "somebody exports it by hand each month" is the step that will eventually be skipped.

### Obsidian Importer — best when the destination is a vault

If the Markdown is going into Obsidian, the shortest free path is Obsidian's own Importer plugin rather than any general converter. It handles a long list of sources — Evernote, OneNote, Roam, Bear, Apple Notes, plain HTML and Markdown folders among them — and offers Notion in two separate flavours.

| Pros | Cons |
| --- | --- |
| Free and MIT licensed, maintained by Obsidian's own team (checked on github.com/obsidianmd/obsidian-importer, 14 September 2026) | Only useful if the destination is a vault; it is not a general-purpose converter |
| Two routes: read the workspace through the API, or import the export zip offline | Its own documentation advises against Notion's Markdown export, recommending the HTML export instead |
| The API route converts databases and formulas into Obsidian's own database files | The zip route does not preserve databases, and needs no token in exchange |
| A preview step before anything is written into the vault | The API route is subject to the same Notion rate limits, so a large workspace takes a while |

**Price:** free, MIT licensed.

**Technical details.** The documented limits are specific enough to plan around: on the API route only the primary view of each database is imported, linked data sources are not, and a handful of formula functions covering people and text styling have no equivalent. The zip route trades databases for independence — no token, no internet, no rate limit. The recommendation to export HTML rather than Markdown is the interesting part here, because it is a vendor saying plainly that Notion's Markdown export drops information the HTML export keeps (checked on obsidian.md, 14 September 2026).

**Who is this for?** Anyone moving a workspace into Obsidian, the most common destination for this conversion. The wider question of [what survives a move between Notion, Obsidian and Confluence](/blog/markdown-from-notion-obsidian-and-confluence) is worth reading before the import rather than after.

### Pandoc on the HTML export — best for one page, or a longer pipeline

Pandoc is a command line document converter that reads HTML and writes Markdown, among a long list in both directions. Pointed at Notion's HTML export rather than its Markdown one, it is a free, local, scriptable converter starting from the richer of the two exports.

| Pros | Cons |
| --- | --- |
| Free and local: nothing is uploaded, and it runs in CI as easily as on a laptop | Converts files, not archives: the zip, the folder walk and the filenames are your problem |
| Starts from the HTML export, which carries more than the Markdown one | A large install for a single page |
| The same command writes DOCX, PDF or LaTeX by changing one flag | Notion's exported HTML is machine-generated, so the Markdown needs a tidy-up pass |
| Fine-grained control over the Markdown dialect it writes | No concept of a workspace, a page tree or a database |

**Price:** free, GPL licensed (checked on pandoc.org, 14 September 2026).

**Technical details.** The relevant fact is that Notion's HTML export and its Markdown export are not the same content in two costumes: the HTML one carries formatting and structure the Markdown writer had to drop, which is why Obsidian's importer asks for HTML. Pandoc lets you start there and choose your own Markdown flavour on the way out, and the differences between [Markdown flavours](/blog/commonmark-gfm-and-the-flavours) decide how much of that markup survives.

**Who is this for?** People who already have Pandoc in a build, or anybody converting a handful of important pages who would rather start from the export that lost less.

### Copy and paste — best for three pages, once

Select the page in Notion, copy, paste into a Markdown editor, fix what broke. It belongs on this list because for a handful of pages it is genuinely the fastest free option.

| Pros | Cons |
| --- | --- |
| Nothing to install, configure or learn | Does not scale past a few pages, and the wall is abrupt |
| You see every page, so nothing is silently mangled | Images do not come along; each is re-downloaded by hand |
| No account, no token, no upload | Not repeatable, and not reviewable |

**Price:** free.

**Who is this for?** Somebody with three pages and a deadline. For anything with subpages, databases or images in quantity the time cost overtakes every other option quickly, and without warning — the fifth page feels like the first, and the fortieth is when you realise you should have exported.

## Where free has a catch

Nothing above costs money. Each one costs something, and the costs differ enough that "they are all free" is the least useful thing you can know about them.

**The catch is a quota.** The API routes — `notion-to-md`, and Obsidian Importer's API mode — are limited by Notion's own rate limit rather than by anybody's pricing page. Three requests per second per integration sounds generous until you notice that one page with nested blocks is several requests. The free part is real; the unlimited part was never claimed.

**The catch is setup.** An integration token is free; creating it, sharing it onto the right pages, storing it where a build can read it and remembering to rotate it is not nothing. For a conversion you will do exactly once that is a poor trade against clicking Export, which is why the ranking flips with frequency.

**The catch is a plan.** Notion's help page states that "Include subpages" for a PDF export requires a Business or Enterprise plan (checked on notion.com, 14 September 2026). That is not the Markdown route, but it is a reminder that "the export is free" holds per format rather than in general.

**The catch is your content.** A free hosted converter runs on a server somebody pays for. That is not sinister on its own, but it means "where does my export go" has a real answer that is not always on the page. Browser-side conversion answers it by construction: open the network tab, run the conversion, watch nothing leave. Whether [an online converter is safe](/blog/is-an-online-converter-safe) for a given file is as much a question about the file as the tool.

**The catch is your afternoon.** The script route has no vendor, no quota and no privacy question, and is still the most expensive option here. Free software is not free labour, and a converter you write is one you maintain the next time Notion's export changes shape.

## What no free tool recovers

Three things do not come out of Notion at all, in any format, by any route, so no comparison of converters can fix them.

**Comments.** A comment thread is attached to a page as discussion rather than stored as page content, so it reaches none of the export formats. If a decision exists only as a reply in a thread, move it into the page body before exporting; afterwards it is gone rather than merely unconverted.

**Non-default database views.** Notion exports the view you are looking at or the default one, not all of them. A database filtered three ways for three audiences exports as one of the three; the others have to be rebuilt from the rows.

**Synced blocks.** A synced block is one block shown in several places, and an export has no way to say that: each location gets its own copy, with no marker that they were ever linked.

A database, likewise, arrives as a snapshot of rows — a Markdown table has no formulas, relations or rollups — so if those numbers are computed rather than typed, check [the table that came out](/blog/markdown-tables-that-survive-conversion) before deleting anything in Notion.

## How to choose

1. **Decide the shape of the output before you look at any tool.** One document, a folder of files with their own URLs, or a vault. Every recommendation here follows from that answer, and choosing it after converting means doing the conversion twice.
2. **Count how many times this will happen.** Once, and the option with no setup wins on time alone — click Export, drop the zip into a browser converter, done in minutes. Weekly or on every deploy, and the API route's setup cost amortises to nothing within a month.
3. **Ask whether the content can leave your machine.** A workspace holding salaries, hiring notes or anything unreleased removes hosted converters from the list before any feature comparison starts, leaving browser-side conversion and local command line tools.
4. **Check what you are about to lose while you can still see it.** Comments, extra database views and synced blocks are absent from the output with no error to flag them, so the only reliable check is looking at the source in Notion first.
5. **Count the pages honestly.** Three is a copy-paste. Thirty is an export and a converter. Three thousand is an API script with retry handling, and also an export that may take Notion most of a day to produce — so start it before you need it.

## Conclusion

There is no paid tier to compare here, which makes this an unusually easy market to shop in and an unusually easy one to choose wrongly in. The options differ by shape, not price: Notion's export gets the content out and hands you the ids; a browser converter turns that zip into one readable document and uploads nothing; a rewrite script keeps files as files at the cost of your afternoon; `notion-to-md` and Obsidian Importer read the API properly, for pipelines and vaults respectively; Pandoc converts the richer HTML export locally. Pick on where the Markdown is going and how often you will do this, test with one page carrying a table, an image and a link to another page, and remember that the only bill these send is paid in time.

## FAQ

### Is there a genuinely free Notion to Markdown converter, with no trial and no quota?

Yes, several. Notion's own Markdown & CSV export is free and built in, a browser converter that merges the export runs locally with no per-file limit, and `notion-to-md`, Obsidian Importer and Pandoc are all free open-source software. The limits you will meet are Notion's API rate limit and your own machine, not a pricing page.

### What is the fastest free way to convert a whole Notion workspace?

Export it once as Markdown & CSV, then convert the zip in one step rather than page by page. A merging browser converter produces a single document with a table of contents, no renaming or scripting involved; if the pages must stay separate files, budget time for the id rewrite instead, because that is the part no free tool does for you automatically.

### Why do my exported filenames have long random codes in them?

Those are page ids: 32 hexadecimal characters Notion uses to identify a page, because titles change and are not unique. The export writes the id into every filename and every link between pages, so removing it means rewriting both together from one map — or merging the pages into one document, where nothing needs to resolve to a filename any more.

### Can I convert a Notion export without uploading it anywhere?

Yes. A converter that runs in the browser reads the zip with the page's own file API and never sends it, which you can verify by opening the network panel and watching nothing happen. Local command line tools such as Pandoc, and Obsidian Importer's zip mode, never touch the network at all.

### Does converting Notion to Markdown require a paid Notion plan?

Not for the Markdown & CSV export. Notion's help page does state that "Include subpages" for a **PDF** export requires a Business or Enterprise plan (checked on notion.com, 14 September 2026), so check the format you need rather than assuming the whole export menu behaves the same way.

### Should I export as Markdown or as HTML?

It depends what happens next. Markdown is the shorter path if your converter takes it directly. Obsidian's documentation recommends HTML instead, on the grounds that Notion's Markdown export omits information — so if fidelity matters more than convenience, export HTML and convert it with Pandoc or an importer that expects it.

### Do free converters keep my Notion databases?

Partly, and the differences matter. Notion's Markdown export writes each full-page database as a CSV beside the pages; a merging browser converter turns those rows into a table inside the same document; Obsidian Importer preserves databases on its API route but not its zip route. None keep formulas, relations, rollups or any view other than the one exported.
