# Admin Dashboard Analysis Report

> **Generated on:** 2026-01-02  
> **Analyst:** Automated Code Review  
> **Status:** ✅ FIXES APPLIED

---

## ✅ Summary

The admin dashboard was **well-structured** but had several gaps. **The critical issues have now been fixed:**

| Issue | Status |
|-------|--------|
| Transaction visibility | ✅ **FIXED** - Order detail page with transactions |
| Order status management | ✅ **FIXED** - Status changer added |
| Create Track | ✅ **FIXED** - CreateTrackModal added |
| Delete Track | ✅ **FIXED** - Delete button + action added |

---

## 📊 Coverage Matrix

| Database Entity | Viewable | Editable | Deletable | Notes |
|-----------------|:--------:|:--------:|:---------:|-------|
| **User** | ✅ | ✅ | ✅ | Full CRUD via UsersTable, UserDetailCard |
| **Track** | ✅ | ⚠️ Partial | ❌ | Can toggle active, but no edit name/delete |
| **Belt** | ✅ | ⚠️ Prices only | ❌ | No edit name/order in UI, no delete |
| **Order** | ✅ | ❌ | ❌ | View only, no status override in UI |
| **Transaction** | ❌ | ❌ | ❌ | **Not shown anywhere in admin** |
| **PlacementTest** | ✅ | ❌ | ❌ | View only, which is appropriate |
| **PricingConfig** | ✅ | ✅ | ❌ | Edit works, no delete (appropriate) |
| **PasswordResetToken** | N/A | N/A | N/A | Auto-managed via TTL (correct) |
| **VerificationToken** | N/A | N/A | N/A | Auto-managed via TTL (correct) |

---

## 🔴 Critical Issues

### 1. **Transaction data is NOT visible in admin**

**Problem:** The `Transaction` model stores important payment records from Paymob webhooks, but there's no way to view them in the admin dashboard.

**Location:** `operationsActions.ts` has `getOrderDetails()` that fetches transactions, but there's no order detail page that uses it.

**Impact:** Admins cannot investigate payment issues or see transaction history.

**Fix Required:**
- Create an Order Detail Page (`/admin/orders/[orderId]/page.tsx`)
- Display transaction history for each order
- Show raw Paymob response data for debugging

---

### 2. **Order status cannot be changed from admin UI**

**Problem:** `operationsActions.ts` has `updateOrderStatus()` function, but the `OrdersTable` component doesn't expose any way to call it.

**Impact:** If an order gets stuck in 'pending' or needs manual intervention, admins cannot fix it.

**Fix Required:**
- Add a dropdown or button in OrdersTable to change order status
- Add confirmation modal for status changes

---

### 3. **No way to delete a Track from admin**

**Problem:** `curriculumActions.ts` doesn't have a `deleteTrack` function. Once a track is created, it cannot be deleted, only deactivated.

**Impact:** Test/wrong tracks accumulate in the database.

**Fix Needed:**
- Add `deleteTrack()` server action (with check for existing belts/orders)
- Add delete button in TrackCard (with confirmation)

---

## 🟡 Moderate Issues

### 4. **Belt editing is very limited**

**Problem:** 
- `TrackCard.tsx` shows belts but has no edit functionality
- Belt prices can only be edited from the Pricing page, not Curriculum page
- No way to edit belt name, description, minScoreToStart in admin UI

**Impact:** Minor inconvenience - belts can only be fully modified by direct DB access or seed script.

**Partial Fix Exists:** `curriculumActions.ts` has `updateBelt()`, `updateBeltOrder()`, `updateBeltMinScore()` functions but they're not connected to the UI.

---

### 5. **No "Create New Track" button**

**Problem:** `createTrack()` action exists in `curriculumActions.ts` but there's no UI to create a new track.

**Impact:** New tracks can only be added via seed script.

**Fix Required:**
- Add "Create Track" button in Curriculum page header
- Create a modal/form for track creation

---

### 6. **No "Create New Belt" button**

**Problem:** `createBelt()` action exists but there's no UI to create a new belt.

**Impact:** Minor - belts are typically seeded, but flexible admin would be nice.

---

### 7. **Arabic locale not supported in admin navigation**

**Problem:** `AdminSidebar.tsx` hardcodes `/en/admin/...` for all links.

**Impact:** Admin works, but URLs will always show `/en/` regardless of user locale preference.

