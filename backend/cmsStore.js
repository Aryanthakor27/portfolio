import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORE_DIR = path.join(__dirname, "data", "store");
const CMS_FILE = path.join(STORE_DIR, "siteContent.json");

export const DEFAULT_SITE_CONTENT = {
  hero: {
    greeting: "Hi, I'm",
    name: "Aryan Thakor",
    roleBadge: "Sr. Web Developer & Graphic Designer • Ahmedabad, India",
    headline: "Hi, I'm Aryan Thakor",
    tagline: "Building High-Performance Websites & Distinct Brand Visuals",
    desc: "Senior Web Developer, CMS Specialist & Graphic Designer with 3+ years of hands-on expertise building commercial client web apps across Modern Web Architecture, Shopify, HubSpot, custom frontend engineering, and high-impact visual branding.",
    primaryCtaText: "Explore Web Projects",
    secondaryCtaText: "Get In Touch",
    stats: {
      websitesCount: "48+",
      websitesLabel: "Commercial Websites Delivered",
      experienceYears: "3+",
      experienceLabel: "Years Development Experience",
      deliveryRate: "100%",
      deliveryLabel: "On-Time Sprint Delivery",
      satisfactionRate: "99.8%",
      satisfactionLabel: "Client Satisfaction Rate"
    }
  },
  about: {
    badge: "Career Profile",
    title: "About & Experience Timeline",
    desc: "Senior Web Developer and Designer with hands-on expertise in full-cycle web engineering, CMS platforms, and team leadership.",
    currentRole: "Sr. Web Developer, SEO Executive & Graphics Designer",
    currentCompany: "Digiva Inc (formerly Rowwat Technologies) • Ahmedabad, India",
    currentPeriod: "08/2024 — Present",
    currentBullets: [
      "Team Leadership: Lead and coordinate the web development team, managing sprint workflows and ensuring timely project delivery across client portals.",
      "Web & CMS Engineering: Develop and maintain responsive, high-performance web applications using Modern JavaScript, Shopify, HubSpot, custom frontends, and scalable architecture.",
      "Custom CMS Engineering: Implement bespoke CMS logic, headless integrations, custom plugins, and AI-assisted workflows for rapid optimization.",
      "SEO Strategy: Execute On-Page and Technical SEO strategies using Rank Math, Yoast SEO, Google Search Console, and Analytics.",
      "Creative Design: Design engaging graphics, social media campaigns, brand materials, and interactive UI prototypes in Figma and Adobe Suite."
    ],
    internshipRole: "Web & Frontend Developer (React JS) Intern",
    internshipCompany: "Rowwat Technologies (now Digiva Inc) • Ratnakar Nine Square, Ahmedabad",
    internshipPeriod: "01/2024 — 08/2024",
    internshipBullets: [
      "Completed intensive industry project training in modern JavaScript, React JS, HTML5, CSS3, and CMS architectures under Project Manager Mr. Jay Senjaliya.",
      "Assisted senior engineers in engineering and maintaining client websites, responsive mobile viewports, cross-browser compatibility, and speed optimization.",
      "Implemented on-page SEO meta tags, structured schema markup, and rapid UI bug resolution.",
      "Awarded official Letter of Internship Completion & Experience verification from CEO Rajni Patel at Rowwat Technologies."
    ]
  },
  services: [
    {
      id: "web-arch",
      title: "Custom Web & CMS Architecture",
      desc: "Building scalable, responsive modern web applications. Custom hooks, component architectures, plugin integrations, dynamic portals, and speed optimization using modern best practices.",
      tags: ["Custom Architecture", "Dynamic Portals", "E-Commerce", "Speed Opt", "Security"]
    },
    {
      id: "hub",
      title: "HubSpot & Shopify Development",
      desc: "Designing and developing high-converting Shopify stores, product templates, checkout flows, and custom HubSpot landing pages with CRM workflow synchronization.",
      tags: ["Shopify Stores", "HubSpot Pages", "Liquid", "CRM Sync", "Conversion Opt"]
    },
    {
      id: "fig",
      title: "UI/UX & Web Design",
      desc: "Creating wireframes, interactive prototypes, and design systems in Figma. Crafting visually stunning, user-centric interfaces tailored for modern desktop and mobile viewports.",
      tags: ["Figma", "Design Systems", "Auto-Layout", "Prototyping", "Wireframes"]
    },
    {
      id: "gd",
      title: "Graphic & Brand Identity Design",
      desc: "Developing unique logos, brand guideline stationery, social media ad creatives, marketing banners, and print assets using Adobe Illustrator, Photoshop, InDesign & CorelDRAW.",
      tags: ["Logos", "Social Creatives", "Illustrator", "CorelDRAW", "Stationery"]
    },
    {
      id: "seo",
      title: "On-Page & Technical SEO",
      desc: "Boosting organic search rankings with schema markup, keyword optimization, Google Search Console, Rank Math, Yoast SEO, site architecture audit, and core web vitals speed tuning.",
      tags: ["Rank Math", "Search Console", "Yoast", "Speed Audit", "Schema"]
    },
    {
      id: "ps",
      title: "Photo Manipulation & Restoration",
      desc: "High-end composite digital artwork for commercial products, realistic visual manipulation, studio frequency separation skin retouching, and damaged historical photo revitalization.",
      tags: ["Composites", "Skin Retouch", "Photo Restore", "Photoshop", "Grading"]
    }
  ],
  contact: {
    badge: "Get In Touch",
    title: "Let's Discuss Your Next Project",
    desc: "Available for Senior Developer roles, custom CMS/Shopify builds, brand identity design, and SEO growth consulting.",
    email: "thakoraryan2002@gmail.com",
    phone: "+91 76987 95009",
    location: "Ahmedabad, Gujarat, India",
    linkedin: "https://www.linkedin.com/in/aryan-thakor",
    instagram: "https://www.instagram.com/im__the_aryan",
    whatsapp: "https://wa.me/917698795009",
    github: "https://github.com/aryanthakor",
    availability: "Available for Senior Roles & Commercial Contracts",
    socials: [
      {
        id: "linkedin",
        platform: "LinkedIn",
        url: "https://www.linkedin.com/in/aryan-thakor",
        enabled: true
      },
      {
        id: "instagram",
        platform: "Instagram",
        url: "https://www.instagram.com/im__the_aryan",
        enabled: true
      },
      {
        id: "github",
        platform: "GitHub",
        url: "https://github.com/aryanthakor",
        enabled: true
      },
      {
        id: "whatsapp",
        platform: "WhatsApp",
        url: "https://wa.me/917698795009",
        enabled: true
      }
    ]
  },
  seo: {
    siteTitle: "Aryan Thakor | Sr. Web Developer, CMS Specialist & Graphic Designer",
    metaDesc: "Portfolio of Aryan Thakor - Senior Web Developer, CMS Specialist (Modern Web, Shopify, HubSpot) & Graphic Designer based in Ahmedabad, India. 48+ Commercial Websites Delivered.",
    keywords: "Aryan Thakor, Web Developer, Modern Web, Shopify, Graphic Designer, Ahmedabad, MERN Stack"
  }
};

export async function initCMS() {
  await fs.mkdir(STORE_DIR, { recursive: true });
  try {
    await fs.access(CMS_FILE);
  } catch {
    await fs.writeFile(CMS_FILE, JSON.stringify(DEFAULT_SITE_CONTENT, null, 2), "utf8");
  }
}

export async function getContent() {
  await initCMS();
  const raw = await fs.readFile(CMS_FILE, "utf8");
  return JSON.parse(raw);
}

export async function updateSection(section, data) {
  const current = await getContent();
  current[section] = {
    ...(current[section] || {}),
    ...data
  };
  await fs.writeFile(CMS_FILE, JSON.stringify(current, null, 2), "utf8");
  return current[section];
}

export async function updateAllContent(newContent) {
  await initCMS();
  await fs.writeFile(CMS_FILE, JSON.stringify(newContent, null, 2), "utf8");
  return newContent;
}
