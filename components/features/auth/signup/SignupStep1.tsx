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

  const baseInputClasses =
    'w-full h-[50px] px-3.5 text-sm rounded-[14px] bg-gray-100 border border-gray-200 placeholder:text-gray-500 text-gray-900 outline-none focus-visible:ring-2 focus-visible:ring-pumpkin/60 transition-shadow';

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
      {/* First Name & Last Name - MIRRORED IN RTL */}
      <div className={`flex gap-2.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {/* In RTL: Last Name appears on RIGHT, First Name on LEFT */}
        <div className="flex-1">
          <input
            type="text"
            value={isRTL ? lastName : firstName}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              isRTL ? setLastName(e.target.value) : setFirstName(e.target.value)
            }
            placeholder={isRTL ? `${t('lastName')} *` : `${t('firstName')} *`}
            required
            className={`${baseInputClasses} ${isRTL ? 'text-right' : 'text-left'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={isRTL ? firstName : lastName}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              isRTL ? setFirstName(e.target.value) : setLastName(e.target.value)
            }
            placeholder={isRTL ? `${t('firstName')} *` : `${t('lastName')} *`}
            required
            className={`${baseInputClasses} ${isRTL ? 'text-right' : 'text-left'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>
      </div>

      {/* Phone Number & Parent Phone Number - MIRRORED IN RTL */}
      <div className={`flex gap-2.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {/* In RTL: Parent Phone on RIGHT, Phone on LEFT */}
        <div className="flex-1">
          <input
            type="tel"
            value={isRTL ? parentPhoneNumber : phoneNumber}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              isRTL ? setParentPhoneNumber(e.target.value) : setPhoneNumber(e.target.value)
            }
            placeholder={isRTL ? translations.parentPhoneNumber : `${t('phoneNumber')} *`}
            required={!isRTL}
            dir="ltr"
            className={`${baseInputClasses} ${isRTL ? 'text-right' : 'text-left'}`}
          />
        </div>
        <div className="flex-1">
          <input
            type="tel"
            value={isRTL ? phoneNumber : parentPhoneNumber}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              isRTL ? setPhoneNumber(e.target.value) : setParentPhoneNumber(e.target.value)
            }
            placeholder={isRTL ? `${t('phoneNumber')} *` : translations.parentPhoneNumber}
            required={isRTL}
            dir="ltr"
            className={`${baseInputClasses} ${isRTL ? 'text-right' : 'text-left'}`}
          />
        </div>
      </div>

      {/* Age Input Field */}
      <div>
        <input
          type="number"
          value={age}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            if (value === '' || (parseInt(value) > 0 && parseInt(value) <= 100)) {
              setAge(value);
            }
          }}
          placeholder={`${translations.age} *`}
          required
          min="1"
          max="100"
          className={`${baseInputClasses} ${isRTL ? 'text-right' : 'text-left'}`}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
        {age && parseInt(age) > 0 && (
          <div
            className={`mt-1.5 flex items-center gap-1.5 ${
              isRTL ? 'justify-end flex-row-reverse' : 'justify-start'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-pumpkin animate-pulse" />
            <span className="text-xs font-medium text-gray-600">
              {parseInt(age) < 13
                ? isRTL
                  ? '🎈 طفل رائع!'
                  : '🎈 Amazing kid!'
                : parseInt(age) < 18
                ? isRTL
                  ? '🚀 مراهق مذهل!'
                  : '🚀 Awesome teen!'
                : isRTL
                ? '⭐ متعلم رائع!'
                : '⭐ Great learner!'}
            </span>
          </div>
        )}
      </div>

      {/* Join Type */}
      <div>
        <label
          className={`block text-xs text-gray-600 mb-1.5 ${
            isRTL ? 'text-right' : 'text-left'
          }`}
        >
          {translations.joinType} *
        </label>
        <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <label
            className={`flex items-center gap-2 cursor-pointer ${
              isRTL ? 'flex-row-reverse' : ''
            }`}
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
              className="w-4 h-4 text-pumpkin focus:ring-2 focus:ring-pumpkin/60 cursor-pointer accent-pumpkin"
            />
            <span className="text-sm text-gray-700">
              {translations.individual}
            </span>
          </label>
          <label
            className={`flex items-center gap-2 cursor-pointer ${
              isRTL ? 'flex-row-reverse' : ''
            }`}
          >
            <input
              type="radio"
              name="joinType"
              value="organization"
              checked={joinType === 'organization'}
              onChange={() => setJoinType('organization')}
              className="w-4 h-4 text-pumpkin focus:ring-2 focus:ring-pumpkin/60 cursor-pointer accent-pumpkin"
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
            className={`${baseInputClasses} border-2 border-pumpkin/30 ${
              isRTL ? 'text-right' : 'text-left'
            }`}
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
          className={`${baseInputClasses} ${
            isRTL ? 'text-right' : 'text-left'
          } ${!howDidYouKnow ? 'text-gray-500' : ''}`}
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