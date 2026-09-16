import { AppBreadcrumbs } from '@/components/AppBreadcrumbs';
import { ScrollToTop } from '@/components/ScrollToTop';
import { crumbsForStaticPage } from '@/lib/breadcrumbs';
import { formatDate } from '@/lib/format';
import { useI18n, useT } from '@/lib/i18n/context';
import { INTL_LOCALES } from '@/lib/i18n/locales';
import { ISSUES_URL, type StaticPage as Page } from '@/lib/pages';
import { Typography } from '@/ui/components/Typography';

interface StaticPageProps {
  page: Page;
  onGoToConverter: () => void;
}

/**
 * One page of words — about, contact, or one of the legal three.
 *
 * All five share this renderer because they are the same shape: a title, a line, and sections of
 * short paragraphs. Five components would be five chances for the terms page to drift into looking
 * like a different site than the privacy page, which is precisely where a reader starts to wonder
 * who they are dealing with.
 *
 * The `page` it is handed says which page this is and where it lives; every word on it comes from
 * the catalogue under that same id, so the five shapes are one renderer in five languages rather
 * than twenty-five components.
 */
/**
 * The one piece of markup these pages are allowed: `like this` becomes a code span.
 *
 * The bodies are plain strings — the prerenderer runs in Node with no React in it, and a catalogue
 * a translator edits should not be a place where a stray angle bracket can break a page. But a page
 * explaining what a `.docx` is has file names and commands in nearly every sentence, and printing
 * the backticks is worse than having no emphasis at all. So exactly one thing is parsed, by
 * splitting on the character rather than by running a parser: odd pieces are code, even pieces are
 * words.
 */
function inlineCode(text: string) {
  return text.split('`').map((piece, index) =>
    index % 2 === 1 ? (
      <code
        key={`${index}-${piece}`}
        className="rounded bg-surface-card2 px-1 py-0.5 font-mono text-[0.9em] text-ink-body"
      >
        {piece}
      </code>
    ) : (
      piece
    )
  );
}

export function StaticPage({ page, onGoToConverter }: StaticPageProps) {
  const t = useT();
  const { content, locale } = useI18n();
  const words = content.pages[page.id];
  /* A page can open with another's sections — see `also` in `src/lib/pages.ts`. */
  const sections = page.also
    ? [...content.pages[page.also].sections, ...words.sections]
    : words.sections;

  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <AppBreadcrumbs
        items={crumbsForStaticPage(page, content, locale)}
        onNavigate={onGoToConverter}
      />

      <header className="flex flex-col gap-2">
        <Typography
          variant="h1"
          weight="semibold"
          textColor="primary"
          className="text-2xl md:text-3xl"
        >
          {words.title}
        </Typography>
        <Typography variant="p" textColor="secondary">
          {words.lede}
        </Typography>
        {/*
          * The day itself is not language and stays in `src/lib/pages.ts` beside the path, as the
          * ISO date it is. How it is written out is language, and that is `Intl`'s.
          */}
        {page.updated && (
          <Typography variant="span" textColor="light" className="text-xs">
            {t('page.updated', {
              date: formatDate(page.updated, INTL_LOCALES[locale]),
            })}
          </Typography>
        )}
      </header>

      <div className="flex flex-col gap-8">
        {sections.map((section) => (
          <section key={section.heading} className="flex flex-col gap-3">
            <Typography
              variant="h2"
              weight="semibold"
              textColor="primary"
              className="text-base"
            >
              {section.heading}
            </Typography>

            {section.body.map((paragraph) => (
              <Typography
                key={paragraph.slice(0, 40)}
                variant="p"
                textColor="secondary"
                className="text-sm leading-relaxed"
              >
                {inlineCode(paragraph)}
              </Typography>
            ))}

            {section.items && (
              <ul className="flex flex-col gap-2 pl-5">
                {section.items.map((item) => (
                  <li
                    key={item.slice(0, 40)}
                    className="list-disc text-ink-secondary text-sm leading-relaxed"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      {/*
        * A how-to page ends on the thing it was describing.
        *
        * A real anchor rather than an in-app handler: somebody arrives here from a search engine
        * having asked how to open a file, and the honest end of that page is a link they can open
        * in a new tab, copy, or crawl. The address comes from `src/lib/pages.ts` and the words from
        * the catalogue — a path is the same in five languages and a label is not.
        */}
      {page.action && words.action && (
        <div className="border-stroke border-t pt-6">
          <a
            href={page.action}
            className="inline-flex items-center rounded-lg bg-brand-primary px-4 py-2.5 font-semibold text-sm text-white no-underline transition-colors hover:bg-brand-primary/90"
          >
            {words.action}
          </a>
        </div>
      )}

      {/*
        * Every one of these pages ends by telling somebody where a question goes.
        *
        * Two keys and not one: the anchor sits inside the sentence, so the words before it and the
        * words it carries are separate strings. A translator cannot move the link within the
        * sentence — the price of having a link in it at all.
        */}
      <footer className="border-stroke border-t pt-6">
        <Typography variant="p" textColor="secondary" className="text-sm">
          {t('page.questions')}{' '}
          <a
            href={ISSUES_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="text-brand-tertiary underline-offset-2 hover:underline"
          >
            {t('page.questions.link')}
          </a>
          .
        </Typography>
      </footer>

      <ScrollToTop />
    </article>
  );
}
