import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  LogOut,
  X,
  Settings,
  Bell,
  Book,
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

function TeacherSidebar({ onClose }) {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };
  
  return (
    <div className="flex h-full max-h-screen flex-col gap-2 bg-card text-card-foreground border-r border-border">
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-border px-6">
        <Link to="/teacher/dashboard" className="flex items-center gap-2 font-semibold">
          <span className="logo text-2xl text-primary">Noor Institute</span>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-md text-muted-foreground hover:bg-accent"
          aria-label="Close sidebar"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="grid items-start gap-1 p-4 text-sm font-medium">
          <NavItem to="/teacher/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/teacher/attendance" icon={CheckSquare} label="Take Attendance" />
          <NavItem to="/teacher/my-batches" icon={Book} label="My Batches" />
          <NavItem to="/teacher/notifications" icon={Bell} label="Notifications" />
        </nav>
      </div>
      
      {/* Footer */}
      <div className="mt-auto border-t border-border p-4">
        <nav className="grid gap-1">
          <NavItem to="/teacher/account/settings" icon={Settings} label="Account Settings" />
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

export default TeacherSidebar;