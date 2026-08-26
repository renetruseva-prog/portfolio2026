import { useCallback, useState } from "react";

import { worksAssets, worksProjects } from "~/content/site";
import "./works-section.css";

export function WorksSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const projectCount = worksProjects.length;
  const project = worksProjects[activeIndex];

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex((index + projectCount) % projectCount);
    },
    [projectCount],
  );

  const goPrev = useCallback(() => {
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  const goNext = useCallback(() => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  return (
    <section id="works" className="works" aria-labelledby="works-title">
      <h2 id="works-title" className="works__title display-title">
        Works
      </h2>

      <div className="works__carousel">
        <button
          type="button"
          className="works__nav works__nav--prev"
          aria-label="Previous project"
          onClick={goPrev}
        >
          <img
            className="works__nav-icon works__nav-icon--prev"
            src={worksAssets.arrowLeft}
            alt=""
            width={83}
            height={37}
          />
        </button>

        <div className="works__stage" aria-live="polite" aria-atomic="true">
          <div className="works__visual">
            <img
              className="works__circle"
              src={worksAssets.circle}
              alt=""
              width={274}
              height={274}
            />
            <img
              className="works__figure"
              src={worksAssets.figure}
              alt=""
              width={2000}
              height={2083}
            />
            <img
              className="works__balloon works__balloon--left works__balloon--animate"
              src={worksAssets.balloonBlue}
              alt=""
              width={945}
              height={1024}
            />
            <img
              className="works__balloon works__balloon--top works__balloon--animate works__balloon--delay-1"
              src={worksAssets.balloonPink}
              alt=""
              width={686}
              height={1024}
            />
            <img
              className="works__balloon works__balloon--right works__balloon--animate works__balloon--delay-2"
              src={worksAssets.balloonBlue}
              alt=""
              width={945}
              height={1024}
            />
          </div>
        </div>

        <button
          type="button"
          className="works__nav works__nav--next"
          aria-label="Next project"
          onClick={goNext}
        >
          <img
            className="works__nav-icon"
            src={worksAssets.arrowRight}
            alt=""
            width={83}
            height={37}
          />
        </button>
      </div>

      <div className="works__details">
        <h3 className="works__project-title display-title">
          <span className="works__project-title-line">{project.title[0]}</span>
          <span className="works__project-title-line">{project.title[1]}</span>
        </h3>

        <p className="works__tags">
          {project.tags.map((tag, index) => (
            <span key={tag} className="works__tag">
              {index > 0 && (
                <span className="works__tag-separator" aria-hidden="true">
                  {" "}
                  *{" "}
                </span>
              )}
              <span
                className={
                  index === 0 ? "works__tag-label works__tag-label--accent" : "works__tag-label"
                }
              >
                {tag}
              </span>
            </span>
          ))}
        </p>

        <a href={project.href} className="works__cta">
          {project.ctaLabel}
        </a>
      </div>

      <div className="works__dots" role="tablist" aria-label="Project slides">
        {worksProjects.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              className={`works__dot${isActive ? " works__dot--active" : ""}`}
              aria-label={`Go to project ${index + 1}`}
              aria-selected={isActive}
              onClick={() => goTo(index)}
            />
          );
        })}
      </div>
    </section>
  );
}
