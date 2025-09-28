import React from "react";
import FeatureCard from "../../../general/Cards/FeatureCard";
import { H2 } from "@/components/general/Heading";
import arrow1 from "@/public/assets/images/arrow-1.svg"
import arrow2 from "@/public/assets/images/arrow-2.svg"
import Image from "next/image";

function HomepageNgenRoadmapSection() {
  const DATA = [
    {
      title: "Level 1 Foundation",
      description:
        "Students learn essential concepts including machine fundamentals, algorithmic thinking, pattern recognition, and AI ethics principles. This level builds a strong foundation for all future technology learning.",
      image: "/assets/images/placeholder.svg",
      variants: undefined,
    },
    {
      title: "Level 2 Introduction",
      description:
        "Students master block-based programming with Scratch, learning events, loops, conditionals, and variables. They advance to more complex systems using lists and functions, while exploring data visualization and basic AI assistants.",
      image: "/assets/images/placeholder-1.svg",
      variant: "image-right",
    },
    {
      title: "Level 3 Intermediate",
      description:
        "Students develop data science skills including data collection planning, data cleaning techniques, and storytelling through charts. They explore machine learning concepts, model evaluation methods, and address bias through mini-startup projects.",
      image: "/assets/images/placeholder.svg",
      variants: undefined,
    },
    {
      title: "Level 4 Advanced",
      description:
        "Students build real machine learning applications using Python, Colab, and pandas. They learn proper testing methodologies, explore neural networks with Keras, use version control with Git/GitHub, and develop user interfaces with Streamlit or Gradio, all while considering usability and ethics.",
      image: "/assets/images/placeholder-1.svg",
      variant: "image-right",
    },
    {
      title: "Level 5 Mastery",
      description:
        "Students choose between two specialized tracks: AI Research, where they analyze literature, reproduce baseline models, and make original contributions; or AI Leadership, focusing on product development, policy creation, and measuring impact. Both tracks culminate in publishing, presenting, or launching their work.",
      image: "/assets/images/placeholder.svg",
      variants: undefined,
    },
  ];

  return (
    <section className="bg-purple-lighter py-6 md:py-10 lg:py-20 relative">
      <Image src={arrow1} alt="arrow" className="absolute top-0 right-0 hidden -translate-x-[5%] translate-y-[5%] lg:block z-50" />
      <Image src={arrow2} alt="arrow" className="absolute bottom-0 right-1/4 translate-y-1/2 hidden lg:block z-50" />
      <div className="container mx-auto px-5 flex flex-col gap-4 md:gap-7 lg:gap-12">
        <div>
          <H2>NGEN Road Map (5 Levels Program)</H2>
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
