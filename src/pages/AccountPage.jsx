import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Settings, LogOut, ChevronRight, BarChart2, LayoutDashboard, Shield, LifeBuoy } from 'lucide-react';
import PageHeader from '@/components/PageHeader.jsx'; 
import { useResponsive } from '../hooks/useResponsive.js'; // <-- IMPORT

function AccountPage() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const { isMobile } = useResponsive(); // <-- USE HOOK

  const handleLogout = () => {
    // ... (no change)
    logoutUser();
    navigate('/login');
  };

  const getInitials = (firstName, lastName) => {
    // ... (no change)
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || user?.username[0].toUpperCase() || '?';
  };

  // Determine paths based on role
  const settingsPath = user?.is_staff ? "/admin/account/settings" : "/student/account/settings";
  const dashboardPath = user?.is_staff ? "/admin/dashboard" : "/student/dashboard";
  const dashboardTitle = user?.is_staff ? "Admin Dashboard" : "My Dashboard";
  const dashboardSubtitle = user?.is_staff ? "Manage institute" : "View your progress";
  const dashboardIcon = user?.is_staff ? BarChart2 : LayoutDashboard;

  if (!user) {
    return <PageHeader title="Account" />; // Show header even if loading
  }

  return (
    <>
      {/* --- UPDATED: Only show on mobile --- */}
      {isMobile && <PageHeader title="My Account" showBackButton={false} />}
      
      <div className="p-4 lg:p-8 max-w-lg mx-auto pb-20">
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

        {/* Navigation List */}
        <div className="card overflow-hidden">
          <ul className="divide-y divide-border">
            
            {/* Dashboard Link (only show if not on mobile) */}
            <li className="lg:hidden">
              <AppLink
                to={dashboardPath}
                icon={dashboardIcon}
                title={dashboardTitle}
                subtitle={dashboardSubtitle}
              />
            </li>
            
            {/* Account Settings */}
            <AppLink
              to={settingsPath}
              icon={Settings}
              title="Account Settings"
              subtitle="Update profile & photo"
            />

            {/* Security */}
            <AppLink
              to={settingsPath} // Links to same page, but different section
              icon={Shield}
              title="Security"
              subtitle="Change your password"
            />

            {/* Help */}
            <AppLink
              to="/contact" // Links to public contact page
              icon={LifeBuoy}
              title="Help & Contact"
              subtitle="Get help or contact support"
            />
          </ul>
        </div>

        {/* Logout Button */}
        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 text-left p-4 card text-red-600 font-medium hover:bg-destructive/10 transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

const AppLink = ({ to, icon: Icon, title, subtitle }) => (
  // ... (no change)
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