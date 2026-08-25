import { HeroSection } from "~/components/home/HeroSection";
import { SiteHeader } from "~/components/layout/SiteHeader";

export function Welcome() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="page-main">
        <HeroSection />
      </main>
    </>
  );
}
