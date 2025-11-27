import { getTranslations } from 'next-intl/server';
import { H2 } from '@/components/general/Heading';
import Image from 'next/image';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog.page' });
  
  return {
    title: t('title'),
    description: t('description'),
  };
}

// Placeholder blog posts
const BLOG_POSTS = [
  {
    id: 1,
    title: 'Why Kids Should Learn AI in 2024',
    excerpt: 'Discover how artificial intelligence is shaping the future and why your child should start learning AI today.',
    image: '/assets/images/soft-skills-image.svg',
    author: 'NGen Team',
    date: '2024-01-15',
    category: 'AI & Technology',
    readTime: '5 min read',
  },
  {
    id: 2,
    title: 'Top 5 Robotics Projects for Beginners',
    excerpt: 'Get started with robotics through these exciting beginner-friendly projects that teach core concepts.',
    image: '/assets/images/insights-image.svg',
    author: 'Dr. Fatima Ahmed',
    date: '2024-01-10',
    category: 'Robotics',
    readTime: '7 min read',
  },
  {
    id: 3,
    title: 'How Gamification Enhances Learning',
    excerpt: 'Learn about the science behind gamified learning and how it keeps students engaged and motivated.',
    image: '/assets/images/games-image.svg',
    author: 'Prof. Mohamed Ali',
    date: '2024-01-05',
    category: 'Education',
    readTime: '6 min read',
  },
  {
    id: 4,
    title: 'Cybersecurity Basics Every Kid Should Know',
    excerpt: 'Essential cybersecurity practices that every young digital citizen should understand and practice.',
    image: '/assets/images/teachers-image.svg',
    author: 'Sarah Mohamed',
    date: '2024-01-01',
    category: 'Cybersecurity',
    readTime: '4 min read',
  },
  {
    id: 5,
    title: 'Building Your First Mobile App',
    excerpt: 'A step-by-step guide for young developers to create their first mobile application.',
    image: '/assets/images/courses-parents-image.svg',
    author: 'Ahmed Khaled',
    date: '2023-12-28',
    category: 'Programming',
    readTime: '8 min read',
  },
  {
    id: 6,
    title: 'The Future of Digital Education',
    excerpt: 'Exploring trends and innovations that are transforming how children learn technology.',
    image: '/assets/images/soft-skills-image.svg',
    author: 'NGen Team',
    date: '2023-12-20',
    category: 'Education',
    readTime: '6 min read',
  },
];

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog.page' });

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-5 py-10 md:py-16">
        <div className="text-center mb-10">
          <H2>{t('title')}</H2>
          <p className="text-gray-600 mt-4 text-lg">{t('description')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer"
            >
              <Image
                src={post.image}
                alt={post.title}
                width={400}
                height={250}
                className="w-full h-48 object-cover"
              />
              <div className="p-6 flex flex-col gap-4 ltr:text-left rtl:text-right">
                <div className="flex justify-between items-center text-sm">
                  <span className="px-3 py-1 bg-purple-lighter text-purple-dark rounded-full font-medium">
                    {post.category}
                  </span>
                  <span className="text-gray-500">{post.readTime}</span>
                </div>
                
                <h3 className="text-purple-dark font-bold text-xl hover:text-purple-default transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 text-sm line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="border-t pt-4 flex justify-between items-center text-sm">
                  <span className="text-gray-700 font-medium">{post.author}</span>
                  <time className="text-gray-500">{post.date}</time>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

