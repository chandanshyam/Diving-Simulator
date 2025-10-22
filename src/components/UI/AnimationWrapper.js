import React, { useEffect, useState } from 'react';

/**
 * AnimationWrapper component for managing smooth transitions and animations
 * Provides utilities for common animation patterns in the dashboard
 */
const AnimationWrapper = ({ 
  children, 
  animation = 'fade-in', 
  delay = 0, 
  duration = 300,
  trigger = true,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(trigger);

  useEffect(() => {
    if (trigger) {
      setShouldRender(true);
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [trigger, delay, duration]);

  if (!shouldRender) return null;

  const animationClass = isVisible ? animation : `${animation}-exit`;

  return (
    <div 
      className={`${animationClass} ${className}`}
      style={{
        '--animation-duration': `${duration}ms`,
        '--animation-delay': `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};



export default AnimationWrapper;