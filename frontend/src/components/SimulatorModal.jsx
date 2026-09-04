import React, { useState } from 'react';
import { X, Zap, Play, CheckCircle2 } from 'lucide-react';
import { triggerCustomSimulatorEvent } from '../services/api';

export default function SimulatorModal({ onClose, onEventCreated }) {
  const [eventType, setEventType] = useState('PAYMENT_FAILED');
  const [amount, setAmount] = useState(450.0);
  const [customerName, setCustomerName] = useState('Stripe Client: Horizon Corp');
  const [customerEmail, setCustomerEmail] = useState('billing@horizon.io');
  const [customerTier, setCustomerTier] = useState('Enterprise');
  const [errorCode, setErrorCode] = useState('do_not_honor');
  const [errorMsg, setErrorMsg] = useState('Bank decline: High value security check failed.');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await triggerCustomSimulatorEvent({
        event_type: eventType,
        amount: parseFloat(amount),
        customer_name: customerName,
        customer_email: customerEmail,
        customer_tier: customerTier,
        error_code: errorCode,
        error_message: errorMsg
      });
      setSuccess(true);
      setTimeout(() => {
        onEventCreated();
        onClose();
      }, 1000);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={22} color="var(--primary-cyan)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', margin: 0 }}>
              Live Webhook Event Simulator
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#10b981' }}>
            <CheckCircle2 size={48} style={{ margin: '0 auto 12px auto' }} />
            <h4>Event Ingested & Diagnosed by AI Agent!</h4>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                Failure Event Type:
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                style={{ width: '100%', background: 'rgba(0,0,0,0.5)', color: '#fff', border: '1px solid var(--border-color)', padding: '8px 12px', borderRadius: '8px' }}
              >
                <option value="PAYMENT_FAILED">PAYMENT_FAILED (Stripe Card Decline)</option>
                <option value="CART_ABANDONED">CART_ABANDONED (Shopify Checkout Drop-off)</option>
                <option value="CARD_EXPIRING">CARD_EXPIRING (Chargebee Subscription Warning)</option>
                <option value="INVOICE_OVERDUE">INVOICE_OVERDUE (B2B Net-30 Invoice Past Due)</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                  Amount ($):
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.5)', color: '#fff', border: '1px solid var(--border-color)', padding: '8px 12px', borderRadius: '8px' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                  Customer Tier:
                </label>
                <select
                  value={customerTier}
                  onChange={(e) => setCustomerTier(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.5)', color: '#fff', border: '1px solid var(--border-color)', padding: '8px 12px', borderRadius: '8px' }}
                >
                  <option value="Enterprise">Enterprise</option>
                  <option value="Pro">Pro</option>
                  <option value="Standard">Standard</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                Customer Name & Email:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.5)', color: '#fff', border: '1px solid var(--border-color)', padding: '8px 12px', borderRadius: '8px' }}
                  required
                />
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.5)', color: '#fff', border: '1px solid var(--border-color)', padding: '8px 12px', borderRadius: '8px' }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                  Error Code:
                </label>
                <input
                  type="text"
                  value={errorCode}
                  onChange={(e) => setErrorCode(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.5)', color: '#fff', border: '1px solid var(--border-color)', padding: '8px 12px', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                  Error Message:
                </label>
                <input
                  type="text"
                  value={errorMsg}
                  onChange={(e) => setErrorMsg(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.5)', color: '#fff', border: '1px solid var(--border-color)', padding: '8px 12px', borderRadius: '8px' }}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '12px' }}>
              <Play size={16} /> Inject Webhook & Trigger AI Agent
            </button>

          </form>
        )}

      </div>
    </div>
  );
}
