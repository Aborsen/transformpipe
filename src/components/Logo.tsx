import { cn } from '@/ui/lib/utils';

interface LogoProps {
  className?: string;
}

/**
 * The wordmark: `Tpipe`, with the T and the first p fused along the stem they share.
 *
 * Drawn rather than set. The earlier mark was six characters of monospace — `T>pipe`, the caret
 * borrowed from the shell — which cost nothing and looked like what it was: a typeface the browser
 * happened to have. This one is a shape, so it is the same shape on every machine, at any size,
 * and in a picture somebody screenshots.
 *
 * Inline rather than an `<img src="/logo.svg">` because of the two things an image cannot do: it
 * cannot take the colour of the text around it, and it arrives one request late, which on the
 * prerendered pages means the first thing a visitor sees is a gap where the name goes.
 *
 * The light half is `currentColor` for that first reason — the wordmark sits on the dark chrome
 * today, and a light surface would otherwise need a second file. The cyan is written out. It is
 * the logo's own colour and deliberately brighter than `--brand-tertiary`, which has to survive
 * being text on a page; this never is.
 *
 * The favicon is the same fusion with the rest of the word taken off, in `public/favicon.svg` —
 * at sixteen pixels a word is a smudge, and two letters that overlap are still two letters.
 */
export function Logo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 98 32"
      /*
       * `self-start` earns its place: the footer's brand block is a flex column, and a stretched
       * SVG takes the column's full width, keeps its height, and centres the wordmark inside that
       * — which put the name in the middle of the footer and the tagline under it at the left.
       */
      className={cn('h-6 w-auto self-start text-ink-primary', className)}
      role="img"
      aria-label="Tpipe"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Capital T, joined to the first p along the shared vertical edge. */}
      <path
        fill="currentColor"
        d="M4 3h16a2 2 0 0 1 2 2v3h-7v21a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V8H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
      />

      {/* The first p, fused with the T. */}
      <path
        fill="#19D3D1"
        fillRule="evenodd"
        d="M15 3h9c7.2 0 12 4.7 12 11.5S31.2 26 24 26h-3v3a2 2 0 0 1-2 2h-4V3Zm6 6v11h3c3.7 0 6-2 6-5.5S27.7 9 24 9h-3Z"
      />

      {/* i */}
      <circle fill="currentColor" cx="43" cy="5.5" r="3" />
      <path fill="currentColor" d="M40 10h6v19a2 2 0 0 1-2 2h-4V10Z" />

      {/* The second p */}
      <path
        fill="#19D3D1"
        fillRule="evenodd"
        d="M50 10h9c6.3 0 10.5 3.8 10.5 9.5S65.3 29 59 29h-3v3h-6V10Zm6 5v9h3c2.8 0 4.5-1.6 4.5-4.5S61.8 15 59 15h-3Z"
      />

      {/* e */}
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M95 21.5H77.8c.6 2.2 2.5 3.4 5.3 3.4 2.4 0 4.2-.7 5.8-2.1l3.7 3.4c-2.3 2.5-5.5 3.8-9.8 3.8-6.9 0-11.3-4-11.3-10s4.4-10 10.8-10C90 10 95 14.4 95 20.2v1.3Zm-17.3-4h10.8c-.5-2.2-2.4-3.6-5.4-3.6-2.7 0-4.7 1.3-5.4 3.6Z"
      />
    </svg>
  );
}
