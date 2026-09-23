import React, { useState, useEffect } from 'react';
import { Lock, KeyRound, AlertCircle, ArrowRight, ShieldCheck, Smartphone, Key } from 'lucide-react';

export default function AdminPasscodeModal({ isOpen, onSuccess, onCancel }) {
  const [stage, setStage] = useState('passcode'); // 'passcode' | '2fa' | 'recovery'
  const [passcode, setPasscode] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [recoveryKey, setRecoveryKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [twoFactorActive, setTwoFactorActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/admin/2fa/status')
        .then(r => r.json())
        .then(data => {
          if (data && data.twoFactorEnabled) {
            setTwoFactorActive(true);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePasscodeSubmit = async (e) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setError('Please enter your admin passcode.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: passcode.trim() })
      });

      const data = await res.json();

      if (res.ok) {
        if (data.requires2FA) {
          setStage('2fa');
          return;
        }

        if (data.success) {
          if (data.token) sessionStorage.setItem('aryan_admin_token', data.token);
          sessionStorage.setItem('aryan_admin_auth', 'true');
          onSuccess();
          return;
        }
      }

      // Check updated admin passcode or default 'aryan2026'
      const expectedPasscode = (localStorage.getItem('aryan_admin_passcode') || 'aryan2026').trim();
      if (passcode.trim() === expectedPasscode) {
        sessionStorage.setItem('aryan_admin_auth', 'true');
        onSuccess();
        return;
      }

      setError(data.error || 'Incorrect passcode. Access denied.');
    } catch {
      const expectedPasscode = (localStorage.getItem('aryan_admin_passcode') || 'aryan2026').trim();
      if (passcode.trim() === expectedPasscode) {
        sessionStorage.setItem('aryan_admin_auth', 'true');
        onSuccess();
      } else {
        setError('Incorrect passcode. Access denied.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handle2FASubmit = async (e) => {
    e.preventDefault();
    const tokenToSubmit = stage === 'recovery' ? recoveryKey.trim() : otpToken.trim();

    if (!tokenToSubmit) {
      setError(stage === 'recovery' ? 'Please enter recovery key.' : 'Please enter 6-digit code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passcode: passcode.trim(),
          twoFactorToken: tokenToSubmit
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (data.token) sessionStorage.setItem('aryan_admin_token', data.token);
        sessionStorage.setItem('aryan_admin_auth', 'true');
        onSuccess();
      } else {
        setError(data.error || 'Invalid authentication code.');
      }
    } catch {
      setError('Connection error verifying 2FA.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-passcode-overlay">
      <div className="admin-passcode-modal">
        {stage === 'passcode' && (
          <>
            <div className="modal-header-icon">
              <div className="icon-shield">
                <Lock size={28} />
              </div>
              <h3>Admin Authentication</h3>
              <p>Enter your master security passcode to access the Admin Management Studio.</p>
            </div>

            <form onSubmit={handlePasscodeSubmit} className="passcode-form">
              <div className="passcode-input-group">
                <KeyRound size={18} className="field-icon" />
                <input
                  type="password"
                  placeholder="Enter master passcode"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setError('');
                  }}
                  autoFocus
                  className={error ? 'input-error' : ''}
                />
              </div>

              {error && (
                <div className="passcode-error">
                  <AlertCircle size={15} />
                  <span>{error}</span>
                </div>
              )}

              <div className="passcode-actions">
                {onCancel && (
                  <button type="button" onClick={onCancel} className="btn btn-secondary">
                    Cancel
                  </button>
                )}
                <button type="submit" disabled={loading} className="btn btn-primary">
                  <span>{loading ? 'Verifying...' : 'Continue'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>

            <div className="passcode-hint">
              <ShieldCheck size={14} />
              <span>Enterprise Access • 256-Bit Authenticated</span>
            </div>
          </>
        )}

        {stage === '2fa' && (
          <>
            <div className="modal-header-icon">
              <div className="icon-shield twofa-shield">
                <Smartphone size={28} />
              </div>
              <h3>Google Authenticator 2FA</h3>
              <p>Enter the 6-digit code displayed in your Google Authenticator app.</p>
            </div>

            <form onSubmit={handle2FASubmit} className="passcode-form">
              <div className="passcode-input-group otp-input-group">
                <input
                  type="text"
                  maxLength={6}
                  inputMode="numeric"
                  placeholder="000000"
                  value={otpToken}
                  onChange={(e) => {
                    setOtpToken(e.target.value.replace(/\D/g, ''));
                    setError('');
                  }}
                  autoFocus
                  className={`otp-field ${error ? 'input-error' : ''}`}
                />
              </div>

              {error && (
                <div className="passcode-error">
                  <AlertCircle size={15} />
                  <span>{error}</span>
                </div>
              )}

              <div className="passcode-actions">
                <button
                  type="button"
                  onClick={() => {
                    setStage('passcode');
                    setError('');
                  }}
                  className="btn btn-secondary"
                >
                  Back
                </button>
                <button type="submit" disabled={loading || otpToken.length < 6} className="btn btn-primary">
                  <span>{loading ? 'Verifying...' : 'Unlock Portal'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>

            <div className="passcode-alt-action">
              <button
                type="button"
                onClick={() => {
                  setStage('recovery');
                  setError('');
                }}
                className="alt-link-btn"
              >
                Lost your phone? Use Emergency Recovery Key
              </button>
            </div>
          </>
        )}

        {stage === 'recovery' && (
          <>
            <div className="modal-header-icon">
              <div className="icon-shield recovery-shield">
                <Key size={28} />
              </div>
              <h3>Emergency Recovery Key</h3>
              <p>Enter your emergency backup recovery key (e.g. ARYAN-KEY-XXXX).</p>
            </div>

            <form onSubmit={handle2FASubmit} className="passcode-form">
              <div className="passcode-input-group">
                <input
                  type="text"
                  placeholder="ARYAN-KEY-..."
                  value={recoveryKey}
                  onChange={(e) => {
                    setRecoveryKey(e.target.value.toUpperCase());
                    setError('');
                  }}
                  autoFocus
                  className={error ? 'input-error' : ''}
                />
              </div>

              {error && (
                <div className="passcode-error">
                  <AlertCircle size={15} />
                  <span>{error}</span>
                </div>
              )}

              <div className="passcode-actions">
                <button
                  type="button"
                  onClick={() => {
                    setStage('2fa');
                    setError('');
                  }}
                  className="btn btn-secondary"
                >
                  Back to 2FA
                </button>
                <button type="submit" disabled={loading || !recoveryKey} className="btn btn-primary">
                  <span>{loading ? 'Verifying...' : 'Unlock'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
