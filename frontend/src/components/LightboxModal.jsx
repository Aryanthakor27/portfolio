import React from 'react';
import { X } from 'lucide-react';

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
          </div>
        </div>
      </div>
    </div>
  );
}
