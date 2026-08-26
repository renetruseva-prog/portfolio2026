import { HeroSection } from "~/components/home/HeroSection";
import { WorksSection } from "~/components/home/WorksSection";
import { SiteHeader } from "~/components/layout/SiteHeader";

export function Welcome() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="page-main">
        <HeroSection />
        <WorksSection />
      </main>
    </>
  );
}
