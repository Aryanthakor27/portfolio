import React, { useState, useEffect } from 'react';
import { Award, FileCheck, ExternalLink, Maximize2, GraduationCap, ShieldCheck } from 'lucide-react';
import { credentialsData } from '../data/credentialsData';

export default function Credentials({ onPreviewLetter }) {
  const getStoredCredentials = () => {
    try {
      const deletedList = new Set(JSON.parse(localStorage.getItem('aryan_deleted_credentials') || '[]'));
      const saved = localStorage.getItem('aryan_admin_credentials');
      const base = saved ? JSON.parse(saved) : credentialsData;
      return base.filter(c => !deletedList.has(String(c.id).trim()));
    } catch {
      return credentialsData;
    }
  };

  const [credentials, setCredentials] = useState(getStoredCredentials);

  useEffect(() => {
    const handleUpdate = () => {
      setCredentials(getStoredCredentials());
    };
    window.addEventListener('aryan_portfolio_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    fetch('/api/credentials')
      .then(r => r.json())
      .then(res => {
        if (res.data && res.data.length > 0) {
          const deletedList = new Set(JSON.parse(localStorage.getItem('aryan_deleted_credentials') || '[]'));
          const clean = res.data.filter(c => !deletedList.has(String(c.id).trim()));
          setCredentials(clean);
        }
      })
      .catch(() => {});

    return () => {
      window.removeEventListener('aryan_portfolio_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Find previewable image letters
  const featuredDocument = credentials.find(c => c.previewImage || (c.fileUrl && !c.fileUrl.toLowerCase().endsWith('.pdf')));

  return (
    <div className="credentials-page container">
      <div className="page-header">
        <span className="section-badge">Verified Credentials</span>
        <h1 className="section-title">Certifications & Experience Letters ({credentials.length})</h1>
        <p className="section-desc">Certified training in Graphic Design from Arena Animation, official Frontend Developer industry credentials, and verified achievements.</p>
      </div>

      <div className="credentials-grid">
        {credentials.map((cred) => {
          const isPdf = cred.fileType === 'pdf' || (cred.fileUrl && cred.fileUrl.toLowerCase().endsWith('.pdf'));
          return (
            <div key={cred.id} className="cred-card glass-card">
              <div className="cred-badge">
                {cred.type === 'certificate' ? <Award size={14} /> : cred.type === 'degree' ? <GraduationCap size={14} /> : <FileCheck size={14} />}
                <span>{cred.badge || 'Verified'}</span>
              </div>
              <div className={`cred-icon-box ${cred.type || 'arena'}`}>
                <span className="inst-tag">{cred.institution || 'CERTIFIED'}</span>
              </div>
              <h3>{cred.title}</h3>
              {cred.subtitle && <p className="cred-sub">{cred.subtitle}</p>}
              <p className="cred-desc">{cred.desc}</p>
              
              <div className="cred-footer">
                <span>{cred.date ? `Date: ${cred.date}` : 'Verified Credential'}</span>
                {cred.fileUrl && (
                  isPdf ? (
                    <a 
                      href={cred.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="view-cert-btn"
                    >
                      <span>View PDF</span> <ExternalLink size={13} />
                    </a>
                  ) : (
                    <button 
                      className="view-cert-btn"
                      onClick={() => onPreviewLetter && onPreviewLetter({
                        title: cred.title,
                        tag: cred.badge || "Verified Experience Document",
                        image: cred.previewImage || cred.fileUrl,
                        caption: cred.desc || cred.subtitle
                      })}
                    >
                      <span>View Document</span> <Maximize2 size={13} />
                    </button>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Embedded Document Preview Box */}
      {featuredDocument && (featuredDocument.previewImage || featuredDocument.fileUrl) && (
        <>
          <div className="sub-section-header">
            <span className="section-badge">Official Document</span>
            <h2 className="section-title">{featuredDocument.title}</h2>
          </div>

          <div className="glass-card letter-preview-box">
            <img 
              src={featuredDocument.previewImage || featuredDocument.fileUrl} 
              alt={featuredDocument.title} 
              style={{ maxWidth: '680px', width: '100%', margin: '0 auto', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', display: 'block' }}
            />
          </div>
        </>
      )}
    </div>
  );
}
