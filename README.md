# Maple Ledger Bookkeeping: request and payment system (demo)

A website and request system for a **fictional** small bookkeeping business, **Maple Ledger Bookkeeping and Accounting Services** (Philippines). Clients pick a service, send their details and documents, pay with a QR code in their own GCash, Maya or bank app, and track their request with a code. The owner and staff manage requests in an admin area.

> **This is a portfolio demo.** The business, its people, the phone numbers, the addresses, the emails and every account are made up. No real client data is in this repository.

**Stack:** Next.js 16 (App Router) · TypeScript (strict) · Tailwind CSS and shadcn/ui · Postgres with Drizzle ORM · Supabase (database, auth, storage) · Tesseract.js (receipt OCR in the browser) · Brevo (email) · Cloudflare Turnstile · Vitest and Playwright

The portfolio case study is the page `/case-study` of this app (not in the menu, hidden from search engines). Its pictures are made with `pnpm screenshots` from fake data.

## What it does

- **Client side:** service list with checklists, a 3-step request with file upload, a payment page with a QR code, receipt reading (OCR) that fills 4 fields, and a tracking page (code plus the last 4 phone digits).
- **Accounts:** email and password with a verified email, optional Google sign-in for clients, "My requests", "My data" (download and delete, Data Privacy Act).
- **Admin side:** requests, payment verification, services and payment methods, settings, activity log, CSV exports, accounts and roles (`user`, `staff`, `admin`, `owner`), and 2-step login (TOTP with two devices).
- **Safety:** one role table checked on every action, database triggers and row-level security as a second layer, rate limits in Postgres, signed links for files, no receipt image stored.

Read `CLAUDE.md` first (rules and stack), then `PROGRESS.md` (what is done and what is not). All design and security notes are in `docs/`.

## Try it on your computer with dummy accounts (no cloud account needed)

You need Node.js 22 or newer and [pnpm](https://pnpm.io). Google Chrome is needed only for the browser tests.

```bash
pnpm install
```

1. Create a file `.env.local` with these **dummy** values (nothing here is a real secret):

```
DATABASE_URL=postgres://postgres:postgres@127.0.0.1:54329/postgres
DIRECT_DATABASE_URL=postgres://postgres:postgres@127.0.0.1:54329/postgres
DB_POOL_MAX=1
APP_BASE_URL=http://localhost:3000
DEV_ADMIN_BYPASS_EMAIL=demo-test+owner@example.com
DEV_USER_BYPASS_EMAILS=demo-test+usera@example.com,demo-test+userb@example.com,demo-test+userc@example.com
ADMIN_NOTIFY_EMAIL=demo-test+admin@example.com
```

2. Start the small local database (keep it running in its own terminal). It saves data in the `.pglite` folder, which is not in git:

```bash
pnpm dev:db
```

3. Put in the dummy accounts and sample data, then start the site:

```bash
pnpm demo:seed
pnpm dev                       # open http://localhost:3000
```

### The dummy accounts

| Who | Email | How to sign in on your computer |
|---|---|---|
| Owner (admin area) | `demo-test+owner@example.com` | Open `http://localhost:3000/admin`. In this mode the 2-step code is `000000` |
| Staff | `demo-test+staff@example.com` | A profile with the `staff` role, for the accounts table |
| Client A | `demo-test+usera@example.com` | `http://localhost:3000/api/dev-login?email=demo-test%2Busera@example.com&next=/account` |
| Client B | `demo-test+userb@example.com` | `http://localhost:3000/api/dev-login?email=demo-test%2Buserb@example.com&next=/account` |

These switches work **only** when `NODE_ENV` is `development`. In a build or on a real server the routes answer 404. See `docs/AUTH_AND_ROLES.md`.

Payment methods in the seed say **SAMPLE - not real**, and the QR image is a sample picture.

## Checks

```bash
pnpm lint
pnpm typecheck
pnpm format:check
pnpm test                      # unit tests (they need no cloud account; they include a scan for secrets)
pnpm test:integration          # proves the public Supabase key cannot read any table (needs a Supabase project)
pnpm test:e2e                  # Playwright in Google Chrome, on the local test database
pnpm screenshots               # remakes the case-study pictures from fake data
```

## Going live (for a real business)

This demo has not been deployed for real clients. `docs/SETUP_GUIDE.md` is a beginner step-by-step guide for a real business (Supabase, Brevo, Turnstile, Vercel), and `docs/SECURITY_CHECKLIST.md` lists every security item with its status. The GitHub Actions in `.github/workflows` for the weekly backup and the scheduled jobs run **by hand only** in this repo, because they need real secrets.

## License

MIT
