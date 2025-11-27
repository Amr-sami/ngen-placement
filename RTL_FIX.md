# RTL Layout Fix for Arabic Navigation

## Problem
When switching to Arabic (العربية), the navigation items were only translated but not **reordered visually** for proper RTL reading flow.

## User Requirement
In Arabic, the navigation should read naturally **right-to-left**:

**من اليمين إلى اليسار (Right to Left):**
Logo → المشاريع → الطلاب → NGen لـ → عن NGen → لماذا NGen → المسارات → الأسعار → المدونة → العربية|English → اتصل بنا

This means the items need to be in **reverse DOM order** in Arabic!

## Solution Applied

### 1. Added `dir` attribute to nav element
```tsx
<nav dir={locale === 'ar' ? 'rtl' : 'ltr'}>
```

### 2. Created navigation items array
```tsx
const navItems = [
  { type: 'section', key: 'projects', label: t('projects'), ... },
  { type: 'section', key: 'students', label: t('students'), ... },
  { type: 'dropdown', key: 'ngenFor', label: t('ngenFor') },
  { type: 'route', key: 'aboutUs', label: t('aboutUs'), ... },
  { type: 'section', key: 'whyNgen', label: t('whyNgen'), ... },
  { type: 'route', key: 'tracks', label: t('tracks'), ... },
  { type: 'section', key: 'pricing', label: t('pricing'), ... },
  { type: 'route', key: 'blog', label: t('blog'), ... },
];
```

### 3. Reverse array for Arabic
```tsx
const displayItems = locale === 'ar' ? [...navItems].reverse() : navItems;
```

### 4. Render dynamically
Desktop and mobile navigation now render from the `displayItems` array using `.map()`.

### 5. Fixed mobile drawer side
```tsx
<SheetContent side={locale === 'ar' ? 'left' : 'right'}>
```

## Result

### English (LTR) - Reading Left to Right:
```
Logo → Projects → Students → NGen For → About Us → Why NGen → Tracks → Pricing → Blog → EN|AR → Contact
```

### Arabic (RTL) - Reading Right to Left:
```
Logo → Blog → Pricing → Tracks → Why NGen → About Us → NGen For → Students → Projects → AR|EN → Contact
```

**When you read RIGHT-TO-LEFT in Arabic, you naturally read:**
Logo → Projects → Students → NGen For → About Us → Why NGen → Tracks → Pricing → Blog → AR|EN → Contact

## Testing
1. Visit `http://localhost:3000/en`
   - Logo on left ✓
   - Nav items in center ✓
   - Language switcher & Contact on right ✓

2. Switch to Arabic (`http://localhost:3000/ar`)
   - Logo on right ✓
   - Nav items in center (reading right-to-left) ✓
   - Language switcher & Contact on left ✓

3. Mobile menu in Arabic
   - Drawer slides from left ✓
   - Submenu indents from right ✓

## Files Changed
- `/components/layout/Navbar/index.tsx`

## Tailwind RTL Utilities Used
- `ltr:` - Applied only in left-to-right layout
- `rtl:` - Applied only in right-to-left layout
- `order-{n}` - Controls flex item ordering

---

**Status:** ✅ Fixed
**Date:** November 27, 2025

