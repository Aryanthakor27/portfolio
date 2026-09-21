import React from 'react';
import { Award, Briefcase, GraduationCap, Code2, Palette, TrendingUp } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export default function About() {
  const { content } = useContent();
  const { about } = content;

  return (
    <div className="about-page container">
      <div className="page-header">
        <span className="section-badge">{about?.badge || "Career Profile"}</span>
        <h1 className="section-title">{about?.title || "About & Experience Timeline"}</h1>
        <p className="section-desc">{about?.desc || "Senior Web Developer and Designer with hands-on expertise in full-cycle web engineering, CMS platforms, and team leadership."}</p>
      </div>

      {/* Experience Timeline */}
      <div className="experience-timeline">
        {/* Present Role */}
        <div className="exp-card glass-card active-role">
          <div className="exp-header">
            <div className="exp-title-group">
              <span className="exp-badge">Current Role</span>
              <h3>{about?.currentRole || "Sr. Web Developer, SEO Executive & Graphics Designer"}</h3>
              <h4>{about?.currentCompany || "Digiva Inc (formerly Rowwat Technologies) • Ahmedabad, India"}</h4>
            </div>
            <span className="exp-date">{about?.currentPeriod || "08/2024 — Present"}</span>
          </div>
          <ul className="exp-bullets">
            {(about?.currentBullets && about.currentBullets.length > 0 ? about.currentBullets : [
              "Team Leadership: Lead and coordinate the web development team, managing sprint workflows and ensuring timely project delivery across client portals.",
              "Web & CMS Engineering: Develop and maintain responsive, high-performance web applications using Modern JavaScript, Shopify, HubSpot, custom frontends, and scalable architecture.",
              "Custom CMS Engineering: Implement bespoke CMS logic, headless integrations, custom plugins, and AI-assisted workflows for rapid optimization.",
              "SEO Strategy: Execute On-Page and Technical SEO strategies using Rank Math, Yoast SEO, Google Search Console, and Analytics.",
              "Creative Design: Design engaging graphics, social media campaigns, brand materials, and interactive UI prototypes in Figma and Adobe Suite."
            ]).map((bullet, idx) => (
              <li key={idx}>{bullet}</li>
            ))}
          </ul>
        </div>

        {/* Web Dev & Frontend Internship */}
        <div className="exp-card glass-card">
          <div className="exp-header">
            <div className="exp-title-group">
              <span className="exp-badge" style={{ color: 'var(--accent-cyan)', background: 'rgba(6, 182, 212, 0.15)' }}>Industry Internship</span>
              <h3>{about?.internshipRole || "Web & Frontend Developer (React JS) Intern"}</h3>
              <h4>{about?.internshipCompany || "Rowwat Technologies (now Digiva Inc) • Ratnakar Nine Square, Ahmedabad"}</h4>
            </div>
            <span className="exp-date">{about?.internshipPeriod || "01/2024 — 08/2024"}</span>
          </div>
          <ul className="exp-bullets">
            {(about?.internshipBullets && about.internshipBullets.length > 0 ? about.internshipBullets : [
              "Completed intensive industry project training in modern JavaScript, React JS, HTML5, CSS3, and CMS architectures under Project Manager Mr. Jay Senjaliya.",
              "Assisted senior engineers in engineering and maintaining client websites, responsive mobile viewports, cross-browser compatibility, and speed optimization.",
              "Implemented on-page SEO meta tags, structured schema markup, and rapid UI bug resolution.",
              "Awarded official Letter of Internship Completion & Experience verification from CEO Rajni Patel at Rowwat Technologies."
            ]).map((bullet, idx) => (
              <li key={idx}>{bullet}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Education Grid */}
      <div className="sub-section-header">
        <span className="section-badge">Academic Qualifications</span>
        <h2 className="section-title">Education & Degrees</h2>
      </div>

      <div className="credentials-grid">
        <div className="cred-card glass-card">
          <div className="cred-badge"><GraduationCap size={14} /> Master Degree</div>
          <div className="cred-icon-box mca">
            <span className="inst-tag">GTU / RBIMS</span>
          </div>
          <h3>Master of Computer Application (MCA)</h3>
          <p className="cred-sub">R. B. Institute of Management Studies (GTU)</p>
          <p className="cred-desc">Advanced software development, algorithms, web technologies, and database architecture.</p>
          <div className="cred-footer">
            <span>Duration: 2022 — 2025</span>
            <span className="status-pill">Completed</span>
          </div>
        </div>

        <div className="cred-card glass-card">
          <div className="cred-badge"><GraduationCap size={14} /> Bachelor Degree</div>
          <div className="cred-icon-box bcom">
            <span className="inst-tag">GUJARAT UNIV</span>
          </div>
          <h3>Bachelor of Commerce (B.Com)</h3>
          <p className="cred-sub">Naroda College • Gujarat University</p>
          <p className="cred-desc">Commercial fundamentals, business communications, marketing awareness & corporate finance.</p>
          <div className="cred-footer">
            <span>Duration: 2019 — 2022</span>
            <span className="status-pill">Graduated</span>
          </div>
        </div>
      </div>
    </div>
  );
}
