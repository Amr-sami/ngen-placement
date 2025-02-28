import { H2 } from "@/components/general/Heading";
import React from "react";
import NgenForCard from "./NgenForCard";
import { NgenForCardType } from "./types";
import { ROUTES } from "@/util/routes";

function HomepageNgenForSection() {
  // TODO: Redesign this section
  const DATA: NgenForCardType[] = [
    {
      image: "/assets/images/NgenFor/kid-on-laptop.png",
      alt: "kid on laptop",
      title: "Individuals",
      description:
        "we offer an exciting and engaging learning experience based on modern educational principles.",
      href: "#",
    },
    {
      variation: "logo",
    },
    {
      image: "/assets/images/NgenFor/school-grad.png",
      alt: "school graduation cermoney",
      title: "Schools",
      description:
        "We offer a unique LMS experience with regular detailed reports and workshops to support teacher development.",
      href: ROUTES.NGEN_FOR.FOR_SCHOOL,
    },
    {
      title: "Empower",
      description: "Your Creativity and Curiosity",
      variation: "text",
    },

    {
      image: "/assets/images/NgenFor/corperate-kid.png",
      alt: "corporate kids image",
      title: "Corporates",
      description:
        "We provide high-quality training programs tailored for employees' children at competitive prices.",
      href: ROUTES.NGEN_FOR.FOR_CORPORATES,
    },
    {
      image: "/assets/images/NgenFor/parent-with-kid.png",
      alt: "parent with kid",
      title: "Parents",
      description:
        "We offer an educational experience that strengthens parent-child communication through awareness workshops for parents and student progress reports.",
      href: ROUTES.NGEN_FOR.FOR_PARENTS,
    },
  ];

  return (
    <section className="bg-purple-light py-6 md:py-10 lg:py-20">
      <div className="container mx-auto px-5 flex flex-col gap-10">
        <H2>Ngen For</H2>
        <div className="grid grid-cols-1 grid-rows-4 gap-6 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-3 lg:[&>*:nth-child(1)]:row-span-2 lg:[&>*:nth-child(6)]:col-span-2 xl:[&>*:nth-child(6)]:col-span-1 xl:grid-cols-[minmax(345px,1fr)_minmax(335px,1fr)_minmax(515px,1fr)] xl:grid-rows-[115px_310px_225px] xl:[&>*:nth-child(1)]:row-span-2 xl:[&>*:nth-child(3)]:row-span-2 xl:[&>*:nth-child(5)]:col-span-2">
          {DATA.map((el, idx) => (
            <NgenForCard
              key={idx}
              image={el.image}
              variation={el.variation}
              title={el.title}
              description={el.description}
              href={el.href}
              alt={el.alt}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomepageNgenForSection;
