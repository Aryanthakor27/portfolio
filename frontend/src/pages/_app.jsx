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

export default function MyApp({ Component, pageProps }) {
  const [previewItem, setPreviewItem] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const router = useRouter();
  const currentPath = router?.asPath?.split('?')[0] || router?.pathname || '/';
  const isAdminRoute = currentPath.startsWith('/admin');

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
            <Component {...sharedProps} />
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
