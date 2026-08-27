const BALLOON_SLIDE_INDEX = 0;
const POP_MS = 850;
const EASING = "cubic-bezier(0.16, 1, 0.3, 1)";

function getCheckedSlideIndex() {
  const checked = document.querySelector<HTMLInputElement>(
    'input[name="works-slide"]:checked',
  );
  if (!checked) return 0;
  return Number(checked.id.replace("works-slide-", ""));
}

function readBalloonMirror(balloon: HTMLElement) {
  const value = getComputedStyle(balloon).getPropertyValue("--balloon-mirror").trim();
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : -1;
}

function getCircleCenterOffset(balloon: HTMLElement, visual: HTMLElement) {
  const visualRect = visual.getBoundingClientRect();
  const balloonRect = balloon.getBoundingClientRect();

  return {
    x: visualRect.left + visualRect.width / 2 - (balloonRect.left + balloonRect.width / 2),
    y: visualRect.top + visualRect.height / 2 - (balloonRect.top + balloonRect.height / 2),
  };
}

function restTransform(mirror: number) {
  return `translate3d(0, 0, 0) scale(1) scaleX(${mirror})`;
}

function holdTransform(mirror: number, x: number, y: number) {
  return `translate3d(${x}px, ${y}px, 0) scale(0.2) scaleX(${mirror})`;
}

function isTargetVisible(target: HTMLElement) {
  const rect = target.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

  if (rect.height < 48) return false;

  const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
  return visibleHeight >= Math.min(rect.height * 0.15, 64);
}

function revealReady(section: HTMLElement, balloons: HTMLElement[]) {
  section.classList.remove(
    "works--balloons-intro",
    "works--balloons-hold",
    "works--balloons-play",
    "works--balloons-measure",
  );
  section.classList.add("works--balloons-ready");

  for (const balloon of balloons) {
    balloon.style.removeProperty("transform");
    balloon.style.removeProperty("transition");
  }
}

function measureHoldOffsets(visual: HTMLElement, balloons: HTMLElement[]) {
  for (const balloon of balloons) {
    balloon.style.transition = "none";
    balloon.style.transform = restTransform(readBalloonMirror(balloon));
  }

  void visual.offsetWidth;

  return balloons.map((balloon) => getCircleCenterOffset(balloon, visual));
}

function holdBalloonsAtCenter(
  section: HTMLElement,
  visual: HTMLElement,
  balloons: HTMLElement[],
  offsets: Array<{ x: number; y: number }>,
) {
  section.classList.add("works--balloons-intro", "works--balloons-hold", "works--balloons-measure");
  section.classList.remove("works--balloons-ready", "works--balloons-play");

  for (const [index, balloon] of balloons.entries()) {
    const mirror = readBalloonMirror(balloon);
    balloon.style.transition = "none";
    balloon.style.transform = holdTransform(mirror, offsets[index].x, offsets[index].y);
  }

  void visual.offsetWidth;
  section.classList.remove("works--balloons-measure");
}

