import React, { useState, useEffect } from "react";
import UmbilicalPressure from "./UmbilicalPressure.js";
import CylinderPressure from "./CylinderVolume.js";
import DiverDepth from "./DiverPressure.js";
import DiveTimeRemaining from "./DiveTimeRemaining.js";

/**
 * Responsive gauge grid component that adapts to different screen sizes
 * Uses CSS Grid with mobile-first responsive design
 */
const GaugeGrid = () => {
  const [screenSize, setScreenSize] = useState('desktop');

  // Track screen size for responsive behavior
  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width <= 480) {
        setScreenSize('mobile');
      } else if (width <= 768) {
        setScreenSize('tablet');
      } else if (width <= 1024) {
        setScreenSize('laptop');
      } else {
        setScreenSize('desktop');
      }
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  return (
    <div className={`gauge-grid ${screenSize}`} role="region" aria-label="Live Diving Gauges">
      <div className="gauge-container" data-gauge="umbilical-pressure">
        <UmbilicalPressure />
      </div>
      
      <div className="gauge-container" data-gauge="cylinder-1">
        <CylinderPressure cylinderNumber={1} />
      </div>
      
      <div className="gauge-container" data-gauge="cylinder-2">
        <CylinderPressure cylinderNumber={2} />
      </div>
      
      <div className="gauge-container" data-gauge="diver-1">
        <DiverDepth diverNumber={1} />
      </div>
      
      <div className="gauge-container" data-gauge="diver-2">
        <DiverDepth diverNumber={2} />
      </div>
      
      <div className="gauge-container" data-gauge="dive-time">
        <DiveTimeRemaining />
      </div>
    </div>
  );
};

export default GaugeGrid;