import { Check, Copy, Download, FileInput, Maximize2 } from 'lucide-react';
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { pageToMarkdown, type PageDocument } from '@shared/from-page';
import { getDocStats } from '@shared/markdown';
import { downloadDoc } from '@/lib/download';
import { formatBytes } from '@/lib/format';
import { useI18n, useT } from '@/lib/i18n/context';
import { INTL_LOCALES } from '@/lib/i18n/locales';
import { markdownToHtml } from '@/lib/markdown';
import { useTheme } from '@/lib/theme';
import { Button } from '@/ui/components/Button';
import { Typography } from '@/ui/components/Typography';
import { extract } from './extract';
import { copyText, openInViewer, openViewerForFiles } from './lib/clipboard';
import { Providers } from './lib/Providers';
import '@/index.css';

/*
 * The popup: a launcher that happens to answer the question straight away.
 *
 * It converts the page it was opened over before anybody asks it to, because the alternative is a
 * panel with one button in it that says "convert" — a click to ask for the only thing this panel
 * does. What it shows is small on purpose: the name, what it weighs, and four ways out of here.
 * Anything worth reading goes to the viewer, which has a page's worth of room.
 */
function Popup() {
  const t = useT();
  const { locale } = useI18n();
  const { theme } = useTheme();
  const [document_, setDocument] = useState<PageDocument | null>(null);
  const [failed, setFailed] = useState(false);
  const [fromSelection, setFromSelection] = useState(false);
  const [copied, setCopied] = useState(false);

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
          setDocument(converted);
        }
      } catch {
        /*
         * The pages a browser will not let anybody script — its own settings, the store, a PDF
         * viewer — land here, and so does a tab that has not finished loading. One sentence is the
         * honest answer to all of them.
         */
        if (live) {
          setFailed(true);
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
    <div className="flex w-[22rem] flex-col gap-3 bg-surface-page p-4">
      <div className="flex min-w-0 flex-col gap-1">
        <Typography variant="span" weight="medium" className="truncate">
          {failed
            ? t('ext.failed')
            : (document_?.title ?? t('ext.converting'))}
        </Typography>

        {stats && document_ && (
          <Typography variant="span" textColor="secondary" className="text-xs">
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
      </div>

      {document_ && (
        <div className="max-h-40 overflow-y-auto rounded-lg border border-stroke bg-surface-card p-3">
          <pre className="whitespace-pre-wrap break-words font-mono text-ink-secondary text-xs">
            {document_.markdown.slice(0, 600)}
            {document_.markdown.length > 600 ? '…' : ''}
          </pre>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Button
          disabled={!document_}
          onClick={async () => {
            if (!document_) {
              return;
            }

            setCopied(await copyText(document_.markdown));
          }}
        >
          {copied ? <Check /> : <Copy />}
          {copied ? t('ext.copied') : t('ext.copy')}
        </Button>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="flex-1"
            disabled={!document_}
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
            <Download />
            {t('ext.download')}
          </Button>

          <Button
            variant="secondary"
            className="flex-1"
            disabled={!document_}
            onClick={() => document_ && void openInViewer(document_)}
          >
            <Maximize2 />
            {t('ext.open')}
          </Button>
        </div>

        <Button variant="tertiary" onClick={() => void openViewerForFiles()}>
          <FileInput />
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
