import { useEffect, useId, useRef, useState } from "react";

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
  const rootRef = useRef<HTMLElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!isRevealed) return;

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsRevealed(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isRevealed]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function handleClose() {
    setIsOpen(false);
    setIsRevealed(false);
  }

  function reveal() {
    setIsRevealed(true);
  }

  function open() {
    setIsRevealed(false);
    setIsOpen(true);
  }

  return (
    <>
      <figure ref={rootRef} className={figureClassName}>
        <button
          type="button"
          className={`project-gallery__trigger${isRevealed ? " is-revealed" : ""}`}
          onPointerUp={(event) =>
            handleExpandablePointerUp(event, isRevealed, {
              onReveal: reveal,
              onOpen: open,
            })
          }
          onKeyDown={(event) => handleExpandableKeyDown(event, open)}
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

      {isOpen ? (
        <div
          className="project-lightbox"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <button
            type="button"
            className="project-lightbox__backdrop"
            onClick={handleClose}
            aria-label="Close image preview"
          />
          <figure className="project-lightbox__figure">
            <p id={titleId} className="sr-only">
              {image.alt}
            </p>
            <button
              type="button"
              className="project-lightbox__close"
              onClick={handleClose}
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
            <img
              className="project-lightbox__image"
              src={image.src}
              alt={image.alt}
              draggable={false}
            />
          </figure>
        </div>
      ) : null}
    </>
  );
}

type ExpandableImageTriggerProps = {
  image: ProjectImage;
  isRevealed: boolean;
  onReveal: () => void;
  onOpen: () => void;
  figureClassName?: string;
  imageClassName?: string;
};

export function ExpandableImageTrigger({
  image,
  isRevealed,
  onReveal,
  onOpen,
  figureClassName = "project-gallery__figure",
  imageClassName = "project-gallery__image",
}: ExpandableImageTriggerProps) {
  return (
    <figure className={figureClassName}>
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
  onClose,
  titleId,
}: {
  image: ProjectImage;
  onClose: () => void;
  titleId: string;
}) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
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
        <img
          className="project-lightbox__image"
          src={image.src}
          alt={image.alt}
          draggable={false}
        />
      </figure>
    </div>
  );
}
