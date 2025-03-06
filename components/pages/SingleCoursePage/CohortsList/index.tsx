import React from "react";
import CohortCard from "../CohortCard";

function CohortList({
  cohorts,
}: {
  cohorts: {
    title: string;
    age_group: string;
    date: string;
    duration: number;
  }[];
}) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-2xl lg:text-4xl text-pumpkin font-bold">
        Upcoming cohorts
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cohorts &&
          cohorts.map((cohort, idx) => (
            <CohortCard
              key={idx}
              title={cohort.title}
              date={cohort.date}
              ageGroup={cohort.age_group}
              duration={cohort.duration}
            />
          ))}
      </div>
    </section>
  );
}

export default CohortList;
