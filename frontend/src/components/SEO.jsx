import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useContent } from '../context/ContentContext';

const SITE_URL = 'https://aryan-portfolio-s8il.onrender.com';
const DEFAULT_IMAGE = `${SITE_URL}/assets/profile/aryan_portrait.jpg`;

const ROUTE_META = {
  '/': {
    title: "Aryan Thakor | Senior Web Developer, CMS Specialist & Graphic Designer",
    description: "Official portfolio of Aryan Thakor - Senior Web Developer, CMS Specialist (React, Shopify, HubSpot) & Graphic Designer based in Ahmedabad, Gujarat, India. 48+ commercial websites delivered.",
    keywords: "Aryan Thakor, Aryan Thakor Portfolio, Senior Web Developer, CMS Specialist, Shopify Developer Ahmedabad, HubSpot Developer India, React Developer, Graphic Designer, Digiva Inc, Full Stack Developer Gujarat",
    image: DEFAULT_IMAGE,
    pageName: "Home",
    schemaType: "WebSite"
  },
  '/web-projects': {
    title: "48+ Commercial Web Projects | Aryan Thakor - Senior Web Developer",
    description: "Explore 48+ commercial websites, e-commerce stores, hotel portals, and enterprise web applications engineered by Aryan Thakor across React, Shopify, and HubSpot.",
    keywords: "Web Projects, Portfolio Projects, Shopify Stores, HubSpot Websites, React Web Applications, Client Websites, Commercial Projects Aryan Thakor",
    image: DEFAULT_IMAGE,
    pageName: "Web Projects",
    schemaType: "CollectionPage"
  },
  '/projects': {
    title: "48+ Commercial Web Projects | Aryan Thakor - Senior Web Developer",
    description: "Explore 48+ commercial websites, e-commerce stores, hotel portals, and enterprise web applications engineered by Aryan Thakor across React, Shopify, and HubSpot.",
    keywords: "Web Projects, Portfolio Projects, Shopify Stores, HubSpot Websites, React Web Applications, Client Websites, Commercial Projects Aryan Thakor",
    image: DEFAULT_IMAGE,
    pageName: "Web Projects",
    schemaType: "CollectionPage"
  },
  '/designs': {
    title: "Graphic Design & Brand Visuals | Aryan Thakor Portfolio",
    description: "Discover distinctive graphic design work by Aryan Thakor: brand identities, corporate logos, social media marketing campaigns, product manipulation, and creative UI graphics.",
    keywords: "Graphic Design Portfolio, Brand Identity, Logo Designer Ahmedabad, Photoshop Manipulation, Social Media Creatives, Arena Animation Aryan Thakor",
    image: `${SITE_URL}/assets/profile/aryan-designer.jpg`,
    pageName: "Graphic Designs",
    schemaType: "CollectionPage"
  },
  '/videos': {
    title: "Video Editing & Motion Graphics Portfolio | Aryan Thakor",
    description: "Watch cinematic video edits, viral short-form reels, commercial brand ads, sound design, and motion graphics produced by Aryan Thakor in Premiere Pro and After Effects.",
    keywords: "Video Editing Portfolio, Premiere Pro Video Editor, After Effects Motion Graphics, Instagram Reels Editor, YouTube Video Editor India, Commercial Ads Video Editing",
    image: `${SITE_URL}/assets/profile/aryan-designer.jpg`,
    pageName: "Video Editing",
    schemaType: "CollectionPage"
  },
  '/video-editing': {
    title: "Video Editing & Motion Graphics Portfolio | Aryan Thakor",
    description: "Watch cinematic video edits, viral short-form reels, commercial brand ads, sound design, and motion graphics produced by Aryan Thakor in Premiere Pro and After Effects.",
    keywords: "Video Editing Portfolio, Premiere Pro Video Editor, After Effects Motion Graphics, Instagram Reels Editor, YouTube Video Editor India, Commercial Ads Video Editing",
    image: `${SITE_URL}/assets/profile/aryan-designer.jpg`,
    pageName: "Video Editing",
    schemaType: "CollectionPage"
  },
  '/services': {
    title: "Web Engineering & Design Services | Aryan Thakor",
    description: "Professional web engineering and digital design services by Aryan Thakor: Custom React Web Architecture, Shopify & HubSpot Store Engineering, Technical SEO, and Brand Design.",
    keywords: "Web Development Services, Shopify Store Development, HubSpot CMS Services, Technical SEO Services, Graphic Design Services Ahmedabad, Hire Web Developer India",
    image: DEFAULT_IMAGE,
    pageName: "Services",
    schemaType: "Service"
  },
  '/about': {
    title: "About Aryan Thakor | Career Timeline, Experience & Skills",
    description: "Learn about Aryan Thakor's 4+ years professional journey as Senior Web Developer and Designer at Digiva Inc, key achievements, leadership, and technical toolkit.",
    keywords: "About Aryan Thakor, Web Developer Career, Digiva Inc Senior Developer, Developer Experience Ahmedabad, Skills Toolkit, Gujarat Web Developer",
    image: DEFAULT_IMAGE,
    pageName: "About",
    schemaType: "AboutPage"
  },
  '/credentials': {
    title: "Certifications & Experience Letter | Aryan Thakor",
    description: "Verified professional credentials of Aryan Thakor: Arena Animation Graphics Design certificate and Rowwat Technologies formal internship completion letter.",
    keywords: "Aryan Thakor Credentials, Arena Animation Certificate, Rowwat Technologies Experience Letter, Graphic Design Certificate, Verified Credentials",
    image: DEFAULT_IMAGE,
    pageName: "Credentials",
    schemaType: "ItemPage"
  },
  '/contact': {
    title: "Contact Aryan Thakor | Hire Senior Web Developer & Designer",
    description: "Connect with Aryan Thakor for custom web development, e-commerce stores, full-time opportunities, or graphic design projects. Quick response guaranteed.",
    keywords: "Contact Aryan Thakor, Hire Web Developer, Freelance Web Developer Ahmedabad, Contact Web Designer India, thakoraryan2002@gmail.com",
    image: DEFAULT_IMAGE,
    pageName: "Contact",
    schemaType: "ContactPage"
  },
  '/admin': {
    title: "Admin Studio & Security Portal | Aryan Thakor",
    description: "Secure CMS control center and authentication portal for Aryan Thakor Portfolio.",
    keywords: "Admin",
    image: DEFAULT_IMAGE,
    pageName: "Admin",
    schemaType: "ItemPage",
    noIndex: true
  }
};

