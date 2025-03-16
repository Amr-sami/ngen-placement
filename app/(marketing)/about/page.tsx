'use client';
import { CallToAction /*,ContactUs*/ } from '@/components/general';
import { H2 } from '@/components/general/Heading';
// import SocialProofCard from "@/components/pages/Home/SocialProofSection/SocialProofCard";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
// } from "@/components/ui/carousel";
import Image from 'next/image';
import React from 'react';
// import Autoplay from "embla-carousel-autoplay";
import bgImageDesktop from '@/public/assets/images/about-page-bg.png';
import bgImageMob from '@/public/assets/images/about-page-bg-mob.png';

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

function AboutPage() {
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
                  Who we are
                </h1>
                <p>
                  NGen is a virtual school that teaches modern technology to
                  students aged 8 to 18 through gamified learning experiences.
                  It offers interactive programs designed to develop their
                  cognitive and problem-solving skills. The platform aims to
                  nurture intelligent, resilient learners
                  prepared for the future
                </p>
              </div>
              <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
                <H2>Our mission</H2>
                <p>
                  To empower students with the knowledge, skills, and innovative
                  mindset needed to thrive in a technology-driven world. We
                  provide a dynamic learning environment that fosters
                  creativity, collaboration, and critical thinking through
                  cutting-edge technology education and hands-on experiences.
                </p>
              </div>
              <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
                <H2>Our vision</H2>
                <p>
                  To be a leading educational institution recognized for
                  nurturing the next generation of tech leaders and innovators.
                  We envision a future where every student is equipped with the
                  digital literacy and problem-solving skills necessary to
                  succeed and positively impact their communities and the world.
                </p>
              </div>
            </div>
            <div className="basis-3/6 justify-center hidden lg:flex">
              <Image
                src="/assets/images/about-img.png"
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
