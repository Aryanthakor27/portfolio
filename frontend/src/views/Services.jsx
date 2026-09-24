import React from 'react';
import { Globe, Layers, Figma, Palette, TrendingUp, Wand2, Code, Sparkles } from 'lucide-react';
import { Link } from '../compat/router';
import { useContent } from '../context/ContentContext';

const ICON_MAP = {
  wp: <Globe size={24} />,
  hub: <Layers size={24} />,
  fig: <Figma size={24} />,
  gd: <Palette size={24} />,
  seo: <TrendingUp size={24} />,
  ps: <Wand2 size={24} />,
  code: <Code size={24} />
};

export default function Services() {
  const { content } = useContent();
  const servicesList = content?.services || [];

  return (
    <div className="services-page container">
      <div className="page-header">
        <span className="section-badge">Full-Spectrum Capabilities</span>
        <h1 className="section-title">Professional Services</h1>
        <p className="section-desc">Comprehensive solutions bridging modern frontend code, CMS architecture, visual branding, and SEO performance.</p>
      </div>

      <div className="services-grid">
        {servicesList.map((service, idx) => (
          <div key={idx} className="service-card glass-card">
            <div className={`service-icon-wrap ${service.type}`}>
              {service.icon}
            </div>
            <h3>{service.title}</h3>
            <p>{service.desc}</p>
            <div className="service-tags">
              {service.tags.map((tag, tIdx) => (
                <span key={tIdx}>{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA Box */}
      <div className="glass-card service-cta-card">
        <h2 style={{ fontSize: '28px', marginBottom: '12px' }}>Have a project in mind?</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '600px', margin: '0 auto 24px auto' }}>
          Whether you need a custom Web Application, Shopify platform, a full visual brand identity, or SEO optimization, let's make it happen.
        </p>
        <Link to="/contact" className="btn btn-primary btn-lg">
          <span>Start A Conversation</span>
        </Link>
      </div>
    </div>
  );
}
