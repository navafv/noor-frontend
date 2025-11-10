/* UPDATED FILE: src/App.jsx */
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// --- Import Layouts & Auth ---
import AppLayout from './components/AppLayout'; // For Student Portal
import AdminLayout from './layouts/AdminLayout'; // For Admin Portal
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './components/PublicLayout'; // For public pages

// --- Import Pages ---
import HomeRedirect from './pages/HomeRedirect';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CoursesPage from './pages/CoursesPage';

// --- "App" Pages (for logged-in users) ---
import AccountPage from './pages/AccountPage';
import NotificationsPage from './pages/NotificationsPage';
import StudentDashboard from './pages/StudentDashboard';
import AccountSettings from './pages/AccountSettings';

// --- "Admin" Pages (for staff) ---
import AdminDashboard from './pages/AdminDashboard';
import AdminEnquiryListPage from './pages/AdminEnquiryListPage';
import EnquiryDetailPage from './pages/EnquiryDetailPage';
import StudentListPage from './pages/StudentListPage';
import StudentDetailPage from './pages/StudentDetailPage';
import AttendancePage from './pages/AttendancePage';
import ExpenseManagementPage from './pages/ExpenseManagementPage';
import StockManagementPage from './pages/StockManagementPage';
import CourseManagementPage from './pages/CourseManagementPage';

import './index.css';

function App() {
  return (
    <Routes>
      {/* 1. Root redirect logic */}
      <Route path="/" element={<HomeRedirect />} />
      
      {/* 2. Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/courses" element={<CoursesPage />} />
      </Route>

      {/* 3. Login Page (No Layout) */}
      <Route path="/login" element={<LoginPage />} />

      {/* 4. Student Portal (Mobile-first layout) */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/account/settings" element={<AccountSettings />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>

      {/* 5. Admin/Teacher Portal (Desktop-first layout) */}
      <Route
        element={
          <ProtectedRoute staffOnly={true}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/enquiries" element={<AdminEnquiryListPage />} />
        <Route path="/admin/enquiry/:id" element={<EnquiryDetailPage />} />
        <Route path="/admin/students" element={<StudentListPage />} />
        <Route path="/admin/student/:id" element={<StudentDetailPage />} />
        <Route path="/admin/attendance" element={<AttendancePage />} />
        <Route path="/admin/expenses" element={<ExpenseManagementPage />} />
        <Route path="/admin/stock" element={<StockManagementPage />} />
        <Route path="/admin/courses" element={<CourseManagementPage />} />
        
        {/* Admin users can also access the common app pages, but in their layout */}
        <Route path="/admin/account" element={<AccountPage />} />
        <Route path="/admin/account/settings" element={<AccountSettings />} />
        <Route path="/admin/notifications" element={<NotificationsPage />} />
      </Route>

      {/* 6. Redirects for any other path */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;