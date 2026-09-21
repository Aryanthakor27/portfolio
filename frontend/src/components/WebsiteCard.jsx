import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function WebsiteCard({ website }) {
  return (
    <div className="website-card glass-card" data-web-cat={website.category}>
      <div className="web-card-top">
        <span className={`web-badge ${website.category}`}>{website.badge}</span>
        <span className="tech-tag">{website.tech}</span>
      </div>

      <h3 className="web-name">{website.name}</h3>
      <p className="web-url-text">{website.domain}</p>
      <p className="web-desc">{website.desc}</p>

      <div className="web-card-footer">
        <a 
          href={website.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="visit-link-btn"
        >
          <span>Visit Live Site</span> <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}
