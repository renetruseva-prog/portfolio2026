import { useEffect, useId, useRef, useState } from "react";

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
      <li className="project-gallery__row project-gallery__row--triple">
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
