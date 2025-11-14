import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminBottomNav from '../components/admin/AdminBottomNav.jsx';
import AdminMobileHeader from '../components/admin/AdminMobileHeader.jsx';

/**
 * This is the new layout for the MOBILE ADMIN experience.
 */
function AdminMobileLayout() {
  return (
    <div className="flex h-screen flex-col lg:hidden">
      {/* 1. New sticky header */}
      <AdminMobileHeader />
      
      {/* 2. Main content area */}
      <main className="flex-1 overflow-y-auto bg-background pb-20">
        <Outlet /> {/* Renders the page content */}
      </main>
      
      {/* 3. New Bottom Navigation */}
      <AdminBottomNav />
    </div>
  );
}

export default AdminMobileLayout;