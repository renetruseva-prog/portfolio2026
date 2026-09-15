import { AboutSection } from "~/components/home/AboutSection";
import { EducationSection } from "~/components/home/EducationSection";
import { ExpertiseSection } from "~/components/home/ExpertiseSection";
import { FooterSection } from "~/components/home/FooterSection";
import { HeroSection } from "~/components/home/HeroSection";
import { LanguagesSection } from "~/components/home/LanguagesSection";
import { WorksSection } from "~/components/home/WorksSection";
import { SiteHeader } from "~/components/layout/SiteHeader";

import type { Route } from "./+types/home";
import "./home.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Renet Ruseva — Creative Developer" },
    {
      name: "description",
      content:
        "Portfolio of Renet Ruseva, a creative developer combining visual storytelling with web technology.",
    },
  ];
}

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="page-main">
        <HeroSection />
        <WorksSection />
        <AboutSection />
        <div className="home-section-divider" aria-hidden="true" />
        <div className="home-details">
          <ExpertiseSection />
          <LanguagesSection />
          <EducationSection />
        </div>
      </main>
      <FooterSection />
    </>
  );
}
