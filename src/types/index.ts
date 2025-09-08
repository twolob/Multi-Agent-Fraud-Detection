export interface Transaction {
  id: string;
  amount: number;
  timestamp: Date;
  userId: string;
  merchantId: string;
  merchantName: string;
  location: string;
  paymentMethod: string;
  fraudScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  status: 'approved' | 'flagged' | 'blocked';
  agentAnalysis: AgentAnalysis[];
}

export interface AgentAnalysis {
  agentId: string;
  agentName: string;
  confidence: number;
  reasoning: string;
  timestamp: Date;
}

export interface Agent {
  id: string;
  name: string;
  type: 'pattern' | 'anomaly' | 'behavioral' | 'network' | 'rule-based';
  status: 'active' | 'processing' | 'idle';
  accuracy: number;
  processedTransactions: number;
  detectedFraud: number;
  lastActivity: Date;
}

export interface FraudMetrics {
  totalTransactions: number;
  fraudDetected: number;
  falsePositives: number;
  accuracy: number;
  avgProcessingTime: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
}

export interface RealTimeAlert {
  id: string;
  type: 'fraud_detected' | 'high_risk' | 'system_alert';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  transactionId?: string;
  agentId?: string;
}