# PROGRESS.md

What is done, what is not, and what a reader should know. This is a **portfolio demo**. The business (**Maple Ledger Bookkeeping and Accounting Services**), its people, and every piece of data are fictional.

## Status

All eight phases in `docs/PHASES.md` are built:

| Phase | What | State |
|---|---|---|
| 1 | Foundation and database (Drizzle schema, migrations, row-level security, seed) | Done |
| 2 | Public pages with seed content (home, services, how it works, contact, privacy) | Done |
| 3 | Request flow and file upload (3-step request, signed uploads, real file-type check) | Done |
| 4 | Payment QR page and receipt OCR (browser-only OCR, parsers for GCash, Maya, BDO) | Done |
| 5 | Admin area (requests, verify payments, settings, activity log, exports, accounts and roles, 2-step login) | Done |
| 6 | Emails and tracking (Brevo emails, tracking code + last 4 digits) | Done |
| 7 | Security hardening and tests | Done in code. The "before real clients" items in `docs/SECURITY_CHECKLIST.md` stay open on purpose, because nothing here is deployed for real clients |
| 8 | Case study page (`/case-study`) | Done. Pictures are made by `pnpm screenshots` from fake data |

## Checks run on this demo copy

- `pnpm typecheck`, `pnpm lint`, `pnpm format:check`: clean.
- `pnpm test` (Vitest): **58 files, 854 tests, all pass** (this includes the repo-safety test that scans every tracked file for keys, tokens and database passwords).
- Browser tests (`pnpm test:e2e`, Playwright in Google Chrome on the local test database): the last full run had **207 passed, 2 failed, 1 skipped**. The two failures were checked one by one. One was a test that picked a hidden duplicate on the activity page (fixed, and it passes now). The other was the local test database dropping a statement in a cleanup step (`bind message supplies 1 parameters...`). This happens now and then in the **original project too** (the README warns that the local test database allows one connection). Run the test again if it appears.
- Case-study pictures (`pnpm screenshots`): remade with the new brand. The script was updated, because the request form now needs a signed-in test user.

## What changed when this demo was made

- A fictional brand (**Maple Ledger**), a new logo (ML monogram), dummy contact details, and the tracking-code prefix `ML-`.
- All accounts are dummy (`demo-test+...@example.com`). `pnpm demo:seed` adds a dummy owner, a dummy staff account and 5 sample requests to the local test database.
- On a phone the admin header shows only the logo tile. The longer name did not fit in 360 px.
- A few stale browser-test expectations were updated to match the current screens (search field, "2-step" column title, services column widths, two activity-log checks). The same tests also fail on the original project.

## Things to know (limits)

- **Nothing here is deployed with real clients.** Setup guides (`docs/SETUP_GUIDE.md`, `docs/GOOGLE_SIGN_IN_SETUP.md`) describe how a real business would go live. They were not run against a production project for this demo.
- **Payment checks are manual by design.** The app never moves money. OCR only saves typing, and the owner checks the payment in the real GCash, Maya or BDO account.
- **Receipt parsers use synthetic examples.** The receipt fixtures are made up. Real receipt formats can differ, so accuracy on real receipts is unknown.
- **Free-plan limits.** The target is a $0 monthly cost. Hosting on Vercel Hobby is meant for non-commercial use, so a real business should check the current terms.
- **Admin 2-step login can be switched off** with `ADMIN_REQUIRE_2FA=false` for local work. A red banner shows while it is off. It must be on for any real site.

## Decisions that matter

- One role column (`user`, `staff`, `admin`, `owner`) in the `profiles` table. Every action goes through one permission table (`src/lib/permissions.ts`), checked again in the service layer, with database triggers and row-level security as a second layer.
- Client documents never appear on the public tracking page. A signed-in user sees file names and dates only.
- The receipt image is never uploaded or stored. Only four text fields are saved.
- Money is stored as integer centavos. Times are stored in UTC and shown in Asia/Manila time.
- The tracking-code prefix is `ML-` plus 8 characters from a 31-character alphabet with no look-alikes (no 0, O, 1, I, L).
