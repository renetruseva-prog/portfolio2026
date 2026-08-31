import { useEffect, useLayoutEffect, useRef } from "react";
import { Link } from "react-router";

import { worksAssets, worksHeroSquiggle, worksProjects } from "~/content/site";
import { initWorksBalloonIntro } from "~/lib/works-balloons.client";
import { initWorksCarouselDrag } from "~/lib/works-carousel.client";
import { initWorksMealsIntro } from "~/lib/works-meals.client";
import { initWorksMemomeIntro } from "~/lib/works-memome.client";
import { initWorksSquiggleLayout } from "~/lib/works-squiggle.client";
import { initWorksWebrtcIntro } from "~/lib/works-webrtc.client";
import "./works-section.css";

const SLIDE_COUNT = worksProjects.length;

function slideId(index: number) {
  return `works-slide-${index}`;
}

function prevIndex(index: number) {
  return (index - 1 + SLIDE_COUNT) % SLIDE_COUNT;
}

function nextIndex(index: number) {
  return (index + 1) % SLIDE_COUNT;
}

const ANNOTATION_SLOTS = [
  "works__annotation--0",
  "works__annotation--1",
  "works__annotation--2",
] as const;

/** Slide 1 tag order in Figma: Creative Code, UX/UI, Design */
const SLIDE_ONE_ANNOTATION_ORDER = [0, 2, 1] as const;

function annotationTagOrder(slideIndex: number, tagCount: number) {
  const base = Array.from({ length: tagCount }, (_, index) => index);
  if (slideIndex !== 0 || tagCount < 3) return base;
  return [...SLIDE_ONE_ANNOTATION_ORDER];
}

