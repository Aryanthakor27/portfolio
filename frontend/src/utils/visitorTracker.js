/**
 * visitorTracker.js
 * Lightweight client-side visitor telemetry for Aryan Thakor's portfolio.
 * Captures IP, Geolocation (City, Country), Device Type (Desktop/Mobile/Tablet),
 * OS, Browser, Visited Path, and Timestamp.
 */

// Helper to detect device category
function detectDevice() {
  const ua = navigator.userAgent || '';
  const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isTablet = /(iPad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk)/i.test(ua);

  if (isTablet) return { type: 'Tablet', icon: 'tablet' };
  if (isMobile) return { type: 'Mobile', icon: 'mobile' };
  return { type: 'Desktop', icon: 'desktop' };
}

// Helper to detect Operating System
function detectOS() {
  const ua = navigator.userAgent || '';
  if (/Windows NT 10.0/i.test(ua)) return 'Windows 10/11';
  if (/Windows NT/i.test(ua)) return 'Windows';
  if (/Macintosh|Mac OS X/i.test(ua)) return 'macOS';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
  if (/Android/i.test(ua)) return 'Android';
  if (/Linux/i.test(ua)) return 'Linux';
  return 'Unknown OS';
}

// Helper to detect Browser
function detectBrowser() {
  const ua = navigator.userAgent || '';
  if (/Edg\//i.test(ua)) return 'Microsoft Edge';
  if (/Chrome\//i.test(ua) && !/Chromium|Edg|OPR/i.test(ua)) return 'Google Chrome';
  if (/Safari\//i.test(ua) && !/Chrome|Chromium|Edg|OPR/i.test(ua)) return 'Safari';
  if (/Firefox\//i.test(ua)) return 'Mozilla Firefox';
  if (/OPR\//i.test(ua) || /Opera/i.test(ua)) return 'Opera';
  if (/Brave/i.test(ua)) return 'Brave';
  return 'Web Browser';
}

// Get Country Flag emoji from country code
function getFlagEmoji(countryCode) {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// Cache IP lookup in sessionStorage for 30 minutes to avoid rate limits
async function fetchIpDetails() {
  const cached = sessionStorage.getItem('aryan_visitor_geo');
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {}
  }

  try {
    // ipwho.is is fast, CORS-friendly, SSL-supported, and free
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch('https://ipwho.is/', { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.success) {
        const geoInfo = {
          ip: data.ip || 'Unknown IP',
          city: data.city || 'Unknown City',
          region: data.region || '',
          country: data.country || 'Unknown Country',
          countryCode: data.country_code || '',
          flag: data.flag?.emoji || getFlagEmoji(data.country_code)
        };
        sessionStorage.setItem('aryan_visitor_geo', JSON.stringify(geoInfo));
        return geoInfo;
      }
    }
  } catch {
    // Fallback: try secondary provider
    try {
      const controller2 = new AbortController();
      const timeoutId2 = setTimeout(() => controller2.abort(), 3500);
      const res2 = await fetch('https://api.ipify.org?format=json', { signal: controller2.signal });
      clearTimeout(timeoutId2);
      if (res2.ok) {
        const data2 = await res2.json();
        const geoInfo = {
          ip: data2.ip || 'Client IP',
          city: 'Direct Visitor',
          region: '',
          country: 'Global',
          countryCode: '',
          flag: '🌐'
        };
        sessionStorage.setItem('aryan_visitor_geo', JSON.stringify(geoInfo));
        return geoInfo;
      }
    } catch {}
  }

  return {
    ip: 'Visitor (Anonymous)',
    city: 'Local Network',
    region: '',
    country: 'Protected',
    countryCode: '',
    flag: '🛡️'
  };
}

/**
 * Main trackVisitor function
 * Call this when someone visits public pages.
 */
export async function trackVisitor(pagePath = window.location.pathname) {
  // Never track visits to the admin studio itself so Aryan's own edits don't pollute visitor stats
  if (pagePath.startsWith('/admin')) {
    return;
  }

  try {
    const device = detectDevice();
    const os = detectOS();
    const browser = detectBrowser();
    const geo = await fetchIpDetails();

    const sessionId = sessionStorage.getItem('aryan_visitor_session_id') || `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    sessionStorage.setItem('aryan_visitor_session_id', sessionId);

    const visitRecord = {
      id: sessionId,
      ip: geo.ip,
      city: geo.city,
      region: geo.region,
      country: geo.country,
      flag: geo.flag,
      device: device.type,
      deviceIcon: device.icon,
      os,
      browser,
      page: pagePath || '/',
      timestamp: Date.now(),
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      referrer: document.referrer ? new URL(document.referrer).hostname : 'Direct / Search'
    };

    // Store in localStorage (last 100 visits)
    let logs = [];
    try {
      const raw = localStorage.getItem('aryan_visitor_logs');
      logs = raw ? JSON.parse(raw) : [];
    } catch {
      logs = [];
    }

    // If this session already visited recently (within last 15 minutes), update the existing record
    const existingIndex = logs.findIndex(l => l.id === sessionId);
    if (existingIndex !== -1) {
      logs[existingIndex] = {
        ...logs[existingIndex],
        page: pagePath,
        timestamp: Date.now(),
        pageViews: (logs[existingIndex].pageViews || 1) + 1
      };
    } else {
      visitRecord.pageViews = 1;
      logs.unshift(visitRecord);
    }

    // Keep max 100 entries
    if (logs.length > 100) {
      logs = logs.slice(0, 100);
    }

    localStorage.setItem('aryan_visitor_logs', JSON.stringify(logs));
    window.dispatchEvent(new Event('aryan_visitor_tracked'));

    // Optional: send to backend if running
    try {
      fetch('/api/analytics/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visitRecord)
      }).catch(() => {});
    } catch {}

    return visitRecord;
  } catch (err) {
    console.debug('Visitor tracking error:', err);
  }
}
