import React from 'react';
import { useResponsive } from '../hooks/useResponsive.js';
// --- 1. IMPORT THE NEW MOBILE LAYOUT ---
import StudentMobileLayout from './StudentMobileLayout.jsx'; 
import StudentDesktopLayout from './StudentDesktopLayout.jsx';

function ResponsiveStudentLayout() {
  const { isMobile } = useResponsive();

  // --- 2. USE THE NEW StudentMobileLayout ---
  // Show mobile layout if screen is small, otherwise show desktop layout
  return isMobile ? <StudentMobileLayout /> : <StudentDesktopLayout />;
}

export default ResponsiveStudentLayout;