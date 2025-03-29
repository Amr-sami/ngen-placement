import HomepageHero from '@/components/pages/Home/Hero';
import HomepageAboutSection from '@/components/pages/Home/AboutSection';
import HomepageRoadmapSection from '@/components/pages/Home/NgenRoadmapSection';
import { ContactUs, TracksSection } from '@/components/general';
import HomepageNgenForSection from '@/components/pages/Home/NgenForSection';
// import HomePageSocialProofSection from "@/components/pages/Home/SocialProofSection";
import HomepageBannerSection from '@/components/pages/Home/BannerSection';
import HomepageNgenWhySection from '@/components/pages/Home/NgenWhySection';

export default function Home() {
  return (
    <main className="-mt-20">
      <HomepageHero />
      <HomepageAboutSection />
      <HomepageRoadmapSection />
      <TracksSection title="Our Tracks" />
      <HomepageNgenWhySection />
      <HomepageNgenForSection />
      {/* <HomePageSocialProofSection /> */}
      <section className="container mx-auto my-20">
        <ContactUs />
      </section>
      <HomepageBannerSection />
    </main>
  );
}
