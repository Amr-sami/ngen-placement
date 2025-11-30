import Card from '@/components/general/Cards';
import { H2 } from '@/components/general/Heading';
import React from 'react';
import tracks from '../../../app/[locale]/(marketing)/tracks/[slug]/data.json';

type TracksSectionProps = {
  title: string;
  showBuiltSystemsIntro?: boolean;
  builtSystemsIntroText?: string;
};

function HomepageTracksSection({
  title,
  showBuiltSystemsIntro = false,
  builtSystemsIntroText,
}: TracksSectionProps) {
  return (
    <section className="py-6 md:py-10 lg:py-20">
      <div className="container mx-auto px-5 flex flex-col gap-4 md:gap-7 lg:gap-10">
        <div className="flex flex-col gap-2">
          <H2>{title}</H2>
          {showBuiltSystemsIntro && builtSystemsIntroText && (
            <p className="max-w-3xl text-base md:text-lg lg:text-xl text-gray-dark font-medium">
              {builtSystemsIntroText}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-6 lg:gap-y-8">
          {tracks.map((track, idx) => (
            <Card
              key={idx}
              image={track.image}
              title={track.name}
              slug={track.slug}
              status={track.status}
              discountValue={track.discountValue}
              numberOfLevels={track.numberOfLevels}
              duration={track.duration}
              skillLevel={track.skillLevel}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomepageTracksSection;
