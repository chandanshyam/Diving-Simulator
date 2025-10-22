# Implementation Plan

- [x] 1. Set up project dependencies and core infrastructure
  - Install Zustand for state management and Recharts for analytics charts
  - Create project directory structure for components, store, utils, and styles
  - Set up constants file with simulation parameters and thresholds
  - _Requirements: 1.1, 2.1, 7.1_

- [x] 2. Implement core state management with Zustand store
  - [x] 2.1 Create diving simulation store with complete state interface
    - Define all state properties for dive parameters, gauge values, and historical data
    - Implement basic state update actions and getters
    - _Requirements: 2.1, 2.2, 6.1_
  
  - [x] 2.2 Add simulation control actions
    - Implement start, pause, reset, and trigger leak actions
    - Add mode switching between manual and auto simulation
    - _Requirements: 1.5, 2.3, 2.4, 5.1, 5.2_
  
  - [x] 2.3 Implement physics calculation functions
    - Create ambient pressure calculation: 1 + Depth / 10
    - Implement air consumption calculations with depth factors
    - Add diver pressure calculations with line loss factors
    - _Requirements: 4.3, 4.4, 6.2, 6.3_

- [x] 3. Create enhanced gauge components
  - [x] 3.1 Enhance UmbilicalPressure component from existing barometer
    - Update color zones to green (0-20), orange (20-25), red (25-30)
    - Add smooth value transitions and alert state indicators
    - Integrate with Zustand store for real-time updates
    - _Requirements: 3.2, 7.3_
  
  - [x] 3.2 Update CylinderVolume components with new color zones
    - Modify existing components to use green (70-100), orange (40-70), red (0-40) zones
    - Add real-time depletion calculations based on consumption rates
    - Create separate instances for Cylinder 1 and Cylinder 2
    - _Requirements: 3.3, 6.3, 6.4_
  
  - [x] 3.3 Enhance DiverPressure components from existing diverDepth
    - Update color zones to green (0-180), orange (180-220), red (220-250)
    - Implement calculated pressure from umbilical pressure minus line loss
    - Create separate components for Diver 1 and Diver 2
    - _Requirements: 3.4, 6.2_
  
  - [x] 3.4 Create DiveTimeRemaining gauge component
    - Build new gauge showing estimated remaining dive time
    - Calculate from current air consumption and remaining cylinder volumes
    - Add dynamic color coding based on time remaining
    - _Requirements: 3.5, 4.5_
  
  - [x] 3.5 Implement responsive gauge grid layout
    - Create 2x3 grid layout for all six gauges
    - Add rounded corners, glowing edges, and shadowed panels
    - Ensure responsive design for different screen sizes
    - _Requirements: 3.1, 7.2_

- [x] 4. Build control panel interface
  - [x] 4.1 Create depth slider component
    - Implement range slider for 0-40 meters with default 20
    - Connect to Zustand store for real-time depth updates
    - Disable during auto simulation mode
    - _Requirements: 1.1, 1.2, 2.5_
  
  - [x] 4.2 Implement consumption rate controls
    - Create sliders for Diver 1 (10-50 L/min, default 25) and Diver 2 (10-50 L/min, default 20)
    - Connect to air consumption calculations
    - Update cylinder depletion rates in real-time
    - _Requirements: 1.3, 6.3, 6.4_
  
  - [x] 4.3 Add cylinder selector radio buttons
    - Create radio button group with "Cylinder 1", "Cylinder 2", "Both" options
    - Set "Both" as default selection
    - Connect to air consumption distribution logic
    - _Requirements: 1.4_
  
  - [x] 4.4 Create simulation control buttons
    - Implement Start/Resume (▶), Pause (⏸), Trigger Leak (🧯), and Reset (🔁) buttons
    - Connect to Zustand store simulation actions
    - Add visual feedback for button states
    - _Requirements: 1.5, 5.1, 5.2_
  
  - [x] 4.5 Implement mode toggle switch
    - Create toggle between "Manual Mode" and "Auto Simulation Mode"
    - Enable/disable manual gauge editing based on mode
    - Connect to simulation loop control
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 5. Implement simulation engine and physics
  - [x] 5.1 Create auto simulation loop
    - Implement 1-second interval updates for all gauge values
    - Update depth, air consumption, and pressure calculations
    - Manage historical data collection for charts
    - _Requirements: 2.4, 6.1, 6.5, 6.6_
  
  - [x] 5.2 Add manual mode input handling
    - Enable direct editing of all gauge values through inputs
    - Apply changes instantly to gauges and calculations
    - Pause auto updates during manual mode
    - _Requirements: 2.2, 2.3_
  
  - [x] 5.3 Implement emergency leak simulation
    - Reduce umbilical pressure by 5 bar instantly on trigger
    - Reduce Diver 1 pressure by 10 bar instantly
    - Update gauge displays and trigger alerts
    - _Requirements: 5.1, 5.2_

