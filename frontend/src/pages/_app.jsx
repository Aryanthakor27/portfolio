import '../compat/server-polyfill.js';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ThemeProvider } from '../context/ThemeContext';
import { ContentProvider } from '../context/ContentContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LightboxModal from '../components/LightboxModal';
import Toast from '../components/Toast';
import SEO from '../components/SEO';
import PWAInstallPrompt from '../components/PWAInstallPrompt';
import { trackVisitor } from '../utils/visitorTracker';
import '../index.css';

// Page Views for Direct/Refresh Fallback Routing
import Home from '../views/Home';
import About from '../views/About';
import Services from '../views/Services';
import WebProjects from '../views/WebProjects';
import GraphicDesigns from '../views/GraphicDesigns';
import VideoEditing from '../views/VideoEditing';
import Credentials from '../views/Credentials';
import Contact from '../views/Contact';
import AdminDashboard from '../views/AdminDashboard';

const ROUTE_VIEW_MAP = {
  '/': Home,
  '/about': About,
  '/services': Services,
  '/web-projects': WebProjects,
  '/projects': WebProjects,
  '/designs': GraphicDesigns,
  '/videos': VideoEditing,
  '/video-editing': VideoEditing,
  '/credentials': Credentials,
  '/contact': Contact,
  '/admin': AdminDashboard
};

export default function MyApp({ Component, pageProps }) {
  const [previewItem, setPreviewItem] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const routerPath = router?.asPath?.split('?')[0] || router?.pathname || '/';
  const browserPath = (typeof window !== 'undefined' ? window.location.pathname.split('?')[0] : routerPath);
  
  // Clean trailing slash for matching
  const currentPath = (browserPath.length > 1 ? browserPath.replace(/\/$/, '') : browserPath) || '/';
  const isAdminRoute = currentPath.startsWith('/admin');

  // Route Fallback Resolver: If the server served /index.html on refresh for /designs,
  // we dynamically resolve to the actual corresponding view component
  let RenderComponent = Component;
  if (mounted && ROUTE_VIEW_MAP[currentPath]) {
    RenderComponent = ROUTE_VIEW_MAP[currentPath];
  }

  // Admin Security Guard: Direct /admin access requires key or session auth
  const [adminAuthorized, setAdminAuthorized] = useState(false);
  useEffect(() => {
    if (isAdminRoute && typeof window !== 'undefined') {
      const storedSecret = (localStorage.getItem('aryan_admin_secret_key') || 'aryan2026').trim();
      const params = new URLSearchParams(window.location.search);
      const providedKey = (params.get('key') || '').trim();
      const isAlreadyAuthed = sessionStorage.getItem('aryan_admin_auth') === 'true';

      if ((providedKey && providedKey === storedSecret) || isAlreadyAuthed) {
        setAdminAuthorized(true);
      } else {
        router.replace('/');
      }
    }
  }, [isAdminRoute, router]);

  useEffect(() => {
    if (!isAdminRoute) {
      trackVisitor(currentPath);
    }
  }, [currentPath, isAdminRoute]);

  // Register PWA Service Worker for Mobile App Installation
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            reg.update();
            console.log('✓ Next.js Portfolio PWA Service Worker active:', reg.scope);
          })
          .catch((err) => {
            console.debug('Service Worker registration skipped:', err);
          });
      });
    }
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const sharedProps = {
    ...pageProps,
    onPreviewDesign: setPreviewItem,
    onPreviewLetter: setPreviewItem,
    onShowToast: showToast
  };

  return (
    <ThemeProvider>
      <ContentProvider>
        <div className={`app-layout ${isAdminRoute ? 'admin-layout-active' : ''}`}>
          <SEO />

          {!isAdminRoute && <Navbar onShowToast={showToast} />}

          <main className={`main-content ${isAdminRoute ? 'admin-main-content' : ''}`}>
            {isAdminRoute && !adminAuthorized ? (
              <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: '#94a3b8', fontSize: '14px' }}>Verifying Security Clearance...</div>
              </div>
            ) : (
              <RenderComponent {...sharedProps} />
            )}
          </main>

          {!isAdminRoute && <Footer />}

          <LightboxModal item={previewItem} onClose={() => setPreviewItem(null)} />

          {!isAdminRoute && <PWAInstallPrompt />}

          <Toast message={toastMessage} />
        </div>
      </ContentProvider>
    </ThemeProvider>
  );
}
