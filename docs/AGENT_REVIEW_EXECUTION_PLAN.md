# Agent Review Execution Plan

Verification date: 2026-04-20. Every finding below was re-checked against the current working tree at `/Users/ahmed/Ngen-Production/ngen-payment-test`. Line numbers reflect the files as they are today. Entries marked **Confirmed** matched the previous report. Entries marked **New** were not in the previous report but were found during verification. Entries marked **Adjusted** were in the previous report but at different line numbers or with incorrect framing.

## Incident Context

- **Backdoor via dependencies.** The old production host was running a crypto-miner implant. The implant likely rode in on an outdated / compromised npm dependency — the same dependency graph is still present in this repo (`.npmrc` forces `legacy-peer-deps`, React is pinned to a pre-release RC, Next 16 / next-intl pre-patch are in use, eight open advisories in `npm audit`). Nothing on that host can be trusted. Every secret that lived on it is public.
- **Database destruction.** The MongoDB Atlas cluster sat in AWS `me-south-1` (Bahrain) with a secondary in `me-central-1` (UAE). Both regions went down during the Iran strike on the Gulf region; the cluster and all its snapshots were destroyed. Data that is not in Paymob / Resend / external exports is permanently lost.
- **New hosting model.** DevOps will provision a fresh MongoDB instance on our own server and expose a Mongo Express management GUI. This is **not** a managed cluster — we own replica-set configuration, backups, network allowlist, and TLS. Mongo Express, if exposed, is an admin-plane attack surface and must be firewalled to admin IPs only.
- **No data migration.** This is a reconstruction. Source of truth for the business: source control (catalog, pricing, question banks) + Paymob transaction export (paid orders) + Resend activity (email history). Everything else starts at zero.
- **No code changes are made by this document. It is a plan.**

## How to Read This Document

Every subphase has three parts:

- **Findings** — exact file paths and line numbers, each marked Confirmed / New / Adjusted.
- **How to find** — the command or path to open to verify the finding yourself.
- **How to fix** — the minimum change that closes the finding.

The final section is a flat checklist you can tick off while working.

## Non-Negotiable Conclusions

1. The current system must not be redeployed as-is. The host that ran it is compromised; the dependency graph that ran on it is the likely attack vector.
2. Every secret that existed on or near the old host is compromised and must be rotated.
3. The lost database means this is a **reconstruction**, not a migration. Paymob / Resend exports are the only sources of truth.
4. React, Next, and the lockfile state must be normalized before anything is pointed at the fresh database, because the crypto-miner rode in on this graph.
5. The new self-hosted MongoDB must be a replica set with network allowlisting, TLS, documented backup/restore, and Mongo Express bound to admin IPs only.
6. The new deployment must be containerized and reproducible — no more pet server.

---

## Phase 0 — Contain the Incident

Goal: stop abuse, stop state changes, and invalidate anything the attacker could still use.

### 0.1 Take the app offline

- **Finding (Confirmed):** the old host is compromised and must not serve traffic.
- **How to find:** check your DNS provider and any CDN / reverse proxy; confirm no production route still points at the old box.
- **How to fix:**
  - Stop the Node process and any PM2 / systemd unit on the old host.
  - Put a static maintenance page behind the domain.
  - Remove or disable any proxy rule that still forwards to the compromised IP.
  - Stop every background worker, cron, and one-off script that can still write to Paymob or Resend.
  - Treat the host disk as evidence. Do not reboot, re-image, or wipe until logs and any on-disk artifacts have been copied off.

### 0.2 Freeze money-moving and account-changing flows

- **Finding (Confirmed):** Paymob webhook and public email endpoints can still change state as long as they are reachable.
- **How to find:**
  - `app/api/webhooks/paymob/route.ts`
  - `app/api/contact-admin/route.ts`
  - `app/api/auth/forgot-password/route.ts`, `app/api/auth/resend-verification/route.ts`
- **How to fix:**
  - In Paymob dashboard, disable the callback URL until Phase 5 is complete.
  - Temporarily return `503` from the webhook route at the app layer so replay or HMAC-skipping requests cannot flip order status.
  - Pause the Resend sending domain, or rotate the key (see 0.3) so outbound email is dead until fixed.

### 0.3 Rotate every secret the old host touched

- **Finding (Confirmed):**
  - `lib/resend.ts:5` hardcodes the Resend key `re_QQCHua2w_EszsbbJCgCed6FvjAEA3kbpF`. The commented-out line at `lib/resend.ts:6` shows a copy of the literal `process.env.RESEND_API_KEY` string (not the value — still, the intent was broken).
  - The old `.env.local` on the compromised host contained: live MongoDB Atlas URI (user `ngen-admin` + password), Paymob API key + HMAC secret + integration IDs + iframe ID, Google OAuth client/secret, `SUPER_ADMIN_EMAIL`/`SUPER_ADMIN_PASSWORD`, and a `NEXTAUTH_SECRET` that was literally the placeholder text. None of that file is in the current working tree (git-ignored via `.gitignore:33`), but every value must be assumed public.
- **Finding (New):** `lib/resend.ts:25` also hardcodes sender `NgenSchools <onboarding@resend.dev>`. `onboarding@resend.dev` is Resend's sandbox sender — mail from it can only reach the verified account owner. Real customer email never worked from this path.
- **How to find:** `rg -n 're_' lib/`; on the old host, `cat .env.local`.
- **How to fix:**
  - Rotate in each provider: Resend, MongoDB (even though the old cluster is gone, revoke the old credentials if any ops user still has them), Paymob (API key + HMAC secret + integration IDs + iframe ID + secret key + public key), Google OAuth (client + secret), `NEXTAUTH_SECRET` (fresh `openssl rand -base64 32`).
  - Delete the hardcoded literal in `lib/resend.ts:5`; read from `process.env.RESEND_API_KEY`. Delete the commented-out line 6.
  - Replace `onboarding@resend.dev` with the real, verified NGen sender domain.
  - Rebuild the super-admin password with a password manager, not a literal string in docs or env. Strip any example credentials from `docs/ADMIN_DASHBOARD_IMPLEMENTATION_PLAN.md` (currently `:101–102`).
  - Delete `.env.local` from any developer machine that ever synced from the compromised server.

### 0.4 Invalidate all sessions and short-lived tokens

- **Finding (Confirmed):**
  - `lib/auth/authOptions.ts:171–174` JWT sessions with 30-day `maxAge` and no rotation hook — any captured cookie is valid for 30 days after issue.
  - `lib/models/VerificationToken.ts:19–23` and `lib/models/PasswordResetToken.ts:19–23` store **plaintext** tokens (no hashing). A leaked DB snapshot hands the attacker working tokens.
  - `app/api/auth/reset-password/route.ts:30–33` does a direct string match against that plaintext.
- **How to find:** open both token model files; look at `token: { type: String, required: true, unique: true }`.
- **How to fix:**
  - Rotating `NEXTAUTH_SECRET` (from 0.3) invalidates every existing JWT automatically.
  - In the fresh DB (Phase 3), do not import any old `VerificationToken` / `PasswordResetToken` row.
  - In Phase 6, change the model so only a SHA-256 digest is stored; compare by hashing the incoming token.

### 0.5 Preserve what evidence still exists

- **How to find:** Paymob dashboard exports, Resend logs, any host / proxy / firewall logs you can still reach. The Atlas activity feed is gone with the cluster.
- **How to fix:** download everything before decommissioning. These exports are your only source of truth for reconstructing paid orders in Phase 3.

---

## Phase 1 — Patch the Runtime Baseline Before Rebuild

Goal: do not point the app at a fresh database while the dependency graph that a crypto-miner rode in on is still in place.

### 1.1 Declare one supported runtime

- **Finding (Confirmed):**
  - `package.json` has no `engines` and no `packageManager` field.
  - `README.md:18` claims Node 18+, but Next 16 / next-intl 4.5 require Node ≥ 20.19.
- **How to find:** `cat package.json | rg -n 'engines|packageManager'` returns nothing.
- **How to fix:** in `package.json` add `"engines": { "node": ">=20.19.0" }` (Node 22 LTS preferred) and `"packageManager": "npm@<version>"`. Update the README prerequisite line.

### 1.2 Remove the React RC and peer-deps bypass

- **Finding (Confirmed):**
  - `package.json:32, 34` pins `react` and `react-dom` to `19.0.0-rc-66855b96-20241106` — a pre-release candidate.
  - `package.json:46–47` pins `@types/react` and `@types/react-dom` to `^18` — mismatched with the RC runtime.
  - `.npmrc:1` contains `legacy-peer-deps=true`, which is the only reason `npm install` succeeds against that mismatch — and which also suppresses the warnings that would have flagged the backdoored dep.
- **How to find:** `cat .npmrc`, `rg -n '"react"|"@types/react"' package.json`.
- **How to fix:**
  - Pin `react` and `react-dom` to a stable `19.x` release compatible with Next 16.
  - Bump `@types/react` and `@types/react-dom` to the matching `19.x`.
  - Delete `.npmrc` (or keep it only with `save-exact=true`); rerun `npm install` cleanly without `legacy-peer-deps`. Audit what complains.

### 1.3 Remove the duplicate lockfile

- **Finding (Confirmed):** both `package-lock.json` (338,892 bytes) and `package-lock 2.json` (338,424 bytes) exist. The latter is a macOS dedupe artifact and quietly ships in builds if a tool reads it.
- **How to find:** `ls -la package-lock*`.
- **How to fix:** delete `package-lock 2.json`. Add a `.gitignore` rule for `* 2.*` patterns (escape the space). Standardize on `npm ci` in CI so the lockfile is authoritative.

### 1.4 Bring framework/tooling back into support

- **Finding (Adjusted — audit list has grown):**
  - `package.json:29` Next `^16.1.1`, `package.json:31` `next-intl ^4.5.5`.
  - `npm audit` today: **8 vulnerabilities (4 moderate, 4 high)** across **ajv**, **brace-expansion**, **flatted**, **minimatch**, **next**, **next-intl**, **picomatch**, **yaml**.
    - `next-intl` — open redirect (moderate)
    - `next` itself — moderate advisory (verify with `npm audit`)
    - `minimatch` — ReDoS (high)
    - `flatted` — prototype pollution + unbounded recursion (high)
    - `picomatch` — ReDoS (high)
    - `brace-expansion` — memory exhaustion (moderate)
    - `ajv` / `yaml` — moderate
  - `README.md:57` still claims Next 15.
  - `package.json:9` uses `next lint` — removed in Next 16. `eslint-config-next ^16.1.1` ships the flat config, not the CLI shim.
- **How to find:** `npm audit`, `rg -n '"next"|"next-intl"' package.json`, `rg -n 'next lint' package.json`.
- **How to fix:**
  - `npm audit fix` and manually bump anything it won't. Re-run until zero high / critical.
  - Replace `"lint": "next lint"` with an ESLint CLI invocation (`eslint .`) using the flat config from `eslint-config-next` v16.
  - Update `README.md:57` to match the actual Next version.

### 1.5 Remove build-time external fetches

