import type { gsap as GsapCore } from "gsap";
import type DraggablePlugin from "gsap/Draggable";

import { worksSlideCircleColors } from "~/content/site";

type GsapInstance = typeof GsapCore;
type DraggableInstance = typeof DraggablePlugin;

type Rgb = { r: number; g: number; b: number };

const DRAG_COMMIT_PX = 40;
const initializedViewports = new WeakSet<HTMLElement>();

let gsapInstance: GsapInstance | null = null;

function parseHex(hex: string): Rgb {
  const value = hex.replace("#", "");
  const normalized =
    value.length === 3 ? value.split("").map((channel) => channel + channel).join("") : value;

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

function mixColors(from: string, to: string, amount: number) {
  const start = parseHex(from);
  const end = parseHex(to);
  const t = Math.min(1, Math.max(0, amount));
  const mix = (a: number, b: number) => Math.round(a + (b - a) * t);

  return `rgb(${mix(start.r, end.r)} ${mix(start.g, end.g)} ${mix(start.b, end.b)})`;
}

function slideColor(index: number) {
  return worksSlideCircleColors[index] ?? worksSlideCircleColors[0];
}

function createCircleColorController(viewport: HTMLElement) {
  const track = viewport.querySelector<HTMLElement>(".works__visual-track");
  if (!track) {
    return {
      syncToSlide: () => {},
      syncToDrag: () => {},
      dispose: () => {},
    };
  }

  const setColor = (color: string) => {
    track.style.setProperty("--works-circle-color", color);
  };

  const syncToSlide = (index = getCheckedSlideIndex()) => {
    setColor(slideColor(index));
  };

  const syncToDrag = (deltaX: number) => {
    const width = viewport.offsetWidth || 320;
    const progress = Math.min(1, Math.abs(deltaX) / (width * 0.42));

    if (progress < 0.02) {
      syncToSlide();
      return;
    }

    const current = getCheckedSlideIndex();
    const target = deltaX < 0 ? nextIndex(current) : prevIndex(current);
    setColor(mixColors(slideColor(current), slideColor(target), progress));
  };

  const onSlideChange = () => syncToSlide();

  const radios = document.querySelectorAll<HTMLInputElement>('input[name="works-slide"]');
  for (const radio of radios) {
    radio.addEventListener("change", onSlideChange);
  }

  syncToSlide();

  return {
    syncToSlide,
    syncToDrag,
    dispose: () => {
      for (const radio of radios) {
        radio.removeEventListener("change", onSlideChange);
      }
    },
  };
}

function loadGsap() {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (gsapInstance) return Promise.resolve(gsapInstance);

  return import("gsap")
    .then((module) => {
      gsapInstance = module.default;
      return gsapInstance;
    })
    .catch(() => null);
}

function loadDraggable() {
  if (typeof window === "undefined") return Promise.resolve(null);

  return Promise.all([import("gsap"), import("gsap/Draggable")])
    .then(([gsapModule, draggableModule]) => {
      const gsap = gsapModule.default;
      const Draggable = draggableModule.default as DraggableInstance;
      gsap.registerPlugin(Draggable);
      gsapInstance = gsap;
      return { gsap, Draggable };
    })
    .catch(() => null);
}

function getSlideCount() {
  return document.querySelectorAll('input[name="works-slide"]').length || 4;
}

function slideId(index: number) {
  return `works-slide-${index}`;
}

function prevIndex(index: number) {
  const count = getSlideCount();
  return (index - 1 + count) % count;
}

function nextIndex(index: number) {
  const count = getSlideCount();
  return (index + 1) % count;
}

function getCheckedSlideIndex() {
  const checked = document.querySelector<HTMLInputElement>(
    'input[name="works-slide"]:checked',
  );
  if (!checked) return 0;
  return Number(checked.id.replace("works-slide-", ""));
}

function goToSlide(index: number) {
  const radio = document.getElementById(slideId(index)) as HTMLInputElement | null;
  if (!radio || radio.checked) return;
  radio.checked = true;
  radio.dispatchEvent(new Event("change", { bubbles: true }));
}

function setSurfaceOffset(
  surface: HTMLElement,
  deltaX: number,
  circleColor?: { syncToDrag: (deltaX: number) => void },
) {
  surface.style.transform = deltaX ? `translateX(${deltaX}px)` : "";
  surface.style.opacity = deltaX ? String(Math.max(0.55, 1 - Math.abs(deltaX) / 280)) : "";
  circleColor?.syncToDrag(deltaX);
}

function clearSurfaceOffset(
  surface: HTMLElement,
  circleColor?: { syncToSlide: () => void },
) {
  surface.style.transform = "";
  surface.style.opacity = "";
  circleColor?.syncToSlide();
}

function commitFromDelta(deltaX: number) {
  if (Math.abs(deltaX) < DRAG_COMMIT_PX) return;
  const current = getCheckedSlideIndex();
  if (deltaX < 0) goToSlide(nextIndex(current));
  else goToSlide(prevIndex(current));
}

function animateRelease(
  surface: HTMLElement,
  deltaX: number,
  onDone: () => void,
  circleColor?: { syncToSlide: () => void },
) {
  const shouldCommit = Math.abs(deltaX) >= DRAG_COMMIT_PX;
  const gsap = gsapInstance;

  if (!gsap) {
    clearSurfaceOffset(surface, circleColor);
    commitFromDelta(deltaX);
    circleColor?.syncToSlide();
    onDone();
    return;
  }

  const width = surface.parentElement?.offsetWidth || 320;
  const exitX = deltaX < 0 ? -width * 0.18 : width * 0.18;

  if (shouldCommit) {
    gsap.to(surface, {
      x: exitX,
      opacity: 0,
      duration: 0.18,
      ease: "power2.in",
      onComplete: () => {
        commitFromDelta(deltaX);
        gsap.set(surface, { clearProps: "transform,opacity" });
        clearSurfaceOffset(surface, circleColor);
        circleColor?.syncToSlide();
        onDone();
      },
    });
    return;
  }

  gsap.to(surface, {
    x: 0,
    opacity: 1,
    duration: 0.28,
    ease: "power2.out",
    onComplete: () => {
      gsap.set(surface, { clearProps: "transform,opacity" });
      clearSurfaceOffset(surface, circleColor);
      onDone();
    },
  });
}

function attachNativeSwipe(
  viewport: HTMLElement,
  surface: HTMLElement,
  circleColor: ReturnType<typeof createCircleColorController>,
) {
  let startX = 0;
  let startY = 0;
  let tracking = false;
  let locked: "x" | "y" | null = null;
  let lastX = 0;
  let pointerId: number | null = null;

  const begin = (x: number, y: number) => {
    startX = x;
    startY = y;
    lastX = x;
    tracking = true;
    locked = null;
    viewport.classList.add("works__card-viewport--dragging");
  };

  const move = (x: number, y: number) => {
    if (!tracking) return false;

    const deltaX = x - startX;
    const deltaY = y - startY;

    if (!locked) {
      if (Math.abs(deltaX) < 8 && Math.abs(deltaY) < 8) return false;
      locked = Math.abs(deltaX) > Math.abs(deltaY) ? "x" : "y";
      if (locked === "y") {
        tracking = false;
        viewport.classList.remove("works__card-viewport--dragging");
        clearSurfaceOffset(surface, circleColor);
        return false;
      }
    }

    if (locked !== "x") return false;

    lastX = x;
    setSurfaceOffset(surface, deltaX, circleColor);
    return true;
  };

  const end = () => {
    if (!tracking) return;
    const deltaX = lastX - startX;
    tracking = false;
    locked = null;
    viewport.classList.remove("works__card-viewport--dragging");
    animateRelease(surface, deltaX, () => {}, circleColor);
  };

  const onTouchStart = (event: TouchEvent) => {
    if (event.touches.length !== 1) return;
    begin(event.touches[0].clientX, event.touches[0].clientY);
  };

  const onTouchMove = (event: TouchEvent) => {
    if (event.touches.length !== 1) return;
    const touch = event.touches[0];
    const consumed = move(touch.clientX, touch.clientY);
    if (consumed) event.preventDefault();
  };

  const onTouchEnd = (event: TouchEvent) => {
    const touch = event.changedTouches[0];
    if (touch) lastX = touch.clientX;
    if (locked === "x") event.preventDefault();
    end();
  };

  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    pointerId = event.pointerId;
    begin(event.clientX, event.clientY);
    viewport.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent) => {
    if (pointerId !== event.pointerId) return;
    const consumed = move(event.clientX, event.clientY);
    if (consumed) event.preventDefault();
  };

  const onPointerUp = (event: PointerEvent) => {
    if (pointerId !== event.pointerId) return;
    lastX = event.clientX;
    if (viewport.hasPointerCapture(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId);
    }
    pointerId = null;
    end();
  };

  viewport.addEventListener("touchstart", onTouchStart, { passive: true, capture: true });
  viewport.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
  viewport.addEventListener("touchend", onTouchEnd, { passive: false, capture: true });
  viewport.addEventListener("touchcancel", onTouchEnd, { passive: true, capture: true });
  viewport.addEventListener("pointerdown", onPointerDown);
  viewport.addEventListener("pointermove", onPointerMove);
  viewport.addEventListener("pointerup", onPointerUp);
  viewport.addEventListener("pointercancel", onPointerUp);

  loadGsap();

  return () => {
    viewport.removeEventListener("touchstart", onTouchStart, true);
    viewport.removeEventListener("touchmove", onTouchMove, true);
    viewport.removeEventListener("touchend", onTouchEnd, true);
    viewport.removeEventListener("touchcancel", onTouchEnd, true);
    viewport.removeEventListener("pointerdown", onPointerDown);
    viewport.removeEventListener("pointermove", onPointerMove);
    viewport.removeEventListener("pointerup", onPointerUp);
    viewport.removeEventListener("pointercancel", onPointerUp);
    clearSurfaceOffset(surface, circleColor);
  };
}

