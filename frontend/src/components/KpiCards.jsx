import React from 'react';
import { DollarSign, ShieldAlert, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';

export default function KpiCards({ summary }) {
  if (!summary) return null;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val || 0);
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '20px',
      margin: '24px 24px 0 24px'
    }}>
      
      {/* Card 1: Total Revenue at Risk */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Total Revenue at Risk
            </p>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
              {formatCurrency(summary.total_revenue_at_risk)}
            </h2>
          </div>
          <div style={{
            padding: '10px',
            borderRadius: '12px',
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#ef4444'
          }}>
            <AlertTriangle size={22} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
          <span>{summary.total_cases_count} total payment risk events detected</span>
        </div>
      </div>

      {/* Card 2: Recovered Revenue */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Recovered ARR
            </p>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
              {formatCurrency(summary.total_recovered_revenue)}
            </h2>
          </div>
          <div style={{
            padding: '10px',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#10b981'
          }}>
            <CheckCircle2 size={22} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#10b981' }}>
          <TrendingUp size={14} />
          <span>{summary.recovered_cases_count} cases successfully closed by AI</span>
        </div>
      </div>

      {/* Card 3: Agent Recovery Rate */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Autonomous Recovery Rate
            </p>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-cyan)', marginTop: '4px' }}>
              {summary.recovery_rate_percent}%
            </h2>
          </div>
          <div style={{
            padding: '10px',
            borderRadius: '12px',
            background: 'rgba(0, 242, 254, 0.15)',
            color: 'var(--primary-cyan)'
          }}>
            <TrendingUp size={22} />
          </div>
        </div>
        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden', marginTop: '8px' }}>
          <div style={{ width: `${summary.recovery_rate_percent}%`, height: '100%', background: 'linear-gradient(90deg, #00f2fe, #4facfe)' }}></div>
        </div>
      </div>

      {/* Card 4: Active Interventions */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Active Interventions
            </p>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#a855f7', marginTop: '4px' }}>
              {summary.active_cases_count}
            </h2>
          </div>
          <div style={{
            padding: '10px',
            borderRadius: '12px',
            background: 'rgba(168, 85, 247, 0.15)',
            color: '#a855f7'
          }}>
            <ShieldAlert size={22} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
          <span>{summary.escalated_cases_count} escalated for human approval</span>
        </div>
      </div>

    </div>
  );
}
