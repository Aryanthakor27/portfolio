import React, { useState, useEffect, useMemo } from 'react';
import { Search, SearchX } from 'lucide-react';
import WebsiteCard from '../components/WebsiteCard';
import { websitesData } from '../data/websitesData';

export default function WebProjects() {
  const getStoredWebsites = () => {
    try {
      const deletedList = new Set(JSON.parse(localStorage.getItem('aryan_deleted_websites') || '[]'));
      const saved = localStorage.getItem('aryan_admin_websites');
      const base = saved ? JSON.parse(saved) : websitesData;
      return base.filter(s => !deletedList.has(String(s.id).trim()));
    } catch {
      return websitesData;
    }
  };

  const [websites, setWebsites] = useState(getStoredWebsites);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [customCats, setCustomCats] = useState(() => {
    try {
      const saved = localStorage.getItem('aryan_custom_web_categories');
      return saved ? JSON.parse(saved) : [
        { id: 'ecommerce', label: 'E-Commerce & Beauty' },
        { id: 'hospitality', label: 'Hotels & Resorts' },
        { id: 'corporate', label: 'Corporate, Tech & Finance' },
        { id: 'industrial', label: 'Industrial & Logistics' },
        { id: 'health', label: 'Healthcare & Lifestyle' }
      ];
    } catch {
      return [
        { id: 'ecommerce', label: 'E-Commerce & Beauty' },
        { id: 'hospitality', label: 'Hotels & Resorts' },
        { id: 'corporate', label: 'Corporate, Tech & Finance' },
        { id: 'industrial', label: 'Industrial & Logistics' },
        { id: 'health', label: 'Healthcare & Lifestyle' }
      ];
    }
  });

  useEffect(() => {
    const handleUpdate = () => {
      setWebsites(getStoredWebsites());
      try {
        const saved = localStorage.getItem('aryan_custom_web_categories');
        if (saved) setCustomCats(JSON.parse(saved));
      } catch {}
    };
    window.addEventListener('aryan_portfolio_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    fetch('/api/websites')
      .then(r => r.json())
      .then(res => {
        if (res.data && res.data.length > 0) {
          const deletedList = new Set(JSON.parse(localStorage.getItem('aryan_deleted_websites') || '[]'));
          const clean = res.data.filter(s => !deletedList.has(String(s.id).trim()));
          setWebsites(clean);
        }
      })
      .catch(() => {});

    return () => {
      window.removeEventListener('aryan_portfolio_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const categories = useMemo(() => [
    { id: 'all', label: `All Websites (${websites.length})` },
    ...customCats.map(c => ({
      id: c.id,
      label: `${c.label} (${websites.filter(s => s.category === c.id).length})`
    }))
  ], [websites, customCats]);

  const filteredWebsites = useMemo(() => {
    return websites.filter(site => {
      const matchesCategory = activeCategory === 'all' || site.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || 
        (site.name && site.name.toLowerCase().includes(q)) || 
        (site.domain && site.domain.toLowerCase().includes(q)) || 
        (site.desc && site.desc.toLowerCase().includes(q)) ||
        (site.tech && site.tech.toLowerCase().includes(q));
      
      return matchesCategory && matchesSearch;
    });
  }, [websites, activeCategory, searchQuery]);

  return (
    <div className="web-projects-page container">
      <div className="page-header">
        <span className="section-badge">Client Track Record</span>
        <h1 className="section-title">{websites.length}+ Developed & Managed Websites</h1>
        <p className="section-desc">Live production web applications engineered across Modern Web Architecture, Shopify, HubSpot, custom frontends, and technical SEO campaigns.</p>
      </div>

      {/* Filter & Search Bar */}
      <div className="web-filter-container">
        <div className="web-search-bar">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search websites by name, category, or industry (e.g., hotel, beauty, finance)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="web-category-tabs">
          {categories.map(cat => (
            <button 
              key={cat.id}
              className={`web-tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredWebsites.length > 0 ? (
        <div className="websites-grid">
          {filteredWebsites.map(site => (
            <WebsiteCard key={site.id} website={site} />
          ))}
        </div>
      ) : (
        <div className="no-results-box glass-card">
          <SearchX size={48} />
          <h3 style={{ fontSize: '20px', marginTop: '12px' }}>No matching websites found</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Try searching with another keyword or select "All Websites".</p>
        </div>
      )}
    </div>
  );
}
