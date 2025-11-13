import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { LogOut, LayoutDashboard, DollarSign, Award, CheckSquare, Bell, Settings } from 'lucide-react';
import ThemeToggle from './ThemeToggle.jsx';

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `flex items-center h-full px-3 text-sm font-medium transition-colors border-b-2
      ${
        isActive 
          ? 'border-primary text-primary' 
          : 'border-transparent text-muted-foreground hover:text-foreground'
      }`
    }
  >
    {children}
  </NavLink>
);

function StudentDesktopNav() {
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
    <header className="sticky top-0 z-20 w-full bg-card shadow-sm border-b border-border">
      <nav className="mx-auto flex max-w-6xl items-center justify-between h-16 px-6">
        {/* Logo */}
        <Link to="/student/dashboard" className="text-3xl text-primary logo">
          Noor Stitching Institute
        </Link>
        
        {/* Nav Links */}
        <div className="flex h-full items-center space-x-4">
          <NavItem to="/student/dashboard">
            <LayoutDashboard size={18} className="mr-2" /> Dashboard
          </NavItem>
          <NavItem to="/student/attendance">
            <CheckSquare size={18} className="mr-2" /> Attendance
          </NavItem>
          <NavItem to="/student/finance">
            <DollarSign size={18} className="mr-2" /> My Finance
          </NavItem>
          <NavItem to="/student/certificates">
            <Award size={18} className="mr-2" /> My Certificates
          </NavItem>
        </div>
        
        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/notifications"
            className="p-2 text-muted-foreground hover:bg-accent rounded-full"
          >
            <Bell className="h-5 w-5" />
          </Link>
          
          <Link to="/account" className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <span className="text-sm font-medium text-primary">
                {getInitials(user?.first_name, user?.last_name)}
              </span>
            </span>
          </Link>
          
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-2 text-muted-foreground hover:bg-accent rounded-full"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </nav>
    </header>
  );
}

export default StudentDesktopNav;