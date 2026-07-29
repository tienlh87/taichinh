import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/format';
import { Target, TrendingDown, Wallet, AlertCircle, CheckCircle2 } from 'lucide-react';

const Budgets = () => {
  const { transactions, budgets, setMonthlyBudget, loading } = useFinance();
  
  // Mặc định chọn tháng hiện tại (YYYY-MM)
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [budgetInput, setBudgetInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Tính toán dữ liệu khi thay đổi tháng
  const budgetAmount = budgets[selectedMonth] || 0;
  
  // Lọc các giao dịch chi tiêu trong tháng được chọn
  const monthlyExpenses = transactions
    .filter(t => t.type === 'expense' && t.date.startsWith(selectedMonth))
    .reduce((sum, t) => sum + Number(t.amount), 0);
    
  const remaining = budgetAmount - monthlyExpenses;
  const percent = budgetAmount > 0 ? Math.min(Math.round((monthlyExpenses / budgetAmount) * 100), 100) : 0;
  const rawPercent = budgetAmount > 0 ? (monthlyExpenses / budgetAmount) * 100 : 0;

  // Khởi tạo input khi budget thay đổi
  useEffect(() => {
    if (budgetAmount > 0 && !isEditing) {
      setBudgetInput(new Intl.NumberFormat('vi-VN').format(budgetAmount));
    } else if (budgetAmount === 0 && !isEditing) {
      setBudgetInput('');
    }
  }, [budgetAmount, isEditing, selectedMonth]);

  const handleAmountChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    if (!rawValue) {
      setBudgetInput('');
      return;
    }
    const formatted = new Intl.NumberFormat('vi-VN').format(parseInt(rawValue, 10));
    setBudgetInput(formatted);
  };

  const handleSaveBudget = async () => {
    const rawAmount = Number(budgetInput.replace(/\D/g, ''));
    if (!rawAmount && rawAmount !== 0) return;
    
    await setMonthlyBudget(selectedMonth, rawAmount);
    setIsEditing(false);
  };

  const getStatusInfo = () => {
    if (budgetAmount === 0) return { color: 'var(--text-muted)', text: 'Chưa đặt ngân sách', icon: null };
    if (remaining > 0) return { color: 'var(--success)', text: 'Dư dả', icon: <CheckCircle2 size={24} /> };
    if (remaining === 0) return { color: 'var(--text-muted)', text: 'Vừa đủ', icon: <CheckCircle2 size={24} /> };
    return { color: 'var(--danger)', text: 'Vượt ngân sách', icon: <AlertCircle size={24} /> };
  };

  const getProgressColor = () => {
    if (rawPercent < 50) return 'var(--success)';
    if (rawPercent <= 90) return '#f59e0b'; // Vàng
    return 'var(--danger)'; // Đỏ
  };

  const status = getStatusInfo();

  if (loading) {
    return <div className="p-8 text-center text-muted">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">Lập ngân sách</h1>
      
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="form-group mb-0" style={{ minWidth: '200px' }}>
            <label className="form-label">Chọn tháng</label>
            <input 
              type="month" 
              className="form-control" 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            {!isEditing ? (
              <button className="btn btn-outline" onClick={() => setIsEditing(true)}>
                <Target size={18} /> Thay đổi hạn mức
              </button>
            ) : (
              <div className="flex gap-2 w-full md:w-auto">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập số tiền..."
                  value={budgetInput}
                  onChange={handleAmountChange}
                />
                <button className="btn btn-primary" onClick={handleSaveBudget}>
                  Lưu
                </button>
                <button className="btn btn-outline" onClick={() => {
                  setIsEditing(false);
                  setBudgetInput(budgetAmount > 0 ? new Intl.NumberFormat('vi-VN').format(budgetAmount) : '');
                }}>
                  Hủy
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card" style={{ background: 'var(--bg-main)' }}>
            <div className="flex items-center gap-3 mb-2">
              <Target className="text-primary" size={20} />
              <h3 className="text-muted">Ngân sách</h3>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(budgetAmount)}</p>
          </div>
          
          <div className="card" style={{ background: 'var(--bg-main)' }}>
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="text-danger" size={20} />
              <h3 className="text-muted">Đã chi</h3>
            </div>
            <p className="text-2xl font-bold text-danger">{formatCurrency(monthlyExpenses)}</p>
          </div>

          <div className="card" style={{ background: 'var(--bg-main)' }}>
            <div className="flex items-center gap-3 mb-2">
              <Wallet size={20} style={{ color: status.color }} />
              <h3 className="text-muted">Còn lại</h3>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold" style={{ color: status.color }}>
                {formatCurrency(Math.abs(remaining))} 
                {remaining < 0 && ' (Âm)'}
                {remaining > 0 && ' (Dương)'}
              </p>
              {status.icon && <span style={{ color: status.color }}>{status.icon}</span>}
            </div>
          </div>
        </div>

        {budgetAmount > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted">Tiến độ chi tiêu</span>
              <span style={{ color: getProgressColor(), fontWeight: 'bold' }}>
                {Math.round(rawPercent)}%
              </span>
            </div>
            <div className="w-full bg-main rounded-full h-4" style={{ background: 'var(--bg-main)', overflow: 'hidden' }}>
              <div 
                className="h-4 rounded-full transition-all duration-1000 ease-out" 
                style={{ 
                  width: `${percent}%`, 
                  background: getProgressColor() 
                }}
              ></div>
            </div>
            {rawPercent > 100 && (
              <p className="text-danger text-sm mt-2 flex items-center gap-1">
                <AlertCircle size={14} /> Bạn đã chi tiêu vượt quá hạn mức {formatCurrency(Math.abs(remaining))}!
              </p>
            )}
          </div>
        )}
        
        {budgetAmount === 0 && (
          <div className="text-center p-6 border-dashed border-2 rounded-lg" style={{ borderColor: 'var(--border)' }}>
            <Target size={48} className="mx-auto mb-4 text-muted" style={{ opacity: 0.5 }} />
            <p className="text-muted mb-4">Bạn chưa thiết lập ngân sách cho tháng này.</p>
            <button className="btn btn-primary mx-auto" onClick={() => setIsEditing(true)}>
              Thiết lập ngay
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Budgets;
