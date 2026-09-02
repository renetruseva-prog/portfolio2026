import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

import { heroAssets, site } from "~/content/site";
import {
  animateOrbitFromCenters,
  captureOrbitCenters,
  getFeaturedOrbitItem,
  getOrbitSlot,
  ORBIT_NOTE_BY_TYPE,
  ORBIT_PAUSE_MS,
  ORBIT_TRANSITION_MS,
  type OrbitItem,
} from "./hero-orbit";
import "./hero-section.css";

const ORBIT_ITEMS: OrbitItem[] = [
  {
    id: "sketchbook-twelve",
    type: "sketchbook",
    initialSlot: "twelve",
    src: heroAssets.sketchbook,
    width: 700,
    height: 700,
  },
  {
    id: "sketchbook-six",
    type: "sketchbook",
    initialSlot: "six",
    src: heroAssets.sketchbook,
    width: 700,
    height: 700,
  },
  {
    id: "coffee-four",
    type: "coffee",
    initialSlot: "four",
    src: heroAssets.icedCoffee,
    width: 800,
    height: 1137,
  },
  {
    id: "coffee-ten",
    type: "coffee",
    initialSlot: "ten",
    src: heroAssets.icedCoffee,
    width: 800,
    height: 1137,
  },
  {
    id: "laptop-three",
    type: "laptop",
    initialSlot: "three",
    src: heroAssets.laptop,
    width: 360,
    height: 360,
  },
  {
    id: "laptop-nine",
    type: "laptop",
    initialSlot: "nine",
    src: heroAssets.laptop,
    width: 360,
    height: 360,
  },
  {
    id: "scrunchie-one",
    type: "scrunchie",
    initialSlot: "one",
    src: heroAssets.scrunchieAndHairpin,
    width: 145,
    height: 145,
  },
  {
    id: "scrunchie-seven",
    type: "scrunchie",
    initialSlot: "seven",
    src: heroAssets.scrunchieAndHairpin,
    width: 145,
    height: 145,
  },
  {
    id: "wrench",
    type: "wrench",
    initialSlot: "wrench",
    src: heroAssets.tool,
    width: 92,
    height: 130,
  },
];

const ORBIT_ITEM_IDS = ORBIT_ITEMS.map((item) => item.id);

export function HeroSection() {
  const [orbitStep, setOrbitStep] = useState(0);
  const [displayStep, setDisplayStep] = useState(0);
  const [isOrbitAnimating, setIsOrbitAnimating] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const orbitStepRef = useRef(0);
  const itemRefs = useRef<Map<string, HTMLImageElement>>(new Map);
  const cancelAnimationRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (media.matches) {
      return;
    }

    let pauseTimeoutId = 0;

    const advanceOrbit = () => {
      const grid = gridRef.current;
      if (!grid) {
        return;
      }

      const prevStep = orbitStepRef.current;
      const nextStep = prevStep + 1;

      const starts = captureOrbitCenters(ORBIT_ITEM_IDS, (id) =>
        itemRefs.current.get(id) ?? null,
      );

      flushSync(() => {
        setOrbitStep(nextStep);
        setIsOrbitAnimating(true);
      });

      orbitStepRef.current = nextStep;

      cancelAnimationRef.current?.();
      cancelAnimationRef.current = animateOrbitFromCenters({
        starts,
        itemIds: ORBIT_ITEM_IDS,
        getItemElement: (id) => itemRefs.current.get(id) ?? null,
        getScaleState: (id) => {
          const item = ORBIT_ITEMS.find((orbitItem) => orbitItem.id === id);
          if (!item) {
            return null;
          }

          const fromSlot = getOrbitSlot(item.initialSlot, prevStep);
          const toSlot = getOrbitSlot(item.initialSlot, nextStep);

          return {
            fromFeatured: fromSlot === "nine",
            toFeatured: toSlot === "nine",
            flipX: item.type === "sketchbook",
          };
        },
        durationMs: ORBIT_TRANSITION_MS,
        onComplete: () => {
          flushSync(() => {
            setDisplayStep(nextStep);
            setIsOrbitAnimating(false);
          });
          pauseTimeoutId = window.setTimeout(advanceOrbit, ORBIT_PAUSE_MS);
        },
      });
    };

    pauseTimeoutId = window.setTimeout(advanceOrbit, ORBIT_PAUSE_MS);

    return () => {
      window.clearTimeout(pauseTimeoutId);
      cancelAnimationRef.current?.();
    };
  }, []);

  const featuredItem = getFeaturedOrbitItem(ORBIT_ITEMS, displayStep);
  const noteLabel = featuredItem
    ? ORBIT_NOTE_BY_TYPE[featuredItem.type]
    : ORBIT_NOTE_BY_TYPE.laptop;

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__content">
        <div className="hero__intro">
          <p className="hero__tagline display-title">{site.tagline}</p>

          <h1 id="hero-title" className="hero__title display-title">
            <span className="hero__title-line hero__title-line--renet">
              Ren<span className="hero__title-ruseva-anchor">e</span>t
            </span>{" "}
            <span className="hero__title-line hero__title-line--offset">Ruseva</span>
          </h1>
        </div>
      </div>

      <div className="hero__ruseva-group">
        <p
          className="hero__title-line hero__title-line--collage display-title"
          aria-hidden="true"
        >
          Rusev<span id="hero-squiggle-start">a</span>
        </p>

        <div className="hero__copy">
          <p className="hero__bio">{site.bio}</p>

          <a href={site.cta.href} className="hero__cta">
            {site.cta.label}
            <img
              className="hero__cta-arrow"
              src={heroAssets.ctaArrow}
              alt=""
              width={30}
              height={20}
            />
          </a>
        </div>
      </div>

      <img
        className="hero__title-star"
        src={heroAssets.star}
        alt=""
        width={36}
        height={36}
        aria-hidden="true"
      />

      <div className="hero__collage" aria-hidden="true">
        <div className="hero__grid hero__grid--core">
          <img
            className="hero__item hero__item--circle"
            src={heroAssets.circle}
            alt=""
            width={274}
            height={274}
          />
          <img
            className="hero__item hero__item--photo"
            src={heroAssets.photo}
            alt=""
            width={327}
            height={435}
          />
          <img
            className="hero__item hero__item--hand"
            src={heroAssets.hand}
            alt=""
            width={1199}
            height={782}
          />
        </div>

        <div className="hero__grid hero__grid--orbit" ref={gridRef}>
          {ORBIT_ITEMS.map((item) => {
            const slot = getOrbitSlot(item.initialSlot, orbitStep);
            const settledSlot = getOrbitSlot(item.initialSlot, displayStep);
            const isFeatured = settledSlot === "nine";

            return (
              <img
                key={item.id}
                ref={(node) => {
                  if (node) {
                    itemRefs.current.set(item.id, node);
                  } else {
                    itemRefs.current.delete(item.id);
                  }
                }}
                className={[
                  "hero__item",
                  "hero__item--orbit",
                  `hero__item--${item.type}`,
                  `hero__item--slot-${slot}`,
                  isOrbitAnimating ? "hero__item--animating" : "",
                  isFeatured ? "hero__item--featured" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                src={item.src}
                alt=""
                width={item.width}
                height={item.height}
              />
            );
          })}
        </div>

        <div className="hero__grid hero__grid--annotations" aria-hidden="true">
          <img
            className="hero__item hero__item--header-arrow"
            src={heroAssets.headerArrow}
            alt=""
            width={68}
            height={68}
          />
          <p className="hero__note">{noteLabel}</p>
        </div>
      </div>
    </section>
  );
}
