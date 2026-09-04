import React from 'react';
import { Cpu, DollarSign, ShieldCheck, PieChart, BarChart2 } from 'lucide-react';

export default function AnalyticsView({ summary }) {
  if (!summary) return null;

  const breakdown = summary.root_cause_breakdown || [];

  return (
    <div style={{ margin: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
          Revenue Recovery ROI & AI Root Cause Analytics
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Detailed attribution analysis of payment failures, ARR impact, and agent intervention efficiency
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '24px' }}>
          
          {/* Root Cause Category Distribution */}
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-cyan)', fontWeight: 700, marginBottom: '16px' }}>
              <PieChart size={20} /> Root Cause Category Distribution
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {breakdown.map((item, idx) => {
                const percent = summary.total_cases_count > 0 ? Math.round((item.count / summary.total_cases_count) * 100) : 0;
                return (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                      <span style={{ color: '#fff', fontWeight: 600 }}>{item.category}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{item.count} cases ({percent}%) • ${item.arr_impact?.toFixed(0)} ARR</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${percent}%`,
                        height: '100%',
                        background: idx % 2 === 0 ? 'linear-gradient(90deg, #00f2fe, #4facfe)' : 'linear-gradient(90deg, #8b5cf6, #a855f7)'
                      }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Agent Efficiency & Guardrail Policy Compliance */}
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 700, marginBottom: '16px' }}>
              <ShieldCheck size={20} /> Governance & Policy Enforcements
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981' }}>Automated Auto-Execution Gate</div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {summary.total_cases_count - summary.escalated_cases_count} / {summary.total_cases_count} cases satisfied automated safety policy rules without requiring manual manager override.
                </p>
              </div>

              <div style={{ padding: '12px 16px', background: 'rgba(249, 115, 22, 0.1)', borderRadius: '10px', border: '1px solid rgba(249, 115, 22, 0.2)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f97316' }}>Human-in-the-Loop Gateway</div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {summary.escalated_cases_count} enterprise cases routed to human operators due to transaction amount caps (&gt;$500) or enterprise discount rules.
                </p>
              </div>

              <div style={{ padding: '12px 16px', background: 'rgba(0, 242, 254, 0.1)', borderRadius: '10px', border: '1px solid rgba(0, 242, 254, 0.2)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-cyan)' }}>Max Retries Enforcement</div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Strict 3-retry limit enforced across all payment gateways to protect card issuer reputation score.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
