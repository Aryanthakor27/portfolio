import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LightboxModal from './components/LightboxModal';
import Toast from './components/Toast';
import SEO from './components/SEO';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import { trackVisitor } from './utils/visitorTracker';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import WebProjects from './pages/WebProjects';
import GraphicDesigns from './pages/GraphicDesigns';
import Credentials from './pages/Credentials';
import VideoEditing from './pages/VideoEditing';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';

// Route Guard: Blocks direct access to /admin without secret key
function AdminRouteGuard({ children }) {
  const location = useLocation();
  const storedSecret = (localStorage.getItem('aryan_admin_secret_key') || 'aryan2026').trim();
  const params = new URLSearchParams(location.search);
  const providedKey = (params.get('key') || '').trim();
  const isAlreadyAuthed = sessionStorage.getItem('aryan_admin_auth') === 'true';

  // Allow access ONLY if secret key is present in the URL or user is already logged in
  if ((providedKey && providedKey === storedSecret) || isAlreadyAuthed) {
    return children;
  }

  // Any direct visit to /admin without the secret key is instantly redirected to homepage
  return <Navigate to="/" replace />;
}

export default function App() {
  const [previewItem, setPreviewItem] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Track visitor telemetry on public pages (non-blocking)
  useEffect(() => {
    if (!isAdminRoute) {
      trackVisitor(location.pathname);
    }
  }, [location.pathname, isAdminRoute]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  return (
    <div className={`app-layout ${isAdminRoute ? 'admin-layout-active' : ''}`}>
      {/* Dynamic SEO Meta & Title Manager */}
      <SEO />

      {/* Navigation Header - Hidden on Admin */}
      {!isAdminRoute && <Navbar onShowToast={showToast} />}

      {/* Main Routed Content */}
      <main className={`main-content ${isAdminRoute ? 'admin-main-content' : ''}`}>
        <Routes>
          <Route path="/" element={<Home onPreviewDesign={setPreviewItem} />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/web-projects" element={<WebProjects />} />
          <Route path="/projects" element={<WebProjects />} />
          <Route path="/designs" element={<GraphicDesigns onPreviewDesign={setPreviewItem} />} />
          <Route path="/videos" element={<VideoEditing />} />
          <Route path="/video-editing" element={<VideoEditing />} />
          <Route path="/credentials" element={<Credentials onPreviewLetter={setPreviewItem} />} />
          <Route path="/contact" element={<Contact onShowToast={showToast} />} />
          <Route
            path="/admin"
            element={
              <AdminRouteGuard>
                <AdminDashboard onShowToast={showToast} />
              </AdminRouteGuard>
            }
          />
        </Routes>
      </main>

      {/* Footer - Hidden on Admin */}
      {!isAdminRoute && <Footer />}

      {/* Lightbox Modal */}
      <LightboxModal item={previewItem} onClose={() => setPreviewItem(null)} />

      {/* PWA Mobile App Installation Prompt */}
      {!isAdminRoute && <PWAInstallPrompt />}

      {/* Global Toast Alert */}
      <Toast message={toastMessage} />
    </div>
  );
}
