import {
  bindScrollMotion,
  getWorksHeadlineParallaxY,
  getWorksHeadlineRevealProgress,
} from "~/lib/section-scroll-motion.client";

const DESKTOP_LAYOUT = "(min-width: 48rem)";
const ANNOTATIONS_LAYOUT = "(min-width: 48rem)";
const ANNOTATION_REVEAL_START = 0.25;
const ANNOTATION_REVEAL_STAGGER = 0.22;
const ANNOTATION_REVEAL_DURATION = 0.35;
const CHAR_WRITE_MS = 28;
const SLIDE_WRITE_STAGGER_MS = 90;
const HEADLINE_SLIDE_ANIM_MS = 650;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

function getCheckedSlideIndex() {
  const checked = document.querySelector<HTMLInputElement>(
    'input[name="works-slide"]:checked',
  );
  if (!checked) return 0;
  return Number(checked.id.replace("works-slide-", ""));
}

function staggeredWriteProgress(reveal: number, index: number) {
  const start = ANNOTATION_REVEAL_START + index * ANNOTATION_REVEAL_STAGGER;

  return easeOutCubic(
    clamp((reveal - start) / ANNOTATION_REVEAL_DURATION, 0, 1),
  );
}

function prepareAnnotationChars(annotation: HTMLElement) {
  if (annotation.dataset.charsPrepared === "true") return;

  const text = (annotation.textContent ?? "").trim();
  annotation.textContent = "";
  annotation.dataset.charsPrepared = "true";

  for (const char of text) {
    const span = document.createElement("span");
    span.className = "works__annotation-char";
    span.textContent = char === " " ? "\u00a0" : char;
    annotation.appendChild(span);
  }
}

if (import.meta.env.DEV) {
  const probe = document.createElement("span");
  probe.textContent = "A B";
  prepareAnnotationChars(probe);
  console.assert(
    probe.querySelectorAll(".works__annotation-char").length === 3 &&
      probe.querySelector(".works__annotation-char")?.textContent === "A" &&
      probe.children[1]?.textContent === "\u00a0",
    "works annotation char split",
  );
}

function annotationChars(annotation: HTMLElement) {
  prepareAnnotationChars(annotation);
  return Array.from(
    annotation.querySelectorAll<HTMLElement>(".works__annotation-char"),
  );
}

function setAnnotationWrite(
  annotation: HTMLElement,
  progress: number,
  written: boolean,
) {
  const chars = annotationChars(annotation);
  const visibleCount = written
    ? chars.length
    : Math.min(chars.length, Math.floor(progress * chars.length));

  for (let index = 0; index < chars.length; index++) {
    chars[index].classList.toggle("is-visible", index < visibleCount);
  }

  annotation.classList.toggle("is-written", written || visibleCount >= chars.length);
}

function resetAnnotations(annotations: HTMLElement[]) {
  for (const annotation of annotations) {
    for (const char of annotation.querySelectorAll<HTMLElement>(".works__annotation-char")) {
      char.classList.remove("is-visible");
    }
    annotation.classList.remove("is-written");
  }
}

