import React from "react";
import FeatureCard from "../../../general/Cards/FeatureCard";
import { H2 } from "@/components/general/Heading";

function HomepageNgenRoadmapSection() {
  const DATA = [
    {
      title: "1.Foundation levels",
      description:
        "students will learn the essential basics that form the foundation for any technology-related learning. Once they’ve mastered these fundamentals, they’ll move on to specialize in their chosen track.",
      image: "/assets/images/placeholder.png",
      variants: undefined,
    },
    {
      title: "2.Specified levels",
      description:
        "The specialized track starts at the beginner level and progresses to advanced. Students will advance through exams and projects, ensuring mastery of each level before moving forward.",
      image: "/assets/images/placeholder-1.png",
      variant: "image-right",
    },
  ];

  return (
    <section className="bg-purple-lighter py-6 md:py-10 lg:py-20">
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
