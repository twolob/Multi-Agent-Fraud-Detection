import React from 'react';
import { Shield, Activity, AlertTriangle } from 'lucide-react';
import { useFraudDetection } from '../context/FraudDetectionContext';

export default function Header() {
  const { isConnected, alerts } = useFraudDetection();
  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical' || alert.severity === 'high').length;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Multi-Agent Fraud Detection
              </h1>
              <p className="text-sm text-gray-500">
                Real-time AI-powered fraud monitoring system
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Connection Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-600">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>

            {/* Real-time Activity Indicator */}
            <div className="flex items-center space-x-2">
              <Activity className={`w-4 h-4 ${isConnected ? 'text-green-500 animate-pulse' : 'text-gray-400'}`} />
              <span className="text-sm text-gray-600">Live Data</span>
            </div>

            {/* Critical Alerts */}
            {criticalAlerts > 0 && (
              <div className="flex items-center space-x-2 bg-red-50 px-3 py-1 rounded-full">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-700">
                  {criticalAlerts} Critical Alert{criticalAlerts !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}