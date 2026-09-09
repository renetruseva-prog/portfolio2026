import { useEffect, useId, useRef, useState, type RefObject } from "react";

import type { ProjectImage } from "~/content/projects";

const zoomIcon = "/images/portfolio/project-screenshot-zoom.svg";
const closeIcon = "/images/portfolio/project-lightbox-close.svg";

function isTouchLikePointer(pointerType: string) {
  return pointerType === "touch" || pointerType === "pen";
}

function handleExpandablePointerUp(
  event: React.PointerEvent<HTMLButtonElement>,
  isRevealed: boolean,
  actions: {
    onReveal: () => void;
    onOpen: () => void;
  },
) {
  if (event.pointerType === "mouse") {
    if (event.button !== 0) return;
    actions.onOpen();
    return;
  }

  if (!isTouchLikePointer(event.pointerType)) return;

  event.preventDefault();

  if (isRevealed) {
    actions.onOpen();
    return;
  }

  actions.onReveal();
}

function handleExpandableKeyDown(
  event: React.KeyboardEvent<HTMLButtonElement>,
  onOpen: () => void,
) {
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  onOpen();
}

type ProjectExpandableImageProps = {
  image: ProjectImage;
  figureClassName?: string;
  imageClassName?: string;
};

export function ProjectExpandableImage({
  image,
  figureClassName = "project-gallery__figure",
  imageClassName = "project-gallery__image",
}: ProjectExpandableImageProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const figureRef = useRef<HTMLElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!isRevealed) return;

    function handlePointerDown(event: PointerEvent) {
      if (!figureRef.current?.contains(event.target as Node)) {
        setIsRevealed(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isRevealed]);

  function handleClose() {
    setIsOpen(false);
    setIsRevealed(false);
  }

  return (
    <>
      <ExpandableImageTrigger
        image={image}
        isRevealed={isRevealed}
        onReveal={() => setIsRevealed(true)}
        onOpen={() => {
          setIsRevealed(false);
          setIsOpen(true);
        }}
        figureRef={figureRef}
        figureClassName={figureClassName}
        imageClassName={imageClassName}
      />

      {isOpen ? (
        <ProjectImageLightbox
          image={image}
          onClose={handleClose}
          titleId={titleId}
        />
      ) : null}
    </>
  );
}

type ExpandableImageTriggerProps = {
  image: ProjectImage;
  isRevealed: boolean;
  onReveal: () => void;
  onOpen: () => void;
  figureRef?: RefObject<HTMLElement | null>;
  figureClassName?: string;
  imageClassName?: string;
};

export function ExpandableImageTrigger({
  image,
  isRevealed,
  onReveal,
  onOpen,
  figureRef,
  figureClassName = "project-gallery__figure",
  imageClassName = "project-gallery__image",
}: ExpandableImageTriggerProps) {
  return (
    <figure ref={figureRef} className={figureClassName}>
      <button
        type="button"
        className={`project-gallery__trigger${isRevealed ? " is-revealed" : ""}`}
        onPointerUp={(event) =>
          handleExpandablePointerUp(event, isRevealed, {
            onReveal,
            onOpen,
          })
        }
        onKeyDown={(event) => handleExpandableKeyDown(event, onOpen)}
        aria-label={`View larger: ${image.alt}`}
      >
        <img
          className={imageClassName}
          src={image.src}
          alt={image.alt}
          loading="lazy"
          draggable={false}
        />
        <span className="project-gallery__zoom" aria-hidden="true">
          <img
            className="project-gallery__zoom-icon"
            src={zoomIcon}
            alt=""
            width={28}
            height={28}
            draggable={false}
          />
        </span>
      </button>
    </figure>
  );
}

export function ProjectImageLightbox({
  image,
  video,
  onClose,
  titleId,
}: {
  image: ProjectImage;
  video?: string;
  onClose: () => void;
  titleId: string;
}) {
  useEffect(() => {
    // html owns the scrollbar (global.css), so the lock belongs there. Backfill
    // its width so hiding it neither shifts the page nor offsets the centred overlay.
    const root = document.documentElement;
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    const previousOverflow = root.style.overflow;
    const previousPaddingRight = root.style.paddingRight;

    root.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      root.style.paddingRight = `${scrollbarWidth}px`;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      root.style.overflow = previousOverflow;
      root.style.paddingRight = previousPaddingRight;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="project-lightbox"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="project-lightbox__backdrop"
        onClick={onClose}
        aria-label="Close image preview"
      />
      <figure className="project-lightbox__figure">
        <p id={titleId} className="sr-only">
          {image.alt}
        </p>
        <div className="project-lightbox__media">
          {video ? (
            <video
              className="project-lightbox__image project-lightbox__video"
              src={video}
              poster={image.src}
              autoPlay
              controls
              playsInline
              aria-label={image.alt}
            />
          ) : (
            <img
              className="project-lightbox__image"
              src={image.src}
              alt={image.alt}
              draggable={false}
            />
          )}
          <button
            type="button"
            className="project-lightbox__close"
            onClick={onClose}
            aria-label="Close image preview"
          >
            <img
              className="project-lightbox__close-icon"
              src={closeIcon}
              alt=""
              width={28}
              height={28}
              draggable={false}
            />
          </button>
        </div>
      </figure>
    </div>
  );
}
