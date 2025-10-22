import React from 'react';
import useDivingStore from '../../store/divingStore.js';

const CylinderSelector = () => {
  const { selectedCylinder, setSelectedCylinder } = useDivingStore();
  
  const cylinderOptions = ['Cylinder 1', 'Cylinder 2', 'Both'];
  
  const handleCylinderChange = (event) => {
    setSelectedCylinder(event.target.value);
  };

  return (
    <div className="cylinder-selector-container">
      <label className="control-label">Active Cylinder:</label>
      <div className="radio-group">
        {cylinderOptions.map((option) => (
          <div key={option} className="radio-option">
            <input
              type="radio"
              id={`cylinder-${option.toLowerCase().replace(' ', '-')}`}
              name="cylinder-selector"
              value={option}
              checked={selectedCylinder === option}
              onChange={handleCylinderChange}
              className="radio-input"
            />
            <label 
              htmlFor={`cylinder-${option.toLowerCase().replace(' ', '-')}`}
              className="radio-label"
            >
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CylinderSelector;