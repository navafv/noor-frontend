import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import StudentSidebar from '../components/student/StudentSidebar.jsx'; // <-- Import new sidebar
import { Menu } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle.jsx';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';

/**
 * This is the new layout for the DESKTOP student experience.
 * It's now a sidebar-based layout, matching the Admin layout.
 */
function StudentDesktopLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="hidden lg:flex h-screen bg-background text-foreground">
      {/* Mobile Sidebar Backdrop (for tablet) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300
                    lg:translate-x-0 ${
                      isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
      >
        <StudentSidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Simple Header for theme/notifications */}
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border bg-card px-4 md:px-8">
          <button
            onClick={() => setIsSidebarOpen(true)}
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
          </div>
        </header>

        {/* Outlet for pages */}
        <main className="flex-1 overflow-y-auto">
          {/* Note: We remove PageHeader from here.
            We will add PageHeader to each *individual page* (e.g., StudentDashboard, StudentFinancePage) 
            so the title is correct.
          */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default StudentDesktopLayout;