import React, { createContext, useContext, useState, useEffect } from 'react';

const FinanceContext = createContext();

const initialTransactions = [
  { id: '1', type: 'income', amount: 35000000, category: 'Lương', date: new Date().toISOString(), note: 'Lương tháng này' },
  { id: '2', type: 'expense', amount: 5000000, category: 'Ăn uống', date: new Date(Date.now() - 86400000).toISOString(), note: 'Ăn nhà hàng' },
  { id: '3', type: 'expense', amount: 1500000, category: 'Mua sắm', date: new Date(Date.now() - 86400000 * 2).toISOString(), note: 'Quần áo' },
  { id: '4', type: 'expense', amount: 3000000, category: 'Hóa đơn', date: new Date(Date.now() - 86400000 * 3).toISOString(), note: 'Điện nước' },
];

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('finance_transactions');
    if (saved) {
      return JSON.parse(saved);
    }
    return initialTransactions;
  });

  useEffect(() => {
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction) => {
    setTransactions(prev => [{ ...transaction, id: Date.now().toString() }, ...prev]);
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const calculateTotal = (type) => {
    return transactions
      .filter(t => t.type === type)
      .reduce((sum, t) => sum + Number(t.amount), 0);
  };

  const totalIncome = calculateTotal('income');
  const totalExpense = calculateTotal('expense');
  const balance = totalIncome - totalExpense;

  return (
    <FinanceContext.Provider value={{
      transactions,
      addTransaction,
      deleteTransaction,
      totalIncome,
      totalExpense,
      balance
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);