**Fix:** Use dynamic locale from pathname or params.

---

## 🟢 Working Correctly

### Users Management ✅
- List users with pagination, search, filter by status
- View user details (profile, progress, placement test info)
- Quick actions (suspend, activate, delete)
- Grant extra placement test attempts
- Reset user password
- User status badges

### Dashboard Overview ✅
- Total/active/pending users count
- Orders and revenue statistics
- Placement test completion stats
- Recent activity feed (users, orders, tests)

### Pricing Management ✅
- View/edit belt base prices (updates all tracks at once - good!)
- View/edit package discount percentages
- Toggle pricing configs active/inactive
- Changes revalidate public pricing pages

### Curriculum View ✅
- List all tracks with their belts
- Show belt details (order, code, level, min score, price)
- Toggle track active status
- Expandable/collapsible track cards

### Placement Tests ✅
- List all tests with pagination
- Filter by status
- View score, result belt, attempt number
- Link to user detail page
- Statistics (total, completed, avg score, completion rate)

### Orders ✅
- List orders with pagination
- Search by customer email/name/transaction ID
- Filter by status
- View product, amount, date

### Settings ✅
- View admin account info
- Change admin password
- System information display
- Quick link to public site

### Security ✅
- `requireSuperAdmin()` guards all admin pages and actions
- Admin pages have `robots: noindex, nofollow`
- Non-admins redirected to 404 (obscurity)
- Password changes require current password

---

## 📋 Recommended Fixes (Priority Order)

### High Priority

1. **Add Order Detail Page with Transactions**
   - Create `/admin/orders/[orderId]/page.tsx`
   - Use existing `getOrderDetails()` action
   - Show all transaction attempts for the order

2. **Add Order Status Change UI**
   - Add dropdown in OrdersTable or Order Detail page
   - Call existing `updateOrderStatus()` action

3. **Add Create Track functionality**
   - Add button in Curriculum page header
   - Create modal with form for track details

### Medium Priority

4. **Add Track Delete functionality**
   - Create `deleteTrack()` action
   - Add delete button with confirmation

5. **Add Belt Editing UI**
   - Add edit button per belt row in TrackCard
   - Create modal to edit name/description/minScore

6. **Fix locale hardcoding in AdminSidebar**
   - Extract locale from pathname
   - Use dynamic links

### Low Priority

7. **Add Create Belt functionality**
   - Add button in TrackCard
   - Modal with belt creation form

8. **Improve Transaction visibility**
   - Consider adding a dedicated Transactions page
   - Export transactions to CSV for accounting

---

## 🔧 Code Quality Notes

1. **Good: Server Actions are properly secured** - All actions call `requireSuperAdmin()`

2. **Good: Path revalidation is comprehensive** - Changes trigger `revalidatePath()` for affected pages

3. **Good: Pagination is consistent** - All list pages use same pagination pattern

4. **Issue: Some actions return but UI doesn't show toast** - Consider adding toast notifications for success/failure

5. **Issue: Error handling varies** - Some actions throw errors, some silently fail. Standardize error handling.

---

## 📁 Files That Need Changes

| File | Change Type | Description |
|------|-------------|-------------|
| `app/[locale]/admin/orders/[orderId]/page.tsx` | **CREATE** | Order detail page |
| `components/admin/orders/OrderDetail.tsx` | **CREATE** | Order detail component with transactions |
| `components/admin/orders/OrderStatusChanger.tsx` | **CREATE** | Dropdown to change order status |
| `components/admin/orders/OrdersTable.tsx` | MODIFY | Add link to order detail page |
| `lib/actions/admin/curriculumActions.ts` | MODIFY | Add `deleteTrack()` function |
| `components/admin/curriculum/TrackCard.tsx` | MODIFY | Add delete button, edit belt functionality |
| `app/[locale]/admin/curriculum/page.tsx` | MODIFY | Add "Create Track" button + modal |
| `components/admin/AdminSidebar.tsx` | MODIFY | Dynamic locale support |

---

## ✅ Conclusion

The admin dashboard is **75-80% complete**. The core viewing and basic management functionality works well. The main gaps are:

1. **Transaction visibility** (critical for payment debugging)
2. **Order status management** (needed for edge cases)
3. **Full CRUD for Tracks/Belts** (nice to have for flexibility)

The fixes above would bring the admin to 95%+ coverage of all database entities and administrative needs.
