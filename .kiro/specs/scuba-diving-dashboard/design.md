# Design Document

## Overview

The Scuba Diving Simulation Dashboard will be built as a React application that transforms the existing gauge-based interface into a comprehensive training platform. The design leverages the current React Google Charts gauge components while adding modern state management, dual operation modes, and analytical capabilities.

The application will feature a three-section layout: Control Panel (top), Live Gauges (center), and Dive Analytics (bottom), with a dark ocean theme optimized for diving simulation training environments.

## Architecture

### Technology Stack
- **Frontend Framework**: React 16.8.6 (existing)
- **State Management**: Zustand (to be added)
- **Charts**: React Google Charts (existing) + Recharts (to be added)
- **Styling**: CSS with CSS-in-JS for dynamic theming
- **Animations**: CSS transitions and transforms
- **Build Tool**: React Scripts (existing)

### Application Structure
```
src/
├── components/
│   ├── ControlPanel/
│   │   ├── DepthSlider.js
│   │   ├── ConsumptionControls.js
│   │   ├── CylinderSelector.js
│   │   ├── SimulationButtons.js
│   │   └── ModeToggle.js
│   ├── Gauges/
│   │   ├── UmbilicalPressure.js (enhanced barometer.js)
│   │   ├── CylinderVolume.js (enhanced existing)
│   │   ├── DiverPressure.js (enhanced diverDepth.js)
│   │   ├── DiveTimeRemaining.js
│   │   └── GaugeGrid.js
│   ├── Analytics/
│   │   ├── DepthChart.js
│   │   ├── PressureChart.js
│   │   └── MetricsPanel.js
│   ├── UI/
│   │   ├── AlertSystem.js
│   │   ├── SessionTimer.js
│   │   └── Tooltip.js
│   └── Dashboard.js
├── store/
│   └── divingStore.js
├── utils/
│   ├── calculations.js
│   └── constants.js
└── styles/
    └── theme.css
```

## Components and Interfaces

### State Management (Zustand Store)

```javascript
// divingStore.js
const useDivingStore = create((set, get) => ({
  // Mode and Control
  mode: 'manual', // 'manual' | 'auto'
  isRunning: false,
  sessionStartTime: null,
  
  // Dive Parameters
  depth: 20,
  diver1Rate: 25,
  diver2Rate: 20,
  selectedCylinder: 'Both', // 'Cylinder 1' | 'Cylinder 2' | 'Both'
  
  // Gauge Values
  umbilicalPressure: 15,
  diver1Pressure: 85,
  diver2Pressure: 120,
  cylinder1Volume: 45,
  cylinder2Volume: 75,
  
  // Computed Values
  ambientPressure: 0,
  totalAirUsed: 0,
  remainingDiveTime: 0,
  
  // Historical Data
  depthHistory: [],
  pressureHistory: [],
  timeHistory: [],
  
  // Alerts
  alerts: [],
  
  // Actions
  setState: (updates) => set(updates),
  startSimulation: () => set({ isRunning: true, sessionStartTime: Date.now() }),
  pauseSimulation: () => set({ isRunning: false }),
  resetAll: () => set(initialState),
  triggerLeak: () => {
    const state = get();
    set({
      umbilicalPressure: Math.max(0, state.umbilicalPressure - 5),
      diver1Pressure: Math.max(0, state.diver1Pressure - 10)
    });
  },
  updateHistoricalData: () => {
    const state = get();
    const now = Date.now();
    set({
      depthHistory: [...state.depthHistory.slice(-59), { time: now, value: state.depth }],
      pressureHistory: [...state.pressureHistory.slice(-59), { time: now, value: state.umbilicalPressure }],
      timeHistory: [...state.timeHistory.slice(-59), now]
    });
  }
}));
```

### Control Panel Components

#### DepthSlider Component
```javascript
// Controlled slider component with real-time depth adjustment
// Range: 0-40 meters, default: 20
// Updates ambient pressure and air consumption on change
// Disabled during auto simulation mode
```

#### ConsumptionControls Component
```javascript
// Two sliders for diver consumption rates
// Diver 1: 10-50 L/min, default: 25
// Diver 2: 10-50 L/min, default: 20
// Real-time updates affect air depletion calculations
```

#### SimulationButtons Component
```javascript
// Four action buttons:
// - Start/Resume Simulation (▶)
// - Pause Simulation (⏸)
// - Trigger Leak (🧯) - emergency scenario
// - Reset All Gauges (🔁) - return to defaults
```

### Gauge Components

#### Enhanced Gauge Architecture
All gauges will extend the existing Google Charts Gauge pattern with:
- Dynamic color zones based on safety thresholds
- Smooth value transitions using CSS animations
- Tooltip integration showing detailed information
- Alert state visual indicators

#### UmbilicalPressure Component (Enhanced Barometer)
```javascript
// Range: 0-30 bar
// Color zones: Green (0-20), Orange (20-25), Red (25-30)
// Special handling for leak scenarios
// Integration with depth-based pressure calculations
```

#### CylinderVolume Components (Enhanced Existing)
```javascript
// Range: 0-100%
// Color zones: Green (70-100), Orange (40-70), Red (0-40)
// Separate components for Cylinder 1 and Cylinder 2
// Real-time depletion based on consumption rates
// Low air warning integration
```

#### DiverPressure Components (Enhanced DiverDepth)
```javascript
// Range: 0-250 bar
// Color zones: Green (0-180), Orange (180-220), Red (220-250)
// Calculated from umbilical pressure minus line loss
// Individual components for Diver 1 and Diver 2
```

