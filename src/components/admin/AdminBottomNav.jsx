import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, User, Menu } from 'lucide-react';

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

function AdminBottomNav() {
  return (
    <nav className="fixed bottom-0 z-10 w-full border-t border-border bg-card shadow-inner lg:hidden">
      <div className="mx-auto flex h-16 max-w-lg items-stretch">
        <NavItem to="/admin/dashboard" icon={LayoutDashboard} label="Home" />
        <NavItem to="/admin/menu" icon={Menu} label="Menu" />
        <NavItem to="/admin/account" icon={User} label="Account" />
      </div>
    </nav>
  );
}

export default AdminBottomNav;