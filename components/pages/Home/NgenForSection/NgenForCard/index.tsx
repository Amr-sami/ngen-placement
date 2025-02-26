import Logo from "@/components/general/Logo";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { NgenForCardType } from "../types";

function NgenForCard({
  image,
  variation,
  title,
  description,
  href,
  alt,
}: NgenForCardType) {
  if (variation === "logo") {
    return (
      <div className="bg-white rounded-3xl justify-center items-center hidden xl:flex">
        <div className="lg:max-w-56 2xl:max-w-80">
          <Logo width={300} height={80} />
        </div>
      </div>
    );
  } else if (variation === "text") {
    return (
      <div className="bg-white rounded-3xl bg-[url('/assets/images/box-bg.png')] justify-center items-center hidden xl:flex">
        <div className="text-4xl font-protestRiot max-w-64 flex flex-col text-center leading-relaxed gap-2">
          <h3 className="text-5xl text-rose">{title}</h3>
          <p className="text-blueberry">{description}</p>
        </div>
      </div>
    );
  } else {
    return (
      <>
        {href && (
          <Link href={href} className="relative [&_p]:hidden [&_p]:hover:block">
            {image && alt && (
              <Image
                src={image}
                width={700}
                height={450}
                className="w-full h-full"
                alt={alt}
              />
            )}
            <div className="absolute bottom-0 bg-gradient-to-t from-black to-black/20 text-white w-full rounded-b-3xl px-9 py-8">
              <h3 className="text-4xl font-protestRiot">{title}</h3>
              <p className="text-xl">{description}</p>
            </div>
          </Link>
        )}
      </>
    );
  }
}

export default NgenForCard;
