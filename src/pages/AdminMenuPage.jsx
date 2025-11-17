import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, FileText, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminMenuPage = () => {
  const { user, logout } = useAuth();

  const MenuLink = ({ icon: Icon, label, to, color = "text-gray-600" }) => (
    <Link to={to} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm active:scale-[0.98] transition-transform">
      <div className="flex items-center gap-3">
        <div className={`p-2 bg-gray-50 rounded-xl ${color}`}>
          <Icon size={20} />
        </div>
        <span className="font-medium text-gray-900">{label}</span>
      </div>
      <ChevronRight size={20} className="text-gray-300" />
    </Link>
  );

  return (
    <div className="space-y-6 pb-20">
      {/* Profile Summary */}
      <div className="flex items-center gap-4 p-4 bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-2xl font-bold">
          {user?.first_name?.[0] || 'A'}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{user?.first_name} {user?.last_name}</h2>
          <p className="text-sm text-gray-500">Administrator</p>
        </div>
      </div>

      {/* Menu Options */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1">Management</h3>
        {/* You need to add this route to App.jsx */}
        <MenuLink icon={FileText} label="Course Materials" to="/admin/materials" color="text-purple-600" />
        
        {/* Placeholder for Profile Settings if needed */}
        <MenuLink icon={User} label="Account Settings" to="/admin/profile" color="text-blue-600" />
      </div>

      {/* Logout */}
      <button 
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl font-semibold hover:bg-red-100 transition-colors mt-8"
      >
        <LogOut size={20} />
        Sign Out
      </button>
    </div>
  );
};

export default AdminMenuPage;