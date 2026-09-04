import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import EntryPage from './components/EntryPage';
import GoogleSignInPage from './components/GoogleSignInPage';
import KpiCards from './components/KpiCards';
import RiskMonitor from './components/RiskMonitor';
import CaseDetailModal from './components/CaseDetailModal';
import AnalyticsView from './components/AnalyticsView';
import AuditLogModal from './components/AuditLogModal';
import SystemTopologyModal from './components/SystemTopologyModal';
import SimulatorModal from './components/SimulatorModal';
import ProfileModal from './components/ProfileModal';
import { fetchSummary, fetchCases, executeCaseAction, escalateCase, triggerRandomSimulatorEvent } from './services/api';
import './styles/main.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('entry');
  const [theme, setTheme] = useState(() => localStorage.getItem('revpulse_theme') || 'dark');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('revpulse_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [summary, setSummary] = useState(null);
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [showSimulator, setShowSimulator] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('revpulse_theme', theme);
  }, [theme]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('revpulse_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('revpulse_user');
    }
  }, [user]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSignInSuccess = (userData) => {
    setUser(userData);
    setActiveTab('dashboard');
  };

  const handleSignOut = () => {
    setUser(null);
    setActiveTab('entry');
  };

  const handleEntryCheckIn = () => {
    if (user) {
      setActiveTab('dashboard');
    } else {
      setActiveTab('signin');
    }
  };

  const loadData = async () => {
    try {
      const [sumData, casesData] = await Promise.all([
        fetchSummary(),
        fetchCases()
      ]);
      setSummary(sumData);
      setCases(casesData);
    } catch (err) {
      console.error('Failed to load application data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleExecuteAction = async (caseId, actionType, customNote, overrideHuman) => {
    await executeCaseAction(caseId, actionType, customNote, overrideHuman);
    await loadData();
  };

  const handleEscalateCase = async (caseId) => {
    await escalateCase(caseId);
    await loadData();
  };

  const handleTriggerRandom = async () => {
    await triggerRandomSimulatorEvent();
    await loadData();
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* Route Views */}
      {activeTab === 'entry' && (
        <EntryPage onCheckIn={handleEntryCheckIn} />
      )}

      {activeTab === 'signin' && (
        <GoogleSignInPage
          onSignInSuccess={handleSignInSuccess}
          onBackToEntry={() => setActiveTab('entry')}
        />
      )}

      {activeTab !== 'entry' && activeTab !== 'signin' && (
        <>
          {/* Top Navbar */}
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenSimulator={() => setShowSimulator(true)}
            onTriggerRandom={handleTriggerRandom}
            theme={theme}
            toggleTheme={toggleTheme}
            user={user}
            onSignOut={handleSignOut}
            onOpenProfile={() => setShowProfileModal(true)}
          />

          {/* Main Content Area */}
          {activeTab === 'dashboard' && (
            <>
              <KpiCards summary={summary} />
              <RiskMonitor
                cases={cases}
                onSelectCase={(c) => setSelectedCase(c)}
                onRefresh={loadData}
              />
            </>
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView summary={summary} />
          )}

          {activeTab === 'audit' && (
            <AuditLogModal />
          )}

          {activeTab === 'topology' && (
            <SystemTopologyModal />
          )}
        </>
      )}

      {/* Modals */}
      {selectedCase && (
        <CaseDetailModal
          caseItem={selectedCase}
          onClose={() => setSelectedCase(null)}
          onExecuteAction={handleExecuteAction}
          onEscalateCase={handleEscalateCase}
        />
      )}

      {showSimulator && (
        <SimulatorModal
          onClose={() => setShowSimulator(false)}
          onEventCreated={loadData}
        />
      )}

      {showProfileModal && (
        <ProfileModal
          user={user}
          onClose={() => setShowProfileModal(false)}
          onSignOut={handleSignOut}
        />
      )}

    </div>
  );
}
