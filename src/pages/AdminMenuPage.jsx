import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, FileText, ChevronRight, TrendingDown, AlertCircle, BarChart2, Users, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminMenuPage = () => {
  const { user, logout } = useAuth();

  const MenuLink = ({ icon: Icon, label, to, color = "text-gray-600", bgColor = "bg-gray-50" }) => (
    <Link to={to} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm active:scale-[0.98] transition-transform">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${bgColor} ${color}`}>
          <Icon size={20} />
        </div>
        <span className="font-medium text-gray-900">{label}</span>
      </div>
      <ChevronRight size={20} className="text-gray-300" />
    </Link>
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-4 p-4 bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-2xl font-bold">
          {user?.first_name?.[0] || 'A'}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{user?.first_name} {user?.last_name}</h2>
          <p className="text-sm text-gray-500">Administrator</p>
          <Link to="/admin/profile" className="text-xs text-primary-600 font-semibold mt-1 block">Account Settings</Link>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1">Analytics</h3>
        <MenuLink icon={BarChart2} label="Finance Overview" to="/admin/finance-stats" color="text-green-600" bgColor="bg-green-50" />
        <MenuLink icon={Users} label="Attendance Stats" to="/admin/attendance-stats" color="text-blue-600" bgColor="bg-blue-50" />

        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1 mt-6">Management</h3>
        <MenuLink icon={Shield} label="Staff Management" to="/admin/staff" color="text-purple-600" bgColor="bg-purple-50" />
        <MenuLink icon={TrendingDown} label="Manage Expenses" to="/admin/expenses" color="text-red-600" bgColor="bg-red-50" />
        <MenuLink icon={AlertCircle} label="Outstanding Fees" to="/admin/outstanding" color="text-orange-600" bgColor="bg-orange-50" />

        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1 mt-6">Academic</h3>
        <MenuLink icon={FileText} label="Course Materials" to="/admin/materials" color="text-indigo-600" bgColor="bg-indigo-50" />
        <MenuLink icon={FileText} label="Certificates" to="/admin/certificates" color="text-yellow-600" bgColor="bg-yellow-50" />
      </div>

      <button 
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 p-4 bg-gray-100 text-gray-600 rounded-2xl font-semibold hover:bg-gray-200 transition-colors mt-8 cursor-pointer"
      >
        <LogOut size={20} />
        Sign Out
      </button>
    </div>
  );
};

export default AdminMenuPage;