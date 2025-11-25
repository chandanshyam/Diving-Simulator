import React from 'react';

/**
 * GaugeWrapper - Wrapper component for gauges that adds visual alerts
 * and min/max labels
 *
 * @param {React.ReactNode} children - The gauge component to wrap
 * @param {number} currentValue - Current gauge value
 * @param {number} alertThreshold - Value below which to show alert (for pressure/time)
 * @param {number} safeRangeMin - Minimum safe value (for range-based alerts like umbilical pressure)
 * @param {number} safeRangeMax - Maximum safe value (for range-based alerts like umbilical pressure)
 * @param {number} minValue - Minimum value for the gauge
 * @param {number} maxValue - Maximum value for the gauge
 * @param {string} unit - Unit label (e.g., "bars", "meters", "minutes")
 * @param {boolean} alertOnLow - Whether to alert when value is low (default: true)
 * @param {boolean} showLabels - Whether to show min/max labels (default: true)
 */
const GaugeWrapper = ({
  children,
  currentValue = 0,
  alertThreshold = null,
  safeRangeMin = null,
  safeRangeMax = null,
  minValue = 0,
  maxValue = 100,
  unit = '',
  alertOnLow = true,
  showLabels = true
}) => {
  // Determine if gauge should show alert
  let shouldAlert = false;

  if (safeRangeMin !== null && safeRangeMax !== null) {
    // Range-based alert: alert when value is OUTSIDE the safe range
    shouldAlert = currentValue > 0 && (currentValue < safeRangeMin || currentValue > safeRangeMax);
  } else if (alertThreshold !== null) {
    // Threshold-based alert: alert when value crosses threshold
    shouldAlert = alertOnLow
      ? currentValue < alertThreshold && currentValue > 0
      : currentValue > alertThreshold;
  }

  // Apply alert class conditionally
  const gaugeClassName = shouldAlert ? 'gauge-alert' : '';

  return (
    <div className={gaugeClassName} style={{ width: '100%', height: '100%' }}>
      {children}

      {showLabels && (
        <div className="gauge-labels">
          <span className="gauge-label-min">
            {minValue} {unit}
          </span>
          <span className="gauge-label-max">
            {maxValue} {unit}
          </span>
        </div>
      )}
    </div>
  );
};

export default GaugeWrapper;
