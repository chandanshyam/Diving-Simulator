import React from 'react';
import useDivingStore from '../../store/divingStore.js';

const ModeToggle = () => {
  const { mode, useRealisticProfile, setMode, pauseSimulation, setState } = useDivingStore();
  
  const handleModeChange = (event) => {
    const newMode = event.target.checked ? 'auto' : 'manual';
    
    // If switching to manual mode, pause any running simulation
    if (newMode === 'manual') {
      pauseSimulation();
    }
    
    setMode(newMode);
  };

  const handleRealisticProfileChange = (event) => {
    setState({ useRealisticProfile: event.target.checked });
  };

  return (
    <div className="mode-toggle-container">
      <label className="control-label">Operation Mode:</label>
      <div className="toggle-switch">
        <input
          type="checkbox"
          id="mode-toggle"
          checked={mode === 'auto'}
          onChange={handleModeChange}
          className="toggle-input"
        />
        <label htmlFor="mode-toggle" className="toggle-label">
          <span className="toggle-slider"></span>
        </label>
        <div className="mode-labels">
          <span className={`mode-label ${mode === 'manual' ? 'active' : ''}`}>
            Manual Mode
          </span>
          <span className={`mode-label ${mode === 'auto' ? 'active' : ''}`}>
            Auto Simulation Mode
          </span>
        </div>
      </div>
      <div className="mode-description">
        {mode === 'manual' 
          ? 'Direct control of all gauge values' 
          : useRealisticProfile 
            ? 'Realistic 60-minute dive simulation (compressed to 60 seconds)'
            : 'Basic physics simulation with manual controls'
        }
      </div>
      
      {mode === 'auto' && (
        <div className="realistic-profile-section">
          <label className="control-label">Simulation Type:</label>
          <div className="profile-toggle">
            <label className="profile-option">
              <input
                type="radio"
                name="simulation-type"
                checked={!useRealisticProfile}
                onChange={() => setState({ useRealisticProfile: false })}
                className="radio-input"
              />
              <span className="radio-label">Simple Physics</span>
            </label>
            <label className="profile-option">
              <input
                type="radio"
                name="simulation-type"
                checked={useRealisticProfile}
                onChange={() => setState({ useRealisticProfile: true })}
                className="radio-input"
              />
              <span className="radio-label">Realistic Dive (60s = 60min)</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModeToggle;