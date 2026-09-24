import React, { useState, useEffect, useMemo } from 'react';
import DesignCard from '../components/DesignCard';
import { designsData } from '../data/designsData';

export default function GraphicDesigns({ onPreviewDesign }) {
  const getStoredDesigns = () => {
    try {
      const deletedList = new Set(JSON.parse(localStorage.getItem('aryan_deleted_designs') || '[]'));
      const saved = localStorage.getItem('aryan_admin_designs');
      const base = saved ? JSON.parse(saved) : designsData;
      return base.filter(d => !deletedList.has(String(d.id).trim()));
    } catch {
      return designsData;
    }
  };

  const [designs, setDesigns] = useState(getStoredDesigns);
  const [activeCategory, setActiveCategory] = useState('all');

  const DEFAULT_DESIGN_CATS = [
    { id: 'logos', label: 'Logos & Branding' },
    { id: 'posts', label: 'Social Media Posts' },
    { id: 'manipulation', label: 'Product Manipulation' },
    { id: 'retouching', label: 'Photo Restoration & Retouch' }
  ];

  const [customCats, setCustomCats] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('aryan_custom_design_categories');
        if (saved) {
          const parsed = JSON.parse(saved);
          const filtered = parsed.filter(c => c.id !== 'video-editing' && c.id !== 'reels');
          if (filtered.length > 0) return filtered;
        }
      }
    } catch {}
    return DEFAULT_DESIGN_CATS;
  });

  useEffect(() => {
    const handleUpdate = () => {
      setDesigns(getStoredDesigns());
      try {
        if (typeof window !== 'undefined') {
          const saved = localStorage.getItem('aryan_custom_design_categories');
          if (saved) {
            const parsed = JSON.parse(saved);
            setCustomCats(parsed.filter(c => c.id !== 'video-editing' && c.id !== 'reels'));
          }
        }
      } catch {}
    };
    window.addEventListener('aryan_portfolio_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    fetch('/api/designs')
      .then(r => r.json())
      .then(res => {
        if (res.data && res.data.length > 0) {
          const deletedList = new Set(JSON.parse(localStorage.getItem('aryan_deleted_designs') || '[]'));
          const clean = res.data.filter(d => !deletedList.has(String(d.id).trim()));
          setDesigns(clean);
        }
      })
      .catch(() => {});

    return () => {
      window.removeEventListener('aryan_portfolio_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const categories = useMemo(() => [
    { id: 'all', label: `All Designs (${designs.length})` },
    ...customCats.map(c => ({
      id: c.id,
      label: `${c.label} (${designs.filter(d => d.category === c.id).length})`
    }))
  ], [designs, customCats]);

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
