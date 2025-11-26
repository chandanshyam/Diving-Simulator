import React from 'react';
import useDivingStore from '../../store/divingStore.js';
import { SIMULATION_CONSTANTS } from '../../utils/constants.js';

const ManualInputPanel = () => {
  const {
    mode,
    umbilicalPressure,
    diver1Pressure,
    diver2Pressure,
    cylinder1Pressure,
    cylinder2Pressure,
    setUmbilicalPressure,
    setDiver1Pressure,
    setDiver2Pressure,
    setCylinder1Pressure,
    setCylinder2Pressure,
    updateComputedValues
  } = useDivingStore();

  // Only show in manual mode
  if (mode !== 'manual') {
    return null;
  }

  const handleInputChange = (setter, value, range) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      // Clamp value to valid range
      const clampedValue = Math.max(range.min, Math.min(range.max, numValue));
      setter(clampedValue);
      // Update computed values immediately when manual values change
      setTimeout(() => updateComputedValues(), 0);
    }
  };

  const inputStyle = {
    width: '80px',
    padding: '4px 8px',
    borderRadius: '4px',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    background: 'rgba(15, 23, 42, 0.8)',
    color: '#fff',
    fontSize: '14px',
    textAlign: 'center'
  };

  const labelStyle = {
    color: '#e2e8f0',
    fontSize: '12px',
    fontWeight: '500',
    marginBottom: '4px'
  };

  const groupStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    minWidth: '100px'
  };

  const containerStyle = {
    background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.2), rgba(15, 23, 42, 0.2))',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    borderRadius: '8px',
    padding: '16px',
    margin: '16px 0',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: '16px',
    alignItems: 'center'
  };

  return (
    <div style={containerStyle}>
      <h3 style={{ color: '#fff', marginBottom: '16px', textAlign: 'center' }}>
        Manual Gauge Controls
      </h3>
      
      <div style={gridStyle}>
        <div style={groupStyle}>
          <label style={labelStyle}>Umbilical Pressure</label>
          <input
            type="number"
            value={umbilicalPressure ? umbilicalPressure.toFixed(1) : '0.0'}
            onChange={(e) => handleInputChange(
              setUmbilicalPressure, 
              e.target.value, 
              SIMULATION_CONSTANTS.UMBILICAL_PRESSURE_RANGE
            )}
            style={inputStyle}
            step="0.1"
            min={SIMULATION_CONSTANTS.UMBILICAL_PRESSURE_RANGE.min}
            max={SIMULATION_CONSTANTS.UMBILICAL_PRESSURE_RANGE.max}
          />
          <span style={{ fontSize: '10px', color: '#94a3b8' }}>bar</span>
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>Diver 1 Pressure</label>
          <input
            type="number"
            value={diver1Pressure ? diver1Pressure.toFixed(1) : '0.0'}
            onChange={(e) => handleInputChange(
              setDiver1Pressure, 
              e.target.value, 
              SIMULATION_CONSTANTS.DIVER_PRESSURE_RANGE
            )}
            style={inputStyle}
            step="1"
            min={SIMULATION_CONSTANTS.DIVER_PRESSURE_RANGE.min}
            max={SIMULATION_CONSTANTS.DIVER_PRESSURE_RANGE.max}
          />
          <span style={{ fontSize: '10px', color: '#94a3b8' }}>bar</span>
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>Diver 2 Pressure</label>
          <input
            type="number"
            value={diver2Pressure ? diver2Pressure.toFixed(1) : '0.0'}
            onChange={(e) => handleInputChange(
              setDiver2Pressure, 
              e.target.value, 
              SIMULATION_CONSTANTS.DIVER_PRESSURE_RANGE
            )}
            style={inputStyle}
            step="1"
            min={SIMULATION_CONSTANTS.DIVER_PRESSURE_RANGE.min}
            max={SIMULATION_CONSTANTS.DIVER_PRESSURE_RANGE.max}
          />
          <span style={{ fontSize: '10px', color: '#94a3b8' }}>bar</span>
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>Cylinder 1 Pressure</label>
          <input
            type="number"
            value={cylinder1Pressure ? cylinder1Pressure.toFixed(1) : '0.0'}
            onChange={(e) => handleInputChange(
              setCylinder1Pressure,
              e.target.value,
              SIMULATION_CONSTANTS.CYLINDER_PRESSURE_RANGE
            )}
            style={inputStyle}
            step="1"
            min={SIMULATION_CONSTANTS.CYLINDER_PRESSURE_RANGE.min}
            max={SIMULATION_CONSTANTS.CYLINDER_PRESSURE_RANGE.max}
          />
          <span style={{ fontSize: '10px', color: '#94a3b8' }}>bar</span>
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>Cylinder 2 Pressure</label>
          <input
            type="number"
            value={cylinder2Pressure ? cylinder2Pressure.toFixed(1) : '0.0'}
            onChange={(e) => handleInputChange(
              setCylinder2Pressure,
              e.target.value,
              SIMULATION_CONSTANTS.CYLINDER_PRESSURE_RANGE
            )}
            style={inputStyle}
            step="1"
            min={SIMULATION_CONSTANTS.CYLINDER_PRESSURE_RANGE.min}
            max={SIMULATION_CONSTANTS.CYLINDER_PRESSURE_RANGE.max}
          />
          <span style={{ fontSize: '10px', color: '#94a3b8' }}>bar</span>
        </div>
      </div>
      
      <div style={{ 
        textAlign: 'center', 
        marginTop: '12px', 
        fontSize: '12px', 
        color: '#94a3b8' 
      }}>
        Changes are applied instantly to gauges and calculations
      </div>
    </div>
  );
};

export default ManualInputPanel;