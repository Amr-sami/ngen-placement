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
      className={`flex flex-col items-center justify-between p-6 rounded-[14px] gap-4 ${bgColor} ${classNames}`}
    >
      <Image src={imgSrc} width={92} height={92} alt={altText} />
      <h2 className="text-xl text-purple-darker font-semibold text-center">
        {title}
      </h2>
      {/*TODO: USE THE HEADING COMPONENT INSTEAD OF h2 TAG*/}
      <p className="text-purple-dark">{desc}</p>
    </div>
  );
};

export default HowItWorksCard;
