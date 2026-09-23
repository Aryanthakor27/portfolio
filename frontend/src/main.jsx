import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { ContentProvider } from './context/ContentContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ContentProvider>
          <App />
        </ContentProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Register PWA Service Worker for mobile app installability
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('✓ Portfolio PWA Service Worker active:', reg.scope);
      })
      .catch((err) => {
        console.debug('Service Worker registration skipped:', err);
      });
  });
}
