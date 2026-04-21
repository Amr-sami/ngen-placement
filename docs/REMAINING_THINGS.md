# Remaining Things

This document tracks the work that is on hold and what it will take to finish it.

---

## 1. Firebase deprecation — Phase 3 + Phase 4 (ON HOLD)

### Which repo?

**`ngen-placement` only.** The `ngen-payment-test` repo has never used Firebase — it is a pure Mongo stack. All Firestore code, reads, credentials, and the `firebase` npm package live exclusively in `ngen-placement`.

### Current state

- Phase 1 (stop dual-writing) — **done**. New placement and soft-skills submissions write only to Mongo.
- Phase 2 (migration script) — **written but not executed**. `scripts/migrate-firebase-to-mongo.ts` is ready to pull historical Firestore rows into Mongo but has never been run against a live Firestore.
- Phase 3 (remove reads) — **NOT done**. Three live code paths still read from Firestore:
  - `app/api/sales/results/route.ts:45` — sales dashboard API fetches via `getPlacementResultsFromFirebase()`.
  - `app/salesdashboard/page.tsx:30` — same read imported directly on the client.
  - `app/[locale]/admin/evaluations/page.tsx:4` → `lib/actions/admin/firebaseActions.ts:37` — admin evaluations page reads `test_submissions` from Firestore to run the evaluation pipeline.
- Phase 4 (revoke creds + strip deps) — **NOT done**. `firebase` is still in `package.json`. `lib/firebase.ts` still initializes the client SDK. `NEXT_PUBLIC_FIREBASE_*` env vars are still consumed at build time.

### Why this is a real problem if left alone

- **Split-brain data.** Every submission since Phase 1 shipped writes to Mongo only. Those rows are invisible to the sales dashboard and to the admin evaluations screen because both screens read from Firestore. Business users will see a frozen-in-time view that silently falls further behind every day.
- **Bundle bloat.** The `firebase` package ships to the client regardless of whether it is called — it is still imported by the pages listed above.
- **Security surface.** Public Firebase API keys remain in build output and in env. Firestore security rules are the only gate on anything still running against the project.
- **Operational ambiguity.** Two sources of truth for the same entity is a debugging trap. Incidents become "which DB has the right answer" investigations.

### The two options

---

### Option A — Switch reads to Mongo now, leave historical Firestore data for later

**What happens:** Code paths stop touching Firestore. Historical rows that only exist in Firestore stay there, unreachable from the app, until someone decides to migrate them.

**Steps (can be done entirely from this environment, no Firebase credentials needed):**

1. Rewrite `lib/firebase-service.ts`:
   - Replace `getPlacementResultsFromFirebase()` with a function that reads from Mongo's `PlacementTest` collection.
   - Map Mongo documents to the existing `PlacementResult` shape so no call sites need to change.
   - Keep the 200-row cap that the sales route applies.
2. Rewrite `lib/actions/admin/firebaseActions.ts`:
   - Replace the `test_submissions` Firestore query with a Mongo query against `PlacementTest` (or the appropriate collection that stores soft-skills submissions — confirm which during implementation).
   - Preserve the existing `assertAdmin()` gate.
3. Delete `lib/firebase.ts` (client SDK init).
4. Remove `firebase` from `package.json` dependencies. Regenerate lockfile (`npm install`).
5. Remove all `NEXT_PUBLIC_FIREBASE_*` references from `.env*` files, Dockerfile, CI configs, and any code.
6. Run `npm run build` and `npx tsc --noEmit` to confirm nothing else imported the deleted modules.
7. Rebuild Docker image to verify runtime still comes up without Firebase env vars.

**Outcome:**
- Sales dashboard and admin evaluations start showing post-Phase-1 data immediately.
- `firebase` package gone from the bundle. Build surface smaller.
- `NEXT_PUBLIC_FIREBASE_*` secrets no longer required to build or run the app.

**Consequences:**
- Historical submissions that were only ever written to Firestore (before Phase 1) become invisible in-app. They are not deleted — they just sit in Firestore with no reader.
- If the business ever wants the historical rows back in the unified view, you will need to come back and execute Phase 2 — and that *still* requires Firebase credentials. The migration script is already written, so the lift at that point is small (give script credentials, run dry-run, run live).
- Firebase project itself is untouched. The service account and API keys still exist. You can revoke them any time from the Firebase console once you are confident no forgotten caller exists — this is a manual console action, not a code action.

---

### Option B — Full deprecation: migrate historical data, then switch reads, then strip deps

**What happens:** Every row ever written to Firestore ends up in Mongo. The app switches to Mongo-only reads. The Firebase project is then safe to tear down.

**Prerequisite (only you can provide this — DevOps does not have Firebase access):**
- Firebase Admin SDK service account JSON. Generate at: Firebase Console → Project Settings → Service Accounts → "Generate new private key".
- Confirmation of the Firebase project ID to target.

**Steps:**

