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
  hand: "/images/portfolio/hero-hand.png",
  circle: "/images/portfolio/hero-ellipse.svg",
  laptop: "/images/portfolio/laptop.png",
  icedCoffee: "/images/portfolio/icedCoffee.png",
  tool: "/images/portfolio/tool.png",
  sketchbook: "/images/portfolio/sketchbook.png",
  scrunchieAndHairpin: "/images/portfolio/scrunchieAndHairpin.png",
  headerArrow: "/images/portfolio/header_arrow.svg",
  star: "/images/portfolio/star.svg",
  ctaArrow: "/images/portfolio/arrow.svg",
} as const;

export type WorkProject = {
  id: string;
  title: string;
  tags: readonly string[];
  href: string;
  ctaLabel: string;
};

export const worksAssets = {
  circle: "/images/portfolio/hero-ellipse.svg",
  figure: "/images/portfolio/project-figure.png",
  figureCut: "/images/portfolio/project-figure_cut.png",
  balloonBlue: "/images/portfolio/balloon-blue.png",
  balloonPink: "/images/portfolio/balloon-pink.png",
  arrowLeft: "/images/portfolio/arrow-left.svg",
  arrowRight: "/images/portfolio/arrow-right.svg",
  squiggle: "/images/portfolio/squiggle-works.svg",
} as const;

export const worksProjects: WorkProject[] = [
  {
    id: "beauty-of-transgression",
    title: "The beauty of transgression",
    tags: ["Creative Code", "Design", "UI/UX"],
    href: "#",
    ctaLabel: "See more",
  },
  {
    id: "digital-canvas",
    title: "Digital canvas",
    tags: ["Creative Code", "Motion", "Web"],
    href: "#",
    ctaLabel: "See more",
  },
  {
    id: "form-and-feeling",
    title: "Form and feeling",
    tags: ["Design", "UI/UX", "Branding"],
    href: "#",
    ctaLabel: "See more",
  },
  {
    id: "light-in-motion",
    title: "Light in motion",
    tags: ["Motion", "Creative Code", "3D"],
    href: "#",
    ctaLabel: "See more",
  },
];
