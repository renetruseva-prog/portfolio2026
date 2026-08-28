function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getLineRevealProgress(line: HTMLElement, viewportHeight: number) {
  const rect = line.getBoundingClientRect();
  const revealStart = viewportHeight * 0.9;
  const revealEnd = viewportHeight * 0.58;

  return clamp((revealStart - rect.top) / Math.max(revealStart - revealEnd, 1), 0, 1);
}

// Pen-like draw speed: slow start, steady middle, soft finish
function easeDraw(t: number) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;

  const x1 = 0.45;
  const y1 = 0.05;
  const x2 = 0.2;
  const y2 = 1;

  const sampleX = (u: number) =>
    3 * (1 - u) * (1 - u) * u * x1 + 3 * (1 - u) * u * u * x2 + u * u * u;
  const sampleY = (u: number) =>
    3 * (1 - u) * (1 - u) * u * y1 + 3 * (1 - u) * u * u * y2 + u * u * u;
  const sampleDX = (u: number) =>
    3 * (1 - u) * (1 - u) * x1 + 6 * (1 - u) * u * (x2 - x1) + 3 * u * u * (1 - x2);

  let u = t;
  for (let i = 0; i < 6; i++) {
    const dx = sampleDX(u);
    if (Math.abs(dx) < 1e-6) break;
    u -= (sampleX(u) - t) / dx;
    u = clamp(u, 0, 1);
  }

  return sampleY(u);
}

function getHighlightDraw(lineProgress: number) {
  if (lineProgress < 0.72) {
    return 0;
  }

  const raw = clamp((lineProgress - 0.72) / 0.32, 0, 1);
  return easeDraw(raw);
}

export function initAboutTextAccent(section: HTMLElement) {
  const accents = Array.from(section.querySelectorAll<HTMLElement>(".about__accent"));

  if (accents.length === 0 && !section.querySelector(".about__quote-text")) {
    return () => {};
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    for (const accent of accents) {
      accent.style.setProperty("--accent-progress", "1");
      accent.classList.add("is-revealed");
    }
    for (const line of section.querySelectorAll<HTMLElement>(".about__quote-line")) {
      line.style.setProperty("--line-progress", "1");
      line.classList.add("is-revealed");
      const highlight = line.querySelector<HTMLElement>(".about__highlight");
      if (highlight) {
        highlight.style.setProperty("--highlight-draw", "1");
        highlight.classList.add("is-revealed");
      }
    }
    return () => {};
  }

  let disposed = false;
  let rafId = 0;

  const update = () => {
    if (disposed) return;

    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const accentRevealStart = viewportHeight * 0.82;
    const accentRevealEnd = viewportHeight * 0.48;

    for (const accent of accents) {
      const rect = accent.getBoundingClientRect();
      const progress = clamp(
        (accentRevealStart - rect.top) / (accentRevealStart - accentRevealEnd),
        0,
        1,
      );

      accent.style.setProperty("--accent-progress", String(progress));

      if (progress >= 1) {
        accent.classList.add("is-revealed");
      } else {
        accent.classList.remove("is-revealed");
      }
    }

    for (const line of section.querySelectorAll<HTMLElement>(".about__quote-line")) {
      const progress = getLineRevealProgress(line, viewportHeight);

      line.style.setProperty("--line-progress", String(progress));

      if (progress >= 1) {
        line.classList.add("is-revealed");
      } else {
        line.classList.remove("is-revealed");
      }

      const highlight = line.querySelector<HTMLElement>(".about__highlight");
      if (!highlight) continue;

      const draw = getHighlightDraw(progress);
      highlight.style.setProperty("--highlight-draw", String(draw));

      if (draw >= 1) {
        highlight.classList.add("is-revealed");
      } else {
        highlight.classList.remove("is-revealed");
      }
    }
  };

  const scheduleUpdate = () => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(update);
  };

  update();

  window.addEventListener("scroll", scheduleUpdate, { passive: true, capture: true });
  window.addEventListener("resize", scheduleUpdate, { passive: true });
  window.visualViewport?.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.visualViewport?.addEventListener("resize", scheduleUpdate, { passive: true });

  return () => {
    disposed = true;
    cancelAnimationFrame(rafId);
    window.removeEventListener("scroll", scheduleUpdate, true);
    window.removeEventListener("resize", scheduleUpdate);
    window.visualViewport?.removeEventListener("scroll", scheduleUpdate);
    window.visualViewport?.removeEventListener("resize", scheduleUpdate);

    for (const accent of accents) {
      accent.style.removeProperty("--accent-progress");
      accent.classList.remove("is-revealed");
    }

    for (const line of section.querySelectorAll<HTMLElement>(".about__quote-line")) {
      line.style.removeProperty("--line-progress");
      line.classList.remove("is-revealed");

      const highlight = line.querySelector<HTMLElement>(".about__highlight");
      if (!highlight) continue;

      highlight.style.removeProperty("--highlight-draw");
      highlight.classList.remove("is-revealed");
    }
  };
}
