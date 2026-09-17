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

      /*
       * Every size Chrome asks for, each one drawn at that size rather than scaled down from the
       * next one up: 16 in the toolbar, 32 on a retina screen, 48 on the extensions page, 128 in
       * the store. `npm run icons` draws them all from `brand/mark.svg`.
       */
      for (const [from, to] of [
        ['favicon-16.png', 'icon-16.png'],
        ['favicon-32.png', 'icon-32.png'],
        ['icon-48.png', 'icon-48.png'],
        ['icon-192.png', 'icon-128.png'],
        ['icon-512.png', 'icon-512.png'],
      ]) {
        copyFileSync(path.join(ROOT, 'public', from), path.join(OUT, 'icons', to));
      }

      /*
       * The name and the description, in the five languages the extension already speaks.
       *
       * Chrome reads these from `_locales/<lang>/messages.json` and the manifest points at them
       * with `__MSG_…__`, so the store listing and the browser's own menus are in the reader's
       * language rather than in English for four of the five. They live here rather than in
       * `src/lib/i18n/messages/*` because they are not interface text: nothing in the product says
       * these sentences, and a store description is written for a shopfront, not for a panel.
       */
      const LISTING: Record<string, { name: string; description: string }> = {
        en: {
          name: 'TransformPipe — page and file to Markdown',
          description:
            'Convert the page you are on, or a file on your machine, to Markdown. In your browser, offline, no account needed.',
        },
        de: {
          name: 'TransformPipe — Seite und Datei zu Markdown',
          description:
            'Wandeln Sie die geöffnete Seite oder eine Datei auf Ihrem Rechner in Markdown um. Im Browser, offline, ohne Konto.',
        },
        fr: {
          name: 'TransformPipe — page et fichier en Markdown',
          description:
            'Convertissez la page où vous êtes, ou un fichier de votre machine, en Markdown. Dans votre navigateur, hors ligne, sans compte.',
        },
        es: {
          name: 'TransformPipe — página y archivo a Markdown',
          description:
            'Convierte la página en la que estás, o un archivo de tu equipo, a Markdown. En tu navegador, sin conexión y sin cuenta.',
        },
        it: {
          name: 'TransformPipe — pagina e file in Markdown',
          description:
            'Converti la pagina su cui ti trovi, o un file del tuo computer, in Markdown. Nel browser, offline, senza account.',
        },
      };

      for (const [locale, words] of Object.entries(LISTING)) {
        mkdirSync(path.join(OUT, '_locales', locale), { recursive: true });
        writeFileSync(
          path.join(OUT, '_locales', locale, 'messages.json'),
          `${JSON.stringify(
            {
              appName: { message: words.name },
              appDesc: { message: words.description },
            },
            null,
            2
          )}\n`
        );
      }

      /*
       * The manifest is generated rather than kept as a file, for one reason: the version. A
       * release is a tag on this repository, and an extension whose version has to be remembered
       * separately is an extension that ships as 1.0.0 forever.
       */
      const manifest = {
        manifest_version: 3,
        name: '__MSG_appName__',
        short_name: 'TransformPipe',
        description: '__MSG_appDesc__',
        default_locale: 'en',
        version,
        /*
         * The side panel is Chrome 114. Without this line the extension installs on an older one
         * and half of it is missing at runtime, which is a bug report rather than a message from
         * the browser saying the version is too old.
         */
        minimum_chrome_version: '114',
        homepage_url: 'https://transformpipe.com/extension',
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
          '16': 'icons/icon-16.png',
          '32': 'icons/icon-32.png',
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
