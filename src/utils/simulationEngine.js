import { SIMULATION_CONSTANTS } from './constants.js';

/**
 * Simulation Engine for the Scuba Diving Dashboard
 * Manages the auto simulation loop with 1-second interval updates
 */
class SimulationEngine {
  constructor(store) {
    this.store = store;
    this.intervalId = null;
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.intervalId = setInterval(() => {
      this.updateSimulation();
    }, SIMULATION_CONSTANTS.UPDATE_INTERVAL);
  }

  stop() {
    if (!this.isRunning) return;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  getIsRunning() {
    return this.isRunning;
  }

  /**
   * Update simulation state - called every second during auto mode
   */
  updateSimulation() {
    const state = this.store.getState();
    
    // Only update if in auto mode and simulation is running
    if (state.mode !== 'auto' || !state.isRunning) {
      return;
    }

    try {
      // Update physics calculations
      state.updateSimulationPhysics();
      state.updateComputedValues();
      state.updateHistoricalData();
      state.checkAndGenerateAlerts();
    } catch (error) {
      console.error('Error during simulation update:', error);
    }
  }

  reset() {
    this.stop();
  }
}

// Create a singleton instance
let simulationEngineInstance = null;

/**
 * Get the singleton simulation engine instance
 * @param {Object} store - Zustand store instance
 * @returns {SimulationEngine} Simulation engine instance
 */
export const getSimulationEngine = (store) => {
  if (!simulationEngineInstance) {
    simulationEngineInstance = new SimulationEngine(store);
  }
  return simulationEngineInstance;
};

/**
 * Initialize the simulation engine with the store
 * This should be called once when the app starts
 * @param {Object} store - Zustand store instance
 */
export const initializeSimulationEngine = (store) => {
  const engine = getSimulationEngine(store);
  
  // Subscribe to store changes to start/stop simulation based on state
  const unsubscribe = store.subscribe((state) => {
    // Start simulation when switching to auto mode and isRunning is true
    if (state.mode === 'auto' && state.isRunning && !engine.getIsRunning()) {
      engine.start();
    }
    
    // Stop simulation when switching to manual mode or when paused
    if ((state.mode === 'manual' || !state.isRunning) && engine.getIsRunning()) {
      engine.stop();
    }
  });
  
  // Return both engine and unsubscribe function for cleanup
  return { engine, unsubscribe };
};

export default SimulationEngine;