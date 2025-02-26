import React from "react";
import Image from "next/image";
import kidsOnLaptop from "@/public/assets/images/kids-on-laptop.png";
import Button from "../../../general/Button";
import { H2 } from "@/components/general/Heading";

function HomepageAboutSection() {
  return (
    <section className="bg-purple-light py-6 md:py-10 lg:py-20">
      <div className="container mx-auto px-5 flex items-center gap-20">
        <div className="hidden lg:basis-1/3 lg:block">
          <Image src={kidsOnLaptop} alt="kids on laptop" />
        </div>
        <div className="lg:basis-2/3 flex flex-col gap-4 text-purple-dark">
          <div className="flex justify-between items-center">
            <H2>About us</H2>
            {/* <Button href="/about" variant="secondary">
              See more
            </Button> */}
          </div>
          <div>
            <p className="text-sm md:text-lg lg:text-2xl">
              At NGen, we turn learning into an adventure! Kids dive into modern
              technology with excitement and purpose through live sessions and
              hands-on challenges.​ Every experience is crafted with care,
              blending innovative curricula and dynamic activities designed to
              spark curiosity and unleash potential. Here, young minds become
              digital ninjas—agile, sharp, and ready to conquer the future.​
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomepageAboutSection;
