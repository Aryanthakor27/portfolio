import React from 'react';
import Link from 'next/link';

export default function Custom404() {
  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '4rem', fontWeight: '800', margin: '0', color: '#6366f1' }}>404</h1>
      <h2 style={{ fontSize: '1.75rem', margin: '1rem 0', color: 'var(--text-primary, #ffffff)' }}>
        Page Not Found
      </h2>
      <p style={{ maxWidth: '480px', color: 'var(--text-secondary, #94a3b8)', marginBottom: '2rem', lineHeight: '1.6' }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 28px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: '#ffffff',
          borderRadius: '9999px',
          textDecoration: 'none',
          fontWeight: '600',
          boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
        }}
      >
        Return to Home
      </Link>
    </div>
  );
}
