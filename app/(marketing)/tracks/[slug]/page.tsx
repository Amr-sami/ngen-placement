import { CallToAction, PageWrapper } from '@/components/general';
import { Track } from '@/types';
import React from 'react';
import tracks from './data.json';
import OverviewCard from '@/components/general/OverviewCard';
import LevelsList from '@/components/pages/SingleTrackPage/LevelsList';
import Button from '@/components/general/Button';

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
        <div className='flex justify-between flex-row gap-5'>
          <div>
            <h1 className="text-2xl lg:text-5xl text-purple-dark font-protestRiot">
              Track Details
            </h1>
            <h1 className="text-2xl lg:text-4xl text-pumpkin font-bold">
              {track.name}
            </h1>
          </div>
          <Button variant="primary" href='https://wa.me/+201055023774' isTargetBlank={true} takeFullWidth>
            Get Started
          </Button>
        </div>
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
                  <li>Is it a Machine? — gallery of everyday objects (digital slideshow).</li>
                  <li>Pattern Museum — cards/posters showing patterns and rules.</li>
                  <li>AI Photo Sorter (Demo) — classify a small set with teacher-led tool; talk about fair/unfair.</li>
                </>
              ) : slug === 'pattern-detective' ? (
                <>
                  <li>Pattern Detective Journal — weekly digital log of patterns found.</li>
                  <li>Teach the Snack Bot — classify "snack vs non-snack" with improved examples.</li>
                  <li>Robot Chef Planner — if/then recipe flow.</li>
                </>
              ) : slug === 'code-creator' ? (
                <>
                  <li>My Interactive Story — choices change the plot.</li>
                  <li>Smart Game Challenge — timed points, lives, levels.</li>
                  <li>AI Magic Show — camera/voice triggers.</li>
                </>
              ) : slug === 'smart-builder' ? (
                <>
                  <li>School Pulse Survey — dashboard of results.</li>
                  <li>Study Buddy — Scratch assistant for reminders/tips.</li>
                  <li>UX Fix-it Sprint — before/after improvements.</li>
                </>
              ) : slug === 'data-scientist' ? (
                <>
                  <li>Community Snapshot — survey dashboard.</li>
                  <li>Weather Watch — trends and comparisons.</li>
                  <li>Fair Charts Lab — avoid chart lies; fix misleading graphs.</li>
                </>
              ) : slug === 'ai-trainer' ? (
                <>
                  <li>Which Model Wins? — metric comparison board.</li>
                  <li>Bias Busters — rebuild the dataset to be fairer.</li>
                  <li>Safety Card — model/usage risks & mitigations.</li>
                </>
              ) : slug === 'ai-developer' ? (
                <>
                  <li>End-to-End Mini App — notebook/CLI with train/test.</li>
                  <li>Neural Net Mini-Lab — simple Keras model.</li>
                  <li>Usability + Ethics Review — user tests + checklist.</li>
                </>
              ) : slug === 'ai-innovator' ? (
                <>
                  <li>Service Blueprint — architecture + contracts.</li>
                  <li>Model in the Loop — tracked experiments & versions.</li>
                  <li>Trust & Safety Readme — privacy + monitoring plan.</li>
                </>
              ) : slug === 'ai-researcher' ? (
                <>
                  <li>Paper in a Page — concise review + critique.</li>
                  <li>Baseline Repro — code + results match/variance.</li>
                  <li>Ablation Atlas — what matters in the model.</li>
                </>
              ) : slug === 'ai-leader' ? (
                <>
                  <li>AI Startup Sprint — MVP + lean canvas.</li>
                  <li>Policy White Paper — problem, options, recommendation.</li>
                  <li>Global Challenge Lead — international collab pilot.</li>
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
                My Helpful Robot — storyboard + clickable prototype.
              </p>
            ) : slug === 'pattern-detective' ? (
              <p className="text-purple-dark">
                AI Investigation Agency — case file + short pitch.
              </p>
            ) : slug === 'code-creator' ? (
              <p className="text-purple-dark">
                Problem-Solver App — Scratch app + demo.
              </p>
            ) : slug === 'smart-builder' ? (
              <p className="text-purple-dark">
                Smart System Showcase — multi-scene app + charts.
              </p>
            ) : slug === 'data-scientist' ? (
              <p className="text-purple-dark">
                Evidence-Based Report — slides + dashboard.
              </p>
            ) : slug === 'ai-trainer' ? (
              <p className="text-purple-dark">
                AI for Good Demo — tested with a community user.
              </p>
            ) : slug === 'ai-developer' ? (
              <p className="text-purple-dark">
                AI Application Development — app + README + short video.
              </p>
            ) : slug === 'ai-innovator' ? (
              <p className="text-purple-dark">
                Impact Demo Day — system demo + metrics.
              </p>
            ) : slug === 'ai-researcher' ? (
              <p className="text-purple-dark">
                Preprint & Talk — submission-ready artifacts.
              </p>
            ) : slug === 'ai-leader' ? (
              <p className="text-purple-dark">
                Legacy Initiative — sustainable plan with handover.
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
