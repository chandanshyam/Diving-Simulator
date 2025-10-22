import React, { useState, useEffect } from 'react';
import useDivingStore from '../../store/divingStore.js';

/**
 * SessionTimer component displays the elapsed time since simulation started
 * Positioned in the top-right corner of the dashboard
 */
const SessionTimer = () => {
  const { sessionStartTime, isRunning } = useDivingStore();
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval;
    
    if (isRunning && sessionStartTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - sessionStartTime) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    } else if (!isRunning) {
      // Keep the timer frozen when paused
      if (sessionStartTime) {
        const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
        setElapsedTime(elapsed);
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, sessionStartTime]);

  // Reset timer when session is reset
  useEffect(() => {
    if (!sessionStartTime) {
      setElapsedTime(0);
    }
  }, [sessionStartTime]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = () => {
    if (!sessionStartTime) return '⏱️';
    if (isRunning) return '▶️';
    return '⏸️';
  };

  const getStatusText = () => {
    if (!sessionStartTime) return 'Ready';
    if (isRunning) return 'Running';
    return 'Paused';
  };

  return (
    <div className="session-timer" title={`Session ${getStatusText()}`}>
      <div className="timer-content">
        <div className="timer-icon">
          {getStatusIcon()}
        </div>
        <div className="timer-info">
          <div className="timer-label">Session Time</div>
          <div className="timer-value">
            {formatTime(elapsedTime)}
          </div>
        </div>
        <div className={`timer-status ${isRunning ? 'running' : sessionStartTime ? 'paused' : 'ready'}`}>
          {getStatusText()}
        </div>
      </div>
    </div>
  );
};

export default SessionTimer;