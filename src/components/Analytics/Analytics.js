import DepthChart from './DepthChart.js';
import PressureChart from './PressureChart.js';
import MetricsPanel from './MetricsPanel.js';

/**
 * Analytics component that combines all analytical components
 * Displays charts and computed metrics for dive analysis
 */
const Analytics = () => {
  return (
    <>
      <div className="analytics-header">
        <h2>Dive Analytics</h2>
      </div>

      {/* Charts Grid - Direct placement without extra wrappers */}
      <div className="charts-grid">
        <DepthChart />
        <PressureChart />
      </div>

      {/* Metrics Panel - Direct placement */}
      <MetricsPanel />
    </>
  );
};

export default Analytics;