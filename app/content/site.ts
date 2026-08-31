export const site = {
  name: "Renet Ruseva",
  tagline: "Hello, I am",
  bio: "I am a creative developer who likes to combine visual storytelling with the power of web technology.",
  nav: [
    { label: "Works", href: "/#works" },
    { label: "About", href: "/#about" },
    { label: "Contact me", href: "/#contact" },
  ],
  mobileMenuLinks: [
    { label: "Home", href: "/" },
    { label: "Works", href: "/#works" },
    { label: "About", href: "/#about" },
    { label: "Contacts", href: "/#contact" },
  ] as const,
  languages: {
    current: "ENG",
    alternate: "BG",
  },
  cta: {
    label: "See my projects",
    href: "/#works",
  },
  cv: {
    label: "Download my CV",
    href: "/cv/renet-ruseva-cv.pdf",
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

export const worksSlideCircleColors = [
  "#D00E0E",
  "#33E5A2",
  "#1E50E1",
  "#D34421",
] as const;

export const worksAssets = {
  slide1: {
    figure: "/images/portfolio/works-memome/slide1/project-figure.png",
    figureCut: "/images/portfolio/works-memome/slide1/project-figure_cut.png",
    balloonBlue: "/images/portfolio/works-memome/slide1/balloon-blue.png",
    balloonPink: "/images/portfolio/works-memome/slide1/balloon-pink.png",
  },
  slide2: {
    phone: "/images/portfolio/works-memome/slide2/memo-phone.png",
    greenGrid: "/images/portfolio/works-memome/slide2/green-grid.svg",
    hand: "/images/portfolio/works-memome/slide2/hand.svg",
  },
  slide3: {
    phone: "/images/portfolio/works-memome/slide3/phone_webrtc.png",
    hand: "/images/portfolio/works-memome/slide3/hand_webrtc.png",
    sparkleLeft: "/images/portfolio/works-memome/slide3/left_sparkle.png",
    sparkleRight: "/images/portfolio/works-memome/slide3/right_sparkle.png",
    sparkleBottom: "/images/portfolio/works-memome/slide3/sparkle_bottom.png",
  },
  slide4: {
    foodbox: "/images/portfolio/works-memome/slide4/foodbox.png",
    knife: "/images/portfolio/works-memome/slide4/knife.svg",
    fork: "/images/portfolio/works-memome/slide4/fork.svg",
    plate: "/images/portfolio/works-memome/slide4/plate.svg",
  },
  arrowLeft: "/images/portfolio/arrow-left.svg",
  arrowRight: "/images/portfolio/arrow-right.svg",
} as const;

/** Figma Vector 588 — inline hero→Works connector path. */
export const worksHeroSquiggle = {
  viewBox: "0 0 723.034 435.354",
  width: 723.034,
  height: 435.354,
  path: "M116.334 344.5L116.46 344.984L116.334 344.5ZM281.834 261.5L281.383 261.284L281.834 261.5ZM482.464 116.265L482.826 115.92L482.464 116.265ZM482.464 95.1401L482.031 94.8894V94.8894L482.464 95.1401ZM723.03 0.559272C723.063 0.285074 722.867 0.0362769 722.593 0.00356889C722.319 -0.0291392 722.07 0.166628 722.037 0.440826L722.534 0.500049L723.03 0.559272ZM0.333674 411.123L0 411.495C23.2158 432.298 45.1232 437.795 64.1951 434.44C83.2429 431.09 99.3671 418.926 111.079 404.589C122.786 390.257 130.138 373.686 131.592 361.426C132.317 355.31 131.586 350.158 129.067 346.917C126.504 343.621 122.214 342.445 116.207 344.016L116.334 344.5L116.46 344.984C122.234 343.474 126.044 344.66 128.277 347.531C130.553 350.458 131.314 355.28 130.599 361.308C129.173 373.334 121.924 389.731 110.304 403.956C98.688 418.176 82.7585 430.159 64.0218 433.455C45.3092 436.747 23.7015 431.391 0.667347 410.75L0.333674 411.123ZM116.334 344.5L116.207 344.016C114.095 344.569 112.487 345.548 111.386 346.874C110.285 348.2 109.72 349.839 109.636 351.657C109.469 355.274 111.2 359.63 114.443 363.896C120.943 372.447 133.679 380.858 150.469 382.622C184.107 386.157 233.756 363.025 282.285 261.716L281.834 261.5L281.383 261.284C232.911 362.475 183.56 385.094 150.573 381.628C134.051 379.892 121.568 371.616 115.24 363.291C112.069 359.12 110.483 354.992 110.635 351.703C110.71 350.068 111.213 348.647 112.155 347.513C113.098 346.377 114.51 345.494 116.46 344.984L116.334 344.5ZM281.834 261.5L282.285 261.716C329.07 164.045 372.499 120.881 407.46 105.576C442.372 90.293 468.908 102.765 482.102 116.61L482.464 116.265L482.826 115.92C469.376 101.806 442.4 89.1892 407.059 104.66C371.766 120.11 328.202 163.543 281.383 261.284L281.834 261.5ZM482.464 116.265L482.102 116.61C495.593 130.769 498.902 142.138 497.326 149.77C495.756 157.375 489.306 161.428 482.822 160.999C476.367 160.571 469.793 155.677 468.092 145.147C466.386 134.582 469.599 118.338 482.896 95.3908L482.464 95.1401L482.031 94.8894C468.685 117.921 465.345 134.41 467.105 145.307C468.87 156.238 475.78 161.534 482.756 161.996C489.701 162.457 496.627 158.101 498.306 149.972C499.979 141.868 496.411 130.177 482.826 115.92L482.464 116.265ZM482.464 95.1401L482.896 95.3908C498.922 67.735 520.874 56.1118 545.062 52.1926C569.292 48.2666 595.754 52.0711 620.791 55.3107C645.771 58.543 669.382 61.2233 687.713 54.906C696.902 51.7389 704.771 46.3108 710.825 37.5737C716.872 28.8451 721.088 16.8439 723.03 0.559272L722.534 0.500049L722.037 0.440826C720.107 16.6208 715.929 28.4504 710.003 37.0042C704.082 45.5497 696.395 50.8559 687.387 53.9605C669.321 60.1865 645.965 57.5597 620.919 54.319C595.93 51.0855 569.307 47.2512 544.902 51.2055C520.456 55.1664 498.226 66.9424 482.031 94.8894L482.464 95.1401Z",
} as const;

export type AboutPhoto = {
  id: string;
  src: string;
  alt: string;
  caption: readonly string[];
  captionPosition: "top-left" | "bottom-left";
};

export const aboutAssets = {
  photos: [
    {
      id: "belgium-winter",
      src: "/images/portfolio/about-me/photo1.png",
      alt: "Renet on a snowy rooftop during her first winter in Belgium",
      caption: ["first winter", "in Belgium"],
      captionPosition: "top-left",
    },
    {
      id: "bratislava-trip",
      src: "/images/portfolio/about-me/photo2.png",
      alt: "Renet visiting the Blue Church in Bratislava",
      caption: ["trip to", "Bratislava"],
      captionPosition: "bottom-left",
    },
    {
      id: "future-coworker",
      src: "/images/portfolio/about-me/photo3.png",
      alt: "Renet standing next to a humanoid robot",
      caption: ["meeting a future", "co-worker??"],
      captionPosition: "top-left",
    },
  ],
  cvArrow: "/images/portfolio/arrow-external.svg",
  highlight: "/images/portfolio/about-me/highlight.svg",
} as const satisfies { photos: AboutPhoto[]; cvArrow: string; highlight: string };

export const aboutContent = {
  introHeading: "In short,",
  paragraphs: [
    {
      text: "I'm a ",
      accent: "digital design student and creative developer",
      strong: " based in Kortrijk, Belgium.",
      rest: " I'm interested in the space between design, technology and user interaction. I like taking messy ideas, figuring out what actually matters, and turning them into experiences that feel both inspiring, authentic and intuitive.",
    },
    {
      text: "When I'm not creating (which is, khem, rarely), you can find me crocheting, reading, collaging, DIY-ing, travelling around or just exploring different small cafes with my friends :)",
    },
  ],
  quote: {
    text: "I like complicated problems —\nbecause I\nlike solving them.",
    highlight: "solving",
  },
} as const;

export type ExpertiseArea = {
  id: string;
  index: string;
  title: string;
  skillLines: readonly (readonly string[])[];
};

export const expertiseContent = {
  title: "My expertise",
  areas: [
    {
      id: "visual-design",
      index: "01",
      title: "Visual Design + UX/UI",
      skillLines: [
        ["Figma", "Photoshop", "Miro"],
        ["Illustrator", "After Effects"],
        ["Prototyping"],
      ],
    },
    {
      id: "web-development",
      index: "02",
      title: "Web Development",
      skillLines: [
        ["Html", "Css", "JavaScript"],
        ["ml5.js", "MySQL", "React"],
        ["React Router", "GSAP", "Git"],
      ],
    },
  ],
} as const satisfies { title: string; areas: ExpertiseArea[] };

export type LanguageItem = {
  id: string;
  name: string;
  level: string;
};

export const languagesContent = {
  title: "Languages",
  items: [
    { id: "bulgarian", name: "Bulgarian", level: "Native" },
    { id: "english", name: "English", level: "Fluent" },
    { id: "russian", name: "Russian", level: "Fluent" },
  ],
} as const satisfies { title: string; items: LanguageItem[] };

export type EducationEntry = {
  id: string;
  period: string;
  institution: string;
  program?: string;
  location: string;
};

export const educationContent = {
  title: "Education",
  entries: [
    {
      id: "devine",
      period: "Sep 2024 - Ongoing",
      institution: "Devine - KASK Howest",
      program: "Digital Design and Development",
      location: "Kortrijk, Belgium",
    },
    {
      id: "high-school",
      period: "Sep 2018 - May 2023",
      institution: 'High School of Mathematics "Dr Petar Beron"',
      location: "Varna, Bulgaria",
    },
  ],
} as const satisfies { title: string; entries: EducationEntry[] };

export const footerAssets = {
  frame: "/images/portfolio/footer/frame.svg",
  star: "/images/portfolio/footer/star.svg",
  arrowUp: "/images/portfolio/arrow-up.svg",
  arrowExternal: "/images/portfolio/arrow-external.svg",
} as const;

export const footerContent = {
  heading: "Let's work together.",
  headingHighlight: "work",
  exploreTitle: "Explore",
  contactTitle: "Contacts",
  exploreLinks: [
    { label: "Home", href: "/" },
    { label: "Works", href: "/#works" },
    { label: "About", href: "/#about" },
  ],
  contactLinks: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/renet-ruseva-3089682b9/",
    },
    { label: "Github", href: "https://github.com/renetruseva-prog" },
    { label: "Behance", href: "https://www.behance.net/renetruseva" },
    { label: "Email", href: "mailto:renetruseva@gmail.com" },
    { label: "Download CV", href: "/cv/renet-ruseva-cv.pdf" },
  ],
  backToTop: "Back to top",
  copyright: "© Copyright Renet Ruseva 2026",
} as const;

export const worksProjects: WorkProject[] = [
  {
    id: "project1",
    title: "The beauty of transgression",
    tags: ["Creative Code", "Design", "UI/UX"],
    href: "/works/project1",
    ctaLabel: "See more",
  },
  {
    id: "project2",
    title: "Memome - Discover Antwerp",
    tags: ["Creative Code", "UI/UX", "Teamwork"],
    href: "/works/project2",
    ctaLabel: "See more",
  },
  {
    id: "project3",
    title: "Phone to desktop presenter with WebRTC",
    tags: ["Creative Code", "WebRTC", "Socket.IO"],
    href: "/works/project3",
    ctaLabel: "See more",
  },
  {
    id: "project4",
    title: "Miles and Meals",
    tags: ["Branding", "Design", "UI/UX"],
    href: "/works/project4",
    ctaLabel: "See more",
  },
];
