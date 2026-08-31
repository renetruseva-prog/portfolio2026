import { worksSlideCircleColors } from "~/content/site";

export type ProjectLink = {
  href: string;
  label: string;
};

export type ProjectImage = {
  src: string;
  alt: string;
  video?: string;
  link?: ProjectLink;
};

export type ProjectProcessIntro = {
  paragraphs: readonly string[];
  link?: ProjectLink;
};

export type ProjectDescriptionSection = {
  title: string;
  paragraphs: readonly string[];
  links?: {
    design?: ProjectLink;
    process?: ProjectLink;
  };
  screenshotRows?: readonly ProjectScreenshotRow[];
};

export type ProjectScreenshotRow =
  | { type: "pair"; images: readonly [ProjectImage, ProjectImage] }
  | {
      type: "pair-wide-left";
      images: readonly [ProjectImage, ProjectImage];
    }
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
    design?: ProjectLink;
    process?: ProjectLink;
  };
  toolkit: readonly ProjectToolkitGroup[];
  screenshotRows: readonly ProjectScreenshotRow[];
  processIntro?: ProjectProcessIntro;
  description?: readonly string[];
  descriptionSection?: ProjectDescriptionSection;
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
  accentColor?: string;
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

const webrtcAssets = {
  hero: "/images/portfolio/project3/project3_thumbnail.png",
  heroVideo: "/images/portfolio/project3/presentation_project.mp4",
  screenshot1: "/images/portfolio/project3/screenshot1.png",
  screenshot2: "/images/portfolio/project3/screenshot2.png",
  screenshot3: "/images/portfolio/project3/screenshot3.png",
  screenshot4: "/images/portfolio/project3/screenshot4.png",
  screenshot5: "/images/portfolio/project3/screenshot5.png",
  screenshot6: "/images/portfolio/project3/screenshot6.png",
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

const milesAndMealsAssets = {
  hero: "/images/portfolio/project4/project4_thumbnail.png",
  screenshot1: "/images/portfolio/project4/screenshot1.png",
  screenshot2: "/images/portfolio/project4/screenshot2.png",
  screenshot3: "/images/portfolio/project4/screenshot3.png",
  screenshot4: "/images/portfolio/project4/screenshot4.png",
  screenshot5: "/images/portfolio/project4/screenshot5.png",
  screenshot6: "/images/portfolio/project4/screenshot6.png",
  screenshot7: "/images/portfolio/project4/screenshot7.png",
  screenshot8: "/images/portfolio/project4/screenshot8.png",
  appScreenshot1: "/images/portfolio/project4/onboarding1.png",
  appScreenshot2: "/images/portfolio/project4/onboarding2.png",
  appScreenshot3: "/images/portfolio/project4/onboarding3.png",
} as const;

const milesAndMealsBehance = "https://www.behance.net/renetruseva";
const milesAndMealsBrandingDesign =
  "https://www.figma.com/design/seDoRutsHMvAPfhkxVawjF/Miles---Meals?node-id=6817-1886&p=f&t=DNguRT8ivgxL8E8k-0";
const milesAndMealsBrandingProcess =
  "https://www.figma.com/design/seDoRutsHMvAPfhkxVawjF/Miles---Meals?node-id=6817-1889&p=f&t=DNguRT8ivgxL8E8k-0";
const milesAndMealsAppDesign =
  "https://www.figma.com/design/seDoRutsHMvAPfhkxVawjF/Miles---Meals?node-id=6817-1887&p=f&t=DNguRT8ivgxL8E8k-0";
const milesAndMealsAppProcess =
  "https://www.figma.com/design/seDoRutsHMvAPfhkxVawjF/Miles---Meals?node-id=6817-1888&p=f&t=DNguRT8ivgxL8E8k-0";

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
          href: "https://github.com/elitsakutsarova/integration4-team3",
          label: "Link to github",
        },
        process: {
          href: "https://www.figma.com/design/aIuu9d4dtJ1MUlczgIZ2gN/DEV-integration?node-id=0-1&p=f&t=stsuA9VvAozHdTqQ-0",
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
      description: [
        "MemoMe turns a city visit into a personal souvenir. Users drop memory pins on the map of Antwerp, discover places and events, scan physical QR stickers to unlock collectibles, and flip through a travel diary they can decorate and share.",
      ],
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
    shortTitle: "Presenter with WebRTC",
    tags: ["Creative Code", "WebRTC", "Socket.IO"],
    accentColor: "#D00E0E",
    hero: {
      src: webrtcAssets.hero,
      alt: "WebRTC Presenter interactive presentation tool preview",
      video: webrtcAssets.heroVideo,
    },
    caseStudy: {
      titleLead: "Presenter",
      titleAccent: "with WebRTC",
      summary:
        "This is a WebRTC-powered presentation remote that turns your phone into a private presenter view equipped with speaker notes, timer, slide navigation, laser pointer, and live camera.",
      links: {
        github: {
          href: "https://github.com/renetruseva-prog/WebRTC",
          label: "Link to github",
        },
      },
      toolkit: [
        {
          label: "Code",
          items: [
            "JavaScript",
            "WebRTC",
            "Node.js",
            "Express",
            "Socket.IO",
            "Reveal.js",
            "HTML",
            "Css",
          ],
        },
      ],
      screenshotRows: [
        {
          type: "pair-wide-left",
          images: [
            {
              src: webrtcAssets.screenshot1,
              alt: "WebRTC Presenter desktop setup screen with phone pairing prompt",
            },
            {
              src: webrtcAssets.screenshot2,
              alt: "QR code modal for pairing a phone as presenter remote",
            },
          ],
        },
        {
          type: "triple",
          images: [
            {
              src: webrtcAssets.screenshot3,
              alt: "Mobile presenter view with speaker notes and slide controls",
            },
            {
              src: webrtcAssets.screenshot4,
              alt: "Mobile presenter interface with timer and navigation",
            },
            {
              src: webrtcAssets.screenshot5,
              alt: "Mobile presenter controls with laser pointer and camera options",
            },
          ],
        },
        {
          type: "full",
          image: {
            src: webrtcAssets.screenshot6,
            alt: "Desktop presentation slide with picture-in-picture camera stream",
          },
        },
      ],
      description: [
        "WebRTC Presenter is a real-time presentation system designed for speakers who want a professional setup without third-party services. The desktop runs the main slide deck (Markdown or PDF via Reveal.js), while a connected phone acts as a private presenter view — showing speaker notes, slide navigation, and a synced timer that the audience doesn't see.",
        "Devices connect over the local network through a QR code. Socket.IO handles the initial WebRTC handshake, and once connected, slide commands, notes, timer state, laser pointer input, and optional camera video travel over a direct peer-to-peer connection. The phone can control slides via touch buttons or gyroscope tilt, project a laser pointer onto the desktop slides, stream its camera as picture-in-picture, and trigger timed warnings with vibration and audio when the presentation is running low on time.",
      ],
      features: [
        "WebRTC P2P connection",
        "Socket.IO signaling",
        "QR code pairing over local network",
        "Reveal.js slide deck",
        "Gyroscope navigation",
        "Laser pointer",
        "Camera streaming",
        "Session enforcement",
      ],
    },
  },
  {
    slug: "project4",
    title: "Miles and Meals",
    shortTitle: "Miles and Meals",
    tags: ["Branding", "Design", "UI/UX"],
    hero: {
      src: milesAndMealsAssets.hero,
      alt: "Miles and Meals logo with suitcase mark on a cream background",
      link: {
        href: milesAndMealsBehance,
        label: "Link to Behance",
      },
    },
    caseStudy: {
      titleLead: "Miles and Meals",
      titleAccent: "Branding case",
      summary:
        "For this project I was tasked to create a branding identity and app interface for Miles and Meals - a subscription food box service. This case includes everything a brand needs - tone of voice, mood and style, logo, colours, typography, visual direction, icons, packaging and a dedicated app design.",
      links: {
        design: {
          href: milesAndMealsBrandingDesign,
          label: "Link to design",
        },
        process: {
          href: milesAndMealsBrandingProcess,
          label: "Link to process",
        },
      },
      toolkit: [
        {
          label: "Design",
          items: ["Figma", "Photoshop", "Adobe Illustrator"],
        },
      ],
      processIntro: {
        paragraphs: [
          "In order to create this branding, I explored different colours and existing logos for similar brands in the food box industry. Then I sketched out various logo options and tried out compatible fonts, as well as textures and supportive graphic elements.",
        ],
        link: {
          href: milesAndMealsBrandingProcess,
          label: "Full process",
        },
      },
      screenshotRows: [
        {
          type: "pair",
          images: [
            {
              src: milesAndMealsAssets.screenshot1,
              alt: "Miles and Meals brand positioning with keywords and tone of voice sliders",
            },
            {
              src: milesAndMealsAssets.screenshot2,
              alt: "Miles and Meals styleboard with reference brands and colour palette",
            },
          ],
        },
        {
          type: "pair",
          images: [
            {
              src: milesAndMealsAssets.screenshot3,
              alt: "Miles and Meals logo typography with annotated letterforms",
            },
            {
              src: milesAndMealsAssets.screenshot4,
              alt: "Miles and Meals logo elements showing suitcase and bite mark construction",
            },
          ],
        },
        {
          type: "pair",
          images: [
            {
              src: milesAndMealsAssets.screenshot5,
              alt: "Miles and Meals logo variants across colour backgrounds",
            },
            {
              src: milesAndMealsAssets.screenshot6,
              alt: "Miles and Meals colour palette with primary and secondary swatches",
            },
          ],
        },
        {
          type: "pair",
          images: [
            {
              src: milesAndMealsAssets.screenshot7,
              alt: "Miles and Meals brand typography with Galindo and Space Grotesk",
            },
            {
              src: milesAndMealsAssets.screenshot8,
              alt: "Miles and Meals brand illustrations and social photography direction",
            },
          ],
        },
      ],
      descriptionSection: {
        title: "Description - App",
        paragraphs: [
          "In order to create the app design, I started off by exploring existing app designs and mobile-friendly UX/UI patterns, and highlighting the parts of the design that stood out. Then I went through several iterations for each wireframe and ended up choosing the ones that balanced out aesthetics and usability.",
        ],
        links: {
          design: {
            href: milesAndMealsAppDesign,
            label: "Link to design",
          },
          process: {
            href: milesAndMealsAppProcess,
            label: "Full process",
          },
        },
        screenshotRows: [
          {
            type: "triple",
            images: [
              {
                src: milesAndMealsAssets.appScreenshot1,
                alt: "Miles and Meals app onboarding screen one",
              },
              {
                src: milesAndMealsAssets.appScreenshot2,
                alt: "Miles and Meals app onboarding screen two",
              },
              {
                src: milesAndMealsAssets.appScreenshot3,
                alt: "Miles and Meals app onboarding screen three",
              },
            ],
          },
        ],
      },
    },
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

export function getProjectDocumentTitle(project: ProjectDetail) {
  const match = project.slug.match(/^project(\d+)$/);
  if (match) {
    return `Project ${match[1]} - ${project.title}`;
  }
  return project.title;
}

export function getProjectDescription(project: ProjectDetail) {
  if (project.caseStudy) {
    return project.caseStudy.summary;
  }

  const intro = project.blocks?.find((block) => block.type === "intro");
  return intro?.paragraphs[0] ?? `Case study for ${project.title}.`;
}
