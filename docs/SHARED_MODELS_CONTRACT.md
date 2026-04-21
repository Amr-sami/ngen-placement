# Shared Models Contract

Both `ngen-payment-test` (main) and `ngen-placement` (sibling) point at the same MongoDB database. Any schema drift between their Mongoose models translates to silent data loss, index sync conflicts, or validation errors at runtime — this document is the contract that keeps them aligned.

## Authority

| Concern | Authoritative repo | Notes |
| --- | --- | --- |
| User registration, auth, roles | main | Sibling reads users via NextAuth session; sibling does not mutate users it didn't create |
| Order / Transaction / Pricing | main | Sibling does not write to these collections |
| PlacementTest — authed writes | main | Sibling can also write in guest mode |
| PlacementTest — guest writes (leadTokenHash) | sibling | Main must tolerate rows with `userId: null` |
| Track / Belt (catalog) | main | Sibling reads only |
| BeltContent | main only | Not in sibling — sibling must never reference it |
| PasswordResetToken / VerificationToken | main | Sibling must not emit its own |

## Index sync policy

Both repos MUST call `syncIndexes()` on shared collections during boot. Currently:

- `lib/mongodb.ts` registers all shared models so `mongoose.models` is populated before any query runs.
- `instrumentation.ts` in both repos syncs `PricingConfig` and `PlacementTest` indexes and blocks readiness on success.
- Drift here surfaces as Mongo error `IndexOptionsConflict` or duplicate partial-unique failures. Fail closed — do not mark the pod ready on sync error.

## Collection-by-collection contract

### User — identical
No divergence. Same interface, schema, pre-save hooks, and indexes.

### Order — identical
Same enums (`status`, `currency`, `paymentMethod`), same sparse unique index on `paymobOrderId`.

### Transaction — identical
Same fields, same unique index on `paymobTxnId`, same `timestamps: { createdAt: true, updatedAt: false }`.

### PricingConfig — identical
Same `configType` enum, same partial-unique compound index over `(configType, packageLevel, durationMonths)` limited to active rows. Critical: only ONE active row per tuple.

### PlacementTest — schema-compatible
Fields and indexes match. Only the declaration order inside the interface differs (main groups `generatedQuestions, leadTokenHash` before `detailedEvaluation`; sibling reverses). No runtime impact.

Invariants both sides must preserve:
- `userId` is nullable (guest rows).
- `leadTokenHash` is the guest correlation key and is indexed; guest rows carry it, authed rows may or may not.
- `generatedQuestions` has `select: false` — never auto-returned on find.

### Track / Belt — identical
Same localized name schema, same pricing fields, same unique `slug` / `code`.

### PasswordResetToken / VerificationToken — identical
Same TTL `expireAfterSeconds: 0`, same compound `(email, tokenHash)`, same generation utility.

### BeltContent — main only
Sibling does not export it from `lib/models/index.ts` and does not reference it. If sibling ever needs belt content, copy the model file from main to keep schemas identical. Do NOT author a new variant.

## Change-control rules

1. Any schema edit (field add/remove, type change, enum change, index change, required flag, default value) must land in BOTH repos in the same release window.
2. When an index needs rebuilding, add it to `instrumentation.ts` in both repos.
3. Removing a field: first make it optional in both repos, deploy, backfill-drop in a separate release.
4. Adding a required field: default must be provided in the schema, or every writer (including the sibling guest path) must set it.
5. Enum tightening (removing a value) requires a data audit in both collections first.

## Known risks

- **Guest rows contaminating authed queries**: every query that should scope to a logged-in user must filter on `userId`, not just `leadTokenHash`.
- **Partial index edits**: `PricingConfig`'s active-tuple index uses a partialFilterExpression. Any change to the filter predicate requires a drop-then-create migration — `syncIndexes` alone will error.
- **BeltContent drift**: if someone ports admin belt-content features to sibling, they must also port the model. Until then, any sibling code importing `@/lib/models/BeltContent` will fail at build time.
