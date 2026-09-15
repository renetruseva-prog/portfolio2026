import { useEffect, useId, useLayoutEffect, useRef, useState, type RefObject } from "react";

import type { ProjectImage, ProjectScreenshotRow } from "~/content/projects";

import {
  ExpandableImageTrigger,
  ProjectImageLightbox,
} from "./ProjectExpandableImage";

type ProjectScreenshotGalleryProps = {
  rows: readonly ProjectScreenshotRow[];
  roundFirstImage?: boolean;
};

const ROW_MODIFIER = {
  full: "project-gallery__row--full",
  triple: "project-gallery__row--triple",
  "pair-wide-left": "project-gallery__row--pair-wide-left",
  pair: "project-gallery__row--pair",
} as const;

function rowImages(row: ProjectScreenshotRow): readonly ProjectImage[] {
  return row.type === "full" ? [row.image] : row.images;
}

function useTripleRowLastImageHeight(
  rowRef: RefObject<HTMLLIElement | null>,
  imageSourcesKey: string,
) {
  useLayoutEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    if (
      row.closest(".project-page__panel-aside .project-gallery") &&
      window.matchMedia("(min-width: 64rem)").matches
    ) {
      return;
    }

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

type RowProps = {
  row: ProjectScreenshotRow;
  /** Flat position of this row's first image within the whole gallery. */
  startIndex: number;
  revealedSrc: string | null;
  onReveal: (src: string) => void;
  onOpen: (image: ProjectImage, imageClassName: string) => void;
  roundFirstImage?: boolean;
};

function imageClassFor(
  row: ProjectScreenshotRow,
  indexInRow: number,
  flatIndex: number,
  roundFirstImage?: boolean,
) {
  if (row.type === "triple" && indexInRow === 2) {
    return "project-gallery__image project-gallery__image--triple-last";
  }
  if (roundFirstImage && flatIndex === 0) {
    return "project-gallery__image project-gallery__image--rounded";
  }
  return "project-gallery__image";
}

function RowFigures({
  row,
  startIndex,
  revealedSrc,
  onReveal,
  onOpen,
  roundFirstImage,
}: RowProps) {
  return rowImages(row).map((image, indexInRow) => {
    const flatIndex = startIndex + indexInRow;
    const imageClassName = imageClassFor(row, indexInRow, flatIndex, roundFirstImage);

    return (
      <ExpandableImageTrigger
        key={image.src}
        image={image}
        figureIndex={flatIndex}
        isRevealed={revealedSrc === image.src}
        onReveal={() => onReveal(image.src)}
        onOpen={() => onOpen(image, imageClassName)}
        imageClassName={imageClassName}
      />
    );
  });
}

/** The last image is height-matched to its siblings, which needs a measured row. */
function TripleScreenshotRow(props: RowProps) {
  const rowRef = useRef<HTMLLIElement>(null);
  const imageSources = rowImages(props.row).map((image) => image.src);

  useTripleRowLastImageHeight(rowRef, imageSources.join("|"));

  return (
    <li ref={rowRef} className={`project-gallery__row ${ROW_MODIFIER.triple}`}>
      <RowFigures {...props} />
    </li>
  );
}

function ScreenshotRow(props: RowProps) {
  if (props.row.type === "triple") {
    return <TripleScreenshotRow {...props} />;
  }

  return (
    <li className={`project-gallery__row ${ROW_MODIFIER[props.row.type]}`}>
      <RowFigures {...props} />
    </li>
  );
}

export function ProjectScreenshotGallery({
  rows,
  roundFirstImage = false,
}: ProjectScreenshotGalleryProps) {
  const [activeImage, setActiveImage] = useState<ProjectImage | null>(null);
  const [activeImageClassName, setActiveImageClassName] = useState(
    "project-gallery__image",
  );
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

  function handleOpen(image: ProjectImage, imageClassName: string) {
    setRevealedSrc(null);
    setActiveImageClassName(imageClassName);
    setActiveImage(image);
  }

  let startIndex = 0;

  return (
    <>
      <ul ref={galleryRef} className="project-gallery">
        {rows.map((row, index) => {
          const rowStartIndex = startIndex;
          startIndex += rowImages(row).length;

          return (
            <ScreenshotRow
              key={`${row.type}-${index}`}
              row={row}
              startIndex={rowStartIndex}
              revealedSrc={revealedSrc}
              onReveal={setRevealedSrc}
              onOpen={handleOpen}
              roundFirstImage={roundFirstImage}
            />
          );
        })}
      </ul>

      {activeImage ? (
        <ProjectImageLightbox
          image={activeImage}
          imageClassName={activeImageClassName}
          onClose={() => setActiveImage(null)}
          titleId={titleId}
        />
      ) : null}
    </>
  );
}
