import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, Copy, CheckCircle, ExternalLink } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import SocialIcon from '../components/SocialIcon';

export default function Contact({ onShowToast }) {
  const { content } = useContent();
  const { contact } = content;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const existing = JSON.parse(localStorage.getItem('aryan_contact_messages') || '[]');
      existing.push({ ...formData, timestamp: new Date().toISOString() });
      localStorage.setItem('aryan_contact_messages', JSON.stringify(existing));

      try {
        await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } catch (networkErr) {}

      setSubmitSuccess(true);
      onShowToast("Message sent successfully to Aryan Thakor!");
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setSubmitSuccess(true);
      onShowToast("Thank you! Your message has been recorded.");
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentEmail = contact?.email || 'thakoraryan2002@gmail.com';
  const currentPhone = contact?.phone || '+91 76987 95009';
  const currentWhatsApp = contact?.whatsapp || 'https://wa.me/917698795009';
  const currentLinkedIn = contact?.linkedin || 'https://www.linkedin.com/in/aryan-thakor';
  const currentInstagram = contact?.instagram || 'https://www.instagram.com/aryan_thakor_official';
  const currentLocation = contact?.location || 'Ahmedabad, Gujarat, India';

  // Build full list of social links from contact CMS
  const socialsList = (contact?.socials && contact.socials.length > 0)
    ? contact.socials.filter(s => s.enabled !== false && s.url)
    : [
        { id: 'linkedin', platform: 'LinkedIn', url: currentLinkedIn },
        { id: 'instagram', platform: 'Instagram', url: currentInstagram },
        { id: 'github', platform: 'GitHub', url: contact?.github || 'https://github.com/aryanthakor' }
      ].filter(s => !!s.url);

  const copyEmail = () => {
    navigator.clipboard.writeText(currentEmail);
    onShowToast(`Email copied: ${currentEmail}`);
  };

  return (
    <div className="contact-page container">
      <div className="page-header">
        <span className="section-badge">{contact?.badge || "Get In Touch"}</span>
        <h1 className="section-title">{contact?.title || "Let's Discuss Your Next Project"}</h1>
        <p className="section-desc">{contact?.desc || "Available for Senior Developer roles, custom CMS/Shopify builds, brand identity design, and SEO growth consulting."}</p>
      </div>

      <div className="contact-page-grid">
        {/* Contact Information */}
        <div className="contact-info-panel glass-card">
          <h3 style={{ fontSize: '22px', marginBottom: '8px' }}>Direct Contact Details</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
            Feel free to reach out via Phone, WhatsApp, Email, or Social Media.
          </p>

          <div className="contact-card">
            <div className="method-icon">
              <Phone size={20} />
            </div>
            <div className="method-info">
              <span>Phone & WhatsApp</span>
              <a href={`tel:${currentPhone.replace(/\s+/g, '')}`} className="method-value">{currentPhone}</a>
            </div>
            <a href={currentWhatsApp} target="_blank" rel="noopener noreferrer" className="copy-btn">
              Chat
            </a>
          </div>

          <div className="contact-card">
            <div className="method-icon">
              <Mail size={20} />
            </div>
            <div className="method-info">
              <span>Email Address</span>
              <a href={`mailto:${currentEmail}`} className="method-value">{currentEmail}</a>
            </div>
            <button className="copy-btn" onClick={copyEmail} title="Copy Email">
              <Copy size={12} /> <span>Copy</span>
            </button>
          </div>

          <div className="contact-card">
            <div className="method-icon">
              <MapPin size={20} />
            </div>
            <div className="method-info">
              <span>Location</span>
              <span className="method-value">{currentLocation}</span>
            </div>
          </div>

          {/* Social Media Icons */}
          {socialsList.length > 0 && (
            <div className="contact-socials-section">
              <span className="contact-socials-label">Social Media & Profiles</span>
              <div className="contact-social-icons">
                {socialsList.map(social => (
                  <a
                    key={social.id || social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-social-btn"
                    title={`${social.platform}: ${social.url}`}
                    aria-label={social.platform}
                  >
                    <SocialIcon platform={social.platform} size={20} />
                    <span className="social-tooltip">{social.platform}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Contact Form */}
        <div className="contact-form-panel glass-card">
          <h3 style={{ fontSize: '22px', marginBottom: '8px' }}>Send A Message</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
            Fill in the details below and I'll get back to you promptly.
          </p>

          {submitSuccess && (
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', padding: '14px', borderRadius: 'var(--radius-md)', color: '#10B981', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle size={18} />
              <span>Thank you! Your message has been sent to Aryan Thakor.</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Your Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="John Doe" 
                  required 
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="john@example.com" 
                  required 
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  name="phone" 
                  placeholder="+91 98765 43210" 
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input 
                  type="text" 
                  name="subject" 
                  placeholder="Project Inquiry / Job Opportunity" 
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Message *</label>
              <textarea 
                name="message" 
                rows="4" 
                placeholder="Tell me about your project goals, timeline, and requirements..." 
                required
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={isSubmitting}>
              <Send size={16} />
              <span>{isSubmitting ? 'Sending Message...' : 'Send Inquiry Now'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
