import { getTranslations } from 'next-intl/server';
import { H2 } from '@/components/general/Heading';
import Image from 'next/image';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'projects.page' });
  
  return {
    title: t('title'),
    description: t('description'),
  };
}

// Placeholder project data
const ALL_PROJECTS = [
  {
    id: 1,
    title: 'AI Chatbot Assistant',
    description: 'An intelligent chatbot built using Python and natural language processing. The chatbot can understand user queries and provide relevant responses.',
    image: '/assets/images/soft-skills-image.svg',
    student: 'Sarah Mohamed',
    track: 'AI & Machine Learning',
    level: 'Level 4',
    tags: ['Python', 'NLP', 'AI'],
  },
  {
    id: 2,
    title: 'Robotics Maze Solver',
    description: 'A robot programmed to navigate complex mazes autonomously using sensors and pathfinding algorithms.',
    image: '/assets/images/insights-image.svg',
    student: 'Ahmed Khaled',
    track: 'Robotics',
    level: 'Level 5',
    tags: ['Arduino', 'C++', 'Sensors'],
  },
  {
    id: 3,
    title: 'Mobile Game Development',
    description: 'An educational mobile game created with Unity that teaches math concepts through interactive gameplay.',
    image: '/assets/images/games-image.svg',
    student: 'Maya Layla',
    track: 'Programming',
    level: 'Level 3',
    tags: ['Unity', 'C#', 'Game Design'],
  },
  {
    id: 4,
    title: 'Cybersecurity Scanner',
    description: 'A network security scanner developed to detect vulnerabilities and potential threats in local networks.',
    image: '/assets/images/teachers-image.svg',
    student: 'Omar Hassan',
    track: 'Cybersecurity',
    level: 'Level 4',
    tags: ['Python', 'Security', 'Networking'],
  },
  {
    id: 5,
    title: 'Weather Prediction App',
    description: 'A machine learning application that predicts weather patterns using historical data and neural networks.',
    image: '/assets/images/soft-skills-image.svg',
    student: 'Fatima Ali',
    track: 'AI & Machine Learning',
    level: 'Level 5',
    tags: ['Python', 'ML', 'Data Science'],
  },
  {
    id: 6,
    title: '3D Printed Smart Robot',
    description: 'A fully functional robot with 3D-printed parts, equipped with voice commands and object recognition.',
    image: '/assets/images/courses-parents-image.svg',
    student: 'Youssef Ibrahim',
    track: 'Robotics',
    level: 'Level 5',
    tags: ['3D Printing', 'AI', 'Robotics'],
  },
];

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'projects.page' });

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-5 py-10 md:py-16">
        <div className="text-center mb-10">
          <H2>{t('title')}</H2>
          <p className="text-gray-600 mt-4 text-lg">{t('description')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ALL_PROJECTS.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all"
            >
              <Image
                src={project.image}
                alt={project.title}
                width={400}
                height={250}
                className="w-full h-56 object-cover"
              />
              <div className="p-6 flex flex-col gap-4">
                <h3 className="text-purple-dark font-bold text-xl">{project.title}</h3>
                <p className="text-gray-600 text-sm">{project.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-lighter text-purple-dark text-xs rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="border-t pt-4 flex flex-col gap-2 text-sm">
                  <p className="font-semibold text-purple-darker">
                    By: {project.student}
                  </p>
                  <p className="text-gray-500">{project.track}</p>
                  <p className="text-pumpkin font-medium">{project.level}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

