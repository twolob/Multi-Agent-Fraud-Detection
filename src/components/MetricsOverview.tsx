import React from 'react';
import { TrendingUp, Shield, AlertTriangle, Clock, Target, Zap } from 'lucide-react';
import { useFraudDetection } from '../context/FraudDetectionContext';

export default function MetricsOverview() {
  const { metrics, loading } = useFraudDetection();

  const metricCards = [
    {
      title: 'Total Transactions',
      value: metrics.totalTransactions.toLocaleString(),
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12.5%',
      changeType: 'positive' as const
    },
    {
      title: 'Fraud Detected',
      value: metrics.fraudDetected.toLocaleString(),
      icon: Shield,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      change: '-2.1%',
      changeType: 'positive' as const
    },
    {
      title: 'System Accuracy',
      value: `${metrics.accuracy.toFixed(1)}%`,
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+0.3%',
      changeType: 'positive' as const
    },
    {
      title: 'False Positives',
      value: metrics.falsePositives.toLocaleString(),
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      change: '-5.2%',
      changeType: 'positive' as const
    },
    {
      title: 'Avg Processing Time',
      value: `${metrics.avgProcessingTime.toFixed(0)}ms`,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '-8.1%',
      changeType: 'positive' as const
    },
    {
      title: 'Detection Rate',
      value: `${((metrics.fraudDetected / metrics.totalTransactions) * 100).toFixed(2)}%`,
      icon: Zap,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      change: '+1.4%',
      changeType: 'positive' as const
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="metric-card animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {metricCards.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <div key={index} className="metric-card">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <Icon className={`w-5 h-5 ${metric.color}`} />
              </div>
              <span className={`text-xs font-medium ${
                metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              <p className="text-sm text-gray-500">{metric.title}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}