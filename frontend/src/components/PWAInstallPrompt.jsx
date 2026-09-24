import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Check, Share2, MoreVertical, PlusSquare, ArrowRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [activeTab, setActiveTab] = useState('chrome'); // 'chrome' | 'ios'
  const { content } = useContent();

  const appIcon = content?.branding?.appIcon || '/icons/icon-192x192.png';
  const appName = 'Aryan Thakor';

  useEffect(() => {
    // Check if app is already running in standalone mode (installed)
    const checkStandalone = () => {
      const isDisplayStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isNavigatorStandalone = window.navigator.standalone === true;
      return isDisplayStandalone || isNavigatorStandalone;
    };

    if (checkStandalone()) {
      setIsStandalone(true);
      return;
    }

    // Capture Chrome's beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      window.deferredPWAInstallPrompt = e;

      // Show floating banner if not dismissed during current session
      const dismissed = sessionStorage.getItem('aryan_pwa_banner_dismissed');
      if (!dismissed) {
        setShowBanner(true);
      }
    };

    // When app is successfully installed
    const handleAppInstalled = () => {
      setIsStandalone(true);
      setShowBanner(false);
      setShowGuideModal(false);
      setDeferredPrompt(null);
      window.deferredPWAInstallPrompt = null;
      console.log('✓ Aryan Thakor App successfully installed');
    };

    // Global listener for custom install triggers from Navbar or elsewhere
    const handleGlobalTrigger = () => {
      handleInstallClick();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('aryan_trigger_pwa_install', handleGlobalTrigger);

    // Auto detect OS for default modal tab
    const ua = navigator.userAgent || '';
    if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
      setActiveTab('ios');
    } else {
      setActiveTab('chrome');
    }

    // Even if beforeinstallprompt didn't fire immediately (e.g. mobile Safari or already loaded),
    // show floating banner after a short delay on mobile devices if not dismissed
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const dismissed = sessionStorage.getItem('aryan_pwa_banner_dismissed');
    if (isMobile && !dismissed && !checkStandalone()) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 2500);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
        window.removeEventListener('aryan_trigger_pwa_install', handleGlobalTrigger);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('aryan_trigger_pwa_install', handleGlobalTrigger);
    };
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = deferredPrompt || window.deferredPWAInstallPrompt;
    if (promptEvent) {
      try {
        promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        if (choice.outcome === 'accepted') {
          setDeferredPrompt(null);
          window.deferredPWAInstallPrompt = null;
          setShowBanner(false);
        }
      } catch (err) {
        console.error('Error triggering PWA install prompt:', err);
        setShowGuideModal(true);
      }
    } else {
      // If native deferred prompt is not available, show visual guide
      setShowGuideModal(true);
    }
  };

  const dismissBanner = () => {
    setShowBanner(false);
    sessionStorage.setItem('aryan_pwa_banner_dismissed', 'true');
  };

  if (isStandalone) {
    return null;
  }

  return (
    <>
      {/* Floating Bottom Banner (Mobile & Desktop) */}
      {showBanner && (
        <aside className="pwa-floating-banner" aria-label="Install Aryan Thakor Web App">
          <div className="pwa-banner-content">
            <div className="pwa-banner-icon-wrap">
              <img
                src={appIcon}
                alt="App Icon"
                className="pwa-banner-app-icon"
                onError={(e) => { e.target.src = '/icons/icon-192x192.png'; }}
              />
              <span className="pwa-banner-pulse"></span>
            </div>
            <div className="pwa-banner-text">
              <div className="pwa-banner-title">
                <strong>Install {appName} App</strong>
                <span className="pwa-badge">Fast & Offline</span>
              </div>
              <p className="pwa-banner-desc">Add to phone home screen for instant 1-tap access</p>
            </div>
          </div>

          <div className="pwa-banner-actions">
            <button
              onClick={handleInstallClick}
              className="pwa-btn-install"
              id="pwa-floating-install-btn"
            >
              <Download size={15} />
              <span>Install App</span>
            </button>
            <button
              onClick={dismissBanner}
              className="pwa-btn-close"
              aria-label="Dismiss install banner"
              title="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        </aside>
      )}

      {/* Step-by-Step Guide Modal (Fallback for iOS or if browser blocks automatic prompt) */}
      {showGuideModal && (
        <div className="pwa-modal-backdrop" onClick={() => setShowGuideModal(false)}>
          <div className="pwa-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              className="pwa-modal-close-btn"
              onClick={() => setShowGuideModal(false)}
              aria-label="Close install instructions"
            >
              <X size={20} />
            </button>

            <div className="pwa-modal-header">
              <img
                src={appIcon}
                alt="App Icon"
                className="pwa-modal-app-icon"
                onError={(e) => { e.target.src = '/icons/icon-192x192.png'; }}
              />
              <div className="pwa-modal-title-group">
                <h3>Install {appName} App</h3>
                <p>Enjoy a full-screen, native application experience on your mobile device.</p>
              </div>
            </div>

            {/* Platform Selector Tabs */}
            <div className="pwa-modal-tabs">
              <button
                className={`pwa-tab-btn ${activeTab === 'chrome' ? 'active' : ''}`}
                onClick={() => setActiveTab('chrome')}
              >
                <span>Google Chrome (Android / PC)</span>
              </button>
              <button
                className={`pwa-tab-btn ${activeTab === 'ios' ? 'active' : ''}`}
                onClick={() => setActiveTab('ios')}
              >
                <span>Safari (iPhone / iPad)</span>
              </button>
            </div>

            {/* Chrome / Android Guide */}
            {activeTab === 'chrome' && (
              <div className="pwa-steps-list">
                <div className="pwa-step-item">
                  <div className="pwa-step-num">1</div>
                  <div className="pwa-step-info">
                    <strong>Open Chrome Menu</strong>
                    <p>Tap the <strong>three dots (⋮)</strong> in the top right corner of Chrome browser.</p>
                  </div>
                  <div className="pwa-step-icon">
                    <MoreVertical size={20} />
                  </div>
                </div>

                <div className="pwa-step-item">
                  <div className="pwa-step-num">2</div>
                  <div className="pwa-step-info">
                    <strong>Select Install or Add to Home Screen</strong>
                    <p>Tap on <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</p>
                  </div>
                  <div className="pwa-step-icon">
                    <Download size={20} />
                  </div>
                </div>

                <div className="pwa-step-item">
                  <div className="pwa-step-num">3</div>
                  <div className="pwa-step-info">
                    <strong>Confirm Installation</strong>
                    <p>Tap <strong>"Install"</strong>. Aryan Thakor app icon will appear on your phone home screen!</p>
                  </div>
                  <div className="pwa-step-icon">
                    <Check size={20} />
                  </div>
                </div>

                {deferredPrompt && (
                  <div className="pwa-direct-install-box">
                    <button
                      onClick={handleInstallClick}
                      className="pwa-direct-install-btn"
                    >
                      <Download size={16} />
                      <span>Click to Install Now via Chrome Prompt</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Safari / iPhone Guide */}
            {activeTab === 'ios' && (
              <div className="pwa-steps-list">
                <div className="pwa-step-item">
                  <div className="pwa-step-num">1</div>
                  <div className="pwa-step-info">
                    <strong>Tap Share Button</strong>
                    <p>Tap the <strong>Share</strong> button (box with upward arrow) at the bottom bar of Safari.</p>
                  </div>
                  <div className="pwa-step-icon">
                    <Share2 size={20} />
                  </div>
                </div>

                <div className="pwa-step-item">
                  <div className="pwa-step-num">2</div>
                  <div className="pwa-step-info">
                    <strong>Add to Home Screen</strong>
                    <p>Scroll down the share sheet and tap <strong>"Add to Home Screen"</strong>.</p>
                  </div>
                  <div className="pwa-step-icon">
                    <PlusSquare size={20} />
                  </div>
                </div>

                <div className="pwa-step-item">
                  <div className="pwa-step-num">3</div>
                  <div className="pwa-step-info">
                    <strong>Tap Add</strong>
                    <p>Tap <strong>"Add"</strong> in the top-right corner to place Aryan Thakor app on your Home Screen.</p>
                  </div>
                  <div className="pwa-step-icon">
                    <Check size={20} />
                  </div>
                </div>
              </div>
            )}

            <div className="pwa-modal-footer">
              <button
                className="pwa-btn-dismiss-modal"
                onClick={() => setShowGuideModal(false)}
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
