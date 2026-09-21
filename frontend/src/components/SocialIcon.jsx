import React from 'react';
import { 
  Linkedin, 
  Instagram, 
  Github, 
  Twitter, 
  Youtube, 
  Facebook, 
  Globe, 
  Phone, 
  MessageCircle, 
  ExternalLink 
} from 'lucide-react';

/**
 * Universal Social Media Icon component that maps platform names
 * to Lucide icons or brand-accurate SVGs.
 */
export default function SocialIcon({ platform, size = 18, className = '' }) {
  const norm = (platform || '').toLowerCase().trim();

  if (norm.includes('instagram') || norm.includes('insta')) {
    return <Instagram size={size} className={className} />;
  }
  if (norm.includes('linkedin')) {
    return <Linkedin size={size} className={className} />;
  }
  if (norm.includes('github') || norm.includes('git')) {
    return <Github size={size} className={className} />;
  }
  if (norm.includes('whatsapp') || norm.includes('wa.me')) {
    return <MessageCircle size={size} className={className} />;
  }
  if (norm.includes('twitter') || norm === 'x' || norm.includes('x.com')) {
    return <Twitter size={size} className={className} />;
  }
  if (norm.includes('youtube') || norm.includes('yt')) {
    return <Youtube size={size} className={className} />;
  }
  if (norm.includes('facebook') || norm.includes('fb')) {
    return <Facebook size={size} className={className} />;
  }
  if (norm.includes('behance')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M3 8h4.5a2.5 2.5 0 0 1 0 5H3V8z" />
        <path d="M3 13h5a2.5 2.5 0 0 1 0 5H3v-5z" />
        <path d="M14 14a3 3 0 1 0 5.4-1.8H14v1.8z" />
        <path d="M14.5 9h5" />
      </svg>
    );
  }
  if (norm.includes('dribbble')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94" />
        <path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32" />
        <path d="M8.56 2.75c4.37 6 6 9.42 8 17.72" />
      </svg>
    );
  }

  // Fallback for custom portfolio or website links
  return <Globe size={size} className={className} />;
}
