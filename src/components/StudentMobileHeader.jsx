import React from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext.jsx';

/**
 * A new header component specifically for the mobile student view.
 * It displays the student's name, reg no, and a notification bell.
 */
function StudentMobileHeader() {
  const { user } = useAuth();
  
  // This guard protects against the initial null user
  if (!user) return null;

  return (
    <header className="sticky top-0 z-10 w-full bg-card shadow-sm border-b border-border lg:hidden">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-between px-4">
        
        {/* Student Info */}
        <div>
          <h1 className="text-lg font-bold text-foreground leading-tight">
            {user.first_name || user.username}
          </h1>
          <p className="text-sm text-muted-foreground leading-tight">
            {/* --- THIS IS THE FIX ---
              Use optional chaining (user?.student?.reg_no)
              This waits for the AuthContext to finish fetching the student profile.
            */}
            Reg No: {user?.student?.reg_no || '...'}
          </p>
        </div>
        
        {/* Notification Bell */}
        <Link
          to="/notifications"
          className="p-2 text-muted-foreground hover:bg-accent rounded-full"
          aria-label="View notifications"
        >
          <Bell size={24} />
        </Link>
      </div>
    </header>
  );
}

export default StudentMobileHeader;