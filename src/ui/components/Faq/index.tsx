import { type ReactNode, useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../Accordion';

export interface FaqEntry {
  question: string;
  answer: ReactNode;
}

interface FaqProps {
  items: FaqEntry[];
  /** Which question starts open. The first one, unless a page has a better idea. */
  defaultOpen?: string;
  className?: string;
}

/** The answer's own type and inset — shared so the hidden measuring copy wraps identically. */
const ANSWER_TYPE = 'text-ink-body text-sm leading-relaxed';
const ANSWER_INSET = 'px-4';

/**
 * Questions and answers, over the kit's accordion.
 *
 * A card per question with air between them, rather than one bordered list: a list of nine rows
 * reads as a table of contents, and the point here is that each question is a thing you can open.
 * The open one takes the accent border so the answer is visibly attached to its question.
 *
 * One question is open on arrival — a page of collapsed headings tells a first-time reader nothing,
 * and the answer to the first question is usually the one they came with.
 *
 * ### Why the block does not resize as you read
 *
 * Answers are of different lengths, so moving from one question to the next used to change the
 * height of the whole section — the questions below the open one, and everything after the FAQ,
 * jumped up or down under the cursor. Reading three answers meant chasing the list around the page.
 *
 * So every answer is given the height of the longest one. Finding that height needs all of them
 * measured, and the accordion only mounts the one that is open, so a hidden copy of the set is laid
 * out beside it at the same width and watched with a `ResizeObserver` — the width changes with the
 * window and the text changes with the language, and both change the answer that happens to be
 * tallest. Short answers get some empty space under them, which is the price, and it is cheaper
 * than a section that moves while somebody is reading it.
 */
export function Faq({ items, defaultOpen, className }: FaqProps) {
  const [tallest, setTallest] = useState(0);
  const copies = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const holder = copies.current;

    if (!holder) {
      return;
    }

    const measure = () => {
      let max = 0;

      for (const copy of holder.children) {
        max = Math.max(max, (copy as HTMLElement).offsetHeight);
      }

      /*
       * Rounded up, and only ever set when it actually moved: `setState` with the same number is a
       * no-op in React, which is what keeps an observer that fires on every layout from turning
       * into a render loop.
       */
      setTallest(Math.ceil(max));
    };

    measure();

    const observer = new ResizeObserver(measure);

    observer.observe(holder);

    for (const copy of holder.children) {
      observer.observe(copy);
    }

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={cn('relative w-full', className)}>
      <Accordion
        type="single"
        collapsible
        defaultValue={defaultOpen ?? items[0].question}
        className="flex w-full flex-col gap-2.5"
      >
        {items.map((item) => (
          <AccordionItem
            key={item.question}
            value={item.question}
            className={cn(
              'overflow-hidden rounded-xl border border-stroke bg-surface-card transition-colors',
              'not-last:border-b hover:border-stroke-hover',
              'data-[state=open]:border-brand-primary/40 data-[state=open]:bg-surface-accent/50'
            )}
          >
            <AccordionTrigger
              className={cn(
                'rounded-none px-4 py-3.5 text-left',
                'focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-inset',
                'data-[state=open]:text-ink-highlight'
              )}
            >
              {item.question}
            </AccordionTrigger>
            <AccordionContent
              className={cn('pt-0 pb-4', ANSWER_INSET, ANSWER_TYPE)}
            >
              <div style={tallest > 0 ? { minHeight: tallest } : undefined}>
                {item.answer}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/*
        * The set, laid out and never seen: `visibility: hidden` keeps the boxes in the flow — which
        * is the only way to measure them — while taking them out of the tab order and out of what a
        * screen reader reads. It is pinned to the top so it adds no height of its own.
        */}
      <div
        ref={copies}
        aria-hidden="true"
        className={cn(
          'pointer-events-none invisible absolute inset-x-0 top-0',
          /* The card's own border, in nothing: two pixels the real answer does not get to use. */
          'border border-transparent',
          ANSWER_INSET,
          ANSWER_TYPE
        )}
      >
        {items.map((item) => (
          <div key={item.question}>{item.answer}</div>
        ))}
      </div>
    </div>
  );
}
