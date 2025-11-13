/* * UPDATED FILE: src/components/admin/AdminHeader.jsx
 *
 * SIMPLIFICATION: Removed role-based path logic.
 * This header is only for admins now.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell } from 'lucide-react';
import ThemeToggle from '../ThemeToggle.jsx'; 
import { useAuth } from '../../context/AuthContext.jsx'; 

function AdminHeader({ onMenuClick }) {
  const { user } = useAuth();

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || user?.username[0].toUpperCase() || '?';
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border bg-card px-4 md:px-8">
      {/* Mobile Menu Button */}
      <button
        onClick={onMenuClick}
        className="p-2 text-muted-foreground hover:bg-accent rounded-md lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="flex w-full items-center justify-end gap-4">
        <ThemeToggle />
        <Link
          to="/admin/notifications" // <-- Hardcoded admin path
          className="p-2 text-muted-foreground hover:bg-accent rounded-full"
        >
          <Bell className="h-5 w-5" />
          <span className="sr-only">View notifications</span>
        </Link>
        <Link to="/admin/account" className="flex items-center gap-2"> {/* <-- Hardcoded admin path */}
          <span className="hidden text-sm font-medium sm:inline">
            {user?.first_name || user?.username}
          </span>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <span className="text-sm font-medium text-primary">
              {getInitials(user?.first_name, user?.last_name)}
            </span>
          </span>
        </Link>
      </div>
    </header>
  );
}

export default AdminHeader;