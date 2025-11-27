import { getTranslations } from 'next-intl/server';
import { H2 } from '@/components/general/Heading';
import Image from 'next/image';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'students.page' });
  
  return {
    title: t('title'),
    description: t('description'),
  };
}

// Placeholder student data
const ALL_STUDENTS = [
  {
    id: 1,
    name: 'Sarah Mohamed',
    age: 12,
    achievements: ['Built 5 AI projects', 'Won Regional AI Competition', 'Published research paper'],
    track: 'AI & Machine Learning',
    image: '/assets/images/icons/user-avatar.svg',
    belt: 'Purple Belt',
    quote: 'NGen helped me discover my passion for AI!',
  },
  {
    id: 2,
    name: 'Ahmed Khaled',
    age: 14,
    achievements: ['Competed in National Robotics', 'Built autonomous robot', '1st place in maze challenge'],
    track: 'Robotics',
    image: '/assets/images/icons/user-avatar.svg',
    belt: 'Blue Belt',
    quote: 'Learning robotics at NGen was an amazing experience.',
  },
  {
    id: 3,
    name: 'Maya Layla',
    age: 11,
    achievements: ['Created 3 Mobile Games', 'App Store featured', 'Game design winner'],
    track: 'Programming',
    image: '/assets/images/icons/user-avatar.svg',
    belt: 'Green Belt',
    quote: 'I love creating games that teach and entertain!',
  },
  {
    id: 4,
    name: 'Omar Hassan',
    age: 13,
    achievements: ['Cybersecurity Champion', 'Secured school network', 'Ethical hacking certificate'],
    track: 'Cybersecurity',
    image: '/assets/images/icons/user-avatar.svg',
    belt: 'Orange Belt',
    quote: 'Cybersecurity is the future, and NGen prepared me for it.',
  },
  {
    id: 5,
    name: 'Fatima Ali',
    age: 12,
    achievements: ['Weather prediction model', 'Data science projects', 'ML competition winner'],
    track: 'AI & Machine Learning',
    image: '/assets/images/icons/user-avatar.svg',
    belt: 'Red Belt',
    quote: 'Machine learning opens up endless possibilities!',
  },
  {
    id: 6,
    name: 'Youssef Ibrahim',
    age: 15,
    achievements: ['3D printing expert', 'Smart robot builder', 'Innovation award winner'],
    track: 'Robotics',
    image: '/assets/images/icons/user-avatar.svg',
    belt: 'Black Belt',
    quote: 'From idea to reality with robotics!',
  },
];

export default async function StudentsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'students.page' });

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-lighter to-white">
      <div className="container mx-auto px-5 py-10 md:py-16">
        <div className="text-center mb-10">
          <H2>{t('title')}</H2>
          <p className="text-gray-600 mt-4 text-lg">{t('description')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ALL_STUDENTS.map((student) => (
            <div
              key={student.id}
              className="bg-white rounded-2xl p-8 flex flex-col items-center gap-6 shadow-lg hover:shadow-xl transition-all"
            >
              <Image
                src={student.image}
                alt={student.name}
                width={120}
                height={120}
                className="rounded-full border-4 border-purple-light"
              />
              
              <div className="text-center flex flex-col gap-2">
                <h3 className="text-purple-dark font-bold text-2xl">{student.name}</h3>
                <p className="text-gray-600">Age: {student.age}</p>
                <span className="inline-block px-4 py-2 bg-gradient-to-r from-pumpkin to-rose text-white rounded-full font-bold text-sm">
                  {student.belt}
                </span>
              </div>
              
              <div className="w-full border-t pt-4">
                <p className="text-sm font-semibold text-purple-darker mb-2">{student.track}</p>
                <ul className="flex flex-col gap-2">
                  {student.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green text-lg">✓</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-purple-lighter p-4 rounded-lg italic text-sm text-purple-darker text-center">
                &quot;{student.quote}&quot;
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