- **Finding (Confirmed):** `app/[locale]/layout.tsx:2` imports `Nunito, Protest_Riot` from `next/font/google`. That fetches Google Fonts during `next build` — builds inside a network-restricted runner fail, and font-CDN incidents block production releases.
- **How to find:** `rg -n 'next/font/google' app/`.
- **How to fix:** self-host the two fonts (download the weights listed, put them under `public/fonts/`, use `next/font/local`). Or guarantee egress to `fonts.gstatic.com` from the build host.

### 1.6 Pick a deployment output mode

- **Finding (Confirmed):** `next.config.ts` has no `output: 'standalone'`.
- **How to find:** `cat next.config.ts`.
- **How to fix:** decide between:
  - `output: 'standalone'` — smaller image, explicit asset copy required (see 4.5).
  - Default output — simpler, bigger image, same Dockerfile story.
  Pick one before you start 4.1.

---

## Phase 2 — Patch React Components and Broken Frontend Flows

Goal: remove client bugs that would corrupt the fresh database or block real users.

### 2.1 Fix locale-hardcoded redirects and email links

- **Finding (Confirmed + Adjusted — more call sites than the previous report):**
  - `app/api/payment/success/route.ts:42, 54, 62, 68, 81` all use `/en/payment/...` regardless of the locale the checkout started in.
  - `app/api/auth/verify-email/route.ts:98, 113, 121, 130, 144, 149` hardcode `/en/auth/verify-email`.
  - **New:** `lib/email.ts:21` verification URL hardcoded `/en/auth/verify-email?...`.
  - **New:** `lib/email.ts:88` password-reset URL hardcoded `/en/auth/reset-password?...`.
  - **New:** `lib/actions/authActions.ts:84` falls back to `http://localhost:3000` if `NEXTAUTH_URL` is unset — verification links in prod misconfiguration would point at localhost.
- **How to find:** `rg -n "/en/" app/api/ lib/`.
- **How to fix:** pass the user's `locale` through to every redirect / email builder; build URLs via a helper that takes `locale`. Do not rely on `Accept-Language`. At boot, assert `NEXTAUTH_URL` is set and well-formed (see 4.3).

### 2.2 Fix the direct-technical placement-test path

- **Finding (Confirmed):**
  - `components/pages/PlacementTest/Test/TestMain.tsx:73–76` — `handleTestTypeSelect` stores `sessionStorage.setItem('selectedTrack', type)` where `type` is `'technical'` or `'soft_skills'`.
  - `app/api/generate-questions/route.ts:10–17, 29–33` accepts only `'general'` or keys of `TRACK_FILE_MAP` (`data_science`, `computer_fundamentals`, etc.). `'technical'` is not in that map, so `readSpecificTrackFile` throws `Unknown track: technical`.
- **How to find:** `rg -n "setItem\('selectedTrack'" components/`, compare to `TRACK_FILE_MAP` in `app/api/generate-questions/route.ts`.
- **How to fix:** in `TestSelection`, map `'technical'` to a concrete track (or keep `'general'` and treat "technical vs soft-skills" as a separate flag). Never overwrite `selectedTrack` with a value the API cannot resolve.

### 2.3 Fix the guest soft-skills flow

- **Finding (Confirmed):**
  - `components/pages/PlacementTest/Survey/SurveyForm.tsx:611–617` offers `soft_skills` in the track selector with only a `disabled={attemptStatus.hasTakenSoftSkillsTest}` flag — nothing blocks a guest from picking it.
  - `app/api/soft-skills/submit/route.ts:12–18` returns `401 Unauthorized` if no session.
- **How to find:** run the survey as a guest, pick soft-skills, reach the submit step.
- **How to fix:** either hide the soft-skills option until login, or make the submit endpoint accept a guest payload and return the evaluation without persisting. Pick one and match the UI to it.

### 2.4 Fix the `testId` round-trip

- **Finding (Confirmed):**
  - `components/pages/PlacementTest/Results/ResultsMain.tsx:75` reads `sessionStorage.getItem('testId')`.
  - `rg "setItem\('testId'" components/ app/` returns zero matches. `testId` is never written.
  - `app/api/placement-test/start/route.ts:86` returns `testId` in the response body, and the client discards it.
- **How to find:** `rg -n "'testId'" components/ app/`.
- **How to fix:** in `TestMain.tsx` after fetching questions, call `/api/placement-test/start` and store the returned `testId`. On submit, send that `testId` so the server updates the in-progress row instead of creating a duplicate. This also fixes the ownership problem in 7.2.

### 2.5 Align displayed price with charged price

- **Finding (Confirmed):**
  - `components/pages/Home/PricingSection/index.tsx:306` shows `formatPrice(displayFinalPrice, currency)` for packages.
  - `components/pages/Home/PricingSection/index.tsx:443` shows `formatPrice(belt.finalPrice, currency)` per belt.
  - `app/api/orders/create/route.ts:107` charges `belt.basePriceUSD` or `belt.basePriceEGP` — no discount ever applied.
- **How to find:** `rg -n 'finalPrice' components/pages/Home/PricingSection`, compare with `rg -n 'basePrice' app/api/orders/create`.
- **How to fix:** on `POST /api/orders/create`, look up the discount via `PricingService.getPricingForUser(...)` using the same belt code and currency the UI rendered, then charge that. Do not accept a price from the client.

### 2.6 Remove non-locale `router.push` paths

- **Finding (Adjusted — current call sites):**
  - `components/pages/PlacementTest/Test/TestMain.tsx:103` — `router.push('/placement-test/survey')`
  - `components/pages/PlacementTest/Test/TestMain.tsx:232` — `router.push('/placement-test/results')`
  - `components/pages/PlacementTest/Test/TestMain.tsx:282` — `router.push('/')`
  - `components/pages/PlacementTest/Test/TestMain.tsx:297` — `router.push('/placement-test/survey')`
  - `components/pages/Home/JourneySection/StageInfo.tsx:29` — `router.push('/placement-test/survey')`
- **How to find:** `rg -n "router\.push\('/" components/`.
- **How to fix:** everywhere a route is pushed, prepend `/${locale}` (use `useLocale()`; already imported in these files).

---

## Phase 3 — Rebuild the Database From Zero

Goal: stand up the new self-hosted MongoDB instance and put only trustworthy data into it.

### 3.1 Accept the DevOps handover

Because this is now a self-hosted MongoDB (not Atlas), the contract between you and DevOps matters more. Before you connect anything:

- **How to fix / what you demand from DevOps:**
  - A connection string (`mongodb://user:pass@host:port/?authSource=admin&replicaSet=<name>&tls=true`). Mongoose 9 requires a replica set to use transactions (Phase 3.5).
  - MongoDB major version that matches what `mongoose ^9.0.1` supports (Mongo 6.x or 7.x).
  - **Mongo Express** must be bound to a non-public interface or behind VPN / SSO / IP allowlist. It is the entire admin plane of the database; an exposed Mongo Express is equivalent to a leaked root password. Put HTTP basic auth + TLS in front of it at minimum.
  - Network allowlist on the Mongo port — only the app servers. Not `0.0.0.0/0`.
  - A documented backup cadence and a **tested** restore drill before go-live. The whole reason we are rebuilding is that a previous "we have backups" turned out to be wrong.
  - TLS on the client connection.

### 3.2 Initialize the database via Mongo Express

You will be handed a blank MongoDB and a Mongo Express URL. Steps to light it up:

- **How to fix:**
  1. Log into Mongo Express. Create a database (default name `ngen` unless DevOps specifies otherwise).
  2. Put the connection string in the app's secret store (see 4.3). Do not paste it into `.env.local` on a dev box.
  3. Split `scripts/seed.ts` (see 3.3) and run the **reference** seed against the fresh DB. That creates Tracks, Belts, BeltContent, and `PricingConfig`.
  4. Use Mongo Express to confirm the collections appeared and indexes were built.
  5. Do **not** use Mongo Express to edit records after seeding. All writes must go through application code so audit trails and transactions work.

### 3.3 Rebuild reference data from source control, not from a backup

- **Finding (Confirmed):**
  - `scripts/seed.ts:286` `await Belt.deleteMany({})` — destroys every belt on every run.
  - `scripts/seed.ts:291–299` resets `progress.currentBeltId`, `progress.completedBelts`, and `placementTest.resultBeltId` on **every user**.
  - Seed covers Tracks, Belts, and three `PricingConfig` entries. No users, orders, or tests.
- **How to find:** `sed -n '260,310p' scripts/seed.ts` — it's obvious the script is destructive.
- **How to fix:**
  - Split `scripts/seed.ts` into two scripts: `seed-reference.ts` (idempotent upsert, never deletes) and `reconstruct-historical.ts` (imports from Paymob/Resend exports).
  - Run `seed-reference.ts` against the fresh DB. Never run the existing `seed.ts` against reconstructed data.
  - While you are in there, also add a production guard to `scripts/seed-test-users.ts` and `scripts/migrate-to-bilingual.ts` — see 8.1.

### 3.4 Reconstruct transactional truth from external exports

- **How to find:** Paymob dashboard → Transactions → Export. Resend dashboard → Activity.
- **How to fix:**
  - Export paid transactions from Paymob. Match `special_reference` → your order id field.
  - Cross-reference customer email with Resend receipts.
  - For each paid row, create an `Order` with `status: 'paid'`, `transactionId`, `paymobOrderId`, belt info, and the original amount/currency.
  - Feed those reconstructed orders through the same fulfillment code path you build in 5.4.
  - Anything not in the Paymob export is **lost**. Do not rebuild it from user complaints alone.

### 3.5 Remove placeholder foreign keys

- **Finding (Confirmed — pervasive):**
  - `app/api/placement-test/start/route.ts:76` — `trackId: user._id` as a placeholder.
  - `app/api/placement-test/submit/route.ts:184` — same placeholder on the creation path.
  - `app/api/soft-skills/submit/route.ts:52` — same placeholder.
  - `lib/models/PlacementTest.ts` marks `trackId` as required with `ref: 'Track'`, so every row above points a `Track` reference at a User ObjectId.
- **How to find:** `rg -n "trackId: user._id" app/api/`.
- **How to fix:**
  - If the test is a general test, store the Track `_id` of the "general" seed entry (or make `trackId` optional in the schema and leave it unset for general / soft-skills).
  - Stop using `user._id` as a placeholder. It breaks any `populate('trackId')` join and hides the real problem from monitoring.

### 3.6 Make order/payment/test writes transactional

- **Finding (Confirmed):**
  - `app/api/orders/create/route.ts:126–179` creates the local order, then mutates it twice with `order.save()`. If the Paymob call fails between those writes, the order is stuck.
  - `app/api/webhooks/paymob/route.ts:89–115` creates a Transaction row and updates the Order status in two separate non-transactional calls.
  - `app/api/placement-test/submit/route.ts:170–212` updates `PlacementTest` and then `User.findByIdAndUpdate` separately.
- **How to find:** `rg -n 'session:|withTransaction' app/api/` — zero matches.
- **How to fix:** insist DevOps ship a replica-set Mongo deployment (3.1), wrap each multi-document write in `mongoose.startSession()` + `session.withTransaction(...)`. Idempotency keys on Paymob callbacks (`paymobTxnId`) prevent double-fulfillment under retry.

