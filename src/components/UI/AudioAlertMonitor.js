import React, { useEffect, useState } from 'react';
import useDivingStore from '../../store/divingStore.js';
import audioManager from '../../utils/audioManager.js';

/**
 * AudioAlertMonitor - Monitors simulation state and triggers audio alerts
 *
 * Features:
 * - Monitors cylinder pressure and triggers alerts when < 20 bars
 * - Monitors dive time and triggers alerts when < 5 minutes
 * - Triggers critical alerts for pressure < 10 bars or time < 2 minutes
 * - Provides mute/unmute toggle button
 * - Automatically initializes audio context on first user interaction
 */
const AudioAlertMonitor = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);

  // Subscribe to relevant state values
  const cylinder1Pressure = useDivingStore((state) => state.cylinder1Pressure);
  const cylinder2Pressure = useDivingStore((state) => state.cylinder2Pressure);
  const umbilicalPressure = useDivingStore((state) => state.umbilicalPressure);
  const remainingDiveTime = useDivingStore((state) => state.remainingDiveTime);
  const isRunning = useDivingStore((state) => state.isRunning);

  // Initialize audio context on mount (requires user interaction)
  useEffect(() => {
    if (!isAudioInitialized) {
      // Initialize audio context when component mounts
      // This will be fully activated on first user interaction
      const initAudio = () => {
        audioManager.initAudioContext();
        setIsAudioInitialized(true);
        // Remove listeners after initialization
        document.removeEventListener('click', initAudio);
        document.removeEventListener('keydown', initAudio);
      };

      // Wait for user interaction to initialize audio
      document.addEventListener('click', initAudio);
      document.addEventListener('keydown', initAudio);

      return () => {
        document.removeEventListener('click', initAudio);
        document.removeEventListener('keydown', initAudio);
      };
    }
  }, [isAudioInitialized]);

  // Monitor cylinder pressure and trigger alerts
  useEffect(() => {
    if (isRunning && isAudioInitialized) {
      audioManager.handleCylinderPressureAlert(cylinder1Pressure, cylinder2Pressure);
    }
  }, [cylinder1Pressure, cylinder2Pressure, isRunning, isAudioInitialized]);

  // Monitor umbilical pressure and trigger alerts (safe range: 7-20 bars)
  useEffect(() => {
    if (isRunning && isAudioInitialized) {
      audioManager.handleUmbilicalPressureAlert(umbilicalPressure);
    }
  }, [umbilicalPressure, isRunning, isAudioInitialized]);

  // Monitor dive time and trigger alerts
  useEffect(() => {
    if (isRunning && isAudioInitialized) {
      audioManager.handleDiveTimeAlert(remainingDiveTime);
    }
  }, [remainingDiveTime, isRunning, isAudioInitialized]);

  // Stop all alerts when simulation is paused or stopped
  useEffect(() => {
    if (!isRunning) {
      audioManager.stopAllAlerts();
    }
  }, [isRunning]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioManager.cleanup();
    };
  }, []);

  // Handle mute/unmute toggle
  const handleToggleMute = () => {
    const newMutedState = audioManager.toggleMute();
    setIsMuted(newMutedState);
  };

  return (
    <div className="audio-alert-monitor">
      <button
        className={`audio-toggle-button ${isMuted ? 'muted' : 'unmuted'}`}
        onClick={handleToggleMute}
        title={isMuted ? 'Unmute audio alerts' : 'Mute audio alerts'}
        aria-label={isMuted ? 'Unmute audio alerts' : 'Mute audio alerts'}
      >
        {isMuted ? (
          <>
            <span className="audio-icon">🔇</span>
            <span className="audio-text">Muted</span>
          </>
        ) : (
          <>
            <span className="audio-icon">🔊</span>
            <span className="audio-text">Audio On</span>
          </>
        )}
      </button>
    </div>
  );
};

export default AudioAlertMonitor;
