import React from 'react';
import { Maximize2 } from 'lucide-react';

export default function DesignCard({ design, onPreview }) {
  return (
    <div className="project-card glass-card" data-category={design.category} onClick={() => onPreview(design)}>
      <div className="card-media">
        <img src={design.image} alt={design.title} loading="lazy" />
        <div className="media-overlay">
          <button className="preview-btn" title="View Full Preview">
            <Maximize2 size={18} />
          </button>
        </div>
      </div>

      <div className="card-details">
        <span className="category-tag">{design.tag}</span>
        <h3 className="card-title">{design.title}</h3>
        <p className="card-caption">{design.caption}</p>
      </div>
    </div>
  );
}
