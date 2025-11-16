import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from '../components/BottomNav.jsx';
import StudentMobileHeader from '../components/StudentMobileHeader.jsx';

/**
 * This is the layout for the MOBILE student experience.
 * It combines the new header, the main content, and the new bottom nav.
 */
function StudentMobileLayout() {
  return (
    <div className="flex h-screen flex-col lg:hidden">
      {/* 1. New sticky header */}
      <StudentMobileHeader />
      
      {/* 2. Main content area */}
      <main className="flex-1 overflow-y-auto bg-background pb-20">
        <Outlet /> {/* Renders the page content */}
      </main>
      
      {/* 3. New Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

export default StudentMobileLayout;