1. Provide the service account JSON and project ID.
2. Add the JSON path to `.gitignore` and drop the file in the repo (never commit it).
3. Run the migration in dry-run mode:
   `npx tsx scripts/migrate-firebase-to-mongo.ts --dry-run`
   Review the output — counts pulled from Firestore, counts that would insert, counts that would dedup against existing Mongo rows (match key: email + score + timestamp ±60s).
4. If dry-run numbers look right, run live:
   `npx tsx scripts/migrate-firebase-to-mongo.ts`
5. Spot-check a handful of rows: pick 5 emails from Firestore, confirm each appears in Mongo with matching score and timestamp.
6. Then execute every step from Option A (rewrite reads, delete `lib/firebase.ts`, drop the npm package, purge env vars, rebuild).
7. In the Firebase console (you must do this manually, not me): delete the service account key, delete the web app registration, optionally delete the Firebase project entirely.
8. Remove the service account JSON file from the repo.

**Outcome:**
- One source of truth. Every historical and future placement submission lives in Mongo.
- Sales and admin screens show a complete unified history.
- Firebase project can be fully decommissioned. No lingering credentials, no lingering bills, no lingering attack surface.
- `firebase` npm dependency gone, build surface minimal.

**Consequences:**
- Irreversible from the app's perspective once creds are revoked: if a bug in the migration script dropped rows, the only recovery is Firebase console exports (if the project still exists) or backups.
- Requires a short maintenance window where you are watching the migration and not taking new submissions, to avoid races. In practice the script is idempotent on the dedup key, so re-running is safe.
- Demands one uninterrupted session with the service account JSON on disk. Treat the JSON like a production secret — do not paste it into chat, do not commit it, delete the file when done.

---

### Recommendation

Pick Option A now if the business does not need historical rows visible immediately — the code change is small, reversible, and unblocks everything else. Come back to migration later when you are ready to sit down with credentials for one focused session.

Pick Option B if you want this chapter fully closed and you can allocate the time to do the migration end-to-end.

Either way, the current mid-state (Phase 1 done, Phase 3 not done) is the worst of both worlds and should not be where this sits long-term.

---

## 2. Resend API key rotation (ON HOLD — security)

### Which repo?

**Both repos.** `ngen-placement/lib/resend.ts` and `ngen-payment-test/lib/resend.ts` each contain the same hardcoded fallback `re_QQCHua2w_...` literal. This key has been committed to git history.

### Steps

1. In Resend dashboard, revoke the old key and issue a new one.
2. Update the `RESEND_API_KEY` env var in every environment (local `.env.local`, staging, production, CI).
3. Remove the hardcoded fallback literal from both `lib/resend.ts` files. The lazy `getResend()` helper should read from `process.env.RESEND_API_KEY` only, with no string fallback.
4. Rebuild Docker images.

### Outcome
Leaked key no longer valid. No hardcoded secret in the repo.

### Consequences
Any deploy environment that was silently relying on the hardcoded fallback (rather than a properly configured env var) will break email sending until its `RESEND_API_KEY` is set. Audit env files before rotating.

---

## 3. Subdomain parity — G.1 through G.4 (BLOCKED on DevOps)

These require DNS, env var, and secret management across staging + production. Not doable from this environment.

- **G.1** Align `NEXTAUTH_URL` and `APP_BASE_URL` across staging and prod for both repos.
- **G.2** Configure cookie domain to `.ngen.school` so sessions cross subdomains between `app.ngen.school` and `placement.ngen.school`.
- **G.3** CORS allowlist between the two subdomains.
- **G.4** Shared `NEXTAUTH_SECRET` provisioned in both deployments so JWTs minted on one subdomain are verifiable on the other.

---

## 4. Relaunch gate — H.1 through H.4 (BLOCKED on DevOps / staging access)

These scripts exist in the repo and are ready to run, but they need staging/prod database access that lives with DevOps.

- **H.1** Run `scripts/verify-indexes.ts --fix` against staging Mongo to align index definitions with the models.
- **H.2** Run `scripts/migrate-firebase-to-mongo.ts --dry-run` against staging, then live against production (this is the same script mentioned in Option B of section 1 — the two tasks converge).
- **H.3** Run `scripts/audit-db.ts` to take a JSON snapshot of collection state pre- and post-cutover for diffing.
- **H.4** Run `scripts/load-test.js` (k6) against staging to validate the guest-submission flow holds up under expected peak traffic.

---

## Summary table

| # | Item | Repo | Blocked by | Who unblocks |
|---|---|---|---|---|
| 1 | Firebase Phase 3+4 | `ngen-placement` | Decision on Option A vs B; if B, Firebase creds | You (you have Firebase access) |
| 2 | Resend key rotation | both | Resend dashboard access | You / DevOps |
| 3 | Subdomain parity | both | DNS + env management | DevOps |
| 4 | Relaunch gate | both | Staging/prod DB access | DevOps |
