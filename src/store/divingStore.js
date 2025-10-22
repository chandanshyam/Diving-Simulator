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
  isLowUmbilicalPressure
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
    setCylinder1Volume: (volume) => set(state => ({ ...state, cylinder1Volume: store.clampValue(volume, SIMULATION_CONSTANTS.CYLINDER_VOLUME_RANGE) })),
    setCylinder2Volume: (volume) => set(state => ({ ...state, cylinder2Volume: store.clampValue(volume, SIMULATION_CONSTANTS.CYLINDER_VOLUME_RANGE) })),



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
        // Original simple physics simulation
        const totalAirUsed = calculateTotalAirConsumption(state.diver1Rate, state.diver2Rate, state.depth);

        const newCylinder1Volume = calculateCylinderDepletion(
          state.cylinder1Volume,
          totalAirUsed,
          SIMULATION_CONSTANTS.CYLINDER_1_RATIO
        );

        const newCylinder2Volume = calculateCylinderDepletion(
          state.cylinder2Volume,
          totalAirUsed,
          SIMULATION_CONSTANTS.CYLINDER_2_RATIO
        );

        const newUmbilicalPressure = calculateUmbilicalPressure(state.depth);
        const newDiver1Pressure = calculateDiverPressure(newUmbilicalPressure, state.depth);
        const newDiver2Pressure = calculateDiverPressure(newUmbilicalPressure, state.depth);

        const ambientPressure = calculateAmbientPressure(state.depth);
        const remainingDiveTime = calculateRemainingDiveTime(newCylinder1Volume, newCylinder2Volume, totalAirUsed);

        set({
          umbilicalPressure: newUmbilicalPressure,
          diver1Pressure: newDiver1Pressure,
          diver2Pressure: newDiver2Pressure,
          cylinder1Volume: newCylinder1Volume,
          cylinder2Volume: newCylinder2Volume,
          ambientPressure,
          totalAirUsed,
          remainingDiveTime
        });
      }
      get().checkAndGenerateAlerts();
    },

    // Realistic 60-minute dive profile compressed into 60000ms
    updateRealisticDiveProfile: (elapsedTime) => {
      // Total simulation time: 60000ms represents 60 minutes
      const SIMULATION_DURATION = 60000; // 60 seconds
      const DIVE_DURATION = 60; // 60 minutes

      // Calculate current dive time in minutes (0-60)
      const diveTimeMinutes = (elapsedTime / SIMULATION_DURATION) * DIVE_DURATION;

      // Clamp to 60 minutes max
      const clampedDiveTime = Math.min(diveTimeMinutes, DIVE_DURATION);

      // Calculate depth based on dive profile
      let currentDepth;
      if (clampedDiveTime <= 10) {
        // Descent phase: 0 → 30m over 10 minutes
        currentDepth = (clampedDiveTime / 10) * 30;
      } else if (clampedDiveTime <= 50) {
        // Bottom phase: 30m for 40 minutes (10-50 min)
        currentDepth = 30;
      } else {
        // Ascent phase: 30 → 0m over 10 minutes (50-60 min)
        const ascentProgress = (clampedDiveTime - 50) / 10;
        currentDepth = 30 * (1 - ascentProgress);
      }

      // Calculate ambient pressure: 1 bar + 1 bar per 10m
      const ambientPressure = 1 + (currentDepth / 10);

      // Umbilical pressure: constant 15 bar above ambient
      const umbilicalPressure = ambientPressure + 15;

      // Calculate cylinder pressures based on air consumption
      // SAC rate: 15 L/min at surface, scales with ambient pressure
      const sacRate = 15; // L/min at surface
      const actualConsumption = sacRate * ambientPressure; // L/min at depth

      // Total air consumed so far (in liters)
      const totalAirConsumed = actualConsumption * clampedDiveTime;

      // Initial cylinder capacity: 12L × 2 × 200 bar = 4800L per diver
      const initialCapacity = 4800; // Liters at 1 bar

      // Remaining air in liters
      const remainingAir1 = Math.max(0, initialCapacity - totalAirConsumed);
      const remainingAir2 = Math.max(0, initialCapacity - totalAirConsumed);

      // Convert to percentage (0-100%)
      const cylinder1Volume = (remainingAir1 / initialCapacity) * 100;
      const cylinder2Volume = (remainingAir2 / initialCapacity) * 100;

      // Diver pressures: umbilical pressure minus line loss (minimal for surface supply)
      const lineLoss = 0.5; // 0.5 bar line loss
      const diver1Pressure = Math.max(0, umbilicalPressure - lineLoss);
      const diver2Pressure = Math.max(0, umbilicalPressure - lineLoss);

      // Calculate remaining dive time
      const remainingAirAvg = (remainingAir1 + remainingAir2) / 2;
      const remainingDiveTime = remainingAirAvg > 0 ? (remainingAirAvg / actualConsumption) : 0;

      // Update all values
      set({
        depth: Math.round(currentDepth * 10) / 10,
        ambientPressure: Math.round(ambientPressure * 100) / 100,
        umbilicalPressure: Math.round(umbilicalPressure * 100) / 100,
        diver1Pressure: Math.round(diver1Pressure * 100) / 100,
        diver2Pressure: Math.round(diver2Pressure * 100) / 100,
        cylinder1Volume: Math.round(cylinder1Volume * 10) / 10,
        cylinder2Volume: Math.round(cylinder2Volume * 10) / 10,
        totalAirUsed: Math.round(actualConsumption * 100) / 100,
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