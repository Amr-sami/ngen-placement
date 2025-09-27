'use client';

import { H2 } from '@/components/general/Heading';
import React, { useState } from 'react';
import Image from 'next/image';

const DATA = [
  {
    id: 0,
    title: 'Digital-First AI Pathway (L1A → L5B)',
    icon: '🚀',
    description: '', // TODO: fill description
    imageUrl: '/assets/images/soft-skills-image.svg',
    color: 'text-[#0BCA6C]',
    border: 'border-[#0BCA6C]',
  },
  {
    id: 1,
    title: 'Project-Based, Capstone-Driven',
    icon: '🧩',
    description: '', // TODO: fill description
    imageUrl: '/assets/images/insights-image.svg',
    color: 'text-pumpkin',
    border: 'border-pumpkin',
  },
  {
    id: 2,
    title: 'Soft Skills Built-In',
    icon: '⭐',
    description: '', // TODO: fill description
    imageUrl: '/assets/images/courses-parents-image.svg',
    color: 'text-purple-default',
    border: 'border-purple-default',
  },
  {
    id: 3,
    title: 'Business & Entrepreneurship Mindset',
    icon: '💼',
    description: '', // TODO: fill description
    imageUrl: '/assets/images/games-image.svg',
    color: 'text-rose',
    border: 'border-rose',
  },
  {
    id: 4,
    title: 'Measurable Growth & Reports',
    icon: '📈',
    description: '', // TODO: fill description
    imageUrl: '/assets/images/teachers-image.svg',
    color: 'text-purple-darker',
    border: 'border-purple-darker',
  },
  {
    id: 5,
    title: 'Parent Enablement',
    icon: '👪',
    description: '', // TODO: fill description
    imageUrl: '/assets/images/soft-skills-image.svg',
    color: 'text-[#0BCA6C]',
    border: 'border-[#0BCA6C]',
  },
  {
    id: 6,
    title: 'Gamified Learning & Ninja Belts',
    icon: '🥷',
    description: '', // TODO: fill description
    imageUrl: '/assets/images/insights-image.svg',
    color: 'text-pumpkin',
    border: 'border-pumpkin',
  },
  {
    id: 7,
    title: 'Competitions That Motivate',
    icon: '🏆',
    description: '', // TODO: fill description
    imageUrl: '/assets/images/courses-parents-image.svg',
    color: 'text-purple-default',
    border: 'border-purple-default',
  },
  {
    id: 8,
    title: 'World-Class Tools, Zero Hassle',
    icon: '🧰',
    description: '', // TODO: fill description
    imageUrl: '/assets/images/games-image.svg',
    color: 'text-rose',
    border: 'border-rose',
  },
  {
    id: 9,
    title: 'High-Caliber Trainers',
    icon: '👩🏫',
    description: '', // TODO: fill description
    imageUrl: '/assets/images/teachers-image.svg',
    color: 'text-purple-darker',
    border: 'border-purple-darker',
  },
  {
    id: 10,
    title: 'Portfolio That Matters',
    icon: '🗂',
    description: '', // TODO: fill description
    imageUrl: '/assets/images/soft-skills-image.svg',
    color: 'text-[#0BCA6C]',
    border: 'border-[#0BCA6C]',
  },
  {
    id: 11,
    title: 'Teacher Development',
    icon: '🎓',
    description: '', // TODO: fill description
    imageUrl: '/assets/images/insights-image.svg',
    color: 'text-pumpkin',
    border: 'border-pumpkin',
  },
];

function HomepageNgenWhySection() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const activeImage = DATA.find((item) => item.id === activeTab);
  return (
    <section className="py-6 md:py-10 lg:py-20">
      <div className="container mx-auto px-5 flex flex-col gap-7">
        <H2>added value by choosing NGENschools</H2>

        <div className="flex flex-col-reverse lg:flex-row gap-2">
          <div className="flex flex-col gap-2 lg:basis-1/2">
            {DATA.map((element) => (
              <div
                id={`${element.id}`}
                className={`flex flex-col gap-4 p-4 bg-[#F2F2F2] rounded-xl cursor-pointer border border-solid ${
                  activeTab === element.id ? `bg-white ${element.border}` : ''
                }`}
                onClick={() => setActiveTab(element.id)}
                key={element.id}
              >
                <div className="flex flex-col gap-2">
                  <h3
                    className={`flex items-center gap-2 ${element.color} text-xl font-semibold`}
                  >
                    <span className="text-2xl">{element.icon}</span>
                    {element.title}
                  </h3>
                  <p className="text-[#8A8A8A] text-xl">
                    {element.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:basis-1/2 self-center lg:flex justify-center">
            {activeImage && (
              <Image
                src={activeImage.imageUrl}
                alt={activeImage.title}
                width={580}
                height={530}
                className='scale-x-[-1]'
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomepageNgenWhySection;
