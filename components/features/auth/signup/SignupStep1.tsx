'use client';

import { ChangeEvent } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useRTL } from '@/lib/useRTL';
import type { JoinType } from './SignupForm';

interface SignupStep1Props {
  locale: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  parentPhoneNumber: string;
  age: string;
  joinType: JoinType;
  organizationName: string;
  howDidYouKnow: string;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setPhoneNumber: (value: string) => void;
  setParentPhoneNumber: (value: string) => void;
  setAge: (value: string) => void;
  setJoinType: (value: JoinType) => void;
  setOrganizationName: (value: string) => void;
  setHowDidYouKnow: (value: string) => void;
  isStep1Valid: boolean;
  onNext: () => void;
}

export default function SignupStep1({
  locale,
  firstName,
  lastName,
  phoneNumber,
  parentPhoneNumber,
  age,
  joinType,
  organizationName,
  howDidYouKnow,
  setFirstName,
  setLastName,
  setPhoneNumber,
  setParentPhoneNumber,
  setAge,
  setJoinType,
  setOrganizationName,
  setHowDidYouKnow,
  isStep1Valid,
  onNext,
}: SignupStep1Props) {
  const t = useTranslations('auth.signup');
  const isRTL = useRTL();

  const textAlignClass = isRTL ? 'text-right' : 'text-left';
  const rowDirectionClass = isRTL ? 'flex-row-reverse' : '';
  const baseInputClasses =
    'w-full h-[50px] px-3.5 text-sm rounded-[14px] bg-gray-100 placeholder:text-gray-500 text-gray-900 outline-none focus-visible:ring-2 focus-visible:ring-pumpkin/60 transition-shadow';
  const defaultBorderClasses = 'border border-gray-200';

  const translations = {
    parentPhoneNumber: isRTL ? 'رقم هاتف ولي الأمر' : 'Parent Phone Number',
    age: isRTL ? 'العمر' : 'Age',
    joinType: isRTL ? 'نوع الانضمام' : 'Join Type',
    individual: isRTL ? 'فردي' : 'Individual',
    organization: isRTL ? 'منظمة' : 'Organization',
    organizationName: isRTL ? 'اسم المنظمة' : 'Organization Name',
    howDidYouKnow: isRTL ? 'كيف عرفت عنا؟' : 'How did you know about us?',
    socialMedia: isRTL ? 'وسائل التواصل الاجتماعي' : 'Social Media',
    friend: isRTL ? 'صديق' : 'Friend',
    searchEngine: isRTL ? 'محرك بحث' : 'Search Engine',
    advertisement: isRTL ? 'إعلان' : 'Advertisement',
    other: isRTL ? 'آخر' : 'Other',
    next: isRTL ? 'التالي' : 'Next',
    alreadyHaveAccount: isRTL ? 'لديك حساب بالفعل؟' : 'Already have an account?',
  };

  return (
    <div className="space-y-2.5">
      {/* First Name & Last Name (mirrored in RTL) */}
      <div className={`flex gap-2.5 ${rowDirectionClass}`}>
        <div className="flex-1">
          <input
            type="text"
            value={firstName}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFirstName(e.target.value)
            }
            placeholder={`${t('firstName')} *`}
            required
            className={`${baseInputClasses} ${defaultBorderClasses} ${textAlignClass}`}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={lastName}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setLastName(e.target.value)
            }
            placeholder={`${t('lastName')} *`}
            required
            className={`${baseInputClasses} ${defaultBorderClasses} ${textAlignClass}`}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>
      </div>

      {/* Phone Number & Parent Phone Number */}
      <div className="flex gap-2.5">
        <div className="flex-1">
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPhoneNumber(e.target.value)
            }
            placeholder={`${t('phoneNumber')} *`}
            required
            dir="ltr"
            className={`${baseInputClasses} ${defaultBorderClasses} ${textAlignClass}`}
          />
        </div>
        <div className="flex-1">
          <input
            type="tel"
            value={parentPhoneNumber}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setParentPhoneNumber(e.target.value)
            }
            placeholder={translations.parentPhoneNumber}
            dir="ltr"
            className={`${baseInputClasses} ${defaultBorderClasses} ${textAlignClass}`}
          />
        </div>
      </div>

      {/* Age */}
      <div>
        <input
          type="number"
          min={1}
          max={120}
          value={age}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setAge(e.target.value)
          }
          placeholder={`${translations.age} *`}
          required
          className={`${baseInputClasses} ${defaultBorderClasses} ${textAlignClass}`}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Join Type */}
      <div>
        <label
          className={`block text-xs text-gray-600 mb-1.5 ${textAlignClass}`}
        >
          {translations.joinType} *
        </label>
        <div className={`flex gap-4 ${rowDirectionClass}`}>
          <label
            className={`flex items-center gap-2 cursor-pointer ${rowDirectionClass}`}
          >
            <input
              type="radio"
              name="joinType"
              value="individual"
              checked={joinType === 'individual'}
              onChange={() => {
                setJoinType('individual');
                setOrganizationName('');
              }}
              className="w-4 h-4 text-pumpkin focus:ring-2 focus:ring-pumpkin/60 cursor-pointer"
            />
            <span className="text-sm text-gray-700">
              {translations.individual}
            </span>
          </label>
          <label
            className={`flex items-center gap-2 cursor-pointer ${rowDirectionClass}`}
          >
            <input
              type="radio"
              name="joinType"
              value="organization"
              checked={joinType === 'organization'}
              onChange={() => setJoinType('organization')}
              className="w-4 h-4 text-pumpkin focus:ring-2 focus:ring-pumpkin/60 cursor-pointer"
            />
            <span className="text-sm text-gray-700">
              {translations.organization}
            </span>
          </label>
        </div>
      </div>

      {/* Organization Name (conditional) */}
      {joinType === 'organization' && (
        <div className="animate-fadeIn">
          <input
            type="text"
            value={organizationName}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setOrganizationName(e.target.value)
            }
            placeholder={`${translations.organizationName} *`}
            required
            className={`${baseInputClasses} border-2 border-pumpkin/30 ${textAlignClass}`}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>
      )}

      {/* How did you know us */}
      <div>
        <select
          value={howDidYouKnow}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setHowDidYouKnow(e.target.value)
          }
          required
          className={`${baseInputClasses} ${defaultBorderClasses} ${textAlignClass} ${
            !howDidYouKnow ? 'text-gray-500' : ''
          }`}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{translations.howDidYouKnow} *</option>
          <option value="social_media">{translations.socialMedia}</option>
          <option value="friend">{translations.friend}</option>
          <option value="search_engine">{translations.searchEngine}</option>
          <option value="advertisement">{translations.advertisement}</option>
          <option value="other">{translations.other}</option>
        </select>
      </div>

      {/* Next Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onNext}
          disabled={!isStep1Valid}
          className="w-full h-[45px] text-sm rounded-[14px] bg-pumpkin hover:bg-pumpkin/90 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors outline-none"
        >
          {translations.next}
        </button>
      </div>

      {/* Login Link */}
      <div className="text-center pt-1">
        <Link
          href={`/${locale}/auth/login`}
          className="text-xs text-gray-600 hover:text-pumpkin transition-colors"
        >
          {translations.alreadyHaveAccount}
        </Link>
      </div>
    </div>
  );
}
