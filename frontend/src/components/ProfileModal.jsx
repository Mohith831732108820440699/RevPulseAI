import React, { useState } from 'react';
import { 
  X, User, Key, ShieldCheck, Copy, Check, Eye, EyeOff, Lock, Building, 
  Mail, LogOut, Cpu, CreditCard, Banknote, Users, Bell, FileText, 
  CheckCircle2, AlertCircle, RefreshCw, Smartphone, Globe, Plus, Shield, Sliders
} from 'lucide-react';

export default function ProfileModal({ user, onClose, onSignOut }) {
  if (!user) return null;

  const [activeTab, setActiveTab] = useState('developer'); // Defaulting to Developer & Credentials tab
  const [copiedKey, setCopiedKey] = useState(null);
  const [showSecrets, setShowSecrets] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);
  const [autoCapture, setAutoCapture] = useState(true);

  // Invite Team State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Developer');

  // Team list
  const [teamMembers, setTeamMembers] = useState([
    { name: user.name || 'Mohith', email: user.email || 'mohith@acme.com', role: 'Owner', status: 'Active' },
    { name: 'Alex Vance', email: 'alex.vance@acme-corp.com', role: 'Finance Admin', status: 'Active' },
    { name: 'Sarah Jenkins', email: 's.jenkins@nexusdigital.io', role: 'Developer', status: 'Active' }
  ]);

  const credentials = [
    {
      label: 'AI Agent API Token / Key',
      keyName: 'AI_AGENT_TOKEN',
      value: import.meta.env.VITE_AI_AGENT_TOKEN || 'Configured in backend environment (.env)',
      type: 'secret',
      desc: 'Active production authentication key for RevPulse AI Reasoning Engine'
    },
    {
      label: 'Google OAuth Client ID',
      keyName: 'GOOGLE_CLIENT_ID',
      value: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'Configured in frontend environment (.env)',
      type: 'public',
      desc: 'Configured Google Cloud OAuth 2.0 Web Application Client ID'
    },
    {
      label: 'Google OAuth Client Secret',
      keyName: 'GOOGLE_CLIENT_SECRET',
      value: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || 'Configured in backend environment (.env)',
      type: 'secret',
      desc: 'Google OAuth Client Secret used for backend token verification'
    },
    {
      label: 'Webhook Signing Secret',
      keyName: 'WEBHOOK_SECRET',
      value: import.meta.env.VITE_WEBHOOK_SECRET || 'Configured in backend environment (.env)',
      type: 'secret',
      desc: 'Secret key for verifying Stripe & Shopify incoming event signatures'
    }
  ];

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const maskValue = (val) => {
    if (val.length <= 12) return '••••••••••••';
    return val.substring(0, 6) + '••••••••••••••••••••' + val.substring(val.length - 4);
  };

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setTeamMembers(prev => [
      ...prev,
      { name: inviteEmail.split('@')[0], email: inviteEmail, role: inviteRole, status: 'Invited' }
    ]);
    setInviteEmail('');
    setShowInviteModal(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '980px', padding: '0', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
        
        {/* Profile Dashboard Layout: Sidebar + Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '620px' }}>
          
          {/* Left Sidebar Navigation */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            borderRight: '1px solid var(--border-color)',
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              {/* User Identity Brief */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', padding: '0 8px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: user.avatarBg || 'linear-gradient(135deg, #00f2fe, #4facfe)',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 15px rgba(0, 242, 254, 0.3)'
                }}>
                  {user.picture ? (
                    <img src={user.picture} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                  ) : (
                    user.initials || (user.name ? user.name.substring(0, 2).toUpperCase() : 'U')
                  )}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-contrast)', margin: 0 }}>
                    {user.name}
                  </h4>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                    Merchant ID: <code style={{ color: 'var(--primary-cyan)' }}>MID-904182</code>
                  </span>
                </div>
              </div>

              {/* Navigation Menu Links */}
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <button
                  className={`btn ${activeTab === 'developer' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start', fontSize: '0.85rem', width: '100%' }}
                  onClick={() => setActiveTab('developer')}
                >
                  <Key size={16} /> API Keys & Credentials
                </button>
                <button
                  className={`btn ${activeTab === 'account' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start', fontSize: '0.85rem', width: '100%' }}
                  onClick={() => setActiveTab('account')}
                >
                  <User size={16} /> Personal Account
                </button>
                <button
                  className={`btn ${activeTab === 'business' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start', fontSize: '0.85rem', width: '100%' }}
                  onClick={() => setActiveTab('business')}
                >
                  <Building size={16} /> Business Profile
                </button>
                <button
                  className={`btn ${activeTab === 'kyc' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start', fontSize: '0.85rem', width: '100%' }}
                  onClick={() => setActiveTab('kyc')}
                >
                  <CheckCircle2 size={16} color="#10b981" /> KYC Verification (85%)
                </button>
                <button
                  className={`btn ${activeTab === 'banking' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start', fontSize: '0.85rem', width: '100%' }}
                  onClick={() => setActiveTab('banking')}
                >
                  <Banknote size={16} /> Bank & Settlements
                </button>
                <button
                  className={`btn ${activeTab === 'security' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start', fontSize: '0.85rem', width: '100%' }}
                  onClick={() => setActiveTab('security')}
                >
                  <ShieldCheck size={16} /> Security Center
                </button>
                <button
                  className={`btn ${activeTab === 'team' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start', fontSize: '0.85rem', width: '100%' }}
                  onClick={() => setActiveTab('team')}
                >
                  <Users size={16} /> Team & Permissions
                </button>
                <button
                  className={`btn ${activeTab === 'payments' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start', fontSize: '0.85rem', width: '100%' }}
                  onClick={() => setActiveTab('payments')}
                >
                  <Sliders size={16} /> Payment Settings
                </button>
              </nav>
            </div>

            {/* Bottom Sign-Out */}
            <div>
              <button
                className="btn btn-danger"
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
                onClick={() => {
                  onClose();
                  onSignOut();
                }}
              >
                <LogOut size={16} /> Sign Out Account
              </button>
            </div>
          </div>

          {/* Right Main Content Panel */}
          <div style={{ padding: '28px 32px', overflowY: 'auto', maxHeight: '680px' }}>
            
            {/* Modal Header Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-contrast)', margin: 0 }}>
                  Merchant Profile & Credentials Dashboard
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                  Manage enterprise API tokens, OAuth keys, team access, and merchant configuration
                </p>
              </div>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            {/* TAB 1: API KEYS & DEVELOPER CREDENTIALS */}
            {activeTab === 'developer' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-contrast)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Key size={18} color="var(--primary-cyan)" /> API Credentials & OAuth Keys
                  </h3>

                  <button
                    onClick={() => setShowSecrets(!showSecrets)}
                    style={{
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--primary-cyan)',
                      fontSize: '0.8rem',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontWeight: 600
                    }}
                  >
                    {showSecrets ? <><EyeOff size={14} /> Mask Secrets</> : <><Eye size={14} /> Reveal Secrets</>}
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                  {credentials.map((cred, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(0,0,0,0.3)',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <div>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-contrast)' }}>
                            {cred.label}
                          </span>
                          <code style={{ color: 'var(--primary-cyan)', fontSize: '0.75rem', marginLeft: '8px' }}>
                            {cred.keyName}
                          </code>
                        </div>

                        <button
                          onClick={() => copyToClipboard(cred.value, cred.keyName)}
                          style={{
                            background: 'var(--bg-subtle)',
                            border: '1px solid var(--border-color)',
                            color: copiedKey === cred.keyName ? '#10b981' : 'var(--text-main)',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {copiedKey === cred.keyName ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                        </button>
                      </div>

                      <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '10px' }}>
                        {cred.desc}
                      </p>

                      <div style={{
                        background: '#070b12',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        fontFamily: 'monospace',
                        fontSize: '0.82rem',
                        color: cred.type === 'secret' && !showSecrets ? 'var(--text-dim)' : '#e2e8f0',
                        wordBreak: 'break-all'
                      }}>
                        {cred.type === 'secret' && !showSecrets ? maskValue(cred.value) : cred.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Webhook Endpoint Summary */}
                <div style={{ background: 'rgba(0, 242, 254, 0.05)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(0, 242, 254, 0.2)' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-cyan)', marginBottom: '8px' }}>
                    Active Ingestion Webhook URL
                  </h4>
                  <div style={{ background: '#070b12', padding: '8px 12px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.8rem', color: '#fff' }}>
                    http://127.0.0.1:8000/api/events/webhook
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PERSONAL ACCOUNT */}
            {activeTab === 'account' && (
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-contrast)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={18} color="var(--primary-cyan)" /> Personal User Details
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Full Name</span>
                    <div style={{ fontWeight: 700, color: 'var(--text-contrast)', marginTop: '4px' }}>{user.name}</div>
                  </div>

                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Email Address</span>
                    <div style={{ fontWeight: 700, color: 'var(--text-contrast)', marginTop: '4px' }}>{user.email}</div>
                  </div>

                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Assigned Role</span>
                    <div style={{ fontWeight: 700, color: 'var(--primary-cyan)', marginTop: '4px' }}>{user.role || 'RevOps Administrator'}</div>
                  </div>

                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Phone Number</span>
                    <div style={{ fontWeight: 700, color: 'var(--text-contrast)', marginTop: '4px' }}>+1 (555) 904-1824 (Verified)</div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: BUSINESS PROFILE */}
            {activeTab === 'business' && (
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-contrast)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building size={18} color="var(--primary-cyan)" /> Business & Merchant Profile
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Registered Business Name</span>
                    <div style={{ fontWeight: 700, color: 'var(--text-contrast)', marginTop: '4px' }}>RevPulse Technologies Pvt Ltd</div>
                  </div>

                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Business Type</span>
                    <div style={{ fontWeight: 700, color: 'var(--text-contrast)', marginTop: '4px' }}>Private Limited (Pvt Ltd)</div>
                  </div>

                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Category</span>
                    <div style={{ fontWeight: 700, color: 'var(--primary-cyan)', marginTop: '4px' }}>Fintech & AI SaaS Platform</div>
                  </div>

                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Website URL</span>
                    <div style={{ fontWeight: 700, color: 'var(--text-contrast)', marginTop: '4px' }}>https://revpulse.ai</div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: KYC VERIFICATION */}
            {activeTab === 'kyc' && (
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-contrast)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} color="#10b981" /> Account Verification & KYC Status
                </h3>

                {/* Progress bar */}
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-contrast)' }}>Merchant Activation Progress</span>
                    <span style={{ fontWeight: 700, color: '#10b981' }}>85% Complete</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '85%', height: '100%', background: 'linear-gradient(90deg, #10b981, #00f2fe)' }}></div>
                  </div>
                </div>

                {/* Checklist */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { label: 'Personal PAN & ID Proof', status: 'VERIFIED' },
                    { label: 'Business Registration (CIN)', status: 'VERIFIED' },
                    { label: 'Settlement Bank Account', status: 'VERIFIED' },
                    { label: 'GSTIN Tax Registration', status: 'VERIFIED' },
                    { label: 'Live Payment Domain Verification', status: 'PENDING' }
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-contrast)' }}>{item.label}</span>
                      {item.status === 'VERIFIED' ? (
                        <span className="badge badge-recovered"><CheckCircle2 size={12} /> Verified</span>
                      ) : (
                        <span className="badge badge-medium"><AlertCircle size={12} /> Under Review</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: BANK & SETTLEMENTS */}
            {activeTab === 'banking' && (
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-contrast)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Banknote size={18} color="var(--primary-cyan)" /> Linked Settlement Bank Account
                </h3>

                <div style={{ background: 'rgba(16, 185, 129, 0.08)', borderRadius: '14px', padding: '20px', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <span className="badge badge-recovered">Primary Settlement Bank</span>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-contrast)', marginTop: '8px' }}>
                        HDFC Bank Ltd
                      </h4>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-dim)' }}>Frequency:</span> <strong style={{ color: 'var(--primary-cyan)' }}>T+1 Instant</strong>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', fontSize: '0.85rem', marginTop: '16px' }}>
                    <div><span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Account Number</span><div>••••••••4892</div></div>
                    <div><span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>IFSC Code</span><div>HDFC0000128</div></div>
                    <div><span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Account Type</span><div>Current Account</div></div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: SECURITY CENTER */}
            {activeTab === 'security' && (
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-contrast)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} color="var(--primary-cyan)" /> Security & Authentication Controls
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-contrast)' }}>Two-Factor Authentication (2FA)</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Requires Google Authenticator OTP on every login</div>
                    </div>
                    <button className={`btn ${twoFactor ? 'btn-success' : 'btn-secondary'}`} onClick={() => setTwoFactor(!twoFactor)}>
                      {twoFactor ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-contrast)' }}>Active Session Security</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Currently logged in from Windows Chrome (127.0.0.1)</div>
                    </div>
                    <button className="btn btn-danger" style={{ fontSize: '0.8rem' }}>
                      Logout All Devices
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: TEAM & RBAC */}
            {activeTab === 'team' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-contrast)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={18} color="var(--primary-cyan)" /> Team Roster & RBAC Permissions
                  </h3>

                  <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setShowInviteModal(true)}>
                    <Plus size={14} /> Invite Member
                  </button>
                </div>

                {showInviteModal && (
                  <form onSubmit={handleInviteSubmit} style={{ background: 'rgba(0, 242, 254, 0.08)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(0, 242, 254, 0.3)', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type="email"
                        placeholder="colleague@company.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        style={{ flex: 1, background: 'rgba(0,0,0,0.4)', color: '#fff', border: '1px solid var(--border-color)', padding: '8px 12px', borderRadius: '8px' }}
                        required
                      />
                      <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value)}
                        style={{ background: 'rgba(0,0,0,0.4)', color: '#fff', border: '1px solid var(--border-color)', padding: '8px 12px', borderRadius: '8px' }}
                      >
                        <option value="Admin">Admin</option>
                        <option value="Finance">Finance</option>
                        <option value="Developer">Developer</option>
                      </select>
                      <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px' }}>Send Invite</button>
                    </div>
                  </form>
                )}

                <div style={{ overflowX: 'auto' }}>
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Member</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamMembers.map((m, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 700, color: 'var(--text-contrast)' }}>{m.name}</td>
                          <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{m.email}</td>
                          <td><span className="badge badge-diagnosed">{m.role}</span></td>
                          <td><span className="badge badge-recovered">{m.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 8: PAYMENT SETTINGS */}
            {activeTab === 'payments' && (
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-contrast)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sliders size={18} color="var(--primary-cyan)" /> Payment Methods & Capture Configuration
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-contrast)' }}>Auto-Capture Payment Mode</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Automatically capture authorized credit card charges</div>
                    </div>
                    <button className={`btn ${autoCapture ? 'btn-success' : 'btn-secondary'}`} onClick={() => setAutoCapture(!autoCapture)}>
                      {autoCapture ? 'Enabled' : 'Manual'}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
