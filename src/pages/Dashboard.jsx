import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/format';
import { TrendingUp, TrendingDown, Wallet, ArrowRight, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const Dashboard = () => {
  const { totalIncome, totalExpense, balance, transactions, budgets } = useFinance();

  // Get recent 5 transactions
  const recentTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  const currentMonthKey = new Date().toISOString().slice(0, 7);
  const currentBudget = budgets[currentMonthKey] || 0;
  
  const currentMonthExpenses = transactions
    .filter(t => t.type === 'expense' && t.date.startsWith(currentMonthKey))
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const isOverBudget = currentBudget > 0 && currentMonthExpenses > currentBudget;

  return (
    <div className="animate-pulse" style={{ animation: 'fadeIn 0.5s ease' }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2>Tổng quan Tài chính</h2>
          <p className="text-muted">Xin chào, đây là tình hình tài chính của gia đình bạn.</p>
        </div>
      </div>

      {isOverBudget && (
        <div className="mb-6 p-4 rounded-lg flex items-center gap-4" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', color: 'var(--text-main)' }}>
          <div className="p-2 rounded-full" style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <h4 className="font-bold text-danger mb-1">Cảnh báo Vượt Ngân Sách!</h4>
            <p className="text-sm">Bạn đã chi tiêu <strong className="text-danger">{formatCurrency(currentMonthExpenses)}</strong> trong khi ngân sách tháng này chỉ có <strong>{formatCurrency(currentBudget)}</strong>. Hãy cân đối lại các khoản chi hoặc xem xét <Link to="/budgets" className="text-primary underline">điều chỉnh ngân sách</Link>!</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="card flex flex-col justify-between" style={{ background: 'linear-gradient(135deg, var(--bg-card), rgba(99, 102, 241, 0.1))' }}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-muted text-sm uppercase tracking-wider">Tổng số dư</h3>
            <div className="btn-icon" style={{ background: 'var(--primary-glow)' }}>
              <Wallet className="text-primary" size={20} />
            </div>
          </div>
          <h2 className="font-bold" style={{ fontSize: '2rem' }}>{formatCurrency(balance)}</h2>
        </div>

        <div className="card flex flex-col justify-between" style={{ background: 'linear-gradient(135deg, var(--bg-card), var(--success-bg))' }}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-muted text-sm uppercase tracking-wider">Tổng thu</h3>
            <div className="btn-icon" style={{ background: 'var(--success-bg)' }}>
              <TrendingUp className="text-success" size={20} />
            </div>
          </div>
          <h2 className="font-bold text-success" style={{ fontSize: '1.75rem' }}>{formatCurrency(totalIncome)}</h2>
        </div>

        <div className="card flex flex-col justify-between" style={{ background: 'linear-gradient(135deg, var(--bg-card), var(--danger-bg))' }}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-muted text-sm uppercase tracking-wider">Tổng chi</h3>
            <div className="btn-icon" style={{ background: 'var(--danger-bg)' }}>
              <TrendingDown className="text-danger" size={20} />
            </div>
          </div>
          <h2 className="font-bold text-danger" style={{ fontSize: '1.75rem' }}>{formatCurrency(totalExpense)}</h2>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="flex justify-between items-center mb-4">
            <h3>Giao dịch gần đây</h3>
            <Link to="/transactions" className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
              Xem tất cả <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="flex flex-col gap-2">
            {recentTransactions.length === 0 ? (
              <p className="text-muted text-center py-6">Chưa có giao dịch nào.</p>
            ) : (
              recentTransactions.map(t => (
                <div key={t.id} className="flex justify-between items-center p-3 rounded" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <div className="flex items-center gap-4">
                    <div className="btn-icon" style={{ background: t.type === 'income' ? 'var(--success-bg)' : 'var(--danger-bg)' }}>
                      {t.type === 'income' ? <TrendingUp className="text-success" size={16} /> : <TrendingDown className="text-danger" size={16} />}
                    </div>
                    <div>
                      <p className="font-medium">{t.category}</p>
                      <p className="text-xs text-muted">
                        {format(new Date(t.date), 'dd MMM yyyy', { locale: vi })} {t.note && `- ${t.note}`}
                      </p>
                    </div>
                  </div>
                  <div className={`font-bold ${t.type === 'income' ? 'text-success' : 'text-danger'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="card">
          <h3>Mẹo tài chính</h3>
          <p className="text-sm text-muted mt-2 mb-4">Một số lời khuyên để quản lý tài chính gia đình tốt hơn:</p>
          <ul className="text-sm text-muted flex flex-col gap-3" style={{ paddingLeft: '1.25rem' }}>
            <li>Lập ngân sách chi tiêu hàng tháng cho từng danh mục.</li>
            <li>Dành ra ít nhất 20% thu nhập cho quỹ tiết kiệm & đầu tư.</li>
            <li>Ghi chép giao dịch hàng ngày để không bỏ sót.</li>
            <li>Trao đổi thẳng thắn về tài chính giữa các thành viên.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
