import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { FinanceProvider } from './context/FinanceContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import Budgets from './pages/Budgets';
import TransactionModal from './components/TransactionModal';
import { Plus } from 'lucide-react';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <FinanceProvider>
      <Router>
        <div className="app-container">
          <Sidebar />
          
          <main className="main-content">
            <header className="flex justify-end items-center mb-8" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
              <button 
                className="btn btn-primary"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus size={18} /> Thêm giao dịch
              </button>
            </header>
            
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/budgets" element={<Budgets />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </main>
          
          <TransactionModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
          />
        </div>
      </Router>
    </FinanceProvider>
  );
}

export default App;
