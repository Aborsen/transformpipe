/*
 * The card an assistant draws when a tool of ours hands back a document.
 *
 * MCP Apps (SEP-1865): a server ships a `ui://` resource whose content is a small self-contained
 * HTML page, a tool points at it through `_meta.ui.resourceUri`, and the host renders it in a
 * sandboxed iframe beside the answer. The tool's `content` is still the text the model reads — the
 * card is for the person — so a host that draws nothing loses nothing, which is the only sane way
 * to ship this while support is uneven.
 *
 * Everything is inline and nothing is fetched. The host's default policy for a resource that
 * declares no domains is `default-src 'none'` with inline script and style allowed, so a stylesheet
 * link or a web font would simply not load; there is no network call in here to fail.
 *
 * The bridge is JSON-RPC over `postMessage`: the view says `ui/initialize`, the host answers with
 * its capabilities and the theme, the view says it is initialised, and the result arrives as
 * `ui/notifications/tool-result`. Opening a link goes back the same way — an iframe this sandboxed
 * cannot navigate the tab itself, and should not be able to.
 */
export const DOCUMENT_CARD_URI = 'ui://transformpipe/document-card';

export const DOCUMENT_CARD_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
:root {
  --ink: #0f172a;
  --body: #334155;
  --muted: #5a6a80;
  --brand: #07807e;
  --card: #ffffff;
  --page: #f8fafc;
  --stroke: #e2e8f0;
}
:root[data-theme="dark"] {
  --ink: #f9fafb;
  --body: #f4f4f5;
  --muted: #b9bfcb;
  --brand: #14a8af;
  --card: #17171e;
  --page: #0f0e14;
  --stroke: #2a2834;
}
* { box-sizing: border-box; margin: 0; }
body {
  padding: 14px;
  background: var(--page);
  color: var(--body);
  font: 14px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
}
.card {
  border: 1px solid var(--stroke);
  border-radius: 12px;
  background: var(--card);
  padding: 14px 16px;
}
.top { display: flex; align-items: flex-start; gap: 10px; }
.glyph {
  flex: none;
  width: 34px; height: 34px;
  display: grid; place-items: center;
  border-radius: 9px;
  background: color-mix(in srgb, var(--brand) 14%, transparent);
  color: var(--brand);
  font: 600 13px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
}
h1 {
  font-size: 15px;
  font-weight: 600;
  color: var(--ink);
  overflow-wrap: anywhere;
}
.badge {
  display: inline-block;
  margin-left: 6px;
  padding: 1px 7px;
  border: 1px solid var(--stroke);
  border-radius: 999px;
  font-size: 11px;
  color: var(--muted);
  vertical-align: 2px;
}
.meta { margin-top: 2px; font-size: 12px; color: var(--muted); }
.excerpt {
  margin-top: 12px;
  padding: 10px 12px;
  max-height: 168px;
  overflow: hidden;
  border-radius: 8px;
  background: var(--page);
  color: var(--body);
  font-size: 13px;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  /* The card is a glance; the document itself is one button away. */
  mask-image: linear-gradient(180deg, #000 70%, transparent);
}
.actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
button {
  font: inherit;
  font-weight: 600;
  font-size: 13px;
  padding: 7px 13px;
  border-radius: 999px;
  border: 1px solid transparent;
  background: var(--brand);
  color: #fff;
  cursor: pointer;
}
button.quiet { background: transparent; border-color: var(--stroke); color: var(--ink); }
button:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }
.empty { color: var(--muted); font-size: 13px; }
</style>
</head>
<body>
<div class="card" id="card"><p class="empty" id="empty">Waiting for the document…</p></div>
<script>
(() => {
  const pending = new Map();
  let next = 1;

  const send = (message) => window.parent.postMessage(message, '*');

  const request = (method, params) =>
    new Promise((resolve, reject) => {
      const id = next++;
      pending.set(id, { resolve, reject });
      send({ jsonrpc: '2.0', id, method, params });
    });

  const notify = (method, params) => send({ jsonrpc: '2.0', method, params });

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const weigh = (bytes) =>
    !bytes ? '' : bytes < 1024 ? bytes + ' bytes' : bytes < 1048576
      ? (bytes / 1024).toFixed(1) + ' kB'
      : (bytes / 1048576).toFixed(1) + ' MB';

  function draw(document_) {
    const card = document.getElementById('card');
    card.textContent = '';

    const top = el('div', 'top');
    top.append(el('div', 'glyph', 'T>'));

    const words = el('div');
    const title = el('h1', null, document_.name || 'Document');

    if (document_.share && document_.share !== 'private') {
      title.append(el('span', 'badge', document_.share === 'people' ? 'shared with people' : 'shared by link'));
    }

    words.append(title);

    const meta = [
      weigh(document_.size),
      document_.words ? document_.words.toLocaleString('en-GB') + ' words' : '',
      document_.headings ? document_.headings + (document_.headings === 1 ? ' heading' : ' headings') : '',
      document_.tables ? document_.tables + (document_.tables === 1 ? ' table' : ' tables') : '',
      document_.created ? String(document_.created).slice(0, 10) : '',
    ].filter(Boolean).join(' · ');

    if (meta) words.append(el('div', 'meta', meta));

    top.append(words);
    card.append(top);

    if (document_.excerpt) card.append(el('div', 'excerpt', document_.excerpt));

    const actions = el('div', 'actions');

    if (document_.url) {
      const open = el('button', null, 'Open in TransformPipe');
      open.addEventListener('click', () => request('ui/open-link', { url: document_.url }));
      actions.append(open);
    }

    if (document_.shareUrl) {
      const shared = el('button', 'quiet', 'Open the shared page');
      shared.addEventListener('click', () => request('ui/open-link', { url: document_.shareUrl }));
      actions.append(shared);
    }

    if (actions.children.length) card.append(actions);
  }

  window.addEventListener('message', (event) => {
    const message = event.data;
    if (!message || message.jsonrpc !== '2.0') return;

    if (message.id !== undefined && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      message.error ? reject(message.error) : resolve(message.result);
      return;
    }

    if (message.method === 'ui/notifications/tool-result') {
      const data = message.params && message.params.structuredContent;
      if (data) draw(data);
    }
  });

  request('ui/initialize', {
    capabilities: {},
    clientInfo: { name: 'TransformPipe document card', version: '1.0.0' },
    protocolVersion: '2026-01-26',
  })
    .then((result) => {
      const theme = result && result.hostContext && result.hostContext.theme;
      if (theme) document.documentElement.dataset.theme = theme;
      notify('ui/notifications/initialized');
    })
    .catch(() => {
      /* A host that does not speak this leaves the sentence the model was given, which says it all
       * anyway. Nothing here is the only copy of anything. */
    });
})();
</script>
</body>
</html>
`;
