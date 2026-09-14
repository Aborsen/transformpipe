/*
 * `pdfmake` ships no types of its own, and `@types/pdfmake` models a different shape than the
 * server entry point this app actually imports (a singleton instance with `setFonts`/`createPdf`
 * as methods, not named exports) — installing it produced type errors against code that matches
 * the real runtime API. An untyped module is more honest than a mistyped one.
 */
declare module 'pdfmake';
