/* NEW FILE: src/components/admin/AdminHeader.jsx */
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/context/AuthContext';

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
          to="/notifications"
          className="p-2 text-muted-foreground hover:bg-accent rounded-full"
        >
          <Bell className="h-5 w-5" />
          <span className="sr-only">View notifications</span>
        </Link>
        <Link to="/account" className="flex items-center gap-2">
          <span className="hidden text-sm font-medium sm:inline">
            {user?.first_name || user?.username}
          </span>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/50">
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
              {getInitials(user?.first_name, user?.last_name)}
            </span>
          </span>
        </Link>
      </div>
    </header>
  );
}

export default AdminHeader;