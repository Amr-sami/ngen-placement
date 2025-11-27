# RTL Layout Polish Summary

## Overview
Comprehensive RTL (Right-to-Left) layout fixes for the Arabic locale across the NGen Schools application. This polish ensures all components properly mirror their layouts when switching from English (LTR) to Arabic (RTL).

---

## Changes Made

### 1. Created Reusable RTL Helpers (`lib/useRTL.ts`)

**Purpose:** Provide consistent, reusable hooks for detecting RTL direction and current locale.

```typescript
// Check if current locale is RTL
const isRTL = useRTL();

// Get current locale
const locale = useLocale();
```

**Benefits:**
- Reduces code duplication
- Makes future components easier to build
- Centralized logic for direction detection
- TypeScript-safe with proper type inference

---

### 2. Hero Section Fixes (`components/pages/Home/Hero/index.tsx`)

**Problems Fixed:**
- Social media icons stayed on the right side in Arabic (should be on left)
- "schools" text alignment didn't flip

**Solutions:**
```typescript
// Social media icons - now position-aware
<div className={`... ${isRTL ? 'lg:-left-14 left-0' : 'lg:-right-14 right-0'}`}>

// "schools" text - now margin-aware
<p className={`... ${isRTL ? 'md:mr-40' : 'md:ml-40'}`}>
```

---

### 3. About Section Fixes (`components/pages/Home/AboutSection/index.tsx`)

**Problems Fixed:**
- Image stayed on left, text on right in Arabic (should swap)
- Image flip was applied in both directions

**Solutions:**
```typescript
// Container flex direction swaps in RTL
<div className={`... ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>

// Image flip only in LTR
<Image className={isRTL ? '' : 'scale-x-[-1]'} />
```

---

### 4. Why NGen Section Fixes (`components/pages/Home/NgenWhySection/index.tsx`)

**Problems Fixed:**
- List and image didn't swap positions in RTL
- Icons appeared on wrong side of text
- Image flip applied in both directions

**Solutions:**
```typescript
// Layout swaps for RTL (note: reversed because of flex-col-reverse)
<div className={`flex-col-reverse gap-2 ${isRTL ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>

// Icon+text alignment
<h3 className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>

// Image flip only in LTR
<Image className={isRTL ? '' : 'scale-x-[-1]'} />
```

---

### 5. Feature Card Fixes (`components/general/Cards/FeatureCard.tsx`)

**Problems Fixed:**
- Image-left/image-right variants didn't respect RTL
- Text alignment was always left-aligned

**Solutions:**
```typescript
// Flip variant logic in RTL
const effectiveVariant = isRTL 
  ? (variant === "image-left" ? "image-right" : "image-left")
  : variant;

// Text alignment direction-aware
<div className={`... ${isRTL ? 'lg:text-right' : 'lg:text-left'}`}>
```

---

### 6. Track Card Fixes (`components/general/Cards/index.tsx`)

**Problems Fixed:**
- Icon+text rows stayed in LTR order in Arabic
- Duration and skill level icons on wrong side

**Solutions:**
```typescript
// Parent container reverses in RTL
<div className={`flex flex-col sm:flex-row ... ${isRTL ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}>

// Each icon+text group reverses
<div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
```

---

### 7. Call to Action Fixes (`components/general/CallToAction/index.tsx`)

**Problems Fixed:**
- Hardcoded URL didn't include locale prefix

**Solutions:**
```typescript
// Locale-aware navigation
const locale = useLocale();
router.push(`/${locale}/#contact-us`);
```

---

## Pattern Guidelines for Future Components

### 1. Always Use the RTL Helper
```typescript
import { useRTL } from '@/lib/useRTL';

function MyComponent() {
  const isRTL = useRTL();
  // Use isRTL for conditional rendering/classes
}
```

### 2. Flex Direction Patterns
```typescript
// Horizontal layouts that should mirror
<div className={isRTL ? 'flex-row-reverse' : 'flex-row'}>

// Or use Tailwind RTL utilities (for simpler cases)
<div className="flex flex-row rtl:flex-row-reverse">
```

### 3. Icon + Text Patterns
```typescript
// Icons should typically be on the end of text in both directions
<div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
  <Icon />
  <span>Text</span>
</div>
```

### 4. Text Alignment
```typescript
// Use logical alignment
className={isRTL ? 'text-right' : 'text-left'}

// Or use Tailwind RTL utilities
className="text-left rtl:text-right"
```

### 5. Spacing (Margin/Padding)
```typescript
// Prefer logical properties
className={isRTL ? 'mr-4' : 'ml-4'}  // margin-start

// Or use Tailwind RTL utilities
className="ml-4 rtl:mr-4"
```

### 6. Absolute Positioning
```typescript
// Conditional positioning
className={isRTL ? 'left-0' : 'right-0'}

// Or use Tailwind RTL utilities
className="right-0 rtl:left-0"
```

---

## Testing Checklist

### Desktop Testing
- [ ] Hero section: Social icons on correct side (right in EN, left in AR)
- [ ] Hero section: "schools" text aligned correctly
- [ ] About section: Image/text swap positions
- [ ] Why NGen section: List/image swap, icons aligned correctly
- [ ] Feature cards: Image/text layouts mirror correctly
- [ ] Track cards: Icon+text rows aligned correctly
- [ ] All flex layouts feel natural in both directions

### Mobile Testing
- [ ] All sections stack vertically correctly
- [ ] Icon+text alignment feels natural
- [ ] No awkward spacing or positioning
- [ ] Text alignment appropriate for direction

---

## Files Modified

1. **`lib/useRTL.ts`** (NEW) - RTL/locale detection hooks
2. **`components/pages/Home/Hero/index.tsx`** - Hero social icons and text alignment
3. **`components/pages/Home/AboutSection/index.tsx`** - Image/text layout swap
4. **`components/pages/Home/NgenWhySection/index.tsx`** - List/image swap and icon alignment
5. **`components/general/Cards/FeatureCard.tsx`** - Variant-aware RTL layout
6. **`components/general/Cards/index.tsx`** - Icon+text row alignment
7. **`components/general/CallToAction/index.tsx`** - Locale-aware navigation
8. **`CHANGELOG.md`** - Documented changes

---

## Benefits of This Approach

1. **Consistent Patterns** - All components use the same RTL detection logic
2. **Maintainable** - Centralized hooks make updates easy
3. **Type-Safe** - TypeScript ensures correct usage
4. **Future-Friendly** - New components can easily adopt RTL support
5. **No Hacks** - Uses proper flex direction and logical properties
6. **Minimal Bundle Impact** - Lightweight helper hooks

---

## Next Steps (If Needed)

If you encounter more RTL issues in other pages:

1. Import `useRTL` hook
2. Apply flex direction conditionals
3. Fix any absolute positioning
4. Adjust text alignment
5. Test in both EN and AR

The pattern is now established and easy to follow!

