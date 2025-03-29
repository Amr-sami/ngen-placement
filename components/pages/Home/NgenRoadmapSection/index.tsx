import React from "react";
import FeatureCard from "../../../general/Cards/FeatureCard";
import { H2 } from "@/components/general/Heading";
import arrow1 from "@/public/assets/images/arrow-1.svg"
import arrow2 from "@/public/assets/images/arrow-2.svg"
import Image from "next/image";

function HomepageNgenRoadmapSection() {
  const DATA = [
    {
      title: "1.Foundation levels",
      description:
        "students will learn the essential basics that form the foundation for any technology-related learning. Once they’ve mastered these fundamentals, they’ll move on to specialize in their chosen track.",
      image: "/assets/images/placeholder.svg",
      variants: undefined,
    },
    {
      title: "2.Specified levels",
      description:
        "The specialized track starts at the beginner level and progresses to advanced. Students will advance through exams and projects, ensuring mastery of each level before moving forward.",
      image: "/assets/images/placeholder-1.svg",
      variant: "image-right",
    },
  ];

  return (
    <section className="bg-purple-lighter py-6 md:py-10 lg:py-20 relative">
      <Image src={arrow1} alt="arrow" className="absolute top-0 right-0 hidden -translate-x-[5%] translate-y-[5%] lg:block z-50" />
      <Image src={arrow2} alt="arrow" className="absolute bottom-0 right-1/4 translate-y-1/2 hidden lg:block z-50" />
      <div className="container mx-auto px-5 flex flex-col gap-4 md:gap-7 lg:gap-12">
        <div>
          <H2>Ngen road map</H2>
        </div>
        <div className="flex flex-col gap-4 md:flex-row lg:flex-col lg:gap-10">
          {DATA.map((element, idx) => (
            <FeatureCard
              key={idx}
              title={element.title}
              description={element.description}
              image={element.image}
              variant={
                element.variant && element.variant === "image-right"
                  ? "image-right"
                  : undefined
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomepageNgenRoadmapSection;
