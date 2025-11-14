import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  LayoutDashboard,
  CheckSquare,
  DollarSign,
  Award,
  Library,
  MessageSquare,
  Calendar,
  LogOut,
  Settings,
  User,
  X
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

function StudentSidebar({ onClose }) {
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
    <div className="flex h-full max-h-screen flex-col gap-2 bg-card text-card-foreground border-r border-border">
      <div className="flex h-16 items-center justify-between border-b border-border px-6">
        <Link to="/student/dashboard" className="flex items-center gap-2 font-semibold">
          <span className="logo text-2xl text-primary">Noor Institute</span>
        </Link>
        {/* This button is for tablet pop-out, not mobile */}
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-md text-muted-foreground hover:bg-accent"
          aria-label="Close sidebar"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="grid items-start gap-1 p-4 text-sm font-medium">
          <NavItem to="/student/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/student/calendar" icon={Calendar} label="Calendar" />
          <NavItem to="/student/attendance" icon={CheckSquare} label="My Attendance" />
          <NavItem to="/student/finance" icon={DollarSign} label="My Finance" />
          <NavItem to="/student/certificates" icon={Award} label="My Certificates" />
          <NavItem to="/student/materials" icon={Library} label="Course Materials" />
          <NavItem to="/student/messages" icon={MessageSquare} label="Support Chat" />
        </nav>
      </div>
      <div className="mt-auto border-t border-border p-4">
        {/* Profile Info */}
        <Link to="/account" className="flex items-center gap-3 rounded-lg px-3 py-3 mb-2 transition-all hover:bg-accent">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <span className="text-sm font-medium text-primary">
              {getInitials(user?.first_name, user?.last_name)}
            </span>
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">{user?.first_name || user?.username}</p>
            <p className="text-xs text-muted-foreground">{user?.student?.reg_no || 'Student'}</p>
          </div>
        </Link>
        {/* Bottom Nav Links */}
        <nav className="grid gap-1">
          <NavItem to="/student/account/settings" icon={Settings} label="Account Settings" />
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

export default StudentSidebar;