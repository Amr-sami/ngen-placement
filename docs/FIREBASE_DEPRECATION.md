# Firebase: audit & deprecation path

## What exists today

### `lib/firebase.ts`
Initializes a Firebase app from `NEXT_PUBLIC_FIREBASE_*` env vars and exposes a Firestore handle. Config values ship to the browser — consistent with Firebase's client-SDK design but means the Firestore security rules are the only real gate.

### `lib/firebase-service.ts`
Two functions over one Firestore collection, `placement_results`:
- `savePlacementResultToFirebase(data)` — adds a doc. Wrapped in a 5s timeout Promise.race. Failures are swallowed and returned as `{ success: false }`.
- `getPlacementResultsFromFirebase()` — reads all docs ordered by timestamp.

No pagination, no filtering, no index hints. A production dataset would blow past client quotas quickly.

### Who writes

Placement results are DUAL-WRITTEN: every submission lands in both Mongo (`placementtests`) and Firestore (`placement_results`).

- `app/api/placement-test/submit/route.ts:237` — technical test submission.
- `app/api/soft-skills/submit/route.ts:108` — soft-skills submission.

Mongo is the primary write; Firebase is fire-and-forget (not awaited meaningfully, errors logged).

### Who reads

- `app/api/sales/results/route.ts` — reads BOTH stores, concatenates, sorts, dedupes by `(email, score, timestamp within 60s)`. Firebase failures degrade gracefully to Mongo-only.
- `app/salesdashboard/page.tsx` — consumes the merged `/api/sales/results` payload. The page never talks to Firebase directly at runtime; it only imports the `PlacementResult` type from `firebase-service`.
- `app/[locale]/admin/evaluations/page.tsx` and `lib/actions/admin/firebaseActions.ts` — admin evaluation pipeline reads Firebase submissions and evaluates. Admin gate is now enforced server-side (`assertAdmin()`).

## Risks with the current setup

1. **Split-brain**: Firebase write failure = row in Mongo but not in Firebase. Dedup in the sales API hides this, but any consumer that reads only Firebase (the admin evaluations flow does) sees a partial dataset.
2. **No schema guarantees on Firebase side**: `placement_results` is Mixed-typed — field presence is whatever the writer happened to pass. Over time this drifts.
3. **Unbounded read**: `getPlacementResultsFromFirebase()` fetches all docs. Sales API wraps it with its own 200-row cap, but admin evaluations doesn't.
4. **Client-SDK only**: there is no Firebase Admin SDK usage. All queries happen with browser credentials even on the server. If the client config becomes compromised, Firestore rules are the only defense.
5. **BYO auth**: Firestore access is not bound to the NextAuth session. Anyone with the public config + rules-allowed read can hit Firebase directly without going through `/api/sales/*`.

## Decision: MongoDB is source of truth

Reasons:
- MongoDB has the relational context (`userId`, `trackId`, `testId` for server-authoritative scoring).
- MongoDB schemas are enforced by Mongoose and shared with the main repo via the contract in `SHARED_MODELS_CONTRACT.md`.
- MongoDB queries are scoped by our NextAuth session on every route.
- Firebase provides no feature that Mongo doesn't already cover.

## Deprecation path

Do not remove Firebase in a single release. Stagger:

**Phase 1 — stop writing** (next sprint)
- Delete `savePlacementResultToFirebase()` calls in `app/api/placement-test/submit/route.ts` and `app/api/soft-skills/submit/route.ts`.
- Keep read paths temporarily so historical rows stay visible in the sales dashboard.

**Phase 2 — migrate historical data**
- One-shot script under `scripts/` that reads all `placement_results` docs and upserts any missing rows into Mongo `placementtests` with a synthetic `legacySource: 'firebase'` marker.
- Run once; verify row counts; archive the script.

**Phase 3 — stop reading**
- Remove `getPlacementResultsFromFirebase()` call from `app/api/sales/results/route.ts`.
- Switch `app/[locale]/admin/evaluations/page.tsx` + `lib/actions/admin/firebaseActions.ts` to read Mongo.
- Delete `lib/firebase.ts`, `lib/firebase-service.ts`.
- Remove the `firebase` / `firebase-admin` packages from `package.json`.

**Phase 4 — Firestore cleanup**
- Export the `placement_results` collection to cold storage.
- Revoke the Firebase project credentials.
- Drop `NEXT_PUBLIC_FIREBASE_*` env vars from runtime config and deployment templates.

## Do not do before Phase 1

- Do not add new write paths to Firebase.
- Do not add new read paths that query Firebase directly from a client component.
- Do not expose Firestore to any non-admin UI.
