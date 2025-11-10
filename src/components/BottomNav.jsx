/* UPDATED FILE: src/components/BottomNav.jsx */
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, User, Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext.jsx';

// This helper component makes the links smart (shows active state)
const NavItem = ({ to, icon: Icon, label }) => {
  return (
    <NavLink
      to={to}
      end // Add 'end' prop to prevent parent routes from matching
      className={({ isActive }) =>
        `flex flex-1 flex-col items-center justify-center gap-0.5 pt-2 pb-1 transition-colors ${
          isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
        }`
      }
    >
      <Icon size={24} />
      <span className="text-xs font-medium">{label}</span>
    </NavLink>
  );
};

function BottomNav() {
  const { user } = useAuth();
  
  // Conditionally set the home path
  // This component is only seen by students, so this logic is simple.
  const homePath = "/student/dashboard";
  const accountPath = "/account";
  const notificationsPath = "/notifications";

  return (
    <nav className="fixed bottom-0 z-10 w-full border-t border-border bg-card shadow-inner">
      <div className="mx-auto flex h-16 max-w-lg items-stretch">
        <NavItem to={homePath} icon={Home} label="Home" />
        <NavItem to={notificationsPath} icon={Bell} label="Updates" />
        <NavItem to={accountPath} icon={User} label="Account" />
      </div>
    </nav>
  );
}

export default BottomNav;