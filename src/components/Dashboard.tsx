import React from 'react';
import MetricsOverview from './MetricsOverview';
import AgentStatus from './AgentStatus';
import TransactionStream from './TransactionStream';
import AlertsPanel from './AlertsPanel';
import RiskAnalytics from './RiskAnalytics';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <MetricsOverview />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Agent Status */}
        <div className="lg:col-span-1">
          <AgentStatus />
        </div>

        {/* Middle Column - Transaction Stream */}
        <div className="lg:col-span-1">
          <TransactionStream />
        </div>

        {/* Right Column - Alerts */}
        <div className="lg:col-span-1">
          <AlertsPanel />
        </div>
      </div>

      {/* Risk Analytics */}
      <RiskAnalytics />
    </div>
  );
}