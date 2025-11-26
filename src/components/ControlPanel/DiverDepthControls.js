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
    setDiver2Depth,
    handleManualDepthChange
  } = useDivingStore();

  // Disable controls during auto simulation mode
  const isDisabled = mode === 'auto' && isRunning;

  const handleDiver1DepthChange = (event) => {
    const newDepth = parseFloat(event.target.value);
    const oldDepth = diver1Depth;

    // Calculate time passed based on depth change (10m = 10 min)
    const depthChange = Math.abs(newDepth - oldDepth);
    const timePassed = depthChange; // 10m = 10 minutes

    // Update depth and consume gas
    handleManualDepthChange(1, oldDepth, newDepth, timePassed);
  };

  const handleDiver2DepthChange = (event) => {
    const newDepth = parseFloat(event.target.value);
    const oldDepth = diver2Depth;

    // Calculate time passed based on depth change (10m = 10 min)
    const depthChange = Math.abs(newDepth - oldDepth);
    const timePassed = depthChange; // 10m = 10 minutes

    // Update depth and consume gas
    handleManualDepthChange(2, oldDepth, newDepth, timePassed);
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
          step="5"
          value={diver1Depth}
          onChange={handleDiver1DepthChange}
          disabled={isDisabled}
          className={`slider depth-slider ${isDisabled ? 'disabled' : ''}`}
          title={isDisabled ? 'Disabled during auto simulation' : 'Adjust Diver 1 depth (5m steps)'}
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
          step="5"
          value={diver2Depth}
          onChange={handleDiver2DepthChange}
          disabled={isDisabled}
          className={`slider depth-slider ${isDisabled ? 'disabled' : ''}`}
          title={isDisabled ? 'Disabled during auto simulation' : 'Adjust Diver 2 depth (5m steps)'}
        />
        <div className="slider-range">
          <span>{SIMULATION_CONSTANTS.DIVER_DEPTH_RANGE.min} m</span>
          <span>{SIMULATION_CONSTANTS.DIVER_DEPTH_RANGE.max} m</span>
        </div>
      </div>

      {/* Assumption Legend */}
      <div style={{
        marginTop: '16px',
        padding: '12px',
        background: 'rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '6px',
        fontSize: '12px',
        color: '#94a3b8',
        lineHeight: '1.6'
      }}>
        <div style={{ fontWeight: '600', color: '#3b82f6', marginBottom: '4px' }}>
          📊 Manual Mode Assumption:
        </div>
        <div>
          • Each <strong>10 meters</strong> of depth change = <strong>10 minutes</strong> of dive time
        </div>
        <div>
          • Gas consumption calculated based on depth and time at depth
        </div>
        <div>
          • Cylinder pressure decreases as divers change depth
        </div>
      </div>
    </div>
  );
};

export default DiverDepthControls;