import HomepageHero from '@/components/pages/Home/Hero';
import HomepageAboutSection from '@/components/pages/Home/AboutSection';
import HomepageRoadmapSection from '@/components/pages/Home/NgenRoadmapSection';
import { ContactUs } from '@/components/general';
import JourneySection from '@/components/pages/Home/JourneySection';
import HomepageNgenForSection from '@/components/pages/Home/NgenForSection';
// import HomePageSocialProofSection from "@/components/pages/Home/SocialProofSection";
import HomepageBannerSection from '@/components/pages/Home/BannerSection';
import HomepageNgenWhySection from '@/components/pages/Home/NgenWhySection';
import HomepageProjectsSection from '@/components/pages/Home/ProjectsSection';
import HomepageStudentsSection from '@/components/pages/Home/StudentsSection';
import HomepagePricingSection from '@/components/pages/Home/PricingSection';

export const metadata = {
  title: "NGen School Online | Digital Learning for Kids – Programming, AI, Robotics & More",
  description: "Turn screen time into skill time! NGen is an online school where kids become digital ninjas. With live sessions, fun projects, and modern tech tracks like AI, Coding, Robotics, and Cybersecurity, we help your child build real-world skills and confidence. Learn more with NGen School!",
  keywords: ["online school for kids", "digital learning for children", "coding classes for kids", "AI courses for kids", "robotics for kids"],
};

export default function Home() {
  return (
    <main className="-mt-20">
      <HomepageHero />
      <HomepageAboutSection />
      <HomepageRoadmapSection />
      <JourneySection />
      <HomepageProjectsSection />
      <HomepageStudentsSection />
      <HomepageNgenWhySection />
      <HomepagePricingSection />
      <HomepageNgenForSection />
      {/* <HomePageSocialProofSection /> */}
      <section id="contact-us" className="container mx-auto my-20">
        <ContactUs />
      </section>
      <HomepageBannerSection />
    </main>
  );
}
