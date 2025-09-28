'use client';

import React, { useState } from 'react';
import Logo from '../../../general/Logo';
import Image from 'next/image';
import ninjaSpaceGuy from '@/public/assets/images/space-ninja-guy.svg';
import Button from '../../../general/Button';
import ContactModal from '../../../general/ContactModal';

function HomepageHero() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  return (
    <header className="bg-[url('/assets/images/hero-bg.svg')] h-[60dvh] md:h-[calc(110dvh-81px)] bg-no-repeat bg-cover bg-bottom text-white">
      <div className="container mx-auto px-5 flex h-full items-center justify-between">
        <div className="flex flex-col items-center w-full lg:max-w-2xl gap-4 md:gap-8 lg:gap-16 px-2">
          <div>
            <Logo
              width={475}
              height={120}
              classNames="md:mt-32 hidden md:block"
            />
            <p className="text-3xl sm:text-4xl font-semibold md:ml-40 uppercase text-center">
              schools
            </p>
          </div>
          <div className="flex flex-col gap-4 md:gap-5 text-center lg:text-start">
            <h1 className="font-protestRiot text-xl md:text-2xl lg:text-4xl">
              Future <span className="text-pumpkin">Innovators</span> ,
              Today&apos;s <span className="text-rose">Ninjas!</span>
            </h1>
            {/* <p className="text-sm md:text-base lg:text-2xl">
              Dive into Graphics, Data Science, and More with Courses Tailored
              for Future Innovators!
            </p> */}
            <div onClick={() => setIsContactModalOpen(true)}>
              <button
                className="px-4 py-2 rounded-lg transition-colors duration-300 ease-linear bg-pumpkin text-white font-bold hover:bg-white hover:text-pumpkin"
              >
                Start your journey
              </button>
            </div>
            <ContactModal open={isContactModalOpen} onOpenChange={setIsContactModalOpen} />
          </div>
        </div>
        <div className="hidden md:block relative">
          <Image
            src={ninjaSpaceGuy}
            alt="Ninja space guy"
            className="animate-bounce-slow"
          />
          <div className="hidden md:flex flex-col gap-6 absolute -bottom-32 lg:-right-14 right-0">
            <a href="https://www.facebook.com/ngenschools" target="_blank">
              <Image
                src="/fb.png"
                width={40}
                height={40}
                alt="facebook"
              />
            </a>
            <a href="https://www.linkedin.com/company/ngenschools/" target="_blank">
              <Image
                src="/linkedin.svg"
                width={40}
                height={40}
                alt="linkedin"
              />
            </a>
            <a href="https://www.instagram.com/ngenschools/" target="_blank">
              <Image
                src="/instagram.svg"
                width={40}
                height={40}
                alt="instagram"
              />
            </a>
            <a href="https://www.tiktok.com/@ngenschools" target="_blank">
              <Image
                src="/tiktok-round-white-icon.webp"
                width={40}
                height={40}
                alt="tiktok"
              />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

export default HomepageHero;
