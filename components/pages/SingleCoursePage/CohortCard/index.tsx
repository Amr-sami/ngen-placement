import Image from "next/image";
import React from "react";

function CohortCard({
  title,
  ageGroup,
  date,
  duration,
}: {
  title: string;
  ageGroup: string;
  date: string;
  duration: number;
}) {
  return (
    <div className="p-4 bg-green/30 flex gap-4 rounded-3xl min-h-44 h-full">
      <div className="rounded-2xl basis-1/2 p-2">
        <Image
          src="/assets/images/level-placeholder.png"
          alt="Cohort image"
          width={337}
          height={183}
          className="h-full w-full rounded-2xl"
        />
      </div>
      <div className="basis-1/2 flex flex-col gap-2 self-center">
        <h3 className="font-bold text-purple-dark text-2xl">{date}</h3>
        <div className="flex items-center gap-2 text-[#655B62] text-xs">
          <Image
            src={"/assets/images/icons/purple-courses-icon.svg"}
            width={18}
            height={18}
            alt="cohort title icon"
          />
          <p>{title}</p>
        </div>
        <div className="flex items-center gap-2 text-[#655B62] text-xs">
          <Image
            src="/assets/images/icons/purple-age-group-icon.svg"
            width={18}
            height={18}
            alt="age group icon"
          />
          <p>{ageGroup}</p>
        </div>
        <div className="flex items-center gap-2 text-[#655B62] text-xs">
          <Image
            src="/assets/images/icons/purple-duration-icon.svg"
            width={18}
            height={18}
            alt="duration icon"
          />
          <p>{duration}</p>
        </div>
      </div>
    </div>
  );
}

export default CohortCard;
