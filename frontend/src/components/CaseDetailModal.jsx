import React, { useState } from 'react';
import { X, Cpu, ShieldCheck, AlertOctagon, CheckCircle2, Play, UserCheck, MessageSquare, AlertTriangle, Send } from 'lucide-react';

export default function CaseDetailModal({ caseItem, onClose, onExecuteAction, onEscalateCase }) {
  if (!caseItem) return null;

  const [customNote, setCustomNote] = useState('');
  const [selectedAction, setSelectedAction] = useState(caseItem.recommended_action || 'RETRY_PAYMENT');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleExecute = async (override = false) => {
    setLoading(true);
    setErrorMsg('');
    try {
      await onExecuteAction(caseItem.id, selectedAction, customNote, override);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Execution failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleEscalate = async () => {
    setLoading(true);
    try {
      await onEscalateCase(caseItem.id);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Escalation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                AI Recovery Console: {caseItem.id}
              </h2>
              <span className={`badge ${caseItem.risk_level === 'CRITICAL' ? 'badge-critical' : 'badge-high'}`}>
                {caseItem.risk_level} RISK ({caseItem.risk_score})
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Customer: <strong style={{ color: '#fff' }}>{caseItem.customer?.name}</strong> ({caseItem.customer?.company}) • Tier: <span style={{ color: 'var(--primary-cyan)' }}>{caseItem.customer?.tier}</span>
            </p>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {errorMsg && (
          <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.9rem' }}>
            <AlertTriangle size={16} style={{ display: 'inline', marginRight: '6px' }} />
            {errorMsg}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          
          {/* Column 1: Context & AI Diagnosis */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Event Overview */}
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                Payment Event Summary
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
                <div><strong>Failure Type:</strong> {caseItem.event?.event_type}</div>
                <div><strong>Amount:</strong> ${caseItem.event?.amount?.toFixed(2)}</div>
                <div><strong>ARR Impact:</strong> ${caseItem.arr_impact?.toFixed(2)}</div>
                <div><strong>Error Code:</strong> {caseItem.event?.error_code || 'N/A'}</div>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '8px', fontStyle: 'italic' }}>
                "{caseItem.event?.error_message}"
              </div>
            </div>

            {/* AI Diagnosis Card */}
            <div style={{ background: 'rgba(139, 92, 246, 0.08)', padding: '18px', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a855f7', fontWeight: 700, marginBottom: '8px' }}>
                <Cpu size={20} /> AI Agent Root Cause Diagnosis
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                Category: {caseItem.root_cause_category}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                {caseItem.root_cause_details}
              </p>
            </div>

            {/* Bounded Safety Policy Check */}
            <div style={{ background: caseItem.requires_human_approval ? 'rgba(249, 115, 22, 0.08)' : 'rgba(16, 185, 129, 0.08)', padding: '18px', borderRadius: '12px', border: caseItem.requires_human_approval ? '1px solid rgba(249, 115, 22, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: caseItem.requires_human_approval ? '#f97316' : '#10b981', fontWeight: 700, marginBottom: '8px' }}>
                <ShieldCheck size={20} /> Policy Safety Guardrail Status
              </div>
              <div style={{ fontSize: '0.85rem', color: '#fff', lineHeight: '1.5' }}>
                {caseItem.safety_notes}
              </div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                <span>Retry Count: <strong>{caseItem.retry_count} / 3</strong></span>
                <span>Human Gate: <strong>{caseItem.requires_human_approval ? 'REQUIRED' : 'PASSED'}</strong></span>
              </div>
            </div>

          </div>

          {/* Column 2: Intervention Action & Communication Draft */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Suggested Communication Payload */}
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-cyan)', fontWeight: 700, marginBottom: '10px' }}>
                <MessageSquare size={18} /> Generated Customer Engagement Payload
              </div>
              <div style={{ background: '#070b12', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', color: '#e2e8f0', fontFamily: 'monospace', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                {caseItem.suggested_communication || 'No communication payload generated.'}
              </div>
            </div>

            {/* Action Execution Selector */}
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>
                Execute Intervention Action
              </h4>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
                  Select Recovery Strategy:
                </label>
                <select
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.5)',
                    color: '#fff',
                    border: '1px solid var(--border-color)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="RETRY_PAYMENT">RETRY_PAYMENT (Gateway Smart Retry)</option>
                  <option value="SEND_SMART_LINK">SEND_SMART_LINK (Self-Service Card Portal)</option>
                  <option value="APPLY_DISCOUNT">APPLY_DISCOUNT (10% Limited Incentive)</option>
                  <option value="SEND_WHATSAPP">SEND_WHATSAPP (Interactive Mobile Link)</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
                  Operator Custom Note (Optional):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Approved by Billing Manager..."
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.5)',
                    color: '#fff',
                    border: '1px solid var(--border-color)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {caseItem.requires_human_approval ? (
                  <button
                    className="btn btn-primary"
                    disabled={loading}
                    onClick={() => handleExecute(true)}
                    style={{ flex: 1 }}
                  >
                    <UserCheck size={16} /> Override & Approve Action
                  </button>
                ) : (
                  <button
                    className="btn btn-primary"
                    disabled={loading}
                    onClick={() => handleExecute(false)}
                    style={{ flex: 1 }}
                  >
                    <Play size={16} /> Execute AI Recovery Action
                  </button>
                )}

                <button
                  className="btn btn-danger"
                  disabled={loading}
                  onClick={handleEscalate}
                >
                  <AlertOctagon size={16} /> Escalate
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
