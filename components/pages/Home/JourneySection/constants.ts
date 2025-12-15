import { Trophy, Rocket, Star, Zap, LucideIcon } from 'lucide-react';

export type LearnItem = {
  title: string;
  description: string;
  icon?: 'trophy' | 'rocket' | 'star' | 'zap';
};

export type TranslationValue = string | number | boolean | null | undefined;

export const LEGACY_OUTCOME_ICONS: Record<NonNullable<LearnItem['icon']>, LucideIcon> = {
  trophy: Trophy,
  rocket: Rocket,
  star: Star,
  zap: Zap,
};

export const DEFAULT_ICONS = [Trophy, Rocket, Star, Zap];