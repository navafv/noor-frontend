import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, User, CheckSquare, Book } from 'lucide-react';

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

function TeacherBottomNav() {
  return (
    <nav className="fixed bottom-0 z-10 w-full border-t border-border bg-card shadow-inner lg:hidden">
      <div className="mx-auto flex h-16 max-w-lg items-stretch">
        <NavItem to="/teacher/dashboard" icon={LayoutDashboard} label="Home" />
        <NavItem to="/teacher/attendance" icon={CheckSquare} label="Attendance" />
        <NavItem to="/teacher/my-batches" icon={Book} label="Batches" />
        <NavItem to="/teacher/account" icon={User} label="Account" />
      </div>
    </nav>
  );
}

export default TeacherBottomNav;