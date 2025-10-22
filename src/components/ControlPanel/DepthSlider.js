import React from 'react';
import useDivingStore from '../../store/divingStore.js';
import { SIMULATION_CONSTANTS } from '../../utils/constants.js';

const DepthSlider = () => {
  const { depth, mode, isRunning, setDepth } = useDivingStore();
  
  // Disable slider during auto simulation mode
  const isDisabled = mode === 'auto' && isRunning;
  
  const handleDepthChange = (event) => {
    const newDepth = parseFloat(event.target.value);
    setDepth(newDepth);
  };

  return (
    <div className="depth-slider-container">
      <label htmlFor="depth-slider" className="control-label">
        Depth: {depth}m
      </label>
      <input
        id="depth-slider"
        type="range"
        min={SIMULATION_CONSTANTS.DEPTH_RANGE.min}
        max={SIMULATION_CONSTANTS.DEPTH_RANGE.max}
        step="0.5"
        value={depth}
        onChange={handleDepthChange}
        disabled={isDisabled}
        className={`slider depth-slider ${isDisabled ? 'disabled' : ''}`}
        title={isDisabled ? 'Disabled during auto simulation' : 'Adjust diving depth'}
      />
      <div className="slider-range">
        <span>{SIMULATION_CONSTANTS.DEPTH_RANGE.min}m</span>
        <span>{SIMULATION_CONSTANTS.DEPTH_RANGE.max}m</span>
      </div>
    </div>
  );
};

export default DepthSlider;