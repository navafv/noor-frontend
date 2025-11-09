import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { User, Settings, LogOut, ChevronRight, Inbox, Users, BarChart2 } from 'lucide-react'; // Import BarChart2

/**
 * Main Account screen.
 */
function AccountPage() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || user?.username[0].toUpperCase() || '?';
  };

  if (!user) {
    return (
       <div className="flex h-screen items-center justify-center">Loading user data...</div>
    )
  }

  return (
    <div className="p-4 pb-20 max-w-2xl mx-auto">
      {/* User Profile Header */}
      <div className="flex items-center space-x-4 mb-8">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-noor-pink/10">
          <span className="text-2xl font-medium text-noor-pink">
            {getInitials(user?.first_name, user?.last_name)}
          </span>
        </span>
        <div>
          <h1 className="text-xl font-bold text-noor-heading">
            {user?.first_name || user?.username}
          </h1>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <span className="inline-flex items-center rounded-full bg-noor-pink/10 px-2.5 py-0.5 text-xs font-medium text-noor-pink mt-2">
            {user?.role?.name || 'Student'}
          </span>
        </div>
      </div>

      {/* Admin Tools Section (Staff Only) */}
      {user?.is_staff && (
        <div className="mb-8">
          <h2 className="text-xs font-semibold uppercase text-gray-500 mb-3">
            Admin Tools
          </h2>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {/* --- UPDATE THIS LINK --- */}
              <AdminLink
                to="/admin/dashboard"
                icon={BarChart2}
                title="Admin Dashboard"
                subtitle="View stats, manage enquiries, students"
              />
              {/* --- END OF UPDATE --- */}
            </ul>
          </div>
        </div>
      )}

      {/* General Settings Section */}
      <div className="mb-8">
        <h2 className="text-xs font-semibold uppercase text-gray-500 mb-3">
          General
        </h2>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <ul className="divide-y divide-gray-200">
            <AdminLink
              to="/account/settings"
              icon={Settings}
              title="Account Settings"
              subtitle="Update your profile information"
            />
          </ul>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center space-x-2 text-left p-4 bg-white rounded-xl shadow-sm text-red-600 font-medium hover:bg-red-50 transition-colors"
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </div>
  );
}

const AdminLink = ({ to, icon: Icon, title, subtitle }) => (
  <li>
    <Link to={to} className="block hover:bg-gray-50">
      <div className="flex items-center p-4">
        <div className="shrink-0">
          <Icon className="h-6 w-6 text-gray-400" />
        </div>
        <div className="min-w-0 flex-1 px-4">
          <p className="truncate text-sm font-semibold text-noor-heading">
            {title}
          </p>
          <p className="mt-1 flex items-center text-sm text-gray-500">
            <span className="truncate">{subtitle}</span>
          </p>
        </div>
        <div className="shrink-0">
          <ChevronRight size={20} className="text-gray-400" />
        </div>
      </div>
    </Link>
  </li>
);

export default AccountPage;