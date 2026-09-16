import {
  Check,
  Copy,
  Download,
  FileCode2,
  FileInput,
  Link2,
  Loader2,
  Lock,
  Maximize2,
  Save,
  Settings,
} from 'lucide-react';
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { pageToMarkdown, type PageDocument } from '@shared/from-page';
import { getDocStats } from '@shared/markdown';
import { DocumentPreview } from '@/components/DocumentPreview';
import { Logo } from '@/components/Logo';
import { downloadDoc } from '@/lib/download';
import { formatBytes } from '@/lib/format';
import { useI18n, useT } from '@/lib/i18n/context';
import { INTL_LOCALES } from '@/lib/i18n/locales';
import { markdownToHtml } from '@/lib/markdown';
import { useTheme } from '@/lib/theme';
import { Button } from '@/ui/components/Button';
import { Skeleton } from '@/ui/components/Skeleton';
import { Typography } from '@/ui/components/Typography';
import { extract } from './extract';
import { copyText, openInViewer, openViewerForFiles } from './lib/clipboard';
import { useAccount } from './lib/useAccount';
import { Providers } from './lib/Providers';
import '@/index.css';

/*
 * The popup: a launcher that answers before it is asked.
 *
 * It converts the page it was opened over straight away, because the alternative is a panel with
 * one button in it saying "convert" — a click to ask for the only thing this panel does.
 *
 * What it then shows is the document *rendered*, in the product's own stylesheet, rather than a
 * wall of monospace. Somebody presses this button to find out whether the page came out well, and
 * a screenful of Markdown source does not answer that question — it is the thing you look at after
 * you already trust the conversion. Anything worth actually reading goes to the viewer, which has
 * a page's worth of room; this is a glance, so it fades out rather than scrolls.
 */
const PREVIEW_CHARACTERS = 1800;