#### DiveTimeRemaining Component
```javascript
// Calculated gauge showing estimated remaining dive time
// Based on current air consumption and remaining cylinder volumes
// Dynamic color coding based on time remaining
// Updates every second during simulation
```

### Analytics Components

#### DepthChart Component
```javascript
// Recharts LineChart showing depth over time
// X-axis: Time (last 60 data points)
// Y-axis: Depth in meters
// Real-time updates during simulation
// Responsive design for different screen sizes
```

#### PressureChart Component
```javascript
// Recharts LineChart showing umbilical pressure over time
// Similar structure to DepthChart
// Highlights pressure drops and leak events
// Color-coded zones matching gauge thresholds
```

#### MetricsPanel Component
```javascript
// Computed metrics display:
// - Ambient Pressure: 1 + Depth / 10
// - Total Air Used: (Diver1Rate + Diver2Rate) × (1 + Depth / 10)
// - Remaining Dive Time: (Avg Cylinder Volume / Total Air Used) × 10
// Real-time calculations with formatted display
```

## Data Models

### Core State Interface
```typescript
interface DivingState {
  // Control State
  mode: 'manual' | 'auto';
  isRunning: boolean;
  sessionStartTime: number | null;
  
  // Input Parameters
  depth: number; // 0-40 meters
  diver1Rate: number; // 10-50 L/min
  diver2Rate: number; // 10-50 L/min
  selectedCylinder: 'Cylinder 1' | 'Cylinder 2' | 'Both';
  
  // Gauge Readings
  umbilicalPressure: number; // 0-30 bar
  diver1Pressure: number; // 0-250 bar
  diver2Pressure: number; // 0-250 bar
  cylinder1Volume: number; // 0-100%
  cylinder2Volume: number; // 0-100%
  
  // Computed Values
  ambientPressure: number;
  totalAirUsed: number;
  remainingDiveTime: number;
  
  // Historical Data
  depthHistory: TimeSeriesPoint[];
  pressureHistory: TimeSeriesPoint[];
  timeHistory: number[];
  
  // System State
  alerts: Alert[];
}

interface TimeSeriesPoint {
  time: number;
  value: number;
}

interface Alert {
  id: string;
  type: 'warning' | 'critical';
  message: string;
  timestamp: number;
}
```

### Calculation Constants
```javascript
// constants.js
export const SIMULATION_CONSTANTS = {
  LINE_LOSS_FACTOR: 0.5, // Pressure loss per meter of depth
  CYLINDER_1_RATIO: 0.6, // 60% of air consumption from Cylinder 1
  CYLINDER_2_RATIO: 0.4, // 40% of air consumption from Cylinder 2
  UPDATE_INTERVAL: 1000, // 1 second simulation updates
  HISTORY_LENGTH: 60, // Keep 60 data points (1 minute at 1s intervals)
  
  // Alert Thresholds
  LOW_CYLINDER_THRESHOLD: 20, // 20% remaining
  LOW_PRESSURE_THRESHOLD: 10, // 10 bar
  
  // Leak Simulation
  LEAK_UMBILICAL_DROP: 5, // 5 bar instant drop
  LEAK_DIVER1_DROP: 10 // 10 bar instant drop
};
```

## Error Handling

### Input Validation
- All numeric inputs will be validated against their respective ranges
- Invalid inputs will be clamped to valid ranges with user notification
- State updates will be atomic to prevent partial invalid states

### Simulation Error Handling
- Simulation loop will include try-catch blocks to handle calculation errors
- Failed calculations will log errors and maintain previous valid state
- Automatic recovery mechanisms for temporary calculation failures

### Alert System
- Centralized alert management through Zustand store
- Automatic alert generation for threshold violations
- Alert dismissal and timeout mechanisms
- Visual and audio alert options (audio configurable)

## Testing Strategy

### Unit Testing Focus Areas
1. **Calculation Functions**: All physics and mathematical calculations
2. **State Management**: Zustand store actions and state transitions
3. **Component Logic**: Control panel interactions and mode switching
4. **Alert System**: Threshold detection and alert generation

### Integration Testing
1. **Mode Switching**: Manual to auto mode transitions
2. **Simulation Flow**: Complete simulation cycle testing
3. **Data Flow**: Control panel → gauges → analytics data flow
4. **Emergency Scenarios**: Leak simulation and recovery

### User Acceptance Testing
1. **Training Scenarios**: Realistic diving training workflows
2. **Emergency Response**: Instructor-led emergency simulations
3. **Performance**: Smooth animations and responsive interactions
4. **Accessibility**: Keyboard navigation and screen reader compatibility

### Testing Implementation Notes
- Focus on core functionality testing rather than comprehensive edge cases
- Prioritize testing of safety-critical calculations and alert systems
- Use React Testing Library for component testing
- Mock time-based functions for consistent simulation testing

## Performance Considerations

### Optimization Strategies
- Memoization of expensive calculations using React.useMemo
- Throttled updates for smooth animations without performance impact
- Efficient historical data management with circular buffer approach
- Lazy loading of chart components to improve initial load time

### Memory Management
- Automatic cleanup of historical data beyond retention limits
- Proper cleanup of simulation intervals on component unmount
- Efficient state updates to minimize re-renders

This design provides a comprehensive foundation for building the Scuba Diving Simulation Dashboard while leveraging existing components and maintaining code simplicity and maintainability.