import React from 'react';
import useDivingStore from '../../store/divingStore.js';
import { ALERT_TYPES } from '../../utils/constants.js';

const styles = {
  alertContainer: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxWidth: '400px',
    pointerEvents: 'none'
  },
  alert: {
    padding: '12px 16px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
    fontWeight: '500',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(10px)',
    border: '1px solid',
    pointerEvents: 'auto',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    animation: 'slideIn 0.3s ease-out'
  },
  warningAlert: {
    backgroundColor: 'rgba(251, 191, 36, 0.9)',
    borderColor: 'rgba(251, 191, 36, 0.6)',
    color: '#92400e'
  },
  criticalAlert: {
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    borderColor: 'rgba(239, 68, 68, 0.6)',
    color: '#7f1d1d'
  },
  icon: {
    fontSize: '18px',
    flexShrink: 0
  },
  message: {
    flex: 1,
    lineHeight: '1.4'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '2px',
    borderRadius: '4px',
    opacity: 0.7,
    transition: 'opacity 0.2s ease',
    color: 'inherit'
  },
  '@keyframes slideIn': {
    from: {
      transform: 'translateX(100%)',
      opacity: 0
    },
    to: {
      transform: 'translateX(0)',
      opacity: 1
    }
  }
};

const AlertSystem = () => {
  const alerts = useDivingStore((state) => state.alerts);
  const removeAlert = useDivingStore((state) => state.removeAlert);

  const getAlertIcon = (type) => {
    switch (type) {
      case ALERT_TYPES.WARNING:
        return '⚠️';
      case ALERT_TYPES.CRITICAL:
        return '🚨';
      default:
        return '⚠️';
    }
  };

  const getAlertStyle = (type) => {
    const baseStyle = styles.alert;
    switch (type) {
      case ALERT_TYPES.WARNING:
        return { ...baseStyle, ...styles.warningAlert };
      case ALERT_TYPES.CRITICAL:
        return { ...baseStyle, ...styles.criticalAlert };
      default:
        return { ...baseStyle, ...styles.warningAlert };
    }
  };

  const handleAlertClick = (alertId) => {
    removeAlert(alertId);
  };

  const handleCloseClick = (e, alertId) => {
    e.stopPropagation();
    removeAlert(alertId);
  };

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div style={styles.alertContainer}>
      {alerts.map((alert) => (
        <div
          key={alert.id}
          style={getAlertStyle(alert.type)}
          onClick={() => handleAlertClick(alert.id)}
          title="Click to dismiss"
        >
          <span style={styles.icon}>
            {getAlertIcon(alert.type)}
          </span>
          <span style={styles.message}>
            {alert.message}
          </span>
          <button
            style={styles.closeButton}
            onClick={(e) => handleCloseClick(e, alert.id)}
            onMouseEnter={(e) => e.target.style.opacity = '1'}
            onMouseLeave={(e) => e.target.style.opacity = '0.7'}
            title="Close"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default AlertSystem;