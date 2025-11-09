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
import AccountSettings from './pages/AccountSettings.jsx';

// Admin-Only Pages
import AdminDashboard from './pages/AdminDashboard.jsx'; // <-- This is the NEW main dashboard
import AdminEnquiryListPage from './pages/AdminEnquiryListPage.jsx'; // <-- This is the RENAMED old dashboard
import EnquiryDetailPage from './pages/EnquiryDetailPage.jsx';
import StudentListPage from './pages/StudentListPage.jsx';
import StudentDetailPage from './pages/StudentDetailPage.jsx'; 
import AttendancePage from './pages/AttendancePage.jsx'; // <-- IMPORT NEW PAGE

import './index.css';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* === Main App Layout (Public) === */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      {/* === Main App Layout (Protected) === */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/account" element={<AccountPage />} />
        <Route path="/account/settings" element={<AccountSettings />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>
      
      {/* === Admin-only routes (No Bottom Nav) === */}
      {/* --- UPDATE ADMIN ROUTES --- */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute staffOnly={true}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/enquiries"
        element={
          <ProtectedRoute staffOnly={true}>
            <AdminEnquiryListPage />
          </ProtectedRoute>
        }
      />
      {/* --- END OF UPDATE --- */}
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
      <Route
        path="/admin/student/:id"
        element={
          <ProtectedRoute staffOnly={true}>
            <StudentDetailPage />
          </ProtectedRoute>
        }
      />
      {/* --- ADD ATTENDANCE ROUTE --- */}
      <Route
        path="/admin/attendance"
        element={
          <ProtectedRoute staffOnly={true}>
            <AttendancePage />
          </ProtectedRoute>
        }
      />
      
      {/* Redirect /admin to the new dashboard */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;