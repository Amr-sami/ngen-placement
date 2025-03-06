import React from "react";
import { SocialProofCardProps } from "../types";
import Image from "next/image";
import Rating from "@/components/general/Rating";

function SocialProofCard({
  variation,
  image,
  feedbackMessage,
  feedbackRating,
  avatarImg,
  fullName,
}: SocialProofCardProps) {
  // Rendering the card
  if (variation === "images" && !!image) {
    return (
      <div>
        <Image
          src={image}
          width={500}
          height={250}
          alt="video placeholder"
          className="w-full h-full"
        />
      </div>
    );
  } else {
    return (
      <div className="bg-[#F4F4F4] px-6 py-4 rounded-2xl flex items-center gap-4">
        <div className="basis-1/4 self-start md:basis-auto md:self-center">
          {avatarImg && (
            <Image
              src={avatarImg}
              width={100}
              height={100}
              alt="video placeholder"
              className="w-full h-full"
            />
          )}
        </div>
        <div className="flex flex-col basis-3/4">
          <h4 className="text-purple-dark">{fullName}</h4>
          <p className="text-xs">{feedbackMessage}</p>
          {feedbackRating && <Rating feedbackRating={feedbackRating} />}
        </div>
      </div>
    );
  }
}

export default SocialProofCard;
