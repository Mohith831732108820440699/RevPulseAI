import React from 'react';
import { Zap, Activity, Cpu, ShieldCheck, Play, Network, Sun, Moon, Home, LogOut, UserCheck } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenSimulator, onTriggerRandom, theme, toggleTheme, user, onSignOut, onOpenProfile }) {
  return (
    <header className="glass-panel" style={{ margin: '20px 24px 0 24px', padding: '16px 24px', borderRadius: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('entry')}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0, 242, 254, 0.4)'
          }}>
            <Zap size={24} color="#040914" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-contrast)', margin: 0 }}>
                RevPulse <span style={{ color: 'var(--primary-cyan)' }}>AI</span>
              </h1>
              <span className="pulse-dot"></span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              Autonomous Enterprise Revenue Recovery Agent
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', gap: '8px', background: 'var(--bg-subtle)', padding: '6px', borderRadius: '12px' }}>
          <button
            className={`btn ${activeTab === 'entry' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            onClick={() => setActiveTab('entry')}
          >
            <Home size={16} /> Check-In Page
          </button>
          <button
            className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            onClick={() => setActiveTab('dashboard')}
          >
            <Activity size={16} /> Live Monitor
          </button>
          <button
            className={`btn ${activeTab === 'analytics' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            onClick={() => setActiveTab('analytics')}
          >
            <Cpu size={16} /> ROI & Root Causes
          </button>
          <button
            className={`btn ${activeTab === 'audit' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            onClick={() => setActiveTab('audit')}
          >
            <ShieldCheck size={16} /> Governance Audit
          </button>
          <button
            className={`btn ${activeTab === 'topology' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            onClick={() => setActiveTab('topology')}
          >
            <Network size={16} /> System Topology
          </button>
        </nav>

        {/* Controls: User Profile, Theme Toggle & Simulators */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          
          {/* User Profile Badge (Clickable to open Credentials Profile Dashboard) */}
          {user ? (
            <div
              onClick={onOpenProfile}
              title="Click to view User Credentials & Profile Dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-color)',
                padding: '4px 12px 4px 6px',
                borderRadius: '25px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary-cyan)';
                e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 242, 254, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: user.avatarBg || '#0284c7',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {user.picture ? (
                  <img src={user.picture} alt={user.name} style={{ width: '100%', height: '100%' }} />
                ) : (
                  user.initials || 'GU'
                )}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-contrast)', fontWeight: 700 }}>
                {user.name}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSignOut();
                }}
                title="Sign Out of Account"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-dim)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px',
                  marginLeft: '2px'
                }}
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              className="btn btn-secondary"
              onClick={() => setActiveTab('signin')}
              style={{ fontSize: '0.85rem' }}
            >
              <UserCheck size={16} color="var(--primary-cyan)" /> Google Sign-In
            </button>
          )}

          {/* Light / Dark Mode Toggle */}
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
          >
            {theme === 'dark' ? (
              <Sun size={16} color="#eab308" />
            ) : (
              <Moon size={16} color="#8b5cf6" />
            )}
          </button>

          <button className="btn btn-secondary" onClick={onTriggerRandom} title="Inject a quick random payment failure webhook">
            <Play size={16} color="var(--primary-cyan)" /> Quick Simulate
          </button>
          <button className="btn btn-primary" onClick={onOpenSimulator}>
            <Zap size={16} /> Sandbox
          </button>
        </div>

      </div>
    </header>
  );
}
