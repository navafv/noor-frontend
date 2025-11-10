/* * UPDATED FILE: src/components/admin/AdminHeader.jsx
 *
 * FIX: This header is shared by Admins and Teachers.
 * It now points to the correct, role-based account
 * and notification pages.
 * FIX: Replaced aliases with relative paths to solve build error.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell } from 'lucide-react';
import ThemeToggle from '../ThemeToggle.jsx'; // <-- FIX: Use relative path
import { useAuth } from '../../context/AuthContext.jsx'; // <-- FIX: Use relative path

function AdminHeader({ onMenuClick }) {
  const { user } = useAuth();

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || user?.username[0].toUpperCase() || '?';
  };

  // FIX: Determine paths based on user role
  const isAdmin = user?.is_superuser;
  const notificationsPath = isAdmin ? "/admin/notifications" : "/teacher/notifications";
  const accountPath = isAdmin ? "/admin/account" : "/teacher/account";

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
          to={notificationsPath} // <-- FIX: Role-based path
          className="p-2 text-muted-foreground hover:bg-accent rounded-full"
        >
          <Bell className="h-5 w-5" />
          <span className="sr-only">View notifications</span>
        </Link>
        <Link to={accountPath} className="flex items-center gap-2"> {/* <-- FIX: Role-based path */}
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