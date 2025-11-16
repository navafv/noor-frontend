import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext.jsx'; 
import {
  Inbox, Users, CheckSquare, Book, DollarSign,
  Package, Settings, Briefcase, ReceiptText, BarChart2, Bell, PieChart,
  Award, Shield, Send, History, Library, MessageSquare,
  Calendar, LogOut, Star,
  Banknote // <-- NEW
} from 'lucide-react';

const MenuItem = ({ to, icon: Icon, label, onClick }) => ( 
  <Link
    to={to}
    onClick={onClick} 
    className="flex flex-col items-center justify-center p-4 bg-card rounded-lg shadow-sm border border-border gap-2 text-center"
  >
    <Icon className="w-6 h-6 text-primary" />
    <span className="text-xs font-medium text-foreground">{label}</span>
  </Link>
);

function AdminMenuPage() {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logoutUser();
    navigate('/login');
  };

  return (
    <main className="p-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-6">Menu</h1>
        
        {/* Main Grid */}
        <div className="grid grid-cols-3 gap-3">
          <MenuItem to="/admin/messages" icon={MessageSquare} label="Inbox" />
          <MenuItem to="/admin/calendar" icon={Calendar} label="Calendar" />
          <MenuItem to="/admin/attendance" icon={CheckSquare} label="Attendance" />
          <MenuItem to="/admin/enquiries" icon={Inbox} label="Enquiries" />
          <MenuItem to="/admin/students" icon={Users} label="Students" />
          <MenuItem to="/admin/feedback" icon={Star} label="Feedback" /> 
          <MenuItem to="/admin/courses" icon={Book} label="Courses" />
          <MenuItem to="/admin/materials" icon={Library} label="Materials" />
          <MenuItem to="/admin/certificates" icon={Award} label="Certificates" />
          <MenuItem to="/admin/receipts" icon={ReceiptText} label="Receipts" />
          <MenuItem to="/admin/expenses" icon={DollarSign} label="Expenses" />
          <MenuItem to="/admin/stock" icon={Package} label="Stock" />
          <MenuItem to="/admin/payroll" icon={Briefcase} label="Payroll" />
          <MenuItem to="/admin/users" icon={Users} label="Users" />
          <MenuItem to="/admin/roles" icon={Shield} label="Roles" />
          <MenuItem to="/admin/notifications" icon={Bell} label="Notify" />
        </div>

        {/* Analytics Section */}
        <h2 className="text-lg font-semibold text-foreground mt-8 mb-4">Analytics & Logs</h2>
        <div className="grid grid-cols-3 gap-3"> {/* <-- Updated grid-cols-3 */}
          <MenuItem to="/admin/analytics" icon={BarChart2} label="Finance Chart" />
          <MenuItem to="/admin/reports/finance" icon={Banknote} label="Finance Reports" /> {/* <-- NEW */}
          <MenuItem to="/admin/attendance-analytics" icon={PieChart} label="Attendance" />
          <MenuItem to="/admin/reminders" icon={Send} label="Fee Reminders" />
          <MenuItem to="/admin/history/students" icon={History} label="Student History" />
        </div>

        {/* --- NEW: Logout Section --- */}
        <div className="mt-8">
          <MenuItem
            to="#"
            icon={LogOut}
            label="Log Out"
            onClick={handleLogout}
          />
        </div>
      </div>
    </main>
  );
}

export default AdminMenuPage;