import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Settings, LogOut, ChevronRight, BarChart2, LayoutDashboard } from 'lucide-react';
import PageHeader from '@/components/PageHeader.jsx'; // <-- Import new header

function AccountPage() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login'); // On logout, send to login
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || user?.username[0].toUpperCase() || '?';
  };

  // Determine settings path based on role
  const settingsPath = user?.is_staff ? "/admin/account/settings" : "/account/settings";
  
  if (!user) {
    return <PageHeader title="Account" />; // Show header even if loading
  }

  return (
    <>
      {/* --- ADD THIS HEADER --- */}
      <PageHeader title="My Account" showBackButton={false} />
      
      <div className="p-4 pb-20 max-w-lg mx-auto">
        {/* User Profile Header */}
        <div className="flex items-center space-x-4 mb-8">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <span className="text-2xl font-medium text-primary">
              {getInitials(user?.first_name, user?.last_name)}
            </span>
          </span>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {user?.first_name || user?.username}
            </h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary mt-2">
              {user?.role?.name || (user?.is_staff ? 'Staff' : 'Student')}
            </span>
          </div>
        </div>

        {/* Dashboard Link (Role-based) */}
        <div className="mb-8">
          <h2 className="text-xs font-semibold uppercase text-muted-foreground mb-3">
            Dashboard
          </h2>
          <div className="card overflow-hidden">
            {user?.is_staff ? (
              <AppLink
                to="/admin/dashboard"
                icon={BarChart2}
                title="Admin Dashboard"
                subtitle="Manage students, finance, and courses"
              />
            ) : (
              <AppLink
                to="/student/dashboard"
                icon={LayoutDashboard}
                title="My Dashboard"
                subtitle="View your courses and payments"
              />
            )}
          </div>
        </div>

        {/* General Settings Section */}
        <div className="mb-8">
          <h2 className="text-xs font-semibold uppercase text-muted-foreground mb-3">
            General
          </h2>
          <div className="card overflow-hidden">
            <ul className="divide-y divide-border">
              <AppLink
                to={settingsPath} // Use role-based path
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
          className="w-full flex items-center justify-center space-x-2 text-left p-4 card text-red-600 font-medium hover:bg-destructive/10 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </>
  );
}

const AppLink = ({ to, icon: Icon, title, subtitle }) => (
  <li>
    <Link to={to} className="block hover:bg-accent">
      <div className="flex items-center p-4">
        <div className="shrink-0">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1 px-4">
          <p className="truncate text-sm font-semibold text-foreground">
            {title}
          </p>
          <p className="mt-1 flex items-center text-sm text-muted-foreground">
            <span className="truncate">{subtitle}</span>
          </p>
        </div>
        <div className="shrink-0">
          <ChevronRight size={20} className="text-muted-foreground" />
        </div>
      </div>
    </Link>
  </li>
);

export default AccountPage;