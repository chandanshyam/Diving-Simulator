// Simulation constants and thresholds for the Scuba Diving Dashboard

export const SIMULATION_CONSTANTS = {
  // Physics and Calculation Constants
  LINE_LOSS_FACTOR: 0.5, // Pressure loss per meter of depth
  CYLINDER_1_RATIO: 0.6, // 60% of air consumption from Cylinder 1
  CYLINDER_2_RATIO: 0.4, // 40% of air consumption from Cylinder 2
  UPDATE_INTERVAL: 1000, // 1 second simulation updates (milliseconds)
  HISTORY_LENGTH: 60, // Keep 60 data points (1 minute at 1s intervals)
  
  // Alert Thresholds
  LOW_CYLINDER_THRESHOLD: 20, // 20% remaining cylinder volume
  LOW_PRESSURE_THRESHOLD: 10, // 10 bar umbilical pressure
  
  // Emergency Leak Simulation
  LEAK_UMBILICAL_DROP: 5, // 5 bar instant drop in umbilical pressure
  LEAK_DIVER1_DROP: 10, // 10 bar instant drop in diver 1 pressure
  
  // Default Values
  DEFAULT_DEPTH: 20, // meters
  DEFAULT_DIVER1_DEPTH: 10, // meters (start at 10m)
  DEFAULT_DIVER2_DEPTH: 10, // meters (start at 10m)
  DEFAULT_SELECTED_CYLINDER: 'Both',

  // Realistic Diving Physics Constants
  RMV: 15, // Respiratory Minute Volume at surface (L/min)
  CYLINDER_VOLUME_LITERS: 50, // Cylinder volume in liters (standard scuba cylinder)
  START_PRESSURE_BAR: 200, // Starting pressure in bars
  
  // Gauge Ranges and Thresholds
  DEPTH_RANGE: { min: 0, max: 40 }, // meters
  DIVER_DEPTH_RANGE: { min: 0, max: 40 }, // meters
  UMBILICAL_PRESSURE_RANGE: { min: 0, max: 30 }, // bar
  DIVER_PRESSURE_RANGE: { min: 0, max: 250 }, // bar
  DIVER_DEPTH_ZONES: { min: 0, max: 40 }, // meters (for diver depth gauges)
  CYLINDER_PRESSURE_RANGE: { min: 0, max: 200 }, // bar (changed from percentage)
  CYLINDER_VOLUME_RANGE: { min: 0, max: 100 }, // percentage
  CONSUMPTION_RANGE: { min: 10, max: 50 }, // L/min
  
  // Color Zone Thresholds
  UMBILICAL_PRESSURE_ZONES: {
    red1: { min: 0, max: 7 },      // Low pressure - danger
    green: { min: 7, max: 20 },    // Safe operating range
    red2: { min: 20, max: 30 }     // High pressure - danger
  },
  
  CYLINDER_PRESSURE_ZONES: {
    green: { min: 140, max: 200 },
    orange: { min: 80, max: 140 },
    red: { min: 0, max: 80 }
  },
  
  CYLINDER_VOLUME_ZONES: {
    green: { min: 50, max: 100 },
    orange: { min: 20, max: 50 },
    red: { min: 0, max: 20 }
  },
  
  DIVER_PRESSURE_ZONES: {
    green: { min: 150, max: 250 },
    orange: { min: 100, max: 150 },
    red: { min: 0, max: 100 }
  },
  
  DIVER_DEPTH_GAUGE_ZONES: {
    green: { min: 0, max: 20 },
    orange: { min: 20, max: 30 },
    red: { min: 30, max: 40 }
  }
};

// Initial state values for the diving simulation
export const INITIAL_STATE = {
  // Mode and Control
  mode: 'manual', // 'manual' | 'auto'
  isRunning: false,
  sessionStartTime: null,
  useRealisticProfile: true, // Enable realistic 60-min dive profile
  
  // Dive Parameters
  depth: SIMULATION_CONSTANTS.DEFAULT_DEPTH,
  diver1Depth: 0, // Start at surface (0m)
  diver2Depth: 0, // Start at surface (0m)
  diver1Rate: 20, // L/min
  diver2Rate: 25, // L/min
  selectedCylinder: SIMULATION_CONSTANTS.DEFAULT_SELECTED_CYLINDER,
  
  // Gauge Values (initial realistic values)
  umbilicalPressure: 10, // bar (starts at 10 bars at surface, varies with depth)
  diver1Pressure: 180, // bar
  diver2Pressure: 180, // bar
  cylinder1Volume: 100, // percentage
  cylinder2Volume: 100, // percentage
  cylinder1Pressure: 200, // bar (100% = 200 bar)
  cylinder2Pressure: 200, // bar (100% = 200 bar)
  
  // Computed Values
  ambientPressure: 3.0, // 1 + depth/10 = 1 + 20/10 = 3.0
  totalAirUsed: 0,
  remainingDiveTime: 0,
  
  // Historical Data
  depthHistory: [],
  pressureHistory: [],
  timeHistory: [],
  
  // Alerts
  alerts: []
};

// Alert types and messages
export const ALERT_TYPES = {
  WARNING: 'warning',
  CRITICAL: 'critical'
};

export const ALERT_MESSAGES = {
  LOW_CYLINDER: 'Low Air Warning: Cylinder volume below 20%',
  LOW_PRESSURE: 'Low Air Warning: Umbilical pressure below 10 bar',
  EMERGENCY_LEAK: 'Emergency: Air leak detected'
};

// UI Constants
export const UI_CONSTANTS = {
  GAUGE_GRID_COLUMNS: 3,
  GAUGE_GRID_ROWS: 2,
  CHART_HEIGHT: 300,
  CHART_WIDTH: '100%',
  ANIMATION_DURATION: 300, // milliseconds
  TOOLTIP_DELAY: 500, // milliseconds
  ALERT_TIMEOUT: 10000 // 10 seconds auto-dismiss for warning alerts
};