export function initWorksBalloonIntro(section: HTMLElement, visual: HTMLElement) {
  const balloons = Array.from(
    visual.querySelectorAll<HTMLElement>(".works__balloon--animate"),
  );

  if (balloons.length === 0) {
    revealReady(section, balloons);
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealReady(section, balloons);
    return;
  }

  let disposed = false;
  let scrollIntroPlayed = false;
  let finishTimer = 0;
  let pollTimer = 0;
  let observer: IntersectionObserver | null = null;
  let rafId = 0;
  let holdOffsets = measureHoldOffsets(visual, balloons);

  const reset = () => {
    window.clearTimeout(finishTimer);
    holdOffsets = measureHoldOffsets(visual, balloons);
    holdBalloonsAtCenter(section, visual, balloons, holdOffsets);
  };

  const runPop = () => {
    section.classList.remove("works--balloons-hold");
    section.classList.add("works--balloons-play");

    for (const [index, balloon] of balloons.entries()) {
      const mirror = readBalloonMirror(balloon);
      balloon.style.transition = "none";
      balloon.style.transform = holdTransform(mirror, holdOffsets[index].x, holdOffsets[index].y);
    }

    void visual.offsetWidth;

    window.setTimeout(() => {
      if (disposed) return;

      for (const [index, balloon] of balloons.entries()) {
        const mirror = readBalloonMirror(balloon);
        balloon.style.transition = `transform ${POP_MS}ms ${EASING}`;
        balloon.style.transform = restTransform(mirror);
      }

      finishTimer = window.setTimeout(() => {
        if (disposed) return;
        revealReady(section, balloons);
      }, POP_MS + 120);
    }, 20);
  };

  const play = (source: "scroll" | "slide") => {
    if (disposed) return;
    if (source === "scroll" && scrollIntroPlayed) return;
    if (getCheckedSlideIndex() !== BALLOON_SLIDE_INDEX) return;

    window.clearTimeout(finishTimer);
    holdOffsets = measureHoldOffsets(visual, balloons);
    holdBalloonsAtCenter(section, visual, balloons, holdOffsets);

    requestAnimationFrame(() => {
      if (disposed) return;
      runPop();
    });

    if (source === "scroll") {
      scrollIntroPlayed = true;
      detachScroll();
      window.clearInterval(pollTimer);
    }
  };

  const tryPlayScroll = () => {
    if (disposed || scrollIntroPlayed) return;
    if (getCheckedSlideIndex() !== BALLOON_SLIDE_INDEX) return;
    if (!isTargetVisible(visual) && !isTargetVisible(section)) return;

    if (import.meta.env.DEV) {
      console.log("[works-balloons] tryPlay()");
    }

    play("scroll");
  };

  const scheduleTryPlayScroll = () => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(tryPlayScroll);
  };

  const ensureVisibleFallback = () => {
    if (disposed || scrollIntroPlayed) return;
    if (getCheckedSlideIndex() !== BALLOON_SLIDE_INDEX) return;
    if (!isTargetVisible(visual) && !isTargetVisible(section)) return;

    if (import.meta.env.DEV) {
      console.warn("[works-balloons] fallback reveal");
    }

    revealReady(section, balloons);
    scrollIntroPlayed = true;
    detachScroll();
    window.clearInterval(pollTimer);
  };

  const onSlideChange = () => {
    if (getCheckedSlideIndex() === BALLOON_SLIDE_INDEX) {
      if (import.meta.env.DEV) {
        console.log("[works-balloons] play(slide)");
      }
      play("slide");
    } else {
      window.clearTimeout(finishTimer);
      reset();
    }
  };

  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        scheduleTryPlayScroll();
      }
    },
    {
      root: null,
      rootMargin: "0px 0px 20% 0px",
      threshold: 0,
    },
  );

  observer.observe(visual);
  observer.observe(section);

  const attachScroll = () => {
    document.addEventListener("scroll", scheduleTryPlayScroll, { passive: true, capture: true });
    document.addEventListener("touchmove", scheduleTryPlayScroll, { passive: true, capture: true });
    document.addEventListener("touchend", scheduleTryPlayScroll, { passive: true, capture: true });
    window.addEventListener("resize", scheduleTryPlayScroll, { passive: true });
    window.visualViewport?.addEventListener("scroll", scheduleTryPlayScroll, { passive: true });
    window.visualViewport?.addEventListener("resize", scheduleTryPlayScroll, { passive: true });
  };

  const detachScroll = () => {
    cancelAnimationFrame(rafId);
    observer?.disconnect();
    observer = null;
    document.removeEventListener("scroll", scheduleTryPlayScroll, true);
    document.removeEventListener("touchmove", scheduleTryPlayScroll, true);
    document.removeEventListener("touchend", scheduleTryPlayScroll, true);
    window.removeEventListener("resize", scheduleTryPlayScroll);
    window.visualViewport?.removeEventListener("scroll", scheduleTryPlayScroll);
    window.visualViewport?.removeEventListener("resize", scheduleTryPlayScroll);
  };

  const radios = document.querySelectorAll<HTMLInputElement>('input[name="works-slide"]');
  for (const radio of radios) {
    radio.addEventListener("change", onSlideChange);
  }

  reset();
  attachScroll();
  scheduleTryPlayScroll();
  window.addEventListener("load", scheduleTryPlayScroll, { once: true });

  pollTimer = window.setInterval(() => {
    if (disposed || scrollIntroPlayed) {
      window.clearInterval(pollTimer);
      return;
    }

    if (getCheckedSlideIndex() === BALLOON_SLIDE_INDEX) {
      tryPlayScroll();
    }
  }, 300);

  window.setTimeout(() => {
    if (!disposed && !scrollIntroPlayed && getCheckedSlideIndex() === BALLOON_SLIDE_INDEX) {
      ensureVisibleFallback();
    }
  }, 2500);

  return () => {
    disposed = true;
    window.clearTimeout(finishTimer);
    window.clearInterval(pollTimer);
    detachScroll();
    for (const radio of radios) {
      radio.removeEventListener("change", onSlideChange);
    }
  };
}
