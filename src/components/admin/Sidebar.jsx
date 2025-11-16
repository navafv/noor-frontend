import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx'; // <-- FIX
import {
  LayoutDashboard, Inbox, Users, CheckSquare, Book, DollarSign, Package,
  LogOut, X, Settings, Briefcase, ReceiptText, BarChart2, Bell, PieChart,
  Award, Shield, Send, History, Library, MessageSquare, Calendar,
  Star, Banknote // <-- NEW
} from 'lucide-react';

const NavItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `flex items-center gap-3 rounded-lg px-3 py-2 transition-all 
      ${
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
      }`
    }
  >
    <Icon className="h-4 w-4" />
    {label}
  </NavLink>
);

function Sidebar({ onClose }) {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };
  
  return (
    <div className="flex h-full max-h-screen flex-col gap-2 bg-card text-card-foreground border-r border-border">
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-border px-6">
        <Link to="/admin/dashboard" className="flex items-center gap-2 font-semibold">
          <span className="logo text-2xl text-primary">Noor Institute</span>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-md text-muted-foreground hover:bg-accent"
          aria-label="Close sidebar"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="grid items-start gap-1 p-4 text-sm font-medium">
          <NavItem to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/admin/messages" icon={MessageSquare} label="Inbox" />
          <NavItem to="/admin/calendar" icon={Calendar} label="Calendar" /> 
          <NavItem to="/admin/attendance" icon={CheckSquare} label="Attendance" />
          <NavItem to="/admin/analytics" icon={BarChart2} label="Financial Chart" />
          <NavItem to="/admin/reports/finance" icon={Banknote} label="Financial Reports" /> {/* <-- NEW */}
          <NavItem to="/admin/attendance-analytics" icon={PieChart} label="Attendance Analytics" />
          <NavItem to="/admin/notifications" icon={Bell} label="Notifications" />
          <NavItem to="/admin/enquiries" icon={Inbox} label="Enquiries" />
          <NavItem to="/admin/students" icon={Users} label="Students" />
          <NavItem to="/admin/feedback" icon={Star} label="Feedback" />
          <NavItem to="/admin/courses" icon={Book} label="Courses" />
          <NavItem to="/admin/materials" icon={Library} label="Course Materials" />
          <NavItem to="/admin/certificates" icon={Award} label="Certificates" />
          <NavItem to="/admin/reminders" icon={Send} label="Fee Reminders" />
          <NavItem to="/admin/expenses" icon={DollarSign} label="Expenses" />
          <NavItem to="/admin/receipts" icon={ReceiptText} label="Receipts" />
          <NavItem to="/admin/stock" icon={Package} label="Stock" />
          <NavItem to="/admin/payroll" icon={Briefcase} label="Payroll" />
          <NavItem to="/admin/users" icon={Users} label="User Accounts" />
          <NavItem to="/admin/roles" icon={Shield} label="Roles" />
          <li className="px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">
            Audit Logs
          </li>
          <NavItem to="/admin/history/students" icon={History} label="Student History" />
          <NavItem to="/admin/history/users" icon={History} label="User History" />
        </nav>
      </div>
      
      {/* Footer */}
      <div className="mt-auto border-t border-border p-4">
        <nav className="grid gap-1">
          <NavItem to="/admin/account/settings" icon={Settings} label="Account Settings" />
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;