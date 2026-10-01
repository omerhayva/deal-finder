# DealFinder

DealFinder is a Next.js site for discovering discounted Etsy listings submitted by independent sellers. The public interface defaults to English, with Turkish available from the language selector. Prices are currently shown in USD; the language setting does not convert currency.

## Run locally

Requirements: Node.js 22 (or Node.js 20.9+).

```bash
npm ci
cp .env.example .env.local
npm run dev
```

The development server binds to `0.0.0.0` on port `5555` (`http://localhost:5555`) so the Arena preview can reach it.

The development catalogue starts empty on purpose: the former sample listings used generic Etsy links and were not genuine offers. Local submissions/products use an in-memory store if Supabase is not configured; that data is temporary and will be lost when the process restarts. To exercise the protected admin screens locally, set an `ADMIN_PASSWORD` (at least 16 characters) and an `ADMIN_SESSION_SECRET` (at least 32 characters) in `.env.local`, then sign in at `/admin/login`.

Useful checks:

```bash
npm run typecheck
npm run lint
npm run build
npm audit
```

## Production configuration

The project is prepared for a Vercel deployment, but the hosting provider and domain have not yet been selected. Any Node-compatible Next.js host can be used. Use Node.js 22 for the deployment runtime.

Configure these environment variables in the hosting provider (never commit `.env.local`):

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key used by validated server actions and database repositories. Do **not** prefix with `NEXT_PUBLIC_`. |
| `ETSY_API_KEY` | Server-only Etsy API key in `keystring:shared_secret` format, used to import listing details. Never expose it to the browser. |
| `NEXT_PUBLIC_SITE_URL` | Final HTTPS origin, without a trailing slash; used by metadata, robots, and sitemap |
| `ADMIN_PASSWORD` | Unique, strong password for the single administrator |
| `ADMIN_SESSION_SECRET` | Random signing secret, at least 32 characters; keep stable to preserve sessions |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Optional public support email shown on `/contact` |

Generate an admin session secret locally with `openssl rand -base64 48`. Do not paste secrets into chat or source files. Admin routes and server actions are protected; without admin configuration the private pages cannot be used. Public submissions remain disabled in production until both Supabase and the Etsy API key are configured. Add the API key directly to the hosting provider's encrypted environment settings, not to chat or source control.

## Supabase setup

1. Create a Supabase project and add the project URL and **service-role** key to the deployment environment.
2. In the Supabase SQL editor, run migrations in order: `001_create_submissions_table.sql`, `002_create_products_table.sql`, `003_lock_down_public_access.sql`, `004_add_submission_rate_limit.sql`, and `005_track_seller_trial_start.sql`.
3. Keep Row Level Security enabled. The application uses the service-role key only on the server; anon/authenticated users receive no read access to submissions or click records. The public products policy exposes only approved, unexpired listings.
4. Submit and approve one real Etsy listing in staging, then verify it appears in search, its product page, the sitemap, and its outbound Etsy link.

## Seller trial and listing fees

- The first approved listing from a canonical Etsy shop URL starts that shop's 30-day free trial. Until seller accounts exist, the Etsy shop URL is the trial identity; it is not strong account verification and could be changed by a seller.
- Once a shop's trial expires, new submissions and approvals are held because per-listing payment is not configured. The current code never charges a card or takes payment.
- The per-listing amount, currency, payment provider, and business jurisdiction are still undecided. Set them and complete the payment integration and legal review before accepting paid listings. Do not advertise a specific price or enable paid access until those are finished.

## Before public launch

- Select the host and connect the real domain; set `NEXT_PUBLIC_SITE_URL` to that HTTPS domain.
- Configure Supabase, apply all migrations, and add the Etsy API key in hosting secrets. Verify that production does not use a volatile development store.
- Choose the per-listing fee, currency, payment provider, and seller identity model; complete checkout and webhook verification before paid submissions are enabled.
- Add a real support email and the business/controller details required for the market you serve.
- Add only genuine seller listings and check each price, coupon, image, currency, and expiration date. No demo offers are bundled.
- Review the Terms and Privacy pages for the operator’s legal jurisdiction and actual data practices. The current text is a product-specific draft, not legal advice.
- The current business setting is **no affiliate links or commission**. Update the disclosure before adding any affiliate tracking or paid placement.
- Test the admin sign-in, public submission, review/approval, rejection, expiration, language selector, and mobile layouts on the actual deployment.

## Current scope

- English default, Turkish translation; translation keys are centralized in `lib/i18n/messages.ts` so more locales can be added.
- USD-only seller pricing at launch; switching language only changes text and number/date formatting, not currency conversion.
- Product clicks record a product ID and timestamp in Supabase when configured; no click referrer or IP is stored. Public submission throttling stores a secret-keyed HMAC fingerprint derived from the request IP (not the raw address) and prunes records older than 24 hours on subsequent attempts.
- Sellers paste one Etsy listing link. The server imports available listing metadata through Etsy's Open API; a server-only API key is required. Sellers can add a coupon code or expiration date, and an administrator reviews each submission before publication.
- Amazon and eBay are shown as disabled “Coming soon” marketplace tabs; only Etsy is active and no offers are fabricated.
- One 30-day free trial per Etsy shop begins on the first approved listing. After the trial, per-listing billing is not active; submissions are blocked until the fee and payment provider are configured. No payments are currently taken.
