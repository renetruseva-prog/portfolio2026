import { worksAssets, worksSlideCircleColors } from "~/content/site";

export type ProjectLink = {
  href: string;
  label: string;
};

export type ProjectImage = {
  src: string;
  alt: string;
  video?: string;
};

export type ProjectScreenshotRow =
  | { type: "pair"; images: readonly [ProjectImage, ProjectImage] }
  | { type: "triple"; images: readonly [ProjectImage, ProjectImage, ProjectImage] }
  | { type: "full"; image: ProjectImage };

export type ProjectToolkitGroup = {
  label: string;
  items: readonly string[];
};

export type ProjectCaseStudy = {
  titleLead: string;
  titleAccent: string;
  summary: string;
  links: {
    website?: ProjectLink;
    github?: ProjectLink;
    process?: ProjectLink;
  };
  toolkit: readonly ProjectToolkitGroup[];
  screenshotRows: readonly ProjectScreenshotRow[];
  description?: string;
  role?: readonly string[];
  goals?: readonly string[];
  features?: readonly string[];
  process?: {
    step: string;
    image: ProjectImage;
  };
};

export type ProjectBlock =
  | {
      id: string;
      type: "intro";
      paragraphs: readonly string[];
    }
  | {
      id: string;
      type: "text";
      title: string;
      paragraphs: readonly string[];
    }
  | {
      id: string;
      type: "image";
      src: string;
      alt: string;
      fullBleed?: boolean;
    }
  | {
      id: string;
      type: "split";
      title: string;
      paragraphs: readonly string[];
      image: ProjectImage;
      imagePosition?: "left" | "right";
    };

export type ProjectDetail = {
  slug: string;
  title: string;
  shortTitle?: string;
  tags: readonly string[];
  accentColor: string;
  hero: ProjectImage;
  caseStudy?: ProjectCaseStudy;
  blocks?: readonly ProjectBlock[];
};

const memomeAssets = {
  hero: "/images/portfolio/project2/project2_thumbnail.png",
  heroVideo: "/images/portfolio/project2/integration4.mp4",
  screenshot1: "/images/portfolio/project2/screenshot1.png",
  screenshot2: "/images/portfolio/project2/screenshot2.png",
  screenshot3: "/images/portfolio/project2/screenshot3.png",
  screenshot4: "/images/portfolio/project2/screenshot4.png",
  screenshot5: "/images/portfolio/project2/screenshot5.png",
  screenshot6: "/images/portfolio/project2/screenshot6.png",
  screenshot7: "/images/portfolio/project2/screenshot7.png",
} as const;

const transgressionAssets = {
  hero: "/images/portfolio/project1/project1_thumbnail.png",
  heroVideo: "/images/portfolio/project1/project1.mp4",
  screenshot1: "/images/portfolio/project1/screenshot1.png",
  screenshot2: "/images/portfolio/project1/screenshot2.png",
  screenshot3: "/images/portfolio/project1/screenshot3.png",
  screenshot4: "/images/portfolio/project1/screenshot4.png",
  screenshot5: "/images/portfolio/project1/screenshot5.png",
  screenshot6: "/images/portfolio/project1/screenshot6.png",
  styleboard: "/images/portfolio/project1/styleboard.png",
} as const;

