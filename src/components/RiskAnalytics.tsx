import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';
import { useFraudDetection } from '../context/FraudDetectionContext';

export default function RiskAnalytics() {
  const { metrics, transactions, loading } = useFraudDetection();

  // Prepare data for charts
  const riskDistributionData = [
    { name: 'Low Risk', value: metrics.riskDistribution.low, color: '#22c55e' },
    { name: 'Medium Risk', value: metrics.riskDistribution.medium, color: '#f59e0b' },
    { name: 'High Risk', value: metrics.riskDistribution.high, color: '#ef4444' }
  ];

  // Transaction volume over time (last 20 transactions)
  const timeSeriesData = transactions.slice(0, 20).reverse().map((transaction, index) => ({
    time: index + 1,
    amount: transaction.amount,
    fraudScore: transaction.fraudScore
  }));

  // Fraud detection by hour
  const hourlyData = Array.from({ length: 24 }, (_, hour) => {
    const hourTransactions = transactions.filter(t => t.timestamp.getHours() === hour);
    const fraudCount = hourTransactions.filter(t => t.riskLevel === 'high').length;
    return {
      hour: `${hour}:00`,
      transactions: hourTransactions.length,
      fraud: fraudCount,
      fraudRate: hourTransactions.length > 0 ? (fraudCount / hourTransactions.length) * 100 : 0
    };
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <TrendingUp className="w-5 h-5 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-900">Risk Analytics Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Pie Chart */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <PieChartIcon className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">Risk Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={riskDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {riskDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Percentage']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-4 mt-2">
            {riskDistributionData.map((item, index) => (
              <div key={index} className="flex items-center space-x-1">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-xs text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction Volume and Fraud Score */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">Recent Transaction Trends</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="amount" fill="#3b82f6" name="Amount ($)" />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="fraudScore" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Fraud Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly Fraud Detection */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">Hourly Fraud Detection</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={hourlyData.filter(d => d.transactions > 0)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="fraudRate" fill="#f59e0b" name="Fraud Rate (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">
            {((metrics.fraudDetected / metrics.totalTransactions) * 100).toFixed(2)}%
          </div>
          <div className="text-sm text-gray-600">Detection Rate</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">
            {metrics.accuracy.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">System Accuracy</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {((metrics.falsePositives / metrics.fraudDetected) * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">False Positive Rate</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-600">
            {metrics.avgProcessingTime.toFixed(0)}ms
          </div>
          <div className="text-sm text-gray-600">Avg Processing Time</div>
        </div>
      </div>
    </div>
  );
}