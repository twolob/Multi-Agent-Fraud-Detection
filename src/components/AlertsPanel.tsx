import React from 'react';
import { Bell, AlertTriangle, Info, AlertCircle, X } from 'lucide-react';
import { useFraudDetection } from '../context/FraudDetectionContext';
import { formatDistanceToNow } from 'date-fns';

export default function AlertsPanel() {
  const { alerts, loading, dispatch } = useFraudDetection();

  const getAlertIcon = (type: string, severity: string) => {
    if (severity === 'critical') {
      return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
    
    switch (type) {
      case 'fraud_detected':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'high_risk':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'system_alert':
        return <Info className="w-4 h-4 text-blue-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getAlertClass = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'high':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900';
      case 'low':
        return 'bg-blue-50 border-blue-200 text-blue-900';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  const clearAlerts = () => {
    dispatch({ type: 'CLEAR_ALERTS' });
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Bell className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Real-time Alerts</h2>
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse border border-gray-100 rounded-lg p-3">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Real-time Alerts</h2>
          {alerts.length > 0 && (
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
              {alerts.length}
            </span>
          )}
        </div>
        {alerts.length > 0 && (
          <button
            onClick={clearAlerts}
            className="text-xs text-gray-500 hover:text-gray-700 flex items-center space-x-1"
          >
            <X className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No alerts at the moment</p>
            <p className="text-xs">System is monitoring for suspicious activity</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`border rounded-lg p-3 transition-all duration-200 ${getAlertClass(alert.severity)}`}
            >
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0 mt-0.5">
                  {getAlertIcon(alert.type, alert.severity)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium uppercase tracking-wide">
                      {alert.severity} Alert
                    </span>
                    <span className="text-xs opacity-75">
                      {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm font-medium mb-1">{alert.message}</p>
                  
                  {(alert.transactionId || alert.agentId) && (
                    <div className="text-xs opacity-75 space-y-1">
                      {alert.transactionId && (
                        <div>Transaction: {alert.transactionId}</div>
                      )}
                      {alert.agentId && (
                        <div>Detected by: {alert.agentId}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}