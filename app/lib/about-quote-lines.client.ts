function groupUnitsIntoLines(units: HTMLElement[]) {
  const lines: HTMLElement[][] = [];
  let currentTop: number | null = null;
  let currentLine: HTMLElement[] = [];

  for (const unit of units) {
    if (unit.classList.contains("about__quote-break")) {
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
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent ?? "";
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
      continue;
    }

    if (child instanceof HTMLElement) {
      const unit = child.cloneNode(true) as HTMLElement;
      unit.classList.add("about__quote-unit");
      units.push(unit);
    }
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
    for (const quoteText of quoteTexts) {
      wrapQuoteVisualLines(quoteText);
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
