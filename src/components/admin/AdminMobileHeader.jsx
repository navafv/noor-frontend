import React from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext.jsx';
import ThemeToggle from '../ThemeToggle.jsx';

/**
 * A header component specifically for the mobile ADMIN view.
 */
function AdminMobileHeader() {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <header className="sticky top-0 z-10 w-full bg-card shadow-sm border-b border-border lg:hidden">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-between px-4">
        
        {/* Admin Info */}
        <div>
          <h1 className="text-lg font-bold text-foreground leading-tight">
            {user.first_name || user.username}
          </h1>
          <p className="text-sm text-muted-foreground leading-tight">
            Admin Portal
          </p>
        </div>
        
        {/* Icons */}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Link
            to="/admin/notifications" // Admin-specific notifications path
            className="p-2 text-muted-foreground hover:bg-accent rounded-full"
            aria-label="View notifications"
          >
            <Bell size={24} />
          </Link>
        </div>
      </div>
    </header>
  );
}

export default AdminMobileHeader;