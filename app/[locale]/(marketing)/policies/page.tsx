'use client';

import { H2 } from '@/components/general/Heading'
import React from 'react'
import { useTranslations } from 'next-intl';

const Policies = () => {
  const t = useTranslations('policies');

  return (
    <main className='container mx-2 lg:mx-auto mb-4 mt-9 lg:my-16'>
      <H2 classNames='mb-4 lg:mb-10'>{t('title')}</H2>

      {/* Privacy Policy */}
      <div className='mb-4 lg:mb-10'>
        <h3 className="font-bold text-xl text-pumpkin md:text-2xl xl:text-3xl mb-4 lg:mb-6">{t('privacyPolicy.title')}</h3>

        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mt-3 lg:mt-4'>{t('privacyPolicy.intro.title')}</h5>
        <p className='text-gray-tertiary leading-6'>{t('privacyPolicy.intro.content')}</p>

        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mt-3 lg:mt-4'>{t('privacyPolicy.intellectualProperty.title')}</h5>
        <p className='text-gray-tertiary leading-6'>{t('privacyPolicy.intellectualProperty.content')}</p>

        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mt-3 lg:mt-4'>{t('privacyPolicy.userRestrictions.title')}</h5>
        <p className='text-gray-tertiary leading-6'>{t('privacyPolicy.userRestrictions.content')}</p>

        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mt-3 lg:mt-4'>{t('privacyPolicy.userContent.title')}</h5>
        <p className='text-gray-tertiary leading-6'>{t('privacyPolicy.userContent.content')}</p>

        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mt-3 lg:mt-4'>{t('privacyPolicy.noWarranties.title')}</h5>
        <p className='text-gray-tertiary leading-6'>{t('privacyPolicy.noWarranties.content')}</p>

        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mt-3 lg:mt-4'>{t('privacyPolicy.limitation.title')}</h5>
        <p className='text-gray-tertiary leading-6'>{t('privacyPolicy.limitation.content')}</p>

        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mt-3 lg:mt-4'>{t('privacyPolicy.severability.title')}</h5>
        <p className='text-gray-tertiary leading-6'>{t('privacyPolicy.severability.content')}</p>

        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mt-3 lg:mt-4'>{t('privacyPolicy.modifications.title')}</h5>
        <p className='text-gray-tertiary leading-6'>{t('privacyPolicy.modifications.content')}</p>

        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mt-3 lg:mt-4'>{t('privacyPolicy.assignment.title')}</h5>
        <p className='text-gray-tertiary leading-6'>{t('privacyPolicy.assignment.content')}</p>

        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mt-3 lg:mt-4'>{t('privacyPolicy.entireAgreement.title')}</h5>
        <p className='text-gray-tertiary leading-6'>{t('privacyPolicy.entireAgreement.content')}</p>
      </div>

      {/* Terms & Conditions */}
      <div className='mb-4 lg:mb-10'>
        <h3 className="font-bold text-xl text-pumpkin md:text-2xl xl:text-3xl mb-4 lg:mb-6">{t('termsConditions.title')}</h3>

        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mb-3 lg:mb-4'>{t('termsConditions.intro.title')}</h5>
        <p className='text-gray-tertiary leading-6'>{t('termsConditions.intro.content')}</p>

        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mb-3 lg:mb-4 mt-4 lg:mt-6'>{t('termsConditions.infoCollect.title')}</h5>
        <ul>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>{t('termsConditions.infoCollect.intro')}</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>{t('termsConditions.infoCollect.personal')}</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>{t('termsConditions.infoCollect.usage')}</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>{t('termsConditions.infoCollect.device')}</li>
        </ul>

        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mb-3 lg:mb-4 mt-4 lg:mt-6'>{t('termsConditions.howWeUse.title')}</h5>
        <ul>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>{t('termsConditions.howWeUse.intro')}</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>{t('termsConditions.howWeUse.provide')}</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>{t('termsConditions.howWeUse.personalize')}</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>{t('termsConditions.howWeUse.communicate')}</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>{t('termsConditions.howWeUse.security')}</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>{t('termsConditions.howWeUse.legal')}</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>{t('termsConditions.howWeUse.noSell')}</li>
        </ul>

        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mb-3 lg:mb-4 mt-4 lg:mt-6'>{t('termsConditions.cookies.title')}</h5>
        <p className='text-gray-tertiary leading-6'>{t('termsConditions.cookies.content')}</p>

        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mb-3 lg:mb-4 mt-4 lg:mt-6'>{t('termsConditions.dataProtection.title')}</h5>
        <p className='text-gray-tertiary leading-6'>{t('termsConditions.dataProtection.content')}</p>

        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mb-3 lg:mb-4 mt-4 lg:mt-6'>{t('termsConditions.thirdParty.title')}</h5>
        <p className='text-gray-tertiary leading-6'>{t('termsConditions.thirdParty.content')}</p>

        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mb-3 lg:mb-4 mt-4 lg:mt-6'>{t('termsConditions.yourRights.title')}</h5>
        <ul>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>{t('termsConditions.yourRights.intro')}</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>{t('termsConditions.yourRights.access')}</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>{t('termsConditions.yourRights.optOut')}</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>{t('termsConditions.yourRights.copy')}</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>{t('termsConditions.yourRights.contact')}</li>
        </ul>

        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mb-3 lg:mb-4 mt-4 lg:mt-6'>{t('termsConditions.changes.title')}</h5>
        <p className='text-gray-tertiary leading-6'>{t('termsConditions.changes.content')}</p>
      </div>

      {/* Refund Policy */}
      <div className='mb-4 lg:mb-10'>
        <h3 className="font-bold text-xl text-pumpkin md:text-2xl xl:text-3xl mb-4 lg:mb-6">{t('refundPolicy.title')}</h3>

        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mb-3 lg:mb-4'>{t('refundPolicy.liveCourses.title')}</h5>
        <ul>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>{t('refundPolicy.liveCourses.fullRefund')}</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>{t('refundPolicy.liveCourses.partialRefund')}</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>{t('refundPolicy.liveCourses.noRefund')}</li>
        </ul>

        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mb-3 lg:mb-4 mt-4 lg:mt-6'>{t('refundPolicy.recordedCourses.title')}</h5>
        <ul>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>{t('refundPolicy.recordedCourses.fullRefund')}</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>{t('refundPolicy.recordedCourses.noRefund')}</li>
        </ul>

        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mb-3 lg:mb-4 mt-4 lg:mt-6'>{t('refundPolicy.processing.title')}</h5>
        <p className='text-gray-tertiary leading-6'>{t('refundPolicy.processing.content')}</p>
      </div>

      {/* Cancellation & Replacement Policy */}
      <div className='mb-4 lg:mb-10'>
        <h3 className="font-bold text-xl text-pumpkin md:text-2xl xl:text-3xl mb-4 lg:mb-6">{t('cancellationPolicy.title')}</h3>
        <ul>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>{t('cancellationPolicy.replacement')}</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>{t('cancellationPolicy.priceDifference')}</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>{t('cancellationPolicy.noCancellation')}</li>
        </ul>
      </div>
    </main>
  )
}

export default Policies