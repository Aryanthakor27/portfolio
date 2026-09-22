import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Globe,
  Palette,
  Mail,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Search,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  LogOut,
  ArrowLeft,
  SlidersHorizontal,
  X,
  Send,
  Building,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  KeyRound,
  FileText,
  Save,
  Check,
  Phone,
  Settings,
  Upload,
  Download,
  Share2,
  Image as ImageIcon,
  Camera,
  Activity,
  Users,
  Monitor,
  Tablet,
  MapPin,
  Clock,
  RotateCcw,
  Archive
} from 'lucide-react';
import AdminPasscodeModal from '../components/AdminPasscodeModal';
import ThemeToggle from '../components/ThemeToggle';
import { useContent } from '../context/ContentContext';
import { downloadResume } from '../utils/downloadResume';
import { optimizeImageFile } from '../utils/imageUtils';
import SocialIcon from '../components/SocialIcon';
import { websitesData } from '../data/websitesData';
import { designsData } from '../data/designsData';

export default function AdminDashboard({ onShowToast }) {
  const navigate = useNavigate();
  const { content: cmsContent, refreshContent, updateSectionContent } = useContent();

  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('aryan_admin_auth') === 'true'
  );

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'cms' | 'websites' | 'designs' | 'messages' | 'analytics' | 'recyclebin' | 'security'
  const [cmsSubTab, setCmsSubTab] = useState('hero'); // 'hero' | 'branding' | 'about' | 'services' | 'contact' | 'resume' | 'seo'
  const [loading, setLoading] = useState(true);

  // Datasets with fallback to localStorage & bundled dataset
  const [websites, setWebsites] = useState(() => {
    try {
      const deletedList = new Set(JSON.parse(localStorage.getItem('aryan_deleted_websites') || '[]'));
      const saved = localStorage.getItem('aryan_admin_websites');
      const base = saved ? JSON.parse(saved) : websitesData;
      return base.filter(w => !deletedList.has(String(w.id).trim()));
    } catch {
      return websitesData;
    }
  });

  const [designs, setDesigns] = useState(() => {
    try {
      const deletedList = new Set(JSON.parse(localStorage.getItem('aryan_deleted_designs') || '[]'));
      const saved = localStorage.getItem('aryan_admin_designs');
      const base = saved ? JSON.parse(saved) : designsData;
      return base.filter(d => !deletedList.has(String(d.id).trim()));
    } catch {
      return designsData;
    }
  });

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('aryan_contact_messages');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Recycle Bin State (auto-purges items older than 30 days)
  const [recycleBin, setRecycleBin] = useState(() => {
    try {
      const raw = localStorage.getItem('aryan_recycle_bin');
      const items = raw ? JSON.parse(raw) : [];
      const now = Date.now();
      const validItems = items.filter(item => {
        const expiry = item.expiresAt || (item.deletedAt + 30 * 24 * 60 * 60 * 1000);
        return now < expiry;
      });
      if (validItems.length !== items.length) {
        localStorage.setItem('aryan_recycle_bin', JSON.stringify(validItems));
      }
      return validItems;
    } catch {
      return [];
    }
  });

  // Visitor Telemetry Logs State
  const [visitorLogs, setVisitorLogs] = useState(() => {
    try {
      const raw = localStorage.getItem('aryan_visitor_logs');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // In-App Custom Delete Confirmation Modal State
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    type: '', // 'website' | 'design' | 'message'
    id: null,
    title: ''
  });

  const [emptyBinModal, setEmptyBinModal] = useState(false);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // CMS Editable Forms
  const [heroForm, setHeroForm] = useState(cmsContent?.hero || {});
  const [brandingForm, setBrandingForm] = useState(
    cmsContent?.branding || {
      logoImage: '',
      logoText: 'ARYAN',
      favicon: ''
    }
  );
  const [aboutForm, setAboutForm] = useState(cmsContent?.about || {});
  const [contactForm, setContactForm] = useState(cmsContent?.contact || {});
  const [seoForm, setSeoForm] = useState(cmsContent?.seo || {});
  const [servicesList, setServicesList] = useState(cmsContent?.services || []);
  const [cmsSaving, setCmsSaving] = useState(false);

  // Social Media CMS State
  const [newSocialPlatform, setNewSocialPlatform] = useState('Instagram');
  const [newSocialUrl, setNewSocialUrl] = useState('');
  const [customPlatformName, setCustomPlatformName] = useState('');

  // Filters
  const [websiteSearch, setWebsiteSearch] = useState('');
  const [websiteCategory, setWebsiteCategory] = useState('all');
  const [designCategory, setDesignCategory] = useState('all');

  // Website & Design Modals
  const [showWebsiteModal, setShowWebsiteModal] = useState(false);
  const [editingWebsite, setEditingWebsite] = useState(null);
  const [websiteForm, setWebsiteForm] = useState({
    name: '',
    url: '',
    domain: '',
    category: 'ecommerce',
    badge: 'Custom Build',
    tech: 'React / Node.js',
    desc: ''
  });

  const [showDesignModal, setShowDesignModal] = useState(false);
  const [editingDesign, setEditingDesign] = useState(null);
  const [designForm, setDesignForm] = useState({
    title: '',
    category: 'logos',
    tag: 'Branding',
    image: '',
    caption: ''
  });

  // 2FA Setup State
  const [twoFASetup, setTwoFASetup] = useState(null); // { secret, qrCodeUrl, otpauth }
  const [verify2FACode, setVerify2FACode] = useState('');
  const [twoFALoading, setTwoFALoading] = useState(false);
  const [emergencyKey, setEmergencyKey] = useState('');
  const [disablePasscode, setDisablePasscode] = useState('');

  // Change Passcode State
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');

  // Resume Document State
  const [resumeInfo, setResumeInfo] = useState({
    exists: true,
    filename: 'AryanThakorResume.pdf',
    originalName: 'Aryan_Thakor_Resume.pdf',
    sizeBytes: 175866,
    formattedSize: '171.7 KB',
    lastModified: null
  });
  const [selectedResumeFile, setSelectedResumeFile] = useState(null);
  const [resumeUploading, setResumeUploading] = useState(false);

  const loadResumeInfo = async () => {
    try {
      const res = await fetch('/api/resume/info');
      if (res.ok) {
        const data = await res.json();
        setResumeInfo(data);
      }
    } catch (e) {
      console.error('Error fetching resume info:', e);
    }
  };

  const handleResumeFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      if (onShowToast) onShowToast('⚠️ Only PDF files (.pdf) are allowed.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      if (onShowToast) onShowToast('⚠️ File size exceeds 10MB limit.');
      return;
    }
    setSelectedResumeFile(file);
  };

  const handleUploadResume = async () => {
    if (!selectedResumeFile) {
      if (onShowToast) onShowToast('Please select a PDF file first.');
      return;
    }

    setResumeUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = reader.result;
          const token = sessionStorage.getItem('aryan_admin_token') || '';
          const res = await fetch('/api/admin/resume/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              base64Data,
              filename: selectedResumeFile.name
            })
          });
          const result = await res.json();
          if (res.ok) {
            if (onShowToast) onShowToast('✓ Resume updated successfully! Live across all download links.');
            setSelectedResumeFile(null);
            await loadResumeInfo();
          } else {
            if (onShowToast) onShowToast(result.error || 'Failed to update resume.');
          }
        } catch (postErr) {
          if (onShowToast) onShowToast('Network error while uploading resume.');
        } finally {
          setResumeUploading(false);
        }
      };
      reader.readAsDataURL(selectedResumeFile);
    } catch (err) {
      setResumeUploading(false);
      if (onShowToast) onShowToast('Failed to read selected PDF file.');
    }
  };

  // --- Branding & Photo File Handlers ---
  const handleLogoFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await optimizeImageFile(file, 600, 300, 0.9);
      setBrandingForm(prev => ({ ...prev, logoImage: dataUrl }));
      if (onShowToast) onShowToast('✓ Logo selected! Remember to click "Save Branding".');
    } catch (err) {
      if (onShowToast) onShowToast('⚠️ Failed to load logo image.');
    }
  };

  const handleFaviconFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await optimizeImageFile(file, 128, 128, 0.9);
      setBrandingForm(prev => ({ ...prev, favicon: dataUrl }));
      if (onShowToast) onShowToast('✓ Favicon selected! Remember to click "Save Favicon".');
    } catch (err) {
      if (onShowToast) onShowToast('⚠️ Failed to load favicon.');
    }
  };

  const handleHeroPhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await optimizeImageFile(file, 1000, 1000, 0.88);
      setHeroForm(prev => ({ ...prev, profileImage: dataUrl }));
      if (onShowToast) onShowToast('✓ Photo selected! Remember to click "Save".');
    } catch (err) {
      if (onShowToast) onShowToast('⚠️ Failed to load profile photo.');
    }
  };

  // Load all dashboard data
  const loadAllData = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('aryan_admin_token') || '';
      const [webRes, desRes, msgRes, statsRes, contentRes, resInfo] = await Promise.all([
        fetch('/api/websites').then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/api/designs').then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/api/contact').then(r => r.json()).catch(() => ({ messages: [] })),
        fetch('/api/admin/stats').then(r => r.json()).catch(() => ({})),
        fetch('/api/content').then(r => r.json()).catch(() => ({})),
        fetch('/api/resume/info').then(r => r.json()).catch(() => null)
      ]);

      if (resInfo && resInfo.filename) setResumeInfo(resInfo);

      const deletedWebsites = new Set(JSON.parse(localStorage.getItem('aryan_deleted_websites') || '[]'));
      const deletedDesigns = new Set(JSON.parse(localStorage.getItem('aryan_deleted_designs') || '[]'));

      if (webRes && webRes.data && webRes.data.length > 0) {
        const cleanData = webRes.data.filter(w => !deletedWebsites.has(String(w.id).trim()));
        setWebsites(cleanData);
        localStorage.setItem('aryan_admin_websites', JSON.stringify(cleanData));
      } else {
        const saved = localStorage.getItem('aryan_admin_websites');
        if (saved) {
          try {
            const parsed = JSON.parse(saved).filter(w => !deletedWebsites.has(String(w.id).trim()));
            setWebsites(parsed);
          } catch {
            setWebsites(websitesData.filter(w => !deletedWebsites.has(String(w.id).trim())));
          }
        } else {
          setWebsites(websitesData.filter(w => !deletedWebsites.has(String(w.id).trim())));
        }
      }

      if (desRes && desRes.data && desRes.data.length > 0) {
        const cleanData = desRes.data.filter(d => !deletedDesigns.has(String(d.id).trim()));
        setDesigns(cleanData);
        localStorage.setItem('aryan_admin_designs', JSON.stringify(cleanData));
      } else {
        const saved = localStorage.getItem('aryan_admin_designs');
        if (saved) {
          try {
            const parsed = JSON.parse(saved).filter(d => !deletedDesigns.has(String(d.id).trim()));
            setDesigns(parsed);
          } catch {
            setDesigns(designsData.filter(d => !deletedDesigns.has(String(d.id).trim())));
          }
        } else {
          setDesigns(designsData.filter(d => !deletedDesigns.has(String(d.id).trim())));
        }
      }

      if (msgRes && msgRes.messages && msgRes.messages.length > 0) {
        setMessages(msgRes.messages);
      } else {
        const savedMsgs = localStorage.getItem('aryan_contact_messages');
        if (savedMsgs) {
          try { setMessages(JSON.parse(savedMsgs)); } catch {}
        }
      }

      if (statsRes.twoFactorEnabled !== undefined) setTwoFactorEnabled(statsRes.twoFactorEnabled);

      if (contentRes.hero) {
        setHeroForm(contentRes.hero);
        if (contentRes.branding) setBrandingForm(contentRes.branding);
        setAboutForm(contentRes.about || {});
        const c = contentRes.contact || {};
        if (!c.socials || c.socials.length === 0) {
          c.socials = [
            { id: 'linkedin', platform: 'LinkedIn', url: c.linkedin || 'https://www.linkedin.com/in/aryan-thakor', enabled: true },
            { id: 'instagram', platform: 'Instagram', url: c.instagram || 'https://www.instagram.com/aryan_thakor_official', enabled: true },
            { id: 'github', platform: 'GitHub', url: c.github || 'https://github.com/aryanthakor', enabled: true },
            { id: 'whatsapp', platform: 'WhatsApp', url: c.whatsapp || 'https://wa.me/917698795009', enabled: true }
          ];
        }
        setContactForm(c);
        setSeoForm(contentRes.seo || {});
        setServicesList(contentRes.services || []);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      if (onShowToast) onShowToast('Failed to connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Purge any expired items in recycle bin (older than 30 days)
    const purgeExpired = () => {
      setRecycleBin(prev => {
        const now = Date.now();
        const valid = prev.filter(item => {
          const expiry = item.expiresAt || (item.deletedAt + 30 * 24 * 60 * 60 * 1000);
          return now < expiry;
        });
        if (valid.length !== prev.length) {
          localStorage.setItem('aryan_recycle_bin', JSON.stringify(valid));
        }
        return valid;
      });
    };

    purgeExpired();

    // Listen for visitor tracking updates
    const handleVisitorUpdate = () => {
      try {
        const raw = localStorage.getItem('aryan_visitor_logs');
        if (raw) setVisitorLogs(JSON.parse(raw));
      } catch {}
    };

    window.addEventListener('aryan_visitor_tracked', handleVisitorUpdate);
    window.addEventListener('storage', handleVisitorUpdate);

    return () => {
      window.removeEventListener('aryan_visitor_tracked', handleVisitorUpdate);
      window.removeEventListener('storage', handleVisitorUpdate);
    };
  }, []);

  useEffect(() => {
    if (cmsContent) {
      if (cmsContent.hero) setHeroForm(cmsContent.hero);
      if (cmsContent.branding) setBrandingForm(cmsContent.branding);
      if (cmsContent.about) setAboutForm(cmsContent.about);
      if (cmsContent.contact) {
        const c = { ...cmsContent.contact };
        if (!c.socials || c.socials.length === 0) {
          c.socials = [
            { id: 'linkedin', platform: 'LinkedIn', url: c.linkedin || 'https://www.linkedin.com/in/aryan-thakor', enabled: true },
            { id: 'instagram', platform: 'Instagram', url: c.instagram || 'https://www.instagram.com/aryan_thakor_official', enabled: true },
            { id: 'github', platform: 'GitHub', url: c.github || 'https://github.com/aryanthakor', enabled: true },
            { id: 'whatsapp', platform: 'WhatsApp', url: c.whatsapp || 'https://wa.me/917698795009', enabled: true }
          ];
        }
        setContactForm(c);
      }
      if (cmsContent.seo) setSeoForm(cmsContent.seo);
      if (cmsContent.services) setServicesList(cmsContent.services);
    }
  }, [cmsContent]);

  // --- Social Media Management Handlers ---
  const handleAddSocialLink = () => {
    if (!newSocialUrl.trim()) {
      if (onShowToast) onShowToast('⚠️ Please enter a URL for the social media link.');
      return;
    }
    const platform = newSocialPlatform === 'Custom'
      ? (customPlatformName.trim() || 'Website')
      : newSocialPlatform;

    const newSocial = {
      id: 'soc_' + Date.now(),
      platform,
      url: newSocialUrl.trim(),
      enabled: true
    };

    const currentSocials = Array.isArray(contactForm.socials) ? [...contactForm.socials] : [];
    const updated = [...currentSocials, newSocial];

    setContactForm({
      ...contactForm,
      socials: updated,
      ...(platform.toLowerCase() === 'instagram' ? { instagram: newSocialUrl.trim() } : {}),
      ...(platform.toLowerCase() === 'linkedin' ? { linkedin: newSocialUrl.trim() } : {}),
      ...(platform.toLowerCase() === 'github' ? { github: newSocialUrl.trim() } : {}),
      ...(platform.toLowerCase() === 'whatsapp' ? { whatsapp: newSocialUrl.trim() } : {})
    });

    setNewSocialUrl('');
    setCustomPlatformName('');
    if (onShowToast) onShowToast(`✓ Added ${platform}! Click "Save Contact Details" to apply.`);
  };

  const handleUpdateSocial = (id, field, value) => {
    const currentSocials = Array.isArray(contactForm.socials) ? [...contactForm.socials] : [];
    const updated = currentSocials.map(s => s.id === id ? { ...s, [field]: value } : s);
    setContactForm({ ...contactForm, socials: updated });
  };

  const handleDeleteSocial = (id) => {
    const currentSocials = Array.isArray(contactForm.socials) ? [...contactForm.socials] : [];
    const updated = currentSocials.filter(s => s.id !== id);
    setContactForm({ ...contactForm, socials: updated });
    if (onShowToast) onShowToast('Removed social link. Click "Save Contact Details" to apply.');
  };

  const handleToggleSocial = (id) => {
    const currentSocials = Array.isArray(contactForm.socials) ? [...contactForm.socials] : [];
    const updated = currentSocials.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s);
    setContactForm({ ...contactForm, socials: updated });
  };

  const handleLogout = () => {
    sessionStorage.removeItem('aryan_admin_auth');
    sessionStorage.removeItem('aryan_admin_token');
    setIsAuthenticated(false);
    if (onShowToast) onShowToast('Logged out of Admin Portal.');
    navigate('/');
  };

  // --- CMS Section Save ---
  const saveCmsSection = async (section, data) => {
    setCmsSaving(true);
    try {
      if (updateSectionContent) {
        await updateSectionContent(section, data);
      } else {
        try {
          const local = JSON.parse(localStorage.getItem('aryan_portfolio_content') || '{}');
          local[section] = data;
          localStorage.setItem('aryan_portfolio_content', JSON.stringify(local));
        } catch {}
      }

      try {
        const res = await fetch(`/api/content/${section}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('aryan_admin_token') || ''}`
          },
          body: JSON.stringify(data)
        });
        if (res.ok) {
          refreshContent();
        }
      } catch {}

      if (onShowToast) onShowToast(`✓ ${section.toUpperCase()} updated successfully on live portfolio!`);
    } catch {
      if (onShowToast) onShowToast('Failed to save section.');
    } finally {
      setCmsSaving(false);
    }
  };

  // --- 2FA Handlers ---
  const handleStart2FASetup = async () => {
    setTwoFALoading(true);
    try {
      const res = await fetch('/api/admin/2fa/setup', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setTwoFASetup(data);
      }
    } catch {
      if (onShowToast) onShowToast('Failed to initiate 2FA setup.');
    } finally {
      setTwoFALoading(false);
    }
  };

  const handleEnable2FA = async (e) => {
    e.preventDefault();
    if (!verify2FACode.trim()) {
      if (onShowToast) onShowToast('Please enter the 6-digit code from Google Authenticator.');
      return;
    }

    setTwoFALoading(true);
    try {
      const res = await fetch('/api/admin/2fa/enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: verify2FACode.trim(),
          secret: twoFASetup.secret
        })
      });
      const result = await res.json();

      if (res.ok) {
        setTwoFactorEnabled(true);
        setEmergencyKey(result.recoveryKey);
        setTwoFASetup(null);
        setVerify2FACode('');
        if (onShowToast) onShowToast('Google Authenticator 2FA Activated Successfully!');
      } else {
        if (onShowToast) onShowToast(result.error || 'Invalid 2FA code.');
      }
    } catch {
      if (onShowToast) onShowToast('Error enabling 2FA.');
    } finally {
      setTwoFALoading(false);
    }
  };

  const handleDisable2FA = async (e) => {
    e.preventDefault();
    if (!disablePasscode.trim()) {
      if (onShowToast) onShowToast('Please enter your passcode to disable 2FA.');
      return;
    }

    try {
      const res = await fetch('/api/admin/2fa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: disablePasscode.trim() })
      });
      const result = await res.json();

      if (res.ok) {
        setTwoFactorEnabled(false);
        setDisablePasscode('');
        if (onShowToast) onShowToast('2FA has been disabled.');
      } else {
        if (onShowToast) onShowToast(result.error || 'Failed to disable 2FA.');
      }
    } catch {
      if (onShowToast) onShowToast('Error connecting to backend.');
    }
  };

  const handleChangePasscode = async (e) => {
    e.preventDefault();
    if (!oldPass || !newPass) {
      if (onShowToast) onShowToast('Both old and new passcode are required.');
      return;
    }

    try {
      const res = await fetch('/api/admin/change-passcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPasscode: oldPass, newPasscode: newPass })
      });
      const result = await res.json();

      if (res.ok) {
        setOldPass('');
        setNewPass('');
        if (onShowToast) onShowToast('Admin passcode updated successfully!');
      } else {
        if (onShowToast) onShowToast(result.error || 'Failed to change passcode.');
      }
    } catch {
      if (onShowToast) onShowToast('Network error.');
    }
  };

  // --- Website Actions ---
  const openAddWebsite = () => {
    setEditingWebsite(null);
    setWebsiteForm({
      name: '',
      url: '',
      domain: '',
      category: 'ecommerce',
      badge: 'E-Commerce',
      tech: 'Custom CMS / E-Commerce',
      desc: ''
    });
    setShowWebsiteModal(true);
  };

  const openEditWebsite = (site) => {
    setEditingWebsite(site);
    setWebsiteForm({
      name: site.name || '',
      url: site.url || '',
      domain: site.domain || '',
      category: site.category || 'ecommerce',
      badge: site.badge || '',
      tech: site.tech || '',
      desc: site.desc || ''
    });
    setShowWebsiteModal(true);
  };

  const handleSaveWebsite = async (e) => {
    e.preventDefault();
    if (!websiteForm.name || !websiteForm.url) {
      if (onShowToast) onShowToast('Name and URL are required.');
      return;
    }

    const updatedSite = {
      id: editingWebsite ? editingWebsite.id : Date.now(),
      ...websiteForm
    };

    setWebsites(prev => {
      const next = editingWebsite
        ? prev.map(w => w.id === editingWebsite.id ? updatedSite : w)
        : [updatedSite, ...prev];
      localStorage.setItem('aryan_admin_websites', JSON.stringify(next));
      return next;
    });

    setShowWebsiteModal(false);
    if (onShowToast) onShowToast(editingWebsite ? 'Website updated successfully!' : 'Website added successfully!');

    try {
      const endpoint = editingWebsite ? `/api/websites/${editingWebsite.id}` : '/api/websites';
      const method = editingWebsite ? 'PUT' : 'POST';
      fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(websiteForm)
      }).catch(() => {});
    } catch {}
  };

  const promptDeleteWebsite = (id, name) => {
    setDeleteConfirm({
      isOpen: true,
      type: 'website',
      id,
      title: name || 'This website project'
    });
  };
  const handleDeleteWebsite = promptDeleteWebsite;

  // --- Design Actions ---
  const openAddDesign = () => {
    setEditingDesign(null);
    setDesignForm({
      title: '',
      category: 'logos',
      tag: 'Branding',
      image: '/assets/logos/',
      caption: ''
    });
    setShowDesignModal(true);
  };

  const openEditDesign = (design) => {
    setEditingDesign(design);
    setDesignForm({
      title: design.title || '',
      category: design.category || 'logos',
      tag: design.tag || '',
      image: design.image || '',
      caption: design.caption || ''
    });
    setShowDesignModal(true);
  };

  const handleSaveDesign = async (e) => {
    e.preventDefault();
    if (!designForm.title) {
      if (onShowToast) onShowToast('Title is required.');
      return;
    }

    const updatedDesign = {
      id: editingDesign ? editingDesign.id : Date.now(),
      ...designForm
    };

    setDesigns(prev => {
      const next = editingDesign
        ? prev.map(d => d.id === editingDesign.id ? updatedDesign : d)
        : [updatedDesign, ...prev];
      localStorage.setItem('aryan_admin_designs', JSON.stringify(next));
      return next;
    });

    setShowDesignModal(false);
    if (onShowToast) onShowToast(editingDesign ? 'Graphic design updated successfully!' : 'Graphic design added successfully!');

    try {
      const endpoint = editingDesign ? `/api/designs/${editingDesign.id}` : '/api/designs';
      const method = editingDesign ? 'PUT' : 'POST';
      fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(designForm)
      }).catch(() => {});
    } catch {}
  };

  const promptDeleteDesign = (id, title) => {
    setDeleteConfirm({
      isOpen: true,
      type: 'design',
      id,
      title: title || 'This graphic design'
    });
  };
  const handleDeleteDesign = promptDeleteDesign;

  // Execution when user confirms delete in custom modal -> Moves to Recycle Bin for 30 days
  const executeDeleteConfirmed = async () => {
    const { type, id, title } = deleteConfirm;
    if (!id) return;
    const targetIdStr = String(id).trim();
    const now = Date.now();
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

    if (type === 'website') {
      const targetItem = websites.find(w => String(w.id).trim() === targetIdStr);

      setWebsites(prev => {
        const next = prev.filter(w => String(w.id).trim() !== targetIdStr);
        try {
          localStorage.setItem('aryan_admin_websites', JSON.stringify(next));
          const deletedList = JSON.parse(localStorage.getItem('aryan_deleted_websites') || '[]');
          if (!deletedList.includes(targetIdStr)) {
            deletedList.push(targetIdStr);
            localStorage.setItem('aryan_deleted_websites', JSON.stringify(deletedList));
          }
        } catch {}
        return next;
      });

      // Add to Recycle Bin with 30-day retention
      const binEntry = {
        id: `bin_web_${targetIdStr}_${now}`,
        originalId: targetItem ? targetItem.id : id,
        type: 'website',
        title: targetItem ? targetItem.name : title,
        subtitle: targetItem ? (targetItem.domain || targetItem.url) : '',
        category: targetItem ? targetItem.category : 'ecommerce',
        badge: targetItem ? (targetItem.badge || targetItem.tech) : 'Website',
        data: targetItem || { id, name: title },
        deletedAt: now,
        expiresAt: now + thirtyDaysMs
      };

      setRecycleBin(prev => {
        const next = [binEntry, ...prev.filter(b => String(b.originalId).trim() !== targetIdStr)];
        try {
          localStorage.setItem('aryan_recycle_bin', JSON.stringify(next));
        } catch {}
        return next;
      });

      try {
        window.dispatchEvent(new Event('aryan_portfolio_updated'));
        window.dispatchEvent(new Event('storage'));
      } catch {}

      if (onShowToast) onShowToast(`🗑️ "${title}" moved to Recycle Bin (30-day retention).`);

      try {
        const token = sessionStorage.getItem('aryan_admin_token') || '';
        fetch(`/api/websites/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(() => {});
      } catch {}
    } else if (type === 'design') {
      const targetItem = designs.find(d => String(d.id).trim() === targetIdStr);

      setDesigns(prev => {
        const next = prev.filter(d => String(d.id).trim() !== targetIdStr);
        try {
          localStorage.setItem('aryan_admin_designs', JSON.stringify(next));
          const deletedList = JSON.parse(localStorage.getItem('aryan_deleted_designs') || '[]');
          if (!deletedList.includes(targetIdStr)) {
            deletedList.push(targetIdStr);
            localStorage.setItem('aryan_deleted_designs', JSON.stringify(deletedList));
          }
        } catch {}
        return next;
      });

      // Add to Recycle Bin with 30-day retention
      const binEntry = {
        id: `bin_des_${targetIdStr}_${now}`,
        originalId: targetItem ? targetItem.id : id,
        type: 'design',
        title: targetItem ? targetItem.title : title,
        subtitle: targetItem ? (targetItem.tag || targetItem.category) : '',
        category: targetItem ? targetItem.category : 'logos',
        badge: targetItem ? targetItem.tag : 'Design Work',
        image: targetItem ? targetItem.image : '',
        data: targetItem || { id, title },
        deletedAt: now,
        expiresAt: now + thirtyDaysMs
      };

      setRecycleBin(prev => {
        const next = [binEntry, ...prev.filter(b => String(b.originalId).trim() !== targetIdStr)];
        try {
          localStorage.setItem('aryan_recycle_bin', JSON.stringify(next));
        } catch {}
        return next;
      });

      try {
        window.dispatchEvent(new Event('aryan_portfolio_updated'));
        window.dispatchEvent(new Event('storage'));
      } catch {}

      if (onShowToast) onShowToast(`🗑️ Design "${title}" moved to Recycle Bin (30-day retention).`);

      try {
        const token = sessionStorage.getItem('aryan_admin_token') || '';
        fetch(`/api/designs/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(() => {});
      } catch {}
    }

    setDeleteConfirm({ isOpen: false, type: '', id: null, title: '' });
  };

  // --- Recycle Bin Handlers ---
  const handleRestoreFromBin = (binItem) => {
    const targetOriginalId = String(binItem.originalId).trim();

    if (binItem.type === 'website') {
      setWebsites(prev => {
        const next = [binItem.data, ...prev.filter(w => String(w.id).trim() !== targetOriginalId)];
        try {
          localStorage.setItem('aryan_admin_websites', JSON.stringify(next));
          const deletedList = JSON.parse(localStorage.getItem('aryan_deleted_websites') || '[]');
          const updatedList = deletedList.filter(id => String(id).trim() !== targetOriginalId);
          localStorage.setItem('aryan_deleted_websites', JSON.stringify(updatedList));
        } catch {}
        return next;
      });
    } else if (binItem.type === 'design') {
      setDesigns(prev => {
        const next = [binItem.data, ...prev.filter(d => String(d.id).trim() !== targetOriginalId)];
        try {
          localStorage.setItem('aryan_admin_designs', JSON.stringify(next));
          const deletedList = JSON.parse(localStorage.getItem('aryan_deleted_designs') || '[]');
          const updatedList = deletedList.filter(id => String(id).trim() !== targetOriginalId);
          localStorage.setItem('aryan_deleted_designs', JSON.stringify(updatedList));
        } catch {}
        return next;
      });
    }

    setRecycleBin(prev => {
      const next = prev.filter(b => b.id !== binItem.id);
      try {
        localStorage.setItem('aryan_recycle_bin', JSON.stringify(next));
      } catch {}
      return next;
    });

    try {
      window.dispatchEvent(new Event('aryan_portfolio_updated'));
      window.dispatchEvent(new Event('storage'));
    } catch {}

    if (onShowToast) onShowToast(`✓ Restored "${binItem.title}" back to active portfolio!`);
  };

  const handlePermanentDeleteFromBin = (binItem) => {
    setRecycleBin(prev => {
      const next = prev.filter(b => b.id !== binItem.id);
      try {
        localStorage.setItem('aryan_recycle_bin', JSON.stringify(next));
      } catch {}
      return next;
    });
    if (onShowToast) onShowToast(`Permanently deleted "${binItem.title}".`);
  };

  const handleEmptyRecycleBin = () => {
    setRecycleBin([]);
    try {
      localStorage.setItem('aryan_recycle_bin', '[]');
    } catch {}
    setEmptyBinModal(false);
    if (onShowToast) onShowToast('✓ Recycle Bin emptied. All deleted items wiped.');
  };

  // --- Visitor Analytics Handlers ---
  const handleClearVisitorLogs = () => {
    if (window.confirm('Clear all visitor tracking logs?')) {
      setVisitorLogs([]);
      try {
        localStorage.removeItem('aryan_visitor_logs');
        fetch('/api/analytics/visitors', { method: 'DELETE' }).catch(() => {});
      } catch {}
      if (onShowToast) onShowToast('Visitor traffic logs cleared.');
    }
  };

  const handleRefreshVisitorLogs = () => {
    try {
      const raw = localStorage.getItem('aryan_visitor_logs');
      setVisitorLogs(raw ? JSON.parse(raw) : []);
    } catch {}
    if (onShowToast) onShowToast('Visitor telemetry refreshed.');
  };

  // --- Message Actions ---
  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Delete this client inquiry?')) return;

    setMessages(prev => {
      const next = prev.filter(m => (m.id !== id && m.timestamp !== id));
      localStorage.setItem('aryan_contact_messages', JSON.stringify(next));
      return next;
    });
    if (onShowToast) onShowToast('Inquiry deleted.');

    try {
      fetch(`/api/contact/${id}`, { method: 'DELETE' }).catch(() => {});
    } catch {}
  };

  // Filtered lists
  const filteredWebsites = websites.filter(w => {
    const matchesCat = websiteCategory === 'all' || w.category === websiteCategory;
    const q = websiteSearch.toLowerCase();
    const matchesSearch = !q ||
      (w.name && w.name.toLowerCase().includes(q)) ||
      (w.domain && w.domain.toLowerCase().includes(q)) ||
      (w.tech && w.tech.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  const filteredDesigns = designs.filter(d => {
    return designCategory === 'all' || d.category === designCategory;
  });

  // Render passcode modal if not authenticated
  if (!isAuthenticated) {
    return (
      <AdminPasscodeModal
        isOpen={true}
        onSuccess={() => setIsAuthenticated(true)}
        onCancel={() => navigate('/')}
      />
    );
  }

  return (
    <div className="admin-dashboard-container">
      {/* Top Admin Navigation Header */}
      <header className="admin-header">
        <div className="admin-header-left">
          <Link to="/" className="back-link" title="Return to Public Site">
            <ArrowLeft size={18} />
            <span>Public Site</span>
          </Link>
          <div className="admin-title-badge">
            <span className="admin-status-dot"></span>
            <h1>Aryan Thakor <span>• CMS Studio & Security Portal</span></h1>
          </div>
        </div>

        <div className="admin-header-right">
          <ThemeToggle />
          <button onClick={loadAllData} className="btn-refresh" title="Refresh Live Data">
            <RefreshCw size={16} className={loading ? 'spinning' : ''} />
            <span>Refresh</span>
          </button>
          <button onClick={handleLogout} className="btn-logout" title="Lock & Logout">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="admin-body">
        {/* Sidebar Nav Tabs */}
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            <button
              className={`nav-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <LayoutDashboard size={18} />
              <span>Overview</span>
            </button>
            <button
              className={`nav-tab-btn ${activeTab === 'cms' ? 'active' : ''}`}
              onClick={() => setActiveTab('cms')}
            >
              <FileText size={18} />
              <span>Site CMS & Pages</span>
            </button>
            <button
              className={`nav-tab-btn ${activeTab === 'websites' ? 'active' : ''}`}
              onClick={() => setActiveTab('websites')}
            >
              <Globe size={18} />
              <span>Web Projects ({websites.length})</span>
            </button>
            <button
              className={`nav-tab-btn ${activeTab === 'designs' ? 'active' : ''}`}
              onClick={() => setActiveTab('designs')}
            >
              <Palette size={18} />
              <span>Graphic Designs ({designs.length})</span>
            </button>
            <button
              className={`nav-tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => setActiveTab('messages')}
            >
              <Mail size={18} />
              <span>Inquiries ({messages.length})</span>
            </button>
            <button
              className={`nav-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <ShieldCheck size={18} />
              <span>Security & 2FA {twoFactorEnabled ? '🛡️' : '⚠️'}</span>
            </button>
            <button
              className={`nav-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <Activity size={18} />
              <span>Live Visitors ({visitorLogs.length})</span>
            </button>
            <button
              className={`nav-tab-btn ${activeTab === 'recyclebin' ? 'active' : ''}`}
              onClick={() => setActiveTab('recyclebin')}
            >
              <Trash2 size={18} />
              <span>Recycle Bin ({recycleBin.length})</span>
            </button>
          </nav>
        </aside>

        {/* Content Panel */}
        <main className="admin-main-panel">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="tab-content overview-tab">
              <div className="welcome-banner">
                <div className="welcome-text">
                  <h2>Welcome back, Aryan! 👋</h2>
                  <p>Full CMS Suite: Edit entire website copy, manage 48+ client portals, track inquiries, and control Google Authenticator 2FA.</p>
                </div>
                <div className="welcome-actions">
                  <button onClick={() => setActiveTab('cms')} className="btn-primary-action">
                    <Edit size={16} />
                    <span>Edit Site Pages</span>
                  </button>
                  <button onClick={openAddWebsite} className="btn-secondary-action">
                    <Plus size={16} />
                    <span>Add Website</span>
                  </button>
                </div>
              </div>

              {/* Metric Cards */}
              <div className="stats-grid">
                <div className="stat-card" onClick={() => setActiveTab('cms')}>
                  <div className="stat-icon-wrapper cyan">
                    <FileText size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Site CMS Studio</span>
                    <span className="stat-number">Active</span>
                    <span className="stat-sub">Hero, About, Services, Contact</span>
                  </div>
                </div>

                <div className="stat-card" onClick={() => setActiveTab('websites')}>
                  <div className="stat-icon-wrapper purple">
                    <Globe size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Live Client Websites</span>
                    <span className="stat-number">{websites.length}</span>
                    <span className="stat-sub">Across 5 specialized sectors</span>
                  </div>
                </div>

                <div className="stat-card" onClick={() => setActiveTab('security')}>
                  <div className={`stat-icon-wrapper ${twoFactorEnabled ? 'cyan' : 'amber'}`}>
                    <ShieldCheck size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Google Authenticator</span>
                    <span className="stat-number">{twoFactorEnabled ? 'Enabled' : 'Disabled'}</span>
                    <span className="stat-sub">{twoFactorEnabled ? 'Protected with TOTP' : 'Click to enable 2FA'}</span>
                  </div>
                </div>

                <div className="stat-card" onClick={() => { setActiveTab('cms'); setCmsSubTab('resume'); }}>
                  <div className="stat-icon-wrapper purple">
                    <Download size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Live Resume (CV)</span>
                    <span className="stat-number">{resumeInfo.formattedSize || 'Active'}</span>
                    <span className="stat-sub">Click to Update or Test Download</span>
                  </div>
                </div>

                <div className="stat-card" onClick={() => setActiveTab('analytics')}>
                  <div className="stat-icon-wrapper cyan">
                    <Activity size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Live Site Visitors</span>
                    <span className="stat-number">{visitorLogs.length}</span>
                    <span className="stat-sub">IP, Location, Device & Telemetry</span>
                  </div>
                </div>

                <div className="stat-card" onClick={() => setActiveTab('recyclebin')}>
                  <div className="stat-icon-wrapper amber">
                    <Trash2 size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Recycle Bin</span>
                    <span className="stat-number">{recycleBin.length}</span>
                    <span className="stat-sub">30-day auto retention & restore</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions & Recent Messages */}
              <div className="recent-section">
                <div className="section-title-row">
                  <h3>Recent Client Messages ({messages.length})</h3>
                  <button onClick={() => setActiveTab('messages')} className="btn-link">View Inbox →</button>
                </div>

                {messages.length === 0 ? (
                  <div className="empty-box">
                    <Mail size={32} />
                    <p>No client inquiries yet. When visitors fill the Contact form, their messages will appear here.</p>
                  </div>
                ) : (
                  <div className="recent-messages-list">
                    {messages.slice(0, 3).map(msg => (
                      <div key={msg.id} className="recent-msg-card">
                        <div className="msg-top">
                          <strong>{msg.name}</strong>
                          <span className="msg-date">{new Date(msg.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="msg-subj">Subject: {msg.subject}</p>
                        <p className="msg-body-preview">{msg.message}</p>
                        <div className="msg-footer">
                          <a href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`} className="reply-btn">
                            <Send size={14} /> Reply to {msg.email}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: SITE CMS & PAGES */}
          {activeTab === 'cms' && (
            <div className="tab-content cms-tab">
              <div className="cms-sub-nav">
                <button
                  className={`sub-tab-btn ${cmsSubTab === 'hero' ? 'active' : ''}`}
                  onClick={() => setCmsSubTab('hero')}
                >
                  Hero & Bio
                </button>
                <button
                  className={`sub-tab-btn ${cmsSubTab === 'branding' ? 'active' : ''}`}
                  onClick={() => setCmsSubTab('branding')}
                >
                  Logo, Favicon & Photo 🎨
                </button>
                <button
                  className={`sub-tab-btn ${cmsSubTab === 'about' ? 'active' : ''}`}
                  onClick={() => setCmsSubTab('about')}
                >
                  About & Experience
                </button>
                <button
                  className={`sub-tab-btn ${cmsSubTab === 'services' ? 'active' : ''}`}
                  onClick={() => setCmsSubTab('services')}
                >
                  Services ({servicesList.length})
                </button>
                <button
                  className={`sub-tab-btn ${cmsSubTab === 'contact' ? 'active' : ''}`}
                  onClick={() => setCmsSubTab('contact')}
                >
                  Contact & Socials
                </button>
                <button
                  className={`sub-tab-btn ${cmsSubTab === 'resume' ? 'active' : ''}`}
                  onClick={() => setCmsSubTab('resume')}
                >
                  Resume & Documents 📄
                </button>
                <button
                  className={`sub-tab-btn ${cmsSubTab === 'seo' ? 'active' : ''}`}
                  onClick={() => setCmsSubTab('seo')}
                >
                  SEO & Meta
                </button>
              </div>

              {/* Sub-tab 1: Hero */}
              {cmsSubTab === 'hero' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveCmsSection('hero', heroForm);
                  }}
                  className="cms-form glass-card"
                >
                  <div className="cms-form-header">
                    <div>
                      <h3>Hero Section Editor</h3>
                      <p>Edit top greeting, headline, subtitle, bio, photo, and experience counters.</p>
                    </div>
                    <button type="submit" disabled={cmsSaving} className="btn-save">
                      <Save size={16} />
                      <span>{cmsSaving ? 'Saving...' : 'Save Hero Section'}</span>
                    </button>
                  </div>

                  {/* Home Hero Profile Photo */}
                  <div className="admin-photo-upload-box">
                    <div className="admin-photo-thumb-wrap">
                      <img
                        src={heroForm.profileImage || '/assets/profile/aryan_portrait.jpg'}
                        alt="Profile Preview"
                        className="admin-photo-thumb"
                      />
                    </div>
                    <div className="admin-photo-details">
                      <label className="admin-field-title">Homepage Profile Photo</label>
                      <p className="admin-field-subtitle">Photo displayed in the circular card on your Home page Hero section.</p>
                      <div className="upload-btn-wrap">
                        <label className="btn btn-primary upload-file-btn">
                          <Camera size={15} />
                          <span>Upload New Photo</span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleHeroPhotoSelect}
                            style={{ display: 'none' }}
                          />
                        </label>
                        {heroForm.profileImage && heroForm.profileImage !== '/assets/profile/aryan_portrait.jpg' && (
                          <button
                            type="button"
                            className="btn btn-secondary text-danger"
                            onClick={() => setHeroForm({ ...heroForm, profileImage: '/assets/profile/aryan_portrait.jpg' })}
                          >
                            <RefreshCw size={14} />
                            <span>Reset to Original</span>
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        className="mt-2 text-sm"
                        value={heroForm.profileImage || ''}
                        onChange={(e) => setHeroForm({ ...heroForm, profileImage: e.target.value })}
                        placeholder="Or enter Image URL (e.g. /assets/profile/aryan_portrait.jpg)"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Greeting & Name</label>
                      <input
                        type="text"
                        value={heroForm.name || ''}
                        onChange={(e) => setHeroForm({ ...heroForm, name: e.target.value })}
                        placeholder="e.g. Aryan Thakor"
                      />
                    </div>
                    <div className="form-group">
                      <label>Role Badge</label>
                      <input
                        type="text"
                        value={heroForm.roleBadge || ''}
                        onChange={(e) => setHeroForm({ ...heroForm, roleBadge: e.target.value })}
                        placeholder="e.g. Sr. Web Developer & Graphic Designer"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Hero Tagline / Secondary Headline</label>
                    <input
                      type="text"
                      value={heroForm.tagline || ''}
                      onChange={(e) => setHeroForm({ ...heroForm, tagline: e.target.value })}
                      placeholder="e.g. Building High-Impact Web & Brand Solutions."
                    />
                  </div>

                  <div className="form-group">
                    <label>Hero Bio Description</label>
                    <textarea
                      rows="3"
                      value={heroForm.desc || ''}
                      onChange={(e) => setHeroForm({ ...heroForm, desc: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Primary Button CTA Text</label>
                    <input
                      type="text"
                      value={heroForm.primaryCtaText || ''}
                      onChange={(e) => setHeroForm({ ...heroForm, primaryCtaText: e.target.value })}
                    />
                  </div>

                  <h4>Hero Stat Counters</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Websites Count (e.g. 48+)</label>
                      <input
                        type="text"
                        value={heroForm.stats?.websitesCount || ''}
                        onChange={(e) => setHeroForm({
                          ...heroForm,
                          stats: { ...heroForm.stats, websitesCount: e.target.value }
                        })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Experience Years (e.g. 4+)</label>
                      <input
                        type="text"
                        value={heroForm.stats?.experienceYears || ''}
                        onChange={(e) => setHeroForm({
                          ...heroForm,
                          stats: { ...heroForm.stats, experienceYears: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Delivery Rate (e.g. 100%)</label>
                      <input
                        type="text"
                        value={heroForm.stats?.deliveryRate || ''}
                        onChange={(e) => setHeroForm({
                          ...heroForm,
                          stats: { ...heroForm.stats, deliveryRate: e.target.value }
                        })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Satisfaction Rate (e.g. 99.8%)</label>
                      <input
                        type="text"
                        value={heroForm.stats?.satisfactionRate || ''}
                        onChange={(e) => setHeroForm({
                          ...heroForm,
                          stats: { ...heroForm.stats, satisfactionRate: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                </form>
              )}

              {/* Sub-tab: Logo, Favicon & Photo Branding */}
              {cmsSubTab === 'branding' && (
                <div className="cms-branding-grid">
                  {/* CARD 1: SITE BRAND LOGO */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      saveCmsSection('branding', brandingForm);
                    }}
                    className="cms-form glass-card branding-card"
                  >
                    <div className="cms-form-header">
                      <div>
                        <h3>🌟 Site Brand Logo (Navbar & Footer)</h3>
                        <p>Customize the logo displayed in the top header navbar and site footer.</p>
                      </div>
                      <button type="submit" disabled={cmsSaving} className="btn-save">
                        <Save size={16} />
                        <span>{cmsSaving ? 'Saving...' : 'Save Logo'}</span>
                      </button>
                    </div>

                    {/* Logo Live Preview (Dark & Light) */}
                    <div className="branding-preview-box">
                      <label className="preview-label">Live Navbar Logo Preview (Dark & Light Mode)</label>
                      <div className="preview-nav-mockups-grid">
                        {/* Dark Navbar Preview */}
                        <div className="preview-nav-item">
                          <span className="preview-sub-label">🌙 Dark Mode Header</span>
                          <div className="preview-nav-mockup dark-nav">
                            {brandingForm.logoImage ? (
                              <img
                                src={brandingForm.logoImage}
                                alt="Logo Preview"
                                className="brand-custom-logo-img"
                              />
                            ) : (
                              <div className="brand-logo">
                                <div className="logo-symbol">
                                  <span></span><span></span><span></span>
                                </div>
                                <span className="logo-text">{brandingForm.logoText || 'ARYAN'}<span className="dot">.</span></span>
                              </div>
                            )}
                            <span className="preview-badge dark-badge">Dark Preview</span>
                          </div>
                        </div>

                        {/* Light Navbar Preview */}
                        <div className="preview-nav-item">
                          <span className="preview-sub-label">☀️ Light Mode Header</span>
                          <div className="preview-nav-mockup light-nav">
                            {brandingForm.logoImage ? (
                              <img
                                src={brandingForm.logoImage}
                                alt="Logo Preview"
                                className="brand-custom-logo-img"
                              />
                            ) : (
                              <div className="brand-logo">
                                <div className="logo-symbol">
                                  <span></span><span></span><span></span>
                                </div>
                                <span className="logo-text">{brandingForm.logoText || 'ARYAN'}<span className="dot">.</span></span>
                              </div>
                            )}
                            <span className="preview-badge light-badge">Light Preview</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Logo Upload Option */}
                    <div className="form-group">
                      <label>Upload Logo File (PNG with transparency, SVG, JPG, WEBP)</label>
                      <div className="upload-btn-wrap">
                        <label className="btn btn-secondary upload-file-btn">
                          <Upload size={16} />
                          <span>Choose Logo Image</span>
                          <input
                            type="file"
                            accept="image/png,image/svg+xml,image/jpeg,image/webp"
                            onChange={handleLogoFileSelect}
                            style={{ display: 'none' }}
                          />
                        </label>
                        {brandingForm.logoImage && (
                          <button
                            type="button"
                            className="btn btn-secondary text-danger"
                            onClick={() => setBrandingForm({ ...brandingForm, logoImage: '' })}
                          >
                            <Trash2 size={16} />
                            <span>Remove Image (Use Text Logo)</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Logo URL Option */}
                    <div className="form-group">
                      <label>Or Paste Logo Image URL</label>
                      <input
                        type="text"
                        value={brandingForm.logoImage || ''}
                        onChange={(e) => setBrandingForm({ ...brandingForm, logoImage: e.target.value })}
                        placeholder="e.g. https://.../my-logo.png"
                      />
                    </div>

                    {/* Text Logo Alternative */}
                    <div className="form-group">
                      <label>Custom Brand Text (Used when no image is uploaded)</label>
                      <input
                        type="text"
                        value={brandingForm.logoText || ''}
                        onChange={(e) => setBrandingForm({ ...brandingForm, logoText: e.target.value })}
                        placeholder="e.g. ARYAN"
                      />
                    </div>
                  </form>

                  {/* CARD 2: BROWSER TAB FAVICON */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      saveCmsSection('branding', brandingForm);
                    }}
                    className="cms-form glass-card branding-card"
                  >
                    <div className="cms-form-header">
                      <div>
                        <h3>🌐 Browser Tab Favicon</h3>
                        <p>Change the icon displayed in the browser tab beside your site title.</p>
                      </div>
                      <button type="submit" disabled={cmsSaving} className="btn-save">
                        <Save size={16} />
                        <span>{cmsSaving ? 'Saving...' : 'Save Favicon'}</span>
                      </button>
                    </div>

                    {/* Favicon Simulated Tab Preview */}
                    <div className="branding-preview-box">
                      <label className="preview-label">Browser Tab Live Preview (Dark & Light Browser)</label>
                      <div className="preview-tabs-grid">
                        <div className="preview-tab-item">
                          <span className="preview-sub-label">🌙 Dark Browser Theme</span>
                          <div className="favicon-tab-mockup dark-tab">
                            {brandingForm.favicon ? (
                              <img src={brandingForm.favicon} alt="Favicon Preview" className="tab-favicon-img" />
                            ) : (
                              <Globe size={16} color="#A855F7" />
                            )}
                            <span className="tab-title-text">Aryan Thakor | Senior Web Developer</span>
                            <X size={14} className="tab-close-icon" />
                          </div>
                        </div>

                        <div className="preview-tab-item">
                          <span className="preview-sub-label">☀️ Light Browser Theme</span>
                          <div className="favicon-tab-mockup light-tab">
                            {brandingForm.favicon ? (
                              <img src={brandingForm.favicon} alt="Favicon Preview" className="tab-favicon-img" />
                            ) : (
                              <Globe size={16} color="#A855F7" />
                            )}
                            <span className="tab-title-text">Aryan Thakor | Senior Web Developer</span>
                            <X size={14} className="tab-close-icon" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Favicon Upload Option */}
                    <div className="form-group">
                      <label>Upload Favicon File (.ico, .png, .svg)</label>
                      <div className="upload-btn-wrap">
                        <label className="btn btn-secondary upload-file-btn">
                          <Upload size={16} />
                          <span>Choose Favicon File</span>
                          <input
                            type="file"
                            accept="image/x-icon,image/png,image/svg+xml"
                            onChange={handleFaviconFileSelect}
                            style={{ display: 'none' }}
                          />
                        </label>
                        {brandingForm.favicon && (
                          <button
                            type="button"
                            className="btn btn-secondary text-danger"
                            onClick={() => setBrandingForm({ ...brandingForm, favicon: '' })}
                          >
                            <Trash2 size={16} />
                            <span>Reset to Default Favicon</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Favicon URL Option */}
                    <div className="form-group">
                      <label>Or Paste Favicon URL</label>
                      <input
                        type="text"
                        value={brandingForm.favicon || ''}
                        onChange={(e) => setBrandingForm({ ...brandingForm, favicon: e.target.value })}
                        placeholder="e.g. /favicon.ico or https://.../favicon.png"
                      />
                    </div>
                  </form>

                  {/* CARD 3: HOME HERO PROFILE PHOTO */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      saveCmsSection('hero', heroForm);
                    }}
                    className="cms-form glass-card branding-card"
                  >
                    <div className="cms-form-header">
                      <div>
                        <h3>📸 Homepage Hero Profile Photo</h3>
                        <p>Change the main photo displayed on the Home page Hero card.</p>
                      </div>
                      <button type="submit" disabled={cmsSaving} className="btn-save">
                        <Save size={16} />
                        <span>{cmsSaving ? 'Saving...' : 'Save Photo'}</span>
                      </button>
                    </div>

                    {/* Hero Photo Preview */}
                    <div className="branding-preview-box">
                      <label className="preview-label">Live Homepage Photo Preview</label>
                      <div className="hero-photo-preview-wrap">
                        <div className="hero-photo-circle">
                          <img
                            src={heroForm.profileImage || '/assets/profile/aryan_portrait.jpg'}
                            alt="Profile Preview"
                            className="preview-portrait-img"
                          />
                        </div>
                        <div className="hero-photo-info">
                          <h4>{heroForm.name || 'Aryan Thakor'}</h4>
                          <p>{heroForm.roleBadge || 'Sr. Web Developer & Graphic Designer'}</p>
                          <span className="badge-status-dot">● Active on Home Page</span>
                        </div>
                      </div>
                    </div>

                    {/* Photo Upload Option */}
                    <div className="form-group">
                      <label>Upload New Photo from Computer or Phone (JPG, PNG, WEBP)</label>
                      <div className="upload-btn-wrap">
                        <label className="btn btn-primary upload-file-btn">
                          <Camera size={16} />
                          <span>Choose New Photo</span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleHeroPhotoSelect}
                            style={{ display: 'none' }}
                          />
                        </label>
                        {heroForm.profileImage && heroForm.profileImage !== '/assets/profile/aryan_portrait.jpg' && (
                          <button
                            type="button"
                            className="btn btn-secondary text-danger"
                            onClick={() => setHeroForm({ ...heroForm, profileImage: '/assets/profile/aryan_portrait.jpg' })}
                          >
                            <RefreshCw size={16} />
                            <span>Reset to Original Portrait</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Photo URL Option */}
                    <div className="form-group">
                      <label>Or Paste Image URL</label>
                      <input
                        type="text"
                        value={heroForm.profileImage || ''}
                        onChange={(e) => setHeroForm({ ...heroForm, profileImage: e.target.value })}
                        placeholder="e.g. /assets/profile/aryan_portrait.jpg or https://.../photo.jpg"
                      />
                    </div>
                  </form>
                </div>
              )}

              {/* Sub-tab 2: About & Experience */}
              {cmsSubTab === 'about' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveCmsSection('about', aboutForm);
                  }}
                  className="cms-form glass-card"
                >
                  <div className="cms-form-header">
                    <div>
                      <h3>About & Timeline Editor</h3>
                      <p>Update your career story, current job title, company, and timeline details.</p>
                    </div>
                    <button type="submit" disabled={cmsSaving} className="btn-save">
                      <Save size={16} />
                      <span>{cmsSaving ? 'Saving...' : 'Save About Section'}</span>
                    </button>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Section Badge</label>
                      <input
                        type="text"
                        value={aboutForm.badge || ''}
                        onChange={(e) => setAboutForm({ ...aboutForm, badge: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Page Title</label>
                      <input
                        type="text"
                        value={aboutForm.title || ''}
                        onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Overview Summary</label>
                    <textarea
                      rows="2"
                      value={aboutForm.desc || ''}
                      onChange={(e) => setAboutForm({ ...aboutForm, desc: e.target.value })}
                    />
                  </div>

                  <h4>Current Position Details</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Current Role Title</label>
                      <input
                        type="text"
                        value={aboutForm.currentRole || ''}
                        onChange={(e) => setAboutForm({ ...aboutForm, currentRole: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Current Company & Location</label>
                      <input
                        type="text"
                        value={aboutForm.currentCompany || ''}
                        onChange={(e) => setAboutForm({ ...aboutForm, currentCompany: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Period / Dates</label>
                    <input
                      type="text"
                      value={aboutForm.currentPeriod || ''}
                      onChange={(e) => setAboutForm({ ...aboutForm, currentPeriod: e.target.value })}
                    />
                  </div>

                  <h4>Internship Experience</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Internship Role</label>
                      <input
                        type="text"
                        value={aboutForm.internshipRole || ''}
                        onChange={(e) => setAboutForm({ ...aboutForm, internshipRole: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Company</label>
                      <input
                        type="text"
                        value={aboutForm.internshipCompany || ''}
                        onChange={(e) => setAboutForm({ ...aboutForm, internshipCompany: e.target.value })}
                      />
                    </div>
                  </div>
                </form>
              )}

              {/* Sub-tab 3: Services */}
              {cmsSubTab === 'services' && (
                <div className="cms-services-wrap">
                  <div className="cms-form-header">
                    <div>
                      <h3>Services Management</h3>
                      <p>Modify service titles, descriptions, and technology capability tags.</p>
                    </div>
                    <button
                      onClick={() => saveCmsSection('services', servicesList)}
                      disabled={cmsSaving}
                      className="btn-save"
                    >
                      <Save size={16} />
                      <span>{cmsSaving ? 'Saving...' : 'Save All Services'}</span>
                    </button>
                  </div>

                  <div className="cms-services-grid">
                    {servicesList.map((srv, idx) => (
                      <div key={srv.id || idx} className="cms-service-card glass-card">
                        <div className="form-group">
                          <label>Service Title #{idx + 1}</label>
                          <input
                            type="text"
                            value={srv.title || ''}
                            onChange={(e) => {
                              const updated = [...servicesList];
                              updated[idx].title = e.target.value;
                              setServicesList(updated);
                            }}
                          />
                        </div>
                        <div className="form-group">
                          <label>Description</label>
                          <textarea
                            rows="3"
                            value={srv.desc || ''}
                            onChange={(e) => {
                              const updated = [...servicesList];
                              updated[idx].desc = e.target.value;
                              setServicesList(updated);
                            }}
                          />
                        </div>
                        <div className="form-group">
                          <label>Tags (Comma-separated)</label>
                          <input
                            type="text"
                            value={Array.isArray(srv.tags) ? srv.tags.join(', ') : (srv.tags || '')}
                            onChange={(e) => {
                              const updated = [...servicesList];
                              updated[idx].tags = e.target.value.split(',').map(t => t.trim());
                              setServicesList(updated);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-tab 4: Contact & Socials */}
              {cmsSubTab === 'contact' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveCmsSection('contact', contactForm);
                  }}
                  className="cms-form glass-card"
                >
                  <div className="cms-form-header">
                    <div>
                      <h3>Contact Info & Social Media CMS</h3>
                      <p>Update direct contact details, email, phone, location, and manage social profiles (Instagram, LinkedIn, GitHub, etc.) displayed in the Footer and Contact page.</p>
                    </div>
                    <button type="submit" disabled={cmsSaving} className="btn-save">
                      <Save size={16} />
                      <span>{cmsSaving ? 'Saving...' : 'Save Contact & Socials'}</span>
                    </button>
                  </div>

                  {/* Section Title & Description */}
                  <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid var(--border-subtle)' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '14px', color: 'var(--accent-primary)' }}>
                      Contact Page Headers
                    </h4>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Section Badge</label>
                        <input
                          type="text"
                          value={contactForm.badge || ''}
                          onChange={(e) => setContactForm({ ...contactForm, badge: e.target.value })}
                          placeholder="e.g. Get In Touch"
                        />
                      </div>
                      <div className="form-group">
                        <label>Page Title</label>
                        <input
                          type="text"
                          value={contactForm.title || ''}
                          onChange={(e) => setContactForm({ ...contactForm, title: e.target.value })}
                          placeholder="e.g. Let's Discuss Your Next Project"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Page Subtitle / Description</label>
                      <textarea
                        rows="2"
                        value={contactForm.desc || ''}
                        onChange={(e) => setContactForm({ ...contactForm, desc: e.target.value })}
                        placeholder="Brief description about availability and services"
                      />
                    </div>
                  </div>

                  {/* Direct Contact Details */}
                  <div style={{ marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid var(--border-subtle)' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '14px', color: 'var(--accent-primary)' }}>
                      Direct Contact Details
                    </h4>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Email Address</label>
                        <input
                          type="email"
                          value={contactForm.email || ''}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          placeholder="thakoraryan2002@gmail.com"
                        />
                      </div>
                      <div className="form-group">
                        <label>Mobile Phone</label>
                        <input
                          type="text"
                          value={contactForm.phone || ''}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          placeholder="+91 76987 95009"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>WhatsApp Link</label>
                        <input
                          type="text"
                          value={contactForm.whatsapp || ''}
                          onChange={(e) => setContactForm({ ...contactForm, whatsapp: e.target.value })}
                          placeholder="https://wa.me/917698795009"
                        />
                      </div>
                      <div className="form-group">
                        <label>Location / City</label>
                        <input
                          type="text"
                          value={contactForm.location || ''}
                          onChange={(e) => setContactForm({ ...contactForm, location: e.target.value })}
                          placeholder="Ahmedabad, Gujarat, India"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Availability Statement</label>
                      <input
                        type="text"
                        value={contactForm.availability || ''}
                        onChange={(e) => setContactForm({ ...contactForm, availability: e.target.value })}
                        placeholder="Available for Senior Roles & Commercial Contracts"
                      />
                    </div>
                  </div>

                  {/* Social Media Accounts Manager */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                      <h4 style={{ fontSize: '15px', fontWeight: 600, margin: 0, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Share2 size={16} />
                        <span>Social Media Profiles ({Array.isArray(contactForm.socials) ? contactForm.socials.length : 0})</span>
                      </h4>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        All active profiles appear in the website Footer and Contact page.
                      </span>
                    </div>

                    {/* Social links list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                      {Array.isArray(contactForm.socials) && contactForm.socials.map((social) => (
                        <div
                          key={social.id}
                          className="admin-social-item"
                        >
                          <div className="admin-social-item-icon">
                            <SocialIcon platform={social.platform} size={18} />
                          </div>

                          <div style={{ width: '130px', flexShrink: 0 }}>
                            <strong style={{ fontSize: '13.5px', display: 'block' }}>{social.platform}</strong>
                            <label style={{ fontSize: '11px', color: social.enabled !== false ? '#10B981' : 'var(--text-muted)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <input
                                type="checkbox"
                                checked={social.enabled !== false}
                                onChange={() => handleToggleSocial(social.id)}
                              />
                              {social.enabled !== false ? '● Visible' : '○ Hidden'}
                            </label>
                          </div>

                          <div style={{ flexGrow: 1, minWidth: '220px' }}>
                            <input
                              type="text"
                              value={social.url || ''}
                              onChange={(e) => handleUpdateSocial(social.id, 'url', e.target.value)}
                              placeholder={`https://${social.platform.toLowerCase()}.com/username`}
                              className="admin-social-input"
                            />
                          </div>

                          <a
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary btn-sm"
                            title="Visit link in new tab"
                            style={{ padding: '8px 10px' }}
                          >
                            <ExternalLink size={14} />
                          </a>

                          <button
                            type="button"
                            onClick={() => handleDeleteSocial(social.id)}
                            className="btn btn-sm btn-delete-social"
                            style={{
                              padding: '8px 10px',
                              background: 'rgba(239, 68, 68, 0.1)',
                              color: '#EF4444',
                              border: '1px solid rgba(239, 68, 68, 0.25)'
                            }}
                            title="Delete this social link"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add New Social Profile Card */}
                    <div className="admin-add-social-card">
                      <h5 style={{ fontSize: '13.5px', fontWeight: 600, marginBottom: '12px' }}>
                        + Add New Social Media Profile
                      </h5>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ width: '160px' }}>
                          <select
                            value={newSocialPlatform}
                            onChange={(e) => setNewSocialPlatform(e.target.value)}
                            className="admin-social-select"
                          >
                            <option value="Instagram">Instagram</option>
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="GitHub">GitHub</option>
                            <option value="WhatsApp">WhatsApp</option>
                            <option value="Twitter">Twitter / X</option>
                            <option value="YouTube">YouTube</option>
                            <option value="Facebook">Facebook</option>
                            <option value="Behance">Behance</option>
                            <option value="Dribbble">Dribbble</option>
                            <option value="Custom">Custom Platform...</option>
                          </select>
                        </div>

                        {newSocialPlatform === 'Custom' && (
                          <div style={{ width: '140px' }}>
                            <input
                              type="text"
                              placeholder="Platform Name"
                              value={customPlatformName}
                              onChange={(e) => setCustomPlatformName(e.target.value)}
                              className="admin-social-input"
                            />
                          </div>
                        )}

                        <div style={{ flexGrow: 1, minWidth: '220px' }}>
                          <input
                            type="text"
                            placeholder={
                              newSocialPlatform === 'Instagram' ? 'https://instagram.com/your_handle' :
                              newSocialPlatform === 'LinkedIn' ? 'https://linkedin.com/in/your_profile' :
                              newSocialPlatform === 'GitHub' ? 'https://github.com/your_username' :
                              'https://...'
                            }
                            value={newSocialUrl}
                            onChange={(e) => setNewSocialUrl(e.target.value)}
                            className="admin-social-input"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={handleAddSocialLink}
                          className="btn btn-primary btn-sm"
                          style={{ padding: '9px 16px' }}
                        >
                          <Plus size={15} />
                          <span>Add Social Profile</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Save Action */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                    <button type="submit" disabled={cmsSaving} className="btn-save" style={{ minWidth: '220px' }}>
                      <Save size={16} />
                      <span>{cmsSaving ? 'Saving...' : 'Save All Contact & Socials'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Sub-tab: Resume & Documents */}
              {cmsSubTab === 'resume' && (
                <div className="cms-form glass-card">
                  <div className="cms-form-header">
                    <div>
                      <h3>Resume & CV Document Manager</h3>
                      <p>Manage and update your official Resume PDF. Uploading a new PDF instantly updates all download links across the website (Navbar, Home, and Mobile Drawer).</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => downloadResume(resumeInfo.originalName || 'Aryan_Thakor_Resume.pdf')}
                      className="btn-secondary-action"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    >
                      <Download size={16} />
                      <span>Test Download Live CV</span>
                    </button>
                  </div>

                  {/* Active Resume Status Card */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '20px 24px',
                    background: 'rgba(99, 102, 241, 0.08)',
                    border: '1px solid rgba(99, 102, 241, 0.25)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '28px',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'rgba(99, 102, 241, 0.2)',
                        color: 'var(--accent-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <FileText size={24} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{resumeInfo.originalName || 'Aryan_Thakor_Resume.pdf'}</h4>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: '12px',
                            background: 'rgba(16, 185, 129, 0.15)',
                            color: '#10B981',
                            border: '1px solid rgba(16, 185, 129, 0.3)'
                          }}>
                            ● LIVE & ACTIVE
                          </span>
                        </div>
                        <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                          Size: <strong>{resumeInfo.formattedSize || '171.7 KB'}</strong> • Last Updated: <strong>{resumeInfo.lastModified ? new Date(resumeInfo.lastModified).toLocaleString() : 'System Default'}</strong>
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => downloadResume(resumeInfo.originalName || 'Aryan_Thakor_Resume.pdf')}
                      className="btn btn-secondary btn-sm"
                    >
                      <Download size={14} />
                      <span>Download Current File</span>
                    </button>
                  </div>

                  {/* Upload New Resume PDF Box */}
                  <div style={{
                    padding: '28px',
                    border: '2px dashed var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: 'rgba(99, 102, 241, 0.12)',
                      color: 'var(--accent-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px'
                    }}>
                      <Upload size={28} />
                    </div>
                    <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>Select New Resume PDF to Upload</h4>
                    <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 20px' }}>
                      Choose an updated PDF from your computer. Max file size: 10MB. Once uploaded, any visitor clicking "CV" or "Download Resume" will immediately get this updated file.
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <input
                        type="file"
                        id="resume-pdf-input"
                        accept=".pdf,application/pdf"
                        style={{ display: 'none' }}
                        onChange={handleResumeFileSelect}
                      />
                      <label
                        htmlFor="resume-pdf-input"
                        className="btn btn-secondary"
                        style={{ cursor: 'pointer', margin: 0 }}
                      >
                        <FileText size={16} />
                        <span>{selectedResumeFile ? 'Change Selected PDF' : 'Browse PDF File'}</span>
                      </label>

                      {selectedResumeFile && (
                        <button
                          type="button"
                          onClick={handleUploadResume}
                          disabled={resumeUploading}
                          className="btn btn-primary"
                        >
                          <Upload size={16} />
                          <span>{resumeUploading ? 'Uploading & Updating...' : 'Upload & Update Live Resume'}</span>
                        </button>
                      )}
                    </div>

                    {selectedResumeFile && (
                      <div style={{
                        marginTop: '18px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: 'rgba(99, 102, 241, 0.15)',
                        border: '1px solid var(--accent-primary)',
                        padding: '10px 18px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '13.5px'
                      }}>
                        <CheckCircle size={16} color="#10B981" />
                        <span><strong>{selectedResumeFile.name}</strong> ({(selectedResumeFile.size / 1024).toFixed(1)} KB) ready to upload</span>
                        <button
                          type="button"
                          onClick={() => setSelectedResumeFile(null)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px', marginLeft: '6px' }}
                          title="Remove selection"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Sub-tab 5: SEO */}
              {cmsSubTab === 'seo' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveCmsSection('seo', seoForm);
                  }}
                  className="cms-form glass-card"
                >
                  <div className="cms-form-header">
                    <div>
                      <h3>SEO & Meta Settings</h3>
                      <p>Configure search engine title tags, meta descriptions, and index keywords.</p>
                    </div>
                    <button type="submit" disabled={cmsSaving} className="btn-save">
                      <Save size={16} />
                      <span>{cmsSaving ? 'Saving...' : 'Save SEO Meta'}</span>
                    </button>
                  </div>

                  <div className="form-group">
                    <label>Site Title Tag</label>
                    <input
                      type="text"
                      value={seoForm.siteTitle || ''}
                      onChange={(e) => setSeoForm({ ...seoForm, siteTitle: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Meta Description</label>
                    <textarea
                      rows="3"
                      value={seoForm.metaDesc || ''}
                      onChange={(e) => setSeoForm({ ...seoForm, metaDesc: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Keywords</label>
                    <input
                      type="text"
                      value={seoForm.keywords || ''}
                      onChange={(e) => setSeoForm({ ...seoForm, keywords: e.target.value })}
                    />
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: WEBSITES MANAGER */}
          {activeTab === 'websites' && (
            <div className="tab-content websites-tab">
              <div className="panel-toolbar">
                <div className="toolbar-left">
                  <div className="admin-search-box">
                    <Search size={16} />
                    <input
                      type="text"
                      placeholder="Search website name, domain or tech..."
                      value={websiteSearch}
                      onChange={(e) => setWebsiteSearch(e.target.value)}
                    />
                    {websiteSearch && (
                      <button onClick={() => setWebsiteSearch('')} className="clear-btn">
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  <select
                    className="admin-select"
                    value={websiteCategory}
                    onChange={(e) => setWebsiteCategory(e.target.value)}
                  >
                    <option value="all">All Categories ({websites.length})</option>
                    <option value="ecommerce">E-Commerce & Beauty</option>
                    <option value="hospitality">Hotels & Resorts</option>
                    <option value="corporate">Corporate, Tech & Finance</option>
                    <option value="industrial">Industrial & Logistics</option>
                    <option value="health">Healthcare & Lifestyle</option>
                  </select>
                </div>

                <div className="toolbar-right">
                  <button onClick={openAddWebsite} className="btn-primary-action">
                    <Plus size={16} />
                    <span>Add New Website</span>
                  </button>
                </div>
              </div>

              {/* Websites Table */}
              <div className="data-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Website Name</th>
                      <th>Category</th>
                      <th>Tech Stack</th>
                      <th>Live Link</th>
                      <th className="th-actions">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWebsites.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="td-empty">
                          No websites found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredWebsites.map((site, index) => (
                        <tr key={site.id}>
                          <td className="td-id">{index + 1}</td>
                          <td className="td-name">
                            <div className="site-name-cell">
                              <span className="site-title">{site.name}</span>
                              <span className="site-domain">{site.domain || site.url}</span>
                            </div>
                          </td>
                          <td>
                            <span className={`cat-pill ${site.category}`}>
                              {site.badge || site.category}
                            </span>
                          </td>
                          <td className="td-tech">{site.tech}</td>
                          <td>
                            <a
                              href={site.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="table-link"
                            >
                              <span>Visit</span>
                              <ExternalLink size={13} />
                            </a>
                          </td>
                          <td className="td-actions">
                            <button
                              onClick={() => openEditWebsite(site)}
                              className="action-btn edit"
                              title="Edit website details"
                            >
                              <Edit size={15} />
                            </button>
                            <button
                              onClick={() => promptDeleteWebsite(site.id, site.name)}
                              className="action-btn delete"
                              title="Delete website"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: GRAPHIC DESIGNS MANAGER */}
          {activeTab === 'designs' && (
            <div className="tab-content designs-tab">
              <div className="panel-toolbar">
                <div className="toolbar-left">
                  <select
                    className="admin-select"
                    value={designCategory}
                    onChange={(e) => setDesignCategory(e.target.value)}
                  >
                    <option value="all">All Categories ({designs.length})</option>
                    <option value="logos">Logos & Branding</option>
                    <option value="posts">Social Media Posts</option>
                    <option value="manipulation">Product Manipulation</option>
                    <option value="retouching">Photo Restoration & Retouch</option>
                  </select>
                </div>

                <div className="toolbar-right">
                  <button onClick={openAddDesign} className="btn-primary-action">
                    <Plus size={16} />
                    <span>Add New Design</span>
                  </button>
                </div>
              </div>

              {/* Designs Grid */}
              <div className="admin-designs-grid">
                {filteredDesigns.length === 0 ? (
                  <div className="empty-box full-grid">
                    <Palette size={32} />
                    <p>No designs found in this category.</p>
                  </div>
                ) : (
                  filteredDesigns.map((design) => (
                    <div key={design.id} className="admin-design-card">
                      <div className="design-thumbnail">
                        <img
                          src={design.image}
                          alt={design.title}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/assets/profile/aryan-designer.jpg';
                          }}
                        />
                        <span className="card-cat-badge">{design.category}</span>
                      </div>
                      <div className="design-card-content">
                        <h4>{design.title}</h4>
                        <p className="card-tag">{design.tag || 'Design Work'}</p>
                        {design.caption && <p className="card-caption">{design.caption}</p>}
                        <div className="card-actions">
                          <button
                            onClick={() => openEditDesign(design)}
                            className="btn-edit-sm"
                          >
                            <Edit size={14} /> Edit
                          </button>
                          <button
                            onClick={() => promptDeleteDesign(design.id, design.title)}
                            className="btn-delete-sm"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: CLIENT INQUIRIES */}
          {activeTab === 'messages' && (
            <div className="tab-content messages-tab">
              <div className="panel-toolbar">
                <div className="toolbar-left">
                  <h3>Client Contact Messages ({messages.length})</h3>
                </div>
                <div className="toolbar-right">
                  <button onClick={loadAllData} className="btn-refresh">
                    <RefreshCw size={15} />
                    <span>Refresh Inbox</span>
                  </button>
                </div>
              </div>

              {messages.length === 0 ? (
                <div className="empty-box">
                  <Mail size={36} />
                  <h3>No client messages yet</h3>
                  <p>Inquiries received through your contact page will be saved here automatically.</p>
                </div>
              ) : (
                <div className="messages-grid">
                  {messages.map((msg) => (
                    <div key={msg.id} className="inquiry-card">
                      <div className="inquiry-header">
                        <div className="sender-info">
                          <h4>{msg.name}</h4>
                          <span className="sender-email">{msg.email}</span>
                          {msg.phone && <span className="sender-phone">📞 {msg.phone}</span>}
                        </div>
                        <div className="inquiry-meta">
                          <span className="inquiry-date">
                            {new Date(msg.createdAt || Date.now()).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="btn-delete-msg"
                            title="Delete this message"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      <div className="inquiry-subject">
                        <strong>Subject:</strong> {msg.subject}
                      </div>

                      <div className="inquiry-body">
                        {msg.message}
                      </div>

                      <div className="inquiry-actions">
                        <a
                          href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Portfolio Inquiry')}&body=Hi ${encodeURIComponent(msg.name)},%0D%0A%0D%0AThank you for contacting me regarding your project!`}
                          className="btn-reply"
                        >
                          <Send size={14} />
                          <span>Reply to Client</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: SECURITY & GOOGLE AUTHENTICATOR (2FA) */}
          {activeTab === 'security' && (
            <div className="tab-content security-tab">
              <div className="security-cards-grid">
                {/* 2FA Status Card */}
                <div className="security-card glass-card">
                  <div className="sec-header">
                    <div className="sec-icon-title">
                      <Smartphone size={24} className="cyan-icon" />
                      <div>
                        <h3>Google Authenticator (TOTP 2FA)</h3>
                        <p>Protect your portfolio admin portal with 2-Factor Authentication.</p>
                      </div>
                    </div>
                    <span className={`status-pill ${twoFactorEnabled ? 'enabled' : 'disabled'}`}>
                      {twoFactorEnabled ? 'Active & Protected' : 'Disabled'}
                    </span>
                  </div>

                  {!twoFactorEnabled && !twoFASetup && (
                    <div className="sec-body">
                      <p>
                        Enable Google Authenticator to require a 6-digit dynamic security code generated on your phone whenever you log in.
                      </p>
                      <button
                        onClick={handleStart2FASetup}
                        disabled={twoFALoading}
                        className="btn-primary-action"
                      >
                        <Smartphone size={16} />
                        <span>{twoFALoading ? 'Generating QR...' : 'Setup Google Authenticator'}</span>
                      </button>
                    </div>
                  )}

                  {twoFASetup && !twoFactorEnabled && (
                    <div className="twofa-setup-flow">
                      <div className="qr-container">
                        <img src={twoFASetup.qrCodeUrl} alt="Google Authenticator QR Code" />
                      </div>

                      <div className="setup-instructions">
                        <h4>Step 1: Scan QR Code</h4>
                        <p>Open <strong>Google Authenticator</strong> (or Authy) on your mobile phone, tap <strong>"+"</strong>, and scan the QR code above.</p>
                        <p className="secret-text">
                          Manual Key: <code>{twoFASetup.secret}</code>
                        </p>

                        <h4>Step 2: Enter 6-digit Code to Activate</h4>
                        <form onSubmit={handleEnable2FA} className="verify-2fa-form">
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="000000"
                            value={verify2FACode}
                            onChange={(e) => setVerify2FACode(e.target.value.replace(/\D/g, ''))}
                            autoFocus
                          />
                          <button type="submit" disabled={twoFALoading || verify2FACode.length < 6} className="btn-primary">
                            <span>{twoFALoading ? 'Verifying...' : 'Activate 2FA'}</span>
                          </button>
                          <button type="button" onClick={() => setTwoFASetup(null)} className="btn-secondary">
                            Cancel
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                  {twoFactorEnabled && (
                    <div className="sec-body">
                      <div className="active-protection-note">
                        <CheckCircle size={20} color="#10B981" />
                        <div>
                          <strong>Your portfolio admin account is secured with Google Authenticator.</strong>
                          <p>Every login attempt requires your mobile authenticator code.</p>
                        </div>
                      </div>

                      {emergencyKey && (
                        <div className="emergency-key-box">
                          <span>Emergency Recovery Key (Save this safely!):</span>
                          <code>{emergencyKey}</code>
                        </div>
                      )}

                      <div className="disable-2fa-box">
                        <h4>Disable 2FA</h4>
                        <p>Enter your admin passcode to deactivate Google Authenticator:</p>
                        <form onSubmit={handleDisable2FA} className="inline-form">
                          <input
                            type="password"
                            placeholder="Enter current passcode"
                            value={disablePasscode}
                            onChange={(e) => setDisablePasscode(e.target.value)}
                          />
                          <button type="submit" className="btn-danger-sm">
                            Deactivate 2FA
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>

                {/* Change Passcode Card */}
                <div className="security-card glass-card">
                  <div className="sec-header">
                    <div className="sec-icon-title">
                      <KeyRound size={24} className="purple-icon" />
                      <div>
                        <h3>Change Admin Passcode</h3>
                        <p>Update your master login passcode (default: aryan2026).</p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleChangePasscode} className="cms-form">
                    <div className="form-group">
                      <label>Current Passcode</label>
                      <input
                        type="password"
                        placeholder="Current passcode"
                        value={oldPass}
                        onChange={(e) => setOldPass(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>New Passcode</label>
                      <input
                        type="password"
                        placeholder="At least 4 characters"
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                      />
                    </div>

                    <button type="submit" className="btn-secondary-action">
                      <Save size={16} />
                      <span>Update Passcode</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* TAB: LIVE VISITOR TRAFFIC & TELEMETRY */}
          {activeTab === 'analytics' && (() => {
            const totalVisits = visitorLogs.length;
            const uniqueIps = new Set(visitorLogs.map(v => v.ip)).size;
            const mobileCount = visitorLogs.filter(v => v.device === 'Mobile').length;
            const tabletCount = visitorLogs.filter(v => v.device === 'Tablet').length;
            const desktopCount = visitorLogs.filter(v => v.device === 'Desktop').length;
            const mobilePct = totalVisits > 0 ? Math.round(((mobileCount + tabletCount) / totalVisits) * 100) : 0;
            const desktopPct = totalVisits > 0 ? Math.round((desktopCount / totalVisits) * 100) : 0;

            const countryCounts = {};
            visitorLogs.forEach(v => {
              if (v.country && v.country !== 'Protected' && v.country !== 'Global') {
                countryCounts[v.country] = (countryCounts[v.country] || 0) + 1;
              }
            });
            let topCountry = 'Global / Direct';
            let maxCount = 0;
            Object.entries(countryCounts).forEach(([country, count]) => {
              if (count > maxCount) {
                maxCount = count;
                topCountry = country;
              }
            });

            return (
              <div className="tab-content analytics-tab">
                <div className="analytics-header-banner">
                  <div className="analytics-header-text">
                    <div className="live-indicator-row">
                      <span className="live-pulse-dot"></span>
                      <h2>Live Visitor Traffic & Geolocation Telemetry</h2>
                    </div>
                    <p>Real-time telemetry of visitors viewing your public portfolio. Tracks IP address, City, Country, Device type (Desktop vs Mobile), OS & active pages visited.</p>
                  </div>
                  <div className="analytics-actions">
                    <button onClick={handleRefreshVisitorLogs} className="btn-secondary-action" title="Refresh Live Telemetry">
                      <RefreshCw size={15} />
                      <span>Refresh</span>
                    </button>
                    <button onClick={handleClearVisitorLogs} className="btn-clear-logs" title="Clear all visitor logs">
                      <Trash2 size={15} />
                      <span>Clear Logs</span>
                    </button>
                  </div>
                </div>

                {/* 4 Summary Stat Cards */}
                <div className="analytics-stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon-wrapper cyan">
                      <Activity size={24} />
                    </div>
                    <div className="stat-info">
                      <span className="stat-label">Total Visits Tracked</span>
                      <span className="stat-number">{totalVisits}</span>
                      <span className="stat-sub">Across all public portfolio pages</span>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon-wrapper purple">
                      <Users size={24} />
                    </div>
                    <div className="stat-info">
                      <span className="stat-label">Unique Visitors (IPs)</span>
                      <span className="stat-number">{uniqueIps}</span>
                      <span className="stat-sub">Individual client networks</span>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon-wrapper cyan">
                      <Monitor size={24} />
                    </div>
                    <div className="stat-info">
                      <span className="stat-label">Device Breakdown</span>
                      <span className="stat-number">{desktopPct}% Desktop</span>
                      <span className="stat-sub">{mobilePct}% Mobile & Tablet ({mobileCount + tabletCount} mobile)</span>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon-wrapper amber">
                      <MapPin size={24} />
                    </div>
                    <div className="stat-info">
                      <span className="stat-label">Top Location</span>
                      <span className="stat-number">{topCountry}</span>
                      <span className="stat-sub">Leading geographic origin</span>
                    </div>
                  </div>
                </div>

                {/* Visitor Logs Table */}
                <div className="analytics-table-container">
                  <div className="section-title-row">
                    <h3>Recent Visitor Sessions ({visitorLogs.length})</h3>
                    <span className="telemetry-badge">📡 Real-Time Beacon Active</span>
                  </div>

                  {visitorLogs.length === 0 ? (
                    <div className="empty-box">
                      <Activity size={36} />
                      <p>No visitor traffic recorded yet today.</p>
                      <span className="empty-sub">Open your live portfolio in a private window or on your smartphone to see real-time IP, country, and device telemetry here!</span>
                    </div>
                  ) : (
                    <div className="visitor-table-wrap">
                      <table className="visitor-table">
                        <thead>
                          <tr>
                            <th>Visitor IP</th>
                            <th>Location & Country</th>
                            <th>Device Type</th>
                            <th>Platform & OS</th>
                            <th>Browser</th>
                            <th>Page Visited</th>
                            <th>Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {visitorLogs.map((log, idx) => (
                            <tr key={log.id || idx}>
                              <td>
                                <div className="visitor-ip-cell">
                                  <span className="ip-text">{log.ip}</span>
                                  {log.pageViews > 1 && (
                                    <span className="page-views-badge">{log.pageViews} views</span>
                                  )}
                                </div>
                              </td>
                              <td>
                                <div className="location-cell">
                                  <span className="flag-emoji">{log.flag || '🌐'}</span>
                                  <div>
                                    <strong>{log.city || 'Direct Visitor'}</strong>
                                    <span className="country-sub">{log.region ? `${log.region}, ` : ''}{log.country || 'Global'}</span>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span className={`device-pill ${log.device?.toLowerCase()}`}>
                                  {log.device === 'Mobile' ? <Smartphone size={13} /> : log.device === 'Tablet' ? <Tablet size={13} /> : <Monitor size={13} />}
                                  <span>{log.device || 'Desktop'}</span>
                                </span>
                              </td>
                              <td>
                                <span className="os-text">{log.os || 'Unknown OS'}</span>
                              </td>
                              <td>
                                <span className="browser-text">{log.browser || 'Web Browser'}</span>
                              </td>
                              <td>
                                <span className="page-pill">{log.page || '/'}</span>
                              </td>
                              <td>
                                <span className="time-text">
                                  {log.timestamp ? (() => {
                                    const diff = Date.now() - log.timestamp;
                                    const mins = Math.floor(diff / 60000);
                                    if (mins < 1) return 'Just now';
                                    if (mins < 60) return `${mins}m ago`;
                                    const hrs = Math.floor(mins / 60);
                                    if (hrs < 24) return `${hrs}h ago`;
                                    return new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });
                                  })() : 'Recent'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* TAB: RECYCLE BIN (30-DAY RETENTION) */}
          {activeTab === 'recyclebin' && (
            <div className="tab-content recycle-bin-tab">
              <div className="recycle-bin-header">
                <div className="bin-header-text">
                  <div className="bin-title-row">
                    <Trash2 size={24} className="amber-icon" />
                    <h2>Portfolio Recycle Bin (રીસાઇકલ બિન)</h2>
                  </div>
                  <p>Deleted website projects and graphic designs are safely held here for 30 days before permanent deletion. You can restore them anytime back to your live portfolio.</p>
                </div>
                <div className="bin-actions">
                  <button
                    onClick={() => setEmptyBinModal(true)}
                    disabled={recycleBin.length === 0}
                    className="btn-empty-bin"
                    title="Permanently remove all items from bin"
                  >
                    <Trash2 size={16} />
                    <span>Empty Recycle Bin ({recycleBin.length})</span>
                  </button>
                </div>
              </div>

              {/* 30-Day Auto Retention Banner */}
              <div className="bin-retention-banner">
                <Clock size={20} className="amber-icon" />
                <div className="retention-info">
                  <strong>30-Day Auto Purge Policy:</strong>
                  <span> Each deleted item displays a countdown badge. Once 30 days pass, expired items are automatically erased. You can restore any item with a single click.</span>
                </div>
              </div>

              {/* Deleted Items List */}
              {recycleBin.length === 0 ? (
                <div className="empty-box">
                  <Archive size={42} />
                  <h3>Recycle Bin is Empty</h3>
                  <p>When you delete a website project or graphic design from Admin, it safely moves here instead of being lost forever.</p>
                </div>
              ) : (
                <div className="bin-items-grid">
                  {recycleBin.map((item) => {
                    const daysLeft = Math.max(0, Math.ceil(((item.expiresAt || (item.deletedAt + 30 * 24 * 60 * 60 * 1000)) - Date.now()) / (1000 * 60 * 60 * 24)));
                    return (
                      <div key={item.id} className="bin-card">
                        <div className="bin-card-top">
                          <span className={`bin-type-badge ${item.type}`}>
                            {item.type === 'website' ? <Globe size={13} /> : <Palette size={13} />}
                            <span>{item.type === 'website' ? 'Web Project' : 'Graphic Design'}</span>
                          </span>
                          <span className={`countdown-badge ${daysLeft <= 3 ? 'urgent' : ''}`} title="Remaining days before auto-purge">
                            <Clock size={12} />
                            <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Expiring today'}</span>
                          </span>
                        </div>

                        <div className="bin-card-body">
                          {item.image && (
                            <div className="bin-thumbnail">
                              <img
                                src={item.image}
                                alt={item.title}
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            </div>
                          )}
                          <div className="bin-details">
                            <h4 className="bin-item-title">{item.title}</h4>
                            <p className="bin-item-subtitle">{item.subtitle || item.category || 'Portfolio Entry'}</p>
                            <span className="bin-date-stamp">
                              Deleted on: {new Date(item.deletedAt || Date.now()).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                        </div>

                        <div className="bin-card-footer">
                          <button
                            onClick={() => handleRestoreFromBin(item)}
                            className="btn-restore-item"
                            title="Restore item back to live portfolio"
                          >
                            <RotateCcw size={15} />
                            <span>Restore to Portfolio</span>
                          </button>
                          <button
                            onClick={() => handlePermanentDeleteFromBin(item)}
                            className="btn-perm-delete"
                            title="Delete permanently right now"
                          >
                            <Trash2 size={15} />
                            <span>Delete Permanently</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* MODAL: Add / Edit Website */}
      {showWebsiteModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="modal-header">
              <h3>{editingWebsite ? 'Edit Website Project' : 'Add New Client Website'}</h3>
              <button onClick={() => setShowWebsiteModal(false)} className="close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveWebsite} className="admin-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Website Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Harvey Prince"
                    value={websiteForm.name}
                    onChange={(e) => setWebsiteForm({ ...websiteForm, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Live URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="e.g. https://www.harveyprince.com/"
                    value={websiteForm.url}
                    onChange={(e) => setWebsiteForm({ ...websiteForm, url: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Domain</label>
                  <input
                    type="text"
                    placeholder="e.g. harveyprince.com"
                    value={websiteForm.domain}
                    onChange={(e) => setWebsiteForm({ ...websiteForm, domain: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={websiteForm.category}
                    onChange={(e) => setWebsiteForm({ ...websiteForm, category: e.target.value })}
                  >
                    <option value="ecommerce">E-Commerce & Beauty</option>
                    <option value="hospitality">Hotels & Resorts</option>
                    <option value="corporate">Corporate, Tech & Finance</option>
                    <option value="industrial">Industrial & Logistics</option>
                    <option value="health">Healthcare & Lifestyle</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Badge / Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Luxury E-Com or Custom Build"
                    value={websiteForm.badge}
                    onChange={(e) => setWebsiteForm({ ...websiteForm, badge: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Technology Stack</label>
                  <input
                    type="text"
                    placeholder="e.g. React / Tailwind, Shopify, Next.js"
                    value={websiteForm.tech}
                    onChange={(e) => setWebsiteForm({ ...websiteForm, tech: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  placeholder="Short description of the client's business and tech delivered..."
                  value={websiteForm.desc}
                  onChange={(e) => setWebsiteForm({ ...websiteForm, desc: e.target.value })}
                ></textarea>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowWebsiteModal(false)} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  <span>{editingWebsite ? 'Update Project' : 'Add Project to Portfolio'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add / Edit Design */}
      {showDesignModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="modal-header">
              <h3>{editingDesign ? 'Edit Graphic Design' : 'Add New Graphic Design Work'}</h3>
              <button onClick={() => setShowDesignModal(false)} className="close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveDesign} className="admin-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Design Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nova Brandmark"
                    value={designForm.title}
                    onChange={(e) => setDesignForm({ ...designForm, title: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={designForm.category}
                    onChange={(e) => setDesignForm({ ...designForm, category: e.target.value })}
                  >
                    <option value="logos">Logos & Branding</option>
                    <option value="posts">Social Media Posts</option>
                    <option value="manipulation">Product Manipulation</option>
                    <option value="retouching">Photo Restoration & Retouch</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tag / Specialty</label>
                  <input
                    type="text"
                    placeholder="e.g. Branding, Vector Art, Retouch"
                    value={designForm.tag}
                    onChange={(e) => setDesignForm({ ...designForm, tag: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Image Path or URL *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. /assets/logos/my-logo.png"
                    value={designForm.image}
                    onChange={(e) => setDesignForm({ ...designForm, image: e.target.value })}
                  />
                </div>
              </div>

              {designForm.image && (
                <div className="image-preview-box">
                  <span>Image Preview:</span>
                  <div className="preview-frame">
                    <img
                      src={designForm.image}
                      alt="Preview"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/profile/aryan-designer.jpg';
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Caption / Case Note</label>
                <textarea
                  rows="3"
                  placeholder="Design brief, typography, concept details..."
                  value={designForm.caption}
                  onChange={(e) => setDesignForm({ ...designForm, caption: e.target.value })}
                ></textarea>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowDesignModal(false)} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  <span>{editingDesign ? 'Update Design' : 'Add Design to Portfolio'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Custom In-App Delete Confirmation */}
      {deleteConfirm.isOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal delete-confirm-modal">
            <div className="delete-modal-icon-wrap">
              <AlertCircle size={34} />
            </div>

            <h3 className="delete-modal-title">
              Move to Recycle Bin?
            </h3>

            <p className="delete-modal-desc">
              Are you sure you want to delete <strong>"{deleteConfirm.title}"</strong>? It will be safely moved to your <strong>Recycle Bin</strong> for 30 days, where you can restore it anytime.
            </p>

            <div className="delete-modal-actions">
              <button
                type="button"
                onClick={() => setDeleteConfirm({ isOpen: false, type: '', id: null, title: '' })}
                className="btn-cancel"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeDeleteConfirmed}
                className="btn-delete-confirm"
              >
                <Trash2 size={16} />
                <span>Move to Recycle Bin</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Empty Recycle Bin Confirmation */}
      {emptyBinModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal delete-confirm-modal">
            <div className="delete-modal-icon-wrap" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
              <Trash2 size={34} />
            </div>

            <h3 className="delete-modal-title">
              Empty Recycle Bin? (રીસાઇકલ બિન ખાલી કરો)
            </h3>

            <p className="delete-modal-desc">
              Are you sure you want to permanently delete all <strong>{recycleBin.length} item(s)</strong> from your Recycle Bin? This action is irreversible and all selected items will be completely erased.
            </p>

            <div className="delete-modal-actions">
              <button
                type="button"
                onClick={() => setEmptyBinModal(false)}
                className="btn-cancel"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEmptyRecycleBin}
                className="btn-delete-confirm"
              >
                <Trash2 size={16} />
                <span>Yes, Empty Everything</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
