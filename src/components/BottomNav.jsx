/* UPDATED FILE: src/components/BottomNav.jsx */
import React from 'react';
import { NavLink } from 'react-router-dom';
// --- 1. IMPORT NEW ICONS ---
import { Home, User, Bell, DollarSign, Award } from 'lucide-react';
import { useAuth } from '@/context/AuthContext.jsx';

// ... (NavItem component is unchanged) ...
const NavItem = ({ to, icon: Icon, label }) => {
  return (
    <NavLink
      to={to}
      end 
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
  
  // --- 2. DEFINE ALL STUDENT PATHS ---
  const homePath = "/student/dashboard";
  const financePath = "/student/finance";
  const certificatesPath = "/student/certificates";
  const accountPath = "/account";
  // const notificationsPath = "/notifications"; // Removed for simplicity, 5 icons is too many

  return (
    <nav className="fixed bottom-0 z-10 w-full border-t border-border bg-card shadow-inner lg:hidden"> {/* 3. ADD lg:hidden */}
      <div className="mx-auto flex h-16 max-w-lg items-stretch">
        {/* --- 4. UPDATE NAV ITEMS --- */}
        <NavItem to={homePath} icon={Home} label="Home" />
        <NavItem to={financePath} icon={DollarSign} label="Finance" />
        <NavItem to={certificatesPath} icon={Award} label="Certs" />
        <NavItem to={accountPath} icon={User} label="Account" />
      </div>
    </nav>
  );
}

export default BottomNav;