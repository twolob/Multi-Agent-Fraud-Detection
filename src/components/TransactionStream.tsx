import React from 'react';
import { CreditCard, MapPin, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useFraudDetection } from '../context/FraudDetectionContext';
import { formatDistanceToNow } from 'date-fns';

export default function TransactionStream() {
  const { transactions, loading } = useFraudDetection();

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'low':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'flagged':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'blocked':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRiskClass = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return 'fraud-high';
      case 'medium':
        return 'fraud-medium';
      case 'low':
        return 'fraud-low';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <CreditCard className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Live Transaction Stream</h2>
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {Array.from({ length: 8 }).map((_, i) => (
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
          <CreditCard className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Live Transaction Stream</h2>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500">Live</span>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {transactions.slice(0, 20).map((transaction) => (
          <div 
            key={transaction.id} 
            className={`border rounded-lg p-3 transition-all duration-200 hover:shadow-sm ${getRiskClass(transaction.riskLevel)}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getRiskIcon(transaction.riskLevel)}
                <span className="font-medium text-sm">
                  ${transaction.amount.toLocaleString()}
                </span>
                {getStatusIcon(transaction.status)}
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(transaction.timestamp, { addSuffix: true })}
              </div>
            </div>

            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">{transaction.merchantName}</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  Risk: {transaction.fraudScore}%
                </span>
              </div>
              
              <div className="flex items-center space-x-1 text-gray-600">
                <MapPin className="w-3 h-3" />
                <span className="text-xs">{transaction.location}</span>
              </div>

              <div className="text-xs text-gray-500">
                {transaction.paymentMethod} • User: {transaction.userId}
              </div>

              {/* Agent Analysis Summary */}
              {transaction.agentAnalysis.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">AI Analysis:</span> {transaction.agentAnalysis.length} agents
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {transaction.agentAnalysis[0].reasoning}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}