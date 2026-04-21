# Sibling Repo — Audit & Port Plan (`ngen-placement`, branch `placement-test-only`)

> Companion to `docs/AGENT_REVIEW_EXECUTION_PLAN.md` (copied from `ngen-payment-test`).
> That file = the master audit already executed on the main app.
> This file = what the sibling repo still needs, how it diverges from main, and the exact ports to perform.

Audit date: 2026-04-21
Base commit: `06d4098` — `feat: implement sales dashboard hybrid results and detailed review modal` (2026-02-26)
Main-repo cross-ref: `/Users/ahmed/Ngen-Production/ngen-payment-test` at current HEAD (all Phase 1, 2, 4, 5, 6, 7, 8, 9 landed; Phase 3.6 is DevOps-blocked).

---

## 0. What this sibling is, in one paragraph

A **guest-first** placement-exam app, owned by the sales team, branched off the main app **before** the recent security/correctness pass. Hosted on its own subdomain. Shares the **same MongoDB** with the main app (same `users`, `placement_tests`, tokens, etc.) and also mirrors results to **Firebase** for the sales dashboard. Users can start an exam without any account; authentication only matters if a lead converts. Because the DB is shared, any correctness bug here corrupts the main app's data, and any unvalidated write here is an attack vector against the main app's users.

---

## 1. Repo shape (directory-level)

```
ngen-placement/
├── app/
│   ├── [locale]/...
│   └── api/
│       ├── admin/          (differs from main)
│       ├── auth/           (differs from main — stale version of all 5 routes)
│       ├── contact-admin/  (differs)
│       ├── game-data/me/progress/
│       ├── generate-questions/     ← GUEST-FIRST, returns ans_idx to client
│       ├── me/                     ← sibling-only
│       ├── placement-test/{check-user,my-results,results,start,submit}
│       ├── sales/results/          ← sibling-only (sales dashboard backend)
│       ├── soft-skills/submit/
│       └── user/profile/update/
├── lib/
│   ├── auth/{adminAuth, authOptions}.ts (differs; NO tokenHash.ts)
│   ├── models/{User, PlacementTest, PricingConfig, PasswordResetToken, VerificationToken, index}.ts (all differ)
│   ├── email.ts  (differs — no escapeHtml)
│   ├── resend.ts (differs — hardcoded API key + no escaping)
│   ├── geoLocation.ts (differs — http://, not https://)
│   ├── firebase.ts                  ← sibling-only
│   ├── firebase-service.ts          ← sibling-only
│   └── actions/admin/firebaseActions.ts  ← sibling-only
├── scripts/  (differs — NO _prodGuard, NO seed-reference, NO audit-db)
├── middleware.ts (differs)
├── next.config.ts (differs — NO security headers, NO CSP)
└── (MAIN-ONLY, absent here: instrumentation.ts, Dockerfile, .dockerignore,
    app/api/{health,ready,orders,payment,pricing,webhooks,belt-content},
    lib/models/BeltContent.ts)
```

---

## 2. Divergence inventory (files that exist on both sides but differ)

Each entry is tagged:
- **SEC** — security fix missing here (port required, no exceptions)
- **CORR** — correctness fix missing here
- **SHAPE** — sibling has extra/different behavior by design (audit first, adapt, do not blindly overwrite)

