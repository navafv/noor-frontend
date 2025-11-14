import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Inbox, Users, CheckSquare, Book, DollarSign,
  Package, LogOut, Settings, Briefcase, ReceiptText, BarChart2,
  Bell, PieChart, Award, Shield, Send, History, Library, User,
  MessageSquare, Calendar // <-- NEW ICON
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext.jsx';
import PageHeader from '@/components/PageHeader.jsx';

function AdminMenuPage() {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div className="flex h-full flex-col">
      <div className="lg:hidden">
        <PageHeader title="Menu" />
      </div>
      
      <main className="flex-1 overflow-y-auto bg-background p-4 max-w-lg mx-auto pb-20">
        <nav>
          <ul className="grid grid-cols-2 gap-3">
            <MenuCard to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <MenuCard to="/admin/messages" icon={MessageSquare} label="Inbox" />
            <MenuCard to="/admin/calendar" icon={Calendar} label="Calendar" /> {/* <-- NEW LINK */}
            <MenuCard to="/admin/attendance" icon={CheckSquare} label="Attendance" />
            <MenuCard to="/admin/analytics" icon={BarChart2} label="Financials" />
            <MenuCard to="/admin/attendance-analytics" icon={PieChart} label="Attendance" />
            <MenuCard to="/admin/enquiries" icon={Inbox} label="Enquiries" />
            <MenuCard to="/admin/students" icon={Users} label="Students" />
            <MenuCard to="/admin/courses" icon={Book} label="Courses" />
            <MenuCard to="/admin/materials" icon={Library} label="Materials" />
            <MenuCard to="/admin/certificates" icon={Award} label="Certificates" />
            <MenuCard to="/admin/reminders" icon={Send} label="Reminders" />
            <MenuCard to="/admin/expenses" icon={DollarSign} label="Expenses" />
            <MenuCard to="/admin/receipts" icon={ReceiptText} label="Receipts" />
            <MenuCard to="/admin/stock" icon={Package} label="Stock" />
            <MenuCard to="/admin/payroll" icon={Briefcase} label="Payroll" />
            <MenuCard to="/admin/users" icon={Users} label="User Accounts" />
            <MenuCard to="/admin/roles" icon={Shield} label="Roles" />
            <MenuCard to="/admin/history/students" icon={History} label="Student History" />
            <MenuCard to="/admin/history/users" icon={History} label="User History" />
            <MenuCard to="/admin/notifications" icon={Bell} label="Notifications" />
            <MenuCard to="/admin/account" icon={User} label="Account" />
          </ul>

          <button
            onClick={handleLogout}
            className="w-full btn btn-destructive mt-6 flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </main>
    </div>
  );
}

const MenuCard = ({ to, icon: Icon, label }) => (
  <li>
    <Link
      to={to}
      className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg hover:bg-accent text-foreground card h-full"
    >
      <Icon size={28} className="text-primary" />
      <span className="font-medium text-center text-sm">{label}</span>
    </Link>
  </li>
);

export default AdminMenuPage;