import { useCallback, useEffect, useState } from 'react';
import { saveDocument, signedIn } from './account';

/*
 * Whether this browser has a key, and what to do with it.
 *
 * Two surfaces need the same three states — no key, saving, saved — and the same one-call save, so
 * they share this rather than each growing their own version of it. There is no polling: the key is
 * read when a surface opens, which is the only moment either of them is on screen.
 */
export function useAccount() {
  const [connected, setConnected] = useState(false);
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'failed'>('idle');
  const [link, setLink] = useState<string | null>(null);
  /* The document's id on the account, once there is one: what the share dialog is opened on. */
  const [id, setId] = useState<string | null>(null);
  /* What the server actually said. A failure nobody can read is a failure nobody can report. */
  const [error, setError] = useState<string | null>(null);

  /*
   * Asked again whenever the surface comes back into view. A panel is open while somebody signs in
   * on another tab, and it would otherwise go on offering to connect an account that is connected.
   */
  const refresh = useCallback(() => void signedIn().then(setConnected), []);

  useEffect(() => {
    const check = () => void signedIn().then(setConnected);

    check();
    document.addEventListener('visibilitychange', check);
    window.addEventListener('focus', check);

    return () => {
      document.removeEventListener('visibilitychange', check);
      window.removeEventListener('focus', check);
    };
  }, []);

  const save = useCallback(
    async (name: string, markdown: string, share: boolean) => {
      if (!connected) {
        return null;
      }

      setState('busy');
      setError(null);

      try {
        const saved = await saveDocument(name, markdown, share);

        setId(saved.id);
        setLink(saved.share?.url ?? null);
        setState('done');

        return saved;
      } catch (failure) {
        setError(failure instanceof Error ? failure.message : String(failure));
        setState('failed');

        return null;
      }
    },
    [connected]
  );

  /*
   * Forgotten when the document is. The panel follows somebody browsing, and "Saved" is a fact
   * about the page that was on screen when they pressed it — left standing over the next page it
   * says that page is on the account, which it is not.
   */
  const reset = useCallback(() => {
    setState('idle');
    setLink(null);
    setId(null);
    setError(null);
  }, []);

  return { connected, state, id, link, error, save, refresh, reset };
}
