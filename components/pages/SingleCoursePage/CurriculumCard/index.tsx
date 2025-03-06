import Tag from "@/components/general/Tag";
import React from "react";

function CurriculumCard({
  name,
  description,
  duration,
}: {
  name: string;
  description: string;
  duration: number;
}) {
  return (
    <div className="rounded-3xl p-6 border-2 border-gray-default flex flex-col md:flex-row gap-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-3xl text-purple-dark">{name}</h3>
        <p className="text-2xl text-gray-dark">{description}</p>
        <div className="flex justify-between md:justify-start items-center md:gap-8">
          <Tag
            icon="/assets/images/icons/duration-icon.svg"
            text={`${duration} Hours`}
            alt="duration icon"
          />
        </div>
      </div>
    </div>
  );
}

export default CurriculumCard;
