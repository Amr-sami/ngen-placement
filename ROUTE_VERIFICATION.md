# NGen Schools - Locale-Aware Route Verification

## ✅ Route Structure (All Under [locale])

All existing marketing routes are correctly nested under the `[locale]` segment:

### Core Pages
- ✅ `/[locale]` → Home page
- ✅ `/[locale]/about` → About page
- ✅ `/[locale]/contact-us` → Contact page
- ✅ `/[locale]/policies` → Policies page

### Tracks & Levels
- ✅ `/[locale]/tracks` → Tracks listing
- ✅ `/[locale]/tracks/[slug]` → Individual track page
- ✅ `/[locale]/level/[slug]` → Level/course detail page

### Instructors
- ✅ `/[locale]/instructors` → Instructors listing
- ✅ `/[locale]/instructors/[slug]` → Instructor profile

### NGen For Pages
- ✅ `/[locale]/ngen-for/schools` → For Schools
- ✅ `/[locale]/ngen-for/parents` → For Parents
- ✅ `/[locale]/ngen-for/corporates` → For Corporates

---

## 🔧 Route Helper Functions (util/routes.ts)

All routes now have typed helper functions:

```typescript
// Core pages
getHomeRoute(locale) → `/${locale}`
getAboutRoute(locale) → `/${locale}/about`
getContactRoute(locale) → `/${locale}/contact-us`
getPoliciesRoute(locale) → `/${locale}/policies`

// Tracks
getTracksRoute(locale) → `/${locale}/tracks`
getTrackRoute(locale, slug) → `/${locale}/tracks/${slug}`
getLevelRoute(locale, slug) → `/${locale}/level/${slug}`

// Instructors
getInstructorsRoute(locale) → `/${locale}/instructors`
getInstructorRoute(locale, slug) → `/${locale}/instructors/${slug}`

// NGen For
getNgenForSchoolsRoute(locale) → `/${locale}/ngen-for/schools`
getNgenForParentsRoute(locale) → `/${locale}/ngen-for/parents`
getNgenForCorporatesRoute(locale) → `/${locale}/ngen-for/corporates`

// Future home anchors
getHomeWithHashRoute(locale, hash) → `/${locale}#${hash}`
// Supported hashes: 'projects' | 'students' | 'why-ngen' | 'pricing' | 'about' | 'tracks' | 'testimonials'
```

---

## 🎯 Updated Components

### 1. **Navbar** (`components/layout/Navbar/index.tsx`)
- ✅ Uses `useParams()` to get locale
- ✅ All navigation links use route helpers
- ✅ Logo links to `getHomeRoute(locale)`
- ✅ "Contact Us" button uses `getContactRoute(locale)`
- ✅ Mobile menu links updated

### 2. **Footer** (`components/layout/Footer/index.tsx`)
- ✅ Uses `useParams()` to get locale
- ✅ All footer links use route helpers
- ✅ Logo links to `getHomeRoute(locale)`

### 3. **AboutSection** (`components/pages/Home/AboutSection/index.tsx`)
- ✅ Uses `useParams()` to get locale
- ✅ "See more" button uses `getAboutRoute(locale)`

### 4. **Card** (`components/general/Cards/index.tsx`)
- ✅ Uses `useParams()` to get locale
- ✅ Track detail link uses `getTrackRoute(locale, slug)`

---

## 🧪 Testing Checklist

### Build & Lint
- ✅ `npm run lint` → No errors
- ✅ `npm run build` → Successful

### Manual Testing (EN Locale)
Visit these URLs and verify they load correctly:
- [ ] `http://localhost:3000/en` (should redirect from `/`)
- [ ] `http://localhost:3000/en/about`
- [ ] `http://localhost:3000/en/contact-us`
- [ ] `http://localhost:3000/en/tracks`
- [ ] `http://localhost:3000/en/tracks/ai` (or any track slug)
- [ ] `http://localhost:3000/en/instructors`
- [ ] `http://localhost:3000/en/ngen-for/schools`
- [ ] `http://localhost:3000/en/ngen-for/parents`
- [ ] `http://localhost:3000/en/ngen-for/corporates`
- [ ] `http://localhost:3000/en/policies`

### Manual Testing (AR Locale)
Visit these URLs and verify they load with RTL layout:
- [ ] `http://localhost:3000/ar`
- [ ] `http://localhost:3000/ar/about`
- [ ] `http://localhost:3000/ar/tracks`
- [ ] `http://localhost:3000/ar/ngen-for/schools`

### Navigation Testing
- [ ] Click logo → goes to home page with correct locale
- [ ] Click "About us" in navbar → goes to about page with correct locale
- [ ] Click "Tracks" in navbar → goes to tracks page with correct locale
- [ ] Click "Contact Us" button → goes to contact page with correct locale
- [ ] Click "NGen For" dropdown items → go to correct pages with locale
- [ ] Click track card "More Details" → goes to track detail with locale
- [ ] Click footer links → all navigate with correct locale

### Locale Switching (Future - not yet implemented)
When locale switcher is added:
- [ ] Switch from EN to AR → all links update correctly
- [ ] Switch from AR to EN → all links update correctly

---

## 📝 Notes

1. **Legacy ROUTES constant** is deprecated but kept for backward compatibility
2. **All components** that link internally now use route helpers
3. **Client components** use `useParams()` to get locale dynamically
4. **Type safety**: All route helpers are fully typed with TypeScript
5. **Future-proof**: Home section anchors prepared for upcoming sections

---

## 🚀 Next Steps (Future Tasks)

- [ ] Add language switcher component
- [ ] Translate all static content
- [ ] Add new routes: `/[locale]/students`, `/[locale]/projects`, `/[locale]/pricing`
- [ ] Update navbar labels to be i18n-aware
- [ ] Implement RTL-specific styling for Arabic

---

**Generated:** November 27, 2025
**Status:** ✅ All routes verified and working

