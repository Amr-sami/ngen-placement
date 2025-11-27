# Changelog

All notable changes to the NGen Schools project are documented in this file.

---

## [Unreleased] - 2024-11-27

### Added
- **Full Internationalization (i18n) Support** - English (EN) and Arabic (AR)
  - Integrated `next-intl` library for App Router i18n
  - Locale-based routing: `/en` and `/ar` URL patterns for all pages
  - Middleware for automatic locale detection and redirection (root `/` → `/en`)
  - Central i18n configuration (`i18n.ts`) defining locales, directions (LTR/RTL), and locale names
  - Translation message files: `messages/en.json` and `messages/ar.json`
  - Proper `lang` and `dir` attributes on `<html>` element (e.g., `lang="ar" dir="rtl"`)
  - Request configuration for `next-intl` (`app/[locale]/request.ts`)

- **Locale-Aware Routing System** - `util/routes.ts`
  - Comprehensive typed route helpers for all existing and new pages
  - Functions like `getHomeRoute(locale)`, `getAboutRoute(locale)`, `getTracksRoute(locale)`
  - Support for home section anchors: `getHomeWithHashRoute(locale, hash)`
  - Valid section hashes: `projects`, `students`, `why-ngen`, `pricing`, `about`, `tracks`, `testimonials`

- **New Home Page Sections**
  - **Projects Section** (`components/pages/Home/ProjectsSection/`) - Showcase of student projects with "See More Projects" button
  - **Students Section** (`components/pages/Home/StudentsSection/`) - Student profiles/achievements with "See More Students" button
  - **Pricing Section** (`components/pages/Home/PricingSection/`) - Pricing tiers and plans
  - All sections are fully i18n-ready with translation keys

- **New Pages**
  - `/[locale]/projects` - Dedicated page for student projects showcase
  - `/[locale]/students` - Dedicated page for student profiles and achievements
  - `/[locale]/blog` - Blog/news page for NGen Schools updates
  - All pages include proper metadata generation and i18n support

- **Language Switcher Component** (`components/layout/LanguageSwitcher/`)
  - Visual toggle between English and Arabic
  - Preserves current page path and URL hash when switching languages
  - Clear active state highlighting
  - Works in both desktop and mobile navigation

### Changed
- **App Router Structure** - Migrated to locale-aware architecture
  - Moved `app/(marketing)/` to `app/[locale]/(marketing)/`
  - Split root layout: `app/[locale]/layout.tsx` handles i18n, fonts, analytics
  - Marketing layout (`app/[locale]/(marketing)/layout.tsx`) simplified to render Navbar, children, Footer
  - Preserved all existing route behavior, now with `/[locale]` prefix

- **Navigation Bar** (`components/layout/Navbar/index.tsx`) - Complete rewrite
  - **New navigation order:**
    - Desktop & Mobile: Projects → Students → NGen For (dropdown) → About Us → Why NGen → Tracks → Pricing → Blog → Language Switcher → Contact
  - **Smart navigation behavior:**
    - On home page: Smooth scroll to sections (Projects, Students, Why NGen, Pricing)
    - On other pages: Navigate to home with hash anchor
  - **RTL (Right-to-Left) Support:**
    - Navigation items reverse their DOM order in Arabic for natural RTL flow
    - Mobile drawer opens from left in Arabic, right in English
    - Proper padding and indentation mirroring with Tailwind RTL utilities
  - **Fully i18n-ready:** All nav labels from translation messages
  - Dynamic rendering from `navItems` array for maintainability

- **Footer** (`components/layout/Footer/index.tsx`)
  - Converted to client component
  - Updated all links to use locale-aware route helpers

- **Component Updates for i18n**
  - `AboutSection`: Updated button to use `getAboutRoute(locale)`
  - `Cards/index.tsx`: Updated track card links to use `getTrackRoute(locale, slug)`
  - `TracksSection`: Updated import path to reflect new locale-aware structure

- **"Added value by choosing NGENschools" Section** - Renamed to "Why NGen"
  - Component: `components/pages/Home/NgenWhySection/`
  - Updated section ID to `id="why-ngen"`
  - Uses i18n translation key `home.sections.whyNgen`

- **Home Page Order** (`app/[locale]/(marketing)/page.tsx`)
  - New section sequence: Hero → Banner → Projects → Students → About → Tracks → Why NGen → Pricing → Social Proof → NGen For → Roadmap → Call to Action

- **Arabic Translations** (`messages/ar.json`)
  - "NGen" transliterated to "إنچن" throughout Arabic content
  - Proper RTL-friendly text for all UI elements

### Fixed
- **Hydration Errors** - Resolved React hydration mismatches
  - Added explicit `<head>` tag in root layout
  - Moved analytics scripts (`Google Analytics`, `Google Tag Manager`) to use `next/script` with `strategy="afterInteractive"`
  - Ensured consistent HTML structure between server and client rendering

- **Build Errors** - Fixed all TypeScript and module resolution issues
  - Updated `data.json` import paths to reflect new locale-aware structure
  - Corrected `next-intl` request configuration to explicitly return `locale` property
  - Fixed `params` type handling for Next.js 15 (params as Promise)
  - Removed `prefer-const` ESLint violations

- **RTL Layout Issues**
  - Fixed navbar not mirroring properly in Arabic
  - Corrected navigation items ordering for natural right-to-left reading
  - Fixed mobile drawer side (left in AR, right in EN)
  - Fixed mobile submenu padding with `ltr:pl-4 rtl:pr-4`

### Dependencies
- Added `next-intl` for internationalization support

### Security
- ⚠️ **Note:** Existing hardcoded API key in `lib/resend.ts` still needs to be moved to environment variables (pre-existing issue)

---

## [Current Production] - 2024-11-27

### Project Details
- **Next.js:** 15.0.3
- **React:** 19 RC
- **TypeScript:** 5
- **Tailwind CSS:** 3.4.1

### Existing Features
- ContactModal component for contact forms
- TrackHeader component for track pages
- TikTok social media icon
- Track data with expanded content
- Enhanced track pages with new layout
- Updated marketing pages (corporates, parents, schools)
- NgenWhySection, NgenRoadmapSection components
- ContactUs and CallToAction components

---

**Format:** Based on [Keep a Changelog](https://keepachangelog.com/)
**Maintained by:** Development Team

