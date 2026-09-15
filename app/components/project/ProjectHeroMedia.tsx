import { useId, useRef, useState } from "react";

import type { ProjectImage } from "~/content/projects";

import { ProjectImageLightbox } from "./ProjectExpandableImage";

const projectAssets = {
  arrowExternal: "/images/portfolio/project-link-arrow.svg",
  zoomIcon: "/images/portfolio/project-screenshot-zoom.svg",
} as const;

type ProjectHeroMediaProps = {
  hero: ProjectImage;
};

function isDesktopViewport() {
  return window.matchMedia("(min-width: 64rem)").matches;
}

function HeroLinkButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="project-hero__link project-link-btn project-link-btn--dark"
      target="_blank"
      rel="noopener noreferrer"
    >
      {label}
      <img
        className="project-link-btn__icon project-link-btn__icon--light"
        src={projectAssets.arrowExternal}
        alt=""
        width={17}
        height={25}
        draggable={false}
      />
    </a>
  );
}

export function ProjectHeroMedia({ hero }: ProjectHeroMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const titleId = useId();

  function openLightbox() {
    videoRef.current?.pause();
    setIsPlaying(false);
    setIsLightboxOpen(true);
  }

  function closeLightbox() {
    setIsLightboxOpen(false);
    videoRef.current?.pause();
    setIsPlaying(false);
  }

  if (!hero.video) {
    function handleImagePointerUp(event: React.PointerEvent<HTMLImageElement>) {
      if (event.pointerType !== "mouse" || !isDesktopViewport()) return;
      openLightbox();
    }

    return (
      <>
        <figure className="project-hero__media project-hero__media--expandable">
          <img
            className="project-hero__image"
            src={hero.src}
            alt={hero.alt}
            draggable={false}
            onPointerUp={handleImagePointerUp}
          />
          <button
            type="button"
            className="project-hero__expand"
            aria-label={`View larger: ${hero.alt}`}
            onPointerUp={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              openLightbox();
            }}
          >
            <img
              className="project-gallery__zoom-icon"
              src={projectAssets.zoomIcon}
              alt=""
              width={28}
              height={28}
              draggable={false}
            />
          </button>
          {hero.link ? (
            <HeroLinkButton href={hero.link.href} label={hero.link.label} />
          ) : null}
        </figure>

        {isLightboxOpen ? (
          <ProjectImageLightbox
            image={hero}
            onClose={closeLightbox}
            titleId={titleId}
          />
        ) : null}
      </>
    );
  }

  async function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    video.pause();
    setIsPlaying(false);
  }

  function handleVideoPointerUp(event: React.PointerEvent<HTMLVideoElement>) {
    // Desktop mouse: paused opens the lightbox; playing pauses in place.
    if (isDesktopViewport() && event.pointerType === "mouse") {
      if (isPlaying) {
        void togglePlayback();
        return;
      }

      openLightbox();
      return;
    }

    // Touch and sub-desktop: the play overlay hides while playing, so the
    // video itself must toggle playback on tap.
    void togglePlayback();
  }

  function handleVideoPause() {
    setIsPlaying(false);
  }

  function handleVideoPlay() {
    setIsPlaying(true);
  }

  return (
    <>
      <figure className="project-hero__media project-hero__media--video">
        <video
          ref={videoRef}
          className="project-hero__video"
          src={hero.video}
          poster={hero.src}
          playsInline
          preload="metadata"
          aria-label={hero.alt}
          onPointerUp={handleVideoPointerUp}
          onPlay={handleVideoPlay}
          onPause={handleVideoPause}
          onEnded={handleVideoPause}
        />
        <button
          type="button"
          className={`project-hero__play${isPlaying ? " project-hero__play--hidden" : ""}`}
          aria-label={isPlaying ? "Pause project preview" : "Play project preview"}
          aria-pressed={isPlaying}
          onPointerUp={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            void togglePlayback();
          }}
        >
          <span className="project-hero__play-icon" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="project-hero__expand"
          aria-label={`View larger: ${hero.alt}`}
          onPointerUp={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            openLightbox();
          }}
        >
          <img
            className="project-gallery__zoom-icon"
            src={projectAssets.zoomIcon}
            alt=""
            width={28}
            height={28}
            draggable={false}
          />
        </button>
      </figure>

      {isLightboxOpen ? (
        <ProjectImageLightbox
          image={hero}
          video={hero.video}
          onClose={closeLightbox}
          titleId={titleId}
        />
      ) : null}
    </>
  );
}
