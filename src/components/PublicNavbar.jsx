import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle.jsx';

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `text-sm font-medium transition-colors
       ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`
    }
  >
    {children}
  </NavLink>
);

const MobileNavItem = ({ to, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `block px-4 py-3 rounded-md text-base font-medium
       ${isActive ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-accent'}`
    }
  >
    {children}
  </NavLink>
);

function PublicNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 h-20">
        
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2">
          <span className="logo text-3xl text-primary">Noor Stitching Institute</span>
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6">
          <NavItem to="/home">Home</NavItem>
          <NavItem to="/about">About Us</NavItem>
          <NavItem to="/courses">Courses</NavItem>
          <NavItem to="/contact">Contact</NavItem>
          <ThemeToggle />
          <Link to="/login" className="btn-primary">
            Student/Admin Login
          </Link>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-md text-muted-foreground hover:bg-accent"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu (Slide-out) */}
      <div
        className={`fixed inset-0 z-50 transform transition-transform
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          lg:hidden`}
      >
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/30" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
        {/* Menu Content */}
        <div className="fixed top-0 right-0 z-10 h-full w-full max-w-sm bg-card p-4">
          <div className="flex items-center justify-between h-16">
            <span className="logo text-2xl text-primary">Menu</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-md text-muted-foreground hover:bg-accent"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          <nav className="mt-4 flex flex-col gap-2">
            <MobileNavItem to="/home" onClick={() => setIsMobileMenuOpen(false)}>Home</MobileNavItem>
            <MobileNavItem to="/about" onClick={() => setIsMobileMenuOpen(false)}>About Us</MobileNavItem>
            <MobileNavItem to="/courses" onClick={() => setIsMobileMenuOpen(false)}>Courses</MobileNavItem>
            <MobileNavItem to="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</MobileNavItem>
            <div className="border-t border-border pt-4 mt-4">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-primary w-full"
              >
                Student/Admin Login
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default PublicNavbar;