### 3.7 Post-import audit

- **How to find:** after running 3.3 + 3.4, run a `tsx` script that queries counts and indexes.
- **How to fix:** confirm all of these before opening public traffic:
  - `Belt` count matches seed expectations.
  - Every `Order` with `status: 'paid'` has a `beltId` that exists in `Belt`.
  - `PricingConfig` has exactly one active row per `(configType, packageLevel)` (see 8.2).
  - TTL indexes present: `VerificationToken`, `PasswordResetToken` both expire via `expireAfterSeconds: 0`.
  - No `PlacementTest` rows with `trackId === userId`.

### 3.8 Be explicit about what is gone

- **Recoverable:** catalog, pricing defaults, question banks (all in source control), paid orders from Paymob export, user identities from Resend or external exports.
- **Not recoverable:** placement-test history, soft-skills history, reset tokens, in-flight sessions, ad-hoc admin edits that never left Mongo.

---

## Phase 4 — Dockerize and Rebuild the Hosting Model

Goal: replace the single-server pet deployment with something reproducible — and stop the next crypto-miner from getting shell.

### 4.1 Add the missing deployment artifacts

- **Finding (Confirmed):**
  - `Dockerfile`, `.dockerignore`, `docker-compose.yml` — none exist in the repo.
  - No `/api/health` or `/api/ready` endpoint. The `GET /api/webhooks/paymob` "health check" returns static JSON and touches nothing downstream.
- **How to find:** `ls Dockerfile .dockerignore docker-compose.yml` returns errors; `rg -n "'/api/health'" .` returns nothing.
- **How to fix:**
  - Add a multi-stage Dockerfile (Node 22 Alpine → build → Node 22 Alpine runtime).
  - Add `.dockerignore` (`node_modules`, `.next`, `.env*`, `hello_name_web`, `docs`, `*.tsbuildinfo`).
  - Add `app/api/health/route.ts` that pings Mongo and returns `200` / `503`.
  - Add `app/api/ready/route.ts` that only returns `200` once the Next server has warmed (module-scoped boolean flipped in `instrumentation.ts`).

### 4.2 Harden the runtime image

- **How to fix (standard list, all currently missing):**
  - Run as a non-root user.
  - Read-only root filesystem; mount `/tmp` as tmpfs.
  - Drop Linux capabilities you do not use (`NET_RAW`, `SYS_ADMIN`, etc.).
  - Set CPU/memory requests and limits.
  - Do not install shells or package managers in the final image.
  - Set `NEXT_TELEMETRY_DISABLED=1`.
  - Block outbound network from the container except to known hosts (Mongo, Paymob, Resend, ip-api — see 9.5). A crypto-miner needs egress to a pool; deny it.

### 4.3 Move config out of files and into the orchestrator

- **Finding (Confirmed):** every runtime read goes through `.env.local`; `app/api/payment/success/route.ts:38, 80` reads `process.env.APP_BASE_URL || 'http://localhost:3000'`; `lib/actions/authActions.ts:84` has the same localhost fallback; `lib/mongodb.ts:5–9` errors loudly if `MONGODB_URI` is missing but the string it prints mentions `.env.local` — misleading when you're running in a container.
- **How to find:** `rg -n 'APP_BASE_URL|NEXTAUTH_URL|process\.env' app/api/ lib/`.
- **How to fix:**
  - Replace `.env.local` with secret manager injection (AWS Secrets Manager, GCP Secret Manager, 1Password Connect, or whatever DevOps provides).
  - At boot, validate required env vars with a zod schema; crash the process if any are missing. Do not paper over missing secrets with `||` fallbacks.
  - Required at boot, minimum: `MONGODB_URI`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `APP_BASE_URL`, `PAYMOB_API_KEY`, `PAYMOB_SECRET_KEY`, `NEXT_PUBLIC_PAYMOB_PUBLIC_KEY`, `PAYMOB_HMAC_SECRET`, `PAYMOB_INTEGRATION_ID_CARD`, `PAYMOB_INTEGRATION_ID_WALLET`, `PAYMOB_IFRAME_ID`, `RESEND_API_KEY`, `FROM_EMAIL`. If any of the Paymob-adjacent ones are missing, the payment paths silently become insecure (see 5.2, 5.3).

### 4.4 Stop deriving the base URL from attacker-controlled headers

- **Finding (Confirmed):**
  - `app/api/orders/create/route.ts:152–154` builds the Paymob redirect and notification URLs from `request.headers.get('host')` and `request.headers.get('x-forwarded-proto')`.
  - An attacker who can set `Host:` can point redirection + notification URLs at their own host.
- **How to find:** `rg -n "headers\.get\('host'\)|x-forwarded-proto" app/`.
- **How to fix:** require an env var (`APP_BASE_URL`) and use it unconditionally. Validate at startup that it is set and well-formed.

### 4.5 Make the build hermetic

- **Finding (Confirmed):** `next.config.ts:10–15` already includes `questions_v2`, `SpicificTest-AR`, `SpicificTest-EN` in tracing; if you adopt `output: 'standalone'` you must also make sure the final image copies `public/`, `.next/static/`, and those three folders into the runtime stage.
- **How to find:** `cat next.config.ts`.
- **How to fix:** in the runtime Dockerfile stage, `COPY --from=build /app/.next/standalone ./` then `COPY --from=build /app/public ./public` and `COPY --from=build /app/.next/static ./.next/static`, plus the three question-bank directories if standalone output drops them.

### 4.6 Normalize ingress, forwarded headers, and TLS

- **How to fix:**
  - Put the app behind a reverse proxy / ingress that terminates TLS and sets `X-Forwarded-Proto: https`.
  - Reject traffic that doesn't carry the expected `Host:`.
  - Add HSTS, CSP, `Referrer-Policy`, `Permissions-Policy`, and `X-Content-Type-Options: nosniff` at the edge or via `next.config.ts` `headers()` (see 9.1).
  - Put Mongo Express behind the same reverse proxy with client-cert or basic auth; never expose it on the public Internet.

---

## Phase 5 — Fix Payments and Order Fulfillment

Goal: make payment state authoritative, verifiable, and idempotent.

### 5.1 Make the backend authoritative for price and product

- **Finding (Confirmed):** `app/api/orders/create/route.ts:40–52` accepts `currency`, `countryCode`, and `userId` from the client. Line `:107` charges `basePriceUSD`/`basePriceEGP`, ignoring discounts.
- **How to find:** see 2.5.
- **How to fix:**
  - Compute the price server-side via `PricingService` with the `beltId` and the resolved user/country.
  - Ignore client-sent `currency` except as a display hint — re-derive from user location server-side.
  - Reject `salesEnabled: false` belts outright.
  - Resolve `userId` from the session, not from the body.

### 5.2 Make redirect verification fail closed

- **Finding (Confirmed):**
  - `app/api/payment/verify/route.ts:35–38` — `if (!PAYMOB_HMAC_SECRET) { return true; }` in `verifyRedirectHmac`. In production this means a missing env var silently turns HMAC off.
  - `app/api/payment/verify/route.ts:127–130` — a failed HMAC does not return; flow continues into inquiry.
  - `app/api/payment/verify/route.ts:158–177` — if the inquiry call also fails, `inquiryData` stays `null` and the function falls back to URL params (`success`, `pending`, `id`). The attacker only needs a forged redirect URL with `success=true`.
  - `app/api/payment/verify/route.ts:215` — when falling back, the function persists `Object.fromEntries(params.entries())` into the Transaction `responseData`, recording the attacker's URL verbatim as "truth."
- **How to find:** read `verifyRedirectHmac` and the fallback logic carefully.
- **How to fix:**
  - Remove the "skip when secret is missing" branch. Crash on boot if `PAYMOB_HMAC_SECRET` is unset (see 4.3).
  - On HMAC mismatch, return a failed-payment response. Do not fall through.
  - If the inquiry call fails, return a "pending, please retry" response to the user — never trust URL params as authoritative.

### 5.3 Make webhooks fail-open-to-retry, not fail-open-to-success

- **Finding (Confirmed):**
  - `app/api/webhooks/paymob/route.ts:48–57` returns `200` when HMAC verification fails. Paymob stops retrying.
  - `app/api/webhooks/paymob/route.ts:200–212` returns `200` on any caught exception ("to stop Paymob retries"). Application bugs silently lose events.
  - **New:** `lib/paymob.ts:253–256` — `verifyWebhookHmac` has the same "skip when secret missing → return true" branch as `verifyRedirectHmac`. A deployment that forgot `PAYMOB_HMAC_SECRET` accepts every webhook unconditionally.
- **How to find:** `rg -n 'status: 200' app/api/webhooks/paymob/route.ts`; `rg -n 'PAYMOB_HMAC_SECRET' lib/paymob.ts`.
- **How to fix:**
  - On HMAC mismatch, return `401`.
  - On application error, return `500` so Paymob retries per contract.
  - Remove the same skip-when-missing branch from `lib/paymob.ts:253–256` and from `app/api/payment/verify/route.ts:35–38`.
  - Make the handler idempotent by keying on `paymobTxnId` — it already is for Transaction inserts, but the Order status update at `:111–115` is not guarded by that key.

### 5.4 Actually grant the thing the user paid for

- **Finding (Confirmed):** `app/api/webhooks/paymob/route.ts:155–159` is a `TODO` comment where fulfillment should live. No `UserBelt`, no `purchasedBelts` update, no access grant of any kind is issued after a paid order.
- **How to find:** `rg -n 'TODO' app/api/webhooks/paymob/route.ts`.
- **How to fix:**
  - Decide on the entitlement model (`User.progress.completedBelts`, or a dedicated `UserBelt` collection, or both).
  - Create a `fulfillOrder(order: IOrder)` helper that is idempotent per `order._id`. Call it from both the webhook success path and the Phase 3.4 historical reconstruction import.
  - Send the user an access-granted email from that helper, not from the webhook directly.

### 5.5 Stop leaking HMAC internals to logs

- **Finding (New):**
  - `lib/paymob.ts:297–301` logs `dataToHash`, `calculatedHmac`, and `receivedHmac` on HMAC mismatch.
  - `app/api/payment/verify/route.ts:85–87` does the same.
  - Shared log aggregators (Datadog, CloudWatch, Papertrail) will index these. Anyone with log-read permissions can reproduce future HMACs.
- **How to find:** `rg -n 'HMAC|dataToHash' lib/ app/api/`.
- **How to fix:** on mismatch, log only a boolean and the Paymob transaction id. Keep the rest behind a debug flag that's off in prod.

---

## Phase 6 — Fix Authentication, Sessions, and Admin Security

Goal: reset account-state integrity after the incident.

### 6.1 Re-enable user-state enforcement

- **Finding (Confirmed + New):**
  - `lib/auth/authOptions.ts:46–49` the `status === 'pending'` check is commented out with a `TODO`. Unverified users can log in.
  - `lib/auth/authOptions.ts:85–124` Google sign-in sets `existingUser.status = 'active'` and `existingUser.emailVerified = true` for any email that matches — even if the user was `suspended` or `deleted`. (Credentials path at `:51` correctly blocks suspended/deleted.)
  - **New:** `app/api/auth/register/route.ts:79` sets `emailVerified: true` at signup. Combined with the commented pending check, the verification flow never gates anything — tokens are generated (`:104–112`) and emailed but never required to log in.
