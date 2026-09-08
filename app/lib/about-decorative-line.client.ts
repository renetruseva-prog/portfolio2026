import {
  bindScrollMotion,
  getDecorativeLineRevealProgress,
} from "~/lib/section-scroll-motion.client";

const DESKTOP_LAYOUT = "(min-width: 1140px)";

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
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
    const titleWrap =
      section.querySelector<HTMLElement>(".about__title-wrap") ?? section;
    const draw = reducedMotion
      ? 1
      : easeOutCubic(getDecorativeLineRevealProgress(titleWrap, viewportHeight));

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
