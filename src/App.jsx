import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// --- Import Layouts & Auth ---
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PublicLayout from './layouts/PublicLayout.jsx'; 
import ResponsiveStudentLayout from './layouts/ResponsiveStudentLayout.jsx';
import ResponsiveAdminLayout from './layouts/ResponsiveAdminLayout.jsx';
// REMOVE Teacher Layouts

// --- Import Pages ---
import HomeRedirect from './pages/HomeRedirect.jsx';
import LoginPage from './pages/LoginPage.jsx';
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import CoursesPage from './pages/CoursesPage.jsx';
import VerifyCertificatePage from './pages/VerifyCertificatePage.jsx'; 
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';

// --- "App" Pages (for logged-in users) ---
import AccountPage from './pages/AccountPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import AccountSettings from './pages/AccountSettings.jsx';

// --- Student Pages ---
import StudentDashboard from './pages/StudentDashboard.jsx';
import StudentAttendancePage from './pages/StudentAttendancePage.jsx';
import StudentFinancePage from './pages/StudentFinancePage.jsx';
import StudentCertificatesPage from './pages/StudentCertificatesPage.jsx';
import StudentMaterialsPage from './pages/StudentMaterialsPage.jsx';
import StudentMenuPage from './pages/StudentMenuPage.jsx';
// REMOVE StudentMessagePage
import StudentCalendarPage from './pages/StudentCalendarPage.jsx';

// --- "Admin" Pages (for staff) ---
import AdminDashboard from './pages/AdminDashboard.jsx';
// REMOVE AdminEnquiryListPage
// REMOVE EnquiryDetailPage
import StudentListPage from './pages/StudentListPage.jsx';
import StudentDetailPage from './pages/StudentDetailPage.jsx';
import AttendancePage from './pages/AttendancePage.jsx';
import ExpenseManagementPage from './pages/ExpenseManagementPage.jsx';
// REMOVE StockManagementPage
import CourseManagementPage from './pages/CourseManagementPage.jsx';
// REMOVE PayrollManagementPage 
import ReceiptManagementPage from './pages/ReceiptManagementPage.jsx'; 
import AnalyticsPage from './pages/AnalyticsPage.jsx'; 
import AttendanceAnalyticsPage from './pages/AttendanceAnalyticsPage.jsx'; 
import CertificateManagementPage from './pages/CertificateManagementPage.jsx';
// REMOVE RoleManagementPage
// REMOVE FeeReminderLogPage
// REMOVE AuditLogPage
import UserManagementPage from './pages/UserManagementPage.jsx';
import AdminCourseMaterialsPage from './pages/AdminCourseMaterialsPage.jsx';
import AdminMaterialDetailPage from './pages/AdminMaterialDetailPage.jsx';
import AdminMenuPage from './pages/AdminMenuPage.jsx';
// REMOVE AdminInboxPage
// REMOVE AdminConversationPage
import AdminCalendarPage from './pages/AdminCalendarPage.jsx';
// REMOVE AdminFeedbackPage
import FinanceReportsPage from './pages/FinanceReportsPage.jsx';

import './index.css';

function App() {
  return (
    <Routes>
      {/* 1. Root redirect logic */}
      <Route path="/" element={<HomeRedirect />} />

      {/* 2. Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/home" element={<HomePage />} />
        {/* ... (other public routes are fine) ... */}
      </Route>

      {/* 3. Login Page (No Layout) */}
      <Route path="/login" element={<LoginPage />} />

      {/* 4. Student Portal */}
      <Route
        element={
          <ProtectedRoute studentOnly={true}>
            <ResponsiveStudentLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/attendance" element={<StudentAttendancePage />} />
        <Route path="/student/finance" element={<StudentFinancePage />} />
        <Route path="/student/certificates" element={<StudentCertificatesPage />} />
        <Route path="/student/materials" element={<StudentMaterialsPage />} />
        <Route path="/student/menu" element={<StudentMenuPage />} />
        {/* <Route path="/student/messages" element={<StudentMessagePage />} /> <-- REMOVE */ }
        <Route path="/student/calendar" element={<StudentCalendarPage />} />

        <Route path="/account" element={<AccountPage />} />
        <Route path="/student/account/settings" element={<AccountSettings />} /> 
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>

      {/* 5. REMOVE Teacher Portal */}

      {/* 6. Admin Portal (Was 6, now 5) */}
      <Route
        element={
          // <ProtectedRoute adminOnly={true}> <-- MODIFY
          <ProtectedRoute staffOnly={true}> {/* <-- TO THIS (more flexible) */}
            <ResponsiveAdminLayout />
          </ProtectedRoute>
        }
      >
        {/* Admin-only routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        {/* ... (remove routes for deleted pages) ... */}
        <Route path="/admin/students" element={<StudentListPage />} />
        <Route path="/admin/student/:id" element={<StudentDetailPage />} />
        <Route path="/admin/expenses" element={<ExpenseManagementPage />} />
        <Route path="/admin/courses" element={<CourseManagementPage />} />
        <Route path="/admin/receipts" element={<ReceiptManagementPage />} /> 
        <Route path="/admin/analytics" element={<AnalyticsPage />} /> 
        <Route path="/admin/reports/finance" element={<FinanceReportsPage />} />
        <Route path="/admin/attendance-analytics" element={<AttendanceAnalyticsPage />} /> 
        <Route path="/admin/certificates" element={<CertificateManagementPage />} />
        <Route path="/admin/users" element={<UserManagementPage />} />
        <Route path="/admin/materials" element={<AdminCourseMaterialsPage />} />
        <Route path="/admin/materials/:courseId" element={<AdminMaterialDetailPage />} />
        <Route path="/admin/menu" element={<AdminMenuPage />} />
        <Route path="/admin/calendar" element={<AdminCalendarPage />} />

        {/* Shared staff routes */}
        <Route path="/admin/account" element={<AccountPage />} />
        <Route path="/admin/account/settings" element={<AccountSettings />} />
        <Route path="/admin/notifications" element={<NotificationsPage />} />
        <Route path="/admin/attendance" element={<AttendancePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;