function Popup() {
  const t = useT();
  const { locale } = useI18n();
  const { theme } = useTheme();
  const [document_, setDocument] = useState<PageDocument | null>(null);
  const [failed, setFailed] = useState<'none' | 'error' | 'restricted'>('none');
  const [host, setHost] = useState('');
  const [fromSelection, setFromSelection] = useState(false);
  const [copied, setCopied] = useState(false);
  const account = useAccount();

  useEffect(() => {
    let live = true;

    const run = async () => {
      try {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });

        if (!tab?.id) {
          throw new Error('no tab');
        }

        /*
         * The pages no extension may touch, named before trying rather than after failing.
         *
         * Chrome's own pages, the store and another extension's pages are refused by the browser,
         * and "this page cannot be read" over the top of `chrome://extensions` reads as a broken
         * extension rather than as the rule it is. A person who has just installed this is looking
         * at exactly that page, so it is the first thing they would ever see it say.
         */
        if (
          /^(chrome|edge|about|devtools|view-source|chrome-extension|moz-extension):/.test(
            tab.url ?? ''
          ) ||
          /^https:\/\/chromewebstore\.google\.com|^https:\/\/chrome\.google\.com\/webstore/.test(
            tab.url ?? ''
          )
        ) {
          if (live) {
            setFailed('restricted');
          }

          return;
        }

        const [result] = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: extract,
        });

        const page = result?.result;

        if (!page?.html) {
          throw new Error('nothing to read');
        }

        const converted = pageToMarkdown(page);

        if (live) {
          setFromSelection(page.selection);
          setHost(new URL(page.url).hostname.replace(/^www\./, ''));
          setDocument(converted);
        }
      } catch {
        /* A tab that has not finished loading lands here, and so does anything unforeseen. */
        if (live) {
          setFailed('error');
        }
      }
    };

    void run();

    return () => {
      live = false;
    };
  }, []);

  const stats = document_
    ? getDocStats(document_.markdown, markdownToHtml(document_.markdown))
    : null;

  return (
    <div className="flex w-[23rem] flex-col bg-surface-page">
      {/* The same two pixels of brand the site's own bar carries, for the same reason. */}
      <div
        aria-hidden="true"
        className="h-0.5 bg-gradient-to-r from-brand-tertiary via-brand-primary to-transparent"
      />

      <div className="flex items-center gap-2 px-4 pt-3 pb-2">
        <Logo className="h-5" />

        {host && (
          <Typography
            variant="span"
            textColor="light"
            className="ml-auto min-w-0 truncate text-xs"
          >
            {host}
          </Typography>
        )}
      </div>

      <div className="flex flex-col gap-3 px-4 pb-4">
        {failed === 'none' ? (
          <div className="flex min-w-0 flex-col gap-1">
            {document_ ? (
              <>
                <Typography
                  variant="span"
                  weight="medium"
                  className="line-clamp-2 leading-snug"
                >
                  {document_.title}
                </Typography>

                {stats && (
                  <Typography
                    variant="span"
                    textColor="secondary"
                    className="text-xs"
                  >
                    {fromSelection ? `${t('ext.selection')} · ` : ''}
                    {t('ext.stats', {
                      words: stats.words.toLocaleString(),
                      size: formatBytes(
                        new Blob([document_.markdown]).size,
                        INTL_LOCALES[locale]
                      ),
                    })}
                  </Typography>
                )}
              </>
            ) : (
              <>
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </>
            )}
          </div>
        ) : (
          <div className="flex items-start gap-3 rounded-xl border border-stroke bg-surface-card p-3">
            <Lock className="mt-0.5 size-4 shrink-0 text-ink-inactive" />
            <Typography variant="p" textColor="secondary" className="text-sm">
              {failed === 'restricted' ? t('ext.restricted') : t('ext.failed')}
            </Typography>
          </div>
        )}

        {failed === 'none' && (
          <div className="relative max-h-52 overflow-hidden rounded-xl border border-stroke">
            {document_ ? (
              /*
                * Scaled down rather than restyled. The document's stylesheet is the product's, and
                * editing its sizes here would make the popup the one place a heading is not a
                * heading; `zoom` shrinks the whole thing — headings, code, tables — in proportion,
                * which is what "a small version of the page" means.
                */
              <div className="[zoom:0.7]">
                <DocumentPreview
                  className="p-4"
                  html={markdownToHtml(
                    document_.markdown.slice(0, PREVIEW_CHARACTERS)
                  )}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2 p-3">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-11/12" />
                <Skeleton className="h-3 w-4/5" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/5" />
              </div>
            )}

            {/* What says there is more of it, without a scrollbar inside a panel this size. */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-surface-page to-transparent" />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Button
            disabled={!document_}
            leftSlot={copied ? <Check /> : <Copy />}
            onClick={async () => {
              if (!document_) {
                return;
              }

              setCopied(await copyText(document_.markdown));
            }}
          >
            {copied ? t('ext.copied') : t('ext.copy')}
          </Button>

          {/*
            * Two downloads, because the app has two: the Markdown, and the self-contained page
            * `buildStandaloneHtml` writes — styles inline, no fonts to fetch, no requests of any
            * kind. That second file is the one people send to somebody who does not read Markdown.
            */}
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="flex-1"
              disabled={!document_}
              leftSlot={<Download />}
              onClick={() =>
                document_ &&
                downloadDoc(
                  document_.name,
                  document_.markdown,
                  Date.now(),
                  theme,
                  'md'
                )
              }
            >
              .md
            </Button>

            <Button
              variant="secondary"
              className="flex-1"
              disabled={!document_}
              leftSlot={<FileCode2 />}
              onClick={() =>
                document_ &&
                downloadDoc(
                  document_.name,
                  document_.markdown,
                  Date.now(),
                  theme,
                  'html'
                )
              }
            >
              .html
            </Button>
          </div>
        </div>
      </div>

      {/*
        * The account, or the offer of one. Saving and publishing are the two things this panel
        * cannot do in the page, so they are the two things a key buys — and with no key the row is
        * one quiet sentence rather than two disabled buttons nobody can explain.
        */}
      {failed === 'none' && (
        <div className="flex items-center gap-2 border-stroke border-t px-4 py-2">
          {account.connected ? (
            <>
              <Button
                variant="secondary"
                size="sm"
                className="flex-1"
                disabled={!document_ || account.state === 'busy'}
                leftSlot={
                  account.state === 'busy' ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Save />
                  )
                }
                onClick={() =>
                  document_ &&
                  void account.save(document_.name, document_.markdown, false)
                }
              >
                {account.state === 'done' && !account.link
                  ? t('ext.saved')
                  : t('ext.save')}
              </Button>

              <Button
                variant="secondary"
                size="sm"
                className="flex-1"
                disabled={!document_ || account.state === 'busy'}
                leftSlot={<Link2 />}
                onClick={async () => {
                  if (!document_) {
                    return;
                  }

                  const saved = await account.save(
                    document_.name,
                    document_.markdown,
                    true
                  );

                  if (saved?.share?.url) {
                    await copyText(saved.share.url);
                  }
                }}
              >
                {account.link ? t('ext.shared') : t('ext.share')}
              </Button>
            </>
          ) : (
            <Button
              variant="transparent"
              size="sm"
              leftSlot={<Settings />}
              onClick={() => chrome.runtime.openOptionsPage()}
            >
              {t('ext.connect')}
            </Button>
          )}
        </div>
      )}

      {/* The two ways out of the popup, on their own ground so they read as a footer. */}
      <div className="flex items-center gap-1 border-stroke border-t px-2 py-1.5">
        <Button
          variant="transparent"
          size="sm"
          disabled={!document_}
          leftSlot={<Maximize2 />}
          onClick={() => document_ && void openInViewer(document_)}
        >
          {t('ext.open')}
        </Button>

        <Button
          variant="transparent"
          size="sm"
          className="ml-auto"
          leftSlot={<FileInput />}
          onClick={() => void openViewerForFiles()}
        >
          {t('ext.files')}
        </Button>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <Popup />
    </Providers>
  </StrictMode>
);
