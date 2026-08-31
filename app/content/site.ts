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
