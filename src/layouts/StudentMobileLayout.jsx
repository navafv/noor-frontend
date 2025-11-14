import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from '../components/BottomNav.jsx';
import StudentMobileHeader from '../components/StudentMobileHeader.jsx';
// --- REMOVED: StudentMenuModal ---

/**
 * This is the new layout for the MOBILE student experience.
 * It combines the new header, the main content, and the new bottom nav.
 */
function StudentMobileLayout() {
  // --- REMOVED: isMenuOpen state ---

  return (
    <div className="flex h-screen flex-col">
      {/* 1. New sticky header */}
      <StudentMobileHeader />
      
      {/* 2. Main content area */}
      <main className="flex-1 overflow-y-auto bg-background pb-20">
        <Outlet /> {/* Renders the page content */}
      </main>
      
      {/* 3. New Bottom Navigation */}
      {/* --- UPDATED: No longer passes onMenuClick --- */}
      <BottomNav />

      {/* 4. REMOVED: StudentMenuModal component */}
    </div>
  );
}

export default StudentMobileLayout;