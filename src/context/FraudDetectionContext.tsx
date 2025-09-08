import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Transaction, Agent, FraudMetrics, RealTimeAlert } from '../types';
import { fraudDetectionService } from '../services/fraudDetectionService';

interface FraudDetectionState {
  transactions: Transaction[];
  agents: Agent[];
  metrics: FraudMetrics;
  alerts: RealTimeAlert[];
  isConnected: boolean;
  loading: boolean;
}

interface FraudDetectionContextType extends FraudDetectionState {
  dispatch: React.Dispatch<FraudDetectionAction>;
}

type FraudDetectionAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_AGENTS'; payload: Agent[] }
  | { type: 'UPDATE_METRICS'; payload: FraudMetrics }
  | { type: 'ADD_ALERT'; payload: RealTimeAlert }
  | { type: 'CLEAR_ALERTS' }
  | { type: 'INITIALIZE_DATA'; payload: { transactions: Transaction[]; agents: Agent[]; metrics: FraudMetrics } };

const initialState: FraudDetectionState = {
  transactions: [],
  agents: [],
  metrics: {
    totalTransactions: 0,
    fraudDetected: 0,
    falsePositives: 0,
    accuracy: 0,
    avgProcessingTime: 0,
    riskDistribution: { low: 0, medium: 0, high: 0 }
  },
  alerts: [],
  isConnected: false,
  loading: true
};

function fraudDetectionReducer(state: FraudDetectionState, action: FraudDetectionAction): FraudDetectionState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_CONNECTED':
      return { ...state, isConnected: action.payload };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions.slice(0, 99)] // Keep last 100 transactions
      };
    case 'UPDATE_AGENTS':
      return { ...state, agents: action.payload };
    case 'UPDATE_METRICS':
      return { ...state, metrics: action.payload };
    case 'ADD_ALERT':
      return {
        ...state,
        alerts: [action.payload, ...state.alerts.slice(0, 49)] // Keep last 50 alerts
      };
    case 'CLEAR_ALERTS':
      return { ...state, alerts: [] };
    case 'INITIALIZE_DATA':
      return {
        ...state,
        transactions: action.payload.transactions,
        agents: action.payload.agents,
        metrics: action.payload.metrics,
        loading: false
      };
    default:
      return state;
  }
}

const FraudDetectionContext = createContext<FraudDetectionContextType | undefined>(undefined);

export function FraudDetectionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(fraudDetectionReducer, initialState);

  useEffect(() => {
    // Initialize the fraud detection service
    fraudDetectionService.initialize(dispatch);
    
    return () => {
      fraudDetectionService.disconnect();
    };
  }, []);

  return (
    <FraudDetectionContext.Provider value={{ ...state, dispatch }}>
      {children}
    </FraudDetectionContext.Provider>
  );
}

export function useFraudDetection() {
  const context = useContext(FraudDetectionContext);
  if (context === undefined) {
    throw new Error('useFraudDetection must be used within a FraudDetectionProvider');
  }
  return context;
}