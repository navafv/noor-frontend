import React from 'react';
import { Outlet } from 'react-router-dom';
import TeacherBottomNav from '../components/teacher/TeacherBottomNav.jsx';
import TeacherMobileHeader from '../components/teacher/TeacherMobileHeader.jsx';

function TeacherMobileLayout() {
  return (
    <div className="flex h-screen flex-col lg:hidden">
      {/* 1. Sticky header */}
      <TeacherMobileHeader />
      
      {/* 2. Main content area */}
      <main className="flex-1 overflow-y-auto bg-background pb-20">
        <Outlet /> {/* Renders the page content */}
      </main>
      
      {/* 3. Bottom Navigation */}
      <TeacherBottomNav />
    </div>
  );
}

export default TeacherMobileLayout;