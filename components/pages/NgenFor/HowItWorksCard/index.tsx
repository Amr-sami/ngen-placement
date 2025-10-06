import React from "react";
import Image from "next/image";
import { IHowItWorksCardProps } from "../types";

const HowItWorksCard: React.FC<IHowItWorksCardProps> = ({
  classNames,
  imgSrc,
  title,
  desc,
  altText,
  bgColor,
}) => {
  return (
    <div
      className={`flex flex-col p-6 rounded-[14px] ${bgColor} ${classNames} h-full`}
    >
      <div className="flex justify-center mb-4">
        <Image src={imgSrc} width={92} height={92} alt={altText} />
      </div>
      <h2 className="text-xl text-purple-darker font-semibold text-center mb-4">
        {title}
      </h2>
      {/*TODO: USE THE HEADING COMPONENT INSTEAD OF h2 TAG*/}
      <p className="text-purple-dark h-full">{desc}</p>
    </div>
  );
};

export default HowItWorksCard;
