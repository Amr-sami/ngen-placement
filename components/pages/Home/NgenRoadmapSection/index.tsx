"use client";

import React from "react";
import FeatureCard from "../../../general/Cards/FeatureCard";
import { H2 } from "@/components/general/Heading";
import arrow1 from "@/public/assets/images/arrow-1.svg";
import arrow2 from "@/public/assets/images/arrow-2.svg";
import Image from "next/image";
import { useTranslations } from "next-intl";

type TrackKey =
  | "dataScience"
  | "programming"
  | "artificialIntelligence"
  | "creativeArts"
  | "robotics"
  | "cybersecurity";

type RoadmapTrack = {
  id: string;
  trackKey: TrackKey;
  image: string;
  variant?: "image-left" | "image-right";
};

const TRACKS_DATA: RoadmapTrack[] = [
  {
    id: "artificial-intelligence",
    trackKey: "artificialIntelligence",
    image: "/assets/images/placeholder.svg",
    variant: "image-left",
  },
  {
    id: "programming",
    trackKey: "programming",
    image: "/assets/images/placeholder-1.svg",
    variant: "image-right",
  },
  {
    id: "data-science",
    trackKey: "dataScience",
    image: "/assets/images/placeholder.svg",
    variant: "image-left",
  },
  {
    id: "cybersecurity",
    trackKey: "cybersecurity",
    image: "/assets/images/placeholder-1.svg",
    variant: "image-right",
  },
  {
    id: "robotics",
    trackKey: "robotics",
    image: "/assets/images/placeholder.svg",
    variant: "image-left",
  },
  {
    id: "creative-arts",
    trackKey: "creativeArts",
    image: "/assets/images/placeholder-1.svg",
    variant: "image-right",
  },
];

function HomepageNgenRoadmapSection() {
  const t = useTranslations("home.roadmap");

  return (
    <section className="bg-purple-lighter py-6 md:py-10 lg:py-20 relative">
      <Image
        src={arrow1}
        alt="arrow"
        className="absolute top-0 ltr:right-0 rtl:left-0 hidden ltr:-translate-x-[5%] rtl:translate-x-[5%] translate-y-[5%] lg:block z-50 rtl:scale-x-[-1]"
      />
      <Image
        src={arrow2}
        alt="arrow"
        className="absolute bottom-0 ltr:right-1/4 rtl:left-1/4 translate-y-1/2 hidden lg:block z-50 rtl:scale-x-[-1]"
      />
      <div className="container mx-auto px-5 flex flex-col gap-4 md:gap-7 lg:gap-12">
        <div className="flex flex-col gap-2">
          <H2>{t("title")}</H2>
          <p className="text-gray-tertiary text-sm md:text-base lg:text-lg max-w-3xl">
            {t("subtitle")}
          </p>
        </div>
        <div className="flex flex-col gap-6 lg:gap-10">
          {TRACKS_DATA.map((track) => (
            <FeatureCard
              key={track.id}
              title={t(`tracks.${track.trackKey}.title`)}
              description={t(`tracks.${track.trackKey}.description`)}
              image={track.image}
              variant={track.variant}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomepageNgenRoadmapSection;
