import React from 'react';
import useDivingStore from '../../store/divingStore.js';
import { SIMULATION_CONSTANTS } from '../../utils/constants.js';

const ConsumptionControls = () => {
  const { 
    diver1Rate, 
    diver2Rate, 
    mode, 
    isRunning, 
    setDiver1Rate, 
    setDiver2Rate 
  } = useDivingStore();
  
  // Disable controls during auto simulation mode
  const isDisabled = mode === 'auto' && isRunning;
  
  const handleDiver1RateChange = (event) => {
    const newRate = parseFloat(event.target.value);
    setDiver1Rate(newRate);
  };

  const handleDiver2RateChange = (event) => {
    const newRate = parseFloat(event.target.value);
    setDiver2Rate(newRate);
  };

  return (
    <div className="consumption-controls-container">
      <div className="consumption-control">
        <label htmlFor="diver1-rate-slider" className="control-label">
          Diver 1 Rate: {diver1Rate} L/min
        </label>
        <input
          id="diver1-rate-slider"
          type="range"
          min={SIMULATION_CONSTANTS.CONSUMPTION_RANGE.min}
          max={SIMULATION_CONSTANTS.CONSUMPTION_RANGE.max}
          step="1"
          value={diver1Rate}
          onChange={handleDiver1RateChange}
          disabled={isDisabled}
          className={`slider consumption-slider ${isDisabled ? 'disabled' : ''}`}
          title={isDisabled ? 'Disabled during auto simulation' : 'Adjust Diver 1 air consumption rate'}
        />
        <div className="slider-range">
          <span>{SIMULATION_CONSTANTS.CONSUMPTION_RANGE.min} L/min</span>
          <span>{SIMULATION_CONSTANTS.CONSUMPTION_RANGE.max} L/min</span>
        </div>
      </div>

      <div className="consumption-control">
        <label htmlFor="diver2-rate-slider" className="control-label">
          Diver 2 Rate: {diver2Rate} L/min
        </label>
        <input
          id="diver2-rate-slider"
          type="range"
          min={SIMULATION_CONSTANTS.CONSUMPTION_RANGE.min}
          max={SIMULATION_CONSTANTS.CONSUMPTION_RANGE.max}
          step="1"
          value={diver2Rate}
          onChange={handleDiver2RateChange}
          disabled={isDisabled}
          className={`slider consumption-slider ${isDisabled ? 'disabled' : ''}`}
          title={isDisabled ? 'Disabled during auto simulation' : 'Adjust Diver 2 air consumption rate'}
        />
        <div className="slider-range">
          <span>{SIMULATION_CONSTANTS.CONSUMPTION_RANGE.min} L/min</span>
          <span>{SIMULATION_CONSTANTS.CONSUMPTION_RANGE.max} L/min</span>
        </div>
      </div>
    </div>
  );
};

export default ConsumptionControls;