| File | Tag | What's missing / what differs |
|---|---|---|
| `lib/resend.ts` | **SEC** | Hardcoded Resend API key (`re_QQCH…kbpF`) on line 5; no `escapeHtml` around any interpolation. Same secret as main — must be rotated *once*, then both apps read from env. |
| `lib/email.ts` | **SEC** | No `escapeHtml` helper; `firstName` interpolated raw into HTML; tokens not `encodeURIComponent`'d in URLs; no `resolveLocale()` bounded to allowed locales. |
| `lib/geoLocation.ts` | **SEC** | Uses `http://ip-api.com/...` — plaintext, tamperable; `countryCode` is written onto user records and drives EGP/USD pricing. |
| `lib/models/PricingConfig.ts` | **CORR** | Missing partial unique index `{ configType, packageLevel, durationMonths }` `partialFilterExpression: { isActive: true }`. Two active configs → non-deterministic pricing. |
| `lib/models/PlacementTest.ts` | **CORR/SEC** | Missing `generatedQuestions` field. Without it the submit route has no server-side answer key → scoring stays client-trusted. |
| `lib/models/User.ts` | audit needed | Diff first to confirm whether sibling added fields for sales / Firebase integration (likely yes). Keep those, port any security-related field changes from main. |
| `lib/models/{PasswordResetToken, VerificationToken}.ts` | **SEC** | No `tokenHash.ts` helper; tokens stored in cleartext at rest. |
| `lib/auth/authOptions.ts` | **SEC** | Stale before the Phase 6 pass (callback allowlist, admin re-check against Mongo, email-verified gate). |
| `lib/auth/adminAuth.ts` | **SEC** | Pre–Phase 6.2 — admin role not revalidated against DB on every request. |
| `middleware.ts` | **SEC** | Pre-Phase 9 — no locale-redirect hardening, no CSP nonce hook. |
| `next.config.ts` | **SEC** | **Zero** security headers block. No HSTS, no X-Frame-Options, no Referrer-Policy, no Permissions-Policy, no CSP. 27 lines total vs. main's 100+. |
| `package.json` | **CORR** | Older React 19 RC pin, `legacy-peer-deps`, no `engines`/`packageManager`. Install parity broken with main. |
| `app/api/auth/forgot-password/route.ts` | **SEC** | Leaks "email not found" via response shape + reveals by silence. Also no zod body validation, no token hashing. |
| `app/api/auth/register/route.ts` | **SEC** | Pre-Phase 6 register flow — no enumeration guard, no verification email gate, geolocation over HTTP, raw HTML in emails. |
| `app/api/auth/resend-verification/route.ts` | **SEC** | Same enumeration pattern. |
| `app/api/auth/verify-email/route.ts` | **SEC** | Expects cleartext tokens (not hashed). |
| `app/api/admin/grant-attempt/route.ts` | **SEC** | Pre-Phase 6.2 admin gate. |
| `app/api/contact-admin/route.ts` | **SEC** | No zod schema, no `escapeHtml` — user-controlled name/subject/message inlined into admin email HTML. |
| `app/api/game-data/me/progress/route.ts` | **CORR** | No bounds on `level`/`score`; integer overflow into user doc. |
| `app/api/generate-questions/route.ts` | **SEC/SHAPE** | Returns full questions *including `ans_idx`* to the client. Sibling is guest-first so we can't write a DB row by default — this is the **central architectural change** (see §4). |
| `app/api/placement-test/start/route.ts` | **SEC** | Predates the testId contract; trusts client-supplied metadata. |
| `app/api/placement-test/submit/route.ts` | **SEC** | No zod validation, no ownership guard, no server-side scoring. `score`, `selectedAnswers`, and `questions[].ans_idx` are all client-supplied — a guest can POST any score, any belt, any trackName. Worse: it then `User.findOneAndUpdate` on the shared DB. |
| `app/api/placement-test/results/[testId]/route.ts` | **SEC** | No ownership guard on read. |
| `app/api/soft-skills/submit/route.ts` | **SEC/CORR** | No zod schema; accepts arbitrary answer shape. |
| `app/api/user/profile/update/route.ts` | **SEC/CORR** | No zod bounds, no trim, accepts arbitrary-length strings into shared user doc. |

---

## 3. Sibling-only surfaces (keep, but must be audited before release)

These don't exist in main, so there's nothing to port *from*. They need their own audit pass:

- `lib/firebase.ts` + `lib/firebase-service.ts` + `lib/actions/admin/firebaseActions.ts`
  — Sales-dashboard mirror. Confirm: credentials in env only (not committed); write rules locked to service-account; failure is non-blocking (already looks like it is — `.catch(...)` in submit route).
- `app/api/sales/results/**`
  — Sales lead listing. Must be admin/sales-role gated via the same Mongo-backed role check we'll port from `adminAuth.ts`. Do **not** expose guest PII to unauthenticated callers.
- `app/api/me/**`
  — Confirm ownership guard and zod.
- `lib/placement-test/__tests__/**`
  — Keep; port forward if the port changes the evaluator shape.

---

## 4. Main-only surfaces and what to do about each

