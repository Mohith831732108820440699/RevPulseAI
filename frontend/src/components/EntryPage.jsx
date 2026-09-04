import React from 'react';
import { Zap, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';

export default function EntryPage({ onCheckIn }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'radial-gradient(ellipse at top, #0c1938 0%, #060a14 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Background Decorative Glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(0, 242, 254, 0.12) 0%, rgba(37, 99, 235, 0.05) 50%, transparent 70%)',
        pointerEvents: 'none',
        borderRadius: '50%'
      }}></div>

      {/* Main Hero Card Container */}
      <div className="glass-panel" style={{
        maxWidth: '1000px',
        width: '100%',
        borderRadius: '24px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)'
      }}>

        {/* Hero Image Container with Seamless Hotspot Overlay */}
        <div
          onClick={onCheckIn}
          style={{
            position: 'relative',
            width: '100%',
            maxHeight: '520px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#040914',
            cursor: 'pointer'
          }}
        >
          <img
            src="/entry_banner.png"
            alt="RevPulse AI Check-In Banner"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '520px',
              objectFit: 'cover',
              display: 'block'
            }}
          />

          {/* Interactive Hotspot highlighting the image's built-in Check-In button cleanly */}
          <div style={{
            position: 'absolute',
            bottom: '4.5%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '28%',
            height: '14%',
            borderRadius: '16px',
            border: '2px solid transparent',
            boxShadow: '0 0 15px rgba(0, 242, 254, 0.2)',
            transition: 'all 0.25s ease',
            pointerEvents: 'none'
          }}
          className="checkin-hotspot"
          ></div>
        </div>

        {/* Action Button & Feature Highlights Section */}
        <div style={{
          padding: '24px 40px',
          background: 'var(--bg-card)',
          borderTop: '1px solid var(--border-color)'
        }}>
          
          {/* Explicit Enter Console CTA */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <button
              className="btn btn-primary"
              onClick={onCheckIn}
              style={{
                padding: '14px 36px',
                fontSize: '1.1rem',
                borderRadius: '50px',
                boxShadow: '0 8px 25px rgba(0, 242, 254, 0.35)'
              }}
            >
              Enter RevPulse Agent Platform <ArrowRight size={20} />
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px'
          }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{
                padding: '12px',
                borderRadius: '12px',
                background: 'rgba(0, 242, 254, 0.15)',
                color: 'var(--primary-cyan)'
              }}>
                <Zap size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-contrast)' }}>Closed-Loop Recovery</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4' }}>
                  Real-time ingestion for Stripe, Shopify, Chargebee, and B2B invoices.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{
                padding: '12px',
                borderRadius: '12px',
                background: 'rgba(168, 85, 247, 0.15)',
                color: '#a855f7'
              }}>
                <Cpu size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-contrast)' }}>AI Root Cause Engine</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4' }}>
                  LLM reasoning engine categorizes failure causes and drafts personalized outreach.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{
                padding: '12px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981'
              }}>
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-contrast)' }}>Safety Policy Gates</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4' }}>
                  Bounded execution with retry caps, cooldowns, and human operator approval gates.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Footer text */}
      <div style={{ marginTop: '24px', fontSize: '0.8rem', color: 'var(--text-dim)', textAlign: 'center' }}>
        RevPulse AI Engine • Powered by Closed-Loop Agentic Recovery System Architecture
      </div>

    </div>
  );
}
