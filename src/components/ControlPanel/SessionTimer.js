import React, { useState, useEffect } from 'react';
import useDivingStore from '../../store/divingStore.js';

/**
 * Compact SessionTimer component for the control panel
 * Shows elapsed time since simulation started
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
        <div className="session-timer-compact">
            <label className="control-label">Session Time:</label>
            <div className="timer-display">
                <div className="timer-icon">
                    {getStatusIcon()}
                </div>
                <div className="timer-info">
                    <div className="timer-value">
                        {formatTime(elapsedTime)}
                    </div>
                    <div className="timer-status">
                        {getStatusText()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SessionTimer;