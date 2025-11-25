import { SIMULATION_CONSTANTS } from './constants.js';

/**
 * Physics calculation functions for the diving simulation
 */

/**
 * Calculate ambient pressure based on depth
 * Formula: 1 + Depth / 10
 * @param {number} depth - Depth in meters
 * @returns {number} Ambient pressure in bar
 */
export const calculateAmbientPressure = (depth) => {
  return 1 + depth / 10;
};

/**
 * Calculate total air consumption rate with depth factors
 * Formula: (Diver1Rate + Diver2Rate) × (1 + Depth / 10)
 * @param {number} diver1Rate - Diver 1 consumption rate in L/min
 * @param {number} diver2Rate - Diver 2 consumption rate in L/min
 * @param {number} depth - Current depth in meters
 * @returns {number} Total air consumption in L/min
 */
export const calculateTotalAirConsumption = (diver1Rate, diver2Rate, depth) => {
  const ambientPressure = calculateAmbientPressure(depth);
  return (diver1Rate + diver2Rate) * ambientPressure;
};

/**
 * Calculate diver pressure with line loss factors
 * Formula: Umbilical Pressure - (lineLossFactor × depth)
 * @param {number} umbilicalPressure - Umbilical pressure in bar
 * @param {number} depth - Current depth in meters
 * @returns {number} Diver pressure in bar
 */
export const calculateDiverPressure = (umbilicalPressure, depth) => {
  const lineLoss = SIMULATION_CONSTANTS.LINE_LOSS_FACTOR * depth;
  return Math.max(0, umbilicalPressure - lineLoss);
};

/**
 * Calculate remaining dive time based on current consumption and cylinder volumes
 * Formula: (Average Cylinder Volume / Total Air Used) × 10
 * @param {number} cylinder1Volume - Cylinder 1 volume percentage
 * @param {number} cylinder2Volume - Cylinder 2 volume percentage
 * @param {number} totalAirUsed - Total air consumption rate in L/min
 * @returns {number} Remaining dive time in minutes
 */
export const calculateRemainingDiveTime = (cylinder1Volume, cylinder2Volume, totalAirUsed) => {
  if (totalAirUsed === 0) return 0;
  
  const averageCylinderVolume = (cylinder1Volume + cylinder2Volume) / 2;
  return (averageCylinderVolume / totalAirUsed) * 10;
};

/**
 * Calculate cylinder volume depletion for a single update cycle
 * @param {number} currentVolume - Current cylinder volume percentage
 * @param {number} airUsed - Air consumption rate in L/min
 * @param {number} cylinderRatio - Ratio of air consumption from this cylinder (0.6 for cylinder 1, 0.4 for cylinder 2)
 * @param {number} updateIntervalSeconds - Update interval in seconds (default 1)
 * @returns {number} New cylinder volume percentage
 */
export const calculateCylinderDepletion = (currentVolume, airUsed, cylinderRatio, updateIntervalSeconds = 1) => {
  // Convert air used from L/min to percentage per update interval
  const depletionPerUpdate = (airUsed * cylinderRatio * updateIntervalSeconds) / 60 / 100;
  return Math.max(0, currentVolume - depletionPerUpdate);
};

/**
 * Calculate umbilical pressure based on depth
 * Formula: Umbilical Pressure = 10 + (Depth / 10)
 * - Starts at 10 bars at surface (0m)
 * - Increases by 1 bar for every 10m of depth
 * - Decreases by 1 bar for every 10m when ascending
 * @param {number} depth - Current depth in meters
 * @returns {number} Umbilical pressure in bar
 */
export const calculateUmbilicalPressure = (depth) => {
  // Base pressure at surface is 10 bars
  // Add 1 bar for every 10 meters of depth
  return 10 + (depth / 10);
};

/**
 * Check if cylinder volume is below low threshold
 * @param {number} volume - Cylinder volume percentage
 * @returns {boolean} True if below threshold
 */
export const isLowCylinderVolume = (volume) => {
  return volume <= SIMULATION_CONSTANTS.LOW_CYLINDER_THRESHOLD;
};

/**
 * Check if umbilical pressure is below low threshold
 * @param {number} pressure - Umbilical pressure in bar
 * @returns {boolean} True if below threshold
 */
export const isLowUmbilicalPressure = (pressure) => {
  return pressure <= SIMULATION_CONSTANTS.LOW_PRESSURE_THRESHOLD;
};

/**
 * Get color zone for umbilical pressure gauge
 * @param {number} pressure - Umbilical pressure in bar
 * @returns {string} Color zone: 'green', 'orange', or 'red'
 */
