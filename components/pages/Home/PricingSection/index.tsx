'use client';

import React from 'react';
import { H2 } from '@/components/general/Heading';
import Button from '@/components/general/Button';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { getContactRoute } from '@/util/routes';
import type { Locale } from '@/i18n';

// Placeholder pricing plans
const PRICING_PLANS = [
  {
    id: 1,
    name: 'Individual Student',
    price: '$299',
    period: '/month',
    features: [
      'Live interactive sessions',
      'Project-based learning',
      'Progress tracking',
      'Certificate upon completion',
      'Access to learning platform',
    ],
    color: 'from-blueberry to-blue-400',
    highlighted: false,
  },
  {
    id: 2,
    name: 'Family Plan',
    price: '$499',
    period: '/month',
    features: [
      'Up to 3 students',
      'All Individual features',
      'Family progress dashboard',
      'Priority support',
      '10% sibling discount',
    ],
    color: 'from-purple-dark to-purple-default',
    highlighted: true,
  },
  {
    id: 3,
    name: 'School/Corporate',
    price: 'Custom',
    period: '',
    features: [
      'Customized curriculum',
      'Bulk enrollment',
      'Dedicated account manager',
      'Teacher training included',
      'Custom reporting',
    ],
    color: 'from-pumpkin to-yellow',
    highlighted: false,
  },
];

function HomepagePricingSection() {
  const t = useTranslations('home.sections');
  const params = useParams();
  const locale = (params?.locale as Locale) || 'en';

  return (
    <section id="pricing" className="py-6 md:py-10 lg:py-20 bg-gradient-to-b from-purple-lighter to-white">
      <div className="container mx-auto px-5 flex flex-col gap-7">
        <div className="text-center">
          <H2>{t('pricing')}</H2>
          <p className="text-gray-600 mt-2">Choose the plan that works best for you</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl p-8 flex flex-col gap-6 shadow-lg hover:shadow-xl transition-all ${
                plan.highlighted ? 'ring-4 ring-purple-default scale-105 md:scale-110' : ''
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pumpkin to-rose text-white px-4 py-1 rounded-full text-sm font-bold">
                  Most Popular
                </div>
              )}
              
              <div className={`bg-gradient-to-r ${plan.color} text-white rounded-xl p-4 text-center`}>
                <h3 className="text-2xl font-bold">{plan.name}</h3>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-dark">
                  {plan.price}
                  <span className="text-lg font-normal text-gray-500">{plan.period}</span>
                </div>
              </div>
              
              <ul className="flex flex-col gap-3 flex-grow">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green text-xl">✓</span>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                href={getContactRoute(locale)}
                variant={plan.highlighted ? 'primary' : 'secondary'}
                takeFullWidth
                classNames={plan.highlighted ? 'bg-purple-dark hover:bg-purple-darker' : ''}
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomepagePricingSection;

