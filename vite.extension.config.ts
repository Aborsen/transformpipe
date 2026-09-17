import react from '@vitejs/plugin-react';
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import { blogIndex } from './vite-plugin-blog';

/*
 * The browser extension, built out of the same source tree as the site.
 *
 * A second config rather than a second repository, and that is the whole maintenance argument: the
 * popup and the viewer import `shared/from-html.ts`, `src/lib/convert.ts`, the design system and the
 * catalogue directly, so a fix to a converter is a fix to the extension on the next build. There is
 * no copy of anything here to fall behind.
 *
 *   npm run ext        — build into dist-extension/, loadable unpacked
 *
 * Three entries: two pages and a service worker. The worker has to be a file of its own with no
 * shared chunk behind it — Manifest V3 loads it as a module but registers it by path — so the
 * chunking below keeps it whole rather than letting Rollup lift its imports out.
 */
const ROOT = path.resolve(__dirname);
const OUT = path.join(ROOT, 'dist-extension');

/** The two woff2 faces the app loads, and the icons, put where the built pages ask for them. */
function assets(): Plugin {
  return {
    name: 'extension-assets',
    apply: 'build',
    closeBundle() {
      const version = JSON.parse(
        readFileSync(path.join(ROOT, 'package.json'), 'utf8')
      ).version as string;

      mkdirSync(path.join(OUT, 'fonts'), { recursive: true });
      mkdirSync(path.join(OUT, 'icons'), { recursive: true });

      for (const font of [
        'dm-sans-latin-normal.woff2',
        'dm-sans-latin-ext-normal.woff2',
        'dm-sans-latin-italic.woff2',
        'dm-sans-latin-ext-italic.woff2',
      ]) {
        copyFileSync(
          path.join(ROOT, 'public', 'fonts', font),
          path.join(OUT, 'fonts', font)
        );
      }

      for (const [from, to] of [
        ['icon-192.png', 'icon-128.png'],
        ['icon-192.png', 'icon-192.png'],
        ['icon-512.png', 'icon-512.png'],
        ['favicon-96.png', 'icon-48.png'],
      ]) {
        copyFileSync(path.join(ROOT, 'public', from), path.join(OUT, 'icons', to));
      }

      /*
       * The manifest is generated rather than kept as a file, for one reason: the version. A
       * release is a tag on this repository, and an extension whose version has to be remembered
       * separately is an extension that ships as 1.0.0 forever.
       */
      const manifest = {
        manifest_version: 3,
        name: 'TransformPipe — page and file to Markdown',
        short_name: 'TransformPipe',
        description:
          'Convert the page you are on, or a file on your machine, to Markdown. In your browser, offline, no account needed.',
        version,
        action: {
          default_title: 'TransformPipe',
          default_popup: 'popup.html',
        },
        background: { service_worker: 'background.js', type: 'module' },
        options_ui: { page: 'options.html', open_in_tab: true },
        /*
         * Asked for when somebody connects an account, never at install: until there is a key this
         * extension has no reason to talk to us at all, and an origin in the install dialog reads
         * the same whether it is used or not.
         */
        optional_host_permissions: ['https://transformpipe.com/*', '<all_urls>'],
        /*
         * Two permissions, and neither is a host permission: nothing runs in a page until somebody
         * presses the button on that page, and nothing is read from any other tab, ever.
         */
        permissions: [
          'activeTab',
          'scripting',
          'contextMenus',
          'storage',
          'sidePanel',
          'identity',
        ],
        /*
         * The same surface, kept open beside the page. It is opened by the icon in the popup — a
         * way to look at this rather than a setting — so the action keeps its popup and nothing is
         * switched at runtime.
         */
        side_panel: { default_path: 'panel.html' },
        icons: {
          '48': 'icons/icon-48.png',
          '128': 'icons/icon-128.png',
          '512': 'icons/icon-512.png',
        },
      };

      writeFileSync(
        path.join(OUT, 'manifest.json'),
        `${JSON.stringify(manifest, null, 2)}\n`
      );
    },
  };
}

export default defineConfig({
  root: path.join(ROOT, 'extension'),
  /*
   * `blogIndex` is here for one import the graph drags in rather than for the blog: the catalogue
   * the extension shows its words from is the app's, and one file in that neighbourhood reads the
   * virtual module this plugin provides. Cheaper than a second catalogue for the sake of a build.
   */
  plugins: [react(), blogIndex(), assets()],
  resolve: {
    alias: {
      '@': path.join(ROOT, 'src'),
      '@shared': path.join(ROOT, 'shared'),
    },
  },
  define: {
    'process.env.LOG_PERF': 'false',
  },
  build: {
    outDir: OUT,
    emptyOutDir: true,
    /* An extension is loaded from disk: nothing here is cached by a CDN, so nothing needs a hash. */
    rollupOptions: {
      input: {
        popup: path.join(ROOT, 'extension', 'popup.html'),
        viewer: path.join(ROOT, 'extension', 'viewer.html'),
        options: path.join(ROOT, 'extension', 'options.html'),
        panel: path.join(ROOT, 'extension', 'panel.html'),
        background: path.join(ROOT, 'extension', 'background.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
});
