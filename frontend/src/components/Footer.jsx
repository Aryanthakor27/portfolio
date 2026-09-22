import React from 'react';
import { useContent } from '../context/ContentContext';
import SocialIcon from './SocialIcon';

export default function Footer() {
  const { content } = useContent();
  const { hero, contact } = content;

  // Build active social links from contact CMS
  const socialList = (contact?.socials && contact.socials.length > 0)
    ? contact.socials.filter(s => s.enabled !== false && s.url)
    : [
        { id: 'linkedin', platform: 'LinkedIn', url: contact?.linkedin || 'https://www.linkedin.com/in/aryan-thakor' },
        { id: 'instagram', platform: 'Instagram', url: contact?.instagram || 'https://www.instagram.com/im__the_aryan' },
        { id: 'github', platform: 'GitHub', url: contact?.github || 'https://github.com/aryanthakor' },
        { id: 'whatsapp', platform: 'WhatsApp', url: contact?.whatsapp || 'https://wa.me/917698795009' }
      ].filter(s => !!s.url);

  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          {content?.branding?.logoImage ? (
            <img src={content.branding.logoImage} alt={content?.branding?.logoText || "Aryan Thakor"} className="footer-custom-logo-img" />
          ) : (
            <span className="logo-text">{content?.branding?.logoText || "ARYAN"}<span className="dot">.</span></span>
          )}
          <p>{hero?.roleBadge || "Sr. Web Developer • CMS Specialist • UI/UX & Graphic Designer • Digiva Inc • Ahmedabad, India"}</p>
        </div>

        {/* Dynamic Social Media Links */}
        <div className="footer-socials" aria-label="Social Media Links">
          {socialList.map(item => (
            <a
              key={item.id || item.platform}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              title={`${item.platform}: ${item.url}`}
              aria-label={item.platform}
            >
              <SocialIcon platform={item.platform} size={18} />
            </a>
          ))}
        </div>

        <p className="copyright">
          © {new Date().getFullYear()} Aryan Thakor. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
