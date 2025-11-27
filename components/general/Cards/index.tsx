'use client';
import React from 'react';
import Button from '../Button';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { getTrackRoute } from '@/util/routes';
import type { Locale } from '@/i18n';

type Props = {
  image: string;
  title: string;
  slug: string;
  status: string;
  discountValue: string;
  numberOfLevels: string;
  duration: string;
  skillLevel: string;
};

function Card({
  image,
  title,
  slug,
  status,
  // discountValue,
  numberOfLevels,
  duration,
  skillLevel,
}:
Props) {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'en';

  return (
    <div className="bg-[#F5F5F5] rounded-2xl grid grid-rows-subgrid row-span-6 my-2 lg:my-5 border-[#F5F5F5] border-solid border-2">
      <div className="">
        <Image
          src={image}
          height={150}
          width={275}
          alt={`${title}`}
          className="w-full h-auto rounded-t-2xl"
        />
      </div>
      <div className="px-4 sm:px-6 py-4 grid grid-rows-subgrid row-span-5 gap-y-2">
        <div className="flex flex-wrap justify-between gap-2">
          <h3 className="text-purple-dark font-bold break-words">{title}</h3>
          <div>
            <p
              className={`px-2 py-1 rounded-2xl text-white text-xs font-extrabold ${
                status.toLocaleLowerCase() === 'upcoming'
                  ? 'bg-pumpkin'
                  : 'bg-green'
              }`}
            >
              {status}
            </p>
          </div>
        </div>
        {/* <p className="text-pumpkin font-bold text-sm">{discountValue} OFF</p> */}
        <p className="text-sm">{numberOfLevels} sessions included</p>
        <div className="flex flex-col sm:flex-row justify-between text-xs md:text-sm text-[#655B62] gap-2">
          <div className="flex items-center gap-2">
            <Image
              src="/assets/images/icons/duration-icon.svg"
              width={20}
              height={20}
              alt="duration icon"
            />
            <p>{duration} Hours</p>
          </div>
          <div className="flex items-center gap-2">
            <Image
              src="/assets/images/icons/papers-icon.svg"
              width={20}
              height={20}
              alt="skill level icon"
            />
            <p>{skillLevel}</p>
          </div>
        </div>
        <div className="pt-1">
          <Button variant="secondary" href={getTrackRoute(locale, slug)} takeFullWidth>
            More Details
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Card;
