import React from 'react';
import { Award, FileCheck, ExternalLink, Maximize2 } from 'lucide-react';

export default function Credentials({ onPreviewLetter }) {
  return (
    <div className="credentials-page container">
      <div className="page-header">
        <span className="section-badge">Verified Credentials</span>
        <h1 className="section-title">Certifications & Experience Letters</h1>
        <p className="section-desc">Certified training in Graphic Design from Arena Animation and official Frontend Developer industry internship credentials.</p>
      </div>

      <div className="credentials-grid">
        {/* Arena Animation */}
        <div className="cred-card glass-card">
          <div className="cred-badge"><Award size={14} /> Certified</div>
          <div className="cred-icon-box arena">
            <span className="inst-tag">ARENA ANIMATION</span>
          </div>
          <h3>Certificate of Merit in Graphic Designing</h3>
          <p className="cred-sub">Dept. of Media & Entertainment • Arena Animation Satellite</p>
          <p className="cred-desc">
            Completed 150 Hours intensive professional course covering advanced Graphic Design, Visual Typography, and Creative Artwork with <strong>Grade: Credit</strong>.
          </p>
          <div className="cred-footer">
            <span>Date of Issue: 31-Dec-2025</span>
            <a 
              href="/assets/documents/Arena_Animation_Certificate.pdf" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="view-cert-btn"
            >
              <span>View PDF</span> <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* Rowwat Technologies (now Digiva Inc) */}
        <div className="cred-card glass-card">
          <div className="cred-badge"><FileCheck size={14} /> Verified Letter</div>
          <div className="cred-icon-box rowwat">
            <span className="inst-tag">ROWWAT (NOW DIGIVA)</span>
          </div>
          <h3>Frontend Developer (React JS) Internship Letter</h3>
          <p className="cred-sub">Rowwat Technologies (now Digiva Inc) • Ratnakar Nine Square, Ahmedabad</p>
          <p className="cred-desc">
            Official confirmation letter for 6-month industry internship in React JS & Frontend Development under Senior Project Management, issued by CEO Rajni Patel (Rowwat Technologies, earlier brand of Digiva Inc).
          </p>
          <div className="cred-footer">
            <span>Date: 15-Jan-2024</span>
            <button 
              className="view-cert-btn"
              onClick={() => onPreviewLetter({
                title: "Rowwat Technologies (now Digiva Inc) Internship Letter",
                tag: "Verified Experience Letter",
                image: "/assets/documents/Rowwat_Internship_Letter.jpg",
                caption: "Official internship confirmation letter issued by CEO Rajni Patel for Thakor Aryan Nareshkumar (Rowwat Technologies, now Digiva Inc)."
              })}
            >
              <span>View Letter</span> <Maximize2 size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Letter Preview Box */}
      <div className="sub-section-header">
        <span className="section-badge">Official Document</span>
        <h2 className="section-title">Rowwat Technologies (now Digiva Inc) Internship Letter</h2>
      </div>

      <div className="glass-card letter-preview-box">
        <img 
          src="/assets/documents/Rowwat_Internship_Letter.jpg" 
          alt="Rowwat Technologies (now Digiva Inc) Official Internship Letter" 
          style={{ maxWidth: '680px', width: '100%', margin: '0 auto', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)' }}
        />
      </div>
    </div>
  );
}
