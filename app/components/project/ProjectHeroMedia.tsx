import { useRef, useState } from "react";

import type { ProjectImage } from "~/content/projects";

type ProjectHeroMediaProps = {
  hero: ProjectImage;
};

export function ProjectHeroMedia({ hero }: ProjectHeroMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!hero.video) {
    return (
      <figure className="project-hero__media">
        <img
          className="project-hero__image"
          src={hero.src}
          alt={hero.alt}
          draggable={false}
        />
      </figure>
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

  function handleVideoPause() {
    setIsPlaying(false);
  }

  function handleVideoPlay() {
    setIsPlaying(true);
  }

  return (
    <figure className="project-hero__media">
      <video
        ref={videoRef}
        className="project-hero__video"
        src={hero.video}
        poster={hero.src}
        playsInline
        preload="metadata"
        aria-label={hero.alt}
        onClick={isPlaying ? togglePlayback : undefined}
        onPlay={handleVideoPlay}
        onPause={handleVideoPause}
        onEnded={handleVideoPause}
      />
      <button
        type="button"
        className={`project-hero__play${isPlaying ? " project-hero__play--hidden" : ""}`}
        aria-label={isPlaying ? "Pause project preview" : "Play project preview"}
        aria-pressed={isPlaying}
        onClick={togglePlayback}
      >
        <span className="project-hero__play-icon" aria-hidden="true" />
      </button>
    </figure>
  );
}
