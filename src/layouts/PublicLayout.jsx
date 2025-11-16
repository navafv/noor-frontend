import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar.jsx';
import PublicFooter from '../components/PublicFooter.jsx';

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