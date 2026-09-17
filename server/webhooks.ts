import { createHmac, randomBytes } from 'node:crypto';
import { publicHost } from './address.js';
import { sql } from './db.js';

/*
 * Outbound notifications: a document was created, or a document was shared.
 *
 * Session-only to manage — see the comment on `m2h_webhook` in db/schema.sql for why — and
 * delivered the way a share notice is sent in mail.ts: inline, in the same request, awaited with
 * its own timeout, and never turned into an error for the save or share that triggered it. There
 * is no queue and no retry; a receiver that is down misses that one delivery, and the next event
 * tries again on its own.
 */

export const WEBHOOK_EVENTS = ['document.created', 'document.shared'] as const;
export type WebhookEvent = (typeof WEBHOOK_EVENTS)[number];

export interface WebhookRow {
  id: string;
  url: string;
  events: WebhookEvent[];
  created_at: string;
  last_attempted_at: string | null;
  last_status: number | null;
  last_error: string | null;
}

/** Never returns the secret — see `createWebhook`, the one place it is shown. */
export async function listWebhooks(userId: string): Promise<WebhookRow[]> {
  return (await sql()`
    select id, url, events, created_at, last_attempted_at, last_status, last_error
    from m2h_webhook
    where user_id = ${userId} and revoked_at is null
    order by created_at desc
  `) as WebhookRow[];
}

export async function createWebhook(
  userId: string,
  url: string
): Promise<{ secret: string; row: WebhookRow }> {
  const secret = `whsec_${randomBytes(24).toString('base64url')}`;

  const rows = (await sql()`
    insert into m2h_webhook (user_id, url, secret)
    values (${userId}, ${url}, ${secret})
    returning id, url, events, created_at, last_attempted_at, last_status, last_error
  `) as WebhookRow[];

  return { secret, row: rows[0] };
}

/**
 * The secret again, for a page that needs to show it more than once — unlike an API key, the
 * account owner may legitimately need this value again to configure or debug a receiver.
 */
export async function revealWebhookSecret(
  userId: string,
  id: string
): Promise<string | null> {
  const rows = (await sql()`
    select secret from m2h_webhook
    where user_id = ${userId} and id = ${id} and revoked_at is null
  `) as Array<{ secret: string }>;

  return rows[0]?.secret ?? null;
}

export async function revokeWebhook(userId: string, id: string): Promise<boolean> {
  const rows = (await sql()`
    update m2h_webhook
    set revoked_at = now()
    where user_id = ${userId} and id = ${id} and revoked_at is null
    returning id
  `) as Array<{ id: string }>;

  return rows.length > 0;
}

/**
 * Sends one event to every webhook this account has registered for it.
 *
 * Best effort, in parallel, each with its own timeout — one slow or dead receiver must not hold up
 * the others, and none of them may hold up the request that triggered the event. The signature is
 * HMAC-SHA256 over `timestamp.body`, in the header shape Stripe and GitHub both use, so whatever a
 * receiver already has for verifying one of those needs only the secret changed.
 */
export async function deliver(
  userId: string,
  event: WebhookEvent,
  data: Record<string, unknown>
): Promise<void> {
  const hooks = (await sql()`
    select id, url, secret, events
    from m2h_webhook
    where user_id = ${userId} and revoked_at is null
  `) as Array<{ id: string; url: string; secret: string; events: WebhookEvent[] }>;

  const targets = hooks.filter((hook) => hook.events.includes(event));

  if (targets.length === 0) {
    return;
  }

  const body = JSON.stringify({ event, created_at: new Date().toISOString(), data });
  const timestamp = Math.floor(Date.now() / 1000).toString();

  await Promise.all(
    targets.map(async (hook) => {
      /*
       * The address again, at the moment of posting.
       *
       * It was checked when the webhook was created, and a name resolves to whatever its owner
       * wants it to an hour later. This is the check that matters, because this is the line that
       * makes the request.
       */
      if (!(await publicHost(new URL(hook.url).hostname).catch(() => false))) {
        await sql()`
          update m2h_webhook
          set last_attempted_at = now(), last_status = null,
              last_error = 'that address is not a public one'
          where id = ${hook.id}
        `.catch(() => undefined);

        return;
      }

      const signature = createHmac('sha256', hook.secret)
        .update(`${timestamp}.${body}`)
        .digest('hex');

      try {
        const response = await fetch(hook.url, {
          method: 'POST',
          // A redirect is how a public address becomes an internal one after the check above.
          redirect: 'manual',
          headers: {
            'content-type': 'application/json',
            'x-transformpipe-signature': `t=${timestamp},v1=${signature}`,
          },
          body,
          signal: AbortSignal.timeout(5000),
        });

        await sql()`
          update m2h_webhook
          set last_attempted_at = now(), last_status = ${response.status}, last_error = null
          where id = ${hook.id}
        `;
      } catch (cause) {
        const why = cause instanceof Error ? cause.message : 'delivery failed';

        await sql()`
          update m2h_webhook
          set last_attempted_at = now(), last_status = null, last_error = ${why}
          where id = ${hook.id}
        `.catch(() => undefined);
      }
    })
  );
}
