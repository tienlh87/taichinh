import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/format';
import { format } from 'date-fns';
import { Download } from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#10B981', '#F59E0B', '#EF4444', '#ec4899', '#06b6d4'];

const Reports = () => {
  const { transactions } = useFinance();
  const [selectedMonth, setSelectedMonth] = useState('all');

  // Group all available months for the filter
  const availableMonths = useMemo(() => {
    const months = new Set();
    transactions.forEach(t => {
      const date = new Date(t.date);
      months.add(format(date, 'MM/yyyy'));
    });
    return Array.from(months).sort((a, b) => {
      const [mA, yA] = a.split('/');
      const [mB, yB] = b.split('/');
      return new Date(yB, mB - 1) - new Date(yA, mA - 1); // Sort descending
    });
  }, [transactions]);

  // Filter transactions for Pie chart
  const filteredTransactions = useMemo(() => {
    if (selectedMonth === 'all') return transactions;
    return transactions.filter(t => {
      return format(new Date(t.date), 'MM/yyyy') === selectedMonth;
    });
  }, [transactions, selectedMonth]);

  // Prepare data for Expense Pie Chart
  const expenses = filteredTransactions.filter(t => t.type === 'expense');
  const expenseByCategory = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const pieData = Object.keys(expenseByCategory).map(key => ({
    name: key,
    value: expenseByCategory[key]
  })).sort((a, b) => b.value - a.value);

  // Prepare data for Income vs Expense Bar Chart (Monthly)
  const monthlyData = useMemo(() => {
    const grouped = {};
    transactions.forEach(t => {
      const dateObj = new Date(t.date);
      const monthYear = format(dateObj, 'MM/yyyy');
      if (!grouped[monthYear]) {
        // Use the first day of the month for sorting timestamp
        grouped[monthYear] = { name: monthYear, Thu: 0, Chi: 0, timestamp: new Date(dateObj.getFullYear(), dateObj.getMonth(), 1).getTime() };
      }
      if (t.type === 'income') grouped[monthYear].Thu += t.amount;
      if (t.type === 'expense') grouped[monthYear].Chi += t.amount;
    });

    // Sort chronologically ascending for the bar chart
    return Object.values(grouped).sort((a, b) => a.timestamp - b.timestamp);
  }, [transactions]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="card" style={{ padding: '0.5rem 1rem', border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
          <p className="font-medium mb-1">{payload[0].payload.name}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.fill || 'var(--text-main)', margin: '0.25rem 0' }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) return alert('Không có dữ liệu để xuất!');
    
    // Create CSV header
    const headers = ['Ngày', 'Loại', 'Danh mục', 'Số tiền', 'Ghi chú'];
    
    // Create CSV rows
    const rows = transactions.map(t => [
      format(new Date(t.date), 'dd/MM/yyyy'),
      t.type === 'income' ? 'Thu' : 'Chi',
      t.category,
      t.amount,
      t.note ? `"${t.note.replace(/"/g, '""')}"` : '' // Escape quotes
    ]);
    
    // Combine and add BOM for UTF-8 Excel support
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    // Create Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bao_cao_tai_chinh_${format(new Date(), 'dd_MM_yyyy')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-pulse" style={{ animation: 'fadeIn 0.5s ease' }}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2>Báo cáo Phân tích</h2>
          <p className="text-muted">Trực quan hóa dữ liệu tài chính của bạn qua biểu đồ.</p>
        </div>
        <button className="btn btn-outline" onClick={handleExportCSV}>
          <Download size={18} /> Xuất Excel (CSV)
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="m-0" style={{ margin: 0 }}>Cơ cấu Chi tiêu</h3>
            <select 
              className="form-control" 
              style={{ width: 'auto', padding: '0.25rem 0.5rem', background: 'rgba(0,0,0,0.2)' }}
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="all" style={{ color: '#000' }}>Tất cả thời gian</option>
              {availableMonths.map(m => (
                <option key={m} value={m} style={{ color: '#000' }}>Tháng {m}</option>
              ))}
            </select>
          </div>
          
          {pieData.length === 0 ? (
            <p className="text-muted text-center py-10">Chưa có dữ liệu chi tiêu.</p>
          ) : (
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="mb-6 text-center">So sánh Thu & Chi theo Tháng</h3>
          {monthlyData.length === 0 ? (
            <p className="text-muted text-center py-10">Chưa có dữ liệu.</p>
          ) : (
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-muted)" />
                  <YAxis stroke="var(--text-muted)" tickFormatter={(value) => `${value / 1000000}M`} />
                  <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="Thu" fill="var(--success)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="Chi" fill="var(--danger)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
