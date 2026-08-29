import { Link, href } from "react-router";
import { useEffect, useRef } from "react";

import { FooterSection } from "~/components/home/FooterSection";
import { SiteHeader } from "~/components/layout/SiteHeader";
import { ProjectHeroMedia } from "./ProjectHeroMedia";
import {
  ProjectExpandableImage,
  ProjectScreenshotGallery,
} from "./ProjectScreenshotGallery";
import type {
  ProjectCaseStudy,
  ProjectDetail,
} from "~/content/projects";
import { initProjectPageMotion } from "~/lib/section-scroll-motion.client";
import { worksAssets } from "~/content/site";
import "./project-page.css";

type ProjectPageProps = {
  project: ProjectDetail;
  prevProject: ProjectDetail | null;
  nextProject: ProjectDetail | null;
};

const projectAssets = {
  arrowBack: "/images/portfolio/project-back-arrow.svg",
  arrowExternal: "/images/portfolio/project-link-arrow.svg",
  arrowPrev: worksAssets.arrowLeft,
  arrowNext: worksAssets.arrowRight,
  divider: "/images/portfolio/divider-long.svg",
  fieldSquiggle: "/images/portfolio/project-field-squiggle.svg",
} as const;

function BackChevronIcon({ className }: { className?: string }) {
  return (
    <img
      className={className}
      src={projectAssets.arrowBack}
      alt=""
      width={10}
      height={14}
      draggable={false}
    />
  );
}

function ProjectBackLink() {
  return (
    <Link to="/#works" className="project-page__back">
      <BackChevronIcon className="project-page__back-icon" />
      Go back
    </Link>
  );
}

function TagList({
  items,
  underlineFirst = false,
}: {
  items: readonly string[];
  underlineFirst?: boolean;
}) {
  return (
    <p className="project-tags">
      {items.map((tag, tagIndex) => (
        <span key={tag} className="project-tags__tag">
          {tagIndex > 0 ? (
            <span className="project-tags__separator" aria-hidden="true">
              {" "}
              *
            </span>
          ) : null}
          <span className="project-tags__label">
            {underlineFirst && tagIndex === 0 ? (
              <span className="project-tags__label-marked">
                {tag}
                <img
                  className="project-tags__squiggle"
                  src={projectAssets.fieldSquiggle}
                  alt=""
                  width={112}
                  height={8}
                  draggable={false}
                />
              </span>
            ) : (
              tag
            )}
          </span>
        </span>
      ))}
    </p>
  );
}

function ProjectLinkButton({
  href: linkHref,
  label,
  variant,
}: {
  href: string;
  label: string;
  variant: "gold" | "cream";
}) {
  const isExternal = linkHref.startsWith("http");

  return (
    <a
      href={linkHref}
      className={`project-link-btn project-link-btn--${variant}`}
      {...(isExternal
        ? { target: "_blank", rel: "noopener noreferrer" }
        : undefined)}
    >
      {label}
      <img
        className="project-link-btn__icon"
        src={projectAssets.arrowExternal}
        alt=""
        width={17}
        height={25}
        draggable={false}
      />
    </a>
  );
}