| Path | Decision |
|---|---|
| `instrumentation.ts` (boot-time `PricingConfig.syncIndexes()`) | **Port.** Needed once the partial index lands. |
| `Dockerfile`, `.dockerignore` | **Port** with subdomain-specific tweaks (see §7). |
| `app/api/health`, `app/api/ready` | **Port.** Every container needs liveness/readiness. |
| `app/api/orders/*`, `app/api/payment/*`, `app/api/webhooks/*`, `app/api/pricing/*` | **Skip.** Sibling does not sell anything; no payment surface exists here. |
| `app/api/belt-content/*`, `lib/models/BeltContent.ts` | **Skip unless sales wants it.** Non-essential for placement-only flow. Confirm with user before pulling. |
| `scripts/_prodGuard.ts` | **Port.** Any dev seed script in sibling's `scripts/` (seed.ts, seed-test-users.ts) must refuse to run in prod. |
| `scripts/seed-reference.ts`, `scripts/audit-db.ts` | **Port** as-is — they're DB-shape tools, useful for any environment that talks to this DB. |
| `lib/auth/tokenHash.ts` | **Port** — prerequisite for verification/reset token hashing. |

---

## 5. The guest-first problem (architectural, must settle before Phase C)

Main app's Phase 7.1 solved "client-trusted scoring" by:
1. Adding `generatedQuestions: Schema.Types.Mixed` to `PlacementTest`.
2. Making `generate-questions` create a `PlacementTest` row *inline for the authenticated user* and return the `testId`.
3. Making `submit` load `generatedQuestions` from that row and recompute the score, ignoring client-supplied `ans_idx`.

That closed the loop because main always had a user. **The sibling does not.** 80%+ of traffic here is unauthenticated guests.

Three viable patterns, pick one:

**Option A — Server-side session with a lead token (recommended).**
- `generate-questions` creates a `PlacementTest` row with `userId: null` and a random `leadToken` (cryptographically random, 32 bytes, hashed at rest).
- Response sets an `HttpOnly; Secure; SameSite=Lax; Path=/api/placement-test` cookie holding the cleartext `leadToken`; server keeps `leadTokenHash`.
- `submit` re-hashes the incoming cookie and looks up the row. Ownership guard = cookie-bound, not user-bound.
- Later, if the guest signs up, we link the record by email or by carrying the cookie into the first authenticated request.
- Pro: ans_idx never touches the client. Con: one extra migration on `PlacementTest`.

**Option B — Signed exam token (stateless).**
- `generate-questions` does **not** write a row. It returns `{ questions (without ans_idx), examToken }` where `examToken` is a JWS signed with a server secret, payload = `{ examId, questionIds[], ans_idx[], exp }`.
- `submit` verifies the JWS, compares `selectedAnswers` to the embedded `ans_idx`, scores server-side, then writes the `PlacementTest` row at submit time.
- Pro: no guest DB rows cluttering the collection if they bail. Con: answers-in-JWS is fine only while we never need to reconstruct an exam without resubmit.

**Option C — Guest-bound row from the start (sibling's current shape, patched).**
- Keep sibling's current "no DB row until submit" flow but stop returning `ans_idx` to the client. Store the full exam keyed by a random `examId` in a short-lived server store (Redis or a new `PendingExam` collection with TTL index). `submit` rehydrates from `examId`.
- Pro: cleanest separation. Con: requires Redis or a new TTL collection — ops work.

**Default recommendation: A, with lead-token cookie.**
Reasons: (a) we already have Mongo, no new infra; (b) the "link guest to user on signup" path is easier when a row exists from the start; (c) matches what the sales dashboard already expects (leads = rows).

Decision needed from user before Phase C.3 starts.

---

## 6. Shared-DB contract (§B in the master plan, expanded here)

Because both apps talk to one Mongo, **model drift is a live outage risk**. The sibling added sales-dashboard fields to `User`; if main re-declares `User` with a different schema and `syncIndexes()` runs, indexes can drop. Three options:

1. **Manual sync** — write a "SHARED_MODELS.md" both repos reference; code-review both PRs side-by-side. Cheap, error-prone.
2. **Shared npm package** — extract `lib/models/*` into `@ngen/shared-models`, version it, both apps depend on it. Correct, more work.
3. **Monorepo** — merge into one pnpm workspace. Correct, most work, disruptive.

**Default recommendation: (1) now, (2) as a follow-up.** Either way, create `docs/SHARED_MODELS_CONTRACT.md` listing every collection and which app owns which fields. Add CI check (eventually) that fails if `lib/models/User.ts` differs between repos without a matching PR on the other side.

Decision needed from user.

---

## 7. Subdomain / session architecture

Three sub-decisions the user needs to settle before deployment:

1. **Cookie scope.**
   - `.ngen.school` → session shared across main app and sibling (convenient but XSS on one domain compromises both).
   - `placement.ngen.school` + `app.ngen.school` distinct → stronger isolation, but users who start on sibling then log in on main don't carry a session.
   - **Default recommendation:** distinct per-subdomain cookies + explicit link-on-signup flow. Safer.
2. **NEXTAUTH_URL / callbackUrl allowlist.** Already hardened on main; port the allowlist and add the sibling's own subdomain plus (optionally) the main app's subdomain if we want cross-login.
3. **CORS.** If the two apps ever call each other's APIs directly (they shouldn't — go via the DB), whitelist explicitly. Default: no cross-origin API.

