/** The carousel's active slide lives in a radio group, so the DOM is the source of truth. */
export function getCheckedSlideIndex() {
  const checked = document.querySelector<HTMLInputElement>(
    'input[name="works-slide"]:checked',
  );
  if (!checked) return 0;
  return Number(checked.id.replace("works-slide-", ""));
}

export function subscribeSlideChange(handler: () => void) {
  const radios = document.querySelectorAll<HTMLInputElement>(
    'input[name="works-slide"]',
  );

  for (const radio of radios) {
    radio.addEventListener("change", handler);
  }

  return () => {
    for (const radio of radios) {
      radio.removeEventListener("change", handler);
    }
  };
}
