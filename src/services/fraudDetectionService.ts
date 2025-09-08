import { Transaction, Agent, FraudMetrics, RealTimeAlert } from '../types';

type FraudDetectionAction = any; // Import from context if needed

class FraudDetectionService {
  private dispatch: React.Dispatch<FraudDetectionAction> | null = null;
  private intervalId: NodeJS.Timeout | null = null;
  private agentIntervals: NodeJS.Timeout[] = [];

  initialize(dispatch: React.Dispatch<FraudDetectionAction>) {
    this.dispatch = dispatch;
    this.startRealTimeSimulation();
  }

  private startRealTimeSimulation() {
    if (!this.dispatch) return;

    // Initialize with sample data
    const initialAgents = this.generateInitialAgents();
    const initialTransactions = this.generateInitialTransactions();
    const initialMetrics = this.calculateMetrics(initialTransactions);

    this.dispatch({
      type: 'INITIALIZE_DATA',
      payload: {
        agents: initialAgents,
        transactions: initialTransactions,
        metrics: initialMetrics
      }
    });

    this.dispatch({ type: 'SET_CONNECTED', payload: true });

    // Start generating real-time transactions
    this.intervalId = setInterval(() => {
      this.generateRealTimeTransaction();
    }, 2000 + Math.random() * 3000); // Random interval between 2-5 seconds

    // Start agent status updates
    initialAgents.forEach((agent, index) => {
      const agentInterval = setInterval(() => {
        this.updateAgentStatus(agent.id);
      }, 5000 + index * 1000); // Staggered updates
      
      this.agentIntervals.push(agentInterval);
    });
  }

  private generateInitialAgents(): Agent[] {
    return [
      {
        id: 'agent-pattern',
        name: 'Pattern Recognition Agent',
        type: 'pattern',
        status: 'active',
        accuracy: 94.2,
        processedTransactions: 15420,
        detectedFraud: 1247,
        lastActivity: new Date()
      },
      {
        id: 'agent-anomaly',
        name: 'Anomaly Detection Agent',
        type: 'anomaly',
        status: 'processing',
        accuracy: 91.8,
        processedTransactions: 12890,
        detectedFraud: 892,
        lastActivity: new Date()
      },
      {
        id: 'agent-behavioral',
        name: 'Behavioral Analysis Agent',
        type: 'behavioral',
        status: 'active',
        accuracy: 89.5,
        processedTransactions: 18750,
        detectedFraud: 1456,
        lastActivity: new Date()
      },
      {
        id: 'agent-network',
        name: 'Network Analysis Agent',
        type: 'network',
        status: 'idle',
        accuracy: 87.3,
        processedTransactions: 9340,
        detectedFraud: 567,
        lastActivity: new Date(Date.now() - 300000) // 5 minutes ago
      },
      {
        id: 'agent-rules',
        name: 'Rule-Based Agent',
        type: 'rule-based',
        status: 'active',
        accuracy: 96.1,
        processedTransactions: 22100,
        detectedFraud: 1890,
        lastActivity: new Date()
      }
    ];
  }

