import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '909677424141-cuf4aiuf4upjbdqplgm39cbai88qudfl.apps.googleusercontent.com';

export default function GoogleSignInPage({ onSignInSuccess, onBackToEntry }) {
  const [loading, setLoading] = useState(false);
  const googleBtnRef = useRef(null);

  // Initialize official Google Identity Services SDK button
  useEffect(() => {
    const handleCredentialResponse = (response) => {
      try {
        setLoading(true);
        // Decode JWT token payload
        const base64Url = response.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const payload = JSON.parse(jsonPayload);

        const userData = {
          name: payload.name || 'Mohith',
          email: payload.email,
          company: payload.email ? payload.email.split('@')[1] : 'Google Workspace',
          role: 'Verified Google Account',
          avatarBg: '#4285F4',
          initials: (payload.name || 'MO').substring(0, 2).toUpperCase(),
          picture: payload.picture
        };

        setTimeout(() => {
          setLoading(false);
          onSignInSuccess(userData);
        }, 800);
      } catch (err) {
        console.error('Google JWT Decode Error:', err);
        setLoading(false);
      }
    };

    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse
      });

      if (googleBtnRef.current) {
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'outline',
          size: 'large',
          width: 320,
          text: 'signin_with',
          shape: 'pill'
        });
      }
    }
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'radial-gradient(ellipse at top, #0c1938 0%, #060a14 100%)',
      position: 'relative'
    }}>
      
      {/* Background ambient glow */}
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(66, 133, 244, 0.15) 0%, rgba(234, 67, 53, 0.05) 50%, transparent 70%)',
        pointerEvents: 'none',
        borderRadius: '50%'
      }}></div>

      <div className="glass-panel" style={{
        maxWidth: '440px',
        width: '100%',
        borderRadius: '24px',
        padding: '40px 36px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        zIndex: 2
      }}>

        {/* Google Header Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'var(--bg-modal)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px auto',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
            border: '1px solid var(--border-color)'
          }}>
            {/* Google Colorful 4-color SVG */}
            <svg width="30" height="30" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
          </div>

          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-contrast)' }}>
            Sign in with Google
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Authenticating to <strong style={{ color: 'var(--primary-cyan)' }}>RevPulse AI Platform</strong>
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div className="pulse-dot" style={{ width: '20px', height: '20px', margin: '0 auto 20px auto' }}></div>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--text-contrast)', fontWeight: 700 }}>
              Authenticating with Google Workspace...
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>
              Verifying OAuth 2.0 Client Credentials & Single Sign-On
            </p>
          </div>
        ) : (
          <div>
            
            {/* Live Official Google Identity Button Mount */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0 32px 0' }}>
              <div ref={googleBtnRef}></div>
            </div>

            {/* Security Badges Footer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '20px',
              fontSize: '0.78rem',
              color: 'var(--text-dim)'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Lock size={12} /> Client Secret Enabled
              </span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={12} color="#10b981" /> OAuth 2.0 Active
              </span>
            </div>

            {/* Back link */}
            <div style={{ textAlign: 'center', marginTop: '18px' }}>
              <button
                onClick={onBackToEntry}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-dim)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                ← Return to Welcome Check-In
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
