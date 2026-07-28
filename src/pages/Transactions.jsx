import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/format';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Trash2, Search, Filter } from 'lucide-react';

const Transactions = () => {
  const { transactions, deleteTransaction } = useFinance();
  const [filter, setFilter] = useState('all'); // all, income, expense

  const filteredTransactions = transactions
    .filter(t => filter === 'all' ? true : t.type === filter)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="animate-pulse" style={{ animation: 'fadeIn 0.5s ease' }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2>Lịch sử Giao dịch</h2>
          <p className="text-muted">Quản lý chi tiết các khoản thu chi của bạn.</p>
        </div>
        
        <div className="flex gap-2">
          <select 
            className="form-control" 
            style={{ width: 'auto', padding: '0.5rem 1rem' }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Tất cả giao dịch</option>
            <option value="income">Chỉ Thu</option>
            <option value="expense">Chỉ Chi</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: '0' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-muted)' }}>Ngày</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-muted)' }}>Danh mục</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-muted)' }}>Ghi chú</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-muted)' }}>Số tiền</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-muted)', textAlign: 'right' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted" style={{ padding: '2rem' }}>
                    Không tìm thấy giao dịch nào.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map(t => (
                  <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }} className="hover:bg-white/5">
                    <td style={{ padding: '1rem 1.5rem' }}>
                      {format(new Date(t.date), 'dd/MM/yyyy')}
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span className={`badge ${t.type === 'income' ? 'badge-success' : 'badge-danger'}`}>
                        {t.category}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }} className="text-muted">
                      {t.note || '-'}
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }} className={`font-medium ${t.type === 'income' ? 'text-success' : 'text-danger'}`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <button 
                        className="btn-icon" 
                        style={{ color: 'var(--text-muted)', background: 'transparent', border: 'none' }}
                        onClick={() => {
                          if(window.confirm('Bạn có chắc muốn xóa giao dịch này?')) {
                            deleteTransaction(t.id);
                          }
                        }}
                      >
                        <Trash2 size={18} className="hover:text-danger" style={{ cursor: 'pointer' }}/>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
