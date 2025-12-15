import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { TrackKey, TRACK_KEYS } from '@/components/general/TracksBelts';
import { LearnItem, TranslationValue } from './constants';

export function useJourney() {
  const t = useTranslations('home.journey');
  const searchParams = useSearchParams();

  const [activeTrack, setActiveTrack] = useState<TrackKey>('programming');
  const [activeStageId, setActiveStageId] = useState<string>('placement-test');
  const [showOutcomesModal, setShowOutcomesModal] = useState(false);

  useEffect(() => {
    const trackParam = searchParams.get('track');
    if (trackParam && TRACK_KEYS.includes(trackParam as TrackKey)) {
      setActiveTrack(trackParam as TrackKey);
    }
  }, [searchParams]);

  const hasKey = (key: string): boolean => {
    const translationObj = t as unknown as { has?: (key: string) => boolean };
    if (typeof translationObj.has === 'function') {
      return translationObj.has(key);
    }
    return true;
  };

  const safeText = (key: string, fallbackKey?: string): TranslationValue => {
    try {
      if (!hasKey(key)) throw new Error('Missing key');
      const value = t(key);
      if (typeof value === 'string' && (value === key || value.includes('trackSpecific.') || value.includes('stages.'))) {
        throw new Error('Missing key');
      }
      return value;
    } catch {
      if (!fallbackKey) return '';
      try {
        const v = t(fallbackKey);
        if (typeof v === 'string' && (v === fallbackKey || v.includes('trackSpecific.') || v.includes('stages.'))) return '';
        return v;
      } catch {
        return '';
      }
    }
  };

  const getStageContent = (field: string): TranslationValue => {
    const genericKey = `stages.${activeStageId}.${field}`;
    const genericStages = ['placement-test', 'white'];

    if (genericStages.includes(activeStageId)) {
      return safeText(genericKey);
    }

    const specificKey = `trackSpecific.${activeTrack}.stages.${activeStageId}.${field}`;
    return safeText(specificKey, genericKey);
  };

  const getLearningItems = (): LearnItem[] => {
    const translationObj = t as unknown as { raw?: (key: string) => unknown };
    const genericStages = ['placement-test', 'white'];
    if (genericStages.includes(activeStageId)) return [];

    const primaryKey = `trackSpecific.${activeTrack}.whatWeWillLearn.${activeStageId}`;
    const altKey = `trackSpecific.${activeTrack}.stages.${activeStageId}.whatWeWillLearn`;
    const legacySpecific = `trackSpecific.${activeTrack}.stages.${activeStageId}.outcomes`;
    const legacyGeneric = `stages.${activeStageId}.outcomes`;

    const readRawArray = (key: string): unknown[] | null => {
      try {
        if (typeof translationObj.raw === 'function' && hasKey(key)) {
          const raw = translationObj.raw(key);
          if (Array.isArray(raw)) return raw;
        }
      } catch {
        // ignore
      }
      return null;
    };

    const processRawArray = (rawArray: unknown[] | null): LearnItem[] => {
      if (!rawArray) return [];
      
      return rawArray
        .filter((x): x is Record<string, unknown> => x !== null && typeof x === 'object')
        .map((x) => ({
          icon: (x.icon as LearnItem['icon']) ?? undefined,
          title: String(x.title ?? ''),
          description: String(x.description ?? ''),
        }))
        .filter((x) => x.title || x.description);
    };

    // Try primary key
    const raw1 = readRawArray(primaryKey);
    if (raw1) {
      return processRawArray(raw1);
    }

    // Try alt key
    const raw2 = readRawArray(altKey);
    if (raw2) {
      return processRawArray(raw2);
    }

    // Try legacy specific
    const rawLegacy1 = readRawArray(legacySpecific);
    if (rawLegacy1) {
      return processRawArray(rawLegacy1);
    }

    // Try legacy generic
    const rawLegacy2 = readRawArray(legacyGeneric);
    if (rawLegacy2) {
      return processRawArray(rawLegacy2);
    }

    return [];
  };

  const learningItems = useMemo(() => getLearningItems(), [activeTrack, activeStageId]);

  return {
    activeTrack,
    setActiveTrack,
    activeStageId,
    setActiveStageId,
    showOutcomesModal,
    setShowOutcomesModal,
    safeText,
    getStageContent,
    learningItems,
    t,
  };
}