import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Download, Lock, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { downloadResume } from '../utils/downloadResume';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile drawer automatically when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const closeMenu = () => setMobileMenuOpen(false);

  const handleCvDownload = (e) => {
    if (e) e.preventDefault();
    downloadResume('Aryan_Thakor_Resume.pdf');
    if (mobileMenuOpen) closeMenu();
  };

  return (
    <header className="navbar-wrapper">
      <div className="navbar-container">
        <Link to="/" className="brand-logo" onClick={closeMenu}>
          <div className="logo-symbol">
            <span></span><span></span><span></span>
          </div>
          <span className="logo-text">ARYAN<span className="dot">.</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="nav-links">
          <li>
            <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/services" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              Services
            </NavLink>
          </li>
          <li>
            <NavLink to="/web-projects" className={({ isActive }) => `nav-item highlight-nav ${isActive ? 'active' : ''}`}>
              Websites (48+)
            </NavLink>
          </li>
          <li>
            <NavLink to="/designs" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              Designs
            </NavLink>
          </li>
          <li>
            <NavLink to="/credentials" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              Certificates
            </NavLink>
          </li>
        </ul>

        {/* Actions (Desktop & Mobile Trigger) */}
        <div className="nav-actions">
          <ThemeToggle />

          <Link to="/admin" className="btn-admin-nav desktop-only" title="Admin Portal (Portfolio CMS Studio)">
            <Lock size={14} />
          </Link>

          <a
            href="/api/resume/download"
            onClick={handleCvDownload}
            download="Aryan_Thakor_Resume.pdf"
            className="btn btn-secondary btn-sm desktop-only"
            title="Download Aryan Thakor Resume (PDF)"
          >
            <Download size={14} />
            <span>CV</span>
          </a>

          <Link to="/contact" className="btn btn-primary btn-sm desktop-only">
            <span>Let's Talk</span>
            <ArrowUpRight size={14} />
          </Link>

          {/* Mobile Menu Hamburger Button */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={closeMenu}>
          <div className="mobile-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <Link to="/" className="brand-logo" onClick={closeMenu}>
                <div className="logo-symbol">
                  <span></span><span></span><span></span>
                </div>
                <span className="logo-text">ARYAN<span className="dot">.</span></span>
              </Link>
              <button className="mobile-drawer-close" onClick={closeMenu} aria-label="Close menu">
                <X size={20} />
              </button>
            </div>

            <nav className="mobile-drawer-nav">
              <NavLink to="/" onClick={closeMenu} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
                Home
              </NavLink>
              <NavLink to="/about" onClick={closeMenu} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
                About
              </NavLink>
              <NavLink to="/services" onClick={closeMenu} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
                Services
              </NavLink>
              <NavLink to="/web-projects" onClick={closeMenu} className={({ isActive }) => `mobile-nav-link highlight ${isActive ? 'active' : ''}`}>
                Websites (48+)
              </NavLink>
              <NavLink to="/designs" onClick={closeMenu} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
                Designs
              </NavLink>
              <NavLink to="/credentials" onClick={closeMenu} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
                Credentials
              </NavLink>
              <NavLink to="/contact" onClick={closeMenu} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
                Contact
              </NavLink>
            </nav>

            <div className="mobile-drawer-actions">
              <a
                href="/api/resume/download"
                download="Aryan_Thakor_Resume.pdf"
                className="btn btn-secondary w-full"
                onClick={handleCvDownload}
              >
                <Download size={15} />
                <span>Download Resume (CV)</span>
              </a>
              <Link to="/contact" className="btn btn-primary w-full" onClick={closeMenu}>
                <span>Let's Talk</span>
                <ArrowUpRight size={15} />
              </Link>
              <Link to="/admin" className="mobile-admin-link" onClick={closeMenu}>
                <Lock size={13} />
                <span>Admin CMS Portal</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