function CaseStudyPage({
  project,
  caseStudy,
  prevProject,
  nextProject,
}: {
  project: ProjectDetail;
  caseStudy: ProjectCaseStudy;
  prevProject: ProjectDetail | null;
  nextProject: ProjectDetail | null;
}) {
  const titleId = "project-title";
  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const article = articleRef.current;
    if (!article) return;
    return initProjectPageMotion(article);
  }, []);

  return (
    <>
      <SiteHeader />

      <main id="main" className="page-main project-page">
        <article
          ref={articleRef}
          className="project-page__article"
          aria-labelledby={titleId}
        >
          <div className="project-page__inner">
            <ProjectBackLink />

            <header className="project-page__header">
              <h1 id={titleId} className="project-page__title">
                <span className="project-page__title-lead display-title">
                  {caseStudy.titleLead}
                </span>
                <span
                  className="project-page__title-accent display-title"
                  style={{ color: project.accentColor }}
                >
                  {caseStudy.titleAccent}
                </span>
              </h1>

              <ProjectHeroMedia hero={project.hero} />
            </header>

            <section
              className="project-section"
              aria-labelledby="project-summary-heading"
            >
              <h2
                id="project-summary-heading"
                className="project-section__title display-title"
              >
                Summary
              </h2>
              <p className="project-section__body">{caseStudy.summary}</p>

              {(caseStudy.links.website || caseStudy.links.process) && (
                <div className="project-section__actions">
                  {caseStudy.links.website ? (
                    <ProjectLinkButton
                      href={caseStudy.links.website.href}
                      label={caseStudy.links.website.label}
                      variant="gold"
                    />
                  ) : null}
                  {caseStudy.links.process ? (
                    <ProjectLinkButton
                      href={caseStudy.links.process.href}
                      label={caseStudy.links.process.label}
                      variant="cream"
                    />
                  ) : null}
                </div>
              )}

              <hr className="project-divider" />
            </section>

            <section
              className="project-section project-section--field"
              aria-labelledby="project-field-heading"
            >
              <h2
                id="project-field-heading"
                className="project-section__title display-title"
              >
                Field
              </h2>
              <div className="project-section__tags-wrap">
                <TagList items={project.tags} underlineFirst />
              </div>
            </section>

            <section
              className="project-section"
              aria-labelledby="project-toolkit-heading"
            >
              <h2
                id="project-toolkit-heading"
                className="project-section__title display-title"
              >
                Toolkit
              </h2>

              <div className="project-toolkit">
                <div className="project-toolkit__group">
                  <h3 className="project-toolkit__label display-title">Design</h3>
                  <TagList items={caseStudy.toolkit.design} />
                </div>
                <div className="project-toolkit__group">
                  <h3 className="project-toolkit__label display-title">Code</h3>
                  <TagList items={caseStudy.toolkit.code} />
                </div>
              </div>
            </section>

            <section
              className="project-section"
              aria-labelledby="project-screenshots-heading"
            >
              <h2
                id="project-screenshots-heading"
                className="project-section__title display-title"
              >
                Screenshots
              </h2>
              <ProjectScreenshotGallery rows={caseStudy.screenshotRows} />
            </section>

            <hr className="project-divider project-divider--standalone" />

            <section
              className="project-section"
              aria-labelledby="project-goal-heading"
            >
              <h2
                id="project-goal-heading"
                className="project-section__title display-title"
              >
                Goal
              </h2>
              <ul className="project-goals">
                {caseStudy.goals.map((goal) => (
                  <li key={goal} className="project-goals__item">
                    {goal}
                  </li>
                ))}
              </ul>
            </section>

            <section
              className="project-section"
              aria-labelledby="project-process-heading"
            >
              <h2
                id="project-process-heading"
                className="project-section__title display-title"
              >
                Process
              </h2>
              <p className="project-process__step">{caseStudy.process.step}</p>
              <ProjectExpandableImage
                image={caseStudy.process.image}
                figureClassName="project-process__figure project-gallery__figure"
                imageClassName="project-process__image project-gallery__image"
              />
            </section>

            {prevProject || nextProject ? (
              <nav
                className="project-adjacent"
                aria-label="Adjacent projects"
              >
                {prevProject ? (
                  <Link
                    to={href("/works/:slug", { slug: prevProject.slug })}
                    className="project-adjacent__link project-adjacent__link--prev"
                  >
                    <span className="project-adjacent__label">
                      <img
                        className="project-adjacent__arrow"
                        src={projectAssets.arrowPrev}
                        alt=""
                        width={18}
                        height={12}
                        draggable={false}
                      />
                      Previous work
                    </span>
                    <span className="project-adjacent__title">
                      {prevProject.shortTitle ?? prevProject.title}
                    </span>
                  </Link>
                ) : (
                  <span />
                )}

                {nextProject ? (
                  <Link
                    to={href("/works/:slug", { slug: nextProject.slug })}
                    className="project-adjacent__link project-adjacent__link--next"
                  >
                    <span className="project-adjacent__label">
                      Next work
                      <img
                        className="project-adjacent__arrow"
                        src={projectAssets.arrowNext}
                        alt=""
                        width={18}
                        height={12}
                        draggable={false}
                      />
                    </span>
                    <span className="project-adjacent__title">
                      {nextProject.shortTitle ?? nextProject.title}
                    </span>
                  </Link>
                ) : null}
              </nav>
            ) : null}
          </div>
        </article>
      </main>

      <FooterSection />
    </>
  );
}