export const getUmbilicalPressureZone = (pressure) => {
  const zones = SIMULATION_CONSTANTS.UMBILICAL_PRESSURE_ZONES;
  if (pressure >= zones.green.min && pressure <= zones.green.max) return 'green';
  if (pressure >= zones.orange.min && pressure <= zones.orange.max) return 'orange';
  return 'red';
};

/**
 * Get color zone for cylinder volume gauge
 * @param {number} volume - Cylinder volume percentage
 * @returns {string} Color zone: 'green', 'orange', or 'red'
 */
export const getCylinderVolumeZone = (volume) => {
  const zones = SIMULATION_CONSTANTS.CYLINDER_VOLUME_ZONES;
  if (volume >= zones.green.min && volume <= zones.green.max) return 'green';
  if (volume >= zones.orange.min && volume <= zones.orange.max) return 'orange';
  return 'red';
};

/**
 * Get color zone for diver pressure gauge
 * @param {number} pressure - Diver pressure in bar
 * @returns {string} Color zone: 'green', 'orange', or 'red'
 */
export const getDiverPressureZone = (pressure) => {
  const zones = SIMULATION_CONSTANTS.DIVER_PRESSURE_ZONES;
  if (pressure >= zones.green.min && pressure <= zones.green.max) return 'green';
  if (pressure >= zones.orange.min && pressure <= zones.orange.max) return 'orange';
  return 'red';
};

/**
 * REALISTIC DIVING PHYSICS CALCULATIONS
 */

/**
 * Calculate Absolute Pressure (ATA) based on depth
 * Formula: ATA = (Depth / 10) + 1
 * @param {number} depth - Depth in meters
 * @returns {number} Absolute pressure in ATA
 */
export const calculateATA = (depth) => {
  return (depth / 10) + 1;
};

/**
 * Calculate instantaneous pressure drop per simulation second
 * Each simulation second = 1 minute of real diving time
 * Formula: pressure drop (bar/second) = (ATA * RMV) / Cylinder Volume
 * @param {number} depth - Current depth in meters
 * @param {number} rmv - Respiratory Minute Volume (L/min), default 15
 * @param {number} cylinderVolume - Cylinder volume in liters, default 25
 * @returns {number} Pressure drop in bars per simulation second
 */
export const calculatePressureDropPerSecond = (depth, rmv = 15, cylinderVolume = 25) => {
  const ata = calculateATA(depth);
  return (ata * rmv) / cylinderVolume;
};

/**
 * Calculate new cylinder pressure after consumption
 * @param {number} currentPressure - Current pressure in bars
 * @param {number} depth - Current depth in meters
 * @param {number} timeElapsed - Time elapsed in seconds (simulation seconds)
 * @param {number} rmv - Respiratory Minute Volume (L/min), default 15
 * @param {number} cylinderVolume - Cylinder volume in liters, default 25
 * @returns {number} New pressure in bars
 */
export const calculateNewCylinderPressure = (currentPressure, depth, timeElapsed = 1, rmv = 15, cylinderVolume = 25) => {
  const pressureDropPerSecond = calculatePressureDropPerSecond(depth, rmv, cylinderVolume);
  const newPressure = currentPressure - (pressureDropPerSecond * timeElapsed);
  return Math.max(0, newPressure); // Never go below 0
};

/**
 * Convert cylinder pressure to volume percentage
 * @param {number} pressure - Current pressure in bars
 * @param {number} maxPressure - Maximum pressure in bars, default 200
 * @returns {number} Volume percentage (0-100)
 */
export const pressureToVolumePercentage = (pressure, maxPressure = 200) => {
  return (pressure / maxPressure) * 100;
};

/**
 * Calculate remaining dive time based on current pressure and depth
 * Formula: Remaining Time (min) = (Remaining Pressure × Cylinder Volume) / (ATA × RMV)
 * @param {number} remainingPressure - Current cylinder pressure in bars
 * @param {number} depth - Current depth in meters
 * @param {number} rmv - Respiratory Minute Volume (L/min), default 15
 * @param {number} cylinderVolume - Cylinder volume in liters, default 25
 * @returns {number} Remaining dive time in minutes
 */
export const calculateRemainingDiveTimeRealistic = (remainingPressure, depth, rmv = 15, cylinderVolume = 25) => {
  if (remainingPressure <= 0) return 0;

  const ata = calculateATA(depth);
  const consumptionRateAtDepth = ata * rmv; // L/min at current depth

  // Total air available in liters at 1 bar
  const totalAirAvailable = remainingPressure * cylinderVolume;

  // Remaining time = Total air available / consumption rate at depth
  const remainingTime = totalAirAvailable / consumptionRateAtDepth;

  return Math.max(0, remainingTime);
};