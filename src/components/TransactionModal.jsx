import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { X } from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const INCOME_CATEGORIES = ['Lương', 'Thưởng', 'Kinh doanh', 'Khác'];
const EXPENSE_CATEGORIES = ['Ăn uống', 'Mua sắm', 'Hóa đơn', 'Giải trí', 'Y tế', 'Giáo dục', 'Khác'];

const TransactionModal = ({ isOpen, onClose }) => {
  const { addTransaction } = useFinance();
  
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [date, setDate] = useState(new Date());
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const rawAmount = Number(amount.replace(/\D/g, ''));
    if (!rawAmount || isNaN(rawAmount)) return;
    
    addTransaction({
      type,
      amount: rawAmount,
      category,
      date: date.toISOString(),
      note
    });
    
    // Reset form
    setAmount('');
    setNote('');
    onClose();
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(newType === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
  };

  const handleAmountChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    if (!rawValue) {
      setAmount('');
      return;
    }
    const formatted = new Intl.NumberFormat('vi-VN').format(parseInt(rawValue, 10));
    setAmount(formatted);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3>Thêm giao dịch mới</h3>
          <button className="btn-icon" onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex gap-4 mb-6">
            <button
              type="button"
              className={`btn flex-1 ${type === 'expense' ? 'btn-primary' : 'btn-outline'}`}
              style={type === 'expense' ? { background: 'var(--danger)' } : {}}
              onClick={() => handleTypeChange('expense')}
            >
              Khoản Chi
            </button>
            <button
              type="button"
              className={`btn flex-1 ${type === 'income' ? 'btn-primary' : 'btn-outline'}`}
              style={type === 'income' ? { background: 'var(--success)' } : {}}
              onClick={() => handleTypeChange('income')}
            >
              Khoản Thu
            </button>
          </div>

          <div className="form-group">
            <label className="form-label">Số tiền (VNĐ)</label>
            <input
              type="text"
              inputMode="numeric"
              className="form-control"
              value={amount}
              onChange={handleAmountChange}
              placeholder="VD: 100.000"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Danh mục</label>
            <select
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {(type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(cat => (
                <option key={cat} value={cat} style={{ color: '#000' }}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group date-picker-wrapper">
            <label className="form-label">Ngày giao dịch</label>
            <DatePicker
              selected={date}
              onChange={(d) => setDate(d)}
              dateFormat="dd/MM/yyyy"
              className="form-control w-full"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Ghi chú (Tùy chọn)</label>
            <input
              type="text"
              className="form-control"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Chi tiết giao dịch"
            />
          </div>

          <div className="mt-6">
            <button type="submit" className="btn btn-primary w-full" style={{ padding: '0.75rem' }}>
              Lưu giao dịch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
