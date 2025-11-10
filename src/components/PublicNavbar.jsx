import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { LogIn, User } from 'lucide-react';

function PublicNavbar() {
  const { user } = useAuth();
  
  // Role-aware account path
  const accountPath = user ? (user.is_staff ? '/admin/dashboard' : '/student/dashboard') : '/login';

  const NavItem = ({ to, children }) => (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `font-medium transition-colors ${
          isActive ? 'text-primary' : 'text-foreground hover:text-primary'
        }`
      }
    >
      {children}
    </NavLink>
  );

  return (
    <header className="sticky top-0 z-20 w-full bg-card shadow-sm border-b border-border">
      <nav className="mx-auto flex max-w-5xl items-center justify-between p-4">
        {/* Logo */}
        <Link to="/home" className="text-3xl text-primary logo">
          Noor Stitching Institute
        </Link>
        
        {/* Nav Links */}
        <div className="hidden md:flex items-center space-x-6">
          <NavItem to="/home">Home</NavItem>
          <NavItem to="/courses">Courses</NavItem>
          <NavItem to="/about">About Us</NavItem>
          <NavItem to="/contact">Contact</NavItem>
        </div>
        
        {/* Auth Button */}
        {user ? (
          <Link to={accountPath} className="btn-primary flex items-center gap-2">
            <User size={18} />
            My Account
          </Link>
        ) : (
          <Link to="/login" className="btn-primary flex items-center gap-2">
            <LogIn size={18} />
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}

export default PublicNavbar;