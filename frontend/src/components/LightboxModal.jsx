import React from 'react';
import { X, ExternalLink, Play } from 'lucide-react';

export default function LightboxModal({ item, onClose }) {
  if (!item) return null;

  const isLogo = item.category === 'logos' || item.image?.includes('logos/') || item.tag?.toLowerCase().includes('brand');

  return (
    <div className="lightbox-modal">
      <div className="lightbox-backdrop" onClick={onClose}></div>
      <div className="lightbox-content glass-card">
        <button className="lightbox-close" onClick={onClose} title="Close Preview">
          <X size={18} />
        </button>

        <div className={`lightbox-body ${isLogo ? 'logo-mode' : ''}`}>
          <img src={item.image} alt={item.title} />
          <div className="lightbox-info">
            <span className="category-tag">{item.tag}</span>
            <h3>{item.title}</h3>
            <p>{item.caption || item.desc}</p>
            {item.videoUrl && (
              <div style={{ marginTop: '16px' }}>
                <a
                  href={item.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Play size={14} fill="#FFFFFF" />
                  <span>Watch Video / Demo</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
