# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based drone telemetry dashboard that displays real-time sensor data through various gauge visualizations. The application is designed to visualize drone metrics including battery level, temperature, speed, acceleration, barometric pressure, and orientation data (pitch, roll, yaw).

## Development Commands

```bash
# Start development server
npm start

# Build for production
npm build

# Run tests
npm test
```

Note: This project requires `NODE_OPTIONS=--openssl-legacy-provider` flag due to legacy OpenSSL dependencies in react-scripts 3.0.1.

## Architecture

### Component Structure

The application follows a flat component architecture where each gauge type is implemented as a standalone component in `src/`:

- **Main App** (`src/index.js`): Root component that manages state and renders all gauge components. Contains mock drone data structure and updates via timer intervals.

- **Battery Component** (`src/battery.js`): Custom-built battery gauge using pure React/CSS. Renders 10 bars with conditional coloring (red below 25%, green otherwise). Uses a background image (`gauge-bg.png`).

- **Dial Component** (`src/dial.js`): Uses `react-gauge-chart` library for basic percentage-based gauges. Displays speed metrics (X/Y axes).

- **AccelDial Component** (`src/accelDial.js`): Specialized variant of Dial using `react-gauge-chart` with a centered needle design. Handles negative-to-positive value ranges for acceleration data.

- **Speedometer Component** (`src/speedometer.js`): Uses `react-d3-speedometer` library for traditional speedometer-style gauges. Configured for -100 to 120 range.

- **Temp Component** (`src/temp.js`): Uses `react-thermometer-component` for thermometer-style temperature display. Shows both low and high temperatures.

- **Barometer Component** (`src/barometer.js`): Uses `react-google-charts` Gauge chart for barometric pressure display. Range: -200 to 200.

- **Time Component** (`src/time.js`): Placeholder component for flight time tracking (currently not implemented).

### Data Flow

The application uses a single source of truth in the main App component's state:
- Mock data structure (`incoming` object) defines the expected drone telemetry format
- State is initialized from mock data and can be updated via manual input fields or timer
- Each gauge component receives data as props and re-renders on state changes
- No external data fetching or WebSocket connections are currently implemented

### Key Technical Considerations

1. **Multiple Gauge Libraries**: The project uses 5 different gauge libraries (`react-gauge-chart`, `react-d3-speedometer`, `react-google-charts`, `react-thermometer-component`, `react-canvas-gauges`). Consider consolidating to reduce bundle size if modifying.

2. **Legacy Dependencies**: React 16.8.6 and react-scripts 3.0.1 are outdated. OpenSSL legacy provider is required for builds. Major dependency upgrades may require significant refactoring.

3. **Inline Styles**: All components use inline JavaScript style objects rather than CSS modules or styled-components.

4. **Data Structure**: Expected telemetry format includes:
   - Battery: 0-100 percentage
   - Temperatures: Celsius values
   - Speeds (vgx, vgy, vgz): velocity values
   - Accelerations (agx, agy, agz): acceleration values
   - Orientation: pitch, roll, yaw angles
   - Barometer: pressure readings
   - Location: GPS coordinates as string

5. **State Management**: Currently uses class component state. No Redux or Context API. Converting to functional components with hooks would require rewriting the main App component.
