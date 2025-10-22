import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useDivingStore from '../../store/divingStore.js';

/**
 * DepthChart component displays depth changes over time using Recharts
 * Shows last 60 data points with real-time updates
 */
const DepthChart = () => {
  const depthHistory = useDivingStore((state) => state.depthHistory);

  // Format data for Recharts
  const chartData = depthHistory.map((point, index) => ({
    time: index, // Use index as time for cleaner x-axis
    depth: point.value,
    timestamp: point.time // Keep original timestamp for tooltip
  }));

  // Custom tooltip to show actual time
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const timeStr = data.timestamp ? new Date(data.timestamp).toLocaleTimeString() : 'N/A';
      
      return (
        <div className="chart-tooltip">
          <p className="tooltip-time">Time: {timeStr}</p>
          <p className="tooltip-value">
            Depth: <span className="tooltip-depth">{payload[0].value ? payload[0].value.toFixed(1) : '0.0'}m</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="depth-chart">
      <h3 className="chart-title">Depth vs Time</h3>
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
              domain={[0, 40]}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              axisLine={{ stroke: '#4B5563' }}
              tickLine={{ stroke: '#4B5563' }}
              label={{ value: 'Depth (m)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="depth" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, fill: '#1D4ED8' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DepthChart;