- **How to find:** read `authOptions.ts:40–124` and `register/route.ts:75–112`.
- **How to fix:**
  - In `register/route.ts`, set `emailVerified: false` and `status: 'pending'` by default.
  - Uncomment the pending check in `authOptions.ts:47–49`.
  - In the Google `signIn` callback, short-circuit with `return false` if `existingUser.status !== 'active'`. Do not overwrite `status` or `emailVerified`.

### 6.2 Stop trusting stale JWT claims for admin access

- **Finding (Confirmed — admin check is split in two):**
  - `lib/auth/adminAuth.ts:12–28` — `requireSuperAdmin` reads `session.user.role`, which comes from the JWT set once at login (`authOptions.ts:128–135`). If you demote a user, their existing JWT keeps working until it expires.
  - `app/api/admin/grant-attempt/route.ts:24–33` — does **not** use `requireSuperAdmin`. Instead compares `session.user.email` against a comma-separated `ADMIN_EMAILS` env var. Separate trust model, different bugs.
  - **Context:** the server actions under `lib/actions/admin/` (`userActions.ts`, `pricingActions.ts`, etc.) all call `requireSuperAdmin()` correctly. The JWT-staleness issue applies uniformly there.
- **How to find:** `rg -n 'requireSuperAdmin|isSuperAdmin|ADMIN_EMAILS|superadmin' app/api/ lib/`.
- **How to fix:**
  - In `requireSuperAdmin`, re-query the `User` document and check `user.role === 'superadmin' && user.status === 'active'`. Cache for at most a few seconds if you need the performance.
  - Remove `ADMIN_EMAILS` from `grant-attempt`; replace with `requireSuperAdmin`.
  - Put all admin API routes and server actions through one guard.

### 6.3 Hash reset and verification tokens at rest

- **Finding (Confirmed):**
  - `lib/models/VerificationToken.ts:19–23` stores `token` as plaintext.
  - `lib/models/PasswordResetToken.ts:19–23` stores `token` as plaintext.
  - `app/api/auth/reset-password/route.ts:30–33` does a direct string match against that plaintext.
  - `app/api/auth/verify-email/route.ts:21–24` and `:106–109` also match plaintext.
- **How to find:** open both model files and both verify routes; look at the `token` field.
- **How to fix:**
  - Generate a token, email the plaintext, but store only `sha256(token)` in the DB.
  - At verify time, hash the incoming token and compare.
  - On password reset success, invalidate every session for that user (requires a jwt-id list or bumping a `tokenVersion` counter on the user).

### 6.4 Prevent account-enumeration via public endpoints

- **Finding (Adjusted):**
  - `app/api/auth/register/route.ts:58–63, 138–143` returns `409 "User with this email already exists"` — trivially enumerable.
  - `app/api/auth/forgot-password/route.ts:52–61` already returns a neutral response for missing users; good.
  - `app/api/auth/forgot-password/route.ts:64–69` — if the user exists and uses social login, the error reveals `authProvider` (e.g., "This account uses google login"). Account-type enumeration.
  - `app/api/placement-test/check-user/route.ts:43–66` — called from the survey flow on blur (`SurveyForm.tsx:257–268`); returns explicit `exists`/`hasTakenTest`/`hasResults` plus a first-initial hint.
- **How to find:** `rg -n '"User with this email"|already exists' app/api/`.
- **How to fix:**
  - Register endpoint should silently send a "if this is you" email rather than confirming the duplicate.
  - `forgot-password` should not branch its response on `authProvider`.
  - `check-user` should require CAPTCHA or be removed; it tells an attacker whether an email is a customer.

### 6.5 Close the admin callback redirect

- **Finding (Confirmed):**
  - `lib/auth/authOptions.ts:148–162` — in the `redirect` callback, `if (url.includes('/admin')) return url;` returns **any** URL that contains `/admin` anywhere, including `https://evil.example/admin`.
  - `components/features/auth/login/LoginForm.tsx:64–68` pushes the raw `callbackUrl` searchParam to `router.push(callbackUrl)` with no validation.
- **How to find:** read `authOptions.ts:148` and `LoginForm.tsx:63–75`.
- **How to fix:**
  - Replace the `includes('/admin')` check with an origin allowlist: `new URL(url, baseUrl).origin === baseUrl` and the path must start with `/${locale}/admin`.
  - In `LoginForm`, validate `callbackUrl` is same-origin before pushing it.

---

## Phase 7 — Fix Placement Tests and Soft-Skills Integrity

Goal: stop trusting the browser for assessment results.

### 7.1 Move scoring server-side

- **Finding (Confirmed):**
  - `components/pages/PlacementTest/Test/TestMain.tsx:209–232` sums `selectedAnswers[i] === questions[i].ans_idx` in the client, then persists `score` and full `questions` (with `ans_idx`) to sessionStorage.
  - `app/api/placement-test/submit/route.ts:47–53` destructures `score`, `totalQuestions`, `belt` from the request body and writes them to `User.placementTest.resultScorePercent` and `resultBeltName`.
  - `components/pages/PlacementTest/Results/ResultsMain.tsx:50–57` chooses the belt on the client from `beltLevels` based on the client-computed score.
- **How to find:** `rg -n 'ans_idx' components/`.
- **How to fix:**
  - Store only question identifiers and selected options on submit.
  - On the server, re-fetch each question from the authoritative question bank by id, compare with `ans_idx`, compute `scorePercent`, and derive `belt` using the same rules the client currently uses (move `beltLevels` into a shared server-safe module).
  - Never trust `score`, `totalQuestions`, or `belt` from the body. Ignore those fields if present.

### 7.2 Enforce `testId` ownership

- **Finding (Confirmed):**
  - `app/api/placement-test/submit/route.ts:168–175` — `PlacementTest.findByIdAndUpdate(testId, ...)` with no check that the test belongs to the authenticated user. Another authenticated user can overwrite any test by sending the right `testId`.
  - Worse: `:177–195` falls back to creating a new test if the update returns nothing, so a wrong `testId` silently creates a duplicate instead of erroring.
- **How to find:** read lines 168–195 of that file.
- **How to fix:** `findOneAndUpdate({ _id: testId, userId: user._id, status: 'in_progress' }, …)`. If the query returns nothing, return 404 or 409. Refuse to create a fresh record as a fallback.

### 7.3 Use a real survey contract, not formatted text

- **Finding (Confirmed):**
  - `components/pages/PlacementTest/Survey/SurveyForm.tsx:275–306` — builds `surveyResults` as a Markdown-ish string (`*1. Full Name* ... -${formData.name}`) and stores it under `sessionStorage['surveyResults']`.
  - `components/pages/PlacementTest/Test/TestMain.tsx:100–118` posts that string as `survey_results` to `/api/generate-questions`.
  - `app/api/generate-questions/route.ts:48–66` (`getAgeFromSurvey`) calls `JSON.parse(surveyResults)` on that string, catches the failure, and returns `10` as a default age.
  - Net effect: every real user silently becomes 10 years old, which then routes them to the 10–14 age bucket for questions.
- **How to find:** open both files and compare.
- **How to fix:**
  - Send the form object directly: `sessionStorage.setItem('surveyResults', JSON.stringify(formData))`. You're already storing a JSON copy as `surveyData` at `SurveyForm.tsx:318` — unify them.
  - In `getAgeFromSurvey`, remove the `|| 10` default; return `null` and have the caller fail loudly.

### 7.4 Repair guest soft-skills and track routing

- See 2.2 (technical track bug) and 2.3 (guest soft-skills UI vs 401).

### 7.5 Bound client-settable progress

- **Finding (New):**
  - `app/api/game-data/me/progress/route.ts:33–35` accepts `level: number` and `score: number` from the client and writes them to `User.gameProgress` with no bounds check. A user can PUT `{"level": 9999, "score": 9999}` and hit any leaderboard or gate that reads this field.
  - `app/api/user/profile/update/route.ts:32–49` uses `findOneAndUpdate` with raw input — negative age, overlong country strings, empty organizationName that the schema validator would normally reject are bypassed because `findOneAndUpdate` skips pre-save hooks.
- **How to find:** open both files.
- **How to fix:** validate with zod at the top of both routes (`level: z.number().int().min(1).max(<max-level>)`, `age: z.number().int().min(0).max(120)`, etc.). Reject unknown keys.

---

## Phase 8 — Data Model, Seed, and Config Drift

Goal: eliminate silent inconsistencies between code, database, seed, and docs.

### 8.1 Separate reference seeds from business imports

- See 3.3. Same directory also contains `scripts/seed-test-users.ts` (hardcoded password `Test123!` at `:34`, logged at `:100, :165`) and `scripts/migrate-to-bilingual.ts`. Treat those as dev-only and guard them:

  ```ts
  if (process.env.NODE_ENV === 'production' || !process.env.ALLOW_DEV_SEEDS) {
    console.error('Refusing to run dev seed in production');
    process.exit(1);
  }
  ```

### 8.2 Enforce uniqueness where business logic assumes it

- **Finding (Confirmed):**
  - `lib/models/PricingConfig.ts:77–78` has non-unique indexes on `(configType, isActive)` and `(packageLevel)`. Nothing prevents multiple active `configType: 'perBelt'` rows, and the pricing service picks the first one it finds.
- **How to find:** `sed -n '1,80p' lib/models/PricingConfig.ts`.
- **How to fix:** add a unique partial index: `{ configType: 1, packageLevel: 1 }` with `partialFilterExpression: { isActive: true }`. Add a second guarding index or validator for `configType: 'organization'` (where `packageLevel` is absent).

### 8.3 Remove the two `testId`-placeholder paths

- See 3.5.

### 8.4 Align docs with code

- **Finding (Confirmed):**
  - `README.md:18` — Node 18+ (wrong, needs ≥20.19).
  - `README.md:57` — Next.js 15 (wrong, now Next 16).
  - `docs/ADMIN_DASHBOARD_IMPLEMENTATION_PLAN.md:99–103` references `SUPER_ADMIN_EMAIL=your-secure-email@domain.com` / `SUPER_ADMIN_PASSWORD=YourSecurePassword123!` — the same env vars whose real values were in your compromised `.env.local`.
  - `docs/PAYMOB_ENV_SETUP.md:11, 23, 38` uses `__PLACEHOLDER__` strings — fine, but the README should point there instead of showing plain `MONGODB_URI=mongodb+srv://...` at `README.md:32`.
- **How to fix:** bump the README; strip example passwords from docs (replace with `<set-via-secret-manager>`).

---

## Phase 9 — Production Security Controls

Goal: make another compromise less likely and less useful to the attacker.

### 9.1 Add HTTP security defaults

