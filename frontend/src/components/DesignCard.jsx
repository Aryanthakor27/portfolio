import React from 'react';
import { Maximize2, Play } from 'lucide-react';

export default function DesignCard({ design, onPreview }) {
  const isVideo = Boolean(design.videoUrl || design.category === 'video-editing' || design.category === 'reels');

  return (
    <div className="project-card glass-card" data-category={design.category} onClick={() => onPreview(design)}>
      <div className="card-media" style={{ position: 'relative' }}>
        <img src={design.image} alt={design.title} loading="lazy" />
        {isVideo && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(230, 57, 70, 0.92)',
            color: '#FFFFFF',
            borderRadius: '50px',
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            zIndex: 3,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)',
            letterSpacing: '0.02em',
            textTransform: 'uppercase'
          }}>
            <Play size={10} fill="#FFFFFF" /> Video
          </div>
        )}
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
