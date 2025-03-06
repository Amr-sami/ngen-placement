import React from "react";
import CurriculumCard from "../CurriculumCard";

function CurriculumList({
  curriculum,
}: {
  curriculum: { name: string; description: string; duration: number }[];
}) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-2xl lg:text-4xl text-pumpkin font-bold">
        Curriculum overview
      </h2>
      {curriculum &&
        curriculum.map((LectureCategory, idx) => (
          <CurriculumCard
            key={idx}
            name={LectureCategory.name}
            description={LectureCategory.description}
            duration={LectureCategory.duration}
          />
        ))}
    </section>
  );
}

export default CurriculumList;
