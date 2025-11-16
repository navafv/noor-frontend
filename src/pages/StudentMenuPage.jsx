import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  User,
  Settings,
  Bell,
  LogOut,
  ChevronRight,
  Calendar,
  MessageSquare
} from 'lucide-react';

const MenuItem = ({ to, icon: Icon, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center justify-between p-4 bg-card rounded-lg shadow-sm border border-border"
  >
    <div className="flex items-center gap-4">
      <Icon className="w-5 h-5 text-primary" />
      <span className="text-base font-medium text-foreground">{label}</span>
    </div>
    <ChevronRight className="w-5 h-5 text-muted-foreground" />
  </Link>
);

function StudentMenuPage() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || user?.username[0].toUpperCase() || '?';
  };

  return (
    <main className="p-4">
      <div className="max-w-lg mx-auto">
        {/* Profile Card */}
        <Link to="/account">
          <div className="flex items-center gap-4 p-4 bg-card rounded-lg shadow-sm border border-border mb-6">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <span className="text-2xl font-medium text-primary">
                {getInitials(user?.first_name, user?.last_name)}
              </span>
            </span>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {user?.first_name} {user?.last_name}
              </h1>
              <p className="text-sm text-muted-foreground">
                Reg No: {user?.student?.reg_no || '...'}
              </p>
            </div>
          </div>
        </Link>
        
        {/* Menu Items */}
        <div className="space-y-3">
          <MenuItem to="/account" icon={User} label="My Profile" />
          <MenuItem to="/student/calendar" icon={Calendar} label="Institute Calendar" />
          <MenuItem to="/student/messages" icon={MessageSquare} label="Support Chat" />
          <MenuItem to="/notifications" icon={Bell} label="Notifications" />
          <MenuItem to="/student/account/settings" icon={Settings} label="Settings" />
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

export default StudentMenuPage;