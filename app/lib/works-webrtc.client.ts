const WEBRTC_SLIDE_INDEX = 2;
const POP_MS = 850;
const STAGGER_MS = 80;
const EASING = "cubic-bezier(0.16, 1, 0.3, 1)";
const PLAY_MS = 1400;

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

function clearSparkleStyles(sparkles: HTMLElement[]) {
  for (const sparkle of sparkles) {
    sparkle.style.removeProperty("transform");
    sparkle.style.removeProperty("transition");
    sparkle.style.removeProperty("transition-delay");
  }
}

function revealReady(section: HTMLElement, sparkles: HTMLElement[]) {
  section.classList.remove(
    "works--webrtc-intro",
    "works--webrtc-hold",
    "works--webrtc-play",
    "works--webrtc-measure",
  );
  section.classList.add("works--webrtc-ready");
  clearSparkleStyles(sparkles);
}

function reset(section: HTMLElement, sparkles: HTMLElement[]) {
  section.classList.remove(
    "works--webrtc-hold",
    "works--webrtc-play",
    "works--webrtc-ready",
    "works--webrtc-measure",
  );
  section.classList.add("works--webrtc-intro");
  clearSparkleStyles(sparkles);
}

function measureHoldOffsets(visual: HTMLElement, sparkles: HTMLElement[]) {
  for (const sparkle of sparkles) {
    sparkle.style.transition = "none";
    sparkle.style.transform = restTransform();
  }

  void visual.offsetWidth;

  return sparkles.map((sparkle) => getCenterOffset(sparkle, visual));
}

function holdSparklesAtCenter(
  section: HTMLElement,
  visual: HTMLElement,
  sparkles: HTMLElement[],
  offsets: Array<{ x: number; y: number }>,
) {
  section.classList.add("works--webrtc-intro", "works--webrtc-hold", "works--webrtc-measure");
  section.classList.remove("works--webrtc-ready", "works--webrtc-play");

  for (const [index, sparkle] of sparkles.entries()) {
    sparkle.style.transition = "none";
    sparkle.style.transform = holdTransform(offsets[index].x, offsets[index].y);
  }

  void visual.offsetWidth;
  section.classList.remove("works--webrtc-measure");
}

export function initWorksWebrtcIntro(section: HTMLElement, webrtcPanel: HTMLElement) {
  const sparkles = Array.from(
    webrtcPanel.querySelectorAll<HTMLElement>(".works__webrtc-sparkle--animate"),
  );

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealReady(section, sparkles);
    return () => {};
  }

  let disposed = false;
  let finishTimer = 0;

  const play = () => {
    if (disposed) return;

    reset(section, sparkles);

    const holdOffsets = measureHoldOffsets(webrtcPanel, sparkles);
    holdSparklesAtCenter(section, webrtcPanel, sparkles, holdOffsets);

    requestAnimationFrame(() => {
      if (disposed) return;

      section.classList.remove("works--webrtc-hold");
      section.classList.add("works--webrtc-play");

      for (const [index, sparkle] of sparkles.entries()) {
        sparkle.style.transition = "none";
        sparkle.style.transform = holdTransform(holdOffsets[index].x, holdOffsets[index].y);
      }

      void webrtcPanel.offsetWidth;

      window.setTimeout(() => {
        if (disposed) return;

        for (const [index, sparkle] of sparkles.entries()) {
          sparkle.style.transition = `transform ${POP_MS}ms ${EASING}`;
          sparkle.style.transitionDelay = `${index * STAGGER_MS}ms`;
          sparkle.style.transform = restTransform();
        }

        const totalMs = POP_MS + 120 + (sparkles.length - 1) * STAGGER_MS;
        window.clearTimeout(finishTimer);
        finishTimer = window.setTimeout(() => {
          if (disposed) return;
          revealReady(section, sparkles);
        }, totalMs);
      }, 20);
    });
  };

  const onSlideChange = () => {
    if (getCheckedSlideIndex() === WEBRTC_SLIDE_INDEX) {
      play();
    } else {
      window.clearTimeout(finishTimer);
      reset(section, sparkles);
    }
  };

  const radios = document.querySelectorAll<HTMLInputElement>('input[name="works-slide"]');
  for (const radio of radios) {
    radio.addEventListener("change", onSlideChange);
  }

  if (getCheckedSlideIndex() === WEBRTC_SLIDE_INDEX) {
    play();
  } else {
    reset(section, sparkles);
  }

  return () => {
    disposed = true;
    window.clearTimeout(finishTimer);
    for (const radio of radios) {
      radio.removeEventListener("change", onSlideChange);
    }
    clearSparkleStyles(sparkles);
  };
}
