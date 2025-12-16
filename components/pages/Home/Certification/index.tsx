'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRTL } from '@/lib/useRTL';

export default function CertificationSection() {
  const isRTL = useRTL();
  const [activeCert, setActiveCert] = useState<'ar' | 'en'>('en');

  const certImages = {
    ar: '/assets/images/arabic.cr.jpg',
    en: '/assets/images/english-cr.jpg'
  };

  return (
    // Reduced padding (py-12 -> py-10) for a tighter section
    <section className="py-10 md:py-16 bg-gradient-to-b from-white to-purple-50 relative overflow-hidden">

      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-orange-400 rounded-full opacity-20"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-green-400 rounded-full opacity-20"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-purple-400 rounded-lg opacity-20"></div>
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-orange-400 opacity-20" style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }}></div>
      </div>

      <div className="container mx-auto px-4 md:px-5 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-purple-dark mb-4">
            {isRTL ? 'شهادات التميز' : 'Excellence Certificates'}
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
            {isRTL
              ? 'احتفل بإنجازات طلابنا مع شهادات معتمدة دولياً'
              : 'Celebrate our students achievements with internationally recognized certificates'}
          </p>
        </div>

        {/* Language Toggle */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveCert('en')}
            className={`px-5 py-2.5 rounded-xl font-bold transition-all text-sm md:text-base ${activeCert === 'en'
              ? 'bg-pumpkin text-white shadow-lg scale-105'
              : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
          >
            English Certificate
          </button>
          <button
            onClick={() => setActiveCert('ar')}
            className={`px-5 py-2.5 rounded-xl font-bold transition-all text-sm md:text-base ${activeCert === 'ar'
              ? 'bg-pumpkin text-white shadow-lg scale-105'
              : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
          >
            الشهادة العربية
          </button>
        </div>

        {/* Certificate Display - SIZE REDUCED HERE */}
        {/* Changed max-w-5xl to max-w-3xl for a smaller view */}
        <div className="max-w-3xl mx-auto">
          <div
            className={`relative rounded-2xl shadow-xl overflow-hidden transition-all duration-500 ease-in-out transform ${activeCert === 'ar' ? 'hover:shadow-green-500/20' : 'hover:shadow-pumpkin/20'
              }`}
          >
            <Image
              src={certImages[activeCert]}
              alt={activeCert === 'ar' ? 'نموذج الشهادة العربية' : 'English Certificate Preview'}
              width={1200}
              height={850}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-10">
          <p className="text-gray-600 mb-6">
            {isRTL
              ? 'ابدأ رحلتك التعليمية واحصل على شهادتك المعتمدة!'
              : 'Start your learning journey and earn your certificate!'}
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-pumpkin to-rose text-white font-bold rounded-xl hover:shadow-xl transition-all hover:scale-105">
            {isRTL ? 'سجل الآن' : 'Enroll Now'}
          </button>
        </div>
      </div>
    </section>
  );
}