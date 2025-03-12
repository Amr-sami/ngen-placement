'use client';

import { H2 } from '@/components/general/Heading';
import React, { useState } from 'react';
import Image from 'next/image';

const DATA = [
  {
    id: 0,
    title: 'Soft skills Courses',
    IconUrl: '/assets/images/icons/star-iconr.svg',
    description:
      "To enhance children's personal and interpersonal development.",
    imageUrl: '/assets/images/soft-skills-image.png',
    color: '[#0BCA6C]',
  },
  {
    id: 1,
    title: 'Insights and regular reports',
    IconUrl: '/assets/images/icons/document-icon.svg',
    description:
      "To track each child's development and skill level, ensuring consistent growth and achievement.",
    imageUrl: '/assets/images/insights-image.png',
    color: 'pumpkin',
  },
  {
    id: 2,
    title: 'Free courses for Parents',
    IconUrl: '/assets/images/icons/laptop-icon.svg',
    description:
      'designed to provide valuable insights and guidance to support their child’s development',
    imageUrl: '/assets/images/courses-parents-image.png',
    color: 'purple-default',
  },
  {
    id: 3,
    title: 'Gamified learning',
    IconUrl: '/assets/images/icons/gamified-icon.svg',
    description:
      'A unique learning experience through play-based education, where children learn and develop new skills in a fun and interactive way.',
    imageUrl: '/assets/images/games-image.png',
    color: 'rose',
  },
  {
    id: 4,
    title: "Teachers' development",
    IconUrl: '/assets/images/icons/user-terminal.svg',
    description:
      'We provide regular workshops to enhance their skills and support their professional development.',
    imageUrl: '/assets/images/teachers-image.png',
    color: 'purple-darker',
  },
];

function HomepageNgenWhySection() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const activeImage = DATA.find((item) => item.id === activeTab);
  return (
    <section className="py-6 md:py-10 lg:py-20">
      <div className="container mx-auto px-5 flex flex-col gap-7">
        <H2>Why Ngen</H2>

        <div className="flex flex-col-reverse lg:flex-row gap-2">
          <div className="flex flex-col gap-2 lg:basis-1/2">
            {DATA.map((element) => (
              <div
                id={`${element.id}`}
                className={`flex flex-col gap-4 p-4 bg-[#F2F2F2] rounded-xl cursor-pointer border border-solid ${
                  activeTab === element.id
                    ? `bg-white border-${element.color}`
                    : ''
                }`}
                onClick={() => setActiveTab(element.id)}
                key={element.id}
              >
                <div className="flex flex-col gap-2">
                  <h3
                    className={`flex items-center gap-2 text-${element.color} text-xl font-semibold`}
                  >
                    <Image
                      src={element.IconUrl}
                      width={24}
                      height={24}
                      alt="icon"
                    />
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
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomepageNgenWhySection;
