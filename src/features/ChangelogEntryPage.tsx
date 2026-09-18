import { useEffect, useMemo } from 'react';
import { AppBreadcrumbs } from '@/components/AppBreadcrumbs';
import { DocumentPreview } from '@/components/DocumentPreview';
import { ScrollToTop } from '@/components/ScrollToTop';
import { changelogEntryCrumbs } from '@/lib/breadcrumbs';
import { changelogEntryBySlug, detailIn } from '@/lib/changelog';
import { formatDate } from '@/lib/format';
import { useI18n, useT } from '@/lib/i18n/context';
import { INTL_LOCALES } from '@/lib/i18n/locales';
import { markdownToHtml } from '@/lib/markdown';
import { Badge } from '@/ui/components/Badge';
import { Button } from '@/ui/components/Button';
import { SectionHeading } from '@/ui/components/SectionHeading';
import { Typography } from '@/ui/components/Typography';

/*
 * One entry of the changelog, on a page of its own.
 *
 * The list answers "what changed"; this answers "what is it, and does it help me" — which is a
 * different question, asked by somebody who arrived from a search rather than from the list. So
 * the words here are not the card's words at greater length: the card is the summary and this is
 * the piece, written once, capped by `DETAIL_LIMIT` so that it stays a release note. Anything that
 * wants more room than that is an article and belongs in content/blog.
 *
 * Only entries that carry a slug have one of these. Most never will, and a page per entry would
 * mean a hundred thin pages competing with each other for the same search — the opposite of the
 * reason this exists.
 *
 * English, like the entries themselves and for the reason CLAUDE.md gives; the chrome around it is
 * translated, and so are the date and the trail.
 */
export function ChangelogEntryPage({
  slug,
  onBack,
  onGoToConverter,
}: {
  slug: string;
  onBack: () => void;
  onGoToConverter: () => void;
}) {
  const t = useT();
  const { content, locale } = useI18n();
  const entry = changelogEntryBySlug(slug);

  const piece = entry?.detail ? detailIn(entry.detail, locale) : null;
  const html = useMemo(
    () => (piece ? markdownToHtml(piece.body) : ''),
    [piece]
  );

  /*
   * The tab's title, because this page is reached by an address and the prerendered head is
   * replaced by the bundle the moment it takes over. Restored on the way out, the way the article
   * page does it.
   */
  useEffect(() => {
    if (!entry) {
      return;
    }

    const before = document.title;

    document.title = `${piece?.title ?? entry.title} — TransformPipe`;

    return () => {
      document.title = before;
    };
  }, [entry]);

  if (!entry) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <SectionHeading
          size="lg"
          eyebrow={t('changelog.entry.eyebrow')}
          title={t('changelog.entry.missing.title')}
          description={t('changelog.entry.missing.body')}
          className="pt-2"
        />

        <div>
          <Button variant="secondary" onClick={onBack}>
            {t('changelog.back')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <AppBreadcrumbs
        items={changelogEntryCrumbs(piece?.title ?? entry.title, content, locale)}
        onNavigate={onGoToConverter}
      />

      <div className="flex flex-col gap-3 pt-2">
        {/*
         * The date first, and the version only when there is one — the same order the cards use,
         * so a reader arriving from the list recognises what they clicked.
         */}
        <div className="flex flex-wrap items-center gap-2">
          <Typography
            variant="span"
            textColor="light"
            className="text-xxs uppercase tracking-wide"
          >
            <time dateTime={entry.date}>
              {formatDate(entry.date, INTL_LOCALES[locale])}
            </time>
          </Typography>

          {entry.version && (
            <Badge variant="secondary" size="xs">
              {entry.version}
            </Badge>
          )}
        </div>

        <Typography variant="h1" className="text-2xl md:text-3xl">
          {piece?.title ?? entry.title}
        </Typography>

        {/*
         * The card's own summary, above the piece. It is the sentence a search result showed, so
         * a reader who clicked it should see it again rather than wonder whether they landed
         * somewhere else.
         */}
        <DocumentPreview
          html={markdownToHtml(piece?.summary ?? entry.body)}
          className="md-article"
        />
      </div>

      <DocumentPreview html={html} className="md-article border-t border-stroke pt-6" />

      <div className="border-t border-stroke pt-6">
        <Button variant="secondary" onClick={onBack}>
          {t('changelog.back')}
        </Button>
      </div>

      <ScrollToTop />
    </article>
  );
}