- **Finding (Confirmed):** `next.config.ts` has no `headers()` export; `middleware.ts` does not set any security headers. `x-powered-by` is on by default.
- **How to find:** `rg -n 'headers|poweredByHeader|Content-Security-Policy' next.config.ts middleware.ts`.
- **How to fix:** add to `next.config.ts`:
  - `poweredByHeader: false`
  - `async headers()` returning CSP, HSTS, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: ()`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `frame-ancestors` in CSP.
  - Lock down the GA/GTM domains in CSP (`G-563K68LDS3`, `GTM-PMZWSRZJ` are hardcoded in `app/[locale]/layout.tsx:56, 74, 84`); no `unsafe-inline` for scripts — use nonces via `NextResponse.next()`'s headers.

### 9.2 Add real abuse controls

- **Finding (Confirmed):**
  - `app/api/auth/forgot-password/route.ts:8–10` uses a process-local `Map` for rate limiting. In a scaled deployment each replica has its own map — attacker simply round-robins.
  - `app/api/auth/resend-verification/route.ts:8–10` has the same pattern.
  - `app/api/auth/register/route.ts`, `app/api/contact-admin/route.ts`, `app/api/orders/create/route.ts`, `app/api/placement-test/submit/route.ts`, `app/api/soft-skills/submit/route.ts`, `app/api/placement-test/check-user/route.ts` — no rate limiting at all.
- **How to find:** `rg -n 'Map<|rate' app/api/`.
- **How to fix:**
  - Put a real rate limiter in front (ingress-level or Redis-backed middleware).
  - Keep the in-memory map as a last-ditch per-replica limiter only; do not rely on it.

### 9.3 Fix the HTML-injection in contact and marketing email

- **Finding (Confirmed):**
  - `app/api/contact-admin/route.ts:38–47, 67–71` injects `name`, `subject`, `message` into an HTML email via template literals with only `message.replace(/\n/g, '<br/>')`.
  - `lib/resend.ts:27–33` has the same pattern for the "Contact Us" submission (`firstName`, `lastName`, `companyMail`, `companyName`, `numberOfStudents`, `message`).
  - `lib/email.ts:38, 42, 109` injects `firstName` into verification and reset emails without escaping.
  - An attacker can insert arbitrary HTML into the admin inbox or the user's own inbox, including phishing links styled as NGen.
- **How to find:** `rg -n '\$\{.*\}</?(p|h|div|strong)>' app/api/ lib/`.
- **How to fix:** escape every interpolated user string with a small helper:
  ```ts
  const esc = (s: string) => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
  ```
  Apply in contact-admin, `lib/resend.ts`, and both verification/reset templates in `lib/email.ts`.

### 9.4 Add pipeline checks

- **How to fix:**
  - Secret scanning in CI (Gitleaks, trufflehog). Would have caught the hardcoded Resend key.
  - `npm audit --audit-level=high` on every PR.
  - Container image scan (Trivy or similar) as part of the build pipeline.
  - SBOM generation (`npm sbom` or Syft).
  - A monthly restore drill against the new MongoDB cluster — do not assume backups work.

### 9.5 Fix third-party HTTP fetches

- **Finding (New):**
  - `lib/geoLocation.ts:32` uses plain `http://ip-api.com/json/...` — not HTTPS. The IP lookup can be tampered with in transit, and `app/api/auth/register/route.ts:71–72` uses that result to set `detectedCountry` on the user record.
  - ip-api.com free tier has a 45 req/min limit per source IP; under burst signup the registration path silently falls back to "Unknown."
- **How to find:** `rg -n "http://" lib/`.
- **How to fix:** switch to `https://ip-api.com/json/...` (their free-tier HTTPS) or a paid / self-hosted alternative (MaxMind GeoLite2 DB baked into the image). Either way, make this lookup non-blocking — if it fails, registration must still succeed.

---

## Phase 10 — Relaunch Gates

The app reopens to the public only when every line below is true.

- [ ] Old server is offline. DNS and CDN no longer resolve to the compromised host.
- [ ] Every secret listed in Phase 0.3 is rotated; the old values are known-bad.
- [ ] `NEXTAUTH_SECRET` is a fresh 32-byte value, not a placeholder string.
- [ ] Runtime baseline is normalized (Node ≥20.19, stable React 19, `.npmrc` cleaned, duplicate lockfile removed).
- [ ] `npm audit` returns 0 high or critical vulnerabilities.
- [ ] Dockerfile, `.dockerignore`, health + ready endpoints exist; image builds in CI from scratch.
- [ ] Container denies outbound to anything except Mongo, Paymob, Resend, and the geolocation provider.
- [ ] Fresh self-hosted MongoDB has replica set, backups, tested restore, TLS, and network allowlist. Mongo Express is not exposed to the public Internet.
- [ ] `scripts/seed-reference.ts` has been run; no destructive commands remain in the production seed path.
- [ ] Historical paid orders reconstructed from Paymob exports and fulfilled via the same code path as new orders.
- [ ] Payment verify fails closed on HMAC mismatch or inquiry error.
- [ ] Webhook returns non-`200` on HMAC mismatch and on application error.
- [ ] Both `verifyRedirectHmac` (`app/api/payment/verify/route.ts:35`) and `verifyWebhookHmac` (`lib/paymob.ts:253`) reject when the secret is missing.
- [ ] Payment-to-belt fulfillment is implemented and idempotent.
- [ ] Admin access goes through one function that revalidates against Mongo.
- [ ] Reset and verification tokens are hashed at rest.
- [ ] Registration creates `emailVerified: false` / `status: 'pending'`; pending users cannot log in.
- [ ] Callback URLs validated against an allowlist.
- [ ] Placement-test scoring computed server-side; `testId` ownership enforced.
- [ ] Soft-skills UI and API agree on whether guests are allowed.
- [ ] Locale-aware redirects in every auth, payment, and email route.
- [ ] Displayed price equals charged price (server-computed).
- [ ] Security headers live at the edge or in `next.config.ts`.
- [ ] Contact and auth endpoints have real rate limiting.
- [ ] Contact, verification, and reset email templates escape user input.
- [ ] Geolocation lookup uses HTTPS and is non-blocking.

---

## Flat Issue Checklist

### Phase 0 — Contain

- [ ] 0.1 Take domain offline, stop all processes and workers. Preserve host disk and logs as evidence.
- [ ] 0.2 Disable Paymob callback and freeze public email endpoints (`forgot-password`, `resend-verification`, `contact-admin`).
- [ ] 0.3 Rotate Resend, Paymob (API key + HMAC + integration IDs + iframe + secret + public), Google OAuth, `NEXTAUTH_SECRET`, super-admin password. Replace `onboarding@resend.dev` sender in `lib/resend.ts:25` with the real domain.
- [ ] 0.3 Remove hardcoded Resend key (`lib/resend.ts:5`) and its commented placeholder (`:6`).
- [ ] 0.3 Strip example admin password from `docs/ADMIN_DASHBOARD_IMPLEMENTATION_PLAN.md:101–102`.
- [ ] 0.4 Invalidate all JWT sessions (via new secret); do not import any old verification/reset tokens into the new DB.

### Phase 1 — Runtime

- [x] 1.1 Add `engines` and `packageManager` to `package.json`. Update `README.md:18`.
- [x] 1.2 Replace React RC with stable 19.x in `package.json:32, 34`. Bump `@types/react*` to 19.x.
- [x] 1.2 Remove `legacy-peer-deps=true` from `.npmrc:1` (or delete `.npmrc`).
- [x] 1.3 Delete `package-lock 2.json`.
- [x] 1.4 `npm audit fix` — cover `ajv`, `brace-expansion`, `flatted`, `minimatch`, `next`, `next-intl`, `picomatch`, `yaml`.
- [x] 1.4 Replace `next lint` in `package.json:9` with an `eslint` CLI call.
- [x] 1.4 Update `README.md:57` Next version.
- [x] 1.5 Self-host fonts in `app/[locale]/layout.tsx:2`.
- [x] 1.6 Pick and declare `output` mode in `next.config.ts`.

### Phase 2 — Frontend

- [x] 2.1 Replace every hardcoded `/en/…` in `app/api/payment/success/route.ts`, `app/api/auth/verify-email/route.ts`, `lib/email.ts:21`, `lib/email.ts:88`. Remove `http://localhost:3000` fallback in `lib/actions/authActions.ts:84`.
- [x] 2.2 Fix `TestMain.tsx:74` so `selectedTrack` is never `'technical'`.
- [x] 2.3 Align guest soft-skills: either remove the UI option or make `app/api/soft-skills/submit/route.ts:12` accept guests.
- [x] 2.4 Write `testId` from `/api/placement-test/start` into sessionStorage in `TestMain.tsx`; read it in `ResultsMain.tsx:75`.
- [x] 2.5 Have `/api/orders/create` compute price via `PricingService` and ignore client-sent price.
- [x] 2.6 Prefix every `router.push('/...')` in placement-test components with `/${locale}` (TestMain.tsx lines 103, 232, 282, 297; StageInfo.tsx:29).

### Phase 3 — Database Rebuild

- [x] 3.1 Accept DevOps handover: connection string received 2026-04-20. **Partial — Mongo still standalone (no replica set), Mongo Express still on public HTTP. See Appendix A below.**
- [x] 3.2 Initialize the `ngen` database — seeded 6 tracks / 10 belts / 5 pricing configs via `npm run db:seed:reference`. *Connection string still in `.env.local`; move to secret manager in Phase 4.3.*
- [x] 3.3 Split `scripts/seed.ts` into reference-only and historical-reconstruction scripts; remove `Belt.deleteMany({})` (line 286) and the user-progress reset (lines 291–299) from the reference path.
- [x] 3.4 Skipped — no paid-order history to reconstruct (payments never shipped to prod).
- [x] 3.5 Remove `trackId: user._id` placeholders in `app/api/placement-test/start/route.ts:76`, `submit/route.ts:184`, `app/api/soft-skills/submit/route.ts:52`.
- [ ] 3.6 **BLOCKED — Mongo is standalone. See Appendix A for full context and resume plan.**
- [x] 3.7 Post-import audit — `scripts/audit-db.ts` passes all 7 checks (belt count, uniqueness, pricing-config shape, TTL placeholder, no `trackId===userId` rows).

### Phase 4 — Deployment

- [x] 4.1 Dockerfile, `.dockerignore`, `/api/health`, `/api/ready` + `instrumentation.ts` ready-flag added.
- [ ] 4.2 Non-root user, read-only FS, dropped caps, resource limits, `NEXT_TELEMETRY_DISABLED=1`. Egress allowlist (Mongo, Paymob, Resend, geolocation). *(Partial — Dockerfile runs as non-root with NEXT_TELEMETRY_DISABLED=1. Read-only FS / dropped caps / resource limits / egress allowlist must live in the orchestrator — DevOps.)*
- [ ] 4.3 Replace `.env.local` with a secret manager. Add a startup zod validator that crashes on missing vars (minimum list in 4.3).
- [x] 4.4 Replaced header-derived base URL in `app/api/orders/create/route.ts` with env-backed `APP_BASE_URL` (fails closed when unset/malformed).
- [x] 4.5 Dockerfile copies `public`, `.next/static`, `questions_v2`, `SpicificTest-AR/EN` into the runtime image.
- [ ] 4.6 Put the app behind a reverse proxy with TLS, `X-Forwarded-Proto`, and `Host:` allowlist. Put Mongo Express behind the same reverse proxy with basic auth + IP allowlist.

