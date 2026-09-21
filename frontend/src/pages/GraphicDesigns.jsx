import React, { useState, useEffect, useMemo } from 'react';
import DesignCard from '../components/DesignCard';
import { designsData } from '../data/designsData';

export default function GraphicDesigns({ onPreviewDesign }) {
  const [designs, setDesigns] = useState(designsData);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    fetch('/api/designs')
      .then(r => r.json())
      .then(res => {
        if (res.data && res.data.length > 0) {
          setDesigns(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const categories = useMemo(() => [
    { id: 'all', label: `All Designs (${designs.length})` },
    { id: 'logos', label: `Logos & Branding (${designs.filter(d => d.category === 'logos').length})` },
    { id: 'posts', label: `Social Media Posts (${designs.filter(d => d.category === 'posts').length})` },
    { id: 'manipulation', label: `Product Manipulation (${designs.filter(d => d.category === 'manipulation').length})` },
    { id: 'retouching', label: `Photo Restoration & Retouch (${designs.filter(d => d.category === 'retouching').length})` }
  ], [designs]);

  const filteredDesigns = useMemo(() => {
    return activeCategory === 'all' 
      ? designs 
      : designs.filter(d => d.category === activeCategory);
  }, [designs, activeCategory]);

  return (
    <div className="designs-page container">
      <div className="page-header">
        <span className="section-badge">Visual Art & Branding</span>
        <h1 className="section-title">Graphic Design & Creative Showcase</h1>
        <p className="section-desc">Logos with high-contrast studio backdrops, marketing social creatives, product photo manipulations, and vintage photo restorations.</p>
      </div>

      {/* Filter Tabs */}
      <div className="design-filters-wrap">
        <div className="filter-tabs">
          {categories.map(cat => (
            <button 
              key={cat.id}
              className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="projects-grid">
        {filteredDesigns.map(design => (
          <DesignCard key={design.id} design={design} onPreview={onPreviewDesign} />
        ))}
      </div>

      {/* Before / After Showcase */}
      <div className="sub-section-header">
        <span className="section-badge">Mastery in Photo Restoration</span>
        <h2 className="section-title">Restoration & Skin Retouching Highlights</h2>
      </div>

      <div className="glass-card restoration-showcase-box">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div style={{ background: '#0B0F19', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
            <img 
              src="/assets/retouching/Old-Photo-Restoration.jpg" 
              alt="Vintage photo restoration" 
              style={{ width: '100%', height: '320px', objectFit: 'contain', background: '#060911' }} 
            />
            <div style={{ padding: '20px', background: 'var(--bg-surface)' }}>
              <h4 style={{ fontSize: '17px', marginBottom: '6px' }}>Vintage Photo Restoration</h4>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>Full repair of physical tears, dust, surface grain, and historical portrait revitalization.</p>
            </div>
          </div>

          <div style={{ background: '#0B0F19', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
            <img 
              src="/assets/retouching/skin-retouch3.jpg" 
              alt="Skin retouching" 
              style={{ width: '100%', height: '320px', objectFit: 'contain', background: '#060911' }} 
            />
            <div style={{ padding: '20px', background: 'var(--bg-surface)' }}>
              <h4 style={{ fontSize: '17px', marginBottom: '6px' }}>High-End Skin Retouching</h4>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>Advanced frequency separation retaining organic skin texture with polished tone curves.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
