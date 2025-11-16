import React from 'react';
import { useResponsive } from '../hooks/useResponsive.js';
import StudentMobileLayout from './StudentMobileLayout.jsx'; 
import StudentDesktopLayout from './StudentDesktopLayout.jsx';

function ResponsiveStudentLayout() {
  const { isMobile } = useResponsive();

  // Show mobile layout if screen is small, otherwise show desktop layout
  return isMobile ? <StudentMobileLayout /> : <StudentDesktopLayout />;
}

export default ResponsiveStudentLayout;