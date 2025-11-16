import React from 'react';
import { useResponsive } from '../hooks/useResponsive.js';
import TeacherDesktopLayout from './TeacherDesktopLayout.jsx';
import TeacherMobileLayout from './TeacherMobileLayout.jsx';

function ResponsiveTeacherLayout() {
  const { isMobile } = useResponsive();

  return isMobile ? <TeacherMobileLayout /> : <TeacherDesktopLayout />;
}

export default ResponsiveTeacherLayout;