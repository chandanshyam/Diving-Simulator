import React, { useEffect, useState, memo } from 'react';
import ControlPanel from './ControlPanel/ControlPanel.js';
import GaugeGrid from './Gauges/GaugeGrid.js';
import Analytics from './Analytics/Analytics.js';
import { AlertSystem, LoadingOverlay } from './UI/index.js';
import AudioAlertMonitor from './UI/AudioAlertMonitor.js';
import useSimulationEngine from '../hooks/useSimulationEngine.js';

import useDivingStore from '../store/divingStore.js';

/**
 * Main Dashboard component for the Scuba Diving Simulation
 * Integrates all components and manages the simulation engine
 */
const Dashboard = memo(() => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Get store state for data flow verification
  const { mode, isRunning } = useDivingStore();
  
  // Initialize the simulation engine
  useSimulationEngine();

  // Handle initial loading and error states
  useEffect(() => {
    try {
      // Simulate brief loading period for smooth initialization
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      
      return () => clearTimeout(timer);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }, []);

  // Error boundary fallback
  if (error) {
    return (
      <div className="dashboard error-state">
        <div className="error-container">
          <h1>⚠️ Dashboard Error</h1>
          <p>Failed to initialize the diving simulation dashboard.</p>
          <p className="error-message">{error}</p>
          <button 
            className="button button-primary"
            onClick={() => window.location.reload()}
          >
            Reload Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <LoadingOverlay message="Setting up gauges and simulation systems..." />
    );
  }

  return (
    <div className={`dashboard sidebar-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar Control Panel */}
      <aside className="dashboard-sidebar" aria-label="Simulation Controls">
        <div className="sidebar-header">
          <div className="sidebar-header-content">
            <h2 className="sidebar-title">Control Panel</h2>
            <button 
              className="sidebar-toggle"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? '▶️' : '◀️'}
            </button>
          </div>
          {!sidebarCollapsed && (
            <div className="sidebar-status">
              <span className={`status-indicator ${mode}`}>
                {mode === 'manual' ? '🎛️ Manual' : '🤖 Auto'}
              </span>
              <span className={`status-indicator ${isRunning ? 'running' : 'stopped'}`}>
                {isRunning ? '▶️' : '⏸️'}
              </span>
            </div>
          )}
        </div>
        {!sidebarCollapsed && (
          <div className="sidebar-content">
            <ControlPanel />
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            🌊 Scuba Diving Simulation Dashboard
          </h1>
          <div className="dashboard-subtitle">
            Professional Training & Testing Platform
          </div>
          {/* Audio Alert Monitor with mute/unmute toggle */}
          <AudioAlertMonitor />
        </div>
        
        <div className="dashboard-content">
          {/* Gauges Section */}
          <section className="dashboard-section gauges-section" aria-label="Live Gauges">
            <GaugeGrid />
          </section>
          
          {/* Analytics Section */}
          <section className="dashboard-section analytics-section" aria-label="Dive Analytics">
            <Analytics />
          </section>
        </div>
      </main>
      
      {/* Alert System - positioned fixed, doesn't interfere with layout */}
      <AlertSystem />
    </div>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;