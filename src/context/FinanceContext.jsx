import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp, setDoc } from 'firebase/firestore';

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lắng nghe dữ liệu real-time từ Firestore
    const q = query(collection(db, 'transactions'), orderBy('date', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txData = [];
      snapshot.forEach((doc) => {
        txData.push({ id: doc.id, ...doc.data() });
      });
      setTransactions(txData);
      setLoading(false);
    }, (error) => {
      console.error("Lỗi khi lấy dữ liệu từ Firebase: ", error);
      setLoading(false);
    });

    // Lắng nghe dữ liệu ngân sách
    const unsubscribeBudgets = onSnapshot(collection(db, 'budgets'), (snapshot) => {
      const budgetsData = {};
      snapshot.forEach((doc) => {
        budgetsData[doc.id] = doc.data().amount;
      });
      setBudgets(budgetsData);
    });

    // Hủy đăng ký lắng nghe khi component unmount
    return () => {
      unsubscribe();
      unsubscribeBudgets();
    };
  }, []);

  const addTransaction = async (transaction) => {
    try {
      await addDoc(collection(db, 'transactions'), {
        ...transaction,
        createdAt: serverTimestamp()
      });
    } catch (e) {
      console.error("Lỗi khi thêm giao dịch: ", e);
      alert("Không thể thêm giao dịch. Vui lòng kiểm tra quyền truy cập Database (Rules).");
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await deleteDoc(doc(db, 'transactions', id));
    } catch (e) {
      console.error("Lỗi khi xóa giao dịch: ", e);
      alert("Không thể xóa giao dịch. Vui lòng kiểm tra quyền truy cập Database (Rules).");
    }
  };

  const setMonthlyBudget = async (monthKey, amount) => {
    try {
      await setDoc(doc(db, 'budgets', monthKey), {
        amount: Number(amount)
      });
    } catch (e) {
      console.error("Lỗi khi lưu ngân sách: ", e);
      alert("Không thể lưu ngân sách. Vui lòng kiểm tra quyền truy cập Database.");
    }
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
      balance,
      budgets,
      setMonthlyBudget,
      loading
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);
