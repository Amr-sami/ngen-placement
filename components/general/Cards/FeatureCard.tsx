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
      className={`min-h-[250px] sm:min-h-[300px] lg:min-h-[350px] p-4 sm:p-6 lg:p-0 text-white flex flex-col gap-4 sm:gap-6 lg:gap-10 rounded-3xl ${
        variant === "image-left" ? "lg:flex-row bg-purple-darker" : "lg:flex-row-reverse bg-[#74086D]"
      }`}
    >
      <div className="lg:basis-1/3 flex justify-center">
        <Image
          src={image}
          alt="space"
          width={300}
          height={300}
          className="w-auto h-auto max-h-[200px] sm:max-h-[250px] lg:max-h-none lg:w-full lg:h-full lg:scale-105"
        />
      </div>
      <div
        className={`lg:basis-2/3 flex-col justify-center flex gap-1 md:gap-4 text-center lg:text-start px-2 ${
          variant === "image-left" ? "lg:max-w-screen-md" : "lg:max-w-4xl"
        }`}
      >
        <h3 className={`text-xl sm:text-2xl lg:text-5xl font-protestRiot ${
          variant === "image-left" ? "text-rose" : "text-[#FFC3DE]"
        }`}>
          {title}
        </h3>
        <p className="text-sm sm:text-base lg:text-2xl">{description}</p>
      </div>
    </div>
  );
}

export default FeatureCard;
