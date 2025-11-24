import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Import Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import VerifyCertificatePage from './pages/VerifyCertificatePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DownloadAppPage from './pages/DownloadAppPage';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import StudentListPage from './pages/StudentListPage';
import StudentDetailPage from './pages/StudentDetailPage';
import CourseManagementPage from './pages/CourseManagementPage';
import ReceiptManagementPage from './pages/ReceiptManagementPage';
import AdminMenuPage from './pages/AdminMenuPage';
import AttendancePage from './pages/AttendancePage';
import CertificateManagementPage from './pages/CertificateManagementPage';
import AccountSettings from './pages/AccountSettings';
import ExpenseManagementPage from './pages/ExpenseManagementPage';
import OutstandingFeesPage from './pages/OutstandingFeesPage';
import FinanceAnalyticsPage from './pages/FinanceAnalyticsPage';
import AttendanceStatsPage from './pages/AttendanceStatsPage';
import AdminEnrollmentsPage from './pages/AdminEnrollmentsPage';
import StaffListPage from './pages/StaffListPage';
import AdminSendNotificationPage from './pages/AdminSendNotificationPage'; // Added

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import StudentFinancePage from './pages/StudentFinancePage';
import StudentMenuPage from './pages/StudentMenuPage';
import StudentCertificatesPage from './pages/StudentCertificatesPage';
import StudentAttendancePage from './pages/StudentAttendancePage';

// Common
import NotificationsPage from './pages/NotificationsPage';

function App() {
  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 3000, className: 'text-sm font-medium' }} />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Verification Routes */}
        <Route path="/verify-certificate/:hash" element={<VerifyCertificatePage />} />
        <Route path="/verify" element={<VerifyCertificatePage />} />
        
        {/* Password Reset Routes */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPasswordPage />} />
        
        {/* App Download */}
        <Route path="/download" element={<DownloadAppPage />} />
        
        {/* Protected Routes */}
        <Route element={<AppLayout />}>
          <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute staffOnly={true}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/menu" element={<ProtectedRoute staffOnly={true}><AdminMenuPage /></ProtectedRoute>} />
          
          {/* Admin Feature Routes */}
          <Route path="/admin/students" element={<ProtectedRoute staffOnly={true}><StudentListPage /></ProtectedRoute>} />
          <Route path="/admin/students/:id" element={<ProtectedRoute staffOnly={true}><StudentDetailPage /></ProtectedRoute>} />
          <Route path="/admin/courses" element={<ProtectedRoute staffOnly={true}><CourseManagementPage /></ProtectedRoute>} />
          <Route path="/admin/enrollments" element={<ProtectedRoute staffOnly={true}><AdminEnrollmentsPage /></ProtectedRoute>} />
          
          {/* Finance */}
          <Route path="/admin/finance" element={<ProtectedRoute staffOnly={true}><ReceiptManagementPage /></ProtectedRoute>} />
          <Route path="/admin/expenses" element={<ProtectedRoute staffOnly={true}><ExpenseManagementPage /></ProtectedRoute>} />
          <Route path="/admin/outstanding" element={<ProtectedRoute staffOnly={true}><OutstandingFeesPage /></ProtectedRoute>} />
          <Route path="/admin/finance-stats" element={<ProtectedRoute staffOnly={true}><FinanceAnalyticsPage /></ProtectedRoute>} />
          
          {/* Operations */}
          <Route path="/admin/attendance" element={<ProtectedRoute staffOnly={true}><AttendancePage /></ProtectedRoute>} />
          <Route path="/admin/attendance-stats" element={<ProtectedRoute staffOnly={true}><AttendanceStatsPage /></ProtectedRoute>} />
          <Route path="/admin/certificates" element={<ProtectedRoute staffOnly={true}><CertificateManagementPage /></ProtectedRoute>} />
          <Route path="/admin/staff" element={<ProtectedRoute staffOnly={true}><StaffListPage /></ProtectedRoute>} />
          
          {/* Communications */}
          <Route path="/admin/notifications/send" element={<ProtectedRoute staffOnly={true}><AdminSendNotificationPage /></ProtectedRoute>} />

          {/* Settings */}
          <Route path="/admin/profile" element={<ProtectedRoute staffOnly={true}><AccountSettings /></ProtectedRoute>} />

          {/* Student Routes */}
          <Route path="/student/home" element={<ProtectedRoute studentOnly={true}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/finance" element={<ProtectedRoute studentOnly={true}><StudentFinancePage /></ProtectedRoute>} />
          <Route path="/student/profile" element={<ProtectedRoute studentOnly={true}><StudentMenuPage /></ProtectedRoute>} />
          <Route path="/student/settings" element={<ProtectedRoute studentOnly={true}><AccountSettings /></ProtectedRoute>} />
          <Route path="/student/certificates" element={<ProtectedRoute studentOnly={true}><StudentCertificatesPage /></ProtectedRoute>} />
          <Route path="/student/attendance" element={<ProtectedRoute studentOnly={true}><StudentAttendancePage /></ProtectedRoute>} />
        </Route>

        {/* Catch-All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;