function LegacyProjectPage({
  project,
  nextProject,
}: {
  project: ProjectDetail;
  nextProject: ProjectDetail | null;
}) {
  const blocks = project.blocks ?? [];

  return (
    <>
      <SiteHeader />

      <main id="main" className="page-main project-page">
        <article className="project-page__article">
          <div className="project-page__inner project-page__inner--legacy">
            <ProjectBackLink />

            <header className="project-hero project-hero--legacy">
              <figure className="project-hero__media">
                <img
                  className="project-hero__image"
                  src={project.hero.src}
                  alt={project.hero.alt}
                  draggable={false}
                />
              </figure>

              <div className="project-hero__content">
                <h1 className="project-hero__title display-title">
                  {project.title}
                </h1>
                <TagList items={project.tags} />
              </div>
            </header>

            <div className="project-page__blocks">
              {blocks.map((block) => {
                switch (block.type) {
                  case "intro":
                    return (
                      <section key={block.id} className="project-block project-block--intro">
                        {block.paragraphs.map((paragraph) => (
                          <p key={paragraph} className="project-block__intro-text">
                            {paragraph}
                          </p>
                        ))}
                      </section>
                    );
                  case "text":
                    return (
                      <section key={block.id} className="project-block project-block--text">
                        <h2 className="project-block__title display-title">
                          {block.title}
                        </h2>
                        <div className="project-block__copy">
                          {block.paragraphs.map((paragraph) => (
                            <p key={paragraph} className="project-block__paragraph">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </section>
                    );
                  case "image":
                    return (
                      <figure
                        key={block.id}
                        className={`project-block project-block--image${
                          block.fullBleed ? " project-block--image-full" : ""
                        }`}
                      >
                        <img
                          className="project-block__image"
                          src={block.src}
                          alt={block.alt}
                          loading="lazy"
                          draggable={false}
                        />
                      </figure>
                    );
                  case "split":
                    return (
                      <section
                        key={block.id}
                        className={`project-block project-block--split project-block--split-${
                          block.imagePosition ?? "right"
                        }`}
                      >
                        <div className="project-block__split-copy">
                          <h2 className="project-block__title display-title">
                            {block.title}
                          </h2>
                          <div className="project-block__copy">
                            {block.paragraphs.map((paragraph) => (
                              <p key={paragraph} className="project-block__paragraph">
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        </div>
                        <figure className="project-block__split-media">
                          <img
                            className="project-block__image"
                            src={block.image.src}
                            alt={block.image.alt}
                            loading="lazy"
                            draggable={false}
                          />
                        </figure>
                      </section>
                    );
                }
              })}
            </div>

            {nextProject ? (
              <nav className="project-page__next" aria-label="Next project">
                <p className="project-page__next-label">Next project</p>
                <Link
                  to={href("/works/:slug", { slug: nextProject.slug })}
                  className="project-page__next-link display-title"
                >
                  {nextProject.title}
                </Link>
              </nav>
            ) : null}
          </div>
        </article>
      </main>

      <FooterSection />
    </>
  );
}

export function ProjectPage({
  project,
  prevProject,
  nextProject,
}: ProjectPageProps) {
  if (project.caseStudy) {
    return (
      <CaseStudyPage
        project={project}
        caseStudy={project.caseStudy}
        prevProject={prevProject}
        nextProject={nextProject}
      />
    );
  }

  return (
    <LegacyProjectPage project={project} nextProject={nextProject} />
  );
}
