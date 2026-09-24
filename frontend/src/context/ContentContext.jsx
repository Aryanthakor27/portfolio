import React, { createContext, useContext, useState, useEffect } from 'react';

const DEFAULT_CONTENT = {
  hero: {
    greeting: "Hi, I'm",
    name: "Aryan Thakor",
    roleBadge: "Sr. Web Developer & Graphic Designer • Ahmedabad, India",
    headline: "Hi, I'm Aryan Thakor",
    tagline: "Building High-Performance Websites & Distinct Brand Visuals",
    desc: "Senior Web Developer, CMS Specialist & Graphic Designer with 3+ years of hands-on expertise building commercial client web apps across Modern Web Architecture, Shopify, HubSpot, custom frontend engineering, and high-impact visual branding.",
    primaryCtaText: "Explore Web Projects",
    secondaryCtaText: "Get In Touch",
    profileImage: "/assets/profile/aryan_portrait.jpg",
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
  branding: {
    logoImage: "",
    logoText: "ARYAN",
    favicon: "",
    appIcon: ""
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

const ContentContext = createContext();

export function ContentProvider({ children }) {
  const [content, setContent] = useState(() => {
    try {
      const saved = localStorage.getItem('aryan_portfolio_content');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_CONTENT,
          ...parsed,
          hero: { ...DEFAULT_CONTENT.hero, ...(parsed.hero || {}) },
          branding: { ...DEFAULT_CONTENT.branding, ...(parsed.branding || {}) },
          about: { ...DEFAULT_CONTENT.about, ...(parsed.about || {}) },
          contact: { ...DEFAULT_CONTENT.contact, ...(parsed.contact || {}) },
          seo: { ...DEFAULT_CONTENT.seo, ...(parsed.seo || {}) },
          services: parsed.services && parsed.services.length > 0 ? parsed.services : DEFAULT_CONTENT.services
        };
      }
    } catch {}
    return DEFAULT_CONTENT;
  });

  const [loading, setLoading] = useState(true);

  // Dynamic Browser Tab Favicon & PWA App Icon Updater
  useEffect(() => {
    const fav = content?.branding?.favicon;
    if (fav) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = fav;
    }

    const appIcon = content?.branding?.appIcon;
    if (appIcon) {
      const appleIcons = document.querySelectorAll("link[rel='apple-touch-icon']");
      if (appleIcons.length > 0) {
        appleIcons.forEach(el => { el.href = appIcon; });
      } else {
        const appleLink = document.createElement('link');
        appleLink.rel = 'apple-touch-icon';
        appleLink.href = appIcon;
        document.getElementsByTagName('head')[0].appendChild(appleLink);
      }

      // Update dynamic manifest blob so Chrome installs using the custom app icon
      try {
        const customManifest = {
          short_name: "Aryan Thakor",
          name: "Aryan Thakor | Portfolio",
          description: "Aryan Thakor - Senior Web Developer, CMS Specialist & Graphic Designer",
          id: "/",
          start_url: "/?source=pwa",
          scope: "/",
          display: "standalone",
          display_override: ["window-controls-overlay", "standalone", "minimal-ui"],
          orientation: "portrait-primary",
          background_color: "#080C14",
          theme_color: "#080C14",
          categories: ["portfolio", "business", "productivity"],
          icons: [
            { src: appIcon, sizes: "192x192", type: "image/png", purpose: "any" },
            { src: appIcon, sizes: "512x512", type: "image/png", purpose: "any" },
            { src: appIcon, sizes: "512x512", type: "image/png", purpose: "maskable" }
          ]
        };
        const blob = new Blob([JSON.stringify(customManifest)], { type: 'application/json' });
        const manifestURL = URL.createObjectURL(blob);
        let manifestLink = document.querySelector("link[rel='manifest']");
        if (manifestLink) {
          manifestLink.href = manifestURL;
        }
      } catch (e) {
        console.debug('Dynamic manifest injection skipped:', e);
      }
    }
  }, [content?.branding?.favicon, content?.branding?.appIcon]);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const data = await res.json();
        setContent(prev => {
          const merged = {
            ...prev,
            ...data,
            hero: { ...prev.hero, ...(data.hero || {}) },
            branding: { ...prev.branding, ...(data.branding || {}) },
            about: { ...prev.about, ...(data.about || {}) },
            contact: { ...prev.contact, ...(data.contact || {}) },
            seo: { ...prev.seo, ...(data.seo || {}) },
            services: data.services && data.services.length > 0 ? data.services : prev.services
          };
          try {
            localStorage.setItem('aryan_portfolio_content', JSON.stringify(merged));
          } catch {}
          return merged;
        });
      }
    } catch {
      // Offline / Static fallback: content already loaded from localStorage or DEFAULT_CONTENT
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const updateSectionContent = async (section, data) => {
    let updatedContentState;

    setContent(prev => {
      const updatedSection = {
        ...(prev[section] || {}),
        ...data
      };
      updatedContentState = {
        ...prev,
        [section]: updatedSection
      };
      try {
        localStorage.setItem('aryan_portfolio_content', JSON.stringify(updatedContentState));
      } catch (err) {
        console.warn('localStorage save warning:', err);
      }
      return updatedContentState;
    });

    try {
      const res = await fetch(`/api/content/${section}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('aryan_admin_token') || ''}`
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const result = await res.json();
        return { success: true, message: result.message };
      }
    } catch {
      // Offline fallback success
    }
    return { success: true, message: 'Saved successfully.' };
  };

  return (
    <ContentContext.Provider value={{ content, loading, refreshContent: fetchContent, updateSectionContent }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}
