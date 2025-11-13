import React from 'react';
import { Outlet } from 'react-router-dom';
import StudentDesktopNav from '../components/StudentDesktopNav.jsx';

function StudentDesktopLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <StudentDesktopNav />
      <main className="flex-1">
        <Outlet /> {/* Renders StudentDashboard, StudentFinancePage, etc. */}
      </main>
      {/* You could add a simple desktop footer here if you want */}
    </div>
  );
}

export default StudentDesktopLayout;