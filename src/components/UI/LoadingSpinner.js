import React from 'react';

/**
 * Loading spinner component with different sizes and styles
 * Used throughout the application for loading states
 */
const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary', 
  text = null,
  className = '',
  inline = false 
}) => {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium', 
    large: 'spinner-large'
  };
  
  const colorClasses = {
    primary: 'spinner-primary',
    secondary: 'spinner-secondary',
    white: 'spinner-white'
  };
  
  const containerClass = inline ? 'spinner-container-inline' : 'spinner-container';
  
  return (
    <div className={`${containerClass} ${className}`}>
      <div 
        className={`spinner ${sizeClasses[size]} ${colorClasses[color]}`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
      {text && (
        <div className="spinner-text">
          {text}
        </div>
      )}
    </div>
  );
};

/**
 * Skeleton loader for gauge components
 * Shows placeholder content while gauges are loading
 */
export const GaugeSkeleton = () => {
  return (
    <div className="gauge-skeleton">
      <div className="skeleton-circle"></div>
      <div className="skeleton-text skeleton-title"></div>
      <div className="skeleton-text skeleton-value"></div>
    </div>
  );
};

/**
 * Chart skeleton loader
 * Shows placeholder for chart components
 */
export const ChartSkeleton = () => {
  return (
    <div className="chart-skeleton">
      <div className="skeleton-text skeleton-chart-title"></div>
      <div className="skeleton-chart-area">
        <div className="skeleton-chart-line"></div>
        <div className="skeleton-chart-line"></div>
        <div className="skeleton-chart-line"></div>
      </div>
    </div>
  );
};

/**
 * Full page loading overlay
 * Used for initial app loading
 */
export const LoadingOverlay = ({ message = "Loading..." }) => {
  return (
    <div className="loading-overlay">
      <div className="loading-overlay-content">
        <LoadingSpinner size="large" color="primary" />
        <h2 className="loading-overlay-title">
          🌊 Initializing Dashboard
        </h2>
        <p className="loading-overlay-message">
          {message}
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;