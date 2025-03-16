import React from 'react';
import { LevelCardProps } from '../types';
import LevelCard from '../LevelCard';

function LevelsList({ levels }: { levels: LevelCardProps[] }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-2xl lg:text-4xl text-pumpkin font-bold">Levels</h2>
      {levels.map((level, idx) => (
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
