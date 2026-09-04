import React, { useState } from 'react';
import { Filter, Eye, AlertCircle, ArrowUpRight, ShieldCheck, UserCheck, RefreshCw } from 'lucide-react';

export default function RiskMonitor({ cases, onSelectCase, onRefresh }) {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterRisk, setFilterRisk] = useState('ALL');

  const filteredCases = cases.filter(c => {
    if (filterStatus !== 'ALL' && c.status !== filterStatus) return false;
    if (filterRisk !== 'ALL' && c.risk_level !== filterRisk) return false;
    return true;
  });

  const getRiskBadgeClass = (risk) => {
    switch (risk) {
      case 'CRITICAL': return 'badge-critical';
      case 'HIGH': return 'badge-high';
      case 'MEDIUM': return 'badge-medium';
      default: return 'badge-low';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'RECOVERED': return 'badge-recovered';
      case 'DIAGNOSED': return 'badge-diagnosed';
      case 'ESCALATED': return 'badge-escalated';
      default: return 'badge-low';
    }
  };

  return (
    <div className="glass-panel" style={{ margin: '24px', padding: '24px' }}>
      
      {/* Header & Filter Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
            Live Revenue Risk Monitor
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Real-time stream of failed payments, checkout drop-offs, and automated AI recovery cases
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <Filter size={16} /> Filter Status:
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              background: 'rgba(0,0,0,0.4)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-color)',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.85rem'
            }}
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="DIAGNOSED">Diagnosed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RECOVERED">Recovered</option>
            <option value="ESCALATED">Escalated</option>
          </select>

          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            style={{
              background: 'rgba(0,0,0,0.4)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-color)',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.85rem'
            }}
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <button className="btn btn-secondary" onClick={onRefresh} style={{ padding: '6px 12px' }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Cases Table */}
      <div style={{ overflowX: 'auto' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Customer & Tier</th>
              <th>Source / Failure Type</th>
              <th>Amount / ARR Impact</th>
              <th>AI Root Cause Diagnosis</th>
              <th>Risk Score</th>
              <th>Safety Guardrail</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No revenue risk cases found matching current filters.
                </td>
              </tr>
            ) : (
              filteredCases.map((c) => (
                <tr key={c.id} className="table-row-hover" onClick={() => onSelectCase(c)}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#fff' }}>{c.customer?.name || 'Unknown Customer'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      {c.customer?.email} • <span style={{ color: 'var(--primary-cyan)' }}>{c.customer?.tier}</span>
                    </div>
                  </td>

                  <td>
                    <div style={{ fontWeight: 500 }}>{c.event?.event_type || 'PAYMENT_FAILED'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      Via {c.event?.event_source} ({c.event?.error_code || 'declined'})
                    </div>
                  </td>

                  <td>
                    <div style={{ fontWeight: 700, color: '#fff' }}>${c.event?.amount?.toFixed(2)}</div>
                    <div style={{ fontSize: '0.75rem', color: '#ef4444' }}>
                      ARR: ${c.arr_impact?.toFixed(0)}
                    </div>
                  </td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--primary-indigo)' }}>
                      {c.root_cause_category}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.root_cause_details}
                    </div>
                  </td>

                  <td>
                    <span className={`badge ${getRiskBadgeClass(c.risk_level)}`}>
                      {c.risk_level} ({c.risk_score})
                    </span>
                  </td>

                  <td>
                    {c.requires_human_approval ? (
                      <span className="badge badge-high" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <UserCheck size={12} /> Human Gate
                      </span>
                    ) : (
                      <span className="badge badge-recovered" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <ShieldCheck size={12} /> Auto Safe
                      </span>
                    )}
                  </td>

                  <td>
                    <span className={`badge ${getStatusBadgeClass(c.status)}`}>
                      {c.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCase(c);
                      }}
                    >
                      <Eye size={14} /> Console
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
