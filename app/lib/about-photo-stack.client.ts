function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function revealAll(photos: HTMLElement[]) {
  for (const photo of photos) {
    photo.style.opacity = "1";
    photo.style.transform = "translate3d(0, 0, 0) scale(1)";
  }
}

function getStickyTop(pin: HTMLElement) {
  const top = getComputedStyle(pin).top;
  const value = parseFloat(top);
  return Number.isFinite(value) ? value : 0;
}

const TRANSITION_PORTION = 0.16;
const SCROLL_SPEED = 1.5625;

type PhotoStackState = {
  activeIndex: number;
  incomingT: number;
};

type ScrollZone = {
  title: HTMLElement;
  stack: HTMLElement;
  pin: HTMLElement;
};

function getScrollPhotoState(
  { title, stack, pin }: ScrollZone,
  photoCount: number,
  scrollY: number,
): PhotoStackState {
  const stickyTop = getStickyTop(pin);
  const zoneStart = title.offsetTop - stickyTop;
  const zoneEnd = stack.offsetTop + stack.offsetHeight - stickyTop;
  const zoneHeight = Math.max(zoneEnd - zoneStart, 1);

  if (scrollY <= zoneStart) {
    return { activeIndex: 0, incomingT: 1 };
  }

  const progress = clamp(((scrollY - zoneStart) / zoneHeight) * SCROLL_SPEED, 0, 1);
  const scaled = progress * photoCount;
  const activeIndex = Math.min(Math.floor(scaled), photoCount - 1);
  const segmentT = scaled - activeIndex;

  let incomingT = 1;
  if (activeIndex > 0 && segmentT < TRANSITION_PORTION) {
    incomingT = segmentT / TRANSITION_PORTION;
  }

  return { activeIndex, incomingT };
}

function applyPhotoStack(photos: HTMLElement[], activeIndex: number, incomingT: number) {
  for (const [index, photo] of photos.entries()) {
    if (index < activeIndex) {
      photo.style.opacity = "1";
      photo.style.transform = "translate3d(0, 0, 0) scale(1)";
      continue;
    }

    if (index === activeIndex) {
      const t = index === 0 ? 1 : incomingT;
      photo.style.opacity = String(t);
      photo.style.transform = `translate3d(0, ${(1 - t) * 1.75}rem, 0) scale(${0.96 + t * 0.04})`;
      continue;
    }

    photo.style.opacity = "0";
    photo.style.transform = "translate3d(0, 1.75rem, 0) scale(0.96)";
  }
}

function triggerBackdropSwitch(backdrop: HTMLElement) {
  backdrop.classList.remove("is-switching");
  void backdrop.offsetWidth;
  backdrop.classList.add("is-switching");
}

export function initAboutPhotoStack(section: HTMLElement) {
  const title = section.querySelector<HTMLElement>(".about__title");
  const stack = section.querySelector<HTMLElement>(".about__stack");
  const pin = section.querySelector<HTMLElement>(".about__stack-pin");
  const backdrop = section.querySelector<HTMLElement>(".about__stack-backdrop");
  const photos = Array.from(section.querySelectorAll<HTMLElement>(".about__photo"));
  const photoCount = photos.length;

  if (!title || !stack || !pin || !backdrop || photoCount === 0) {
    return () => {};
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealAll(photos);
    return () => {};
  }

  const scrollZone: ScrollZone = { title, stack, pin };

  let disposed = false;
  let rafId = 0;
  let tapIndex: number | null = null;
  let lastActiveIndex = -1;

  const onBackdropAnimationEnd = () => {
    backdrop.classList.remove("is-switching");
  };

  backdrop.addEventListener("animationend", onBackdropAnimationEnd);

  const update = () => {
    if (disposed) return;

    const scrollState = getScrollPhotoState(scrollZone, photoCount, window.scrollY);
    const activeIndex = tapIndex ?? scrollState.activeIndex;
    const incomingT = tapIndex === null ? scrollState.incomingT : 1;

    if (activeIndex !== lastActiveIndex) {
      if (lastActiveIndex !== -1) {
        triggerBackdropSwitch(backdrop);
      }
      lastActiveIndex = activeIndex;
    }

    applyPhotoStack(photos, activeIndex, incomingT);
  };

  const scheduleUpdate = () => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(update);
  };

  const advancePhoto = () => {
    const current =
      tapIndex ?? getScrollPhotoState(scrollZone, photoCount, window.scrollY).activeIndex;
    tapIndex = (current + 1) % photoCount;
    update();
  };

  const onScroll = () => {
    if (tapIndex !== null) {
      const { activeIndex } = getScrollPhotoState(scrollZone, photoCount, window.scrollY);
      if (activeIndex !== tapIndex) {
        tapIndex = null;
      }
    }

    scheduleUpdate();
  };

  const onPinClick = () => {
    advancePhoto();
  };

  const onPinKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      advancePhoto();
    }
  };

  update();

  pin.addEventListener("click", onPinClick);
  pin.addEventListener("keydown", onPinKeyDown);
  window.addEventListener("scroll", onScroll, { passive: true, capture: true });
  window.addEventListener("resize", scheduleUpdate, { passive: true });
  window.visualViewport?.addEventListener("scroll", onScroll, { passive: true });
  window.visualViewport?.addEventListener("resize", scheduleUpdate, { passive: true });

  return () => {
    disposed = true;
    cancelAnimationFrame(rafId);
    backdrop.removeEventListener("animationend", onBackdropAnimationEnd);
    backdrop.classList.remove("is-switching");
    pin.removeEventListener("click", onPinClick);
    pin.removeEventListener("keydown", onPinKeyDown);
    window.removeEventListener("scroll", onScroll, true);
    window.removeEventListener("resize", scheduleUpdate);
    window.visualViewport?.removeEventListener("scroll", onScroll);
    window.visualViewport?.removeEventListener("resize", scheduleUpdate);

    for (const photo of photos) {
      photo.style.removeProperty("opacity");
      photo.style.removeProperty("transform");
    }
  };
}
