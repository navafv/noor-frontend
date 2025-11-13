import React from 'react';
import { useResponsive } from '../hooks/useResponsive.js';
import AppLayout from '../components/AppLayout.jsx'; // Mobile layout (BottomNav)
import StudentDesktopLayout from './StudentDesktopLayout.jsx'; // Desktop layout (TopNav)

function ResponsiveStudentLayout() {
  const { isMobile } = useResponsive();

  // Show mobile layout if screen is small, otherwise show desktop layout
  return isMobile ? <AppLayout /> : <StudentDesktopLayout />;
}

export default ResponsiveStudentLayout;