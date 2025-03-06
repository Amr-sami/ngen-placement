import React from "react";
import Image from "next/image";
import Rating from "../Rating";
import Tag from "../Tag";

// TODO: apply this component in the corperate, school and parents page

const OverviewCard: React.FC<{
  text?: string;
  imgSrc: string;
  feedbackRating?: number;
  lecturesNumber?: number;
  duration?: number;
  ageGroup?: string;
  coursesNumber?: number;
  assessmentNumber?: number;
  partnersImgs?: { src: string; alt: string }[];
  listText?: string[];
  variant?:
    | "overview"
    | "partners"
    | "coursePrerequisites"
    | "overviewCourseFeatures";
}> = ({
  text,
  imgSrc,
  feedbackRating,
  coursesNumber,
  assessmentNumber,
  variant = "overview",
  partnersImgs = undefined,
  lecturesNumber,
  duration = 0,
  ageGroup,
  listText,
}) => {
  // Partners variant is used in the single track page, While the course prerequisites is used in the single level/course page
  if (variant === "partners" || variant === "coursePrerequisites") {
    return (
      <section className="lg:bg-gray-default rounded-3xl p-6 flex justify-between gap-7 flex-col-reverse lg:flex-row">
        <div className="basis-4/5 flex flex-col gap-2">
          <h2 className="font-bold text-xl text-purple-dark md:text-2xl xl:font-medium xl:text-3xl">
            {variant === "partners"
              ? "Certification partners"
              : "Prerequisites"}
          </h2>
          {variant === "partners" && (
            <p className="text-xl lg:text-2xl text-gray-dark">{text}</p>
          )}
          {partnersImgs && variant === "partners" && (
            <div className="flex items-center justify-between flex-wrap md:justify-start xl:gap-8">
              {partnersImgs.map((image) => (
                <Image
                  key={image.alt}
                  src={image.src}
                  alt={image.alt}
                  width={75}
                  height={90}
                />
              ))}
            </div>
          )}
          {variant === "coursePrerequisites" && listText && (
            <ul className="flex flex-col list-disc list-inside text-gray-dark lg:text-2xl">
              {listText.map((textElement, idx) => (
                <li key={idx}>{textElement}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="lg:self-center basis-1/5">
          <Image src={imgSrc} alt="Tracks Overview" width={315} height={270} />
        </div>
      </section>
    );
  } else {
    // For both variants: Overview in single track page & overview in single level page
    return (
      <section className="lg:bg-gray-default rounded-3xl p-6 flex justify-between gap-7 flex-col-reverse lg:flex-row">
        <div className="basis-4/5 flex flex-col gap-2">
          <h2 className="font-bold text-xl text-purple-dark md:text-2xl xl:font-medium xl:text-3xl">
            Overview
          </h2>
          <p className="text-xl lg:text-2xl text-gray-dark">{text}</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-8">
            {/* Rating of both courses and tracks */}
            {feedbackRating && <Rating feedbackRating={feedbackRating} />}
            {/* Age group */}
            {ageGroup && (
              <Tag
                icon="/assets/images/icons/age-group-icon.svg"
                text={`${ageGroup}`}
                alt="age group icon"
              />
            )}
            {/* Duration for both track and course */}
            {duration && (
              <Tag
                icon="/assets/images/icons/duration-icon.svg"
                text={`${duration} Hours`}
                alt="duration icon"
              />
            )}
            {/* Specific to the tracks: tracks => courses */}
            {coursesNumber && (
              <Tag
                icon="/assets/images/icons/courses-icon.svg"
                text={`${coursesNumber} Levels`}
                alt="Level icon"
              />
            )}
            {/* Lectures numbers for both track and courses */}
            {lecturesNumber && (
              <Tag
                icon="/assets/images/icons/courses-icon.svg"
                text={`${lecturesNumber} Lectures`}
                alt="Lecture icon"
              />
            )}
            {/* assessments numbers for both track and courses */}
            {assessmentNumber && (
              <Tag
                icon="/assets/images/icons/assessments-icon.svg"
                text={`${assessmentNumber} Assessment`}
                alt="Assessment icon"
              />
            )}
          </div>
        </div>
        <div className="self-center basis-1/5">
          <Image src={imgSrc} alt="Tracks Overview" width={315} height={270} />
        </div>
      </section>
    );
  }
};

export default OverviewCard;
