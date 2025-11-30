'use client';

import React from 'react';
import { H2 } from '@/components/general/Heading';
import Button from '@/components/general/Button';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { getStudentsRoute } from '@/util/routes';
import type { Locale } from '@/i18n';

// Placeholder student data
const STUDENTS = [
  {
    id: 1,
    name: 'Sarah Mohamed',
    age: 12,
    achievement: 'Built 5 AI projects',
    track: 'AI & Machine Learning',
    image: '/assets/images/icons/user-avatar.svg',
    belt: 'Purple Belt',
  },
  {
    id: 2,
    name: 'Ahmed Khaled',
    age: 14,
    achievement: 'Competed in National Robotics',
    track: 'Robotics',
    image: '/assets/images/icons/user-avatar.svg',
    belt: 'Blue Belt',
  },
  {
    id: 3,
    name: 'Maya Layla',
    age: 11,
    achievement: 'Created 3 Mobile Games',
    track: 'Programming',
    image: '/assets/images/icons/user-avatar.svg',
    belt: 'Green Belt',
  },
  {
    id: 4,
    name: 'Omar Hassan',
    age: 13,
    achievement: 'Cybersecurity Champion',
    track: 'Cybersecurity',
    image: '/assets/images/icons/user-avatar.svg',
    belt: 'Orange Belt',
  },
];

function HomepageStudentsSection() {
  const t = useTranslations('home');
  const params = useParams();
  const locale = (params?.locale as Locale) || 'en';

  return (
    <section id="students" className="py-6 md:py-10 lg:py-20">
      <div className="container mx-auto px-5 flex flex-col gap-7">
        <div className="flex justify-between items-center">
          <H2>{t('sections.students')}</H2>
          <Button href={getStudentsRoute(locale)} variant="secondary">
            {t('buttons.seeMoreStudents')}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STUDENTS.map((student) => (
            <div
              key={student.id}
              className="bg-gradient-to-br from-purple-light to-purple-lighter rounded-2xl p-6 flex flex-col items-center gap-4 text-center hover:shadow-lg transition-shadow"
            >
              <Image
                src={student.image}
                alt={student.name}
                width={100}
                height={100}
                className="rounded-full"
              />
              <div className="flex flex-col gap-2">
                <h3 className="text-purple-dark font-bold text-xl">{student.name}</h3>
                <p className="text-sm text-gray-600">Age: {student.age}</p>
                <p className="text-pumpkin font-semibold text-sm">{student.belt}</p>
                <p className="text-sm font-medium text-purple-darker">{student.achievement}</p>
                <p className="text-xs text-gray-500">{student.track}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomepageStudentsSection;



