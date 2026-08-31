import { bindScrollMotion } from "~/lib/section-scroll-motion.client";

const DESKTOP_LAYOUT = "(min-width: 30rem)";
const SQUIGGLE_START_ID = "hero-squiggle-start";

/** Figma Vector 588 — the path runs from the Works “s” (bottom-left) to the RUSEVA “A” foot (top-right). */
const SVG_START = { x: 723.034, y: 0.559 };
const SVG_TIP = { x: 0.334, y: 411.123 };
const SVG_RUN = SVG_START.x - SVG_TIP.x;
const SVG_RISE = SVG_TIP.y - SVG_START.y;
const SVG_ASPECT = SVG_RISE / SVG_RUN;

/** The tip meets the “s” a quarter of the way down the glyph. */
const TIP_ON_S = 0.25;
/**
 * Uniform scale can only reach both letters while the live A→“s” diagonal matches the
 * curve's own. It does, exactly, across the wide desktop layout the design was drawn for;
 * below it RUSEVA drops to a smaller size far to the left of Works, and no scale reaches
 * both terminals without rotating or stretching the curve — so drop it rather than leave
 * a loose end dangling in the gap.
 */
const ASPECT_TOLERANCE = 0.1;

let measureCtx: CanvasRenderingContext2D | null | undefined;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

function getSquiggleDrawProgress(section: HTMLElement, viewportHeight: number) {
  const hero = document.querySelector(".hero");
  const title =
    section.querySelector<HTMLElement>(".works__title-wrap") ?? section;
  const titleTop = title.getBoundingClientRect().top;
  const revealStart = viewportHeight * 1.06;
  const revealEnd = viewportHeight * 0.34;

  const raw = clamp(
    (revealStart - titleTop) / Math.max(revealStart - revealEnd, 1),
    0,
    1,
  );

  if (!hero) return raw;

  const gate = clamp(
    (viewportHeight * 0.92 - hero.getBoundingClientRect().bottom) /
      Math.max(viewportHeight * 0.2, 1),
    0,
    1,
  );

  return raw * gate;
}

/**
 * Ink box of one glyph in page coordinates. An inline span's client rect covers the font's
 * full ascent and descent, which for this display serif runs ~45% taller than the visible
 * letter, so measuring the glyph is the only way to hit the “A” foot and the “s” exactly.
 */
function glyphBox(el: Element, char: string) {
  measureCtx ??= document.createElement("canvas").getContext("2d");
  if (!measureCtx) return null;

  const style = getComputedStyle(el);
  measureCtx.font = `${style.fontStyle} ${style.fontWeight} ${parseFloat(style.fontSize)}px ${style.fontFamily}`;

  const m = measureCtx.measureText(char);
  const rect = el.getBoundingClientRect();
  const baseline = rect.top + window.scrollY + m.fontBoundingBoxAscent;
  const box = {
    right: rect.left + window.scrollX + m.actualBoundingBoxRight,
    top: baseline - m.actualBoundingBoxAscent,
    bottom: baseline + m.actualBoundingBoxDescent,
  };

  return Object.values(box).every(Number.isFinite) ? box : null;
}

type Point = { x: number; y: number };

/** Uniform-scale placement pinning both terminals, or null when the letters are out of reach. */
function solve(aFoot: Point, tip: Point) {
  const run = aFoot.x - tip.x;
  const rise = tip.y - aFoot.y;
  if (run <= 0 || rise <= 0) return null;
  if (Math.abs(rise / run / SVG_ASPECT - 1) > ASPECT_TOLERANCE) return null;

  const scale = run / SVG_RUN;
  return {
    scale,
    left: tip.x - SVG_TIP.x * scale,
    top: tip.y - SVG_TIP.y * scale,
  };
}

export function initWorksSquiggleLayout(
  section: HTMLElement,
  squiggle: SVGSVGElement,
  endAnchor: HTMLElement,
) {
  const layout = window.matchMedia(DESKTOP_LAYOUT);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let visible = false;

  // `.page-main` sets `overflow-x: hidden`, which clips the connector where it reaches up
  // into the hero, so it has to hang off the body instead.
  if (squiggle.parentElement !== document.body) {
    document.body.appendChild(squiggle);
  }

  const clear = () => {
    squiggle.style.display = "none";
    visible = false;
    squiggle.style.setProperty("--squiggle-draw", "0");
    squiggle.classList.remove("is-revealed");
  };

  const updateDraw = () => {
    if (!visible) {
      squiggle.style.setProperty("--squiggle-draw", "0");
      squiggle.classList.remove("is-revealed");
      return;
    }

    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;
    const draw = reducedMotion
      ? 1
      : easeOutCubic(getSquiggleDrawProgress(section, viewportHeight));

    squiggle.style.setProperty("--squiggle-draw", String(draw));
    squiggle.classList.toggle("is-revealed", draw >= 1);
  };

  const sync = () => {
    const startAnchor = document.getElementById(SQUIGGLE_START_ID);
    if (!layout.matches || !startAnchor) {
      clear();
      return;
    }

    const a = glyphBox(startAnchor, "A");
    const s = glyphBox(endAnchor, "s");
    if (!a || !s) {
      clear();
      return;
    }

    const placement = solve(
      { x: a.right, y: a.bottom },
      { x: s.right, y: s.top + (s.bottom - s.top) * TIP_ON_S },
    );
    if (!placement) {
      clear();
      return;
    }

    squiggle.style.display = "block";
    squiggle.style.left = `${placement.left}px`;
    squiggle.style.top = `${placement.top}px`;
    squiggle.style.transform = `scale(${placement.scale})`;
    visible = true;
    updateDraw();
  };

  sync();
  requestAnimationFrame(() => requestAnimationFrame(sync));
  void document.fonts.ready.then(sync);

  window.addEventListener("resize", sync);
  layout.addEventListener("change", sync);

  const cleanupScroll = bindScrollMotion(updateDraw, reducedMotion);

  const observer = new ResizeObserver(sync);
  for (const el of [section, endAnchor, document.querySelector(".hero")]) {
    if (el) observer.observe(el);
  }

  const collage = document.querySelector(".hero__title-line--collage");
  const styleObserver = new MutationObserver(sync);
  if (collage) {
    styleObserver.observe(collage, { attributes: true, attributeFilter: ["style"] });
  }

  return () => {
    cleanupScroll();
    window.removeEventListener("resize", sync);
    layout.removeEventListener("change", sync);
    styleObserver.disconnect();
    observer.disconnect();
    clear();
    squiggle.style.removeProperty("--squiggle-draw");
    if (squiggle.parentElement === document.body) {
      section.insertBefore(squiggle, section.firstChild);
    }
  };
}

if (import.meta.env.DEV) {
  // Measured in Chrome across the wide desktop layout: “A” foot (1077.8, 542.0), “s” tip (389.2, 933.2).
  const placement = solve({ x: 1077.8, y: 542 }, { x: 389.2, y: 933.2 });
  const startX = placement && placement.left + SVG_START.x * placement.scale;
  const startY = placement && placement.top + SVG_START.y * placement.scale;
  console.assert(
    startX !== null && Math.abs(startX - 1077.8) < 1 && Math.abs(startY! - 542) < 1,
    `works-squiggle: start should land on the “A” foot, got ${startX}, ${startY}`,
  );
  console.assert(
    solve({ x: 531, y: 383 }, { x: 341, y: 710.6 }) === null,
    "works-squiggle: out-of-reach letters should drop the connector",
  );
}
