function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

function getRevealProgress(
  element: HTMLElement,
  viewportHeight: number,
  startRatio = 0.88,
  endRatio = 0.62,
) {
  const rect = element.getBoundingClientRect();
  const revealStart = viewportHeight * startRatio;
  const revealEnd = viewportHeight * endRatio;

  return clamp(
    (revealStart - rect.top) / Math.max(revealStart - revealEnd, 1),
    0,
    1,
  );
}

export function bindScrollMotion(
  update: () => void,
  reducedMotion: boolean,
) {
  if (reducedMotion) {
    update();
    return () => {};
  }

  let disposed = false;
  let rafId = 0;

  const scheduleUpdate = () => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      if (!disposed) update();
    });
  };

  update();

  document.addEventListener("scroll", scheduleUpdate, { passive: true, capture: true });
  document.addEventListener("touchmove", scheduleUpdate, { passive: true, capture: true });
  window.addEventListener("scroll", scheduleUpdate, { passive: true, capture: true });
  window.addEventListener("resize", scheduleUpdate, { passive: true });
  window.addEventListener("orientationchange", scheduleUpdate, { passive: true });
  document.documentElement.addEventListener("scroll", scheduleUpdate, {
    passive: true,
    capture: true,
  });
  window.visualViewport?.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.visualViewport?.addEventListener("resize", scheduleUpdate, { passive: true });

  return () => {
    disposed = true;
    cancelAnimationFrame(rafId);
    document.removeEventListener("scroll", scheduleUpdate, true);
    document.removeEventListener("touchmove", scheduleUpdate, true);
    window.removeEventListener("scroll", scheduleUpdate, true);
    window.removeEventListener("resize", scheduleUpdate);
    window.removeEventListener("orientationchange", scheduleUpdate);
    document.documentElement.removeEventListener("scroll", scheduleUpdate, true);
    window.visualViewport?.removeEventListener("scroll", scheduleUpdate);
    window.visualViewport?.removeEventListener("resize", scheduleUpdate);
  };
}

export function initExpertiseMotion(section: HTMLElement) {
  const rules = Array.from(
    section.querySelectorAll<HTMLElement>(".expertise__rule"),
  );

  if (rules.length === 0) {
    return () => {};
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const update = () => {
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    for (const rule of rules) {
      const progress = reducedMotion
        ? 1
        : easeOutCubic(getRevealProgress(rule, viewportHeight));

      rule.style.setProperty("--rule-progress", String(progress));
      rule.classList.toggle("is-revealed", progress >= 1);
    }
  };

  const cleanupScroll = bindScrollMotion(update, reducedMotion);

  return () => {
    cleanupScroll();

    for (const rule of rules) {
      rule.style.removeProperty("--rule-progress");
      rule.classList.remove("is-revealed");
    }
  };
}

function getEducationTimelineProgress(
  languagesSection: HTMLElement,
  educationList: HTMLElement,
  viewportHeight: number,
) {
  const languagesTop = languagesSection.getBoundingClientRect().top;

  if (languagesTop > viewportHeight * 0.98) {
    return 0;
  }

  const listTop = educationList.getBoundingClientRect().top;
  const revealStart = viewportHeight * 0.92;
  const revealEnd = viewportHeight * 0.34;

  return clamp(
    (revealStart - listTop) / Math.max(revealStart - revealEnd, 1),
    0,
    1,
  );
}

function getMarkerProgress(timelineProgress: number, index: number, total: number) {
  if (total <= 1) {
    return timelineProgress;
  }

  const segmentSize = 1 / total;
  const segmentStart = index * segmentSize;

  return clamp((timelineProgress - segmentStart) / segmentSize, 0, 1);
}

export function initEducationMotion(section: HTMLElement) {
  const timelineLine = section.querySelector<HTMLElement>(".education__timeline-line");
  const list = section.querySelector<HTMLElement>(".education__list");
  const languagesSection = document.getElementById("languages");
  const markers = Array.from(
    section.querySelectorAll<HTMLElement>(".education__marker"),
  );

  if (!timelineLine || !list || markers.length === 0) {
    return () => {};
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const update = () => {
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    let progress = 0;

    if (reducedMotion) {
      progress = 1;
    } else if (languagesSection) {
      progress = easeOutCubic(
        getEducationTimelineProgress(languagesSection, list, viewportHeight),
      );
    } else {
      progress = easeOutCubic(getRevealProgress(list, viewportHeight, 0.9, 0.45));
    }

    timelineLine.style.setProperty("--timeline-progress", String(progress));
    timelineLine.classList.toggle("is-revealed", progress >= 1);
    list.style.setProperty("--timeline-progress", String(progress));
    list.classList.toggle("is-revealed", progress >= 1);

    markers.forEach((marker, index) => {
      const markerProgress = reducedMotion
        ? 1
        : easeOutCubic(getMarkerProgress(progress, index, markers.length));

      marker.style.setProperty("--marker-progress", String(markerProgress));
      marker.classList.toggle("is-revealed", markerProgress >= 1);
    });
  };

  const cleanupScroll = bindScrollMotion(update, reducedMotion);

  return () => {
    cleanupScroll();

    timelineLine.style.removeProperty("--timeline-progress");
    timelineLine.classList.remove("is-revealed");
    list.style.removeProperty("--timeline-progress");
    list.classList.remove("is-revealed");

    for (const marker of markers) {
      marker.style.removeProperty("--marker-progress");
      marker.classList.remove("is-revealed");
    }
  };
}

export function initFooterMotion(section: HTMLElement) {
  const frame = section.querySelector<HTMLElement>(".footer__frame");
  const heading = section.querySelector<HTMLElement>(".footer__heading");

  if (!frame) {
    return () => {};
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const trigger = heading ?? section;

  const update = () => {
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const progress = reducedMotion
      ? 1
      : easeOutCubic(getRevealProgress(trigger, viewportHeight, 0.7, 0.3));

    frame.style.setProperty("--frame-progress", String(progress));
    frame.classList.toggle("is-revealed", progress >= 1);
  };

  const cleanupScroll = bindScrollMotion(update, reducedMotion);

  return () => {
    cleanupScroll();
    frame.style.removeProperty("--frame-progress");
    frame.classList.remove("is-revealed");
  };
}

export function initProjectPageMotion(root: HTMLElement) {
  const drawElements = Array.from(
    root.querySelectorAll<HTMLElement>(".project-divider, .project-tags__squiggle"),
  );

  if (drawElements.length === 0) {
    return () => {};
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const update = () => {
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    for (const element of drawElements) {
      const progress = reducedMotion
        ? 1
        : easeOutCubic(getRevealProgress(element, viewportHeight));

      element.style.setProperty("--draw-progress", String(progress));
      element.classList.toggle("is-revealed", progress >= 1);
    }
  };

  const cleanupScroll = bindScrollMotion(update, reducedMotion);

  const observer = new IntersectionObserver(
    () => update(),
    { threshold: [0, 0.25, 0.5, 0.75, 1] },
  );

  for (const element of drawElements) {
    observer.observe(element);
  }

  // Re-measure after route transitions once layout has settled.
  const layoutRafId = requestAnimationFrame(() => {
    requestAnimationFrame(update);
  });

  return () => {
    cancelAnimationFrame(layoutRafId);
    cleanupScroll();
    observer.disconnect();

    for (const element of drawElements) {
      element.style.removeProperty("--draw-progress");
      element.classList.remove("is-revealed");
    }
  };
}