function attachDesktopDraggable(
  viewport: HTMLElement,
  surface: HTMLElement,
  gsap: GsapInstance,
  Draggable: DraggableInstance,
  circleColor: ReturnType<typeof createCircleColorController>,
) {
  const instances = Draggable.create(surface, {
    type: "x",
    zIndexBoost: false,
    allowContextMenu: true,
    dragClickables: true,
    minimumMovement: 3,
    onPress() {
      viewport.classList.add("works__card-viewport--dragging");
    },
    onDrag() {
      gsap.set(surface, {
        opacity: Math.max(0.55, 1 - Math.abs(this.x) / 280),
      });
      circleColor.syncToDrag(this.x);
    },
    onRelease() {
      viewport.classList.remove("works__card-viewport--dragging");
      animateRelease(surface, this.x, () => {}, circleColor);
    },
  });

  return () => {
    instances[0]?.kill();
    gsap.set(surface, { clearProps: "transform,opacity" });
    clearSurfaceOffset(surface, circleColor);
  };
}

export function initWorksCarouselDrag(viewport: HTMLElement) {
  if (initializedViewports.has(viewport)) {
    return () => {};
  }

  const surface = viewport.querySelector<HTMLElement>(".works__drag-surface");
  if (!surface) return () => {};

  initializedViewports.add(viewport);

  const circleColor = createCircleColorController(viewport);
  const isCoarse = window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
  let detach = attachNativeSwipe(viewport, surface, circleColor);

  if (!isCoarse) {
    loadDraggable().then((bundle) => {
      if (!bundle || !initializedViewports.has(viewport)) return;
      detach();
      detach = attachDesktopDraggable(
        viewport,
        surface,
        bundle.gsap,
        bundle.Draggable,
        circleColor,
      );
    });
  }

  return () => {
    detach();
    circleColor.dispose();
    initializedViewports.delete(viewport);
  };
}