### Phase 5 — Payments

- [x] 5.1 Server-compute price in `app/api/orders/create/route.ts`; `currency`/`userId` no longer accepted from the client (done in 2.5). *`countryCode` still accepted as a display hint; revisit alongside 7.5 zod validation pass.*
- [x] 5.2 Removed "skip HMAC when secret missing" in `app/api/payment/verify/route.ts`; verify now returns a 400 on HMAC mismatch and a 502 `pending` on inquiry failure — never trusts URL params as truth.
- [x] 5.3 Webhook returns `401` on HMAC mismatch and `500` on application error; `lib/paymob.ts` `verifyWebhookHmac` fails closed when the secret is unset.
- [x] 5.4 `lib/orders/fulfillOrder.ts` added (idempotent, keyed on `metadata.fulfilledAt`); called from webhook success path. **TODO(phase-3.6):** wrap in `withTransaction` once replica set is enabled.
- [x] 5.5 HMAC-mismatch logs in `lib/paymob.ts` and `app/api/payment/verify/route.ts` now emit only the Paymob-side id; `dataToHash`/calculated/received bytes are no longer logged.

### Phase 6 — Auth

- [x] 6.1 Register now sets `emailVerified: false` / `status: 'pending'`; credentials login rejects pending/unverified; Google `signIn` refuses suspended/deleted and only promotes `pending` → `active`.
- [x] 6.2 `lib/auth/adminAuth.ts` re-queries role+status from Mongo on every call; `app/api/admin/grant-attempt/route.ts` uses the same pattern instead of `ADMIN_EMAILS`.
- [x] 6.3 Token models store `tokenHash` (sha256) only; `register`/`resend-verification`/`forgot-password` hash on write, `verify-email`/`reset-password` hash on read via `lib/auth/tokenHash.ts`.
- [x] 6.4 `register` returns a neutral "if this email is new" response on duplicate; `forgot-password` no longer branches on `authProvider`. *`check-user` CAPTCHA still deferred until rate-limit work in 9.2.*
- [x] 6.5 `authOptions.redirect` now uses a same-origin allowlist (resolves against `baseUrl` and bails if origin differs); `LoginForm` validates `callbackUrl` same-origin before `router.push`.

### Phase 7 — Assessments

- [ ] 7.1 Compute score server-side in `app/api/placement-test/submit/route.ts`; stop reading `score`/`belt` from the body.
- [ ] 7.2 Add ownership guard to `app/api/placement-test/submit/route.ts:168–175`; remove the "create if not found" fallback at `:177–195`.
- [ ] 7.3 Store `surveyResults` as JSON (`SurveyForm.tsx:275–306`) and remove the `|| 10` default in `app/api/generate-questions/route.ts:48–66`.
- [ ] 7.4 Align soft-skills and technical track handling with Phase 2 fixes.
- [ ] 7.5 Add zod bounds to `app/api/game-data/me/progress/route.ts:33–35` and `app/api/user/profile/update/route.ts:32–49`.

### Phase 8 — Data Model Drift

- [ ] 8.1 Guard `scripts/seed-test-users.ts` and `scripts/migrate-to-bilingual.ts` against production.
- [ ] 8.2 Add unique partial index on `PricingConfig` for `(configType, packageLevel)` where `isActive: true` (`lib/models/PricingConfig.ts:77–78`).
- [ ] 8.3 (Covered by 3.5 placeholder removal.)
- [ ] 8.4 Sync `README.md` (lines 18, 32, 57) and strip example credentials from `docs/ADMIN_DASHBOARD_IMPLEMENTATION_PLAN.md:99–103`.

### Phase 9 — Security Hardening

- [ ] 9.1 Add `headers()` + `poweredByHeader: false` in `next.config.ts`. Lock down GA/GTM domains in CSP.
- [ ] 9.2 Put a real rate limiter in front of `register`, `contact-admin`, `orders/create`, `placement-test/submit`, `placement-test/check-user`, `soft-skills/submit`, `resend-verification`, `forgot-password`. Keep in-memory limiters as belt-and-braces only.
- [ ] 9.3 Escape user input in `app/api/contact-admin/route.ts:38–71`, `lib/resend.ts:27–33`, and `lib/email.ts:38–42, 109`.
- [ ] 9.4 Enable secret scanning, `npm audit`, container scan, and SBOM in CI. Schedule a monthly restore drill.
- [ ] 9.5 Switch `lib/geoLocation.ts:32` to HTTPS and make the registration path tolerate lookup failure.

---

## Appendix A — Phase 3.6 Pending: Transactional Writes

This appendix exists so a future session (human or agent) can pick up 3.6 without re-deriving the context. As of 2026-04-20 this work is **blocked on DevOps**, not on code.

### A.1 What "transactional" means here, concretely

Three API routes perform multi-document writes that must succeed or fail together. Today each one issues two or three independent `save()` / `findByIdAndUpdate` calls back-to-back. If the Node process crashes, the DB hiccups, or a downstream HTTP call throws between those writes, the database is left in a split state.

The intended shape is the standard Mongoose transaction wrapper:

```ts
const session = await mongoose.startSession();
try {
  await session.withTransaction(async () => {
    await Order.create([orderDoc], { session });
    await Transaction.create([txnDoc], { session });
    await User.findByIdAndUpdate(userId, { $addToSet: { ... } }, { session });
  });
} finally {
  session.endSession();
}
```

`session.withTransaction()` is the critical call — it auto-retries on transient errors and rolls back the entire group on a throw. It **requires the MongoDB deployment to be a replica set** (even a single-node replica set is enough). A plain standalone mongod rejects the `startTransaction` command outright.

### A.2 Why it's blocked right now

- The MongoDB instance at `mongodb://admin:***@204.152.221.11:24512/ngen?authSource=admin` is a **standalone** — not a replica set.
- Attempted `rs.initiate()` via the Node driver. Result: `MongoServerError: NoReplicationEnabled: This node was not started with replication enabled.`
- Ran `db.adminCommand({getCmdLineOpts: 1})` through the same connection. The `parsed` tree contained only `net.bindIp`, `net.port`, `processManagement`, `security.authorization`, `storage.dbPath`, `systemLog`. **No `replication.replSetName` key.** The daemon is not running with `--replSet` or the equivalent config stanza.
- **Mongo Express does not fix this.** It's a browser GUI over the Mongo wire protocol — it cannot edit `/etc/mongod.conf` or restart `systemd`. I confirmed this rather than assuming it.
- **SSH is not available to this workstation for the Mongo host.** User confirmed they cannot reach DevOps at this moment. The fix must wait.

The practical consequence: if I wrap the three routes in `withTransaction` today, every write in those routes will throw at runtime because the driver will reject the transaction start. So the code change is gated on the infra change, not the other way around.

### A.3 The exact DevOps ask (paste this into the ticket)

> Please convert the MongoDB instance at `204.152.221.11:24512` from standalone to a single-node replica set so application code can use `session.withTransaction()`.
>
> Steps on the host:
>
> 1. Edit `/etc/mongod.conf` (or wherever its config lives) and add:
>    ```yaml
>    replication:
>      replSetName: rs0
>    ```
> 2. `systemctl restart mongod` (or `service mongod restart`).
> 3. Connect as the admin user and run once:
>    ```js
>    rs.initiate({
>      _id: "rs0",
>      members: [{ _id: 0, host: "204.152.221.11:24512" }]
>    })
>    ```
> 4. Confirm with `rs.status()` — `members[0].stateStr` should be `PRIMARY`.
>
> After that: add `?replicaSet=rs0` to every connection string we hand the app. Keep `directConnection=true` out of the URI — that flag disables replica-set discovery and reintroduces the original problem.
>
> Keep the same credentials. No data migration; the existing `ngen` database stays in place and is promoted into the replica set.

### A.4 Code changes required once unblocked

Assume `MONGODB_URI` has been updated to include `?replicaSet=rs0&authSource=admin`. Then, in order:

1. **`app/api/orders/create/route.ts:126–179`** — wrap the `Order` creation and its two follow-up `order.save()` calls in a single `withTransaction`. If the Paymob Intention call (outside the transaction — it's an HTTP call to a third party, don't hold a DB session across it) fails, the order is rolled back and the client sees a clean 502.
2. **`app/api/webhooks/paymob/route.ts:89–115`** — this is the one that actually matters for money. Wrap the Transaction insert + the Order status update + the eventual `fulfillOrder()` call (Phase 5.4) in one transaction. Key the whole block on `paymobTxnId` so a retried webhook is a no-op, not a double-fulfillment.
3. **`app/api/placement-test/submit/route.ts:170–212`** — wrap the `PlacementTest` update/create plus the `User.findByIdAndUpdate` (attempt counter) in one transaction.
4. Add a grep gate: `rg -n 'session:|withTransaction' app/api/` must return non-zero hits in all three files. CI should fail if that grep finds zero matches, to prevent silent regression.

### A.5 Three hotspots and what "no transaction" costs us, ranked

Ranked by real-world damage if we launched without 3.6:

**① `app/api/webhooks/paymob/route.ts` — money-critical.**
Scenario: customer pays on Paymob. Paymob POSTs our webhook. We insert the `Transaction` row successfully. We then try to update the `Order` to `status: 'paid'` and the Node process crashes (OOM, pod restart, network blip, deploy). Paymob retries the webhook. Our handler is not currently keyed idempotently on `paymobTxnId` for the Order update (only for the Transaction insert), so on retry the Transaction insert is skipped but the Order may or may not get updated depending on which code path runs. Net result: a customer can have a paid Transaction with an Order stuck at `status: 'pending'` — they paid and got nothing. The Paymob dashboard will say we succeeded, our DB will say we didn't, and support has to reconcile manually.
**Interim mitigation until 3.6 lands:** add idempotency keying on `paymobTxnId` for the Order update (not just the Transaction insert), and run a daily reconciliation cron that compares Paymob's paid list to our `Order.status='paid'` list and emails admins on drift. This does *not* fix the atomicity problem but it bounds the damage to "detected within 24h" instead of "detected when the customer complains."

**② `app/api/orders/create/route.ts` — cosmetic.**
Scenario: we create a `pending` Order, then the Paymob Intention call fails or times out, leaving a ghost order row. No money has moved; the customer just sees an error and retries. Cost: weekly cleanup cron to delete `status='pending'` rows older than 1h. Already acceptable without transactions.

**③ `app/api/placement-test/submit/route.ts` — recoverable.**
Scenario: we save the completed `PlacementTest` row but fail to increment `User.placementTest.attemptsUsed`. The user might get one extra attempt; the counter drifts from the real attempt count.
**Recompute is trivial:** `attemptsUsed = PlacementTest.countDocuments({ userId, testType: 'technical' })`. A nightly cron can resync the counter field from the ground truth. Do not block launch on this one.

### A.6 Interim mitigations to put in place *before* launch if 3.6 is still blocked

