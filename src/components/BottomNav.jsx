import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, User, Bell } from 'lucide-react';

// This helper component makes the links smart (shows active state)
const NavItem = ({ to, icon: Icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-1 flex-col items-center justify-center gap-0.5 pt-2 pb-1 ${
          isActive ? 'text-noor-pink' : 'text-gray-500'
        }`
      }
    >
      <Icon size={24} />
      <span className="text-xs font-medium">{label}</span>
    </NavLink>
  );
};

function BottomNav() {
  return (
    <nav className="fixed bottom-0 z-10 w-full border-t bg-white shadow-inner">
      {/* We use max-w-lg and mx-auto to center the nav on large screens,
          making it feel more like a mobile app. */}
      <div className="mx-auto flex h-16 max-w-lg items-stretch">
        <NavItem to="/" icon={Home} label="Home" />
        <NavItem to="/notifications" icon={Bell} label="Updates" />
        <NavItem to="/account" icon={User} label="Account" />
      </div>
    </nav>
  );
}

export default BottomNav;