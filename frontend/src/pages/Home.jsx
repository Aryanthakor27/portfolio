import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Globe, FileText, Phone, Code, ShoppingBag, Layout, Figma, Palette, TrendingUp, Award, ArrowRight } from 'lucide-react';
import WebsiteCard from '../components/WebsiteCard';
import DesignCard from '../components/DesignCard';
import { websitesData } from '../data/websitesData';
import { designsData } from '../data/designsData';
import { useContent } from '../context/ContentContext';
import { downloadResume } from '../utils/downloadResume';

export default function Home({ onPreviewDesign }) {
  const { content } = useContent();
  const { hero, contact } = content;

  const [websites, setWebsites] = useState(() => {
    try {
      const saved = localStorage.getItem('aryan_admin_websites');
      return saved ? JSON.parse(saved) : websitesData;
    } catch {
      return websitesData;
    }
  });
  const [designs, setDesigns] = useState(() => {
    try {
      const saved = localStorage.getItem('aryan_admin_designs');
      return saved ? JSON.parse(saved) : designsData;
    } catch {
      return designsData;
    }
  });

  useEffect(() => {
    fetch('/api/websites')
      .then(r => r.json())
      .then(res => {
        if (res.data && res.data.length > 0) setWebsites(res.data);
      })
      .catch(() => {});

    fetch('/api/designs')
      .then(r => r.json())
      .then(res => {
        if (res.data && res.data.length > 0) setDesigns(res.data);
      })
      .catch(() => {});
  }, []);

  const featuredWebsites = websites.slice(0, 6);
  const featuredDesigns = designs.slice(0, 6);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-wrapper">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="status-indicator"></span>
              <span>{hero?.roleBadge || "Sr. Web Developer & Graphic Designer • Ahmedabad, India"}</span>
            </div>

            <h1 className="hero-title">
              Hi, I'm <span className="gradient-text">{hero?.name || "Aryan Thakor"}</span><br />
              {hero?.tagline || "Building High-Impact Web & Brand Solutions."}
            </h1>

            <p className="hero-subtitle">
              {hero?.desc || "Senior Web Developer, Team Lead & Visual Designer at Digiva Inc (formerly Rowwat Technologies). Proven track record of engineering & delivering 48+ live client websites."}
            </p>

            {/* Core Badges */}
            <div className="role-tags-wrap">
              <span className="role-tag"><Code size={14} /> Custom CMS & Web Specialist</span>
              <span className="role-tag"><ShoppingBag size={14} /> Shopify Developer</span>
              <span className="role-tag"><Layout size={14} /> HubSpot Developing</span>
              <span className="role-tag"><Figma size={14} /> UI/UX & Web Design</span>
              <span className="role-tag"><Palette size={14} /> Graphic & Brand Design</span>
              <span className="role-tag"><TrendingUp size={14} /> Technical SEO Lead</span>
            </div>

            <div className="hero-actions">
              <Link to="/web-projects" className="btn btn-primary">
                <Globe size={16} />
                <span>{hero?.primaryCtaText || "Explore 48+ Websites"}</span>
              </Link>
              <a 
                href="/api/resume/download" 
                download="Aryan_Thakor_Resume.pdf" 
                onClick={(e) => { e.preventDefault(); downloadResume('Aryan_Thakor_Resume.pdf'); }} 
                className="btn btn-secondary"
                title="Download Aryan Thakor Resume"
              >
                <FileText size={16} />
                <span>Download CV</span>
              </a>
              <a href={contact?.whatsapp || "https://wa.me/919313287588"} target="_blank" rel="noopener noreferrer" className="btn btn-secondary whatsapp-btn">
                <Phone size={16} />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Stats Row */}
            <div className="stats-row">
              <div className="stat-item">
                <span className="stat-number">{hero?.stats?.websitesCount || `${websites.length}+`}</span>
                <span className="stat-label">{hero?.stats?.websitesLabel || "Live Sites Delivered"}</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">{hero?.stats?.experienceYears || "4+"}</span>
                <span className="stat-label">{hero?.stats?.experienceLabel || "Years Experience"}</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">{hero?.stats?.deliveryRate || "100%"}</span>
                <span className="stat-label">{hero?.stats?.deliveryLabel || "On-Time Delivery"}</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">{hero?.stats?.satisfactionRate || "99.8%"}</span>
                <span className="stat-label">{hero?.stats?.satisfactionLabel || "Client Rating"}</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="hero-visual">
            <div className="ambient-glow"></div>
            <div className="profile-card glass-card">
              <div className="card-inner">
                <img
                  src={hero?.profileImage || "/assets/profile/aryan_portrait.jpg"}
                  alt={hero?.name || "Aryan Thakor Senior Web Developer"}
                  className="profile-img"
                />
                <div className="profile-overlay-badge">
                  <Award size={20} color="#A855F7" />
                  <div>
                    <h4>{hero?.name || "Aryan Thakor"}</h4>
                    <p>{hero?.roleBadge ? hero.roleBadge.split('•')[0].trim() : "Web Developer • CMS & UI Designer"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Web Projects Preview */}
      <section className="home-section">
        <div className="container">
          <div className="page-header">
            <span className="section-badge">Live Client Portfolio</span>
            <h2 className="section-title">Featured Client Websites</h2>
            <p className="section-desc">A selection of recently engineered and optimized enterprise web platforms.</p>
          </div>

          <div className="websites-grid">
            {featuredWebsites.map(site => (
              <WebsiteCard key={site.id} website={site} />
            ))}
          </div>

          <div className="section-cta-wrap">
            <Link to="/web-projects" className="btn btn-cyan btn-lg">
              <span>View All 48+ Client Websites</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Graphic Designs Preview */}
      <section className="home-section">
        <div className="container">
          <div className="page-header">
            <span className="section-badge">Visual Art & Branding</span>
            <h2 className="section-title">Graphic Design & Creative Works</h2>
            <p className="section-desc">Logos, branding stationery, social media creatives & photo manipulations.</p>
          </div>

          <div className="projects-grid">
            {featuredDesigns.map(design => (
              <DesignCard key={design.id} design={design} onPreview={onPreviewDesign} />
            ))}
          </div>

          <div className="section-cta-wrap">
            <Link to="/designs" className="btn btn-primary btn-lg">
              <span>Explore Full Design Portfolio</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
