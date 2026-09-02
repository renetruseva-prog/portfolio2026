import { bindScrollMotion } from "~/lib/section-scroll-motion.client";

export function initLanguagesWiggle(section: HTMLElement) {
  const tags = Array.from(section.querySelectorAll<HTMLElement>(".languages__tags li"));

  if (tags.length === 0) {
    return () => {};
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const playWiggle = (tag: HTMLElement) => {
    tag.classList.remove("is-wiggling");
    void tag.offsetWidth;
    tag.classList.add("is-wiggling");
  };

  const updateScrollWiggles = () => {
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const triggerLine = viewportHeight * 0.72;

    tags.forEach((tag) => {
      const rect = tag.getBoundingClientRect();
      const tagCenter = rect.top + rect.height / 2;
      const hasCrossedTrigger = tagCenter <= triggerLine && rect.bottom > viewportHeight * 0.08;

      if (hasCrossedTrigger) {
        if (tag.dataset.scrollWiggled === "true") return;
        playWiggle(tag);
        tag.dataset.scrollWiggled = "true";
        return;
      }

      if (rect.top > triggerLine + rect.height) {
        tag.dataset.scrollWiggled = "false";
      }
    });
  };

  const cleanups = tags.map((tag) => {
    const onClick = () => playWiggle(tag);
    const onAnimationEnd = (event: AnimationEvent) => {
      if (event.target !== tag) return;
      tag.classList.remove("is-wiggling");
    };

    tag.addEventListener("click", onClick);
    tag.addEventListener("animationend", onAnimationEnd);

    return () => {
      tag.removeEventListener("click", onClick);
      tag.removeEventListener("animationend", onAnimationEnd);
      tag.classList.remove("is-wiggling");
      delete tag.dataset.scrollWiggled;
    };
  });

  const cleanupScroll = bindScrollMotion(updateScrollWiggles, reducedMotion);

  return () => {
    cleanupScroll();

    for (const cleanup of cleanups) {
      cleanup();
    }
  };
}
