import React, { useState } from 'react';
import { Network, Database, Cpu, Zap, Shield, Server, ArrowRight, Layers, Lock, Radio } from 'lucide-react';

export default function SystemTopologyModal() {
  const [activeNode, setActiveNode] = useState('agent');

  const nodes = [
    {
      id: 'webhook',
      title: '1. Webhook Ingestion Layer',
      icon: Radio,
      color: '#00f2fe',
      desc: 'Real-time REST & Webhook listener for payment failures (Stripe, Shopify, Chargebee, B2B Invoices).'
    },
    {
      id: 'risk',
      title: '2. Revenue Risk Detection Engine',
      icon: Zap,
      color: '#f97316',
      desc: 'Computes ARR impact, customer LTV weight, and assigns severity scores (CRITICAL, HIGH, MEDIUM, LOW).'
    },
    {
      id: 'agent',
      title: '3. AI Diagnosis & LLM Reasoning Engine',
      icon: Cpu,
      color: '#a855f7',
      desc: 'Classifies root cause (Expired Card, Insufficient Funds, Technical Timeout, Friction) and generates personalized recovery copy.'
    },
    {
      id: 'safety',
      title: '4. Bounded Policy Guardrails Engine',
      icon: Shield,
      color: '#ef4444',
      desc: 'Enforces hard governance: Max 3 retries limit, 24h cooldown, $500 auto-execution cap, opt-out compliance.'
    },
    {
      id: 'executor',
      title: '5. Workflow Execution Engine',
      icon: Server,
      color: '#10b981',
      desc: 'Dispatches smart retries, self-service billing portals, dynamic discount links, and logs immutable audit trails.'
    },
    {
      id: 'database',
      title: '6. SQLite / PostgreSQL Store',
      icon: Database,
      color: '#3b82f6',
      desc: 'Transactional persistent store storing Customers, Invoices, Events, Cases, Actions, and Audit Logs.'
    }
  ];

  return (
    <div className="glass-panel" style={{ margin: '24px', padding: '24px' }}>
      
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Network size={22} color="var(--primary-cyan)" /> System Architecture & Component Topology
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Full-stack closed-loop agentic data flow & component connection model (from Link 01, 02, and 03 specifications)
        </p>
      </div>

      {/* Interactive Topology Wiring Diagram */}
      <div style={{ background: '#050912', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-color)' }}>
        
        {/* Flowchart Node Graph */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', alignItems: 'center' }}>
          {nodes.map((node, idx) => {
            const Icon = node.icon;
            const isSelected = activeNode === node.id;
            return (
              <React.Fragment key={node.id}>
                <div
                  onClick={() => setActiveNode(node.id)}
                  style={{
                    background: isSelected ? 'rgba(255,255,255,0.08)' : 'rgba(15, 23, 42, 0.6)',
                    border: `1.5px solid ${isSelected ? node.color : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? `0 0 15px ${node.color}40` : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: node.color, fontWeight: 700, marginBottom: '8px', fontSize: '0.85rem' }}>
                    <Icon size={18} /> {node.title.split(' ')[0]}
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff' }}>
                    {node.title.split(' ').slice(1).join(' ')}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Selected Node Details Box */}
        {activeNode && (
          <div style={{ marginTop: '24px', background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            {(() => {
              const current = nodes.find(n => n.id === activeNode);
              const Icon = current.icon;
              return (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: current.color, fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>
                    <Icon size={22} /> {current.title}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                    {current.desc}
                  </p>
                </div>
              );
            })()}
          </div>
        )}

      </div>

    </div>
  );
}
