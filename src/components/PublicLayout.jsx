import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';
import PublicFooter from './PublicFooter';

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet /> {/* This renders HomePage, AboutPage, etc. */}
      </main>
      <PublicFooter />
    </div>
  );
}

export default PublicLayout;