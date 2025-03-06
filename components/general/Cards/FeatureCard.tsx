import React from "react";
import Image from "next/image";

type Props = {
  title: string;
  description: string;
  image: string;
  variant?: "image-left" | "image-right" | undefined;
};

function FeatureCard({
  image,
  title,
  description,
  variant = "image-left",
}: Props) {
  return (
    <div
      className={`lg:min-h-[350px] lg:p-0 text-white flex flex-col gap-6 lg:gap-10 rounded-3xl p-6 ${
        variant === "image-left" ? "lg:flex-row bg-purple-darker" : "lg:flex-row-reverse bg-[#74086D]"
      }`}
    >
      <div className="lg:basis-1/3">
        <Image
          src={image}
          alt="space"
          width={400}
          height={400}
          className="w-full h-full lg:scale-105"
        />
      </div>
      <div
        className={`lg:basis-2/3 flex-col justify-center flex gap-1 md:gap-4 text-center lg:text-start  ${
          variant === "image-left" ? "lg:max-w-screen-md" : "lg:max-w-4xl"
        }`}
      >
        <h3 className={`text-2xl lg:text-5xl font-protestRiot ${
          variant === "image-left" ? "text-rose" : "text-[#FFC3DE]"
        }`}>
          {title}
        </h3>
        <p className="lg:text-2xl">{description}</p>
      </div>
    </div>
  );
}

export default FeatureCard;
