import React, { useState, useEffect } from 'react';
import { ShieldCheck, User, Cpu, Clock, RefreshCw } from 'lucide-react';
import { fetchAuditLogs } from '../services/api';

export default function AuditLogModal() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await fetchAuditLogs(50);
      setLogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="glass-panel" style={{ margin: '24px', padding: '24px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={22} color="var(--primary-cyan)" /> Governance & Agent Audit Trail
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Immutable append-only record of AI reasoning, safety policy evaluations, and executed recovery actions
          </p>
        </div>

        <button className="btn btn-secondary" onClick={loadLogs} style={{ padding: '6px 12px' }}>
          <RefreshCw size={14} /> Refresh Logs
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action By</th>
              <th>Action Type</th>
              <th>Audit Description</th>
              <th>Policy Evaluation Result</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                  Loading audit trail...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                  No audit logs recorded yet.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
                    <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {new Date(log.timestamp).toLocaleString()}
                  </td>

                  <td>
                    {log.action_by === 'SYSTEM_AGENT' ? (
                      <span className="badge badge-diagnosed" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Cpu size={12} /> AI Agent
                      </span>
                    ) : (
                      <span className="badge badge-high" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <User size={12} /> Operator
                      </span>
                    )}
                  </td>

                  <td style={{ fontWeight: 600, color: '#fff', fontSize: '0.85rem' }}>
                    {log.action_type}
                  </td>

                  <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '350px' }}>
                    {log.description}
                  </td>

                  <td style={{ fontSize: '0.8rem', color: '#10b981' }}>
                    {log.policy_check_result || 'PASSED'}
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
