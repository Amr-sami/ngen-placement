import HomepageHero from "@/components/pages/Home/Hero";
import HomepageAboutSection from "@/components/pages/Home/AboutSection";
import HomepageNgenWhySection from "@/components/pages/Home/NgenWhySection";
import { TracksSection } from "@/components/general";
import HomepageNgenForSection from "@/components/pages/Home/NgenForSection";
import HomePageSocialProofSection from "@/components/pages/Home/SocialProofSection";
import HomepageBannerSection from "@/components/pages/Home/BannerSection";

export default function Home() {
  return (
    <main>
      <HomepageHero />
      <HomepageAboutSection />
      <HomepageNgenWhySection />
      <TracksSection title="Our Tracks" />
      <HomepageNgenForSection />
      {/* <HomePageSocialProofSection /> */}
      <HomepageBannerSection />
    </main>
  );
}
