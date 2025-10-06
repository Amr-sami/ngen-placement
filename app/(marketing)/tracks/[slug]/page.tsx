import { CallToAction, PageWrapper } from '@/components/general';
import { Track } from '@/types';
import React from 'react';
import tracks from './data.json';
import OverviewCard from '@/components/general/OverviewCard';
import LevelsList from '@/components/pages/SingleTrackPage/LevelsList';
import TrackHeader from './TrackHeader';

// If someone goes to a link not contaning the slug the system will redirect him to 404 page, for SSG not SSR
// for more info: https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamicparams
export const dynamicParams = false;

export async function generateStaticParams() {
  // const tracks = await fetch(data).then((res) => res.json())

  return tracks.map((track: Track) => ({
    slug: track.slug,
  }));
}


export async function generateMetadata({params}: {params: Promise<{ slug: string }>}) {
  const slug = (await params).slug;
  const track = tracks.find((t) => t.slug === slug);

  if (!track) {
    return {
      title: "Track Not Found",
      description: "This track could not be found.",
    };
  }

  return {
    title: track.meta_title,
    description: track.meta_desc,
    keywords: track.meta_keywords,
  };
}



async function SingleTrackPage({params}: {params: Promise<{ slug: string }>}) {
  const slug = (await params).slug;

  // TODO: Fetching data by slug from endpoint
  const [track] = tracks.filter((track: Track) => track.slug === slug);

  const partnersData = {
    text: ['ai-explorer', 'pattern-detective', 'code-creator', 'smart-builder', 'data-scientist', 'ai-trainer', 'ai-developer', 'ai-innovator', 'ai-researcher', 'ai-leader'].includes(slug)
      ? 'In collaboration with University of Delaware and Academy of Leeds, aligned to their education quality frameworks.' 
      : 'Our Certificate is by IAO, IAO is an international quality assurance agency, working to improve & establish education standards of institutes all over the world. With its global network of experts, IAO grants accreditation to educational institutions, corporations, professionals and qualified individuals.',
    imgSrc: '/certificate.svg',
    partnerImgs: [
      {
        src: '/assets/images/partner-placeholder.png',
        alt: 'partner placeholder image',
      },
      {
        src: '/assets/images/partner-placeholder.png',
        alt: 'partner placeholder image',
      },
      {
        src: '/assets/images/partner-placeholder.png',
        alt: 'partner placeholder image',
      },
    ],
  };
  return (
    <main>
      <PageWrapper classNames="container mx-auto px-5 flex flex-col py-6 gap-10">
        <TrackHeader trackName={track.name} />
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
          // partnersImgs={partnersData.partnerImgs}
        />
        {/* <section className="flex flex-col gap-6 sm:flex-row lg:bg-gray-default rounded-3xl p-6 justify-between ">
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
        </section> */}
        {/* Modules Section */}
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl lg:text-3xl text-purple-dark font-bold">Modules</h2>
          <LevelsList levels={track.levels} />
        </section>
        
        {/* Track Projects Section */}
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl lg:text-3xl text-purple-dark font-bold">Track Projects</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            <ul className="list-disc list-inside space-y-2">
              {slug === 'ai-explorer' ? (
                <>
                  <li><strong>Is it a Machine?</strong>: Students create a digital gallery showcasing everyday objects and explaining how they relate to machines.</li>
                  <li><strong>Pattern Museum</strong>: Students design visual cards and posters that demonstrate patterns and rules in technology.</li>
                  <li><strong>AI Photo Sorter</strong>: With teacher guidance, students use a simple tool to classify images and discuss fairness in AI decisions.</li>
                </>
              ) : slug === 'pattern-detective' ? (
                <>
                  <li><strong>Pattern Detective Journal</strong>: Students maintain a weekly digital log documenting patterns they discover in their environment.</li>
                  <li><strong>Teach the Snack Bot</strong>: Students build a system to classify foods as snacks or non-snacks using improved example sets.</li>
                  <li><strong>Robot Chef Planner</strong>: Students create logical decision flows for a virtual cooking assistant using if-then logic.</li>
                </>
              ) : slug === 'code-creator' ? (
                <>
                  <li><strong>My Interactive Story</strong>: Students build a digital story where reader choices affect the narrative direction.</li>
                  <li><strong>Smart Game Challenge</strong>: Students design games with scoring systems, player lives, and progressive difficulty levels.</li>
                  <li><strong>AI Magic Show</strong>: Students create interactive demonstrations that respond to camera input or voice commands.</li>
                </>
              ) : slug === 'smart-builder' ? (
                <>
                  <li><strong>School Pulse Survey</strong>: Students collect and visualize data about school experiences in an interactive dashboard.</li>
                  <li><strong>Study Buddy</strong>: Students create a Scratch-based assistant that provides personalized reminders and learning tips.</li>
                  <li><strong>UX Fix-it Sprint</strong>: Students identify user experience problems and implement before/after improvements.</li>
                </>
              ) : slug === 'data-scientist' ? (
                <>
                  <li><strong>Community Snapshot</strong>: Students create an interactive dashboard visualizing survey data from their community.</li>
                  <li><strong>Weather Watch</strong>: Students analyze weather patterns to identify trends and make visual comparisons.</li>
                  <li><strong>Fair Charts Lab</strong>: Students learn to identify misleading visualizations and create accurate, fair representations of data.</li>
                </>
              ) : slug === 'ai-trainer' ? (
                <>
                  <li><strong>Which Model Wins?</strong>: Students create a comparison board to evaluate different AI models using various metrics.</li>
                  <li><strong>Bias Busters</strong>: Students identify bias in datasets and rebuild them to create fairer AI systems.</li>
                  <li><strong>Safety Card</strong>: Students develop documentation that identifies potential risks and safety measures for AI systems.</li>
                </>
              ) : slug === 'ai-developer' ? (
                <>
                  <li><strong>End-to-End Mini App</strong>: Students build a complete application with training and testing components.</li>
                  <li><strong>Neural Net Mini-Lab</strong>: Students create a simple neural network model using the Keras framework.</li>
                  <li><strong>Usability + Ethics Review</strong>: Students conduct user testing and create ethical guidelines for their applications.</li>
                </>
              ) : slug === 'ai-innovator' ? (
                <>
                  <li><strong>Service Blueprint</strong>: Students design system architecture and define how components interact with each other.</li>
                  <li><strong>Model in the Loop</strong>: Students implement experiment tracking and version control for their AI models.</li>
                  <li><strong>Trust & Safety Readme</strong>: Students develop comprehensive privacy guidelines and monitoring plans for their systems.</li>
                </>
              ) : slug === 'ai-researcher' ? (
                <>
                  <li><strong>Paper in a Page</strong>: Students create concise reviews and critiques of existing research papers.</li>
                  <li><strong>Baseline Reproduction</strong>: Students recreate published models and document result comparisons.</li>
                  <li><strong>Ablation Atlas</strong>: Students systematically analyze which components have the greatest impact on model performance.</li>
                </>
              ) : slug === 'ai-leader' ? (
                <>
                  <li><strong>AI Startup Sprint</strong>: Students develop a minimum viable product and business model canvas.</li>
                  <li><strong>Policy White Paper</strong>: Students research a problem, present options, and make evidence-based recommendations.</li>
                  <li><strong>Global Challenge Lead</strong>: Students coordinate an international collaborative project addressing real-world challenges.</li>
                </>
              ) : (
                <>
                  <li>AI Ethics Assessment Tool</li>
                  <li>Data Visualization Dashboard</li>
                  <li>Sentiment Analysis Application</li>
                  <li>Image Classification Model</li>
                </>
              )}
            </ul>
          </div>
        </section>
        
        {/* Capstone Section */}
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl lg:text-3xl text-purple-dark font-bold">Capstone</h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            {slug === 'ai-explorer' ? (
              <p className="text-purple-dark">
                <strong>My Helpful Robot</strong>: Students create a detailed storyboard and interactive prototype of a robot designed to solve everyday problems. This project demonstrates their understanding of how machines can be programmed to assist humans.
              </p>
            ) : slug === 'pattern-detective' ? (
              <p className="text-purple-dark">
                <strong>AI Investigation Agency</strong>: Students develop a case file analyzing a real-world pattern and deliver a short pitch explaining their findings. This project showcases their ability to identify, document, and communicate pattern-based insights.
              </p>
            ) : slug === 'code-creator' ? (
              <p className="text-purple-dark">
                <strong>Problem-Solver App</strong>: Students build a complete Scratch application that addresses a specific challenge, accompanied by a live demonstration. This project demonstrates their programming skills and ability to create functional solutions.
              </p>
            ) : slug === 'smart-builder' ? (
              <p className="text-purple-dark">
                <strong>Smart System Showcase</strong>: Students develop a multi-scene application with integrated data visualizations. This project highlights their ability to build complex systems and effectively present information through charts.
              </p>
            ) : slug === 'data-scientist' ? (
              <p className="text-purple-dark">
                <strong>Evidence-Based Report</strong>: Students create a professional presentation with interactive dashboards that communicate data-driven insights. This project demonstrates their ability to analyze data and present compelling conclusions.
              </p>
            ) : slug === 'ai-trainer' ? (
              <p className="text-purple-dark">
                <strong>AI for Good Demo</strong>: Students develop an AI solution addressing a social challenge and test it with actual community members. This project showcases their ability to create ethical AI applications with real-world impact.
              </p>
            ) : slug === 'ai-developer' ? (
              <p className="text-purple-dark">
                <strong>AI Application Development</strong>: Students build a complete AI application with comprehensive documentation and a demonstration video. This project demonstrates their technical proficiency and ability to communicate their work effectively.
              </p>
            ) : slug === 'ai-innovator' ? (
              <p className="text-purple-dark">
                <strong>Impact Demo Day</strong>: Students present a working system demonstration with measurable performance metrics. This project showcases their ability to build end-to-end solutions and quantify their effectiveness.
              </p>
            ) : slug === 'ai-researcher' ? (
              <p className="text-purple-dark">
                <strong>Preprint & Talk</strong>: Students create publication-quality research materials and deliver a conference-style presentation. This project demonstrates their ability to conduct and communicate original research.
              </p>
            ) : slug === 'ai-leader' ? (
              <p className="text-purple-dark">
                <strong>Legacy Initiative</strong>: Students develop a sustainable project plan with clear transition documentation for future teams. This project showcases their leadership abilities and strategic thinking.
              </p>
            ) : (
              <>
                <p className="text-purple-dark mb-4">
                  Students will complete a comprehensive AI project that demonstrates their mastery of the core concepts covered throughout the track. The capstone integrates technical skills with ethical considerations and practical application.
                </p>
                <p className="text-purple-dark font-semibold">
                  Deliverables include a working AI model, documentation, presentation, and reflection on ethical implications.
                </p>
              </>
            )}
          </div>
        </section>
      </PageWrapper>
      <CallToAction cta="Get Started" />
    </main>
  );
}

export default SingleTrackPage;
