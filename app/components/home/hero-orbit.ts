export const ORBIT_SLOTS = [
  "nine",
  "ten",
  "twelve",
  "one",
  "three",
  "wrench",
  "four",
  "six",
  "seven",
] as const;

export type OrbitSlot = (typeof ORBIT_SLOTS)[number];

export type OrbitItemType =
  | "laptop"
  | "coffee"
  | "sketchbook"
  | "scrunchie"
  | "wrench";

export const ORBIT_NOTE_BY_TYPE: Record<OrbitItemType, string> = {
  laptop: "laptop",
  coffee: "iced coffee",
  sketchbook: "sketchbook",
  wrench: "wrench",
  scrunchie: "accessories",
};

export const FEATURED_ORBIT_SLOT: OrbitSlot = "nine";

export const ORBIT_TRANSITION_MS = 2000;
export const ORBIT_PAUSE_MS = 1800;

export type OrbitItem = {
  id: string;
  type: OrbitItemType;
  initialSlot: OrbitSlot;
  src: string;
  width: number;
  height: number;
};

export function getOrbitSlot(initialSlot: OrbitSlot, step: number): OrbitSlot {
  const index = ORBIT_SLOTS.indexOf(initialSlot);
  const slotCount = ORBIT_SLOTS.length;
  return ORBIT_SLOTS[((index - step) % slotCount + slotCount) % slotCount];
}

export function getFeaturedOrbitItem(items: OrbitItem[], step: number) {
  return items.find(
    (item) => getOrbitSlot(item.initialSlot, step) === FEATURED_ORBIT_SLOT,
  );
}

type Point = { x: number; y: number };

export const FEATURED_SCALE = 1.3;

const SKETCHBOOK_ROTATE = "30deg";

function isSketchbookElement(element: HTMLElement) {
  return element.classList.contains("hero__item--sketchbook");
}

function pinSketchbookRotation(element: HTMLElement) {
  if (isSketchbookElement(element)) {
    element.style.rotate = SKETCHBOOK_ROTATE;
  }
}

function pinSketchbookBaseScale(
  element: HTMLElement,
  scaleState: OrbitScaleState | null | undefined,
) {
  if (!isSketchbookElement(element)) {
    return;
  }

  if (scaleState?.fromFeatured || scaleState?.toFeatured) {
    return;
  }

  element.style.scale = "-1 1";
}

function clearSketchbookRotation(element: HTMLElement) {
  if (isSketchbookElement(element)) {
    element.style.rotate = "";
  }
}

function clearSketchbookInlineStyles(
  element: HTMLElement,
  scaleState: OrbitScaleState | null | undefined,
) {
  clearSketchbookRotation(element);

  if (
    isSketchbookElement(element) &&
    !(scaleState?.fromFeatured || scaleState?.toFeatured)
  ) {
    element.style.scale = "";
  }
}

export type OrbitScaleState = {
  fromFeatured: boolean;
  toFeatured: boolean;
  flipX: boolean;
};

function getCenter(element: HTMLElement): Point {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

function easeInOutSine(t: number) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

function getFeaturedScaleMultiplier(
  progress: number,
  fromFeatured: boolean,
  toFeatured: boolean,
) {
  const eased = easeInOutSine(progress);

  if (toFeatured) {
    return 1 + (FEATURED_SCALE - 1) * eased;
  }

  if (fromFeatured) {
    return FEATURED_SCALE - (FEATURED_SCALE - 1) * eased;
  }

  return 1;
}

function applyFeaturedScale(
  element: HTMLElement,
  progress: number,
  scaleState: OrbitScaleState,
) {
  if (!scaleState.fromFeatured && !scaleState.toFeatured) {
    return;
  }

  const scale = getFeaturedScaleMultiplier(
    progress,
    scaleState.fromFeatured,
    scaleState.toFeatured,
  );

  element.style.scale = scaleState.flipX ? `${-scale} ${scale}` : `${scale}`;
}

function applyOrbitTransform(
  element: HTMLElement,
  start: Point,
  end: Point,
  progress: number,
) {
  const eased = easeInOutSine(progress);
  const x = start.x + (end.x - start.x) * eased;
  const y = start.y + (end.y - start.y) * eased;

  element.style.translate = `${x - end.x}px ${y - end.y}px`;
}

export function captureOrbitCenters(
  itemIds: string[],
  getItemElement: (id: string) => HTMLElement | null,
) {
  const centers = new Map<string, Point>();

  for (const id of itemIds) {
    const element = getItemElement(id);
    if (element) {
      centers.set(id, getCenter(element));
    }
  }

  return centers;
}

export function animateOrbitFromCenters({
  starts,
  itemIds,
  getItemElement,
  getScaleState,
  durationMs,
  onComplete,
}: {
  starts: Map<string, Point>;
  itemIds: string[];
  getItemElement: (id: string) => HTMLElement | null;
  getScaleState: (id: string) => OrbitScaleState | null;
  durationMs: number;
  onComplete?: () => void;
}) {
  const animations = itemIds.flatMap((id) => {
    const startCenter = starts.get(id);
    const element = getItemElement(id);

    if (!startCenter || !element) {
      return [];
    }

    const endCenter = getCenter(element);
    const scaleState = getScaleState(id);

    return [{ element, start: startCenter, end: endCenter, scaleState }];
  });

  if (animations.length === 0) {
    onComplete?.();
    return () => {};
  }

  for (const { element, scaleState } of animations) {
    element.style.transition = "none";
    const isSketchbook = isSketchbookElement(element);
    const usesFeaturedScale =
      scaleState?.fromFeatured || scaleState?.toFeatured;
    element.style.willChange = [
      "translate",
      usesFeaturedScale ? "scale" : "",
      isSketchbook ? "rotate" : "",
    ]
      .filter(Boolean)
      .join(", ");

    if (isSketchbook) {
      pinSketchbookRotation(element);
      pinSketchbookBaseScale(element, scaleState);
    }
  }

  for (const animation of animations) {
    applyOrbitTransform(animation.element, animation.start, animation.end, 0);

    if (animation.scaleState?.fromFeatured || animation.scaleState?.toFeatured) {
      applyFeaturedScale(animation.element, 0, animation.scaleState);
    }

    pinSketchbookRotation(animation.element);
    pinSketchbookBaseScale(animation.element, animation.scaleState);
  }

  let frameId = 0;
  const startTime = performance.now();

  const tick = (now: number) => {
    const progress = Math.min((now - startTime) / durationMs, 1);

    for (const { element, start, end, scaleState } of animations) {
      applyOrbitTransform(element, start, end, progress);

      if (scaleState?.fromFeatured || scaleState?.toFeatured) {
        applyFeaturedScale(element, progress, scaleState);
      }

      pinSketchbookRotation(element);
      pinSketchbookBaseScale(element, scaleState);
    }

    if (progress < 1) {
      frameId = requestAnimationFrame(tick);
      return;
    }

    for (const { element } of animations) {
      element.style.translate = "";
      element.style.willChange = "";
    }

    onComplete?.();

    for (const { element, scaleState } of animations) {
      if (scaleState?.fromFeatured || scaleState?.toFeatured) {
        element.style.scale = "";
      }

      clearSketchbookInlineStyles(element, scaleState);
    }
  };

  frameId = requestAnimationFrame(tick);

  return () => cancelAnimationFrame(frameId);
}
