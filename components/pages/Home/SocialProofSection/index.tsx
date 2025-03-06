"use client";
import { H2 } from "@/components/general/Heading";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import React from "react";
import SocialProofCard from "./SocialProofCard";
import Autoplay from "embla-carousel-autoplay";

function HomePageSocialProofSection() {
  const DATA = [
    { image: "/assets/images/video-placeholder.png" },
    { image: "/assets/images/video-placeholder.png" },
    { image: "/assets/images/video-placeholder.png" },
    { image: "/assets/images/video-placeholder.png" },
    { image: "/assets/images/video-placeholder.png" },
    { image: "/assets/images/video-placeholder.png" },
    { image: "/assets/images/video-placeholder.png" },
    { image: "/assets/images/video-placeholder.png" },
    { image: "/assets/images/video-placeholder.png" },
  ];

  const TESTIOMONIALS = [
    {
      fullName: "Mona Elmohandes",
      avatarImg: "/assets/images/avatar-man-placeholder.png",
      feedbackMessage:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
      feedbackRating: 5,
    },
    {
      variation: "testimonial",
      fullName: "Mona Elmohandes",
      avatarImg: "/assets/images/avatar-man-placeholder.png",
      feedbackMessage:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
      feedbackRating: 3,
    },
    {
      variation: "testimonial",
      fullName: "Mona Elmohandes",
      avatarImg: "/assets/images/avatar-man-placeholder.png",
      feedbackMessage:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
      feedbackRating: 1,
    },
  ];

  return (
    <section className="py-6 md:py-10 lg:py-20">
      <div className="container mx-auto px-5 flex flex-col gap-4 lg:gap-10">
        <H2>About our Journey</H2>
        <div className="flex flex-col gap-4 lg:gap-20">
          <div className="flex flex-col gap-4 lg:gap-10">
            <h3 className="text-xl md:text-2xl lg:text-4xl font-protestRiot text-[#BD256D]">
              Student work
            </h3>
            <Carousel
              opts={{ loop: true, align: "start", duration: 30 }}
              plugins={[
                Autoplay({
                  stopOnMouseEnter: true,
                  stopOnInteraction: false,
                }),
              ]}
            >
              <CarouselContent>
                {DATA.map((image, idx) => (
                  <CarouselItem key={idx} className="md:basis-1/4 ">
                    <SocialProofCard variation="images" image={image.image} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
          <div className="flex flex-col gap-4 lg:gap-10">
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
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomePageSocialProofSection;
