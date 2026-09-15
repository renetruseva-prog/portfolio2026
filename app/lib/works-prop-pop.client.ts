import { getCheckedSlideIndex, subscribeSlideChange } from "./works-slide.client";

const POP_MS = 850;
const STAGGER_MS = 80;
const EASING = "cubic-bezier(0.16, 1, 0.3, 1)";

type PropPopConfig = {
  slideIndex: number;
  /** State classes are `works--<prefix>-intro|hold|play|measure|ready`. */
  prefix: string;
  propSelector: string;
};

function getCenterOffset(element: HTMLElement, visual: HTMLElement) {
  const visualRect = visual.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  return {
    x: visualRect.left + visualRect.width / 2 - (elementRect.left + elementRect.width / 2),
    y: visualRect.top + visualRect.height / 2 - (elementRect.top + elementRect.height / 2),
  };
}

function restTransform() {
  return "translate3d(0, 0, 0) scale(1)";
}

function holdTransform(x: number, y: number) {
  return `translate3d(${x}px, ${y}px, 0) scale(0.2)`;
}

function clearPropStyles(props: HTMLElement[]) {
  for (const prop of props) {
    prop.style.removeProperty("transform");
    prop.style.removeProperty("transition");
    prop.style.removeProperty("transition-delay");
  }
}

/**
 * Props start scaled down at the panel's centre and pop out to their resting
 * spots. Offsets are measured per play because the panel size is responsive.
 */
export function initWorksPropPopIntro(
  section: HTMLElement,
  panel: HTMLElement,
  { slideIndex, prefix, propSelector }: PropPopConfig,
) {
  const props = Array.from(panel.querySelectorAll<HTMLElement>(propSelector));
  const state = {
    intro: `works--${prefix}-intro`,
    hold: `works--${prefix}-hold`,
    play: `works--${prefix}-play`,
    measure: `works--${prefix}-measure`,
    ready: `works--${prefix}-ready`,
  };

  const revealReady = () => {
    section.classList.remove(state.intro, state.hold, state.play, state.measure);
    section.classList.add(state.ready);
    clearPropStyles(props);
  };

  const reset = () => {
    section.classList.remove(state.hold, state.play, state.ready, state.measure);
    section.classList.add(state.intro);
    clearPropStyles(props);
  };

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealReady();
    return () => {};
  }

  let disposed = false;
  let finishTimer = 0;

  const measureHoldOffsets = () => {
    for (const prop of props) {
      prop.style.transition = "none";
      prop.style.transform = restTransform();
    }

    void panel.offsetWidth;

    return props.map((prop) => getCenterOffset(prop, panel));
  };

  const holdAtCenter = (offsets: Array<{ x: number; y: number }>) => {
    section.classList.add(state.intro, state.hold, state.measure);
    section.classList.remove(state.ready, state.play);

    for (const [index, prop] of props.entries()) {
      prop.style.transition = "none";
      prop.style.transform = holdTransform(offsets[index].x, offsets[index].y);
    }

    void panel.offsetWidth;
    section.classList.remove(state.measure);
  };

  const play = () => {
    if (disposed) return;

    reset();

    const holdOffsets = measureHoldOffsets();
    holdAtCenter(holdOffsets);

    requestAnimationFrame(() => {
      if (disposed) return;

      section.classList.remove(state.hold);
      section.classList.add(state.play);

      for (const [index, prop] of props.entries()) {
        prop.style.transition = "none";
        prop.style.transform = holdTransform(holdOffsets[index].x, holdOffsets[index].y);
      }

      void panel.offsetWidth;

      // One tick so the hold transform commits before the transition is armed,
      // otherwise the browser coalesces both writes and nothing animates.
      window.setTimeout(() => {
        if (disposed) return;

        for (const [index, prop] of props.entries()) {
          prop.style.transition = `transform ${POP_MS}ms ${EASING}`;
          prop.style.transitionDelay = `${index * STAGGER_MS}ms`;
          prop.style.transform = restTransform();
        }

        const totalMs = POP_MS + 120 + (props.length - 1) * STAGGER_MS;
        window.clearTimeout(finishTimer);
        finishTimer = window.setTimeout(() => {
          if (disposed) return;
          revealReady();
        }, totalMs);
      }, 20);
    });
  };

  const unsubscribe = subscribeSlideChange(() => {
    if (getCheckedSlideIndex() === slideIndex) {
      play();
    } else {
      window.clearTimeout(finishTimer);
      reset();
    }
  });

  if (getCheckedSlideIndex() === slideIndex) {
    play();
  } else {
    reset();
  }

  return () => {
    disposed = true;
    window.clearTimeout(finishTimer);
    unsubscribe();
    clearPropStyles(props);
  };
}

export function initWorksWebrtcIntro(section: HTMLElement, panel: HTMLElement) {
  return initWorksPropPopIntro(section, panel, {
    slideIndex: 2,
    prefix: "webrtc",
    propSelector: ".works__webrtc-sparkle--animate",
  });
}

export function initWorksMealsIntro(section: HTMLElement, panel: HTMLElement) {
  return initWorksPropPopIntro(section, panel, {
    slideIndex: 3,
    prefix: "meals",
    propSelector: ".works__meals-prop--animate",
  });
}