export function WorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const squiggleRef = useRef<SVGSVGElement>(null);
  const squiggleEndRef = useRef<HTMLSpanElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const memomeRef = useRef<HTMLDivElement>(null);
  const webrtcRef = useRef<HTMLDivElement>(null);
  const mealsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const visual = visualRef.current;
    if (!section || !visual) return;
    return initWorksBalloonIntro(section, visual);
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const memome = memomeRef.current;
    if (!section || !memome) return;
    return initWorksMemomeIntro(section, memome);
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const webrtc = webrtcRef.current;
    if (!section || !webrtc) return;
    return initWorksWebrtcIntro(section, webrtc);
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const meals = mealsRef.current;
    if (!section || !meals) return;
    return initWorksMealsIntro(section, meals);
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const squiggle = squiggleRef.current;
    const endAnchor = squiggleEndRef.current;
    if (!section || !squiggle || !endAnchor) return;
    return initWorksSquiggleLayout(section, squiggle, endAnchor);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    return initWorksCarouselDrag(viewport);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="works"
      className="works"
      aria-labelledby="works-title"
    >
      <svg
        ref={squiggleRef}
        className="works__hero-squiggle"
        viewBox={worksHeroSquiggle.viewBox}
        preserveAspectRatio="xMaxYMin meet"
        overflow="visible"
        aria-hidden="true"
      >
        <path d={worksHeroSquiggle.path} />
      </svg>

      <div className="works__title-wrap">
        <h2 id="works-title" className="works__title display-title">
          Work<span ref={squiggleEndRef} className="works__title-squiggle-end">s</span>
        </h2>
      </div>

      <article className="works__card">
        {worksProjects.map((project, index) => (
          <input
            key={project.id}
            type="radio"
            name="works-slide"
            id={slideId(index)}
            className="works__radio"
            defaultChecked={index === 0}
            tabIndex={-1}
            aria-label={`Show project ${index + 1}: ${project.title}`}
          />
        ))}

        <div className="works__carousel">
          {worksProjects.map((_, index) => (
            <label
              key={`prev-${index}`}
              htmlFor={slideId(prevIndex(index))}
              className={`works__nav works__nav--prev works__nav--when-${index}`}
              aria-label="Previous project"
            >
              <img
                className="works__nav-icon"
                src={worksAssets.arrowLeft}
                alt=""
                width={83}
                height={37}
                draggable={false}
              />
            </label>
          ))}

          <div ref={viewportRef} className="works__card-viewport">
            <div className="works__drag-surface">
              <div className="works__stage">
                <div className="works__visual-track">
                  <div className="works__headline-track" aria-hidden="true">
                    {worksProjects.map((project, index) => (
                      <p
                        key={project.id}
                        className={`works__headline works__headline-panel works__headline-panel--${index}`}
                      >
                        {project.title}
                      </p>
                    ))}
                  </div>

                  <div className="works__circle-bg" aria-hidden="true" />
                  <div
                    ref={visualRef}
                    className="works__visual works__visual-panel works__visual-panel--0"
                  >
                    <div className="works__figure-layer works__figure-layer--clipped">
                      <div className="works__figure-box">
                        <img
                          className="works__figure"
                          src={worksAssets.slide1.figure}
                          alt=""
                          width={2000}
                          height={2083}
                          draggable={false}
                        />
                      </div>
                    </div>

                    <div className="works__figure-layer works__figure-layer--top">
                      <div className="works__figure-box">
                        <img
                          className="works__figure works__figure--cut"
                          src={worksAssets.slide1.figureCut}
                          alt=""
                          width={467}
                          height={684}
                          draggable={false}
                        />
                      </div>
                    </div>

                    <div className="works__balloons">
                      <img
                        className="works__balloon works__balloon--left works__balloon--animate"
                        src={worksAssets.slide1.balloonBlue}
                        alt=""
                        width={945}
                        height={1024}
                      />
                      <img
                        className="works__balloon works__balloon--top works__balloon--animate works__balloon--delay-1"
                        src={worksAssets.slide1.balloonPink}
                        alt=""
                        width={686}
                        height={1024}
                      />
                      <img
                        className="works__balloon works__balloon--right works__balloon--animate works__balloon--delay-2"
                        src={worksAssets.slide1.balloonBlue}
                        alt=""
                        width={945}
                        height={1024}
                      />
                    </div>
                  </div>

                  <div
                    ref={memomeRef}
                    className="works__visual works__visual-panel works__visual-panel--1 works__visual-panel--memome"
                  >
                    <img
                      className="works__memome-phone"
                      src={worksAssets.slide2.phone}
                      alt="Memome app map interface on a phone"
                      width={533}
                      height={931}
                      draggable={false}
                    />
                    <img
                      className="works__memome-grid works__memome-grid--animate"
                      src={worksAssets.slide2.greenGrid}
                      alt=""
                      width={95}
                      height={117}
                      draggable={false}
                    />
                    <img
                      className="works__memome-hand works__memome-hand--animate"
                      src={worksAssets.slide2.hand}
                      alt=""
                      width={70}
                      height={87}
                      draggable={false}
                    />
                  </div>

                  <div
                    ref={webrtcRef}
                    className="works__visual works__visual-panel works__visual-panel--2 works__visual-panel--webrtc"
                  >
                    <img
                      className="works__webrtc-phone"
                      src={worksAssets.slide3.phone}
                      alt="WebRTC phone controller interface"
                      width={1295}
                      height={1294}
                      draggable={false}
                    />
                    <img
                      className="works__webrtc-hand works__webrtc-hand--animate"
                      src={worksAssets.slide3.hand}
                      alt=""
                      width={467}
                      height={543}
                      draggable={false}
                    />
                    <img
                      className="works__webrtc-sparkle works__webrtc-sparkle--left works__webrtc-sparkle--animate"
                      src={worksAssets.slide3.sparkleLeft}
                      alt=""
                      width={521}
                      height={614}
                      draggable={false}
                    />
                    <img
                      className="works__webrtc-sparkle works__webrtc-sparkle--right works__webrtc-sparkle--animate"
                      src={worksAssets.slide3.sparkleRight}
                      alt=""
                      width={577}
                      height={620}
                      draggable={false}
                    />
                    <img
                      className="works__webrtc-sparkle works__webrtc-sparkle--bottom works__webrtc-sparkle--animate"
                      src={worksAssets.slide3.sparkleBottom}
                      alt=""
                      width={496}
                      height={364}
                      draggable={false}
                    />
                  </div>

                  <div
                    ref={mealsRef}
                    className="works__visual works__visual-panel works__visual-panel--3 works__visual-panel--meals"
                  >
                    <img
                      className="works__meals-foodbox"
                      src={worksAssets.slide4.foodbox}
                      alt="Miles and Meals food delivery box with ingredients"
                      width={1157}
                      height={1129}
                      draggable={false}
                    />
                    <img
                      className="works__meals-knife works__meals-prop--animate"
                      src={worksAssets.slide4.knife}
                      alt=""
                      width={89}
                      height={76}
                      draggable={false}
                    />
                    <img
                      className="works__meals-fork works__meals-prop--animate"
                      src={worksAssets.slide4.fork}
                      alt=""
                      width={92}
                      height={65}
                      draggable={false}
                    />
                    <img
                      className="works__meals-plate works__meals-prop--animate"
                      src={worksAssets.slide4.plate}
                      alt=""
                      width={105}
                      height={99}
                      draggable={false}
                    />
                  </div>

                  <div className="works__annotations-track" aria-hidden="true">
                    {worksProjects.map((project, index) => (
                      <div
                        key={project.id}
                        className={`works__annotations works__annotations-panel works__annotations-panel--${index}`}
                      >
                        {annotationTagOrder(index, project.tags.length).map((tagIndex, slotIndex) => (
                          <span
                            key={project.tags[tagIndex]}
                            className={`works__annotation ${ANNOTATION_SLOTS[slotIndex] ?? ANNOTATION_SLOTS[0]}`}
                          >
                            {project.tags[tagIndex]}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="works__details-track" aria-live="polite" aria-atomic="true">
                {worksProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className={`works__details works__details-panel works__details-panel--${index}`}
                  >
                    <h3 className="works__project-title display-title">{project.title}</h3>

                    <p className="works__tags">
                      {project.tags.map((tag, tagIndex) => (
                        <span key={tag} className="works__tag">
                          {tagIndex > 0 && (
                            <span className="works__tag-separator" aria-hidden="true">
                              {" "}
                              *{" "}
                            </span>
                          )}
                          <span
                            className={
                              tagIndex === 0
                                ? "works__tag-label works__tag-label--accent"
                                : "works__tag-label"
                            }
                          >
                            {tag}
                          </span>
                        </span>
                      ))}
                    </p>

                    <Link to={project.href} className="works__cta">
                      {project.ctaLabel}
                    </Link>
                  </div>
                ))}
              </div>

              <div className="works__dots" role="tablist" aria-label="Project slides">
                {worksProjects.map((project, index) => (
                  <label
                    key={project.id}
                    htmlFor={slideId(index)}
                    role="tab"
                    className={`works__dot works__dot--${index}`}
                    aria-label={`Go to project ${index + 1}: ${project.title}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {worksProjects.map((_, index) => (
            <label
              key={`next-${index}`}
              htmlFor={slideId(nextIndex(index))}
              className={`works__nav works__nav--next works__nav--when-${index}`}
              aria-label="Next project"
            >
              <img
                className="works__nav-icon works__nav-icon--next"
                src={worksAssets.arrowLeft}
                alt=""
                width={83}
                height={37}
                draggable={false}
              />
            </label>
          ))}
        </div>
      </article>
    </section>
  );
}
