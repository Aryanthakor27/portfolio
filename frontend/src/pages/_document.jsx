import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="description" content="Official portfolio of Aryan Thakor - Senior Web Developer, CMS Specialist (React, Shopify, HubSpot) & Graphic Designer based in Ahmedabad, Gujarat, India. 48+ commercial websites delivered." />
        <meta name="keywords" content="Aryan Thakor, Aryan Thakor Portfolio, Web Developer Ahmedabad, Senior Web Developer India, CMS Specialist, Shopify Developer, HubSpot Developer, Frontend Engineer, React Developer, Graphic Designer, Digiva Inc, UI/UX Designer" />
        <meta name="author" content="Aryan Thakor" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="IN-GJ" />
        <meta name="geo.placename" content="Ahmedabad" />
        <link rel="canonical" href="https://aryan-portfolio-s8il.onrender.com/" />
        <meta name="google-site-verification" content="zPCc_YvE4AP42JDT4FoDsNZmlL_QPDHeD_5UqkehpcU" />
        <meta name="theme-color" content="#080C14" />

        {/* Browser Favicons (Webix Brand Icon with Cache Busting) */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png?v=webix" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico?v=webix" />
        <link rel="shortcut icon" href="/favicon.ico?v=webix" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192x192.png?v=webix" />

        {/* Progressive Web App (PWA) & Mobile Installation Tags */}
        <link rel="manifest" href="/manifest.json?v=webix" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png?v=webix" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512x512.png?v=webix" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Aryan Thakor" />

        {/* Open Graph (Facebook, WhatsApp, LinkedIn Link Previews) */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aryan-portfolio-s8il.onrender.com/" />
        <meta property="og:site_name" content="Aryan Thakor Portfolio" />
        <meta property="og:title" content="Aryan Thakor | Senior Web Developer & Graphic Designer" />
        <meta property="og:description" content="Explore 48+ commercial web applications, Shopify/HubSpot client stores, and distinctive brand graphics engineered by Aryan Thakor." />
        <meta property="og:image" content="https://aryan-portfolio-s8il.onrender.com/assets/profile/aryan_portrait.jpg" />
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="800" />
        <meta property="og:image:alt" content="Aryan Thakor - Senior Web Developer & Graphic Designer" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter / X Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://aryan-portfolio-s8il.onrender.com/" />
        <meta name="twitter:title" content="Aryan Thakor | Senior Web Developer & Graphic Designer" />
        <meta name="twitter:description" content="Explore 48+ commercial web applications, CMS platforms, and brand graphics engineered by Aryan Thakor." />
        <meta name="twitter:image" content="https://aryan-portfolio-s8il.onrender.com/assets/profile/aryan_portrait.jpg" />

        {/* Google Structured Data / Rich Snippets (Schema.org JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": "https://aryan-portfolio-s8il.onrender.com/#person",
                  "name": "Aryan Thakor",
                  "jobTitle": "Senior Web Developer & Graphic Designer",
                  "worksFor": {
                    "@type": "Organization",
                    "name": "Digiva Inc"
                  },
                  "url": "https://aryan-portfolio-s8il.onrender.com/",
                  "image": "https://aryan-portfolio-s8il.onrender.com/assets/profile/aryan_portrait.jpg",
                  "sameAs": [
                    "https://www.linkedin.com/in/aryan-thakor",
                    "https://www.instagram.com/im__the_aryan",
                    "https://github.com/aryanthakor",
                    "https://wa.me/917698795009"
                  ],
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Ahmedabad",
                    "addressRegion": "Gujarat",
                    "addressCountry": "India"
                  },
                  "knowsAbout": [
                    "Web Development",
                    "React.js",
                    "Node.js",
                    "Next.js",
                    "Shopify Development",
                    "HubSpot CMS",
                    "Graphic Design",
                    "UI/UX Design",
                    "Video Editing",
                    "Motion Graphics",
                    "Search Engine Optimization (SEO)"
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://aryan-portfolio-s8il.onrender.com/#website",
                  "url": "https://aryan-portfolio-s8il.onrender.com/",
                  "name": "Aryan Thakor Portfolio",
                  "publisher": {
                    "@id": "https://aryan-portfolio-s8il.onrender.com/#person"
                  }
                },
                {
                  "@type": "ProfessionalService",
                  "name": "Aryan Thakor - Web Engineering & Design Services",
                  "url": "https://aryan-portfolio-s8il.onrender.com/",
                  "image": "https://aryan-portfolio-s8il.onrender.com/assets/profile/aryan_portrait.jpg",
                  "priceRange": "$$",
                  "telephone": "+917698795009",
                  "email": "thakoraryan2002@gmail.com",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Ahmedabad",
                    "addressRegion": "Gujarat",
                    "addressCountry": "India"
                  }
                }
              ]
            })
          }}
        />

        {/* Google Fonts Preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      <body className="dark-theme">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
