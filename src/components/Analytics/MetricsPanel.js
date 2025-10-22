import React from 'react';
import useDivingStore from '../../store/divingStore.js';

/**
 * MetricsPanel component displays computed metrics with real-time updates
 * Shows Ambient Pressure, Total Air Used, and Remaining Dive Time
 * Updates calculations every second during simulation
 */
const MetricsPanel = () => {
  const {
    ambientPressure,
    totalAirUsed,
    remainingDiveTime,
    depth,
    diver1Rate,
    diver2Rate,
    cylinder1Volume,
    cylinder2Volume
  } = useDivingStore((state) => ({
    ambientPressure: state.ambientPressure,
    totalAirUsed: state.totalAirUsed,
    remainingDiveTime: state.remainingDiveTime,
    depth: state.depth,
    diver1Rate: state.diver1Rate,
    diver2Rate: state.diver2Rate,
    cylinder1Volume: state.cylinder1Volume,
    cylinder2Volume: state.cylinder2Volume
  }));

  // Format time in minutes and seconds
  const formatTime = (minutes) => {
    if (minutes === Infinity || isNaN(minutes) || minutes < 0) {
      return 'N/A';
    }
    
    const totalMinutes = Math.floor(minutes);
    const seconds = Math.floor((minutes - totalMinutes) * 60);
    
    if (totalMinutes >= 60) {
      const hours = Math.floor(totalMinutes / 60);
      const remainingMinutes = totalMinutes % 60;
      return `${hours}h ${remainingMinutes}m ${seconds}s`;
    }
    
    return `${totalMinutes}m ${seconds}s`;
  };

  // Get color based on remaining dive time
  const getTimeColor = (time) => {
    if (time === Infinity || isNaN(time)) return '#9CA3AF';
    if (time < 5) return '#EF4444'; // Red for less than 5 minutes
    if (time < 15) return '#F59E0B'; // Orange for less than 15 minutes
    return '#10B981'; // Green for more than 15 minutes
  };

  // Get color based on air consumption rate
  const getConsumptionColor = (rate) => {
    if (rate > 80) return '#EF4444'; // Red for high consumption
    if (rate > 50) return '#F59E0B'; // Orange for moderate consumption
    return '#10B981'; // Green for low consumption
  };

  return (
    <div className="metrics-panel">
      <h3 className="metrics-title">Computed Metrics</h3>
      
      <div className="metrics-grid">
        {/* Ambient Pressure */}
        <div className="metric-card">
          <div className="metric-header">
            <h4 className="metric-name">Ambient Pressure</h4>
            <div className="metric-info">
              <span className="metric-formula">1 + Depth / 10</span>
            </div>
          </div>
          <div className="metric-value">
            <span className="metric-number">{ambientPressure ? ambientPressure.toFixed(2) : '0.00'}</span>
            <span className="metric-unit">bar</span>
          </div>
          <div className="metric-details">
            <span className="metric-detail">At {depth || 0}m depth</span>
          </div>
        </div>

        {/* Total Air Used */}
        <div className="metric-card">
          <div className="metric-header">
            <h4 className="metric-name">Total Air Used</h4>
            <div className="metric-info">
              <span className="metric-formula">(D1 + D2) × (1 + Depth / 10)</span>
            </div>
          </div>
          <div className="metric-value">
            <span 
              className="metric-number"
              style={{ color: getConsumptionColor(totalAirUsed || 0) }}
            >
              {totalAirUsed ? totalAirUsed.toFixed(1) : '0.0'}
            </span>
            <span className="metric-unit">L/min</span>
          </div>
          <div className="metric-details">
            <span className="metric-detail">
              D1: {diver1Rate || 0} L/min, D2: {diver2Rate || 0} L/min
            </span>
          </div>
        </div>

        {/* Remaining Dive Time */}
        <div className="metric-card">
          <div className="metric-header">
            <h4 className="metric-name">Remaining Dive Time</h4>
            <div className="metric-info">
              <span className="metric-formula">(Avg Volume / Air Used) × 10</span>
            </div>
          </div>
          <div className="metric-value">
            <span 
              className="metric-number"
              style={{ color: getTimeColor(remainingDiveTime) }}
            >
              {formatTime(remainingDiveTime)}
            </span>
          </div>
          <div className="metric-details">
            <span className="metric-detail">
              C1: {cylinder1Volume ? cylinder1Volume.toFixed(0) : '0'}%, C2: {cylinder2Volume ? cylinder2Volume.toFixed(0) : '0'}%
            </span>
          </div>
        </div>


      </div>
    </div>
  );
};

export default MetricsPanel;