---

## 8. Port phases (ordered; each one is a self-contained PR-sized unit)

### Phase A — Repo hygiene & audit doc (this doc + §9 task list)
- A.1 ✅ Clone sibling to `/Users/ahmed/Ngen-Production/ngen-placement/`.
- A.2 ✅ Copy master plan as `docs/AGENT_REVIEW_EXECUTION_PLAN.md` for reference.
- A.3 ✅ Produce this file (`SIBLING_AUDIT_AND_PORT_PLAN.md`).
- A.4 ✅ User resolved §5 (Option A), §6 (manual docs now), §7 (per-subdomain cookies) on 2026-04-21. See §9.

### Phase B — Shared-DB contract
- B.1 ☐ Create `docs/SHARED_MODELS_CONTRACT.md` (in both repos) listing every collection + field ownership. **Owner: engineer porting models; blocks Phase H.4.**
- B.2 ☐ Diff every `lib/models/*.ts` side-by-side and reconcile. **Owner: same as B.1.**

### Phase C — Port security / correctness fixes (no skipping)
Each item = a port from the corresponding main-repo fix. Every item is security-critical for the sibling's shared DB even if it looks "not placement-related" — a compromised register route here can still create a bad user in the shared collection.

- C.1 ✅ `lib/resend.ts` — escapeHtml on all interpolations; key read from `process.env.RESEND_API_KEY` (value rotated on DevOps side first).
- C.2 ✅ `lib/email.ts` — port `escapeHtml`, `resolveLocale`, `requireAppUrl`, `encodeURIComponent` on tokens.
- C.3 ✅ `lib/geoLocation.ts` — switch to `https://`.
- C.4 ✅ `lib/auth/tokenHash.ts` — add file; wire into register / verify / forgot / reset flows.
- C.5 ✅ `lib/auth/authOptions.ts` — port callback allowlist, admin re-check against Mongo, email-verified gate.
- C.6 ✅ `lib/auth/adminAuth.ts` — port role revalidation.
- C.7 ✅ `lib/models/PlacementTest.ts` — add `generatedQuestions?` field (Phase 7.1 prereq).
- C.8 ✅ `VerificationToken` + `PasswordResetToken` tokenHash migration (PricingConfig partial index deferred — sibling doesn't write pricing; left to main app).
- C.9 ✅ `app/api/auth/forgot-password/route.ts` — zod body, constant-time response for unknown emails, token hashing.
- C.10 ✅ `app/api/auth/register/route.ts` — zod body, enumeration guard, verification email gate, escapeHtml.
- C.11 ✅ `app/api/auth/resend-verification/route.ts` — constant-time response.
- C.12 ✅ `app/api/auth/verify-email/route.ts` — hash lookup, encodeURIComponent-safe.
- C.13 ✅ `app/api/contact-admin/route.ts` — zod body, escapeHtml on all interpolations.
- C.14 ✅ `app/api/game-data/me/progress/route.ts` — zod bounds (`level` 1-999, `score` 0-1_000_000, at-least-one refinement).
- C.15 ✅ `app/api/user/profile/update/route.ts` — zod bounds, trim, nullable address fields.
- C.16 ✅ `app/api/soft-skills/submit/route.ts` — zod `z.enum(['6-9','10-14','15-18'])`, digit-keyed answer record with `z.number().int().min(0).max(9)`.
- C.17 ✅ `app/api/admin/grant-attempt/route.ts` — port Phase 6.2 admin gate.
- C.18 ✅ `app/api/generate-questions/route.ts` — implement Option A (or A-B-C once user decides) from §5. Stop returning `ans_idx`.
- C.19 ✅ `app/api/placement-test/start/route.ts` — either fold into §C.18 or zod-validate and require lead cookie.
- C.20 ✅ `app/api/placement-test/submit/route.ts` — zod `SubmitSchema`, ownership guard (via session user OR lead cookie), server-side scoring from `generatedQuestions`, escapeHtml nowhere needed but no more trusting client `score`.
- C.21 ✅ `app/api/placement-test/results/[testId]/route.ts` — ownership guard on read (session user OR lead cookie match).
- C.22 ✅ `app/api/sales/results/**` — role gate (sales or admin), zod on filters, pagination bounds.
- C.23 ✅ (no-op — sibling middleware already matches main) `middleware.ts` — port locale redirect hardening.
- C.24 ✅ `next.config.ts` — port full `async headers()` block (HSTS, X-Content-Type-Options, X-Frame-Options:DENY, Referrer-Policy, Permissions-Policy, CSP with allowlists; **drop** Paymob from the sibling's CSP since there's no payment flow).
- C.25 ✅ `package.json` — bump to stable React 19, drop `legacy-peer-deps`, add `engines` + `packageManager` to match main.
- C.26 ✅ `scripts/_prodGuard.ts` — port + apply to sibling's `seed.ts` and `seed-test-users.ts` and `migrate-to-bilingual.ts` if it mutates prod data.
- C.27 ✅ Delete `package-lock 2.json` (duplicate lockfile already present here too).

### Phase D — Add the things sibling is missing for deployment
- D.1 ✅ Port `instrumentation.ts` — syncs `PricingConfig` AND `PlacementTest` indexes on boot; fails closed (does not mark ready on sync error).
- D.2 ✅ Port `/api/health` (Mongo ping) and `/api/ready` (flips to 200 after instrumentation).
- D.3 ✅ Port `Dockerfile` + `.dockerignore` (Next standalone output; copies `questions_v2`, `SpicificTest-AR`, `SpicificTest-EN`; wget healthcheck on `/api/health`).
- D.4 ✅ Self-host fonts — Nunito + Protest Riot via `next/font/local` from `public/fonts/*.woff2`; salesdashboard layout dropped `Inter` from `next/font/google`.

### Phase E — Sales dashboard / sibling-only surface hardening
- E.1 ✅ Audited `firebase-service.ts` — see `docs/FIREBASE_DEPRECATION.md`. Browser-SDK only, no Admin SDK; client config is `NEXT_PUBLIC_*` so Firestore rules are the only real gate; write failures already non-blocking via 5s timeout race.
- E.2 ✅ Audited all `app/api/sales/**` (just `results/route.ts`) — Mongo-revalidated admin role gate, explicit 401/403, `MAX_PAGE_SIZE=200` cap, projection strips `generatedQuestions` + `leadTokenHash`.
- E.3 ✅ Decision: **MongoDB is source of truth, Firebase deprecates**. Four-phase path in `docs/FIREBASE_DEPRECATION.md`: stop writing → migrate historical → stop reading → revoke creds.

### Phase F — Guest-to-user linking
- F.1 ✅ Register route links orphan PlacementTest rows inline using the lead-token cookie; clears cookie on success. Link failure is non-fatal (logged, registration still succeeds).
- F.2 ✅ Login form calls `POST /api/placement-test/link-guest` on successful signin; endpoint is session-guarded, only claims rows where `userId: null AND leadTokenHash matches` (no hijacking an already-owned row).
- F.3 ✅ Linked count stashed in `sessionStorage.linkedGuestTests` for downstream UI. Existing results pages already surface newly-linked rows once `userId` matches. Lead-token cookie path widened from `/api/placement-test` to `/api` so both register and the link endpoint see it.

### Phase G — Subdomain deployment parity
- G.1 ☐ Cookie scoping per §7 decision.
- G.2 ☐ NEXTAUTH_URL + callback allowlist updated.
- G.3 ☐ Health/ready wired to reverse proxy.
- G.4 ☐ Load-test guest flow on the target subdomain before cutover.

### Phase H — Relaunch gate
- H.1 ☐ Cross-app smoke test (guest takes exam on sibling → signs up on main → sees results).
- H.2 ☐ Both apps green on health + ready behind the proxy.
- H.3 ☐ Secrets rotated (Resend key + NEXTAUTH_SECRET + Mongo creds) — same rotation serves both apps.
- H.4 ☐ `docs/SHARED_MODELS_CONTRACT.md` signed off.

---

## 9. Decisions (resolved 2026-04-21)

1. **Guest-first scoring strategy** — **Option A (lead-token cookie)**. `generate-questions` creates a `PlacementTest` row with `userId: null`, stores the exam including `ans_idx` in `generatedQuestions`, and sets an `HttpOnly; Secure; SameSite=Lax` cookie holding a cleartext `leadToken` whose hash is stored on the row. `submit` re-hashes the cookie, loads the row, recomputes the score server-side. No sales-side login — leads are collected purely from the survey/exam metadata the guest types in. All guest data lands in the **shared Mongo** (no separate schema branch).
2. **Shared-model strategy** — **manual docs now, package later.** Write `docs/SHARED_MODELS_CONTRACT.md` in both repos listing every collection + field ownership; both PRs reviewed side-by-side until we extract a shared package.
3. **Cookie scope** — **per-subdomain.** Distinct cookies; `placement.ngen.school` and `app.ngen.school` have isolated sessions. Guest-to-user linking happens at register/signin time via email match + any lead-token cookie carried into the first request.
4. **Sales dashboard source of truth** — deferred; sibling already mirrors to Firebase non-blockingly. Keep as-is; tighten in Phase E.
5. **BeltContent / belt admin** — skip (not needed on placement subdomain).
6. **CI** — defer to Phase H.

---

## 10. What is explicitly **not** being ported (and why)

- Payment / orders / Paymob / webhooks — sibling doesn't charge.
- BeltContent admin — unless user says otherwise.
- Main's pricing-config admin surface — no pricing on the placement subdomain.

Everything else ports.

---

## 11. Cross-reference to the master document

Each C.N task above has a matching entry in `AGENT_REVIEW_EXECUTION_PLAN.md` — the master doc has the rationale, threat model, and the exact diff that landed on main. When porting, open both files side-by-side: master for *why* and *what landed*, this file for *what changes in the sibling context* (guest-first, shared DB, sales dashboard, no payments).

---

## 12. Phase C — Status Summary (2026-04-21)

All Phase C port tasks are **code-complete** against the sibling tree. TypeScript diagnostics (zod / process / next-auth module-not-found) are expected until `npm install` runs against the bumped `package.json` in §13.

| Task   | Status    | What landed                                                                 |
| ------ | --------- | --------------------------------------------------------------------------- |
| C.1    | ✅ done   | `lib/resend.ts` — env-driven key + `escapeHtml` on all interpolations       |
| C.2    | ✅ done   | `lib/email.ts` — escapeHtml, locale resolver, `encodeURIComponent(token)`   |
| C.3    | ✅ done   | `lib/geoLocation.ts` — https://ip-api.com                                    |
| C.4    | ✅ done   | `lib/auth/tokenHash.ts` — sha256 helper                                      |
| C.5    | ✅ done   | `lib/auth/authOptions.ts` — verification gate, status check, origin-pinned redirect |
| C.6    | ✅ done   | `lib/auth/adminAuth.ts` — DB revalidation per request (no stale JWT claims) |
| C.7    | ✅ done   | `PlacementTest` — `generatedQuestions` (Mixed, select:false) + `leadTokenHash` (indexed, select:false) |
| C.8    | ✅ done   | `VerificationToken` + `PasswordResetToken` — `token` → `tokenHash`          |
| C.9–12 | ✅ done   | register / forgot-password / resend-verification / verify-email — hashed tokens, enumeration guards, locale plumbing |
| C.13   | ✅ done   | `contact-admin` — zod + escapeHtml                                           |
| C.14–16| ✅ done   | game-progress / profile-update / soft-skills — zod at route boundary         |
| C.17   | ✅ done   | `admin/grant-attempt` — `requireSuperAdmin` + zod                            |
| C.18–21| ✅ done   | Guest-first scoring (Option A): lead-token cookie, server-side scoring, ownership gate on submit + results |
| C.22   | ✅ done   | `sales/results` — admin gate + MAX_PAGE_SIZE + projection excludes `generatedQuestions`/`leadTokenHash` |
| C.23   | ✅ no-op  | Sibling `middleware.ts` already matches main's hardened shape (with `/salesdashboard` carve-out) |
| C.24   | ✅ done   | `next.config.ts` — HSTS/XCTO/XFO/Referrer/Permissions + CSP (Firebase in, Paymob out) |
| C.25   | ✅ done   | `package.json` — engines, packageManager, stable React 19, @types/react 19, eslint 9, `eslint .` lint script |
| C.26   | ✅ done   | `scripts/_prodGuard.ts` added + wired into `seed.ts`, `seed-test-users.ts`, `create-support-user.ts`, `migrate-to-bilingual.ts` |
| C.27   | ✅ done   | Deleted `"package-lock 2.json"`                                              |

---

## 13. DevOps handover (blocking items — cannot be resolved from the repo alone)

The code is ready; these items require operator action on the infrastructure / secrets layer. Without them, the sibling **will not deploy correctly to its subdomain** and some security work is incomplete.

### 13.1 Install dependencies against the new package.json

```bash
cd /Users/ahmed/Ngen-Production/ngen-placement
rm -rf node_modules
npm install
npm audit --omit=dev
```

After this completes:
- All TypeScript "Cannot find module 'zod' / 'next-auth' / 'process'" diagnostics clear.
- React switches from the RC build (`19.0.0-rc-66855b96-20241106`) to stable `^19.0.0`. No `.npmrc` / `legacy-peer-deps` is needed anymore — if npm complains about peers, that is real and must be resolved, not masked.
- Confirm `package-lock.json` is regenerated and commit it alongside `package.json`. Do NOT recreate a second lockfile.

### 13.2 Secret rotation (SHARED with main app — rotate once, propagate to both)

Both apps share the same Mongo cluster and (likely) the same Resend account. Rotation must happen atomically across both subdomains' environments.

| Secret             | Why rotate                                                                                                                                                 | How                                                         |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `RESEND_API_KEY`   | The old hardcoded key `re_QQCH…` was committed in `lib/resend.ts`. Must be assumed leaked. Revoke at Resend dashboard.                                      | Resend dashboard → API Keys → revoke old, issue new.        |
| `NEXTAUTH_SECRET`  | Session-forgery impact if leaked. Rotating invalidates all existing sessions, which is fine — both apps are pre-launch.                                    | `openssl rand -base64 32` → set identically on both apps.   |
| `MONGODB_URI` user | Precaution. New rotating password on the application-scoped Mongo user.                                                                                   | Mongo Atlas / self-host → new user password, update both envs. |

### 13.3 Per-subdomain environment variables

Set these **distinctly per subdomain**. Do NOT share `NEXTAUTH_URL`.

```
# Main app (e.g., app.ngen.school)
NEXTAUTH_URL=https://app.ngen.school
NEXT_PUBLIC_APP_URL=https://app.ngen.school

# Sibling (sales / placement, e.g., placement.ngen.school)
NEXTAUTH_URL=https://placement.ngen.school
NEXT_PUBLIC_APP_URL=https://placement.ngen.school
```

Shared across both:
```
NEXTAUTH_SECRET=<rotated>
MONGODB_URI=<rotated>
RESEND_API_KEY=<rotated>
FROM_EMAIL="Ngen <no-reply@ngen.school>"
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
ADMIN_EMAILS=comma,separated,list@ngen.school
```

Sibling-only:
```
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
# (or whichever init your lib/firebase.ts uses)
```

### 13.4 Google OAuth callback allowlist

In the Google Cloud Console OAuth client used by both apps, **both** redirect URIs must be added:

```
https://app.ngen.school/api/auth/callback/google
https://placement.ngen.school/api/auth/callback/google
```

Missing either one silently breaks Google sign-in on the missing subdomain.

### 13.5 Cookie scope — per subdomain (decision locked 2026-04-21)

Do **not** set `Domain=.ngen.school` on NextAuth, lead-token, or any other cookies. Leave Domain unset so cookies are host-scoped. `lib/placement-test/leadToken.ts` already serializes cookies without `Domain=`; verify during deployment that no reverse-proxy rewrite injects one.

### 13.6 CSP allowlist verification

`next.config.ts` CSP now allows:
- `https://*.googleapis.com` / `https://firestore.googleapis.com` / `https://*.firebaseio.com` / `https://identitytoolkit.googleapis.com` — Firebase Firestore sales mirror
- `https://ip-api.com` — client geolocation (HTTPS only after C.3)
- `https://api.resend.com` — server-side only, kept for completeness
- `frame-src 'self'` — NO Paymob on this subdomain

If Firebase init on the client expands later (e.g., auth, storage), the `connect-src` / `frame-src` allowlist needs to be revisited. CSP is enforced — a missed host = silent fetch failure in the browser.

### 13.7 Reverse-proxy / health endpoints (Phase D)

Main app exposes `/api/health` and `/api/ready`. Sibling does **not** yet. Before cutover:
- Port `/api/health` (liveness — no DB check) and `/api/ready` (readiness — Mongo ping + Firebase app init check).
- Configure the reverse proxy (nginx / Cloud Run / whichever) to use `/api/ready` for rolling-deploy gating, and `/api/health` for liveness.

This is a Phase D task, not C, but listing it here so it isn't lost.

### 13.8 MongoDB replica set — blocking Phase 3.6 (transactional writes)

`ngen-payment-test`'s Phase 3.6 (transactional wrapping of order/webhook/test-start) is currently DevOps-blocked: Mongo must run as a replica set (even single-node `rs.initiate()`) for transactions to work. This applies to the sibling too — `placement-test/submit` updates both the `placementtests` row and the `users.placementTest.*` counters, which should be transactional.

Action: enable replica set on the shared Mongo cluster (required once for both apps). Then Phase 3.6 port becomes a pure code task.

### 13.9 Self-hosted fonts (Phase D)

Sibling still uses `next/font/google` in `app/[locale]/layout.tsx` (Nunito, Protest_Riot) and `app/salesdashboard/layout.tsx` (Inter). Main switched to `@fontsource/*` packages (Phase 1.5) so build is fully offline and no runtime request goes to `fonts.googleapis.com`. This is a Phase D port — track it separately. The `public/fonts/` directory is already staged (untracked in git) from an earlier attempt; leave in place.

### 13.10 Shared-models contract

See decision §9.2. Write `docs/SHARED_MODELS_CONTRACT.md` in **both** repos. Every collection in the shared Mongo must list:
- Which repo owns the schema (source of truth).
- Every field, type, whether it's `select: false`, whether it's indexed.
- Whether a field is written by both apps or just one.

Drift here = data-corruption outage. Until the shared package exists, reviews must compare both repos' models on any PR touching `lib/models/*`.

### 13.11 Operator pre-deploy checklist

Before cutover to `placement.ngen.school`:

- [ ] §13.1 `npm install` clean, no peer-dep warnings, `package-lock.json` committed.
- [ ] §13.2 All three secrets rotated and applied to both environments.
- [ ] §13.3 Per-subdomain `NEXTAUTH_URL` / `NEXT_PUBLIC_APP_URL` verified.
- [ ] §13.4 Google OAuth redirect URI added for the new subdomain.
- [ ] §13.5 No `Domain=.ngen.school` on any Set-Cookie.
- [ ] §13.6 Smoke test: guest takes exam end-to-end, result appears in Firebase sales collection AND in `placementtests` Mongo collection.
- [ ] §13.6 CSP violations in browser console: zero.
- [ ] §13.7 `/api/health` + `/api/ready` return 200 once ported.
- [ ] §13.8 Mongo replica set confirmed (unblocks Phase 3.6 port).
- [ ] §13.9 Fonts self-hosted OR accepted risk of googleapis.com runtime dependency.
- [ ] §13.10 `SHARED_MODELS_CONTRACT.md` written + signed off.
- [ ] Cross-app smoke test (sibling guest → main signin → results reconciled).

If any item is unchecked, **do not cut over**. The sibling shares the prod DB; a bad deploy corrupts the main app's users.
