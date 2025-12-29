'use client';

import React from 'react';
import { H2 } from '@/components/general/Heading';
import Button from '@/components/general/Button';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { getProjectsRoute } from '@/lib/routes';
import type { Locale } from '@/i18n';

// Placeholder project data
const PROJECTS = [
  {
    id: 1,
    title: 'AI Chatbot Assistant',
    description: 'Built an intelligent chatbot using Python and natural language processing',
    image: '/assets/images/soft-skills-image.svg',
    student: 'Sarah M.',
    track: 'AI & Machine Learning',
  },
  {
    id: 2,
    title: 'Robotics Maze Solver',
    description: 'Programmed a robot to navigate complex mazes autonomously',
    image: '/assets/images/insights-image.svg',
    student: 'Ahmed K.',
    track: 'Robotics',
  },
  {
    id: 3,
    title: 'Mobile Game Development',
    description: 'Created an educational mobile game with Unity',
    image: '/assets/images/games-image.svg',
    student: 'Maya L.',
    track: 'Programming',
  },
  {
    id: 4,
    title: 'Cybersecurity Scanner',
    description: 'Developed a network security scanner to detect vulnerabilities',
    image: '/assets/images/teachers-image.svg',
    student: 'Omar H.',
    track: 'Cybersecurity',
  },
];

function HomepageProjectsSection() {
  const t = useTranslations('home');
  const params = useParams();
  const locale = (params?.locale as Locale) || 'en';

  return (
    <section id="projects" className="py-6 md:py-10 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-5 flex flex-col gap-7">
        <div className="flex justify-between items-center">
          <H2>{t('sections.projects')}</H2>
          <Button href={getProjectsRoute(locale)} variant="secondary">
            {t('buttons.seeMoreProjects')}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROJECTS.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <Image
                src={project.image}
                alt={project.title}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex flex-col gap-2 ltr:text-left rtl:text-right">
                <h3 className="text-purple-dark font-bold text-lg">{project.title}</h3>
                <p className="text-sm text-gray-600">{project.description}</p>
                <div className="mt-2 flex flex-col gap-1 text-xs text-gray-500">
                  <p className="font-semibold">By: {project.student}</p>
                  <p className="text-purple-default">{project.track}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomepageProjectsSection;

