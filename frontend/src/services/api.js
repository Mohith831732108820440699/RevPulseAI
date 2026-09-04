const API_BASE = 'http://127.0.0.1:8000/api';

export async function fetchSummary() {
  const res = await fetch(`${API_BASE}/analytics/summary`);
  if (!res.ok) throw new Error('Failed to fetch analytics summary');
  return res.json();
}

export async function fetchCases(status = '', risk_level = '') {
  let url = `${API_BASE}/cases`;
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (risk_level) params.append('risk_level', risk_level);
  if (params.toString()) url += `?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch cases');
  return res.json();
}

export async function fetchCaseDetail(caseId) {
  const res = await fetch(`${API_BASE}/cases/${caseId}`);
  if (!res.ok) throw new Error('Failed to fetch case detail');
  return res.json();
}

export async function executeCaseAction(caseId, actionType = null, customNote = '', overrideHuman = false) {
  const res = await fetch(`${API_BASE}/cases/${caseId}/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action_type: actionType,
      custom_note: customNote,
      override_human_approval: overrideHuman
    })
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.detail || 'Failed to execute recovery action');
  }
  return res.json();
}

export async function escalateCase(caseId) {
  const res = await fetch(`${API_BASE}/cases/${caseId}/escalate`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to escalate case');
  return res.json();
}

export async function fetchAuditLogs(limit = 50) {
  const res = await fetch(`${API_BASE}/analytics/audit-logs?limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch audit logs');
  return res.json();
}

export async function triggerRandomSimulatorEvent() {
  const res = await fetch(`${API_BASE}/simulator/trigger-random`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to trigger simulated event');
  return res.json();
}

export async function triggerCustomSimulatorEvent(payload) {
  const res = await fetch(`${API_BASE}/simulator/trigger-custom`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to trigger custom event');
  return res.json();
}
