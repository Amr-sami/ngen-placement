import { CallToAction, PageWrapper } from "@/components/general";
import { Track } from "@/types";
import React from "react";
import tracks from "./data.json";
import OverviewCard from "@/components/general/OverviewCard";
import LevelsList from "@/components/pages/SingleTrackPage/LevelsList";

// If someone goes to a link not contaning the slug the system will redirect him to 404 page, for SSG not SSR
// for more info: https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamicparams
export const dynamicParams = false;

export async function generateStaticParams() {
  // const tracks = await fetch(data).then((res) => res.json())

  return tracks.map((track: Track) => ({
    slug: track.slug,
  }));
}

async function SingleTrackPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  // TODO: Fetching data by slug from endpoint
  const [track] = tracks.filter((track: Track) => track.slug === slug);

  const partnersData = {
    text: "Our mission is simple: to make modern, industry-relevant skills accessible and enjoyable for teenagers. We combine live, expert-led courses with interactive tools ",
    imgSrc: "/certificate.svg",
    partnerImgs: [
      {
        src: "/assets/images/partner-placeholder.png",
        alt: "partner placeholder image",
      },
      {
        src: "/assets/images/partner-placeholder.png",
        alt: "partner placeholder image",
      },
      {
        src: "/assets/images/partner-placeholder.png",
        alt: "partner placeholder image",
      },
    ],
  };
  return (
    <main>
      <PageWrapper classNames="container mx-auto px-5 flex flex-col py-6 gap-10">
        <h1 className="text-2xl lg:text-4xl text-pumpkin font-bold">
          {track.name}
        </h1>
        <OverviewCard
          text={track.description}
          imgSrc="/tracks-overview.svg"
          feedbackRating={track.rating}
          assessmentNumber={track.assessments_number}
          coursesNumber={track.courses_number}
        />
        <OverviewCard
          variant="partners"
          text={partnersData.text}
          imgSrc={partnersData.imgSrc}
          partnersImgs={partnersData.partnerImgs}
        />
        <section className="flex flex-col gap-6 sm:flex-row lg:bg-gray-default rounded-3xl p-6 justify-between ">
          <div className="flex flex-col gap-2 ">
            <h2 className="font-bold text-xl text-purple-dark md:text-2xl xl:font-medium xl:text-3xl">
              Pricing
            </h2>
            <ul className="flex flex-col list-disc list-inside text-gray-dark lg:text-2xl">
              <li>Placement test</li>
              <li>Placement test</li>
              <li>Placement test</li>
            </ul>
          </div>
          <div className="self-center">
            <h3 className="font-bold text-purple-dark text-5xl">
              {track.price} $
            </h3>
          </div>
        </section>
        <LevelsList />
      </PageWrapper>
      <CallToAction cta="Get Started" />
    </main>
  );
}

export default SingleTrackPage;
