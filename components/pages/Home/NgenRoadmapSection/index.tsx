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
        "Students learn the essentials, what machines are, algorithms as steps, digital patterns, and basic AI fairness, building the base for all tech learning.",
      image: "/assets/images/placeholder.svg",
      variants: undefined,
    },
    {
      title: "Level 2 Introduction",
      description:
        "Learners master block coding (Scratch): events, loops, conditionals, variables, then scale to bigger systems (lists/functions) plus simple data → charts and an AI assistant.",
      image: "/assets/images/placeholder-1.svg",
      variant: "image-right",
    },
    {
      title: "Level 3 Intermediate",
      description:
        "Students think like data scientists: plan/collect/clean data, tell stories with charts, try ML concepts, evaluate models (accuracy/recall), and tackle bias with a mini-startup brief.",
      image: "/assets/images/placeholder.svg",
      variants: undefined,
    },
    {
      title: "Level 4 Advanced",
      description:
        "Builders ship real ML apps: Python/Colab, pandas, train/test with baselines, intro Keras, Git/GitHub, and simple UIs (Streamlit/Gradio) with usability + ethics reviews.",
      image: "/assets/images/placeholder-1.svg",
      variant: "image-right",
    },
    {
      title: "Level 5 Mastery",
      description:
        "Two tracks: AI Research (literature → baseline reproduction → original contribution) or AI Leadership (product, policy, and impact). Publish, present, or launch.",
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
