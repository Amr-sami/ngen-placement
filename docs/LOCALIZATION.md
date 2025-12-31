# Localization & Internationalization (i18n) Guide

NGen Platform is built with a "Bilingual-First" architecture, supporting **English (en)** and **Arabic (ar)**. We use `next-intl` for the framework and a custom schema strategy for database content.

## 🏗 Storage Strategy: `LocalizedString`

Dynamic content in the database (e.g., Belt Names, Track Descriptions) is NOT duplicated in separate tables. Instead, we use a `LocalizedString` schema structure.

### Schema Definition
```typescript
interface LocalizedString {
  en: string;
  ar: string;
}
```

### Usage
When defining a Mongoose model, use this structure for any text field that needs translation:

```typescript
// Example: Belt Schema
const BeltSchema = new Schema({
  name: {
    en: { type: String, required: true },
    ar: { type: String, required: true }
  },
  description: {
    en: String,
    ar: String
  }
});
```

## 🔌 Retrieving Localized Data

### 1. Server-Side / Utility Functions
Use the `getLocalizedValue` helper from `lib/localization.ts`.

```typescript
import { getLocalizedValue } from '@/lib/localization';

// Inside an API route or server component
const beltName = getLocalizedValue(belt.name, locale); // Returns string
```

### 2. Client-Side (React Components)
Use the `useLocalizedValue` hook from `hooks/useLocalization.ts`.

```typescript
import { useLocalizedValue } from '@/hooks/useLocalization';

function BeltCard({ belt }) {
  const getLocalized = useLocalizedValue();
  
  return <h1>{getLocalized(belt.name)}</h1>;
}
```

## 🌐 Static Content (UI Text)

Static UI text (Buttons, Labels, Menus) is managed via JSON files in `messages/`.

*   `messages/en.json`
*   `messages/ar.json`

**Usage:**
```typescript
import { useTranslations } from 'next-intl';

export default function Hero() {
  const t = useTranslations('hero');
  return <h1>{t('title')}</h1>;
}
```

## ⬅️ RTL Support

*   **Direction Detection**: We use the `useRTL` hook (`hooks/useRTL.ts`) to detect if the current locale is Arabic.
*   **CSS Handling**:
    *   We use standard Tailwind logical properties (start/end) where possible, OR explicit RTL modifiers.
    *   **Example**: `className={isRTL ? 'ml-4' : 'mr-4'}` or `className="ltr:ml-4 rtl:mr-4"`.
    *   **Layouts**: The root layout applies `dir="rtl"` or `dir="ltr"` to the `<html>` tag, allowing standard browser behavior to handle most mirroring.
