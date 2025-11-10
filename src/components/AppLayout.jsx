/* UPDATED FILE: src/components/AppLayout.jsx */
import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav.jsx';

function AppLayout() {
  return (
    <div className="flex h-screen flex-col">
      {/* PageHeader is now removed from the main layout. 
        Each page (e.g., StudentDashboard, AccountPage) will
        add its own header for better control.
      */}
      
      {/* Main content area */}
      <main className="flex-1 overflow-y-auto bg-background">
        <Outlet /> {/* Renders the page content */}
      </main>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

export default AppLayout;