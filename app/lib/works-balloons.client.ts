const POP_MS = 850;
const EASING = "cubic-bezier(0.16, 1, 0.3, 1)";

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
  let played = false;
  let finishTimer = 0;
  let pollTimer = 0;
  let observer: IntersectionObserver | null = null;
  let rafId = 0;

  const holdOffsets = measureHoldOffsets(visual, balloons);
  holdBalloonsAtCenter(section, visual, balloons, holdOffsets);

  const shouldPlay = () => isTargetVisible(visual) || isTargetVisible(section);

  const play = () => {
    if (played || disposed) return;
    played = true;
    detach();
    window.clearInterval(pollTimer);

    if (import.meta.env.DEV) {
      console.log("[works-balloons] play()");
    }

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

  const tryPlay = () => {
    if (played || disposed || !shouldPlay()) return;

    if (import.meta.env.DEV) {
      console.log("[works-balloons] tryPlay()");
    }

    play();
  };

  const scheduleTryPlay = () => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(tryPlay);
  };

  const ensureVisibleFallback = () => {
    if (disposed || played) return;
    if (!shouldPlay()) return;

    if (import.meta.env.DEV) {
      console.warn("[works-balloons] fallback reveal");
    }

    played = true;
    detach();
    revealReady(section, balloons);
  };

  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        scheduleTryPlay();
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

  const attach = () => {
    document.addEventListener("scroll", scheduleTryPlay, { passive: true, capture: true });
    document.addEventListener("touchmove", scheduleTryPlay, { passive: true, capture: true });
    document.addEventListener("touchend", scheduleTryPlay, { passive: true, capture: true });
    window.addEventListener("resize", scheduleTryPlay, { passive: true });
    window.visualViewport?.addEventListener("scroll", scheduleTryPlay, { passive: true });
    window.visualViewport?.addEventListener("resize", scheduleTryPlay, { passive: true });
  };

  const detach = () => {
    cancelAnimationFrame(rafId);
    observer?.disconnect();
    observer = null;
    document.removeEventListener("scroll", scheduleTryPlay, true);
    document.removeEventListener("touchmove", scheduleTryPlay, true);
    document.removeEventListener("touchend", scheduleTryPlay, true);
    window.removeEventListener("resize", scheduleTryPlay);
    window.visualViewport?.removeEventListener("scroll", scheduleTryPlay);
    window.visualViewport?.removeEventListener("resize", scheduleTryPlay);
  };

  attach();
  scheduleTryPlay();
  window.addEventListener("load", scheduleTryPlay, { once: true });

  pollTimer = window.setInterval(() => {
    if (disposed || played) {
      window.clearInterval(pollTimer);
      return;
    }

    if (shouldPlay()) {
      tryPlay();
    }
  }, 300);

  window.setTimeout(() => {
    if (!disposed && !played && shouldPlay()) {
      ensureVisibleFallback();
    }
  }, 2500);

  return () => {
    disposed = true;
    window.clearTimeout(finishTimer);
    window.clearInterval(pollTimer);
    detach();
  };
}
