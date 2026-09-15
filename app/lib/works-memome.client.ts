import { getCheckedSlideIndex, subscribeSlideChange } from "./works-slide.client";

const MEMOME_SLIDE_INDEX = 1;
const PLAY_MS = 1200;

function revealReady(section: HTMLElement) {
  section.classList.remove("works--memome-intro", "works--memome-play");
  section.classList.add("works--memome-ready");
}

function reset(section: HTMLElement) {
  section.classList.remove("works--memome-intro", "works--memome-play", "works--memome-ready");
  section.classList.add("works--memome-intro");
}

export function initWorksMemomeIntro(section: HTMLElement, memomePanel: HTMLElement) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealReady(section);
    return () => {};
  }

  let disposed = false;
  let finishTimer = 0;

  const play = () => {
    if (disposed) return;

    reset(section);
    void memomePanel.offsetWidth;

    requestAnimationFrame(() => {
      if (disposed) return;
      section.classList.remove("works--memome-intro");
      section.classList.add("works--memome-play");

      window.clearTimeout(finishTimer);
      finishTimer = window.setTimeout(() => {
        if (disposed) return;
        revealReady(section);
      }, PLAY_MS);
    });
  };

  const unsubscribe = subscribeSlideChange(() => {
    if (getCheckedSlideIndex() === MEMOME_SLIDE_INDEX) {
      play();
    } else {
      window.clearTimeout(finishTimer);
      reset(section);
    }
  });

  if (getCheckedSlideIndex() === MEMOME_SLIDE_INDEX) {
    play();
  } else {
    reset(section);
  }

  return () => {
    disposed = true;
    window.clearTimeout(finishTimer);
    unsubscribe();
  };
}
