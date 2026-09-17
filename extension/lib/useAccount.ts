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

  useEffect(() => {
    void signedIn().then(setConnected);
  }, []);

  const save = useCallback(
    async (name: string, markdown: string, share: boolean) => {
      if (!connected) {
        return null;
      }

      setState('busy');

      try {
        const saved = await saveDocument(name, markdown, share);

        setLink(saved.share?.url ?? null);
        setState('done');

        return saved;
      } catch {
        setState('failed');

        return null;
      }
    },
    [connected]
  );

  return { connected, state, link, save };
}
