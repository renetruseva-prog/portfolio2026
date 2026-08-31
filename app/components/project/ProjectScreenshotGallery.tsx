import { useEffect, useId, useLayoutEffect, useRef, useState, type RefObject } from "react";

import type { ProjectImage, ProjectScreenshotRow } from "~/content/projects";

import {
  ExpandableImageTrigger,
  ProjectExpandableImage,
  ProjectImageLightbox,
} from "./ProjectExpandableImage";

export { ProjectExpandableImage };

type ProjectScreenshotGalleryProps = {
  rows: readonly ProjectScreenshotRow[];
};

function useTripleRowLastImageHeight(
  rowRef: RefObject<HTMLLIElement | null>,
  imageSourcesKey: string,
) {
  useLayoutEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    const syncHeights = () => {
      const images = Array.from(
        row.querySelectorAll<HTMLImageElement>(".project-gallery__image"),
      );

      if (images.length < 3) return;

      const [first, second, last] = images;

      last.style.height = "";
      last.style.removeProperty("object-fit");
      last.style.removeProperty("object-position");

      if (!first.complete || !second.complete || !last.complete) return;

      const targetHeight = Math.max(first.offsetHeight, second.offsetHeight);
      if (targetHeight <= 0) return;

      last.style.height = `${targetHeight}px`;
      last.style.objectFit = "cover";
      last.style.objectPosition = "top center";
    };

    const images = row.querySelectorAll<HTMLImageElement>(".project-gallery__image");
    const loadHandlers = new Map<HTMLImageElement, () => void>();

    images.forEach((image) => {
      if (image.complete) return;

      const handleLoad = () => syncHeights();
      loadHandlers.set(image, handleLoad);
      image.addEventListener("load", handleLoad);
    });

    syncHeights();

    const resizeObserver = new ResizeObserver(syncHeights);
    resizeObserver.observe(row);
    images.forEach((image, index) => {
      if (index < 2) resizeObserver.observe(image);
    });

    window.addEventListener("resize", syncHeights);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", syncHeights);

      loadHandlers.forEach((handler, image) => {
        image.removeEventListener("load", handler);
      });

      const last = row.querySelector<HTMLImageElement>(
        ".project-gallery__trigger:nth-child(3) .project-gallery__image",
      );
      if (last) {
        last.style.height = "";
        last.style.removeProperty("object-fit");
        last.style.removeProperty("object-position");
      }
    };
  }, [imageSourcesKey]);
}

function TripleScreenshotRow({
  row,
  revealedSrc,
  onReveal,
  onOpen,
}: {
  row: Extract<ProjectScreenshotRow, { type: "triple" }>;
  revealedSrc: string | null;
  onReveal: (src: string) => void;
  onOpen: (image: ProjectImage) => void;
}) {
  const rowRef = useRef<HTMLLIElement>(null);
  const imageSources = row.images.map((image) => image.src);

  useTripleRowLastImageHeight(rowRef, imageSources.join("|"));

  return (
    <li
      ref={rowRef}
      className="project-gallery__row project-gallery__row--triple"
    >
      {row.images.map((image, index) => (
        <ExpandableImageTrigger
          key={image.src}
          image={image}
          isRevealed={revealedSrc === image.src}
          onReveal={() => onReveal(image.src)}
          onOpen={() => onOpen(image)}
          imageClassName={
            index === 2
              ? "project-gallery__image project-gallery__image--triple-last"
              : "project-gallery__image"
          }
        />
      ))}
    </li>
  );
}

function ScreenshotRow({
  row,
  revealedSrc,
  onReveal,
  onOpen,
}: {
  row: ProjectScreenshotRow;
  revealedSrc: string | null;
  onReveal: (src: string) => void;
  onOpen: (image: ProjectImage) => void;
}) {
  if (row.type === "full") {
    return (
      <li className="project-gallery__row project-gallery__row--full">
        <ExpandableImageTrigger
          image={row.image}
          isRevealed={revealedSrc === row.image.src}
          onReveal={() => onReveal(row.image.src)}
          onOpen={() => onOpen(row.image)}
        />
      </li>
    );
  }

  if (row.type === "triple") {
    return (
      <TripleScreenshotRow
        row={row}
        revealedSrc={revealedSrc}
        onReveal={onReveal}
        onOpen={onOpen}
      />
    );
  }

  if (row.type === "pair-wide-left") {
    return (
      <li className="project-gallery__row project-gallery__row--pair-wide-left">
        {row.images.map((image) => (
          <ExpandableImageTrigger
            key={image.src}
            image={image}
            isRevealed={revealedSrc === image.src}
            onReveal={() => onReveal(image.src)}
            onOpen={() => onOpen(image)}
          />
        ))}
      </li>
    );
  }

  return (
    <li className="project-gallery__row project-gallery__row--pair">
      {row.images.map((image) => (
        <ExpandableImageTrigger
          key={image.src}
          image={image}
          isRevealed={revealedSrc === image.src}
          onReveal={() => onReveal(image.src)}
          onOpen={() => onOpen(image)}
        />
      ))}
    </li>
  );
}

export function ProjectScreenshotGallery({ rows }: ProjectScreenshotGalleryProps) {
  const [activeImage, setActiveImage] = useState<ProjectImage | null>(null);
  const [revealedSrc, setRevealedSrc] = useState<string | null>(null);
  const galleryRef = useRef<HTMLUListElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!revealedSrc) return;

    function handlePointerDown(event: PointerEvent) {
      if (!galleryRef.current?.contains(event.target as Node)) {
        setRevealedSrc(null);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [revealedSrc]);

  function handleOpen(image: ProjectImage) {
    setRevealedSrc(null);
    setActiveImage(image);
  }

  return (
    <>
      <ul ref={galleryRef} className="project-gallery">
        {rows.map((row, index) => (
          <ScreenshotRow
            key={`${row.type}-${index}`}
            row={row}
            revealedSrc={revealedSrc}
            onReveal={setRevealedSrc}
            onOpen={handleOpen}
          />
        ))}
      </ul>

      {activeImage ? (
        <ProjectImageLightbox
          image={activeImage}
          onClose={() => setActiveImage(null)}
          titleId={titleId}
        />
      ) : null}
    </>
  );
}
