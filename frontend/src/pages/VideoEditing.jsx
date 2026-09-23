import React, { useState, useEffect, useMemo } from 'react';
import { Play, Search, SearchX, X, Film, Sparkles, ExternalLink, Clock, Eye, Layers } from 'lucide-react';
import { videoProjectsData } from '../data/videoProjectsData';

export default function VideoEditing() {
  const getStoredVideos = () => {
    try {
      const deletedList = new Set(JSON.parse(localStorage.getItem('aryan_deleted_videos') || '[]'));
      const saved = localStorage.getItem('aryan_admin_videos');
      const base = saved ? JSON.parse(saved) : videoProjectsData;
      return base.filter(v => !deletedList.has(String(v.id).trim()));
    } catch {
      return videoProjectsData;
    }
  };

  const [videos, setVideos] = useState(getStoredVideos);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);

  const [customCats, setCustomCats] = useState(() => {
    try {
      const saved = localStorage.getItem('aryan_custom_video_categories');
      return saved ? JSON.parse(saved) : [
        { id: 'reels', label: 'Reels & Shorts' },
        { id: 'commercials', label: 'Commercials & Ads' },
        { id: 'youtube', label: 'YouTube Edits' },
        { id: 'motion', label: 'Motion Graphics' },
        { id: 'promos', label: 'Brand Promos' }
      ];
    } catch {
      return [
        { id: 'reels', label: 'Reels & Shorts' },
        { id: 'commercials', label: 'Commercials & Ads' },
        { id: 'youtube', label: 'YouTube Edits' },
        { id: 'motion', label: 'Motion Graphics' },
        { id: 'promos', label: 'Brand Promos' }
      ];
    }
  });

  useEffect(() => {
    const handleUpdate = () => {
      setVideos(getStoredVideos());
      try {
        const saved = localStorage.getItem('aryan_custom_video_categories');
        if (saved) setCustomCats(JSON.parse(saved));
      } catch {}
    };
    window.addEventListener('aryan_portfolio_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    fetch('/api/videos')
      .then(r => r.json())
      .then(res => {
        if (res.data && res.data.length > 0) {
          const deletedList = new Set(JSON.parse(localStorage.getItem('aryan_deleted_videos') || '[]'));
          const clean = res.data.filter(v => !deletedList.has(String(v.id).trim()));
          setVideos(clean);
          localStorage.setItem('aryan_admin_videos', JSON.stringify(clean));
        }
      })
      .catch(() => {});

    return () => {
      window.removeEventListener('aryan_portfolio_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const categories = useMemo(() => {
    return [
      { id: 'all', label: 'All Projects', count: videos.length },
      ...customCats.map(cat => ({
        id: cat.id,
        label: cat.label,
        count: videos.filter(v => (v.category || '').toLowerCase() === cat.id.toLowerCase()).length
      }))
    ];
  }, [videos, customCats]);

  const filteredVideos = useMemo(() => {
    return videos.filter(video => {
      const matchesCategory = activeCategory === 'all' || (video.category || '').toLowerCase() === activeCategory.toLowerCase();
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q ||
        (video.title && video.title.toLowerCase().includes(q)) ||
        (video.client && video.client.toLowerCase().includes(q)) ||
        (video.tools && video.tools.toLowerCase().includes(q)) ||
        (video.desc && video.desc.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [videos, activeCategory, searchQuery]);

  // Convert regular YouTube / Vimeo / Drive link to an embeddable URL
  const getEmbedUrl = (url) => {
    if (!url) return '';
    try {
      if (url.includes('youtube.com/watch')) {
        const urlObj = new URL(url);
        const v = urlObj.searchParams.get('v');
        return v ? `https://www.youtube.com/embed/${v}?autoplay=1` : url;
      }
      if (url.includes('youtu.be/')) {
        const id = url.split('youtu.be/')[1]?.split('?')[0];
        return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : url;
      }
      if (url.includes('youtube.com/shorts/')) {
        const id = url.split('youtube.com/shorts/')[1]?.split('?')[0];
        return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : url;
      }
      if (url.includes('vimeo.com/')) {
        const id = url.split('vimeo.com/')[1]?.split('?')[0];
        return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : url;
      }
    } catch {}
    return url;
  };

  return (
    <div className="video-editing-page">
      <div className="container">
        {/* Header Banner */}
        <div className="page-header text-center">
          <div className="badge-wrapper">
            <span className="badge">
              <Film size={14} className="cyan-icon" />
              <span>Video Editing & Motion Portfolio</span>
            </span>
          </div>
          <h1 className="section-title">
            Cinematic Edits, Viral Reels <br />
            <span className="highlight">& Motion Graphics</span>
          </h1>
          <p className="section-desc">
            High-engagement short-form reels, commercial brand promos, YouTube retention-focused pacing, sound design, and color grading.
          </p>

          {/* Search bar */}
          <div className="web-search-bar" style={{ maxWidth: '520px', margin: '24px auto 0' }}>
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search videos by title, client, tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="search-clear-btn" aria-label="Clear Search">
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '28px 0 32px' }}>
          <div className="web-category-tabs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`web-tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span>{cat.label}</span>
                <span style={{ marginLeft: '6px', fontSize: '11px', opacity: 0.85, background: 'rgba(255, 255, 255, 0.12)', padding: '2px 7px', borderRadius: '12px' }}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Video Cards Grid */}
        {filteredVideos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon-wrap">
              <SearchX size={44} />
            </div>
            <h3>No video projects found</h3>
            <p>Try searching for a different keyword or category.</p>
            <button onClick={() => { setSearchQuery(''); setActiveCategory('all'); }} className="btn btn-secondary">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="videos-grid">
            {filteredVideos.map((video) => (
              <div key={video.id} className="video-card">
                <div
                  className="video-thumb-container"
                  onClick={() => setSelectedVideo(video)}
                  title={`Play ${video.title}`}
                >
                  <img
                    src={video.thumbnail || '/assets/profile/aryan-designer.jpg'}
                    alt={video.title}
                    className="video-thumbnail-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/profile/aryan-designer.jpg';
                    }}
                  />
                  <div className="video-play-overlay">
                    <div className="video-play-btn">
                      <Play size={24} fill="#FFFFFF" />
                    </div>
                  </div>
                  {video.duration && (
                    <span className="video-duration-badge">
                      <Clock size={11} /> {video.duration}
                    </span>
                  )}
                  {video.views && (
                    <span className="video-views-badge">
                      <Eye size={11} /> {video.views}
                    </span>
                  )}
                  <span className="video-category-tag">{video.category}</span>
                </div>

                <div className="video-details">
                  <h3 className="video-title">{video.title}</h3>
                  <div className="video-meta-row">
                    {video.client && (
                      <span>Client: <strong className="video-client-name">{video.client}</strong></span>
                    )}
                    {video.views && <span>{video.views}</span>}
                  </div>
                  {video.desc && <p className="video-desc">{video.desc}</p>}
                  {video.tools && (
                    <div className="video-tools-wrap">
                      <Layers size={13} />
                      <span className="video-tools-badge">{video.tools}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Modal Player */}
      {selectedVideo && (
        <div className="video-modal-overlay" onClick={() => setSelectedVideo(null)}>
          <div className="video-modal" onClick={(e) => e.stopPropagation()}>
            <div className="video-modal-header">
              <h3>{selectedVideo.title}</h3>
              <button
                onClick={() => setSelectedVideo(null)}
                className="close-btn"
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '6px' }}
                title="Close Video"
              >
                <X size={20} />
              </button>
            </div>

            <div className="video-player-container">
              {selectedVideo.videoUrl && selectedVideo.videoUrl.endsWith('.mp4') ? (
                <video
                  src={selectedVideo.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  style={{ width: '100%', height: '100%' }}
                />
              ) : selectedVideo.videoUrl ? (
                <iframe
                  src={getEmbedUrl(selectedVideo.videoUrl)}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94A3B8' }}>
                  No video preview available.
                </div>
              )}
            </div>

            <div style={{ padding: '16px 20px', background: '#0B0F19' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <span style={{ fontSize: '13px', color: '#94A3B8' }}>Tools: {selectedVideo.tools}</span>
                  {selectedVideo.client && (
                    <span style={{ fontSize: '13px', color: '#06B6D4', marginLeft: '12px' }}>Client: {selectedVideo.client}</span>
                  )}
                </div>
                {selectedVideo.videoUrl && (
                  <a
                    href={selectedVideo.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12.5px' }}
                  >
                    <span>Open External Source</span>
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
