import { Copy, Download, FileInput, Loader2 } from 'lucide-react';
import { StrictMode, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { pageToMarkdown } from '@shared/from-page';
import { getDocStats } from '@shared/markdown';
import { MAX_FILE_SIZE } from '@/components/Dropzone';
import { DocumentPreview } from '@/components/DocumentPreview';
import { Logo } from '@/components/Logo';
import { DEFAULT_CONVERSION } from '@shared/conversions';
import { conversionForFiles, convertFile } from '@/lib/convert';
import { downloadDoc } from '@/lib/download';
import { formatBytes } from '@/lib/format';
import { useI18n, useT } from '@/lib/i18n/context';
import { INTL_LOCALES } from '@/lib/i18n/locales';
import { markdownToHtml } from '@/lib/markdown';
import { mergedName, mergeMarkdown } from '@/lib/merge';
import { useTheme } from '@/lib/theme';
import { Button } from '@/ui/components/Button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/ui/components/Tabs';
import { Typography } from '@/ui/components/Typography';
import { copyText, takeHandoff } from './lib/clipboard';
import { Providers } from './lib/Providers';
import '@/index.css';

/*
 * The viewer: a tab of the extension's own, and the only surface here with room to read.
 *
 * It is where a page converted from the popup is opened at full size, and it is where files are
 * converted — because a popup closes the moment a tab opens in front of it, and a `File` cannot be
 * handed from a closing page to a new one. So the picker lives here: the bytes are read in the page
 * that shows them and go nowhere else. With no account and no network, this is a complete
 * converter for all ten formats, which is what `src/lib/convert.ts` already was.
 */
interface Loaded {
  title: string;
  name: string;
  markdown: string;
}

function Viewer() {
  const t = useT();
  const { locale } = useI18n();
  const { theme } = useTheme();
  const [document_, setDocument] = useState<Loaded | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const picker = useRef<HTMLInputElement>(null);

  /* Whatever the popup left in session memory, or nothing, which means "ask for files". */
  useEffect(() => {
    const parameters = new URLSearchParams(window.location.search);
    const id = parameters.get('doc');

    if (!id) {
      setBusy(false);

      if (parameters.get('open')) {
        /* Opened for files: the picker is the whole point of the page, so it opens itself. */
        requestAnimationFrame(() => picker.current?.click());
      }

      return;
    }

    void takeHandoff(id).then((found) => {
      /*
       * Either it arrived converted, or it arrived as a page — the right-click menu is handled by
       * the service worker, which has no DOM and so cannot have done the conversion itself.
       */
      if (found?.source) {
        const converted = pageToMarkdown(found.source);

        setDocument(converted);
      } else if (found?.markdown) {
        setDocument({
          title: found.title ?? found.name ?? 'page.md',
          name: found.name ?? 'page.md',
          markdown: found.markdown,
        });
      }

      setBusy(false);
    });
  }, []);

  const onFiles = async (files: File[]) => {
    if (files.length === 0) {
      return;
    }

    setBusy(true);
    setError(null);

    try {
      /*
       * The picker takes anything, so the conversion is decided by what was picked; the default is
       * only the answer for a file whose extension names no conversion, and that is a rejection.
       */
      const { id, rejected } = conversionForFiles(DEFAULT_CONVERSION, files, t);

      if (rejected) {
        setError(rejected);
        return;
      }

      const total = files.reduce((sum, file) => sum + file.size, 0);

      if (total > MAX_FILE_SIZE) {
        setError(
          t('converter.toolarge.detail', {
            size: formatBytes(total, INTL_LOCALES[locale]),
            limit: formatBytes(MAX_FILE_SIZE, INTL_LOCALES[locale]),
          })
        );
        return;
      }

      const converted = await Promise.all(
        files.map((file) => convertFile(id, file, t))
      );

      const name = mergedName(
        converted.map((one) => one.name),
        t
      );

      setDocument({
        title: name,
        name,
        markdown: mergeMarkdown(
          converted.map((one) => ({ name: one.name, markdown: one.markdown }))
        ),
      });
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : String(failure));
    } finally {
      setBusy(false);
    }
  };

  const stats = document_
    ? getDocStats(document_.markdown, markdownToHtml(document_.markdown))
    : null;

  return (
    <div className="flex min-h-screen flex-col bg-surface-page">
      <header className="sticky top-0 z-10 border-stroke border-b bg-surface-header/90 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-content items-center gap-4 px-6">
          <Logo />

          {document_ && (
            <Typography
              variant="span"
              textColor="secondary"
              className="min-w-0 truncate text-sm"
            >
              {document_.title}
              {stats
                ? ` · ${t('ext.stats', {
                    words: stats.words.toLocaleString(),
                    size: formatBytes(
                      new Blob([document_.markdown]).size,
                      INTL_LOCALES[locale]
                    ),
                  })}`
                : ''}
            </Typography>
          )}

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => picker.current?.click()}
            >
              <FileInput />
              {t('ext.files')}
            </Button>

            {document_ && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={async () =>
                    setCopied(await copyText(document_.markdown))
                  }
                >
                  <Copy />
                  {copied ? t('ext.copied') : t('ext.copy')}
                </Button>

                <Button
                  size="sm"
                  onClick={() =>
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
              </>
            )}
          </div>
        </div>
      </header>

      {/* The one input in the extension, and it is a plain file picker — no permission, no API. */}
      <input
        ref={picker}
        type="file"
        multiple
        hidden
        onChange={(event) => {
          void onFiles([...(event.target.files ?? [])]);
          event.target.value = '';
        }}
      />

      <main className="mx-auto w-full max-w-content flex-1 px-6 py-8">
        {busy && (
          <div className="flex items-center justify-center gap-2 py-24 text-ink-secondary">
            <Loader2 className="size-4 animate-spin" />
            {t('ext.converting')}
          </div>
        )}

        {!busy && error && (
          <Typography variant="p" textColor="destructive" className="py-8">
            {error}
          </Typography>
        )}

        {!busy && !document_ && !error && (
          <button
            type="button"
            onClick={() => picker.current?.click()}
            className="flex w-full cursor-pointer flex-col items-center gap-2 rounded-2xl border border-stroke border-dashed py-24 text-ink-secondary transition-colors hover:border-stroke-hover"
          >
            <FileInput className="size-6" />
            {t('ext.viewer.empty')}
          </button>
        )}

        {!busy && document_ && (
          <Tabs defaultValue="preview" className="flex flex-col gap-4">
            <TabsList>
              <TabsTrigger value="preview">
                {t('converter.tab.preview')}
              </TabsTrigger>
              <TabsTrigger value="source">
                {t('converter.tab.markdown')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preview">
              <DocumentPreview html={markdownToHtml(document_.markdown)} />
            </TabsContent>

            <TabsContent value="source">
              <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-xl border border-stroke bg-surface-card p-4 font-mono text-sm">
                {document_.markdown}
              </pre>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <Viewer />
    </Providers>
  </StrictMode>
);
