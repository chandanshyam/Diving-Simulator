import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import useDivingStore from '../../store/divingStore.js';

/**
 * PressureChart component displays umbilical pressure variations over time
 * Highlights pressure drops and leak events with color coding
 * Matches color zones from gauge thresholds
 */
const PressureChart = () => {
  const pressureHistory = useDivingStore((state) => state.pressureHistory);

  // Format data for Recharts
  const chartData = pressureHistory.map((point, index) => ({
    time: index, // Use index as time for cleaner x-axis
    pressure: point.value,
    timestamp: point.time, // Keep original timestamp for tooltip
    // Color coding based on pressure zones
    zone: point.value >= 25 ? 'red' : point.value >= 20 ? 'orange' : 'green'
  }));

  // Custom tooltip to show actual time and pressure zone
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const timeStr = data.timestamp ? new Date(data.timestamp).toLocaleTimeString() : 'N/A';
      const pressure = payload[0].value;
      const zone = pressure >= 25 ? 'Critical' : pressure >= 20 ? 'Warning' : 'Normal';
      const zoneColor = pressure >= 25 ? '#EF4444' : pressure >= 20 ? '#F59E0B' : '#10B981';

      return (
        <div className="chart-tooltip">
          <p className="tooltip-time">Time: {timeStr}</p>
          <p className="tooltip-value">
            Pressure: <span className="tooltip-pressure">{pressure ? pressure.toFixed(1) : '0.0'} bar</span>
          </p>
          <p className="tooltip-zone" style={{ color: zoneColor }}>
            Zone: {zone}
          </p>
        </div>
      );
    }
    return null;
  };

  // Determine line color based on latest pressure reading
  const getLineColor = () => {
    if (chartData.length === 0) return '#10B981';
    const latestPressure = chartData[chartData.length - 1].pressure;
    if (latestPressure >= 25) return '#EF4444'; // Red zone
    if (latestPressure >= 20) return '#F59E0B'; // Orange zone
    return '#10B981'; // Green zone
  };

  return (
    <div className="pressure-chart">
      <h3 className="chart-title">Umbilical Pressure vs Time</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="time"
              type="number"
              scale="linear"
              domain={['dataMin', 'dataMax']}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              axisLine={{ stroke: '#4B5563' }}
              tickLine={{ stroke: '#4B5563' }}
              label={{ value: 'Time Points', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
            />
            <YAxis
              domain={[0, 30]}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              axisLine={{ stroke: '#4B5563' }}
              tickLine={{ stroke: '#4B5563' }}
              label={{ value: 'Pressure (bar)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
            />

            {/* Reference lines for pressure zones */}
            <ReferenceLine
              y={20}
              stroke="#F59E0B"
              strokeDasharray="5 5"
              strokeOpacity={0.6}
              label={{ value: "Warning Zone", position: "topRight", fill: "#F59E0B", fontSize: 10 }}
            />
            <ReferenceLine
              y={25}
              stroke="#EF4444"
              strokeDasharray="5 5"
              strokeOpacity={0.6}
              label={{ value: "Critical Zone", position: "topRight", fill: "#EF4444", fontSize: 10 }}
            />

            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="pressure"
              stroke={getLineColor()}
              strokeWidth={2}
              dot={{ fill: getLineColor(), strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, fill: getLineColor(), strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend for pressure zones */}
      <div className="pressure-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#10B981' }}></div>
          <span>Normal (0-20 bar)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#F59E0B' }}></div>
          <span>Warning (20-25 bar)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#EF4444' }}></div>
          <span>Critical (25-30 bar)</span>
        </div>
      </div>
    </div>
  );
};

export default PressureChart;