  private generateInitialTransactions(): Transaction[] {
    const transactions: Transaction[] = [];
    const now = new Date();

    for (let i = 0; i < 50; i++) {
      const transaction = this.createRandomTransaction(
        new Date(now.getTime() - i * 60000 * Math.random() * 30) // Last 30 minutes
      );
      transactions.push(transaction);
    }

    return transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  private generateRealTimeTransaction() {
    if (!this.dispatch) return;

    const transaction = this.createRandomTransaction(new Date());
    
    this.dispatch({ type: 'ADD_TRANSACTION', payload: transaction });

    // Generate alert for high-risk transactions
    if (transaction.riskLevel === 'high') {
      const alert: RealTimeAlert = {
        id: `alert-${Date.now()}`,
        type: 'fraud_detected',
        message: `High-risk transaction detected: $${transaction.amount.toLocaleString()} at ${transaction.merchantName}`,
        severity: 'high',
        timestamp: new Date(),
        transactionId: transaction.id,
        agentId: transaction.agentAnalysis[0]?.agentId
      };

      this.dispatch({ type: 'ADD_ALERT', payload: alert });
    }

    // Update metrics periodically
    if (Math.random() < 0.3) {
      this.updateMetrics();
    }
  }

  private createRandomTransaction(timestamp: Date): Transaction {
    const merchants = [
      'Amazon', 'Walmart', 'Target', 'Best Buy', 'Home Depot',
      'Starbucks', 'McDonald\'s', 'Shell', 'Exxon', 'CVS',
      'Walgreens', 'Apple Store', 'Nike', 'Adidas', 'Zara'
    ];

    const locations = [
      'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX',
      'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA',
      'Dallas, TX', 'San Jose, CA', 'Austin, TX', 'Jacksonville, FL'
    ];

    const paymentMethods = ['Credit Card', 'Debit Card', 'Digital Wallet', 'Bank Transfer'];

    const amount = Math.random() < 0.1 
      ? Math.random() * 5000 + 1000 // 10% high-value transactions
      : Math.random() * 500 + 10;   // 90% normal transactions

    const fraudScore = this.calculateFraudScore(amount, timestamp);
    const riskLevel = this.determineRiskLevel(fraudScore);
    const status = riskLevel === 'high' ? 'flagged' : riskLevel === 'medium' ? 'flagged' : 'approved';

    const agentAnalysis = this.generateAgentAnalysis(fraudScore, riskLevel);

    return {
      id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      amount: Math.round(amount * 100) / 100,
      timestamp,
      userId: `user-${Math.floor(Math.random() * 10000)}`,
      merchantId: `merchant-${Math.floor(Math.random() * 1000)}`,
      merchantName: merchants[Math.floor(Math.random() * merchants.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      fraudScore,
      riskLevel,
      status,
      agentAnalysis
    };
  }

  private calculateFraudScore(amount: number, timestamp: Date): number {
    let score = 0;

    // Amount-based scoring
    if (amount > 1000) score += 30;
    else if (amount > 500) score += 15;
    else if (amount < 5) score += 10;

    // Time-based scoring (late night transactions are riskier)
    const hour = timestamp.getHours();
    if (hour >= 23 || hour <= 5) score += 20;

    // Random factors for simulation
    score += Math.random() * 40;

    return Math.min(Math.round(score), 100);
  }

  private determineRiskLevel(fraudScore: number): 'low' | 'medium' | 'high' {
    if (fraudScore >= 70) return 'high';
    if (fraudScore >= 40) return 'medium';
    return 'low';
  }

  private generateAgentAnalysis(fraudScore: number, riskLevel: string) {
    const agents = ['agent-pattern', 'agent-anomaly', 'agent-behavioral', 'agent-network', 'agent-rules'];
    const agentNames = [
      'Pattern Recognition Agent',
      'Anomaly Detection Agent', 
      'Behavioral Analysis Agent',
      'Network Analysis Agent',
      'Rule-Based Agent'
    ];

    const numAgents = Math.floor(Math.random() * 3) + 2; // 2-4 agents analyze each transaction
    const selectedAgents = agents.slice(0, numAgents);

    return selectedAgents.map((agentId, index) => ({
      agentId,
      agentName: agentNames[agents.indexOf(agentId)],
      confidence: Math.random() * 30 + 70, // 70-100% confidence
      reasoning: this.generateReasoning(riskLevel, agentId),
      timestamp: new Date()
    }));
  }

  private generateReasoning(riskLevel: string, agentId: string): string {
    const reasonings = {
      'high': [
        'Unusual spending pattern detected',
        'Transaction amount exceeds normal behavior',
        'Suspicious merchant category',
        'Geolocation anomaly identified',
        'Multiple rapid transactions detected'
      ],
      'medium': [
        'Slightly elevated risk factors',
        'Minor deviation from user pattern',
        'Merchant risk score moderate',
        'Time-based risk factors present',
        'Payment method risk assessment'
      ],
      'low': [
        'Transaction within normal parameters',
        'Consistent with user behavior',
        'Low-risk merchant and location',
        'Standard transaction pattern',
        'No anomalies detected'
      ]
    };

    const options = reasonings[riskLevel as keyof typeof reasonings];
    return options[Math.floor(Math.random() * options.length)];
  }

  private updateAgentStatus(agentId: string) {
    if (!this.dispatch) return;

    // Simulate agent status changes
    const statuses: Agent['status'][] = ['active', 'processing', 'idle'];
    const newStatus = statuses[Math.floor(Math.random() * statuses.length)];

    // This would typically update a single agent, but for simplicity we'll trigger a full update
    const updatedAgents = this.generateInitialAgents().map(agent => 
      agent.id === agentId 
        ? { 
            ...agent, 
            status: newStatus, 
            lastActivity: new Date(),
            processedTransactions: agent.processedTransactions + Math.floor(Math.random() * 5),
            detectedFraud: agent.detectedFraud + (Math.random() < 0.1 ? 1 : 0)
          }
        : agent
    );

    this.dispatch({ type: 'UPDATE_AGENTS', payload: updatedAgents });
  }

  private updateMetrics() {
    if (!this.dispatch) return;

    const metrics: FraudMetrics = {
      totalTransactions: Math.floor(Math.random() * 1000) + 50000,
      fraudDetected: Math.floor(Math.random() * 500) + 2500,
      falsePositives: Math.floor(Math.random() * 100) + 150,
      accuracy: Math.random() * 5 + 92, // 92-97%
      avgProcessingTime: Math.random() * 200 + 150, // 150-350ms
      riskDistribution: {
        low: Math.random() * 20 + 70,   // 70-90%
        medium: Math.random() * 15 + 8, // 8-23%
        high: Math.random() * 8 + 2     // 2-10%
      }
    };

    this.dispatch({ type: 'UPDATE_METRICS', payload: metrics });
  }

  private calculateMetrics(transactions: Transaction[]): FraudMetrics {
    const total = transactions.length;
    const fraudulent = transactions.filter(t => t.status === 'flagged' || t.status === 'blocked').length;
    const riskCounts = transactions.reduce((acc, t) => {
      acc[t.riskLevel]++;
      return acc;
    }, { low: 0, medium: 0, high: 0 });

    return {
      totalTransactions: total + 45000, // Add base number for realism
      fraudDetected: fraudulent + 2400,
      falsePositives: Math.floor(fraudulent * 0.1) + 140,
      accuracy: 93.5,
      avgProcessingTime: 180,
      riskDistribution: {
        low: (riskCounts.low / total) * 100,
        medium: (riskCounts.medium / total) * 100,
        high: (riskCounts.high / total) * 100
      }
    };
  }

  disconnect() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.agentIntervals.forEach(interval => clearInterval(interval));
    this.agentIntervals = [];

    if (this.dispatch) {
      this.dispatch({ type: 'SET_CONNECTED', payload: false });
    }
  }
}

export const fraudDetectionService = new FraudDetectionService();