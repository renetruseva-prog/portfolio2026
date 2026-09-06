const DESKTOP_LAYOUT = "(min-width: 64rem)";
const TABLET_FLOW_LAYOUT = "(min-width: 48rem) and (max-width: 63.99rem)";

function restoreQuoteText(quoteText: HTMLElement) {
  if (quoteText.dataset.originalHtml) {
    quoteText.innerHTML = quoteText.dataset.originalHtml;
  }

  delete quoteText.dataset.linesWrapped;
}

function shouldSkipLineBreak(unit: HTMLElement) {
  if (
    unit.classList.contains("about__quote-break--mobile") &&
    window.matchMedia(DESKTOP_LAYOUT).matches
  ) {
    return true;
  }

  if (
    unit.classList.contains("about__quote-break--desktop") &&
    !window.matchMedia(DESKTOP_LAYOUT).matches
  ) {
    return true;
  }

  return false;
}

function isForcedLineBreak(unit: HTMLElement) {
  if (!unit.classList.contains("about__quote-break")) {
    return false;
  }

  return !shouldSkipLineBreak(unit);
}

const ATOMIC_QUOTE_UNITS = new Set([
  "about__quote-like-mobile",
  "about__quote-like-desktop",
  "about__quote-tail",
]);

function isDesktopLayout() {
  return window.matchMedia(DESKTOP_LAYOUT).matches;
}

function shouldSkipQuoteUnit(node: HTMLElement) {
  if (node.classList.contains("about__quote-like-mobile") && isDesktopLayout()) {
    return true;
  }

  if (node.classList.contains("about__quote-like-desktop") && !isDesktopLayout()) {
    return true;
  }

  return false;
}

function appendQuoteUnits(node: Node, units: HTMLElement[]) {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent ?? "";
    const segments = text.split("\n");

    segments.forEach((segment, index) => {
      if (index > 0) {
        const lineBreak = document.createElement("span");
        lineBreak.className = "about__quote-break";
        lineBreak.setAttribute("aria-hidden", "true");
        units.push(lineBreak);
      }

      appendTextUnits(segment, units);
    });
    return;
  }

  if (!(node instanceof HTMLElement)) {
    return;
  }

  if (shouldSkipQuoteUnit(node)) {
    return;
  }

  if (node.classList.contains("about__quote-phrase")) {
    for (const child of Array.from(node.childNodes)) {
      appendQuoteUnits(child, units);
    }
    return;
  }

  if ([...node.classList].some((className) => ATOMIC_QUOTE_UNITS.has(className))) {
    const unit = node.cloneNode(true) as HTMLElement;
    unit.classList.add("about__quote-unit");
    units.push(unit);
    return;
  }

  const unit = node.cloneNode(true) as HTMLElement;
  unit.classList.add("about__quote-unit");
  units.push(unit);
}

function groupUnitsIntoLines(units: HTMLElement[]) {
  const lines: HTMLElement[][] = [];
  let currentTop: number | null = null;
  let currentLine: HTMLElement[] = [];

  for (const unit of units) {
    if (shouldSkipLineBreak(unit)) {
      continue;
    }

    if (isForcedLineBreak(unit)) {
      if (currentLine.length) {
        lines.push(currentLine);
        currentLine = [];
        currentTop = null;
      }
      continue;
    }

    const top = Math.round(unit.getBoundingClientRect().top);

    if (currentTop === null || Math.abs(top - currentTop) <= 2) {
      if (currentTop === null) currentTop = top;
      currentLine.push(unit);
      continue;
    }

    lines.push(currentLine);
    currentLine = [unit];
    currentTop = top;
  }

  if (currentLine.length) {
    lines.push(currentLine);
  }

  return lines;
}

function appendTextUnits(text: string, units: HTMLElement[]) {
  for (const part of text.split(/(\s+)/).filter((segment) => segment.length > 0)) {
    const span = document.createElement("span");
    span.className = "about__quote-unit";
    span.textContent = part;
    units.push(span);
  }
}

function buildUnits(quoteText: HTMLElement) {
  const units: HTMLElement[] = [];

  for (const child of Array.from(quoteText.childNodes)) {
    appendQuoteUnits(child, units);
  }

  return units;
}

function mountLines(quoteText: HTMLElement, lines: HTMLElement[][]) {
  quoteText.replaceChildren();

  for (const lineUnits of lines) {
    const line = document.createElement("span");
    line.className = "about__quote-line";

    for (const unit of lineUnits) {
      if (
        unit.classList.contains("about__quote-phrase") ||
        unit.classList.contains("about__quote-like-mobile") ||
        unit.classList.contains("about__quote-like-desktop") ||
        unit.classList.contains("about__quote-tail") ||
        unit.classList.contains("about__highlight")
      ) {
        line.appendChild(unit);
        continue;
      }

      line.appendChild(document.createTextNode(unit.textContent ?? ""));
    }

    quoteText.appendChild(line);
  }
}

export function wrapQuoteVisualLines(quoteText: HTMLElement) {
  if (!quoteText.dataset.originalHtml) {
    quoteText.dataset.originalHtml = quoteText.innerHTML;
  } else {
    quoteText.innerHTML = quoteText.dataset.originalHtml;
  }

  const units = buildUnits(quoteText);
  quoteText.replaceChildren(...units);

  const lines = groupUnitsIntoLines(units);
  mountLines(quoteText, lines);

  quoteText.dataset.linesWrapped = "true";
}

export function initAboutQuoteLines(section: HTMLElement) {
  const quoteTexts = Array.from(
    section.querySelectorAll<HTMLElement>(".about__quote-text"),
  );

  if (quoteTexts.length === 0) {
    return () => {};
  }

  const wrapAll = () => {
    const useFlowLayout = window.matchMedia(TABLET_FLOW_LAYOUT).matches;

    for (const quoteText of quoteTexts) {
      if (!quoteText.dataset.originalHtml) {
        quoteText.dataset.originalHtml = quoteText.innerHTML;
      }

      if (useFlowLayout) {
        restoreQuoteText(quoteText);
      } else {
        wrapQuoteVisualLines(quoteText);
      }
    }
  };

  wrapAll();

  let resizeRaf = 0;
  const onResize = () => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(wrapAll);
  };

  window.addEventListener("resize", onResize, { passive: true });
  window.visualViewport?.addEventListener("resize", onResize, { passive: true });

  return () => {
    cancelAnimationFrame(resizeRaf);
    window.removeEventListener("resize", onResize);
    window.visualViewport?.removeEventListener("resize", onResize);

    for (const quoteText of quoteTexts) {
      if (quoteText.dataset.originalHtml) {
        quoteText.innerHTML = quoteText.dataset.originalHtml;
      }
      delete quoteText.dataset.linesWrapped;
      delete quoteText.dataset.originalHtml;
    }
  };
}
