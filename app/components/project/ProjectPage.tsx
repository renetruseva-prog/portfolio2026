import { Link, href } from "react-router";
import { useLayoutEffect, useRef } from "react";

import { FooterSection } from "~/components/home/FooterSection";
import { SiteHeader } from "~/components/layout/SiteHeader";
import { ProjectHeroMedia } from "./ProjectHeroMedia";
import { ProjectExpandableImage } from "./ProjectExpandableImage";
import { ProjectScreenshotGallery } from "./ProjectScreenshotGallery";
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

function ProjectSection({
  headingId,
  title,
  modifier,
  children,
}: {
  headingId: string;
  title: string;
  modifier?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={modifier ? `project-section ${modifier}` : "project-section"}
      aria-labelledby={headingId}
    >
      <h2 id={headingId} className="project-section__title display-title">
        {title}
      </h2>
      {children}
    </section>
  );
}

function ProjectCopy({ paragraphs }: { paragraphs: readonly string[] }) {
  return (
    <div className="project-section__copy">
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="project-section__body">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function ProjectBulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="project-goals">
      {items.map((item) => (
        <li key={item} className="project-goals__item">
          {item}
        </li>
      ))}
    </ul>
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
  variant: "gold" | "cream" | "dark";
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

function ProjectLinkActions({
  links,
}: {
  links: {
    website?: { href: string; label: string };
    github?: { href: string; label: string };
    design?: { href: string; label: string };
    process?: { href: string; label: string };
  };
}) {
  const hasLinks =
    links.website || links.github || links.design || links.process;

  if (!hasLinks) return null;

  return (
    <div className="project-section__actions">
      {links.website ? (
        <ProjectLinkButton
          href={links.website.href}
          label={links.website.label}
          variant="gold"
        />
      ) : null}
      {links.design ? (
        <ProjectLinkButton
          href={links.design.href}
          label={links.design.label}
          variant="gold"
        />
      ) : null}
      {links.github ? (
        <ProjectLinkButton
          href={links.github.href}
          label={links.github.label}
          variant={links.website || links.design ? "cream" : "gold"}
        />
      ) : null}
      {links.process ? (
        <ProjectLinkButton
          href={links.process.href}
          label={links.process.label}
          variant="cream"
        />
      ) : null}
    </div>
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

  useLayoutEffect(() => {
    const article = articleRef.current;
    if (!article) return;
    return initProjectPageMotion(article);
  }, [project.slug]);

  return (
    <>
      <SiteHeader />

      <main id="main" className="page-main project-page">
        <article
          ref={articleRef}
          className="project-page__article"
          data-project={project.slug}
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
                  {...(project.accentColor
                    ? { style: { color: project.accentColor } }
                    : undefined)}
                >
                  {caseStudy.titleAccent}
                </span>
              </h1>

              <ProjectHeroMedia hero={project.hero} />
            </header>

            <section
              className="project-section project-section--summary"
              aria-labelledby="project-summary-heading"
            >
              <div className="project-section__summary-grid">
                <div className="project-section__summary-copy">
                  <h2
                    id="project-summary-heading"
                    className="project-section__title display-title"
                  >
                    Summary
                  </h2>
                  <p className="project-section__body">{caseStudy.summary}</p>
                </div>

                <ProjectLinkActions links={caseStudy.links} />
              </div>

              <hr className="project-divider" />
            </section>

            <div className="project-page__panel project-page__panel--details">
              <div className="project-page__panel-main">
                <ProjectSection
                  headingId="project-field-heading"
                  title="Field"
                  modifier="project-section--field"
                >
                  <div className="project-section__tags-wrap">
                    <TagList items={project.tags} underlineFirst />
                  </div>
                </ProjectSection>

                <ProjectSection
                  headingId="project-toolkit-heading"
                  title="Toolkit"
                >
                  <div className="project-toolkit">
                    {caseStudy.toolkit.map((group) => (
                      <div key={group.label} className="project-toolkit__group">
                        <h3 className="project-toolkit__label display-title">
                          {group.label}
                        </h3>
                        {(project.slug === "project2" || project.slug === "project3") &&
                        group.label === "Code" ? (
                          <div className="project-tags-rows">
                            <TagList items={group.items.slice(0, 4)} />
                            <TagList items={group.items.slice(4)} />
                          </div>
                        ) : (
                          <TagList items={group.items} />
                        )}
                      </div>
                    ))}
                  </div>
                </ProjectSection>

                {caseStudy.processIntro ? (
                  <ProjectSection
                    headingId="project-process-intro-heading"
                    title="Process"
                    modifier="project-section--process-intro"
                  >
                    <ProjectCopy paragraphs={caseStudy.processIntro.paragraphs} />
                    {caseStudy.processIntro.link ? (
                      <ProjectLinkButton
                        href={caseStudy.processIntro.link.href}
                        label={caseStudy.processIntro.link.label}
                        variant="cream"
                      />
                    ) : null}
                  </ProjectSection>
                ) : null}
              </div>

              <div className="project-page__panel-aside">
                <ProjectSection
                  headingId="project-screenshots-heading"
                  title="Screenshots"
                >
                  <ProjectScreenshotGallery rows={caseStudy.screenshotRows} />
                </ProjectSection>
              </div>
            </div>

            <hr className="project-divider project-divider--standalone" />

            <div
              className={`project-page__panel project-page__panel--outcomes${
                caseStudy.process ||
                (project.slug === "project4" &&
                  caseStudy.descriptionSection?.screenshotRows)
                  ? ""
                  : " project-page__panel--single"
              }`}
            >
              <div className="project-page__panel-main">
                {caseStudy.descriptionSection ? (
                  <ProjectSection
                    headingId="project-description-section-heading"
                    title={caseStudy.descriptionSection.title}
                  >
                    <ProjectCopy
                      paragraphs={caseStudy.descriptionSection.paragraphs}
                    />
                    {caseStudy.descriptionSection.links ? (
                      <ProjectLinkActions
                        links={caseStudy.descriptionSection.links}
                      />
                    ) : null}
                    {caseStudy.descriptionSection.screenshotRows &&
                    project.slug !== "project4" ? (
                      <ProjectScreenshotGallery
                        rows={caseStudy.descriptionSection.screenshotRows}
                      />
                    ) : null}
                  </ProjectSection>
                ) : null}

                {caseStudy.description ? (
                  <ProjectSection
                    headingId="project-description-heading"
                    title="Description"
                  >
                    <ProjectCopy paragraphs={caseStudy.description} />
                  </ProjectSection>
                ) : null}

                {caseStudy.role ? (
                  <ProjectSection
                    headingId="project-role-heading"
                    title="My role"
                  >
                    <ProjectBulletList items={caseStudy.role} />
                  </ProjectSection>
                ) : null}

                {caseStudy.goals ? (
                  <ProjectSection headingId="project-goal-heading" title="Goal">
                    <ProjectBulletList items={caseStudy.goals} />
                  </ProjectSection>
                ) : null}

                {caseStudy.features ? (
                  <ProjectSection
                    headingId="project-features-heading"
                    title="Features"
                  >
                    <ProjectBulletList items={caseStudy.features} />
                  </ProjectSection>
                ) : null}
              </div>

              {caseStudy.process ? (
                <div className="project-page__panel-aside">
                  <ProjectSection
                    headingId="project-process-heading"
                    title="Process"
                  >
                    <p className="project-process__step">
                      {caseStudy.process.step}
                    </p>
                    <ProjectExpandableImage
                      image={caseStudy.process.image}
                      figureClassName="project-process__figure project-gallery__figure"
                      imageClassName="project-process__image project-gallery__image"
                    />
                  </ProjectSection>
                </div>
              ) : null}

              {project.slug === "project4" &&
              caseStudy.descriptionSection?.screenshotRows ? (
                <div className="project-page__panel-aside">
                  <ProjectScreenshotGallery
                    rows={caseStudy.descriptionSection.screenshotRows}
                    roundFirstImage
                  />
                </div>
              ) : null}
            </div>

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
