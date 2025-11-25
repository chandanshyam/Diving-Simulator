/**
 * AudioManager - Handles all audio alerts for the diving simulation
 * Uses Web Audio API to generate programmatic beep sounds
 */

class AudioManager {
  constructor() {
    // Initialize audio context
    this.audioContext = null;
    this.isMuted = false;

    // Track active timeouts for repeating alerts
    this.activeAlerts = {
      cylinderPressure: null,
      umbilicalPressure: null,
      diveTime: null,
      critical: null
    };

    // Track last alert states to prevent duplicate sounds
    this.lastAlertStates = {
      cylinderPressure: false,
      umbilicalPressure: false,
      diveTime: false,
      critical: false
    };

    // Sound queue to prevent overlap
    this.soundQueue = [];
    this.isPlaying = false;
  }

  /**
   * Initialize audio context (must be called after user interaction)
   */
  initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return this.audioContext;
  }

  /**
   * Play a beep sound with specified parameters
   * @param {number} frequency - Frequency in Hz
   * @param {number} duration - Duration in milliseconds
   * @param {number} volume - Volume (0-1)
   * @param {string} type - Oscillator type ('sine', 'square', 'sawtooth', 'triangle')
   */
  async playBeep(frequency = 440, duration = 200, volume = 0.3, type = 'sine') {
    if (this.isMuted) return;

    try {
      const context = this.initAudioContext();

      // Resume context if suspended (required by some browsers)
      if (context.state === 'suspended') {
        await context.resume();
      }

      // Create oscillator for tone generation
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.type = type;
      oscillator.frequency.value = frequency;

      // Envelope: fade in and fade out to avoid clicking
      const now = context.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(volume, now + 0.01); // 10ms fade in
      gainNode.gain.linearRampToValueAtTime(0, now + duration / 1000); // fade out

      oscillator.start(now);
      oscillator.stop(now + duration / 1000);

      return new Promise(resolve => {
        setTimeout(resolve, duration);
      });
    } catch (error) {
      console.error('Error playing beep:', error);
    }
  }

  /**
   * Play warning beep (single tone)
   */
  async playWarningBeep() {
    await this.playBeep(800, 200, 0.25, 'square');
  }

  /**
   * Play critical alert (double beep with urgency)
   */
  async playCriticalAlert() {
    await this.playBeep(1000, 150, 0.3, 'square');
    await new Promise(resolve => setTimeout(resolve, 100));
    await this.playBeep(1200, 150, 0.3, 'square');
  }

  /**
   * Play time alert (triple beep pattern)
   */
  async playTimeAlert() {
    await this.playBeep(600, 150, 0.25, 'sine');
    await new Promise(resolve => setTimeout(resolve, 80));
    await this.playBeep(600, 150, 0.25, 'sine');
    await new Promise(resolve => setTimeout(resolve, 80));
    await this.playBeep(600, 150, 0.25, 'sine');
  }

  /**
   * Queue and play sounds to prevent overlap
   */
  async queueSound(soundFunction) {
    this.soundQueue.push(soundFunction);

    if (!this.isPlaying) {
      this.processQueue();
    }
  }

  /**
   * Process the sound queue
   */
  async processQueue() {
    if (this.soundQueue.length === 0) {
      this.isPlaying = false;
      return;
    }

    this.isPlaying = true;
    const soundFunction = this.soundQueue.shift();

    try {
      await soundFunction();
    } catch (error) {
      console.error('Error processing sound queue:', error);
    }

    // Wait a bit before next sound
    await new Promise(resolve => setTimeout(resolve, 100));
    this.processQueue();
  }

  /**
   * Handle cylinder pressure alert
   * Plays warning beep, repeats every 10 seconds while pressure is low
   */
  handleCylinderPressureAlert(pressure1, pressure2) {
    const isLowPressure = pressure1 < 20 || pressure2 < 20;
    const isCritical = pressure1 < 10 || pressure2 < 10;

    // Check if state changed
    if (isLowPressure && !this.lastAlertStates.cylinderPressure) {
      // Pressure just dropped below threshold
      this.lastAlertStates.cylinderPressure = true;

      if (isCritical) {
        this.queueSound(() => this.playCriticalAlert());
        this.startCriticalAlert();
      } else {
        this.queueSound(() => this.playWarningBeep());
        this.startCylinderPressureAlert();
      }
    } else if (!isLowPressure && this.lastAlertStates.cylinderPressure) {
      // Pressure returned to safe levels
      this.lastAlertStates.cylinderPressure = false;
      this.stopCylinderPressureAlert();
      this.stopCriticalAlert();
    } else if (isLowPressure && isCritical && !this.activeAlerts.critical) {
      // Transitioned from warning to critical
      this.stopCylinderPressureAlert();
      this.queueSound(() => this.playCriticalAlert());
      this.startCriticalAlert();
    } else if (isLowPressure && !isCritical && this.activeAlerts.critical) {
      // Transitioned from critical back to warning
      this.stopCriticalAlert();
      this.queueSound(() => this.playWarningBeep());
      this.startCylinderPressureAlert();
    }
  }

  /**
   * Start repeating cylinder pressure alert (every 10 seconds)
   */
  startCylinderPressureAlert() {
    this.stopCylinderPressureAlert(); // Clear any existing timeout

    this.activeAlerts.cylinderPressure = setInterval(() => {
      this.queueSound(() => this.playWarningBeep());
    }, 10000); // 10 seconds
  }

  /**
   * Stop cylinder pressure alert
   */
  stopCylinderPressureAlert() {
    if (this.activeAlerts.cylinderPressure) {
      clearInterval(this.activeAlerts.cylinderPressure);
      this.activeAlerts.cylinderPressure = null;
    }
  }

  /**
   * Handle umbilical pressure alert
   * Safe range: 7-20 bars. Alerts when outside this range.
   * Plays warning beep, repeats every 10 seconds while outside safe range
   */
  handleUmbilicalPressureAlert(pressure) {
    const SAFE_MIN = 7;
    const SAFE_MAX = 20;
    const CRITICAL_MIN = 3;
    const CRITICAL_MAX = 25;

    const isOutsideSafeRange = pressure > 0 && (pressure < SAFE_MIN || pressure > SAFE_MAX);
    const isCritical = pressure > 0 && (pressure < CRITICAL_MIN || pressure > CRITICAL_MAX);

    // Check if state changed
    if (isOutsideSafeRange && !this.lastAlertStates.umbilicalPressure) {
      // Pressure just went outside safe range
      this.lastAlertStates.umbilicalPressure = true;

      if (isCritical) {
        this.queueSound(() => this.playCriticalAlert());
      } else {
        this.queueSound(() => this.playWarningBeep());
        this.startUmbilicalPressureAlert();
      }
    } else if (!isOutsideSafeRange && this.lastAlertStates.umbilicalPressure) {
      // Pressure returned to safe range
      this.lastAlertStates.umbilicalPressure = false;
      this.stopUmbilicalPressureAlert();
    } else if (isOutsideSafeRange && isCritical && !this.activeAlerts.critical) {
      // Transitioned to critical
      this.stopUmbilicalPressureAlert();
      this.queueSound(() => this.playCriticalAlert());
      this.startCriticalAlert();
    } else if (isOutsideSafeRange && !isCritical && !this.activeAlerts.umbilicalPressure) {
      // Transitioned from critical back to warning
      this.stopCriticalAlert();
      this.queueSound(() => this.playWarningBeep());
      this.startUmbilicalPressureAlert();
    }
  }

  /**
   * Start repeating umbilical pressure alert (every 10 seconds)
   */
  startUmbilicalPressureAlert() {
    this.stopUmbilicalPressureAlert(); // Clear any existing timeout

    this.activeAlerts.umbilicalPressure = setInterval(() => {
      this.queueSound(() => this.playWarningBeep());
    }, 10000); // 10 seconds
  }

  /**
   * Stop umbilical pressure alert
   */
  stopUmbilicalPressureAlert() {
    if (this.activeAlerts.umbilicalPressure) {
      clearInterval(this.activeAlerts.umbilicalPressure);
      this.activeAlerts.umbilicalPressure = null;
    }
  }

  /**
   * Handle dive time remaining alert
   * Plays time alert, repeats every 5 seconds while time is low
   */
  handleDiveTimeAlert(remainingTime) {
    const isLowTime = remainingTime < 5 && remainingTime > 0;
    const isCritical = remainingTime < 2 && remainingTime > 0;

    // Check if state changed
    if (isLowTime && !this.lastAlertStates.diveTime) {
      // Time just dropped below threshold
      this.lastAlertStates.diveTime = true;

      if (isCritical) {
        this.queueSound(() => this.playCriticalAlert());
      } else {
        this.queueSound(() => this.playTimeAlert());
        this.startDiveTimeAlert();
      }
    } else if (!isLowTime && this.lastAlertStates.diveTime) {
      // Time returned to safe levels (unlikely but possible)
      this.lastAlertStates.diveTime = false;
      this.stopDiveTimeAlert();
    } else if (isLowTime && isCritical && this.activeAlerts.diveTime) {
      // Transitioned to critical - stop repeating and let critical alert handle it
      this.stopDiveTimeAlert();
    }
  }

  /**
   * Start repeating dive time alert (every 5 seconds)
   */
  startDiveTimeAlert() {
    this.stopDiveTimeAlert(); // Clear any existing timeout

    this.activeAlerts.diveTime = setInterval(() => {
      this.queueSound(() => this.playTimeAlert());
    }, 5000); // 5 seconds
  }

  /**
   * Stop dive time alert
   */
  stopDiveTimeAlert() {
    if (this.activeAlerts.diveTime) {
      clearInterval(this.activeAlerts.diveTime);
      this.activeAlerts.diveTime = null;
    }
  }

  /**
   * Start critical alert (repeats every 3 seconds)
   */
  startCriticalAlert() {
    this.stopCriticalAlert(); // Clear any existing timeout

    this.activeAlerts.critical = setInterval(() => {
      this.queueSound(() => this.playCriticalAlert());
    }, 3000); // 3 seconds for critical
  }

  /**
   * Stop critical alert
   */
  stopCriticalAlert() {
    if (this.activeAlerts.critical) {
      clearInterval(this.activeAlerts.critical);
      this.activeAlerts.critical = null;
    }
  }

  /**
   * Mute all sounds
   */
  mute() {
    this.isMuted = true;
    this.stopAllAlerts();
  }

  /**
   * Unmute sounds
   */
  unmute() {
    this.isMuted = false;
  }

  /**
   * Toggle mute state
   */
  toggleMute() {
    if (this.isMuted) {
      this.unmute();
    } else {
      this.mute();
    }
    return this.isMuted;
  }

  /**
   * Stop all active alerts
   */
  stopAllAlerts() {
    this.stopCylinderPressureAlert();
    this.stopUmbilicalPressureAlert();
    this.stopDiveTimeAlert();
    this.stopCriticalAlert();

    // Reset alert states
    this.lastAlertStates = {
      cylinderPressure: false,
      umbilicalPressure: false,
      diveTime: false,
      critical: false
    };

    // Clear sound queue
    this.soundQueue = [];
    this.isPlaying = false;
  }

  /**
   * Cleanup - stop all alerts and close audio context
   */
  cleanup() {
    this.stopAllAlerts();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// Create singleton instance
const audioManager = new AudioManager();

export default audioManager;
