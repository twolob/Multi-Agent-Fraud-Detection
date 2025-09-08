import React from 'react';
import { FraudDetectionProvider } from './context/FraudDetectionContext';
import Dashboard from './components/Dashboard';
import Header from './components/Header';

function App() {
  return (
    <FraudDetectionProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Dashboard />
        </main>
      </div>
    </FraudDetectionProvider>
  );
}

export default App;