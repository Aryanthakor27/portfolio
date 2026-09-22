import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ROUTE_META = {
  '/': {
    title: "Aryan Thakor | Senior Web Developer, CMS Specialist & Graphic Designer",
    description: "Explore the official portfolio of Aryan Thakor - Senior Web Developer, CMS Specialist (React, Shopify, HubSpot) & Graphic Designer based in Ahmedabad, Gujarat, India. 48+ commercial client web apps delivered."
  },
  '/projects': {
    title: "48+ Commercial Web Projects | Aryan Thakor - Senior Web Developer",
    description: "Browse 48+ live commercial websites, e-commerce stores, hotel booking portals, and corporate web platforms engineered by Aryan Thakor across Shopify, HubSpot, and custom React architectures."
  },
  '/web-projects': {
    title: "48+ Commercial Web Projects | Aryan Thakor - Senior Web Developer",
    description: "Browse 48+ live commercial websites, e-commerce stores, hotel booking portals, and corporate web platforms engineered by Aryan Thakor across Shopify, HubSpot, and custom React architectures."
  },
  '/designs': {
    title: "Graphic Design & Brand Visuals | Aryan Thakor Portfolio",
    description: "View graphic design portfolio of Aryan Thakor featuring brand identity logos, social media marketing campaigns, product manipulation, and creative UI graphics."
  },
  '/services': {
    title: "Web Engineering & Design Services | Aryan Thakor",
    description: "Professional services offered by Aryan Thakor: Custom Web Architecture, Shopify & HubSpot store development, On-Page/Technical SEO, and High-Impact Graphic Design."
  },
  '/about': {
    title: "About Aryan Thakor | Career Timeline & Experience",
    description: "Learn about Aryan Thakor's 4+ years journey as Senior Web Developer and Designer at Digiva Inc, professional accomplishments, leadership, and technical toolkit."
  },
  '/credentials': {
    title: "Certifications & Experience Letter | Aryan Thakor",
    description: "Verified professional certificates including Arena Animation Graphics Design credential and official Rowwat Technologies internship completion letter for Aryan Thakor."
  },
  '/contact': {
    title: "Contact Aryan Thakor | Hire Senior Web Developer & Designer",
    description: "Get in touch with Aryan Thakor for freelance web development, custom Shopify/HubSpot projects, full-time opportunities, or graphic design inquiries. Based in Ahmedabad, India."
  },
  '/admin': {
    title: "Admin Studio & Security Portal | Aryan Thakor",
    description: "Secure CMS control center and authentication portal for Aryan Thakor Portfolio."
  }
};

export default function SEO() {
  const location = useLocation();

  useEffect(() => {
    const currentMeta = ROUTE_META[location.pathname] || {
      title: "Aryan Thakor | Senior Web Developer & Graphic Designer",
      description: "Official portfolio of Aryan Thakor - Senior Web Developer & Graphic Designer. 48+ commercial websites delivered."
    };

    // Update document title
    document.title = currentMeta.title;

    // Update meta description
    let descTag = document.querySelector('meta[name="description"]');
    if (descTag) {
      descTag.setAttribute('content', currentMeta.description);
    }

    // Update OpenGraph Title & Description
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', currentMeta.title);
    }

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', currentMeta.description);
    }

    // Update OpenGraph URL & Canonical
    const currentUrl = `https://aryan-portfolio-s8il.onrender.com${location.pathname}`;
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', currentUrl);
    }

    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', currentUrl);
    }

    // Scroll to top on page navigation
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}
