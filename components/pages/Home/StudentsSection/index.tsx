'use client';

import React from 'react';
import { H2 } from '@/components/general/Heading';
import Button from '@/components/general/Button';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { getStudentsRoute } from '@/util/routes';
import type { Locale } from '@/i18n';
import { motion } from 'framer-motion';
import { Sparkles, User, Medal, ChevronRight, ChevronLeft } from 'lucide-react';

const STUDENTS = [
  {
    id: 1,
    name: { en: 'Sarah Mohamed', ar: 'سارة محمد' },
    age: 12,
    achievement: { en: 'Built 5 AI projects', ar: 'بنت 5 مشاريع ذكاء اصطناعي' },
    track: { en: 'AI & Machine Learning', ar: 'الذكاء الاصطناعي' },
    belt: { en: 'Purple Belt', ar: 'الحزام الأرجواني' },
    color: '#8B5CF6'
  },
  {
    id: 2,
    name: { en: 'Ahmed Khaled', ar: 'أحمد خالد' },
    age: 14,
    achievement: { en: 'Competed in National Robotics', ar: 'نافس في المسابقة الوطنية للروبوتات' },
    track: { en: 'Robotics', ar: 'الروبوتات' },
    belt: { en: 'Blue Belt', ar: 'الحزام الأزرق' },
    color: '#3B82F6'
  },
  {
    id: 3,
    name: { en: 'Maya Layla', ar: 'مايا ليلى' },
    age: 11,
    achievement: { en: 'Created 3 Mobile Games', ar: 'صممت 3 ألعاب للموبايل' },
    track: { en: 'Programming', ar: 'البرمجة' },
    belt: { en: 'Green Belt', ar: 'الحزام الأخضر' },
    color: '#10B981'
  },
  {
    id: 4,
    name: { en: 'Omar Hassan', ar: 'عمر حسن' },
    age: 13,
    achievement: { en: 'Cybersecurity Champion', ar: 'بطل الأمن السيبراني' },
    track: { en: 'Cybersecurity', ar: 'الأمن السيبراني' },
    belt: { en: 'Orange Belt', ar: 'الحزام البرتقالي' },
    color: '#F97316'
  },
  {
    id: 5,
    name: { en: 'Lila Zein', ar: 'ليلى زين' },
    age: 10,
    achievement: { en: 'Top UI Designer', ar: 'أفضل مصممة واجهات' },
    track: { en: 'Design', ar: 'التصميم' },
    belt: { en: 'Yellow Belt', ar: 'الحزام الأصفر' },
    color: '#EAB308'
  },
  {
    id: 6,
    name: { en: 'Youssef Ali', ar: 'يوسف علي' },
    age: 15,
    achievement: { en: 'Python Expert', ar: 'خبير لغة بايثون' },
    track: { en: 'Data Science', ar: 'علوم البيانات' },
    belt: { en: 'Black Belt', ar: 'الحزام الأسود' },
    color: '#1e293b'
  }
];

function HomepageStudentsSection() {
  const t = useTranslations('home');
  const params = useParams();
  const locale = (params?.locale as Locale) || 'en';
  const isRTL = locale === 'ar';

  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      
      // Basic movement direction
      let move = direction === 'left' ? -scrollAmount : scrollAmount;
      
      // Fix: If RTL, the horizontal scroll vector is inverted in most browsers
      if (isRTL) {
        move = -move;
      }

      scrollRef.current.scrollBy({
        left: move,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section 
      id="students" 
      dir={isRTL ? 'rtl' : 'ltr'} 
      className="py-16 md:py-24 bg-white relative overflow-hidden"
    >
      <div className="container mx-auto px-4">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 mb-4">
              <Medal className="w-4 h-4 text-[#2e165f]" />
              <span className="text-[10px] font-black tracking-widest text-[#2e165f] uppercase">
                {isRTL ? 'مبدعي إن-جين' : 'NGEN CREATORS'}
              </span>
            </div>
            <H2 classNames="text-[#2e165f] text-3xl md:text-5xl">{t('sections.students')}</H2>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              href={getStudentsRoute(locale)} 
              variant="secondary" 
              className="rounded-full px-8 border-2 border-[#2e165f] text-[#2e165f] font-bold hover:bg-[#2e165f] hover:text-white transition-all"
            >
              {t('buttons.seeMoreStudents')}
            </Button>
            
            {/* Desktop Arrows */}
            <div className="hidden md:flex gap-2">
              <button 
                onClick={() => scroll('left')} 
                className="p-3 rounded-full border border-slate-200 hover:bg-[#2e165f] hover:text-white transition-all"
              >
                <ChevronLeft className="w-5 h-5"/>
              </button>
              <button 
                onClick={() => scroll('right')} 
                className="p-3 rounded-full border border-slate-200 hover:bg-[#2e165f] hover:text-white transition-all"
              >
                <ChevronRight className="w-5 h-5"/>
              </button>
            </div>
          </div>
        </div>
        
        {/* CAROUSEL CONTAINER */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 md:gap-6 pb-10 px-2 scrollbar-hide snap-x no-scrollbar"
        >
          {STUDENTS.map((student) => (
            <motion.div
              key={student.id}
              whileHover={{ y: -8 }}
              className="min-w-[calc(85%-8px)] md:min-w-[320px] snap-center bg-white border border-slate-100 rounded-[2.5rem] p-6 md:p-8 flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:shadow-[#2e165f]/5 hover:border-[#2e165f]/20 transition-all group"
            >
              {/* Profile Image Stage */}
              <div className="relative mb-6">
                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-slate-50 border-4 border-white shadow-inner overflow-hidden flex items-center justify-center transition-transform group-hover:rotate-0 ${isRTL ? '-rotate-3' : 'rotate-3'}`}>
                  <User className="w-10 h-10 md:w-12 md:h-12 text-slate-200" />
                </div>
                <div 
                  className={`absolute -top-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg text-white ${isRTL ? '-left-2' : '-right-2'}`}
                  style={{ backgroundColor: student.color }}
                >
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>

              {/* Student Info */}
              <div className="flex flex-col gap-2 w-full">
                <h3 className="text-[#2e165f] font-black text-lg md:text-xl truncate">
                  {student.name[locale]}
                </h3>
                
                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100/50">
                  <p className="text-[#2e165f] font-bold text-xs md:text-sm leading-tight mb-1">
                    {student.achievement[locale]}
                  </p>
                  <p className="text-slate-400 text-[9px] font-black uppercase tracking-wider">
                    {student.track[locale]}
                  </p>
                </div>

                {/* Belt Label */}
                <div 
                  className="mt-4 py-2 px-4 rounded-xl text-[10px] font-black uppercase inline-flex items-center gap-2 justify-center"
                  style={{ 
                    backgroundColor: `${student.color}10`, 
                    color: student.color, 
                    border: `1px solid ${student.color}20` 
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: student.color }} />
                  {student.belt[locale]}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tailwind & CSS standard for hiding scrollbars */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}

export default HomepageStudentsSection;