import { Header } from "@/components/layout/Header";
import { JourneySection } from "@/components/journey/JourneySection";
import { MissionSection } from "@/components/sections/MissionSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ExpertiseSection } from "@/components/sections/ExpertiseSection";
import { NetworkSection } from "@/components/sections/NetworkSection";
import { InsightsSection } from "@/components/sections/InsightsSection";
import { FinalCta } from "@/components/sections/FinalCta";
import { SmoothScrolling } from "@/components/layout/SmoothScrolling";

export default function HomePage() {
  return (
    <main id="top">
      <SmoothScrolling />
      <a className="skip-link" href="#services">Skip 3D journey</a>
      <Header />
      <JourneySection />
      <MissionSection />
      <NetworkSection />
      <ServicesSection />
      <ExpertiseSection />
      <InsightsSection />
      <FinalCta />
    </main>
  );
}
