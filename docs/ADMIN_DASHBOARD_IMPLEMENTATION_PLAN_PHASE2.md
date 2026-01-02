# Admin Dashboard Implementation Plan - Phase 2: Shared Curriculum & Belt Redesign

## 🎯 Objective
Redesign the database schema and application logic to implement a **Shared Belt System**. This eliminates the duplication of belts across tracks, aligning with the business logic where "Foundation" belts (Yellow, Orange, Green) are identical across all tracks, and "Specialization" belts share names/prices but are taken within the context of a specific track.

## 🏗️ 1. Database Schema Redesign

### Current State (To Be Changed)
*   **Belt**: Has `trackId`. Results in 60 belts (10 belts * 6 tracks).
*   **Track**: Logic implies belts belong to it via `Belt.trackId`.

### New Proposed State

#### 1. `Belt` Model
*   **Remove**: `trackId` (Belts are no longer owned by a single track).
*   **Scope**: Global definitions (e.g., "White Belt", "Yellow Belt").
*   **Total Records**: Only ~10 records will exist in the `belts` collection.
*   **Fields**:
    *   `name` (Localized)
    *   `code` (Unique: 'white', 'yellow', etc.)
    *   `packageLevel` ('foundation', 'specialization', etc.)
    *   `basePrice`
    *   `minScoreToStart`
    *   `salesEnabled` (Boolean - for toggling availability)

#### 2. `Track` Model
*   **Add**: `belts` field (Array of ObjectIds referencing `Belt`).
    *   *Note*: Since the structure is rigid (White -> Yellow -> ... -> Master), we might not even need an explicit array if every track has every belt.
    *   *Decision*: Keep it flexible. `belts: [{ type: Schema.Types.ObjectId, ref: 'Belt' }]`.

#### 3. `UserProgress` (Schema Update)
*   Ensure progress is tracked by `trackId` AND `beltId`/`beltCode`.
*   *Current*: `progress: { currentTrackName: string, currentBeltName: string, ... }`.
*   *Update*: Explicitly store `currentTrackId` and `currentBeltId`.

## 🛠️ 2. Migration Validations

### A. Seed Script Update
*   Modify `scripts/seed.ts` to create belts **ONCE** (not inside the track loop).
*   Assign these global belts to tracks if we use the reference array.

### B. Data Migration (If Production Data Exists)
*   *Note*: Since we are still in dev/testing (based on seed usage), a "flush and re-seed" is strictly recommended. Validating migration for existing user data would be complex (mapping 60 belts -> 10 belts).

## 💻 3. UI/UX Updates

### A. Admin Dashboard > Curriculum
*   **Global Belt Management**: New tab or section to "Manage Global Belts".
    *   Edit Name/Price/MinScore here ONCE.
    *   Updates apply everywhere.
*   **Track Management**:
    *   remove "Add/Edit Belt" from inside the Track Card.
    *   Show "Associated Belts" (Read-only list or toggle list).

### B. Admin Dashboard > Pricing
*   Simpler logic: No need to "update all belts with same code". Just update the one belt record.

### C. Placement Test & Profile
*   **User Flow**:
    *   User takes test.
    *   If score leads to **Foundation** (Yellow/Orange/Green):
        *   User is effectively in "General" track (or no track).
    *   If score leads to **Specialization** (Blue+):
        *   User is asked to **Choose a Specialization** (Track).
        *   System saves `specializationTrackId` in user profile.

## 📝 Implementation Steps

1.  **Backup**: Export current data if needed.
2.  **Schema Update**: Modify `lib/models/Belt.ts` and `Track.ts`.
3.  **Seed Script**: Rewrite `scripts/seed.ts` for the new structure.
4.  **Backend Services**:
    *   Update `pricingService.ts` (simplify fetching).
    *   Update `curriculumActions.ts` (CRUD on global belts).
5.  **Admin UI**: Refactor `TrackCard.tsx` and create `GlobalBeltList.tsx`.
6.  **Testing**: Verify "Edit Belt" changes price globally instantly.

## 🕒 Estimated Timeline
*   Schema & Seed: 2-3 hours
*   Backend Service Updates: 2 hours
*   Admin UI Refactor: 3-4 hours
*   **Total**: ~1 Day
