import { create } from 'zustand';
import { INITIAL_STATE, SIMULATION_CONSTANTS, ALERT_TYPES, ALERT_MESSAGES, UI_CONSTANTS } from '../utils/constants.js';
import {
  calculateAmbientPressure,
  calculateTotalAirConsumption,
  calculateDiverPressure,
  calculateRemainingDiveTime,
  calculateCylinderDepletion,
  calculateUmbilicalPressure,
  isLowCylinderVolume,
  isLowUmbilicalPressure,
  calculateATA,
  calculateNewCylinderPressure,
  pressureToVolumePercentage,
  calculateRemainingDiveTimeRealistic
} from '../utils/calculations.js';

// Create the diving simulation store with Zustand
const useDivingStore = create((set, get) => {
  const store = {
    // Initialize with default state
    ...INITIAL_STATE,

    // Basic state update actions
    setState: (updates) => {
      set((state) => ({
        ...state,
        ...updates
      }));
    },

    // Helper function to clamp values to range
    clampValue: (value, range) => Math.max(range.min, Math.min(range.max, value)),

    // Simplified setters
    setDepth: (depth) => set(state => ({ ...state, depth: store.clampValue(depth, SIMULATION_CONSTANTS.DEPTH_RANGE) })),
    setDiver1Rate: (rate) => set(state => ({ ...state, diver1Rate: store.clampValue(rate, SIMULATION_CONSTANTS.CONSUMPTION_RANGE) })),
    setDiver1Depth: (depth) => set(state => ({ ...state, diver1Depth: store.clampValue(depth, SIMULATION_CONSTANTS.DIVER_DEPTH_RANGE) })),
    setDiver2Depth: (depth) => set(state => ({ ...state, diver2Depth: store.clampValue(depth, SIMULATION_CONSTANTS.DIVER_DEPTH_RANGE) })),
    setSelectedCylinder: (cylinder) => set(state => ({ ...state, selectedCylinder: cylinder })),
    setUmbilicalPressure: (pressure) => set(state => ({ ...state, umbilicalPressure: store.clampValue(pressure, SIMULATION_CONSTANTS.UMBILICAL_PRESSURE_RANGE) })),
    setDiver1Pressure: (pressure) => set(state => ({ ...state, diver1Pressure: store.clampValue(pressure, SIMULATION_CONSTANTS.DIVER_PRESSURE_RANGE) })),
    setDiver2Pressure: (pressure) => set(state => ({ ...state, diver2Pressure: store.clampValue(pressure, SIMULATION_CONSTANTS.DIVER_PRESSURE_RANGE) })),
    setCylinder1Volume: (volume) => {
      const clampedVolume = store.clampValue(volume, SIMULATION_CONSTANTS.CYLINDER_VOLUME_RANGE);
      const pressure = (clampedVolume / 100) * 200; // Convert volume % to pressure (100% = 200 bar)
      set(state => ({ ...state, cylinder1Volume: clampedVolume, cylinder1Pressure: pressure }));
    },
    setCylinder2Volume: (volume) => {
      const clampedVolume = store.clampValue(volume, SIMULATION_CONSTANTS.CYLINDER_VOLUME_RANGE);
      const pressure = (clampedVolume / 100) * 200; // Convert volume % to pressure (100% = 200 bar)
      set(state => ({ ...state, cylinder2Volume: clampedVolume, cylinder2Pressure: pressure }));
    },



    // Update computed values in state
    updateComputedValues: () => {
      const state = get();
      const depth = state.depth || 0;
      const diver1Rate = state.diver1Rate || 0;
      const diver2Rate = state.diver2Rate || 0;
      const cylinder1Volume = state.cylinder1Volume || 0;
      const cylinder2Volume = state.cylinder2Volume || 0;

      const ambientPressure = calculateAmbientPressure(depth);
      const totalAirUsed = calculateTotalAirConsumption(diver1Rate, diver2Rate, depth);
      const remainingDiveTime = calculateRemainingDiveTime(cylinder1Volume, cylinder2Volume, totalAirUsed);

      set({
        ambientPressure,
        totalAirUsed,
        remainingDiveTime
      });
    },

    // Physics-based simulation update for auto mode
    updateSimulationPhysics: () => {
      const state = get();

      if (!state.isRunning || state.mode !== 'auto') return;

      // Get elapsed time since simulation started (in milliseconds)
      const elapsedTime = Date.now() - state.sessionStartTime;

      // Use realistic dive profile if enabled, otherwise use simple physics
      if (state.useRealisticProfile) {
        get().updateRealisticDiveProfile(elapsedTime);
      } else {
        // Simple physics simulation using realistic gas consumption
        const RMV = SIMULATION_CONSTANTS.RMV; // 15 L/min
        const CYLINDER_VOLUME = SIMULATION_CONSTANTS.CYLINDER_VOLUME_LITERS; // 25 L
        const START_PRESSURE = SIMULATION_CONSTANTS.START_PRESSURE_BAR; // 200 bar

        // Get current pressures
        const currentCyl1Pressure = state.cylinder1Pressure || START_PRESSURE;
        const currentCyl2Pressure = state.cylinder2Pressure || START_PRESSURE;

        // Use diver depths for more accurate calculations
        const diver1Depth = state.diver1Depth || state.depth;
        const diver2Depth = state.diver2Depth || state.depth;

        // Calculate new pressures based on realistic physics
        const newCyl1Pressure = calculateNewCylinderPressure(
          currentCyl1Pressure,
          diver1Depth,
          1, // 1 second elapsed
          RMV,
          CYLINDER_VOLUME
        );

        const newCyl2Pressure = calculateNewCylinderPressure(
          currentCyl2Pressure,
          diver2Depth,
          1, // 1 second elapsed
          RMV,
          CYLINDER_VOLUME
        );

        // Convert pressures to volume percentages
        const newCylinder1Volume = pressureToVolumePercentage(newCyl1Pressure, START_PRESSURE);
        const newCylinder2Volume = pressureToVolumePercentage(newCyl2Pressure, START_PRESSURE);

        // Calculate other values
        const newUmbilicalPressure = calculateUmbilicalPressure(state.depth);
        const newDiver1Pressure = calculateDiverPressure(newUmbilicalPressure, diver1Depth);
        const newDiver2Pressure = calculateDiverPressure(newUmbilicalPressure, diver2Depth);

        const ambientPressure = calculateATA(state.depth);
        const ata1 = calculateATA(diver1Depth);
        const ata2 = calculateATA(diver2Depth);
        const totalAirUsed = (ata1 * RMV + ata2 * RMV) / 2;

        // Calculate remaining dive time based on remaining air and current average depth
        const avgPressure = (newCyl1Pressure + newCyl2Pressure) / 2;
        const avgDepth = (diver1Depth + diver2Depth) / 2;
        const remainingDiveTime = calculateRemainingDiveTimeRealistic(
          avgPressure,
          avgDepth,
          RMV,
          CYLINDER_VOLUME
        );

        set({
          umbilicalPressure: newUmbilicalPressure,
          diver1Pressure: newDiver1Pressure,
          diver2Pressure: newDiver2Pressure,
          cylinder1Volume: newCylinder1Volume,
          cylinder2Volume: newCylinder2Volume,
          cylinder1Pressure: newCyl1Pressure,
          cylinder2Pressure: newCyl2Pressure,
          ambientPressure,
          totalAirUsed,
          remainingDiveTime
        });
      }
      get().checkAndGenerateAlerts();
    },

    // Realistic dive profile with depth changes every 10 seconds
    // Every 10 seconds: increase depth by 10m until 40m, then decrease by 10m until 0m
    // Profile: 0m→10m→20m→30m→40m→30m→20m→10m→0m
    updateRealisticDiveProfile: (elapsedTime) => {
      const state = get();

      // Diving physics constants
      const RMV = SIMULATION_CONSTANTS.RMV; // 15 L/min
      const CYLINDER_VOLUME = SIMULATION_CONSTANTS.CYLINDER_VOLUME_LITERS; // 25 L
      const START_PRESSURE = SIMULATION_CONSTANTS.START_PRESSURE_BAR; // 200 bar

      // Calculate elapsed time in seconds
      const elapsedSeconds = Math.floor(elapsedTime / 1000);

      // Determine depth based on 10-second intervals
      // Every 10 seconds: increase depth by 10m until 40m, then decrease by 10m until 0m
      const interval = Math.floor(elapsedSeconds / 10); // Which 10-second interval are we in?

      let diver1Depth, diver2Depth;

      // Calculate depth progression
      // Intervals 0-3: 0→10→20→30→40 (ascending every 10 seconds)
      // Intervals 4+: 40→30→20→10→0 (descending every 10 seconds)
      if (interval <= 4) {
        // Ascending phase: 0m → 40m
        diver1Depth = interval * 10;
        diver2Depth = interval * 10;
      } else {
        // Descending phase: 40m → 0m
        const descentInterval = interval - 4;
        diver1Depth = Math.max(0, 40 - (descentInterval * 10));
        diver2Depth = Math.max(0, 40 - (descentInterval * 10));
      }

      // Get current pressures (or start pressure if first iteration)
      const currentCyl1Pressure = state.cylinder1Pressure || START_PRESSURE;
      const currentCyl2Pressure = state.cylinder2Pressure || START_PRESSURE;

      // Calculate new pressures based on depth and consumption
      // Each update is 1 second = 1 minute of diving
      const newCyl1Pressure = calculateNewCylinderPressure(
        currentCyl1Pressure,
        diver1Depth,
        1, // 1 second elapsed
        RMV,
        CYLINDER_VOLUME
      );

      const newCyl2Pressure = calculateNewCylinderPressure(
        currentCyl2Pressure,
        diver2Depth,
        1, // 1 second elapsed
        RMV,
        CYLINDER_VOLUME
      );

      // Convert pressures to volume percentages
      const cylinder1Volume = pressureToVolumePercentage(newCyl1Pressure, START_PRESSURE);
      const cylinder2Volume = pressureToVolumePercentage(newCyl2Pressure, START_PRESSURE);

      // Calculate ambient pressure (average of both divers)
      const avgDepth = (diver1Depth + diver2Depth) / 2;
      const ambientPressure = calculateATA(avgDepth);

      // Umbilical pressure: varies with depth (5 bars + 1 bar per 10m)
      const umbilicalPressure = calculateUmbilicalPressure(avgDepth);

      // Diver pressures: based on umbilical pressure and depth
      const diver1Pressure = calculateDiverPressure(umbilicalPressure, diver1Depth);
      const diver2Pressure = calculateDiverPressure(umbilicalPressure, diver2Depth);

      // Calculate consumption rate at current depth
      const ata1 = calculateATA(diver1Depth);
      const ata2 = calculateATA(diver2Depth);
      const totalAirUsed = (ata1 * RMV + ata2 * RMV) / 2; // Average consumption

      // Calculate remaining dive time based on remaining air and CURRENT DEPTH
      // This tells us how many more minutes we can dive at the current depth
      const avgPressure = (newCyl1Pressure + newCyl2Pressure) / 2;
      const remainingDiveTime = calculateRemainingDiveTimeRealistic(
        avgPressure,
        avgDepth,
        RMV,
        CYLINDER_VOLUME
      );

      // Update all values
      set({
        diver1Depth: Math.round(diver1Depth * 10) / 10,
        diver2Depth: Math.round(diver2Depth * 10) / 10,
        depth: Math.round(avgDepth * 10) / 10,
        ambientPressure: Math.round(ambientPressure * 100) / 100,
        umbilicalPressure: Math.round(umbilicalPressure * 100) / 100,
        diver1Pressure: Math.round(diver1Pressure * 100) / 100,
        diver2Pressure: Math.round(diver2Pressure * 100) / 100,
        cylinder1Pressure: Math.round(newCyl1Pressure * 10) / 10,
        cylinder2Pressure: Math.round(newCyl2Pressure * 10) / 10,
        cylinder1Volume: Math.round(cylinder1Volume * 10) / 10,
        cylinder2Volume: Math.round(cylinder2Volume * 10) / 10,
        totalAirUsed: Math.round(totalAirUsed * 100) / 100,
        remainingDiveTime: Math.round(remainingDiveTime * 10) / 10
      });
    },

    // Alert checking based on thresholds
    checkAndGenerateAlerts: () => {
      const state = get();

      // Check for low cylinder volume
      const hasLowCylinder = isLowCylinderVolume(state.cylinder1Volume) || isLowCylinderVolume(state.cylinder2Volume);
      const existingCylinderAlert = state.alerts.find(alert => alert.message === ALERT_MESSAGES.LOW_CYLINDER);

      if (hasLowCylinder && !existingCylinderAlert) {
        get().addAlert(ALERT_TYPES.WARNING, ALERT_MESSAGES.LOW_CYLINDER);
      } else if (!hasLowCylinder && existingCylinderAlert) {
        // Remove alert if condition is resolved
        get().removeAlert(existingCylinderAlert.id);
      }

      // Check for low umbilical pressure
      const hasLowPressure = isLowUmbilicalPressure(state.umbilicalPressure);
      const existingPressureAlert = state.alerts.find(alert => alert.message === ALERT_MESSAGES.LOW_PRESSURE);

      if (hasLowPressure && !existingPressureAlert) {
        get().addAlert(ALERT_TYPES.WARNING, ALERT_MESSAGES.LOW_PRESSURE);
      } else if (!hasLowPressure && existingPressureAlert) {
        // Remove alert if condition is resolved
        get().removeAlert(existingPressureAlert.id);
      }
    },

    // Historical data management
    updateHistoricalData: () => {
      const state = get();
      const now = Date.now();

      set({
        depthHistory: [
          ...state.depthHistory.slice(-(SIMULATION_CONSTANTS.HISTORY_LENGTH - 1)),
          { time: now, value: state.depth }
        ],
        pressureHistory: [
          ...state.pressureHistory.slice(-(SIMULATION_CONSTANTS.HISTORY_LENGTH - 1)),
          { time: now, value: state.umbilicalPressure }
        ],
        timeHistory: [
          ...state.timeHistory.slice(-(SIMULATION_CONSTANTS.HISTORY_LENGTH - 1)),
          now
        ]
      });
    },

    // Alert management
    addAlert: (type, message) => {
      const state = get();

      // Check if alert with same message already exists
      const existingAlert = state.alerts.find(alert => alert.message === message);
      if (existingAlert) {
        return; // Don't add duplicate alerts
      }

      const newAlert = {
        id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        type,
        message,
        timestamp: Date.now(),
        timeoutId: null
      };

      // Set auto-dismiss timeout for warning alerts
      if (type === ALERT_TYPES.WARNING) {
        const timeoutId = setTimeout(() => {
          get().removeAlert(newAlert.id);
        }, UI_CONSTANTS.ALERT_TIMEOUT);

        newAlert.timeoutId = timeoutId;
      }

      set({
        alerts: [...state.alerts, newAlert]
      });
    },

    removeAlert: (alertId) => {
      const state = get();
      const alertToRemove = state.alerts.find(alert => alert.id === alertId);

      // Clear timeout if it exists
      if (alertToRemove && alertToRemove.timeoutId) {
        clearTimeout(alertToRemove.timeoutId);
      }

      set({
        alerts: state.alerts.filter(alert => alert.id !== alertId)
      });
    },

    clearAllAlerts: () => {
      const state = get();

      // Clear all timeouts
      state.alerts.forEach(alert => {
        if (alert.timeoutId) {
          clearTimeout(alert.timeoutId);
        }
      });

      set({ alerts: [] });
    },

    // Simulation control actions
    setMode: (mode) => {
      set((state) => ({
        ...state,
        mode: mode,
        // If switching to auto mode, ensure simulation is not running initially
        isRunning: mode === 'auto' ? false : state.isRunning
      }));
    },

    startSimulation: () => {
      set((state) => ({
        ...state,
        isRunning: true,
        sessionStartTime: state.sessionStartTime || Date.now()
      }));
    },

    pauseSimulation: () => {
      set((state) => ({
        ...state,
        isRunning: false
      }));
    },

    resetSimulation: () => {
      set({
        ...INITIAL_STATE,
        // Preserve mode setting when resetting
        mode: get().mode
      });
    },

    resetAllGauges: () => {
      set((state) => ({
        ...state,
        // Reset gauge values to initial state
        umbilicalPressure: INITIAL_STATE.umbilicalPressure,
        diver1Pressure: INITIAL_STATE.diver1Pressure,
        diver2Pressure: INITIAL_STATE.diver2Pressure,
        cylinder1Volume: INITIAL_STATE.cylinder1Volume,
        cylinder2Volume: INITIAL_STATE.cylinder2Volume,
        cylinder1Pressure: INITIAL_STATE.cylinder1Pressure,
        cylinder2Pressure: INITIAL_STATE.cylinder2Pressure,

        // Reset computed values
        ambientPressure: INITIAL_STATE.ambientPressure,
        totalAirUsed: INITIAL_STATE.totalAirUsed,
        remainingDiveTime: INITIAL_STATE.remainingDiveTime,

        // Reset session timer
        sessionStartTime: null,
        isRunning: false,

        // Clear historical data
        depthHistory: [],
        pressureHistory: [],
        timeHistory: [],

        // Clear alerts
        alerts: []
      }));
    },

    triggerLeak: () => {
      const state = get();

      // Apply leak effects
      const newUmbilicalPressure = Math.max(
        0,
        state.umbilicalPressure - SIMULATION_CONSTANTS.LEAK_UMBILICAL_DROP
      );
      const newDiver1Pressure = Math.max(
        0,
        state.diver1Pressure - SIMULATION_CONSTANTS.LEAK_DIVER1_DROP
      );

      set({
        umbilicalPressure: newUmbilicalPressure,
        diver1Pressure: newDiver1Pressure
      });

      // Add emergency alert
      get().addAlert(ALERT_TYPES.CRITICAL, ALERT_MESSAGES.EMERGENCY_LEAK);
    }
  };

  return store;
});

// Initialize computed values after store creation
useDivingStore.getState().updateComputedValues();

export default useDivingStore;