export const projectDetails: ProjectDetail[] = [
  {
    slug: "project1",
    title: "The beauty of transgression",
    shortTitle: "The beauty of transgression",
    tags: ["Creative Code", "Design", "UI/UX"],
    accentColor: worksSlideCircleColors[0],
    hero: {
      src: transgressionAssets.hero,
      alt: "Preview of The beauty of transgression interactive experience",
      video: transgressionAssets.heroVideo,
    },
    caseStudy: {
      titleLead: "The beauty of",
      titleAccent: "TRANSGRESSION",
      summary:
        "For this project I was tasked to create an interactive online experience for the MoMu Museum in Antwerp. The main goal was to immerse the reader in an engaging sensory journey while they learn more about the famous Belgian designer Walter van Beirendonck.",
      links: {
        website: {
          href: "https://renetruseva-prog.github.io/integration3-github/",
          label: "Link to website",
        },
        process: { href: "https://www.figma.com/design/qerL19stCKf9t1ba7YrAXx/Integration3_RenetRuseva?node-id=1211-1553&p=f&t=GaxKSRsOdJtGoMQf-0", label: "Link to process" },
      },
      toolkit: [
        { label: "Design", items: ["Figma", "Photoshop"] },
        { label: "Code", items: ["Html", "Css", "JavaScript", "GSAP"] },
      ],
      goals: [
        "focus on interactivity",
        "micro-animations",
        "GSAP integration",
        "immersive storytelling",
      ],
      screenshotRows: [
        {
          type: "pair",
          images: [
            {
              src: transgressionAssets.screenshot1,
              alt: "Homepage layout with bold typography and collage elements",
            },
            {
              src: transgressionAssets.screenshot2,
              alt: "Editorial section with colorful graphic shapes",
            },
          ],
        },
        {
          type: "full",
          image: {
            src: transgressionAssets.screenshot3,
            alt: "Full-width project screen with layered visuals",
          },
        },
        {
          type: "full",
          image: {
            src: transgressionAssets.screenshot4,
            alt: "Interactive chapter with collage figure",
          },
        },
        {
          type: "pair",
          images: [
            {
              src: transgressionAssets.screenshot5,
              alt: "Detail view of project typography",
            },
            {
              src: transgressionAssets.screenshot6,
              alt: "Detail view of project color palette",
            },
          ],
        },
      ],
      process: {
        step: "Styleboard",
        image: {
          src: transgressionAssets.styleboard,
          alt: "Mood board collage for The beauty of transgression",
        },
      },
    },
  },
  {
    slug: "project2",
    title: "Memome - Discover Antwerp",
    shortTitle: "MemoMe app",
    tags: ["Creative Code", "UI/UX", "Teamwork"],
    accentColor: "#D00E0E",
    hero: {
      src: memomeAssets.hero,
      alt: "MemoMe interactive map of Antwerp with memory pins and category filters",
      video: memomeAssets.heroVideo,
    },
    caseStudy: {
      titleLead: "MemoMe app -",
      titleAccent: "Interactive map",
      summary:
        "For this project my team and I had to explore a strategy of encouraging young people (18-36) to choose Antwerp for a multi-day city trip. The result is MemoMe, a location-based web app where visitors pin memories on a map, collect digital stickers via QR codes, and build a shareable travel diary to document their trips.",
      links: {
        website: {
          href: "https://memomeantwerp.vercel.app/",
          label: "Link to website",
        },
        github: {
          href: "https://github.com/renetruseva-prog",
          label: "Link to github",
        },
        process: {
          href: "https://www.figma.com/design/PZGhPbu9SVBInJ0sB02aVw/Portfolio?node-id=324-5783",
          label: "Link to process",
        },
      },
      toolkit: [
        { label: "UX/UI", items: ["Figma", "Miro", "Interviews"] },
        {
          label: "Code",
          items: [
            "JavaScript",
            "Css",
            "React",
            "React Router v7",
            "GSAP",
            "Supabase",
            "Leaflet",
            "Mobile-first",
          ],
        },
      ],
      screenshotRows: [
        {
          type: "pair",
          images: [
            {
              src: memomeAssets.screenshot1,
              alt: "MemoMe map popup with a fashion memory pin",
            },
            {
              src: memomeAssets.screenshot2,
              alt: "MemoMe map popup for a music event",
            },
          ],
        },
        {
          type: "triple",
          images: [
            {
              src: memomeAssets.screenshot3,
              alt: "MemoMe add memo screen with media upload",
            },
            {
              src: memomeAssets.screenshot4,
              alt: "MemoMe profile with memos, favorites, and stickers",
            },
            {
              src: memomeAssets.screenshot5,
              alt: "MemoMe sticker achievements collection",
            },
          ],
        },
        {
          type: "full",
          image: {
            src: memomeAssets.screenshot6,
            alt: "MemoMe map with settings panel and location pins",
          },
        },
        {
          type: "full",
          image: {
            src: memomeAssets.screenshot7,
            alt: "MemoMe landing screen with create account call to action",
          },
        },
      ],
      description:
        "MemoMe turns a city visit into a personal souvenir. Users drop memory pins on the map of Antwerp, discover places and events, scan physical QR stickers to unlock collectibles, and flip through a travel diary they can decorate and share.",
      role: ["Lead developer", "UX/UI researcher", "Proactive teammate"],
      goals: [
        "have physical and digital engagement",
        "add mapping integration",
        "use latest React patterns",
        "follow a CI/CD pipeline",
      ],
      features: [
        "Map-based memory pinning",
        "Memo CRUD with media upload",
        "Location search & geocoding",
        "Authentication (guest + registered)",
        "Discover section (events, places, search)",
        "Favourites & user collections",
        "Travel journals with page navigation",
        "Draggable sticker decoration",
        "Scan QR codes → digital collectible rewards",
        "Recap generation & social sharing",
        "Account settings",
        "GSAP integration",
      ],
    },
  },
  {
    slug: "project3",
    title: "Phone to desktop presenter with WebRTC",
    shortTitle: "WebRTC presenter",
    tags: ["Creative Code", "WebRTC", "Socket.IO"],
    accentColor: worksSlideCircleColors[2],
    hero: {
      src: worksAssets.slide3.phone,
      alt: "WebRTC presenter phone interface",
    },
    blocks: [
      {
        id: "intro",
        type: "intro",
        paragraphs: [
          "A real-time presentation tool that turns a phone into a remote control and second screen for desktop presentations using WebRTC.",
        ],
      },
      {
        id: "visual",
        type: "image",
        src: worksAssets.slide3.hand,
        alt: "Hand holding phone for WebRTC presenter",
        fullBleed: true,
      },
      {
        id: "approach",
        type: "text",
        title: "Approach",
        paragraphs: [
          "The project focused on low-latency communication between devices, with a UI that makes pairing and presenting feel immediate and reliable.",
          "Socket.IO handles session coordination while WebRTC streams the live content between phone and desktop.",
        ],
      },
      {
        id: "details",
        type: "split",
        title: "Interaction design",
        imagePosition: "right",
        image: {
          src: worksAssets.slide3.sparkleLeft,
          alt: "Decorative sparkle from WebRTC project",
        },
        paragraphs: [
          "Visual feedback was kept minimal so presenters can focus on content. Sparkle accents and motion cues reinforce state changes without adding noise.",
        ],
      },
    ],
  },
  {
    slug: "project4",
    title: "Miles and Meals",
    shortTitle: "Miles and Meals",
    tags: ["Branding", "Design", "UI/UX"],
    accentColor: worksSlideCircleColors[3],
    hero: {
      src: worksAssets.slide4.foodbox,
      alt: "Miles and Meals food box branding",
    },
    blocks: [
      {
        id: "intro",
        type: "intro",
        paragraphs: [
          "Miles and Meals is a travel-food brand concept connecting distance, discovery, and local cuisine through a warm, tactile visual identity.",
        ],
      },
      {
        id: "brand",
        type: "image",
        src: worksAssets.slide4.plate,
        alt: "Plate illustration from Miles and Meals",
        fullBleed: true,
      },
      {
        id: "identity",
        type: "text",
        title: "Brand identity",
        paragraphs: [
          "The identity uses earthy tones, hand-drawn utensils, and editorial layouts to feel approachable yet premium — like a food journal you can travel with.",
        ],
      },
      {
        id: "ui",
        type: "split",
        title: "UI direction",
        imagePosition: "left",
        image: {
          src: worksAssets.slide4.knife,
          alt: "Knife illustration from Miles and Meals",
        },
        paragraphs: [
          "Interface components extend the brand system with rounded cards, generous spacing, and accent color used sparingly for calls to action.",
        ],
      },
    ],
  },
];

const projectMap = new Map(projectDetails.map((project) => [project.slug, project]));

export function getProjectBySlug(slug: string) {
  return projectMap.get(slug);
}

export function getProjectSlugs() {
  return projectDetails.map((project) => project.slug);
}

export function getAdjacentProjects(slug: string) {
  const index = projectDetails.findIndex((project) => project.slug === slug);

  if (index === -1) {
    return { prev: null, next: null };
  }

  const prev = projectDetails[(index - 1 + projectDetails.length) % projectDetails.length];
  const next = projectDetails[(index + 1) % projectDetails.length];

  return { prev, next };
}

export function getProjectDescription(project: ProjectDetail) {
  if (project.caseStudy) {
    return project.caseStudy.summary;
  }

  const intro = project.blocks?.find((block) => block.type === "intro");
  return intro?.paragraphs[0] ?? `Case study for ${project.title}.`;
}
