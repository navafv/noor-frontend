import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

// Import Pages
import HomePage from './pages/HomePage'; // Now just the Landing Page
import LoginPage from './pages/LoginPage'; // Separate Login Page
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
import AdminCourseMaterialsPage from './pages/AdminCourseMaterialsPage';
import AttendancePage from './pages/AttendancePage';
import CertificateManagementPage from './pages/CertificateManagementPage';
import AccountSettings from './pages/AccountSettings';
import ExpenseManagementPage from './pages/ExpenseManagementPage';
import OutstandingFeesPage from './pages/OutstandingFeesPage';
import FinanceAnalyticsPage from './pages/FinanceAnalyticsPage';
import AttendanceStatsPage from './pages/AttendanceStatsPage';
import AdminEnrollmentsPage from './pages/AdminEnrollmentsPage';
import StaffListPage from './pages/StaffListPage';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import StudentMaterialsPage from './pages/StudentMaterialsPage';
import StudentFinancePage from './pages/StudentFinancePage';
import StudentMenuPage from './pages/StudentMenuPage';
import StudentCertificatesPage from './pages/StudentCertificatesPage';
import StudentAttendancePage from './pages/StudentAttendancePage';

// Common
import EventsPage from './pages/EventsPage';
import NotificationsPage from './pages/NotificationsPage';

// URL Scrubber: Keeps the browser URL clean (at '/')
const UrlScrubber = () => {
  useEffect(() => {
    if (window.location.pathname !== '/') {
      window.history.replaceState(null, '', '/');
    }
  }, []);
  return null;
};

function App() {
  return (
    <>
      <UrlScrubber />
      <Toaster position="top-center" toastOptions={{ duration: 3000, className: 'text-sm font-medium' }} />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} /> {/* <--- Added Back */}
        <Route path="/verify-certificate/:hash" element={<VerifyCertificatePage />} />
        <Route path="/verify" element={<VerifyCertificatePage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPasswordPage />} />
        <Route path="/download-app" element={<DownloadAppPage />} />
        
        {/* Protected Routes */}
        <Route element={<AppLayout />}>
          <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute staffOnly={true}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/students" element={<ProtectedRoute staffOnly={true}><StudentListPage /></ProtectedRoute>} />
          <Route path="/admin/students/:id" element={<ProtectedRoute staffOnly={true}><StudentDetailPage /></ProtectedRoute>} />
          <Route path="/admin/courses" element={<ProtectedRoute staffOnly={true}><CourseManagementPage /></ProtectedRoute>} />
          <Route path="/admin/finance" element={<ProtectedRoute staffOnly={true}><ReceiptManagementPage /></ProtectedRoute>} />
          <Route path="/admin/attendance" element={<ProtectedRoute staffOnly={true}><AttendancePage /></ProtectedRoute>} />
          <Route path="/admin/certificates" element={<ProtectedRoute staffOnly={true}><CertificateManagementPage /></ProtectedRoute>} />
          <Route path="/admin/materials" element={<ProtectedRoute staffOnly={true}><AdminCourseMaterialsPage /></ProtectedRoute>} />
          <Route path="/admin/menu" element={<ProtectedRoute staffOnly={true}><AdminMenuPage /></ProtectedRoute>} />
          <Route path="/admin/profile" element={<ProtectedRoute staffOnly={true}><AccountSettings /></ProtectedRoute>} />
          <Route path="/admin/expenses" element={<ProtectedRoute staffOnly={true}><ExpenseManagementPage /></ProtectedRoute>} />
          <Route path="/admin/outstanding" element={<ProtectedRoute staffOnly={true}><OutstandingFeesPage /></ProtectedRoute>} />
          <Route path="/admin/finance-stats" element={<ProtectedRoute staffOnly={true}><FinanceAnalyticsPage /></ProtectedRoute>} />
          <Route path="/admin/attendance-stats" element={<ProtectedRoute staffOnly={true}><AttendanceStatsPage /></ProtectedRoute>} />
          <Route path="/admin/enrollments" element={<ProtectedRoute staffOnly={true}><AdminEnrollmentsPage /></ProtectedRoute>} />
          <Route path="/admin/staff" element={<ProtectedRoute staffOnly={true}><StaffListPage /></ProtectedRoute>} />

          {/* Student Routes */}
          <Route path="/student/home" element={<ProtectedRoute studentOnly={true}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/materials" element={<ProtectedRoute studentOnly={true}><StudentMaterialsPage /></ProtectedRoute>} />
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

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-white" />;
  
  if (!user) return <HomePage />;
  
  return user.is_staff ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/student/home" replace />;
}

export default App;