export function initWorksStageMotion(section: HTMLElement) {
  const desktopLayout = window.matchMedia(DESKTOP_LAYOUT);
  const annotationsLayout = window.matchMedia(ANNOTATIONS_LAYOUT);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const headlineTrack = section.querySelector<HTMLElement>(".works__headline-track");
  const slide0Visual = section.querySelector<HTMLElement>(".works__visual-panel--0");

  if (!headlineTrack) return () => {};

  const allAnnotations = Array.from(
    section.querySelectorAll<HTMLElement>(".works__annotation"),
  );
  for (const annotation of allAnnotations) {
    prepareAnnotationChars(annotation);
  }
  const writtenSlides = new Set<number>();
  let slideWriteTimers: number[] = [];
  let headlineAnimRaf = 0;
  let stageRevealed = false;
  let initialScrollY: number | null = null;
  let allowFigureDownPose = false;

  const clearSlideWriteTimers = () => {
    for (const timer of slideWriteTimers) {
      window.clearTimeout(timer);
    }
    slideWriteTimers = [];
    section.classList.remove("works--annotation-write");
  };

  const headlinePanels = Array.from(
    section.querySelectorAll<HTMLElement>(".works__headline-panel"),
  );

  const getHeadlinePanel = (slideIndex: number) =>
    section.querySelector<HTMLElement>(`.works__headline-panel--${slideIndex}`) ??
    headlineTrack;

  const cancelHeadlineAnim = () => {
    cancelAnimationFrame(headlineAnimRaf);
    headlineAnimRaf = 0;
  };

  const setHeadlineReveal = (
    reveal: number,
    slideIndex: number,
    viewportHeight: number,
  ) => {
    for (const panel of headlinePanels) {
      panel.style.removeProperty("opacity");
      panel.style.removeProperty("visibility");
      panel.style.removeProperty("transform");
    }

    const activePanel = section.querySelector<HTMLElement>(
      `.works__headline-panel--${slideIndex}`,
    );
    if (activePanel) {
      activePanel.style.opacity = String(reveal);
      activePanel.style.visibility = reveal > 0 ? "visible" : "hidden";

      if (reducedMotion || reveal >= 1) {
        activePanel.style.transform = "none";
        return;
      }

      const parallaxY = getWorksHeadlineParallaxY(viewportHeight, reveal);
      activePanel.style.transform = `translate3d(0, ${parallaxY}px, 0)`;
    }
  };

  const animateHeadlineOnSlideChange = (
    slideIndex: number,
    viewportHeight: number,
  ) => {
    cancelHeadlineAnim();

    if (reducedMotion) {
      setHeadlineReveal(1, slideIndex, viewportHeight);
      headlineTrack.classList.add("is-revealed");
      section.classList.add("works--stage-revealed");
      stageRevealed = true;
      return;
    }

    const animStart = performance.now();

    const tick = (now: number) => {
      const t = clamp((now - animStart) / HEADLINE_SLIDE_ANIM_MS, 0, 1);
      const reveal = easeOutCubic(t);

      setHeadlineReveal(reveal, slideIndex, viewportHeight);
      headlineTrack.classList.toggle("is-revealed", reveal >= 1);
      section.classList.toggle("works--stage-revealed", reveal >= 1);

      if (t < 1) {
        headlineAnimRaf = requestAnimationFrame(tick);
        return;
      }

      headlineAnimRaf = 0;
      stageRevealed = true;
    };

    setHeadlineReveal(0, slideIndex, viewportHeight);
    headlineTrack.classList.remove("is-revealed");
    headlineAnimRaf = requestAnimationFrame(tick);
  };

  const setFigureRise = (reveal: number, slideIndex: number) => {
    if (!slide0Visual) return;

    if (slideIndex !== 0) {
      slide0Visual.style.removeProperty("--works-figure-rise");
      return;
    }

    if (reducedMotion || reveal >= 1) {
      slide0Visual.style.setProperty("--works-figure-rise", "1");
      return;
    }

    if (reveal <= 0 && !allowFigureDownPose) {
      slide0Visual.style.setProperty("--works-figure-rise", "1");
      return;
    }

    slide0Visual.style.setProperty(
      "--works-figure-rise",
      String(easeOutCubic(reveal)),
    );
  };

  const clear = () => {
    clearSlideWriteTimers();
    cancelHeadlineAnim();
    stageRevealed = false;
    writtenSlides.clear();
    headlineTrack.classList.remove("is-revealed");
    for (const panel of headlinePanels) {
      panel.style.removeProperty("opacity");
      panel.style.removeProperty("visibility");
      panel.style.removeProperty("transform");
    }
    section.classList.remove("works--stage-revealed");
    slide0Visual?.style.removeProperty("--works-figure-rise");
    initialScrollY = null;
    allowFigureDownPose = false;
    resetAnnotations(allAnnotations);
  };

  const activeAnnotations = () => {
    const panel = section.querySelector<HTMLElement>(
      `.works__annotations-panel--${getCheckedSlideIndex()}`,
    );
    return panel
      ? Array.from(panel.querySelectorAll<HTMLElement>(".works__annotation"))
      : [];
  };

  const writeAnnotationsInstant = (annotations: HTMLElement[]) => {
    for (const annotation of annotations) {
      setAnnotationWrite(annotation, 1, true);
    }
  };

  const animateAnnotationChars = (annotation: HTMLElement, startDelay: number) => {
    const chars = annotationChars(annotation);

    chars.forEach((char, charIndex) => {
      slideWriteTimers.push(
        window.setTimeout(() => {
          char.classList.add("is-visible");
        }, startDelay + charIndex * CHAR_WRITE_MS),
      );
    });

    return startDelay + Math.max(chars.length - 1, 0) * CHAR_WRITE_MS;
  };

  const animateSlideWrite = (slideIndex: number) => {
    if (!annotationsLayout.matches) return;

    const annotations = Array.from(
      section.querySelector<HTMLElement>(
        `.works__annotations-panel--${slideIndex}`,
      )?.querySelectorAll<HTMLElement>(".works__annotation") ?? [],
    );

    if (annotations.length === 0) return;

    clearSlideWriteTimers();
    resetAnnotations(allAnnotations);
    writtenSlides.delete(slideIndex);

    if (reducedMotion) {
      writeAnnotationsInstant(annotations);
      writtenSlides.add(slideIndex);
      return;
    }

    section.classList.add("works--annotation-write");

    let writeEnd = 0;

    annotations.forEach((annotation, index) => {
      writeEnd = Math.max(
        writeEnd,
        animateAnnotationChars(annotation, index * SLIDE_WRITE_STAGGER_MS),
      );
    });

    slideWriteTimers.push(
      window.setTimeout(() => {
        section.classList.remove("works--annotation-write");
        for (const annotation of annotations) {
          annotation.classList.add("is-written");
        }
        writtenSlides.add(slideIndex);
      }, writeEnd + CHAR_WRITE_MS),
    );
  };

  const applyScrollAnnotations = (reveal: number, slideIndex: number) => {
    const visibleAnnotations = activeAnnotations();

    for (const annotation of allAnnotations) {
      if (!visibleAnnotations.includes(annotation)) {
        setAnnotationWrite(annotation, 0, false);
      }
    }

    if (!annotationsLayout.matches || section.classList.contains("works--annotation-write")) {
      return;
    }

    visibleAnnotations.forEach((annotation, index) => {
      const progress = reveal >= 1 ? 1 : staggeredWriteProgress(reveal, index);
      setAnnotationWrite(annotation, progress, progress >= 0.999);
    });

    if (reveal >= 1) {
      writtenSlides.add(slideIndex);
    } else {
      writtenSlides.delete(slideIndex);
    }
  };

  const update = () => {
    if (!desktopLayout.matches) {
      clear();
      return;
    }

    if (initialScrollY === null) {
      initialScrollY = window.scrollY;
    } else if (Math.abs(window.scrollY - initialScrollY) > 2) {
      allowFigureDownPose = true;
    }

    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const slideIndex = getCheckedSlideIndex();
    const headlinePanel = getHeadlinePanel(slideIndex);
    const reveal = reducedMotion
      ? 1
      : getWorksHeadlineRevealProgress(headlinePanel, viewportHeight);

    if (!headlineAnimRaf) {
      setHeadlineReveal(reveal, slideIndex, viewportHeight);
      headlineTrack.classList.toggle("is-revealed", reveal >= 1);
      section.classList.toggle("works--stage-revealed", reveal >= 1);

      if (reveal >= 1) {
        stageRevealed = true;
      }
    }

    setFigureRise(reveal, slideIndex);

    applyScrollAnnotations(reveal, slideIndex);
  };

  const onSlideChange = () => {
    const slideIndex = getCheckedSlideIndex();

    if (!desktopLayout.matches) return;

    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const scrollReveal = reducedMotion
      ? 1
      : getWorksHeadlineRevealProgress(getHeadlinePanel(slideIndex), viewportHeight);
    const stageReady = stageRevealed || scrollReveal >= 1;

    if (stageReady) {
      animateHeadlineOnSlideChange(slideIndex, viewportHeight);
      animateSlideWrite(slideIndex);
    } else {
      update();
    }
  };

  const onLayoutChange = () => {
    if (!desktopLayout.matches || !annotationsLayout.matches) {
      clearSlideWriteTimers();
    }
    update();
  };

  const radios = document.querySelectorAll<HTMLInputElement>('input[name="works-slide"]');
  for (const radio of radios) {
    radio.addEventListener("change", onSlideChange);
  }

  desktopLayout.addEventListener("change", onLayoutChange);
  annotationsLayout.addEventListener("change", onLayoutChange);

  const cleanupScroll = bindScrollMotion(update, reducedMotion);

  const resyncAfterRestore = () => {
    initialScrollY = window.scrollY;
    allowFigureDownPose = false;
    update();
    requestAnimationFrame(update);
  };

  window.addEventListener("pageshow", resyncAfterRestore);

  return () => {
    cleanupScroll();
    window.removeEventListener("pageshow", resyncAfterRestore);
    clearSlideWriteTimers();
    cancelHeadlineAnim();
    clear();

    for (const radio of radios) {
      radio.removeEventListener("change", onSlideChange);
    }

    desktopLayout.removeEventListener("change", onLayoutChange);
    annotationsLayout.removeEventListener("change", onLayoutChange);
  };
}
