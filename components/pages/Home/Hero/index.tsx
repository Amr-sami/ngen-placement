import React from "react";
import Logo from "../../../general/Logo";
import Image from "next/image";
import ninjaSpaceGuy from "@/public/assets/images/space-ninja-guy.png";
import Button from "../../../general/Button";

function HomepageHero() {
  return (
    <header className="bg-[url('/assets/images/hero-bg.png')] h-[60dvh] md:h-[calc(110dvh-81px)] bg-no-repeat bg-cover bg-bottom bg-purple-light text-white">
      <div className="container mx-auto px-5 flex h-full items-center justify-between">
        <div className="flex flex-col max-w-2xl gap-4 md:gap-8 lg:gap-16">
          <div>
            <Logo width={450} height={120} />
          </div>
          <div className="flex flex-col gap-4 md:gap-5 text-center md:text-start">
            <h1 className="font-protestRiot md:text-2xl lg:text-4xl">
              Future Innovators, Today's{" "}
              <span className="text-rose">Ninjas!</span>
            </h1>
            {/* <p className="text-sm md:text-base lg:text-2xl">
              Dive into Graphics, Data Science, and More with Courses Tailored
              for Future Innovators!
            </p> */}
            <Button variant="primary" href="/">
              Start your journey
            </Button>
          </div>
        </div>
        <div className="hidden md:block">
          <Image src={ninjaSpaceGuy} alt="Ninja space guy" />
        </div>
      </div>
    </header>
  );
}

export default HomepageHero;
