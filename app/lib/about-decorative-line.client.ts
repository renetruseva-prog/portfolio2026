import { bindScrollMotion } from "~/lib/section-scroll-motion.client";

const DESKTOP_LAYOUT = "(min-width: 1140px)";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

function getAboutRevealProgress(section: HTMLElement, viewportHeight: number) {
  const titleWrap =
    section.querySelector<HTMLElement>(".about__title-wrap") ?? section;
  const titleTop = titleWrap.getBoundingClientRect().top;
  const revealStart = viewportHeight * 1.06;
  const revealEnd = viewportHeight * 0.34;

  return clamp(
    (revealStart - titleTop) / Math.max(revealStart - revealEnd, 1),
    0,
    1,
  );
}

export function initAboutDecorativeLineDraw(section: HTMLElement) {
  const title = section.querySelector<HTMLElement>("#about-title");
  if (!title) return () => {};

  const layout = window.matchMedia(DESKTOP_LAYOUT);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const update = () => {
    if (!layout.matches) {
      title.style.removeProperty("--squiggle-draw");
      title.classList.remove("is-revealed");
      return;
    }

    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;
    const draw = reducedMotion
      ? 1
      : easeOutCubic(getAboutRevealProgress(section, viewportHeight));

    title.style.setProperty("--squiggle-draw", String(draw));
    title.classList.toggle("is-revealed", draw >= 1);
  };

  layout.addEventListener("change", update);
  const cleanupScroll = bindScrollMotion(update, reducedMotion);

  return () => {
    layout.removeEventListener("change", update);
    cleanupScroll();
    title.style.removeProperty("--squiggle-draw");
    title.classList.remove("is-revealed");
  };
}
