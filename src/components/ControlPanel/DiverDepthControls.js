import React from 'react';
import useDivingStore from '../../store/divingStore.js';
import { SIMULATION_CONSTANTS } from '../../utils/constants.js';

const DiverDepthControls = () => {
  const { 
    diver1Depth, 
    diver2Depth, 
    mode, 
    isRunning, 
    setDiver1Depth, 
    setDiver2Depth 
  } = useDivingStore();
  
  // Disable controls during auto simulation mode
  const isDisabled = mode === 'auto' && isRunning;
  
  const handleDiver1DepthChange = (event) => {
    const newDepth = parseFloat(event.target.value);
    setDiver1Depth(newDepth);
  };

  const handleDiver2DepthChange = (event) => {
    const newDepth = parseFloat(event.target.value);
    setDiver2Depth(newDepth);
  };

  return (
    <div className="diver-depth-controls-container">
      <div className="depth-control">
        <label htmlFor="diver1-depth-slider" className="control-label">
          Diver 1 Depth: {diver1Depth} m
        </label>
        <input
          id="diver1-depth-slider"
          type="range"
          min={SIMULATION_CONSTANTS.DIVER_DEPTH_RANGE.min}
          max={SIMULATION_CONSTANTS.DIVER_DEPTH_RANGE.max}
          step="0.5"
          value={diver1Depth}
          onChange={handleDiver1DepthChange}
          disabled={isDisabled}
          className={`slider depth-slider ${isDisabled ? 'disabled' : ''}`}
          title={isDisabled ? 'Disabled during auto simulation' : 'Adjust Diver 1 depth'}
        />
        <div className="slider-range">
          <span>{SIMULATION_CONSTANTS.DIVER_DEPTH_RANGE.min} m</span>
          <span>{SIMULATION_CONSTANTS.DIVER_DEPTH_RANGE.max} m</span>
        </div>
      </div>

      <div className="depth-control">
        <label htmlFor="diver2-depth-slider" className="control-label">
          Diver 2 Depth: {diver2Depth} m
        </label>
        <input
          id="diver2-depth-slider"
          type="range"
          min={SIMULATION_CONSTANTS.DIVER_DEPTH_RANGE.min}
          max={SIMULATION_CONSTANTS.DIVER_DEPTH_RANGE.max}
          step="0.5"
          value={diver2Depth}
          onChange={handleDiver2DepthChange}
          disabled={isDisabled}
          className={`slider depth-slider ${isDisabled ? 'disabled' : ''}`}
          title={isDisabled ? 'Disabled during auto simulation' : 'Adjust Diver 2 depth'}
        />
        <div className="slider-range">
          <span>{SIMULATION_CONSTANTS.DIVER_DEPTH_RANGE.min} m</span>
          <span>{SIMULATION_CONSTANTS.DIVER_DEPTH_RANGE.max} m</span>
        </div>
      </div>
    </div>
  );
};

export default DiverDepthControls;