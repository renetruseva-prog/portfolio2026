const MEALS_SLIDE_INDEX = 3;
const POP_MS = 850;
const STAGGER_MS = 80;
const EASING = "cubic-bezier(0.16, 1, 0.3, 1)";

function getCheckedSlideIndex() {
  const checked = document.querySelector<HTMLInputElement>(
    'input[name="works-slide"]:checked',
  );
  if (!checked) return 0;
  return Number(checked.id.replace("works-slide-", ""));
}

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

function revealReady(section: HTMLElement, props: HTMLElement[]) {
  section.classList.remove(
    "works--meals-intro",
    "works--meals-hold",
    "works--meals-play",
    "works--meals-measure",
  );
  section.classList.add("works--meals-ready");
  clearPropStyles(props);
}

function reset(section: HTMLElement, props: HTMLElement[]) {
  section.classList.remove(
    "works--meals-hold",
    "works--meals-play",
    "works--meals-ready",
    "works--meals-measure",
  );
  section.classList.add("works--meals-intro");
  clearPropStyles(props);
}

function measureHoldOffsets(visual: HTMLElement, props: HTMLElement[]) {
  for (const prop of props) {
    prop.style.transition = "none";
    prop.style.transform = restTransform();
  }

  void visual.offsetWidth;

  return props.map((prop) => getCenterOffset(prop, visual));
}

function holdPropsAtCenter(
  section: HTMLElement,
  visual: HTMLElement,
  props: HTMLElement[],
  offsets: Array<{ x: number; y: number }>,
) {
  section.classList.add("works--meals-intro", "works--meals-hold", "works--meals-measure");
  section.classList.remove("works--meals-ready", "works--meals-play");

  for (const [index, prop] of props.entries()) {
    prop.style.transition = "none";
    prop.style.transform = holdTransform(offsets[index].x, offsets[index].y);
  }

  void visual.offsetWidth;
  section.classList.remove("works--meals-measure");
}

export function initWorksMealsIntro(section: HTMLElement, mealsPanel: HTMLElement) {
  const props = Array.from(
    mealsPanel.querySelectorAll<HTMLElement>(".works__meals-prop--animate"),
  );

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealReady(section, props);
    return () => {};
  }

  let disposed = false;
  let finishTimer = 0;

  const play = () => {
    if (disposed) return;

    reset(section, props);

    const holdOffsets = measureHoldOffsets(mealsPanel, props);
    holdPropsAtCenter(section, mealsPanel, props, holdOffsets);

    requestAnimationFrame(() => {
      if (disposed) return;

      section.classList.remove("works--meals-hold");
      section.classList.add("works--meals-play");

      for (const [index, prop] of props.entries()) {
        prop.style.transition = "none";
        prop.style.transform = holdTransform(holdOffsets[index].x, holdOffsets[index].y);
      }

      void mealsPanel.offsetWidth;

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
          revealReady(section, props);
        }, totalMs);
      }, 20);
    });
  };

  const onSlideChange = () => {
    if (getCheckedSlideIndex() === MEALS_SLIDE_INDEX) {
      play();
    } else {
      window.clearTimeout(finishTimer);
      reset(section, props);
    }
  };

  const radios = document.querySelectorAll<HTMLInputElement>('input[name="works-slide"]');
  for (const radio of radios) {
    radio.addEventListener("change", onSlideChange);
  }

  if (getCheckedSlideIndex() === MEALS_SLIDE_INDEX) {
    play();
  } else {
    reset(section, props);
  }

  return () => {
    disposed = true;
    window.clearTimeout(finishTimer);
    for (const radio of radios) {
      radio.removeEventListener("change", onSlideChange);
    }
    clearPropStyles(props);
  };
}
