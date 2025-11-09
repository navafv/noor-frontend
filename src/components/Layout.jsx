import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav.jsx';
import Header from './Header.jsx';

function Layout() {
  return (
    <div className="flex h-screen flex-col">
      {/* Top Header */}
      <Header />

      {/* Main Content Area */}
      {/* pb-20 adds padding at the bottom so content isn't hidden by the nav bar */}
      <main className="flex-1 overflow-y-auto bg-gray-50 pb-20">
        <Outlet /> {/* This is where your pages (Home, Account, etc.) will render */}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

export default Layout;