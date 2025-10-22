/**
 * Tooltip configuration for all dashboard components
 * Provides contextual help and explanations for metrics and controls
 */

export const TOOLTIP_CONTENT = {
  // Control Panel Tooltips
  DEPTH_SLIDER: {
    content: (
      <div>
        <strong>Depth Control</strong>
        <p>Adjust diving depth from 0-40 meters. Deeper depths increase ambient pressure and air consumption rates.</p>
        <p><em>Disabled during auto simulation mode</em></p>
      </div>
    ),
    position: 'bottom'
  },

  DIVER1_CONSUMPTION: {
    content: (
      <div>
        <strong>Diver 1 Air Consumption</strong>
        <p>Set air consumption rate (10-50 L/min). Higher rates deplete cylinder volume faster.</p>
        <p><em>Default: 25 L/min</em></p>
      </div>
    ),
    position: 'bottom'
  },

  DIVER2_CONSUMPTION: {
    content: (
      <div>
        <strong>Diver 2 Air Consumption</strong>
        <p>Set air consumption rate (10-50 L/min). Independent from Diver 1 consumption.</p>
        <p><em>Default: 20 L/min</em></p>
      </div>
    ),
    position: 'bottom'
  },

  CYLINDER_SELECTOR: {
    content: (
      <div>
        <strong>Cylinder Selection</strong>
        <p>Choose which cylinders supply air:</p>
        <ul>
          <li><strong>Cylinder 1:</strong> 60% of total consumption</li>
          <li><strong>Cylinder 2:</strong> 40% of total consumption</li>
          <li><strong>Both:</strong> Balanced distribution</li>
        </ul>
      </div>
    ),
    position: 'left'
  },

  MODE_TOGGLE: {
    content: (
      <div>
        <strong>Simulation Mode</strong>
        <p><strong>Manual Mode:</strong> Direct control of all gauge values</p>
        <p><strong>Auto Mode:</strong> Realistic simulation with physics calculations</p>
      </div>
    ),
    position: 'left'
  },

  START_BUTTON: {
    content: 'Start or resume the diving simulation with automatic updates',
    position: 'top'
  },

  PAUSE_BUTTON: {
    content: 'Pause the simulation while maintaining current values',
    position: 'top'
  },

  LEAK_BUTTON: {
    content: (
      <div>
        <strong>Emergency Leak Simulation</strong>
        <p>Instantly reduces:</p>
        <ul>
          <li>Umbilical Pressure: -5 bar</li>
          <li>Diver 1 Pressure: -10 bar</li>
        </ul>
        <p><em>Use for emergency training scenarios</em></p>
      </div>
    ),
    position: 'top'
  },

  RESET_BUTTON: {
    content: 'Reset all gauges to default values and stop simulation',
    position: 'top'
  },

  // Gauge Tooltips
  UMBILICAL_PRESSURE: {
    content: (
      <div>
        <strong>Umbilical Pressure (0-30 bar)</strong>
        <p>Air pressure in the supply line from surface</p>
        <p><strong>Zones:</strong></p>
        <ul>
          <li><span style={{color: '#10b981'}}>Green (0-20):</span> Normal</li>
          <li><span style={{color: '#f59e0b'}}>Orange (20-25):</span> Caution</li>
          <li><span style={{color: '#ef4444'}}>Red (25-30):</span> Critical</li>
        </ul>
      </div>
    ),
    position: 'top'
  },

  CYLINDER1_VOLUME: {
    content: (
      <div>
        <strong>Cylinder 1 Volume (0-100%)</strong>
        <p>Remaining air percentage in primary cylinder</p>
        <p><strong>Zones:</strong></p>
        <ul>
          <li><span style={{color: '#10b981'}}>Green (70-100%):</span> Full</li>
          <li><span style={{color: '#f59e0b'}}>Orange (40-70%):</span> Medium</li>
          <li><span style={{color: '#ef4444'}}>Red (0-40%):</span> Low</li>
        </ul>
      </div>
    ),
    position: 'top'
  },

  CYLINDER2_VOLUME: {
    content: (
      <div>
        <strong>Cylinder 2 Volume (0-100%)</strong>
        <p>Remaining air percentage in secondary cylinder</p>
        <p><strong>Zones:</strong></p>
        <ul>
          <li><span style={{color: '#10b981'}}>Green (70-100%):</span> Full</li>
          <li><span style={{color: '#f59e0b'}}>Orange (40-70%):</span> Medium</li>
          <li><span style={{color: '#ef4444'}}>Red (0-40%):</span> Low</li>
        </ul>
      </div>
    ),
    position: 'top'
  },

  DIVER1_PRESSURE: {
    content: (
      <div>
        <strong>Diver 1 Pressure (0-250 bar)</strong>
        <p>Air pressure at diver's location (umbilical pressure minus line loss)</p>
        <p><strong>Zones:</strong></p>
        <ul>
          <li><span style={{color: '#10b981'}}>Green (0-180):</span> Normal</li>
          <li><span style={{color: '#f59e0b'}}>Orange (180-220):</span> High</li>
          <li><span style={{color: '#ef4444'}}>Red (220-250):</span> Critical</li>
        </ul>
      </div>
    ),
    position: 'top'
  },

  DIVER2_PRESSURE: {
    content: (
      <div>
        <strong>Diver 2 Pressure (0-250 bar)</strong>
        <p>Air pressure at diver's location (umbilical pressure minus line loss)</p>
        <p><strong>Zones:</strong></p>
        <ul>
          <li><span style={{color: '#10b981'}}>Green (0-180):</span> Normal</li>
          <li><span style={{color: '#f59e0b'}}>Orange (180-220):</span> High</li>
          <li><span style={{color: '#ef4444'}}>Red (220-250):</span> Critical</li>
        </ul>
      </div>
    ),
    position: 'top'
  },

  DIVE_TIME_REMAINING: {
    content: (
      <div>
        <strong>Dive Time Remaining</strong>
        <p>Estimated time left based on current air consumption and remaining cylinder volumes</p>
        <p><strong>Formula:</strong> (Avg Cylinder Volume / Total Air Used) × 10</p>
        <p><em>Updates in real-time during simulation</em></p>
      </div>
    ),
    position: 'top'
  },

  // Analytics Tooltips
  DEPTH_CHART: {
    content: (
      <div>
        <strong>Depth vs Time Chart</strong>
        <p>Shows depth changes over the current session (last 60 data points)</p>
        <p>Useful for analyzing dive profiles and depth patterns</p>
      </div>
    ),
    position: 'top'
  },

  PRESSURE_CHART: {
    content: (
      <div>
        <strong>Umbilical Pressure vs Time Chart</strong>
        <p>Tracks pressure variations and identifies leak events</p>
        <p>Color zones match gauge thresholds for easy interpretation</p>
      </div>
    ),
    position: 'top'
  },

  AMBIENT_PRESSURE: {
    content: (
      <div>
        <strong>Ambient Pressure</strong>
        <p><strong>Formula:</strong> 1 + Depth / 10</p>
        <p>Represents water pressure at current depth</p>
        <p><em>Increases by 1 bar per 10 meters of depth</em></p>
      </div>
    ),
    position: 'top'
  },

  TOTAL_AIR_USED: {
    content: (
      <div>
        <strong>Total Air Used</strong>
        <p><strong>Formula:</strong> (Diver1Rate + Diver2Rate) × (1 + Depth / 10)</p>
        <p>Combined air consumption adjusted for depth pressure</p>
        <p><em>Higher at greater depths due to increased pressure</em></p>
      </div>
    ),
    position: 'top'
  },

  REMAINING_DIVE_TIME_METRIC: {
    content: (
      <div>
        <strong>Remaining Dive Time</strong>
        <p><strong>Formula:</strong> (Average Cylinder Volume / Total Air Used) × 10</p>
        <p>Calculated estimate based on current consumption rates</p>
        <p><em>Updates every second during simulation</em></p>
      </div>
    ),
    position: 'top'
  },

  SESSION_TIMER: {
    content: (
      <div>
        <strong>Session Timer</strong>
        <p>Shows elapsed time since simulation started</p>
        <p><strong>States:</strong></p>
        <ul>
          <li>⏱️ Ready: Not started</li>
          <li>▶️ Running: Active simulation</li>
          <li>⏸️ Paused: Simulation paused</li>
        </ul>
      </div>
    ),
    position: 'bottom'
  }
};

/**
 * Get tooltip configuration by key
 */
export const getTooltip = (key) => {
  return TOOLTIP_CONTENT[key] || { content: '', position: 'top' };
};

/**
 * Common tooltip props for consistent styling
 */
export const TOOLTIP_DEFAULTS = {
  delay: 500,
  className: 'tooltip-help'
};