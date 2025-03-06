import React from "react";
import { LevelCardProps } from "../types";
import LevelCard from "../LevelCard";

function LevelsList() {
  const DATA: LevelCardProps[] = [
    {
      name: "Photoshop",
      slug: "course",
      description:
        "Our mission is simple: to make modern, industry-relevant skills accessible and enjoyable for teenagers. We combine live, expert-led courses with interactive tools to help students ",
      mainImage: "/assets/images/level-placeholder.png",
      duration: 40,
      assessmentsNumber: 8,
      lecturesNumber: 20,
      rating: 5,
    },
    {
      name: "Illustrator",
      slug: "course",
      description:
        "Our mission is simple: to make modern, industry-relevant skills accessible and enjoyable for teenagers. We combine live, expert-led courses with interactive tools to help students ",
      mainImage: "/assets/images/level-placeholder.png",
      duration: 50,
      assessmentsNumber: 8,
      lecturesNumber: 20,
      rating: 3,
    },
  ];

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-2xl lg:text-4xl text-pumpkin font-bold">Levels</h2>
      {DATA.map((level, idx) => (
        <LevelCard
          key={idx}
          name={level.name}
          description={level.description}
          mainImage={level.mainImage}
          duration={level.duration}
          assessmentsNumber={level.assessmentsNumber}
          lecturesNumber={level.lecturesNumber}
          rating={level.rating}
          slug={level.slug}
        />
      ))}
    </section>
  );
}

export default LevelsList;
