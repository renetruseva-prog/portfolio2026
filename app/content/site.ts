export const site = {
  name: "Renet Ruseva",
  tagline: "Hello, I am",
  bio: "I am a creative developer who likes to combine visual storytelling with the power of web technology.",
  nav: [
    { label: "Works", href: "#works" },
    { label: "About", href: "#about" },
    { label: "Contact me", href: "#contact" },
  ],
  languages: {
    current: "ENG",
    alternate: "BG",
  },
  cta: {
    label: "See my projects",
    href: "#works",
  },
} as const;

export const heroAssets = {
  photo: "/images/portfolio/hero-photo.png",
  circle: "/images/portfolio/hero-ellipse.svg",
  laptop: "/images/portfolio/collage-laptop.png",
  coffee: "/images/portfolio/collage-coffee.png",
  wrench: "/images/portfolio/collage-wrench.png",
  folder: "/images/portfolio/collage-folder.png",
  scrunchie: "/images/portfolio/collage-donut.png",
  star: "/images/portfolio/collage-star-small.png",
  ctaArrow: "/images/portfolio/arrow.svg",
} as const;
