import { AboutSection } from "~/components/home/AboutSection";
import { EducationSection } from "~/components/home/EducationSection";
import { ExpertiseSection } from "~/components/home/ExpertiseSection";
import { HeroSection } from "~/components/home/HeroSection";
import { LanguagesSection } from "~/components/home/LanguagesSection";
import { WorksSection } from "~/components/home/WorksSection";
import { SiteHeader } from "~/components/layout/SiteHeader";

export function Welcome() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="page-main">
        <HeroSection />
        <WorksSection />
        <AboutSection />
        <div className="home-section-divider" aria-hidden="true" />
        <ExpertiseSection />
        <LanguagesSection />
        <EducationSection />
      </main>
    </>
  );
}
