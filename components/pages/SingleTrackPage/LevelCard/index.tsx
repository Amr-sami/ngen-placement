import React from "react";
import { LevelCardProps } from "../types";
import Rating from "@/components/general/Rating";
import Tag from "@/components/general/Tag";
import Image from "next/image";
import Link from "next/link";

function LevelCard({
  name,
  description,
  duration,
  assessmentsNumber,
  lecturesNumber,
  mainImage,
  rating,
  slug,
}: LevelCardProps) {
  return (
    <Link href={`/level/${slug}`}>
      <div className="rounded-3xl p-6 border-2 border-gray-default flex flex-col md:flex-row gap-6">
        <div className="xl:basis-1/5 sm:basis-2/5 border h-[175px] rounded-2xl self-center flex justify-center items-center md:p-2">
          <Image
            src={mainImage}
            width={340}
            height={185}
            alt="level placeholder alt"
          />
        </div>
        <div className="xl:basis-4/5 sm:basis-3/5 flex flex-col gap-2">
          <h3 className="text-3xl text-purple-dark">{name}</h3>
          <div className="lg:hidden">
            <Rating feedbackRating={rating} />
          </div>
          <p className="text-2xl text-gray-dark">{description}</p>
          <div className="flex justify-between md:justify-start items-center md:gap-8">
            <div className="hidden lg:block">
              <Rating feedbackRating={rating} />
            </div>
            <Tag
              icon="/assets/images/icons/duration-icon.svg"
              text={`${duration} Hours`}
              alt="duration icon"
            />
            <Tag
              icon="/assets/images/icons/courses-icon.svg"
              text={`${lecturesNumber} Lectures`}
              alt="Lectures icon"
            />
            <Tag
              icon="/assets/images/icons/assessments-icon.svg"
              text={`${assessmentsNumber} Assessment`}
              alt="assessment icon"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default LevelCard;
