import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminDashboard from '../views/AdminDashboard';

export default function AdminPage(props) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedSecret = (localStorage.getItem('aryan_admin_secret_key') || 'aryan2026').trim();
      const params = new URLSearchParams(window.location.search);
      const providedKey = (params.get('key') || '').trim();
      const isAlreadyAuthed = sessionStorage.getItem('aryan_admin_auth') === 'true';

      if ((providedKey && providedKey === storedSecret) || isAlreadyAuthed) {
        setAuthorized(true);
      } else {
        router.replace('/');
      }
    }
  }, [router]);

  if (!authorized) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#94a3b8', fontSize: '14px' }}>Verifying Security Clearance...</div>
      </div>
    );
  }

  return <AdminDashboard {...props} />;
}
