import React from 'react';
import DepthSlider from './DepthSlider.js';
import DiverDepthControls from './DiverDepthControls.js';
import CylinderSelector from './CylinderSelector.js';
import SimulationButtons from './SimulationButtons.js';
import ModeToggle from './ModeToggle.js';
import ManualInputPanel from './ManualInputPanel.js';
import SessionTimer from './SessionTimer.js';

const ControlPanel = () => {
  return (
    <div className="control-panel-sidebar">
      <div className="control-section">
        <ModeToggle />
      </div>
      
      <div className="control-section">
        <SimulationButtons />
      </div>
      
      <div className="control-section">
        <SessionTimer />
      </div>
      
      <div className="control-section">
        <DepthSlider />
      </div>
      
      <div className="control-section">
        <CylinderSelector />
      </div>
      
      <div className="control-section">
        <DiverDepthControls />
      </div>
      
      {/* Manual input panel - only shows in manual mode */}
      <ManualInputPanel />
    </div>
  );
};

export default ControlPanel;