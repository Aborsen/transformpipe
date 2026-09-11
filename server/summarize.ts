/*
 * The AI half of the app: one call, one model, cached on the row it describes.
 *
 * Talks to Google's Generative Language API directly, not through the Vercel AI Gateway. The
 * Gateway was tried first — one line, no separate key, since the app already runs on Vercel — but
 * its free tier refuses Anthropic outright and rate-limits everything else under a quota shared
 * across every free Vercel account, not just this one, which made even a single summary
 * unreliable before a payment method was ever on file. A key from Google AI Studio is free,
 * generous, and counted against this account alone. Loaded lazily, like `mammoth` in `v1.ts`, so
 * no request that isn't asking for a summary pays for it.
 */

/** Without a key the endpoint refuses cleanly, the way sign-in does when `NEON_AUTH_BASE_URL` is
 * unset — see `server/auth.ts`. */
export function summaryEnabled(): boolean {
  return Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
}

/**
 * A short summary of a document's Markdown source.
 *
 * Flash, deliberately: three to five sentences is a small, cheap task, and there is no reason to
 * spend a bigger model's budget — or its latency — on it. The slice below is a token budget, not a
 * judgement about long documents: a summary only needs to have read the thing once.
 */
export async function summarize(markdown: string): Promise<string> {
  const { generateText } = await import('ai');
  const { google } = await import('@ai-sdk/google');

  const { text } = await generateText({
    // The alias rather than a dated version: gemini-2.5-flash stopped being offered to new
    // projects mid-project, and an alias is Google's own answer to that churn.
    model: google('gemini-flash-latest'),
    system:
      'You summarise Markdown documents for someone deciding whether to open the full thing. ' +
      'Reply with plain prose only — no headings, no bullet points, no restating the title — ' +
      'three to five sentences that say what the document says.',
    prompt: markdown.slice(0, 60_000),
    // Off, deliberately: this model reasons by default, which spends real time weighing how to
    // phrase three sentences — latency a summary does not need to pay for a document of any size.
    providerOptions: {
      google: { thinkingConfig: { thinkingBudget: 0 } },
    },
  });

  const summary = text.trim();

  if (!summary) {
    throw new Error('The model returned nothing');
  }

  return summary;
}
