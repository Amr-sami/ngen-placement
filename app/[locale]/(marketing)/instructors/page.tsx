import { PageWrapper } from '@/components/general';
import { H2 } from '@/components/general/Heading';
import InstructorCard from '@/components/pages/Instructor/InstructorCard';
import React from 'react';

const Instructors = () => {
  return (
    <PageWrapper classNames="container mx-auto my-9 lg:mt-16">
      <H2 classNames="mb-4 lg:mb-10">Instructors</H2>

      <h3 className="font-bold text-xl text-pumpkin my-4 md:text-2xl xl:text-3xl">
        Programming
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-y-3 md:gap-x-3 lg:grid-cols-4 xl:gap-10 my-20">
        <InstructorCard />
        <InstructorCard />
        <InstructorCard />
        <InstructorCard />
      </div>

      <h3 className="font-bold text-xl text-pumpkin my-4 md:text-2xl xl:text-3xl">
        Graphics
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-y-3 md:gap-x-3 lg:grid-cols-4 xl:gap-10 my-20">
        <InstructorCard />
        <InstructorCard />
        <InstructorCard />
        <InstructorCard />
      </div>

      <h3 className="font-bold text-xl text-pumpkin my-4 md:text-2xl xl:text-3xl">
        Soft Skills
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-y-3 md:gap-x-3 lg:grid-cols-4 xl:gap-10 my-10 lg:my-20">
        <InstructorCard />
        <InstructorCard />
        <InstructorCard />
        <InstructorCard />
        <InstructorCard />
        <InstructorCard />
        <InstructorCard />
        <InstructorCard />
      </div>
    </PageWrapper>
  );
};

export default Instructors;
