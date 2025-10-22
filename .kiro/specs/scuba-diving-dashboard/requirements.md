# Requirements Document

## Introduction

The Scuba Diving Simulation Dashboard is an interactive training and testing platform designed for diving instructors and trainees. The system provides dual operation modes (Manual and Auto Simulation), real-time gauge monitoring, and analytical charts to track diver vitals and air consumption dynamically during simulated diving sessions.

## Glossary

- **Dashboard**: The main user interface containing all controls, gauges, and analytics
- **Control Panel**: Top section interface for managing dive parameters and simulation controls
- **Live Gauges**: Center section displaying real-time diving metrics with visual indicators
- **Dive Analytics**: Bottom section showing historical charts and computed metrics
- **Manual Mode**: Operation mode allowing direct user input for all gauge values
- **Auto Simulation Mode**: Operation mode with automated updates based on simulation logic
- **Umbilical Pressure**: Pressure in the diver's air supply line from surface
- **Cylinder Volume**: Remaining air percentage in diving cylinders
- **Diver Pressure**: Individual pressure readings for each diver's air supply
- **Ambient Pressure**: Calculated pressure based on diving depth
- **Air Consumption Rate**: Rate at which each diver consumes air (L/min)
- **Dive Time Remaining**: Estimated time left based on current air usage
- **Leak Simulation**: Emergency scenario simulation reducing pressures instantly

## Requirements

### Requirement 1

**User Story:** As a diving instructor, I want to control dive parameters through an intuitive control panel, so that I can simulate various diving conditions for training purposes.

#### Acceptance Criteria

1. THE Dashboard SHALL display a depth slider with range 0-40 meters and default value of 20 meters
2. WHEN the depth slider changes, THE Dashboard SHALL update ambient pressure and air consumption calculations
3. THE Dashboard SHALL provide consumption rate sliders for Diver 1 (10-50 L/min, default 25) and Diver 2 (10-50 L/min, default 20)
4. THE Dashboard SHALL include cylinder selector radio buttons with options "Cylinder 1", "Cylinder 2", and "Both" with "Both" as default
5. THE Dashboard SHALL provide simulation control buttons for Start, Pause, Trigger Leak, and Reset All Gauges

### Requirement 2

**User Story:** As a diving trainee, I want to switch between manual and automatic simulation modes, so that I can practice both controlled scenarios and real-time simulations.

#### Acceptance Criteria

1. THE Dashboard SHALL display a mode toggle with options "Manual Mode" and "Auto Simulation Mode"
2. WHILE in Manual Mode, THE Dashboard SHALL allow direct editing of all gauge values through number inputs or sliders
3. WHILE in Manual Mode, THE Dashboard SHALL pause automatic updates and apply manual changes instantly
4. WHILE in Auto Simulation Mode, THE Dashboard SHALL update all values automatically every 1 second
5. WHILE in Auto Simulation Mode, THE Dashboard SHALL disable manual gauge editing

### Requirement 3

**User Story:** As a diving instructor, I want to monitor critical diving metrics through visual gauges, so that I can assess diver safety and air supply status at a glance.

#### Acceptance Criteria

1. THE Dashboard SHALL display six gauges in a responsive 2x3 grid layout
2. THE Dashboard SHALL show Umbilical Pressure gauge (0-30 bar) with green (0-20), orange (20-25), and red (25-30) zones
3. THE Dashboard SHALL display Cylinder 1 and Cylinder 2 Volume gauges (0-100%) with green (70-100), orange (40-70), and red (0-40) zones
4. THE Dashboard SHALL show Diver 1 and Diver 2 Pressure gauges (0-250 bar) with green (0-180), orange (180-220), and red (220-250) zones
5. THE Dashboard SHALL display Dive Time Remaining gauge calculated from current air usage rates

### Requirement 4

**User Story:** As a diving instructor, I want to view historical dive data through analytical charts, so that I can analyze diving patterns and identify potential issues.

#### Acceptance Criteria

1. THE Dashboard SHALL display a Depth vs Time line chart showing depth changes over the session
2. THE Dashboard SHALL display an Umbilical Pressure vs Time line chart showing pressure variations
3. THE Dashboard SHALL calculate and display Ambient Pressure using formula: 1 + Depth / 10
4. THE Dashboard SHALL calculate Total Air Used using formula: (Diver1Rate + Diver2Rate) × (1 + Depth / 10)
5. THE Dashboard SHALL estimate Remaining Dive Time using formula: (Average Cylinder Volume / Total Air Used) × 10

### Requirement 5

**User Story:** As a diving instructor, I want to simulate emergency scenarios like air leaks, so that I can train divers to respond to critical situations.

#### Acceptance Criteria

1. WHEN the Trigger Leak button is activated, THE Dashboard SHALL reduce Umbilical Pressure by 5 bar instantly
2. WHEN the Trigger Leak button is activated, THE Dashboard SHALL reduce Diver 1 Pressure by 10 bar instantly
3. WHEN Cylinder Volume drops below 20%, THE Dashboard SHALL display a "Low Air Warning" alert
4. WHEN Umbilical Pressure drops below 10 bar, THE Dashboard SHALL display a "Low Air Warning" alert
5. THE Dashboard SHALL maintain a list of active alerts visible to the user

### Requirement 6

**User Story:** As a diving trainee, I want realistic simulation physics and calculations, so that the training accurately reflects real diving conditions.

#### Acceptance Criteria

1. WHEN depth increases, THE Dashboard SHALL decrease Umbilical Pressure proportionally
2. THE Dashboard SHALL calculate Diver Pressure using formula: Umbilical Pressure - (lineLossFactor × depth)
3. WHILE simulation is running, THE Dashboard SHALL deplete Cylinder 1 Volume by AirUsed × 0.6 / 100 per update
4. WHILE simulation is running, THE Dashboard SHALL deplete Cylinder 2 Volume by AirUsed × 0.4 / 100 per update
5. THE Dashboard SHALL update all calculations every second during Auto Simulation Mode

### Requirement 7

**User Story:** As a user, I want an intuitive and visually appealing interface, so that I can focus on the diving simulation without interface distractions.

#### Acceptance Criteria

1. THE Dashboard SHALL use a dark ocean gradient background (blue-900 to blue-950)
2. THE Dashboard SHALL display gauges with rounded corners, glowing edges, and shadowed panels
3. THE Dashboard SHALL show smooth numeric transitions when values update
4. THE Dashboard SHALL provide hover tooltips explaining each metric
5. THE Dashboard SHALL display a session timer in the top-right corner