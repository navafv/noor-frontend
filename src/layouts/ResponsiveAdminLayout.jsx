import React from 'react';
import { useResponsive } from '../hooks/useResponsive.js';
import AdminLayout from '../pages/AdminLayout.jsx'; // Desktop layout (Sidebar)
import AdminMobileLayout from './AdminMobileLayout.jsx'; // Mobile layout (BottomNav)

function ResponsiveAdminLayout() {
  const { isMobile } = useResponsive();

  // Show mobile layout if screen is small, otherwise show desktop layout
  return isMobile ? <AdminMobileLayout /> : <AdminLayout />;
}

export default ResponsiveAdminLayout;