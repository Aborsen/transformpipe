# Building this add-on from source

Written for a Firefox add-on reviewer. Following it produces the exact file that was submitted.

## What generates code, and why

The add-on is written in TypeScript and JSX and is bundled by [Vite](https://vite.dev) (Rollup for
the bundle, esbuild for the transform, both minifying). Nothing else transforms the source: there is
no code generator, no template engine, and no committed build output.

Every file in `extension/`, `shared/`, `src/` and `scripts/` is the original, readable source.

## Requirements

- **Operating system**: any that Node runs on. The submitted file was built on macOS 15 (arm64);
  Linux and Windows produce the same bundle.
- **Node.js 22 or newer** — <https://nodejs.org/en/download>. The submitted file was built with
  Node 26.4.0 and npm 11.17.0.
- **npm**, which ships with Node.
- A network connection for `npm ci`, which is the only step that fetches anything.

No other tool is needed. There are no native modules to compile and no environment variables to
set: the extension build reads none.

## Steps

```sh
npm ci                      # installs the exact versions in package-lock.json
npm run ext:zip:firefox     # builds, then writes the zip
```

The second command is two steps, and they can be run separately:

```sh
npm run ext:firefox         # vite build --config vite.extension.config.ts --mode firefox
node scripts/store-zip.mjs --firefox
```

## What comes out where

| | |
| --- | --- |
| `dist-extension-firefox/` | the unpacked add-on — load this folder with `about:debugging` to run it |
| `brand/store/transformpipe-firefox-<version>.zip` | the submitted file: a zip of that folder's **contents** |

The version in `manifest.json` is generated from `version` in `package.json`, which is why the
manifest is not a file in this repository — `vite.extension.config.ts` writes it, and the block
that does so is commented with the reason.

## Reading it

- `extension/` — everything specific to the add-on: the popup, the side panel, the viewer tab, the
  background worker, and `extract.ts`, the one function injected into a page.
- `shared/` — the converters, shared with the website and the server so a document converts the
  same way everywhere.
- `src/ui/`, `src/components/` — the design system and components, shared with the website.
- `vite.extension.config.ts` — the build, including the generated manifest.

## The `eval` warnings

The validator reports `The Function constructor is eval` in three bundled chunks —
`cytoscape.esm`, `_baseUniq` (lodash) and the mermaid core. All three come from
[mermaid](https://mermaid.js.org), which draws the diagrams a converted document may contain; it
uses `new Function` internally to compile selectors and templates. No code in this repository calls
`eval` or the `Function` constructor, which `grep -rn "new Function\|eval(" extension shared src`
confirms.

## Where else this lives

The same source is public, MIT licensed, at
<https://github.com/raudarlabs/transformpipe>. The tag matching this submission is the version in
`package.json`.
