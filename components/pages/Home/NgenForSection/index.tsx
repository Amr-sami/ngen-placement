import { H2 } from '@/components/general/Heading';
import React from 'react';
import NgenForCard from './NgenForCard';
import { NgenForCardType } from './types';
import { ROUTES } from '@/util/routes';
import Link from 'next/link';
import Image from 'next/image';

function HomepageNgenForSection() {
  // TODO: Redesign this section
  const DATA: NgenForCardType[] = [
    {
      image: '/assets/images/NgenFor/kid-on-laptop.png',
      alt: 'kid on laptop',
      title: 'Individuals',
      description:
        'we offer an exciting and engaging learning experience based on modern educational principles.',
      preferredColor: '',
      href: '#',
    },
    {
      image: '/assets/images/NgenFor/school-grad.png',
      alt: 'school graduation cermoney',
      title: 'Schools',
      description:
        'We offer a unique LMS experience with regular detailed reports and workshops to support teacher development.',
      preferredColor: '',
      href: ROUTES.NGEN_FOR.FOR_SCHOOL,
    },
    {
      image: '/assets/images/NgenFor/corperate-kid.png',
      alt: 'corporate kids image',
      title: 'Corporates',
      description:
        "We provide high-quality training programs tailored for employees' children at competitive prices.",
      preferredColor: '',
      href: ROUTES.NGEN_FOR.FOR_CORPORATES,
    },
    {
      image: '/assets/images/NgenFor/parent-with-kid.png',
      alt: 'parent with kid',
      title: 'Parents',
      description:
        'We offer an educational experience that strengthens parent-child communication through awareness workshops for parents and student progress reports.',
      preferredColor: '',
      href: ROUTES.NGEN_FOR.FOR_PARENTS,
    },
  ];

  return (
    <section className="bg-[#F7F7F7] py-6 md:py-10 lg:py-20">
      <div className="container mx-auto px-5 flex flex-col gap-10">
        <H2>Ngen For</H2>
        <div className="flex justify-between h-[665px]">
          <Link href="#" className="basis-1/4">
            <div className="h-[54%] bg-[#C2CBEF]">
              <p className="font-protestRiot text-[40px] text-center pt-11 text-[#4E63BE]">
                For Indviduals
              </p>
              <Image
                src="/assets/images/NgenFor/for-indviduals.png"
                width={260}
                height={280}
                className="mx-auto"
                alt="for indviduals"
              />
            </div>
            <div className="h-[46%] bg-[#627CEE] px-6 pt-10 text-2xl text-center text-white font-nunito">
              we offer an exciting and engaging learning experience based on
              modern educational principles.
            </div>
          </Link>

          <Link href={ROUTES.NGEN_FOR.FOR_SCHOOL} className="basis-1/4">
            <div className="h-[50%] bg-[#FDBEDA]">
              <p className="font-protestRiot text-[40px] text-center pt-11 text-[#F659A0]">
                For Schools
              </p>
              <Image
                src="/assets/images/NgenFor/for-schools.png"
                width={297}
                height={228}
                className="mx-auto"
                alt="for indviduals"
              />
            </div>
            <div className="h-[50%] bg-[#F659A0] px-6 pt-10 text-2xl text-center text-white font-nunito">
              We offer a unique LMS experience with regular detailed reports and
              workshops to support teacher development.
            </div>
          </Link>

          <Link href={ROUTES.NGEN_FOR.FOR_CORPORATES} className="basis-1/4">
            <div className="h-[54%] bg-[#FFEEE3]">
              <p className="font-protestRiot text-[40px] text-center pt-11 text-[#FF7723]">
                For Corporates
              </p>
              <Image
                src="/assets/images/NgenFor/for-corporates.png"
                width={271}
                height={260}
                className="mx-auto"
                alt="for indviduals"
              />
            </div>
            <div className="h-[46%] bg-[#FF7723] px-6 pt-10 text-2xl text-center text-white font-nunito">
              We provide high-quality training programs tailored for employees'
              children at competitive prices.
            </div>
          </Link>

          <Link href={ROUTES.NGEN_FOR.FOR_PARENTS} className="basis-1/4">
            <div className="h-[50%] bg-[#E4FFF2]">
              <p className="font-protestRiot text-[40px] text-center pt-11 text-[#0BCA6C]">
                For Parents
              </p>
              <Image
                src="/assets/images/NgenFor/for-parents.png"
                width={270}
                height={228}
                className="mx-auto"
                alt="for indviduals"
              />
            </div>
            <div className="h-[50%] bg-[#0BCA6C] px-6 pt-10 text-2xl text-center text-white font-nunito">
              We offer an educational experience that strengthens parent-child
              communication through awareness workshops for parents and student
              progress reports."
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HomepageNgenForSection;
