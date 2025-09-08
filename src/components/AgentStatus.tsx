import React from 'react';
import { Bot, Activity, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useFraudDetection } from '../context/FraudDetectionContext';
import { formatDistanceToNow } from 'date-fns';

export default function AgentStatus() {
  const { agents, loading } = useFraudDetection();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Activity className="w-4 h-4 text-green-600 animate-pulse" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-600 animate-spin" />;
      case 'idle':
        return <CheckCircle className="w-4 h-4 text-gray-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'agent-active';
      case 'processing':
        return 'agent-processing';
      case 'idle':
        return 'agent-idle';
      default:
        return 'agent-status bg-red-100 text-red-800';
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Bot className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">AI Agents Status</h2>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse">
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
      <div className="flex items-center space-x-2 mb-4">
        <Bot className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">AI Agents Status</h2>
      </div>

      <div className="space-y-4">
        {agents.map((agent) => (
          <div key={agent.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getStatusIcon(agent.status)}
                <h3 className="font-medium text-gray-900">{agent.name}</h3>
              </div>
              <span className={getStatusClass(agent.status)}>
                {agent.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-2">
              <div>
                <span className="font-medium">Accuracy:</span> {agent.accuracy.toFixed(1)}%
              </div>
              <div>
                <span className="font-medium">Processed:</span> {agent.processedTransactions.toLocaleString()}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Fraud Detected: {agent.detectedFraud.toLocaleString()}</span>
              <span>Last Active: {formatDistanceToNow(agent.lastActivity, { addSuffix: true })}</span>
            </div>

            {/* Accuracy Progress Bar */}
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${agent.accuracy}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}