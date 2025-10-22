import React from 'react';
import useDivingStore from '../../store/divingStore.js';

const SimulationButtons = () => {
  const { 
    mode,
    isRunning, 
    startSimulation, 
    pauseSimulation, 
    resetAllGauges, 
    triggerLeak 
  } = useDivingStore();
  
  // Only show simulation controls in auto mode
  const showSimulationControls = mode === 'auto';
  
  const handleStartResume = () => {
    startSimulation();
  };

  const handlePause = () => {
    pauseSimulation();
  };

  const handleTriggerLeak = () => {
    triggerLeak();
  };

  const handleReset = () => {
    resetAllGauges();
  };

  return (
    <div className="simulation-buttons-container">
      <div className="button-group">
        {showSimulationControls && (
          <>
            <button
              onClick={handleStartResume}
              disabled={isRunning}
              className={`control-button start-button ${isRunning ? 'disabled' : 'active'}`}
              title={isRunning ? 'Simulation is running' : 'Start/Resume simulation'}
            >
              <span className="button-icon">▶️</span>
              <span className="button-text">{isRunning ? 'Running' : 'Start'}</span>
            </button>

            <button
              onClick={handlePause}
              disabled={!isRunning}
              className={`control-button pause-button ${!isRunning ? 'disabled' : 'active'}`}
              title={!isRunning ? 'Simulation is not running' : 'Pause simulation'}
            >
              <span className="button-icon">⏸️</span>
              <span className="button-text">Pause</span>
            </button>
          </>
        )}

        <button
          onClick={handleTriggerLeak}
          className="control-button leak-button active"
          title="Trigger emergency leak scenario"
        >
          <span className="button-icon">🧯</span>
          <span className="button-text">Trigger Leak</span>
        </button>

        <button
          onClick={handleReset}
          className="control-button reset-button active"
          title="Reset all gauges to initial values"
        >
          <span className="button-icon">🔁</span>
          <span className="button-text">Reset</span>
        </button>
      </div>
    </div>
  );
};

export default SimulationButtons;