import { useEffect } from 'react';
import { initializeSimulationEngine } from '../utils/simulationEngine.js';
import useDivingStore from '../store/divingStore.js';

/**
 * Hook to initialize and manage the simulation engine
 * Should be used once at the app level
 */
export const useSimulationEngine = () => {
  const store = useDivingStore;
  
  useEffect(() => {
    // Initialize the simulation engine with the store
    const { engine, unsubscribe } = initializeSimulationEngine(store);
    
    // Cleanup function to stop the engine and unsubscribe when component unmounts
    return () => {
      engine.reset();
      unsubscribe();
    };
  }, [store]);
};

export default useSimulationEngine;