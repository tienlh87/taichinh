import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ReceiptText, PieChart, Wallet, Target } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="flex items-center gap-2 mb-6 text-lg font-bold" style={{ padding: '0 1rem' }}>
        <Wallet className="text-primary" />
        <span>FamilyFinance</span>
      </div>
      
      <nav className="flex-col">
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          <LayoutDashboard size={20} />
          <span>Tổng quan</span>
        </NavLink>
        
        <NavLink 
          to="/transactions" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          <ReceiptText size={20} />
          <span>Giao dịch</span>
        </NavLink>
        
        <NavLink 
          to="/budgets" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          <Target size={20} />
          <span>Ngân sách</span>
        </NavLink>
        
        <NavLink 
          to="/reports" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          <PieChart size={20} />
          <span>Báo cáo</span>
        </NavLink>
      </nav>

      <div className="mt-auto" style={{ padding: '0 1rem' }}>
        <div className="text-sm text-muted">
          <p>Phiên bản 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
