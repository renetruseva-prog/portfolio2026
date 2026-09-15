import assert from "node:assert/strict";
import test from "node:test";

import {
  getDecorativeLineRevealProgressFromY,
  getMarkerProgress,
  getRevealProgress,
  getWorksHeadlineParallaxY,
} from "./section-scroll-motion.client.ts";

const VIEWPORT = 1000;

/** Stands in for an element; only the top edge is read. */
function atTop(top: number) {
  return { getBoundingClientRect: () => ({ top }) };
}

test("reveal progress runs 0 -> 1 across the reveal band and clamps outside it", () => {
  // Defaults: starts at 0.88 of the viewport, completes at 0.62.
  assert.equal(getRevealProgress(atTop(VIEWPORT), VIEWPORT), 0, "below the band");
  assert.equal(getRevealProgress(atTop(880), VIEWPORT), 0, "at the start edge");
  assert.equal(getRevealProgress(atTop(620), VIEWPORT), 1, "at the end edge");
  assert.equal(getRevealProgress(atTop(-500), VIEWPORT), 1, "scrolled past");

  const mid = getRevealProgress(atTop(750), VIEWPORT);
  assert.ok(mid > 0 && mid < 1, `midpoint should be partial, got ${mid}`);
  assert.ok(
    getRevealProgress(atTop(700), VIEWPORT) > mid,
    "progress must increase as the element rises",
  );
});

test("decorative line progress honours custom start/end ratios", () => {
  const progress = (top: number) =>
    getDecorativeLineRevealProgressFromY(top, VIEWPORT, 0.9, 0.15);

  assert.equal(progress(950), 0, "below the start ratio");
  assert.equal(progress(150), 1, "at the end ratio");
  assert.ok(progress(500) > 0 && progress(500) < 1, "partial inside the band");
});

test("markers partition the timeline into equal segments", () => {
  // Four markers: each owns a quarter of the timeline, in order.
  assert.equal(getMarkerProgress(0.25, 0, 4), 1, "first marker done at 25%");
  assert.equal(getMarkerProgress(0.25, 1, 4), 0, "second marker not started");
  assert.equal(getMarkerProgress(0.5, 1, 4), 1, "second marker done at 50%");
  assert.equal(getMarkerProgress(1, 3, 4), 1, "last marker done at 100%");

  // A lone marker has no segment to offset into.
  assert.equal(getMarkerProgress(0.42, 0, 1), 0.42);
});

test("headline parallax settles to zero once revealed", () => {
  assert.equal(getWorksHeadlineParallaxY(VIEWPORT, 1), 0);
  assert.ok(
    getWorksHeadlineParallaxY(VIEWPORT, 0) > getWorksHeadlineParallaxY(VIEWPORT, 0.5),
    "offset shrinks as reveal grows",
  );
});
