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
  const coreGridRef = useRef<HTMLDivElement>(null);
  const collageRef = useRef<HTMLDivElement>(null);
  const rusevaAnchorRef = useRef<HTMLSpanElement>(null);
  const rusevaCollageRef = useRef<HTMLParagraphElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const starRef = useRef<HTMLImageElement>(null);
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

  useEffect(() => {
    const layout = window.matchMedia("(min-width: 30rem)");
    const copyBelowRuseva = window.matchMedia("(min-width: 30rem) and (max-width: 1179px)");
    const hero = collageRef.current?.closest(".hero");

    const syncRusevaLayout = () => {
      const anchor = rusevaAnchorRef.current;
      const ruseva = rusevaCollageRef.current;
      const star = starRef.current;
      const copy = copyRef.current;
      const collage = collageRef.current;
      const renet = anchor?.closest(".hero__title-line--renet");

      if (!layout.matches || !anchor || !ruseva || !collage || !renet) {
        ruseva?.style.removeProperty("left");
        ruseva?.style.removeProperty("top");
        ruseva?.style.removeProperty("transform");
        star?.style.removeProperty("left");
        star?.style.removeProperty("top");
        star?.style.removeProperty("transform");
        copy?.style.removeProperty("margin-top");
        copy?.style.removeProperty("margin-left");
        return;
      }

      const anchorRect = anchor.getBoundingClientRect();
      const renetRect = renet.getBoundingClientRect();
      const coreGrid = coreGridRef.current;
      const positionRoot = coreGrid ?? collage;
      const rootRect = positionRoot.getBoundingClientRect();
      const heroEl = hero instanceof HTMLElement ? hero : null;
      const heroStyles = heroEl ? getComputedStyle(heroEl) : getComputedStyle(document.documentElement);
      const remPx = parseFloat(heroStyles.fontSize);
      const cssRem = (name: string, fallbackRem: number) => {
        const raw = heroStyles.getPropertyValue(name).trim();
        return raw.endsWith("rem") ? parseFloat(raw) * remPx : fallbackRem * remPx;
      };
      const rusevaGap = cssRem("--hero-name-line-gap", 3);
      const copyOffset = cssRem("--hero-copy-offset", 3);
      const rusevaLiftRatio =
        parseFloat(heroStyles.getPropertyValue("--hero-ruseva-lift")) || 0.3;
      const rusevaLift = ruseva.offsetHeight * rusevaLiftRatio;
      const rusevaLeft = anchorRect.left - rootRect.left;
      const rusevaTop = renetRect.bottom - rootRect.top + rusevaGap - rusevaLift;

      ruseva.style.left = `${rusevaLeft}px`;
      ruseva.style.top = `${rusevaTop}px`;
      ruseva.style.transform = "none";

      if (star) {
        const starGap = cssRem("--hero-star-gap", 2);
        const starCenterX =
          rusevaLeft +
          cssRem("--hero-star-x", 3.27) +
          cssRem("--hero-star-x-offset", 0) +
          cssRem("--hero-star-x-nudge", 0);
        const starWidth = star.offsetWidth;
        const starHeight = star.offsetHeight;
        star.style.left = `${starCenterX - starWidth / 2}px`;
        star.style.top = `${rusevaTop - starHeight - starGap}px`;
        star.style.transform = "none";
      }

      if (copy) {
        copy.style.marginTop = "0";
        copy.style.marginLeft = "0";
        const copyRect = copy.getBoundingClientRect();

        if (copyBelowRuseva.matches) {
          const rusevaRect = ruseva.getBoundingClientRect();
          const copyGap = cssRem("--hero-copy-below-ruseva-gap", 1);
          copy.style.marginTop = `${rusevaRect.bottom - copyRect.top + copyGap}px`;
          copy.style.marginLeft = `${rusevaRect.left - copyRect.left}px`;
        } else {
          copy.style.removeProperty("margin-left");
          const copyLiftRatio =
            parseFloat(heroStyles.getPropertyValue("--hero-copy-lift")) || 0.7;
          const copyLift = copyRect.height * copyLiftRatio;
          copy.style.marginTop = `${renetRect.bottom - copyRect.top + copyOffset - copyLift}px`;
        }
      }
    };

    syncRusevaLayout();

    const intro = hero?.querySelector(".hero__intro");
    const observer = hero ? new ResizeObserver(syncRusevaLayout) : null;
    if (hero) {
      observer?.observe(hero);
    }
    if (collageRef.current) {
      observer?.observe(collageRef.current);
    }
    if (intro instanceof HTMLElement) {
      observer?.observe(intro);
    }

    window.addEventListener("resize", syncRusevaLayout);
    layout.addEventListener("change", syncRusevaLayout);
    copyBelowRuseva.addEventListener("change", syncRusevaLayout);
    document.fonts?.ready.then(syncRusevaLayout);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", syncRusevaLayout);
      layout.removeEventListener("change", syncRusevaLayout);
      copyBelowRuseva.removeEventListener("change", syncRusevaLayout);
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
              Ren<span className="hero__title-ruseva-anchor" ref={rusevaAnchorRef}>e</span>t
            </span>{" "}
            <span className="hero__title-line hero__title-line--offset">Ruseva</span>
          </h1>
        </div>

        <div className="hero__copy" ref={copyRef}>
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

      <div className="hero__collage" aria-hidden="true" ref={collageRef}>
        <div className="hero__grid hero__grid--core" ref={coreGridRef}>
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
          <p
            ref={rusevaCollageRef}
            className="hero__title-line hero__title-line--collage display-title"
            aria-hidden="true"
          >
            Rusev<span id="hero-squiggle-start">a</span>
          </p>
          <img
            ref={starRef}
            className="hero__title-star"
            src={heroAssets.star}
            alt=""
            width={36}
            height={36}
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