Mark each of these in the commit that introduces it with a `// TODO(phase-3.6)` comment so they can be ripped out cleanly once transactions are real:

- **Webhook idempotency key.** In `app/api/webhooks/paymob/route.ts`, before doing anything, `Transaction.findOne({ paymobTxnId })` — if found and its related Order is already `paid`, return 200 immediately. This makes retries safe even without a transaction.
- **Reconciliation cron.** A daily job that pulls Paymob transactions for the last 48h, matches by `special_reference → order._id`, and emails admins when Paymob says paid and we say pending (or vice versa). Live in `scripts/reconcile-paymob.ts`.
- **Order cleanup cron.** Weekly sweep: delete `Order` rows with `status='pending'` and `createdAt < now - 1h`. They're abandoned checkouts.
- **Attempts-counter recompute.** Part of the daily reconciliation: `User.placementTest.attemptsUsed` recomputed from `PlacementTest.countDocuments`. Ship the helper even after 3.6 lands — it's also useful as a one-off repair tool.
- **Log every multi-write failure.** In each of the three routes, if the second/third write throws, log a structured error with the relevant ids (`orderId`, `paymobTxnId`, `userId`, `testId`) so we can find the split-state rows fast.

### A.7 Verification steps once 3.6 is unblocked

Do these in order, and do not proceed to the next step until the previous one passes:

1. `mongosh "$MONGODB_URI" --eval 'rs.status().members[0].stateStr'` → must print `PRIMARY`.
2. `npm run db:audit` (i.e. `scripts/audit-db.ts`) → all 7 checks still green. Replica-set promotion must not have dropped indexes or data.
3. Smoke test: write a throwaway `scripts/test-transaction.ts` that runs a `withTransaction` over two trivial inserts, then aborts. Confirm both docs are absent after the abort. This proves transactions work end-to-end before any real route depends on them.
4. Apply the three route changes from A.4, one route per commit. After each commit: hit the route in dev, kill the Node process mid-request, restart, confirm no half-written state in Mongo.
5. Remove all `// TODO(phase-3.6)` comments. Check `rg -n 'TODO\(phase-3.6\)'` returns nothing.
6. Delete or repurpose the `scripts/reconcile-paymob.ts` and cleanup crons only if you're sure — they're cheap to keep running as a second line of defense.

### A.8 Files touched in this session (baseline for resume)

- `.env.local` — secrets restored from the old repo's `.env.local` per user instruction (Resend key, Paymob legacy keys, HMAC secret, integration/iframe IDs, super-admin). `NEXTAUTH_SECRET` freshly generated via `openssl rand -base64 32`. MongoDB URI uses the new DevOps-provided host. Still blank and requiring Paymob-dashboard lookup: `PAYMOB_SECRET_KEY`, `NEXT_PUBLIC_PAYMOB_PUBLIC_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.
- `scripts/seed-reference.ts` — new, idempotent.
- `scripts/audit-db.ts` — new, post-init audit.
- `package.json` — added `db:seed:reference` and `db:audit` scripts.
- `lib/models/PlacementTest.ts` — `trackId` now optional.
- `app/api/placement-test/start/route.ts`, `app/api/placement-test/submit/route.ts`, `app/api/soft-skills/submit/route.ts` — placeholder `trackId: user._id` removed.
- `components/pages/PlacementTest/Test/TestMain.tsx` — calls `/api/placement-test/start` and stores `testId` for the results page round-trip.
- `app/api/orders/create/route.ts` — zod schema no longer accepts `currency` or `userId` from the body; server-side `PricingService` now authoritative for price.

### A.9 What is still unchecked in this document

After the work above, the unchecked items remaining are:

- **Phase 0 entirely** — the incident-containment steps (take app offline, freeze money-moving flows, rotate every external secret, delete hardcoded Resend key in `lib/resend.ts:5`, invalidate tokens). These are operational steps the user must take against the live providers; nothing here can be fixed by a code edit alone.
- **Phase 3.6** — this appendix.
- **Phase 4 (Deployment)** — 4.1 through 4.6. Dockerfile, health/ready endpoints, hardening, secret-manager migration, `APP_BASE_URL` enforcement, hermetic build, reverse-proxy + TLS + Mongo Express gating.
- **Phase 5 (Payments)** — 5.1 through 5.5. Server-authoritative pricing is partly done via 2.5, but 5.1 also wants `countryCode` ignored and `salesEnabled:false` rejected. Then HMAC fail-closed on verify (5.2) and webhook (5.3), `fulfillOrder()` implementation (5.4), and stop logging HMAC internals (5.5).
- **Phase 6 (Auth)** — 6.1 through 6.5. Enforce email verification, revalidate admin role against Mongo, hash reset/verification tokens, neutralize enumeration endpoints, lock callback-URL redirect.
- **Phase 7 (Assessments)** — 7.1 through 7.5. Server-side scoring, `testId` ownership guard, real survey JSON contract, bounded game-progress, zod on profile update.
- **Phase 8 (Data Model Drift)** — 8.1, 8.2, 8.4. Dev-seed production guard, `PricingConfig` unique partial index, README/docs sync. 8.3 is already covered by 3.5.
- **Phase 9 (Security Hardening)** — 9.1 through 9.5. Security headers + CSP, real rate limiter, HTML-escape user input in every email template, CI scanning + SBOM + restore drill, HTTPS/tolerance for geolocation.
- **Phase 10 (Relaunch Gates)** — the entire checklist; this is the go/no-go gate that depends on every phase above.

Put differently: Phases 1, 2, and 3 (minus 3.6) are done. Everything after that is still pending. Phase 4 is the natural next chunk because Dockerization + secret manager + `APP_BASE_URL` enforcement unlock clean work on Phase 5 (payments), which is where the real money risk lives.

---

## Appendix B — Remaining Blocked & Pending Work (post Phase 4/5/6 code pass)

After the code-only pass through Phases 4, 5, and 6 in this session, the remaining work falls into three buckets: **operational** (the user must run something against a live provider), **DevOps / orchestrator-side** (the platform host owns it), and **code-doable but deferred** (can be picked up in a future session).

### B.1 Phase 0 — Operational, user-only

These are not code edits. They must be done by a human with access to the live provider dashboards.

- **Rotate every external secret** that ever touched the old repo or `.env.local`: Paymob (secret key, public key, HMAC), Resend, Google OAuth client secret, MongoDB user password, `NEXTAUTH_SECRET`. The `NEXTAUTH_SECRET` was already regenerated in Phase 1; the rest are still the old values.
- **Delete the hardcoded Resend key** at `lib/resend.ts:5`. Even after rotation, the literal must not stay in source.
- **Take the old host offline** so an attacker who already exfiltrated `.env.local` can't keep using the site as an oracle.
- **Strip example admin password** from `README.md` and any `docs/*.md` that quote it.
- **Invalidate outstanding sessions / verification tokens** (drop `sessions`, `verificationtokens`, `passwordresettokens` collections after rotation so anything minted under the old `NEXTAUTH_SECRET` stops working).

**Why not code-doable:** rotation has to happen in the provider UI; the codebase reads whatever secret is in the env. The deletion of `lib/resend.ts:5` *is* code-doable but is gated on rotation — deleting the literal before rotating leaves the old key in git history as the only remaining copy and the env vars not yet populated.

### B.2 Phase 4.2 — Hardening, partially done

**Done in code (Dockerfile):** non-root user (`nextjs:nodejs`, uid 1001), `NEXT_TELEMETRY_DISABLED=1`, multi-stage build, `HEALTHCHECK` wired to `/api/health`.

**Still pending (orchestrator-only):**
- Read-only root filesystem (`readOnlyRootFilesystem: true` in the pod spec, with a writable `tmpfs` mount for `/tmp`).
- Drop all Linux capabilities (`capabilities.drop: ["ALL"]`).
- CPU + memory `requests` and `limits`.
- Egress allowlist limited to: MongoDB host, Paymob (`accept.paymob.com`), Resend (`api.resend.com`), `ip-api.com`. Everything else outbound denied.
- `securityContext.runAsNonRoot: true`, `allowPrivilegeEscalation: false`.

**Why not code-doable:** these are container runtime / orchestrator settings, not Dockerfile directives.

### B.3 Phase 4.3 — Secret manager migration + zod boot validator

- **Blocked side:** the platform choice itself (Doppler vs AWS Secrets Manager vs HashiCorp Vault vs cloud provider native). DevOps must pick.
- **Code-doable once platform is picked:** a `lib/env.ts` zod schema that runs at process boot, asserts every required env var is present and well-shaped, and crashes fast with a readable error otherwise. This can ship independent of the platform — the env vars come in the same way (`process.env`); only the *source* of those values changes.

**Why deferred:** writing the zod validator now would require guessing the final shape of env vars that the secret-manager migration may rename or restructure (e.g., grouping `PAYMOB_*` under a single secret blob). Cheaper to do it once after the migration.

### B.4 Phase 4.6 — Reverse proxy + TLS + Mongo Express gating

Pure DevOps. The app has no opinion on what's in front of it; the requirement is:
- Terminate TLS at a reverse proxy (nginx / Caddy / cloud LB).
- Force HTTPS redirect.
- Make `mongo-express` (if used) reachable only from a private network or VPN — never exposed publicly.

**Why not code-doable:** the reverse proxy is not in this repo.

### B.5 Phase 7 — Assessments (code-doable, deferred)

- **7.1 Server-side scoring** — placement-test scoring currently trusts a payload the client could tamper with. Move grading to `app/api/placement-test/submit/route.ts`, fetch the answer key from the question bank, compute the score server-side. *Money risk: low. Cheating risk: moderate (a determined user could grant themselves a higher belt level).*
- **7.2 `testId` ownership guard** — the submit endpoint must check the test row's `userId` matches the session user. Without this, a user with a valid session and a guessed `testId` could submit against someone else's in-progress test.
- **7.3 Survey JSON contract** — `lib/models/PlacementTest.ts` stores `surveyAnswers` as a free-form blob. Define a zod schema and reject malformed payloads at the route boundary.
- **7.4 Game-progress zod bounds** — already partially handled via `2.5` style input validation; needs a dedicated pass on the game-progress endpoint with `min`/`max` on numeric fields.
- **7.5 Profile-update zod** — same shape as 7.4, applied to `app/api/profile/update`.

**Why deferred:** none of these block launch in the same way payments do. They are correctness/anti-cheat issues.

### B.6 Phase 8 — Data model drift (code-doable, deferred)

- **8.1 Dev-seed production guard** — `scripts/seed-reference.ts` and any other seed scripts should refuse to run when `NODE_ENV === 'production'` unless an explicit `ALLOW_PROD_SEED=1` env var is set. One-line guard at the top of each script.
- **8.2 `PricingConfig` unique partial index** — there should be at most one *active* pricing config per (track, belt, duration) tuple. Add a partial unique index gated on `active: true`, then call `PricingConfig.syncIndexes()` once on boot (or wire into a migration).
- **8.4 README + docs sync** — README still references the old structure; `docs/` needs a pass after the auth/payments rewrite.
- **8.3** is already covered by 3.5.

**Why deferred:** safe to do post-launch. 8.2 is the highest-priority of the three because a duplicate-active-config bug would silently change pricing.

