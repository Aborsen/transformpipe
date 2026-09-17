import {
  Check,
  ChevronDown,
  Copy,
  Download,
  FileCode2,
  FileInput,
  Link2,
  Loader2,
  Lock,
  Maximize2,
  PanelRight,
  PanelRightClose,
  RefreshCw,
  Save,
  Settings,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { pageToMarkdown, type PageDocument } from '@shared/from-page';
import { getDocStats } from '@shared/markdown';
import { DocumentPreview } from '@/components/DocumentPreview';
import { Logo } from '@/components/Logo';
import { downloadDoc, saveBlob } from '@/lib/download';
import { formatBytes } from '@/lib/format';
import { useI18n, useT } from '@/lib/i18n/context';
import { INTL_LOCALES } from '@/lib/i18n/locales';
import { markdownToHtml } from '@/lib/markdown';
import { useTheme } from '@/lib/theme';
import { Button } from '@/ui/components/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/components/DropdownMenu';
import { Skeleton } from '@/ui/components/Skeleton';
import { Typography } from '@/ui/components/Typography';
import { cn } from '@/ui/lib/utils';
import { extract } from './extract';
import { AccountMenu } from './lib/AccountMenu';
import { copyText, openInViewer, openViewerForFiles } from './lib/clipboard';
import { type HtmlFlavour, pageHtmlFile } from './lib/page-file';
import { useAccount } from './lib/useAccount';


/*
 * The panel this extension shows, in the two places it can be shown.
 *
 * As a popup it is a launcher that answers before it is asked: it converts the page it was opened
 * over straight away, because the alternative is a panel with one button in it saying "convert" —
 * a click to ask for the only thing this panel does.
 *
 * As a side panel it is the same thing, kept open: `live` subscribes it to the tabs, so it follows
 * somebody browsing and shows whatever page they are on. One component either way, because the two
 * differ in when they are on screen and in nothing else.
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
export function PageSurface({ live = false }: { live?: boolean }) {
  const t = useT();
  const { locale } = useI18n();
  const { theme } = useTheme();
  const [document_, setDocument] = useState<PageDocument | null>(null);
  const [failed, setFailed] = useState<'none' | 'error' | 'restricted'>('none');
  const [host, setHost] = useState('');
  const [tabId, setTabId] = useState<number | undefined>(undefined);
  /*
   * A side panel outlives the click that opened it, and `activeTab` does not: the browser grants
   * that for the tab whose button was pressed and for nothing else, so the first tab switch used to
   * leave the panel saying the page could not be read. Reading any tab is a permission of its own,
   * asked for here — in the panel, where it is needed — rather than at install, where it would be
   * asked of somebody who only ever uses the popup.
   */
  const [mayReadTabs, setMayReadTabs] = useState(!live);
  const [fromSelection, setFromSelection] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const account = useAccount();

  useEffect(() => {
    if (!live) {
      return;
    }

    void chrome.permissions
      .contains({ origins: ['<all_urls>'] })
      .then(setMayReadTabs);
  }, [live]);

  const convertActiveTab = useCallback(async (alive: () => boolean) => {
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
          if (alive()) {
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

        if (alive()) {
          setTabId(tab.id);
          setFailed('none');
          setFromSelection(page.selection);
          setHost(new URL(page.url).hostname.replace(/^www\./, ''));
          setDocument(converted);
        }
      } catch {
        /*
         * A tab that has not finished loading lands here, and so does a panel that has not been
         * given permission to read the tab in front of it. The second is answerable, so it is
         * asked about rather than reported as a failure.
         */
        if (alive()) {
          const allowed = await chrome.permissions.contains({
            origins: ['<all_urls>'],
          });

          setMayReadTabs(allowed || !live);
          setFailed(allowed || !live ? 'error' : 'none');
        }
      }
  }, [live]);

  useEffect(() => {
    let alive = true;

    void convertActiveTab(() => alive);

    /*
     * A panel stays open while somebody browses, so it follows them: a new tab, or the same tab
     * arriving somewhere else, is a new document to show. A popup is gone before either can happen,
     * which is why it does not subscribe to anything.
     */
    if (!live) {
      return () => {
        alive = false;
      };
    }

    const again = () => {
      setDocument(null);
      void convertActiveTab(() => alive);
    };

    const onUpdated = (
      _id: number,
      change: { status?: string },
      tab: chrome.tabs.Tab
    ) => {
      if (change.status === 'complete' && tab.active) {
        again();
      }
    };

    chrome.tabs.onActivated.addListener(again);
    chrome.tabs.onUpdated.addListener(onUpdated);

    return () => {
      alive = false;
      chrome.tabs.onActivated.removeListener(again);
      chrome.tabs.onUpdated.removeListener(onUpdated);
    };
  }, [convertActiveTab, live]);

  /*
   * Nothing below the permission card makes sense until the permission is there: a title skeleton
   * that will never fill in and four disabled buttons read as a panel that has hung, which is what
   * the first version of this looked like.
   */
  const blocked = live && !mayReadTabs && !document_;

  const stats = document_
    ? getDocStats(document_.markdown, markdownToHtml(document_.markdown))
    : null;

  /*
   * Saving a page as it looks is not instant: every stylesheet is read and every picture is fetched
   * and turned into a data URI, which on a heavy page is seconds. A button that does nothing
   * visible for that long is a button somebody presses again, so it says what it is doing.
   */
  const saveHtml = async (flavour: HtmlFlavour) => {
    if (!document_ || generating) {
      return;
    }

    setGenerating(true);

    try {
      const file = await pageHtmlFile(document_, flavour, theme, tabId);

      saveBlob(
        document_.name.replace(/\.md$/, '.html'),
        new Blob([file], { type: 'text/html;charset=utf-8' })
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div
      className={
        live
          ? /*
             * The panel is exactly the window's height and does not grow past it: a long document
             * used to push the buttons below the fold, so reading one meant scrolling back up to do
             * anything with it. The document scrolls inside its own box instead, and everything you
             * can press stays where it was.
             */
            'flex h-screen w-full flex-col overflow-hidden bg-surface-page'
          : /*
             * 460 by whatever it needs, against Chrome's ceiling of 800 by 600. The first version
             * was 368 wide, which is a phone's column for a document that is usually a page — the
             * preview wrapped every second word and the buttons sat two to a row.
             */
            'flex w-[28.75rem] flex-col bg-surface-page'
      }
    >
      {/* The same two pixels of brand the site's own bar carries, for the same reason. */}
      <div
        aria-hidden="true"
        className="h-0.5 bg-gradient-to-r from-brand-tertiary via-brand-primary to-transparent"
      />

      <div className="flex items-center gap-2 px-4 pt-3 pb-2">
        <Logo className="h-5" />

        <div className="ml-auto flex items-center gap-0.5">
          <Button
            variant="transparent"
            size="xs"
            aria-label={t('ext.refresh')}
            title={t('ext.refresh')}
            leftSlot={<RefreshCw />}
            onClick={() => {
              setDocument(null);
              setFailed('none');
              void convertActiveTab(() => true);
            }}
          />

          {/*
            * The side panel, opened from here rather than from a settings page: it is a way to look
            * at this, not a preference about the product. Chrome only allows it during a gesture,
            * which a click in this panel is — and the popup closes itself, since the two would
            * otherwise sit on screen saying the same thing.
            */}
          {live ? (
            <Button
              variant="transparent"
              size="xs"
              aria-label={t('ext.panel.close')}
              title={t('ext.panel.close')}
              leftSlot={<PanelRightClose />}
              onClick={() => {
                /*
                 * Both ways, because neither is reliable alone: a side panel document is allowed to
                 * close itself and sometimes does nothing, and the worker's way — disable the panel
                 * for this tab, enable it again — always works but cannot open the compact panel
                 * from inside the page. So the worker is asked to do both, and `window.close()`
                 * follows as the fast path when it does work.
                 */
                void chrome.runtime.sendMessage({
                  type: 'tp-close-panel',
                  thenPopup: true,
                });

                window.close();
              }}
            />
          ) : (
            <Button
              variant="transparent"
              size="xs"
              aria-label={t('ext.panel')}
              title={t('ext.panel')}
              leftSlot={<PanelRight />}
              onClick={async () => {
                const [tab] = await chrome.tabs.query({
                  active: true,
                  currentWindow: true,
                });

                if (tab?.windowId !== undefined) {
                  await chrome.sidePanel.open({ windowId: tab.windowId });
                  window.close();
                }
              }}
            />
          )}
        </div>
      </div>

      <div
        className={cn(
          'flex flex-col gap-3 px-4 pb-4',
          /* A side panel is a whole page tall; the document should use it rather than perch. */
          live && 'min-h-0 flex-1'
        )}
      >
        {blocked && (
          <div className="flex flex-col gap-3 rounded-xl border border-stroke bg-surface-card p-4">
            <Typography variant="p" textColor="secondary" className="text-sm">
              {t('ext.panel.permission')}
            </Typography>

            <Button
              className="w-fit"
              onClick={async () => {
                const granted = await chrome.permissions.request({
                  origins: ['<all_urls>'],
                });

                setMayReadTabs(granted);

                if (granted) {
                  void convertActiveTab(() => true);
                }
              }}
            >
              {t('ext.panel.allow')}
            </Button>
          </div>
        )}

        {!blocked && failed === 'none' ? (
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
        ) : blocked ? null : (
          <div className="flex items-start gap-3 rounded-xl border border-stroke bg-surface-card p-3">
            <Lock className="mt-0.5 size-4 shrink-0 text-ink-inactive" />
            <Typography variant="p" textColor="secondary" className="text-sm">
              {failed === 'restricted' ? t('ext.restricted') : t('ext.failed')}
            </Typography>
          </div>
        )}

        {failed === 'none' && !blocked && (
          <div
            className={cn(
              'relative overflow-hidden rounded-xl border border-stroke',
              live ? 'min-h-0 flex-1' : 'max-h-[22rem]'
            )}
          >
            {document_ ? (
              /*
                * Scaled down rather than restyled. The document's stylesheet is the product's, and
                * editing its sizes here would make the popup the one place a heading is not a
                * heading; `zoom` shrinks the whole thing — headings, code, tables — in proportion,
                * which is what "a small version of the page" means.
                */
              <div className="h-full max-h-[22rem] overflow-y-auto [zoom:0.8]">
                <DocumentPreview
                  className="p-4"
                  html={markdownToHtml(document_.markdown)}
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

          </div>
        )}

        <div className={blocked ? 'hidden' : 'flex flex-col gap-2'}>
          {/*
            * Markdown has two things you can do with it and they belong on one control, the way
            * the HTML already does: the clipboard is what nearly everyone wants — the document is
            * going into something else — and the file is the same thing for people who want it on
            * disk. Two full-width buttons for that made the panel a list of exits.
            */}
          <div className="flex">
            <Button
              className="flex-1 rounded-r-none"
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="rounded-l-none border-l border-l-black/20 px-2"
                  disabled={!document_}
                  aria-label={t('ext.download')}
                  leftSlot={<ChevronDown />}
                />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  onSelect={() =>
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
                  {t('ext.download')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/*
            * Two downloads, because the app has two: the Markdown, and the self-contained page
            * `buildStandaloneHtml` writes — styles inline, no fonts to fetch, no requests of any
            * kind. That second file is the one people send to somebody who does not read Markdown.
            */}
          <div className="flex gap-2">
            {/*
              * Two ways to mean "save the HTML", and the menu is where the difference is said out
              * loud rather than guessed at. The page, with its own structure and its pictures
              * carried inside the file, is the default: it is what somebody who pressed "save this
              * page" was asking for.
              */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  className="flex-1"
                  disabled={!document_ || generating}
                  leftSlot={
                    generating ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <FileCode2 />
                    )
                  }
                  rightSlot={generating ? undefined : <ChevronDown />}
                >
                  {generating ? t('ext.generating') : t('ext.download.html')}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuItem onSelect={() => void saveHtml('snapshot')}>
                  <span className="flex flex-col">
                    <span>{t('ext.html.page')}</span>
                    <span className="text-ink-secondary text-xs">
                      {t('ext.html.page.detail')}
                    </span>
                  </span>
                </DropdownMenuItem>

                <DropdownMenuItem onSelect={() => void saveHtml('article')}>
                  <span className="flex flex-col">
                    <span>{t('ext.html.text')}</span>
                    <span className="text-ink-secondary text-xs">
                      {t('ext.html.text.detail')}
                    </span>
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/*
        * The account, or the offer of one. Saving and publishing are the two things this panel
        * cannot do in the page, so they are the two things a key buys — and with no key the row is
        * one quiet sentence rather than two disabled buttons nobody can explain.
        */}
      {failed === 'none' && account.connected && (
        <div className="flex flex-col gap-2 border-stroke border-t px-4 py-2">
          <div className="flex items-center gap-2">
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
          </div>

          {/* What happened, said out loud: a save that failed silently reads as a dead button. */}
          {account.state === 'failed' && (
            <Typography variant="p" textColor="destructive" className="text-xs">
              {t('ext.share.failed')}
              {account.error ? ` — ${account.error}` : ''}
            </Typography>
          )}

          {account.state === 'done' && account.link && (
            <Typography variant="p" textColor="secondary" className="text-xs">
              {t('ext.shared.link')}
            </Typography>
          )}
        </div>
      )}

      {/*
        * The bar along the bottom: who you are on the left, the two ways out on the right.
        *
        * They were two wide buttons with their words on them, which made a small panel look like a
        * dialog from a decade ago and gave equal weight to the thing people do least. Icons with
        * their names in the tooltip, quiet, at the edge — the work is above this line.
        */}
      <div className="mt-auto flex items-center gap-1 border-stroke border-t bg-surface-header/60 px-2 py-1.5">
        <AccountMenu
          connected={account.connected}
          onChanged={() => account.refresh()}
        />

        <div className="ml-auto flex items-center gap-0.5">
          <Button
            variant="transparent"
            size="sm"
            disabled={!document_}
            aria-label={t('ext.open')}
            title={t('ext.open')}
            leftSlot={<Maximize2 />}
            onClick={() => document_ && void openInViewer(document_)}
          />

          <Button
            variant="transparent"
            size="sm"
            aria-label={t('ext.files')}
            title={t('ext.files')}
            leftSlot={<FileInput />}
            onClick={() => void openViewerForFiles()}
          />
        </div>
      </div>
    </div>
  );
}
