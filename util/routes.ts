import type { Locale } from '@/i18n';

/**
 * Locale-aware route helpers for NGen Schools
 * All routes accept a locale parameter to generate locale-prefixed URLs
 */

// ============================================
// EXISTING ROUTES (Locale-Aware)
// ============================================

/**
 * Home page route
 */
export const getHomeRoute = (locale: Locale): string => {
  return `/${locale}`;
};

/**
 * About page route
 */
export const getAboutRoute = (locale: Locale): string => {
  return `/${locale}/about`;
};

/**
 * Contact Us page route
 */
export const getContactRoute = (locale: Locale): string => {
  return `/${locale}/contact-us`;
};

/**
 * Tracks listing page route
 */
export const getTracksRoute = (locale: Locale): string => {
  return `/${locale}/tracks`;
};

/**
 * Individual track detail page route
 */
export const getTrackRoute = (locale: Locale, slug: string): string => {
  return `/${locale}/tracks/${slug}`;
};

/**
 * Level/Course detail page route
 */
export const getLevelRoute = (locale: Locale, slug: string): string => {
  return `/${locale}/level/${slug}`;
};

/**
 * Instructors listing page route
 */
export const getInstructorsRoute = (locale: Locale): string => {
  return `/${locale}/instructors`;
};

/**
 * Individual instructor detail page route
 */
export const getInstructorRoute = (locale: Locale, slug: string): string => {
  return `/${locale}/instructors/${slug}`;
};

/**
 * NGen For Schools page route
 */
export const getNgenForSchoolsRoute = (locale: Locale): string => {
  return `/${locale}/ngen-for/schools`;
};

/**
 * NGen For Parents page route
 */
export const getNgenForParentsRoute = (locale: Locale): string => {
  return `/${locale}/ngen-for/parents`;
};

/**
 * NGen For Corporates page route
 */
export const getNgenForCorporatesRoute = (locale: Locale): string => {
  return `/${locale}/ngen-for/corporates`;
};

/**
 * Policies page route
 */
export const getPoliciesRoute = (locale: Locale): string => {
  return `/${locale}/policies`;
};

/**
 * Projects page route
 */
export const getProjectsRoute = (locale: Locale): string => {
  return `/${locale}/projects`;
};

/**
 * Students page route
 */
export const getStudentsRoute = (locale: Locale): string => {
  return `/${locale}/students`;
};

/**
 * Blog page route
 */
export const getBlogRoute = (locale: Locale): string => {
  return `/${locale}/blog`;
};

// ============================================
// AUTH ROUTES (Locale-Aware)
// ============================================

/**
 * Login page route
 */
export const getLoginRoute = (locale: Locale): string => {
  return `/${locale}/auth/login`;
};

/**
 * Signup page route
 */
export const getSignupRoute = (locale: Locale): string => {
  return `/${locale}/auth/signup`;
};

/**
 * Forget password page route
 */
export const getForgetPasswordRoute = (locale: Locale): string => {
  return `/${locale}/auth/forget-password`;
};

/**
 * Verify email page route
 */
export const getVerifyEmailRoute = (locale: Locale, email?: string): string => {
  const base = `/${locale}/auth/verify-email`;
  return email ? `${base}?email=${encodeURIComponent(email)}` : base;
};

/**
 * OTP verification page route
 */
export const getOTPRoute = (locale: Locale, email?: string): string => {
  const base = `/${locale}/auth/otp`;
  return email ? `${base}?email=${encodeURIComponent(email)}` : base;
};

// ============================================
// FUTURE HOME SECTION ANCHORS
// ============================================

/**
 * Valid home section anchor IDs (for future implementation)
 */
export type HomeSectionHash = 
  | 'projects'
  | 'students'
  | 'why-ngen'
  | 'pricing'
  | 'about'
  | 'tracks'
  | 'testimonials';

/**
 * Home page route with section anchor
 * Usage: getHomeWithHashRoute('en', 'projects') → '/en#projects'
 */
export const getHomeWithHashRoute = (
  locale: Locale,
  hash: HomeSectionHash
): string => {
  return `/${locale}#${hash}`;
};

// ============================================
// LEGACY CONSTANTS (Deprecated - use functions above)
// ============================================

/**
 * @deprecated Use locale-aware route functions instead (e.g., getAboutRoute(locale))
 * Kept for backward compatibility during migration
 */
export const ROUTES = {
  ABOUT: "/about",
  NGEN_FOR: {
    FOR_SCHOOL: "/ngen-for/schools",
    FOR_CORPORATES: "/ngen-for/corporates",
    FOR_PARENTS: "/ngen-for/parents",
  },
  POLICIES: "/policies",
  TRACKS: "/tracks",
  INSTRUCTORS: "/instructors",
  CONTACT_US: "/contact-us",
};