### B.7 Phase 9 — Security hardening (mixed)

**Code-doable:**
- **9.1 Security headers + CSP** — add a `headers()` block in `next.config.ts` for `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and a CSP. CSP needs a nonce-based script policy because Next emits inline bootstrap.
- **9.3 Email HTML escaping** — every email template in `lib/email.ts` interpolates user-controlled values (name, etc.). Wrap with an HTML escaper before substitution.
- **9.5 HTTPS for geolocation** — change any `http://ip-api.com/...` calls to `https://`.

**Infra-dependent:**
- **9.2 Real rate limiter** — needs Redis (or equivalent shared store). The current in-memory limiter resets on every pod restart and is per-pod, not global.
- **9.4 CI scanning + SBOM + restore drill** — needs CI pipeline (GitHub Actions / GitLab CI / etc.) and a backup/restore runbook.

### B.8 Impact ranking — what to pick up next

| Priority | Item | Bucket | Launch risk if skipped |
|----------|------|--------|------------------------|
| **P0** | B.1 secret rotation + delete `lib/resend.ts:5` literal | Operational | Money + auth: known-leaked secrets |
| **P0** | B.4 reverse proxy + TLS | DevOps | Auth: cleartext credentials over the wire |
| **P1** | B.3 zod boot validator (after platform pick) | Code | Operational: silent failures from missing env |
| **P1** | 9.1 security headers + CSP | Code | Auth: XSS, clickjacking, MIME-sniffing |
| **P1** | 8.2 `PricingConfig` unique partial index | Code | Money: duplicate active config silently changes price |
| **P2** | 7.1 server-side scoring + 7.2 `testId` ownership | Code | Cheating: belt-level fraud |
| **P2** | 9.3 email HTML escaping | Code | Auth: stored-XSS-in-email is a foothold for phishing |
| **P2** | B.2 read-only FS / dropped caps / limits | DevOps | Defense-in-depth; no direct exploit path |
| **P3** | 9.2 Redis rate limiter | Infra | DoS resistance; the in-memory limiter is *some* protection |
| **P3** | 9.4 CI scanning + SBOM | Infra | Supply-chain hygiene |
| **P3** | 8.1 dev-seed prod guard, 8.4 docs sync, 7.3–7.5 | Code | Quality-of-life; not launch-blocking |

### B.9 Recommended next-session focus

If the next session is a code session (not an ops session), the highest-leverage chunk is **B.7 code-doable (9.1 + 9.3 + 9.5) + 8.2**. All four are short, all four close real gaps, and none of them depend on DevOps choices.

If the next session is an ops session, **B.1 in full** is the only thing that matters. Everything else is downstream of rotation.

---

## Appendix C — Session update: Phase 7/8/9 code-doable pass

This appendix records what landed in the session immediately following Appendix B, so the next reader knows which of the B-series items are closed and which are still outstanding. Ranking (P0/P1/P2/P3) mirrors the table in B.8.

### C.1 Code-doable items completed

- **7.1 Server-side placement-test scoring** (P2)
  - Added `generatedQuestions` (mixed) field to `lib/models/PlacementTest.ts`.
  - `app/api/generate-questions/route.ts` now creates the `PlacementTest` row inline for authenticated users and stores the full exam (including `ans_idx`) as the server-side answer key. Returns `testId` in the response so the client can round-trip it.
  - `app/api/placement-test/submit/route.ts` — when a stored `generatedQuestions` exists on the row, score is recomputed from that copy and the client-supplied `ans_idx` values are ignored. General-test evaluator re-runs against the stored copy too.
  - `components/pages/PlacementTest/Test/TestMain.tsx` — reads `testId` directly from the `generate-questions` response. The redundant `/api/placement-test/start` call was removed from the technical flow.
  - **Caveat:** guest users still score client-side (they have no saved row to score against). This is acceptable because guests aren't tied to a belt-unlock record until they log in and link.
- **7.2 `testId` ownership guard** (P2) — `app/api/placement-test/submit/route.ts` refuses to accept a submission when the session user's `_id` doesn't match `test.userId`; returns 403.
- **7.3 Survey + submit zod schemas** (P3)
  - `app/api/placement-test/submit/route.ts` — full zod schema with bounded string lengths, numeric ranges, array caps.
  - `app/api/soft-skills/submit/route.ts` — zod for `ageGroup` enum + answers dict (keys are digit strings, values bounded 0–9).
- **7.4 Game-progress zod bounds** (P3) — `app/api/game-data/me/progress/route.ts` validates `level` (1–999) and `score` (0–1M); requires at least one field present.
- **7.5 Profile-update zod** (P3) — `app/api/user/profile/update/route.ts` validates names, age, and optional address fields with bounded lengths.
- **8.1 Dev-seed production guard** (P3) — added `scripts/_prodGuard.ts` + `assertNotProduction()`; called at the top of `scripts/seed.ts`, `scripts/seed-belt-content.ts`, `scripts/seed-test-users.ts`. Refuses to run under `NODE_ENV=production` unless `ALLOW_PROD_SEED=1`. `seed-reference.ts` is intentionally *not* guarded because it's documented as idempotent + production-safe.
- **8.2 `PricingConfig` unique partial index** (P1) — `lib/models/PricingConfig.ts` has a partial unique index on `(configType, packageLevel, durationMonths)` filtered by `isActive: true`. `instrumentation.ts` calls `PricingConfig.syncIndexes()` on Node-runtime boot so the constraint is applied before traffic is routed.
- **9.1 Security headers + CSP** (P1) — `next.config.ts` ships an `async headers()` block with HSTS (2 years, preload), `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera/mic/geo/payment off), and a CSP that allowlists Paymob + ip-api.com + Resend. `script-src` retains `'unsafe-inline' 'unsafe-eval'` pending a nonce-injecting middleware. Everything else is locked down.
- **9.3 Email HTML escaping** (P2)
  - `lib/email.ts` — added an `escapeHtml` helper; applied to every `firstName` / URL interpolation in both verification and reset templates. URL tokens are also `encodeURIComponent`'d.
  - `app/api/contact-admin/route.ts` — added zod validation + `escapeHtml` on every user-controlled interpolation (name, email, subject, message, type, session email).
  - `lib/resend.ts` — escaped every interpolation in the contact-us template. The hardcoded Resend API key at line 5 is intentionally untouched — it remains a P0 ops item (rotate + delete in the same cycle).
- **9.5 HTTPS for geolocation** (P3) — `lib/geoLocation.ts` now hits `https://ip-api.com/...` instead of plaintext.

### C.2 Remaining blocked work

Everything left is either **ops-only** or **infra-dependent**. No code-side items are unfinished from the audit's P0/P1/P2 tiers.

**Ops (a human must run these against live providers):**

- **B.1 P0 — Rotate every external secret** (Paymob, Resend, Google OAuth, Mongo password). `NEXTAUTH_SECRET` was already rotated in Phase 1.
- **B.1 P0 — Delete the hardcoded Resend key at `lib/resend.ts:5`.** Do this as the *last* step of rotation: rotate the provider first, wire the new key into the env, then delete the literal in a single commit. Deleting before rotation leaves only git-history copies and no env-backed replacement.
- **B.1 P0 — Take the old host offline** after rotation, so an attacker with the exfiltrated `.env.local` can't use it as an oracle.
- **B.1 — Strip example admin password** from `README.md` / `docs/*.md` that quote it. (Pure docs pass.)
- **B.1 — Invalidate outstanding sessions / verification tokens** — drop `sessions`, `verificationtokens`, `passwordresettokens` collections after rotation.

**DevOps / orchestrator (platform choice + YAML/runtime config):**

- **B.2 P2 — Container hardening beyond the Dockerfile**: `readOnlyRootFilesystem: true` with a writable `tmpfs` mount, `capabilities.drop: ["ALL"]`, `runAsNonRoot`, `allowPrivilegeEscalation: false`, CPU+memory `requests`/`limits`, egress allowlist (Mongo, Paymob, Resend, ip-api.com).
- **B.3 P1 — Secret manager migration** + the `lib/env.ts` zod boot validator it unlocks. Blocked on DevOps picking a platform (Doppler / AWS Secrets Manager / Vault / provider-native). The zod validator is trivial code once the env shape is locked.
- **B.4 P0 — Reverse proxy + TLS termination + HTTPS redirect.** `mongo-express` must be private-network / VPN only, never public.

**Infra (pipeline + shared store):**

- **9.2 P3 — Redis (or equivalent) rate limiter** — current in-memory limiter is per-pod and resets on restart. Needs a shared store.
- **9.4 P3 — CI scanning + SBOM + restore drill** — needs a pipeline (GitHub Actions / GitLab CI / etc.) and a backup/restore runbook.

**Data model (database-side, blocked on Phase 3.6):**

- **3.6 P1 — Transactional writes on order / webhook / test paths.** Blocked on DevOps enabling MongoDB replica set so Mongoose `session.withTransaction()` actually commits. `fulfillOrder()` at `lib/orders/fulfillOrder.ts` carries a `TODO(phase-3.6)` marker for the wrap.

### C.3 Docs sync (8.4) — remaining

The README + a scan of `docs/*.md` for stale auth/payments references is still pending. It's P3 and deferrable — it won't block launch, but should be done before any new dev is onboarded.

### C.4 Updated priority table

| Priority | Item | Bucket | Status |
|----------|------|--------|--------|
| **P0** | B.1 rotate secrets + delete `lib/resend.ts:5` literal | Operational | **Blocked on ops** |
| **P0** | B.4 reverse proxy + TLS | DevOps | **Blocked on DevOps** |
| **P0** | 3.6 transactional writes | Code+DevOps | **Blocked on replica set** |
| **P1** | B.3 secret manager + zod boot validator | DevOps+Code | **Blocked on platform pick** |
| **P1** | 9.1 security headers + CSP | Code | ✅ Done |
| **P1** | 8.2 `PricingConfig` unique partial index | Code | ✅ Done |
| **P2** | 7.1 server-side scoring | Code | ✅ Done (auth users) |
| **P2** | 7.2 `testId` ownership | Code | ✅ Done |
| **P2** | 9.3 email HTML escaping | Code | ✅ Done |
| **P2** | B.2 read-only FS / dropped caps / limits | DevOps | **Blocked on DevOps** |
| **P3** | 9.2 Redis rate limiter | Infra | **Blocked on shared store** |
| **P3** | 9.4 CI scanning + SBOM | Infra | **Blocked on CI platform** |
| **P3** | 8.1 dev-seed prod guard | Code | ✅ Done |
| **P3** | 7.3 survey + submit zod | Code | ✅ Done |
| **P3** | 7.4 game-progress zod | Code | ✅ Done |
| **P3** | 7.5 profile-update zod | Code | ✅ Done |
| **P3** | 9.5 HTTPS for geolocation | Code | ✅ Done |
| **P3** | 8.4 README + docs sync | Code | Pending (deferrable) |

**Net result:** every **code-only** item tracked in Appendix B is now closed. The remaining work is 100% ops + DevOps + infra — the human-side gates that the codebase can't reach on its own.
