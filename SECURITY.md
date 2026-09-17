# Reporting a security issue

**Please do not open a public issue for a security problem.** A public issue is how a bug that
affects the people using TransformPipe becomes a bug anyone can use against them, in the window
between the report and the fix.

Report it privately through GitHub:
[**open a security advisory**](https://github.com/raudarlabs/transformpipe/security/advisories/new).
That is a private conversation between you and the maintainers, and it stays private until there is
something to publish.

If you would rather not open a GitHub account for this, write to **raudar.aborsen@gmail.com** — the
same report, the same answer, just without the thread.

## What to expect

- An acknowledgement within **three working days**.
- An assessment — whether it reproduces, and what it affects — within **seven days**.
- A fix deployed as soon as it is ready. TransformPipe deploys continuously; there is no release
  train to wait for.
- Credit in the advisory and in the changelog, under whatever name you ask for, unless you would
  rather not be named.

## What is in scope

The hosted service at `https://transformpipe.com`, and this repository:

- the site and the converters, which run in the browser;
- the API at `/api/v1` and the MCP endpoint at `/api/mcp`, including the OAuth server behind it;
- shared documents at `/s/:token`, and what one account can reach of another's;
- the browser extension;
- the CLI and the GitHub Action.

Particularly interesting: anything that lets one account read or change another's documents,
anything that makes this server fetch or send to an address of your choosing, anything that gets
script into a page that renders somebody's converted document, and anything that publishes a
document that was supposed to be private.

## What is not

- Reports from an automated scanner with nothing behind them — a missing header on a page that has
  no session, a version number in a banner, a rating from an SSL grader.
- Denial of service by volume, and anything that requires flooding the service to demonstrate.
- Social engineering, physical attacks, and anything aimed at the people rather than the software.
- Findings in a third party's infrastructure (Vercel, Neon, Resend, GitHub). Report those to them;
  tell us if it affects this service and we will chase it.

## Testing

Use your own account and your own documents. Do not test against other people's data, do not run
load against the service, and if you find a way to reach somebody else's document, stop at the
proof that you can — do not read it.

There is no bounty. This is a small product; what is on offer is a fast answer, a fix, and credit.