- [x] 6. Create analytics and charts section
  - [x] 6.1 Implement depth vs time chart
    - Create Recharts LineChart showing depth changes over session
    - Display last 60 data points with real-time updates
    - Add responsive design and proper axis labeling
    - _Requirements: 4.1_
  
  - [x] 6.2 Create umbilical pressure vs time chart
    - Build LineChart for pressure variations over time
    - Highlight pressure drops and leak events with color coding
    - Match color zones from gauge thresholds
    - _Requirements: 4.2_
  
  - [x] 6.3 Add computed metrics panel
    - Display Ambient Pressure, Total Air Used, and Remaining Dive Time
    - Update calculations every second during simulation
    - Format values with appropriate units and precision
    - _Requirements: 4.3, 4.4, 4.5_

- [x] 7. Implement alert system and safety features
  - [x] 7.1 Create alert management system
    - Build centralized alert state in Zustand store
    - Implement alert generation for threshold violations
    - Add alert dismissal and timeout mechanisms
    - _Requirements: 5.3, 5.4, 5.5_
  
  - [x] 7.2 Add low air and pressure warnings
    - Trigger alerts when cylinder volume drops below 20%
    - Show warnings when umbilical pressure drops below 10 bar
    - Display visual warning indicators on affected gauges
    - _Requirements: 5.3, 5.4_
  
  - [x] 7.3 Implement visual alert display
    - Create alert notification component with warning icons
    - Add color-coded alert levels (warning, critical)
    - Position alerts prominently without blocking gauge visibility
    - _Requirements: 5.5_

- [x] 8. Apply styling and user experience enhancements
  - [x] 8.1 Implement dark ocean theme
    - Apply dark gradient background (blue-900 to blue-950)
    - Style all components with ocean-themed color palette
    - Ensure proper contrast for readability and accessibility
    - _Requirements: 7.1_
  
  - [x] 8.2 Add smooth animations and transitions
    - Implement CSS transitions for gauge value changes
    - Add hover effects and interactive feedback
    - Create smooth mode switching animations
    - _Requirements: 7.3_
  
  - [x] 8.3 Create session timer and tooltips
    - Add session timer display in top-right corner
    - Implement hover tooltips explaining each metric and control
    - Ensure tooltips work on both desktop and mobile devices
    - _Requirements: 7.4, 7.5_

- [x] 9. Integration and final dashboard assembly
  - [x] 9.1 Integrate all components into main Dashboard
    - Assemble Control Panel, Gauge Grid, and Analytics sections
    - Ensure proper data flow between all components
    - Test mode switching and simulation state management
    - _Requirements: 1.1, 2.1, 3.1, 4.1_
  
  - [x] 9.2 Implement responsive layout and mobile optimization
    - Ensure dashboard works on tablets and mobile devices
    - Adjust gauge sizes and layout for smaller screens
    - Test touch interactions for mobile users
    - _Requirements: 3.1, 7.2_
  
  - [x] 9.3 Add final polish and performance optimization
    - Optimize re-renders and calculation performance
    - Add loading states and error boundaries
    - Ensure smooth 60fps animations and updates
    - _Requirements: 7.3_

- [ ]* 10. Testing and validation
  - [ ]* 10.1 Write unit tests for calculation functions
    - Test ambient pressure, air consumption, and diver pressure calculations
    - Validate threshold detection and alert generation logic
    - Test simulation state transitions and mode switching
    - _Requirements: 4.3, 4.4, 5.1, 5.2, 6.1, 6.2_
  
  - [ ]* 10.2 Create integration tests for simulation flow
    - Test complete simulation cycles from start to finish
    - Validate data flow between control panel, gauges, and analytics
    - Test emergency scenarios and recovery procedures
    - _Requirements: 2.4, 5.1, 5.2, 6.5, 6.6_