import { bindScrollMotion } from "~/lib/section-scroll-motion.client";

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
const TABLET_LAYOUT = "(min-width: 48rem)";

type PhotoStackState = {
  activeIndex: number;
  incomingT: number;
};

type ScrollZone = {
  section: HTMLElement;
  titleWrap: HTMLElement;
  stack: HTMLElement;
  pin: HTMLElement;
};

function pageY(el: HTMLElement) {
  return el.getBoundingClientRect().top + window.scrollY;
}

function getZoneStart(titleWrap: HTMLElement, pin: HTMLElement) {
  const stickyTop = getStickyTop(pin);

  if (!window.matchMedia(TABLET_LAYOUT).matches) {
    return titleWrap.offsetTop - stickyTop;
  }

  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  return pageY(titleWrap) - viewportHeight * 0.3;
}

function getZoneEnd({ section, stack, pin }: ScrollZone) {
  const stickyTop = getStickyTop(pin);

  if (!window.matchMedia(TABLET_LAYOUT).matches) {
    return stack.offsetTop + stack.offsetHeight - stickyTop;
  }

  return pageY(section) + section.offsetHeight - stickyTop;
}

function getScrollPhotoState(
  scrollZone: ScrollZone,
  photoCount: number,
  scrollY: number,
): PhotoStackState {
  const zoneStart = getZoneStart(scrollZone.titleWrap, scrollZone.pin);
  const zoneEnd = getZoneEnd(scrollZone);
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
  const titleWrap = section.querySelector<HTMLElement>(".about__title-wrap");
  const stack = section.querySelector<HTMLElement>(".about__stack");
  const pin = section.querySelector<HTMLElement>(".about__stack-pin");
  const backdrop = section.querySelector<HTMLElement>(".about__stack-backdrop");
  const photos = Array.from(section.querySelectorAll<HTMLElement>(".about__photo"));
  const photoCount = photos.length;

  if (!titleWrap || !stack || !pin || !backdrop || photoCount === 0) {
    return () => {};
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealAll(photos);
    return () => {};
  }

  const scrollZone: ScrollZone = { section, titleWrap, stack, pin };
  const reducedMotion = false;

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
    rafId = requestAnimationFrame(() => {
      if (tapIndex !== null) {
        const { activeIndex } = getScrollPhotoState(scrollZone, photoCount, window.scrollY);
        if (activeIndex !== tapIndex) {
          tapIndex = null;
        }
      }

      update();
    });
  };

  const advancePhoto = () => {
    const current =
      tapIndex ?? getScrollPhotoState(scrollZone, photoCount, window.scrollY).activeIndex;
    tapIndex = (current + 1) % photoCount;
    update();
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
  const cleanupScroll = bindScrollMotion(scheduleUpdate, reducedMotion);
  const observer = new ResizeObserver(scheduleUpdate);
  observer.observe(section);

  return () => {
    disposed = true;
    cancelAnimationFrame(rafId);
    cleanupScroll();
    observer.disconnect();
    backdrop.removeEventListener("animationend", onBackdropAnimationEnd);
    backdrop.classList.remove("is-switching");
    pin.removeEventListener("click", onPinClick);
    pin.removeEventListener("keydown", onPinKeyDown);

    for (const photo of photos) {
      photo.style.removeProperty("opacity");
      photo.style.removeProperty("transform");
    }
  };
}
