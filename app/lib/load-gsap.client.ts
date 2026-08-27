import type { gsap as GsapCore } from "gsap";

type GsapInstance = typeof GsapCore;

let gsapInstance: GsapInstance | null = null;
let gsapPromise: Promise<GsapInstance | null> | null = null;

export function loadGsap() {
  if (typeof window === "undefined") {
    return Promise.resolve(null);
  }

  if (gsapInstance) {
    return Promise.resolve(gsapInstance);
  }

  gsapPromise ??= import("gsap").then((module) => {
    gsapInstance = module.default;
    return gsapInstance;
  });

  return gsapPromise;
}

export function getGsap() {
  return gsapInstance;
}
