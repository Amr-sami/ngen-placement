import React from 'react';
import Logo from '../../../general/Logo';
import Image from 'next/image';
import ninjaSpaceGuy from '@/public/assets/images/space-ninja-guy.png';
import Button from '../../../general/Button';

function HomepageHero() {
  return (
    <header className="bg-[url('/assets/images/hero-bg.png')] h-[60dvh] md:h-[calc(110dvh-81px)] bg-no-repeat bg-cover bg-bottom text-white">
      <div className="container mx-auto px-5 flex h-full items-center justify-between">
        <div className="flex flex-col max-w-2xl gap-4 md:gap-8 lg:gap-16">
          <div>
            <Logo width={475} height={120} classNames="md:mt-32" />
          </div>
          <div className="flex flex-col gap-4 md:gap-5 text-center md:text-start">
            <h1 className="font-protestRiot md:text-2xl lg:text-4xl">
              Learning Through <span className="text-pumpkin">NGen</span> , Grow
              as <span className="text-rose">A Ninja</span>
            </h1>
            {/* <p className="text-sm md:text-base lg:text-2xl">
              Dive into Graphics, Data Science, and More with Courses Tailored
              for Future Innovators!
            </p> */}
            <Button variant="primary" href="https://wa.me/+201055023774">
              Start your journey
            </Button>
          </div>
        </div>
        <div className="hidden md:block relative">
          <Image
            src={ninjaSpaceGuy}
            alt="Ninja space guy"
            className="animate-bounce-slow"
          />
          <div className="hidden md:flex flex-col gap-6 absolute -bottom-32 lg:-right-14 right-0">
            <a href="https://www.facebook.com/ngenschools">
              <Image
                src="/facebook.svg"
                width={40}
                height={40}
                alt="facebook"
              />
            </a>
            <a href="https://www.linkedin.com/company/ngenschools/">
              <Image
                src="/linkedin.svg"
                width={40}
                height={40}
                alt="linkedin"
              />
            </a>
            <a href="https://www.instagram.com/ngenschools/">
              <Image
                src="/instagram.svg"
                width={40}
                height={40}
                alt="instagram"
              />
            </a>
            <a href="#">
              <Image
                src="/twitter-x.svg"
                width={40}
                height={40}
                alt="twitter-x"
              />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

export default HomepageHero;