export default function SEO() {
  const location = useLocation();
  const { content } = useContent();

  useEffect(() => {
    const pathname = location.pathname.toLowerCase().replace(/\/$/, '') || '/';
    const config = ROUTE_META[pathname] || ROUTE_META['/'];

    // Allow Admin CMS overrides for homepage if configured
    const isHome = pathname === '/';
    const title = (isHome && content?.seo?.siteTitle) ? content.seo.siteTitle : config.title;
    const description = (isHome && content?.seo?.metaDesc) ? content.seo.metaDesc : config.description;
    const keywords = (isHome && content?.seo?.keywords) ? content.seo.keywords : config.keywords;
    const currentUrl = `${SITE_URL}${pathname === '/' ? '' : pathname}`;
    const imageUrl = config.image || DEFAULT_IMAGE;

    // 1. Title
    document.title = title;

    // Helper: update or create meta tag
    const setMetaTag = (attrName, attrValue, contentValue) => {
      let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', contentValue);
    };

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);
    setMetaTag('name', 'robots', config.noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMetaTag('name', 'author', 'Aryan Thakor');

    // 3. OpenGraph Tags (Facebook, WhatsApp, LinkedIn)
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', currentUrl);
    setMetaTag('property', 'og:image', imageUrl);
    setMetaTag('property', 'og:image:width', '800');
    setMetaTag('property', 'og:image:height', '800');
    setMetaTag('property', 'og:image:alt', title);
    setMetaTag('property', 'og:type', isHome ? 'website' : 'article');
    setMetaTag('property', 'og:site_name', 'Aryan Thakor Portfolio');
    setMetaTag('property', 'og:locale', 'en_US');

    // 4. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', imageUrl);
    setMetaTag('name', 'twitter:url', currentUrl);

    // 5. Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

    // 6. Dynamic Route-Specific Schema.org JSON-LD (Breadcrumbs + Page Info)
    try {
      let script = document.getElementById('route-schema-jsonld');
      if (!script) {
        script = document.createElement('script');
        script.id = 'route-schema-jsonld';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }

      const breadcrumbList = {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": SITE_URL
          }
        ]
      };

      if (!isHome && config.pageName) {
        breadcrumbList.itemListElement.push({
          "@type": "ListItem",
          "position": 2,
          "name": config.pageName,
          "item": currentUrl
        });
      }

      const routeSchema = {
        "@context": "https://schema.org",
        "@graph": [
          breadcrumbList,
          {
            "@type": config.schemaType || "WebPage",
            "@id": `${currentUrl}#webpage`,
            "url": currentUrl,
            "name": title,
            "description": description,
            "isPartOf": {
              "@id": `${SITE_URL}/#website`
            },
            "about": {
              "@id": `${SITE_URL}/#person`
            },
            "inLanguage": "en"
          }
        ]
      };

      script.textContent = JSON.stringify(routeSchema);
    } catch (e) {
      console.debug('Route schema update skipped:', e);
    }

    // Scroll to top on page navigation
    window.scrollTo(0, 0);
  }, [location.pathname, content?.seo]);

  return null;
}
