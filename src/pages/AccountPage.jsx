import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { User, Settings, LogOut, ChevronRight, Inbox, Users } from 'lucide-react';

/**
 * Main Account screen.
 * Shows user info and navigation options based on their role.
 */
function AccountPage() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    // Navigate is handled by context, but we could force it here if needed
    // navigate('/login'); 
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || user?.username[0].toUpperCase() || '?';
  };

  return (
    <div className="p-4 pb-20 max-w-2xl mx-auto">
      {/* User Profile Header */}
      <div className="flex items-center space-x-4 mb-8">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-noor-primary/10">
          <span className="text-2xl font-medium text-noor-primary">
            {getInitials(user?.first_name, user?.last_name)}
          </span>
        </span>
        <div>
          <h1 className="text-xl font-bold text-noor-heading">
            {user?.first_name || user?.username}
          </h1>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <span className="inline-flex items-center rounded-full bg-noor-primary/10 px-2.5 py-0.5 text-xs font-medium text-noor-primary mt-2">
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
              <AdminLink
                to="/admin/enquiries"
                icon={Inbox}
                title="Manage Enquiries"
                subtitle="Review and convert new enquiries"
              />
              <AdminLink
                to="/admin/students"
                icon={Users}
                title="Manage Students"
                subtitle="View all registered students"
              />
              {/* Add more admin links here */}
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
              to="/account/settings" // Example link
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

/**
 * Reusable link component for the lists
 */
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