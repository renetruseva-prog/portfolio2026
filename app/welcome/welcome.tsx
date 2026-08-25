import { HeroSection } from "~/components/home/HeroSection";
import { SiteHeader } from "~/components/layout/SiteHeader";

export function Welcome() {
  return (
    <>
      <a href="#main" className="sr-only">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className="page-main">
        <HeroSection />
      </main>
    </>
  );
}
