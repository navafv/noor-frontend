import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Public Pages
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';

// App (Shared) Pages
import AccountPage from './pages/AccountPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';

// Admin-Only Pages
import AdminDashboard from './pages/AdminDashboard.jsx'; // This is the Enquiry List
import EnquiryDetailPage from './pages/EnquiryDetailPage.jsx';
import StudentListPage from './pages/StudentListPage.jsx';

import './index.css';

function App() {
  return (
    <Routes>
      {/* Public-facing login page (no layout) */}
      <Route path="/login" element={<LoginPage />} />

      {/* === Main App Layout (Public) === */}
      {/* This group contains public pages that show the bottom nav */}
      {/* The <Layout> component is now the parent route */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      {/* === Main App Layout (Protected) === */}
      {/* This group contains protected pages that show the bottom nav */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/account" element={<AccountPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>
      
      {/* === Admin-only routes (No Bottom Nav) === */}
      {/* These routes do not use the <Layout> and have no bottom nav */}
      <Route
        path="/admin/enquiries"
        element={
          <ProtectedRoute staffOnly={true}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/enquiry/:id"
        element={
          <ProtectedRoute staffOnly={true}>
            <EnquiryDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/students"
        element={
          <ProtectedRoute staffOnly={true}>
            <StudentListPage />
          </ProtectedRoute>
        }
      />
      
      {/* Add a catch-all or 404 page later */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;