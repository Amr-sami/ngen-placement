import { CallToAction /*,ContactUs*/ } from '@/components/general';
import { H2 } from '@/components/general/Heading';
import { getTranslations } from 'next-intl/server';
// import SocialProofCard from "@/components/pages/Home/SocialProofSection/SocialProofCard";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
// } from "@/components/ui/carousel";
import Image from 'next/image';
import React from 'react';
// import Autoplay from "embla-carousel-autoplay";
import bgImageDesktop from '@/public/assets/images/about-page-bg.svg';
import bgImageMob from '@/public/assets/images/about-page-bg-mob.svg';

// const TESTIOMONIALS = [
//   {
//     fullName: "Mona Elmohandes",
//     avatarImg: "/assets/images/avatar-man-placeholder.png",
//     feedbackMessage:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
//     feedbackRating: 5,
//   },
//   {
//     variation: "testimonial",
//     fullName: "Mona Elmohandes",
//     avatarImg: "/assets/images/avatar-man-placeholder.png",
//     feedbackMessage:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
//     feedbackRating: 3,
//   },
//   {
//     variation: "testimonial",
//     fullName: "Mona Elmohandes",
//     avatarImg: "/assets/images/avatar-man-placeholder.png",
//     feedbackMessage:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
//     feedbackRating: 1,
//   },
// ];


export const metadata = {
  title: "About NGen | Modern Online Learning for Kids",
  description: "Learn more about NGen, where kids explore technology through exciting, hands-on experiences. Our goal: raise the next generation of innovators with skills in coding, AI, robotics, and more.",
  keywords: ["about NGen", "online learning mission", "kids tech education", "modern learning for children", "digital ninjas", "online school for kids"],
};


async function AboutPage() {
  const t = await getTranslations('about');

  return (
    <>
      <Image
        src={bgImageDesktop}
        className="w-full hidden md:block"
        alt="about NGen page"
      />
      <Image
        src={bgImageMob}
        className="w-full block md:hidden"
        alt="about NGen page"
      />
      <main className="">
        <div className=" relative z-20 py-36 before:bg-[url('/assets/images/about-page-text-bg-mob.png')] lg:before:bg-none before:absolute before:content-[''] before:w-full before:h-full before:top-0 before:z-[-10] before:bg-no-repeat before:bg-cover">
          <div className="flex h-full justify-center items-center container mx-auto px-5 text-purple-dark">
            <div className="lg:basis-3/6 grid grid-cols-2 gap-10 ">
              <div className="col-span-2 flex flex-col gap-4">
                <h1 className="font-protestRiot lg:text-5xl text-2xl text-purple-dark">
                  {t('whoWeAre.heading')}
                </h1>
                <p>
                  {t('whoWeAre.body')}
                </p>
              </div>
              <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
                <H2>{t('mission.heading')}</H2>
                <p>
                  {t('mission.body')}
                </p>
              </div>
              <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
                <H2>{t('vision.heading')}</H2>
                <p>
                  {t('vision.body')}
                </p>
              </div>
            </div>
            <div className="basis-3/6 justify-center hidden lg:flex">
              <Image
                src="/assets/images/about-img.svg"
                alt="About NGen schools"
                width={355}
                height={355}
              />
            </div>
          </div>
        </div>
        {/* <div className="flex flex-col gap-4 lg:gap-10 py-10">
          <h3 className="text-xl md:text-2xl lg:text-4xl font-protestRiot text-[#BD256D]">
            What Parents Say about us ?
          </h3>
          <Carousel
            opts={{ loop: true, align: "start", duration: 200 }}
            plugins={[
              Autoplay({
                stopOnMouseEnter: true,
                stopOnInteraction: false,
              }),
            ]}
          >
            <CarouselContent>
              {TESTIOMONIALS.map((testimonial, idx) => (
                <CarouselItem key={idx} className="md:basis-1/2 ">
                  <SocialProofCard
                    variation="testimonial"
                    fullName={testimonial.fullName}
                    avatarImg={testimonial.avatarImg}
                    feedbackMessage={testimonial.feedbackMessage}
                    feedbackRating={testimonial.feedbackRating}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div> */}
        {/* <div className="container mx-auto px-5 text-purple-dark">
          <ContactUs />
        </div> */}
      </main>
      <CallToAction cta="Get Started" />
    </>
  );
}

export default AboutPage;
