import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// --- Import Layouts & Auth ---
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PublicLayout from './layouts/PublicLayout.jsx'; 
import ResponsiveStudentLayout from './layouts/ResponsiveStudentLayout.jsx';
import ResponsiveAdminLayout from './layouts/ResponsiveAdminLayout.jsx';
import ResponsiveTeacherLayout from './layouts/ResponsiveTeacherLayout.jsx';

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
import StudentMessagePage from './pages/StudentMessagePage.jsx';
import StudentCalendarPage from './pages/StudentCalendarPage.jsx';

// --- Teacher Pages ---
import TeacherDashboard from './pages/TeacherDashboard.jsx';
import TeacherBatches from './pages/TeacherBatches.jsx';

// --- "Admin" Pages (for staff) ---
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminEnquiryListPage from './pages/AdminEnquiryListPage.jsx';
import EnquiryDetailPage from './pages/EnquiryDetailPage.jsx';
import StudentListPage from './pages/StudentListPage.jsx';
import StudentDetailPage from './pages/StudentDetailPage.jsx';
import AttendancePage from './pages/AttendancePage.jsx';
import ExpenseManagementPage from './pages/ExpenseManagementPage.jsx';
import StockManagementPage from './pages/StockManagementPage.jsx';
import CourseManagementPage from './pages/CourseManagementPage.jsx';
import PayrollManagementPage from './pages/PayrollManagementPage.jsx'; 
import ReceiptManagementPage from './pages/ReceiptManagementPage.jsx'; 
import AnalyticsPage from './pages/AnalyticsPage.jsx'; 
import AttendanceAnalyticsPage from './pages/AttendanceAnalyticsPage.jsx'; 
import CertificateManagementPage from './pages/CertificateManagementPage.jsx';
import RoleManagementPage from './pages/RoleManagementPage.jsx';
import FeeReminderLogPage from './pages/FeeReminderLogPage.jsx';
import AuditLogPage from './pages/AuditLogPage.jsx';
import UserManagementPage from './pages/UserManagementPage.jsx';
import AdminCourseMaterialsPage from './pages/AdminCourseMaterialsPage.jsx';
import AdminMaterialDetailPage from './pages/AdminMaterialDetailPage.jsx';
import AdminMenuPage from './pages/AdminMenuPage.jsx';
import AdminInboxPage from './pages/AdminInboxPage.jsx';
import AdminConversationPage from './pages/AdminConversationPage.jsx';
import AdminCalendarPage from './pages/AdminCalendarPage.jsx';
import AdminFeedbackPage from './pages/AdminFeedbackPage.jsx';
import FinanceReportsPage from './pages/FinanceReportsPage.jsx'; // <-- NEW

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
        <Route path="/verify" element={<VerifyCertificatePage />} /> 
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPasswordPage />} />
      </Route>

      {/* 3. Login Page (No Layout) */}
      <Route path="/login" element={<LoginPage />} />

      {/* 4. Student Portal (Responsive layout) */}
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
        <Route path="/student/messages" element={<StudentMessagePage />} />
        <Route path="/student/calendar" element={<StudentCalendarPage />} />
        
        {/* Shared student routes */}
        <Route path="/account" element={<AccountPage />} />
        <Route path="/student/account/settings" element={<AccountSettings />} /> 
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>

      {/* 5. NEW: Teacher Portal (Responsive layout) */}
      <Route
        element={
          <ProtectedRoute teacherOnly={true}>
            <ResponsiveTeacherLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/my-batches" element={<TeacherBatches />} />
        
        {/* Shared staff routes */}
        <Route path="/teacher/attendance" element={<AttendancePage />} />
        <Route path="/teacher/account" element={<AccountPage />} />
        <Route path="/teacher/account/settings" element={<AccountSettings />} />
        <Route path="/teacher/notifications" element={<NotificationsPage />} />
      </Route>
      
      {/* 6. Admin Portal (Responsive layout) */}
      <Route
        element={
          <ProtectedRoute adminOnly={true}>
            <ResponsiveAdminLayout />
          </ProtectedRoute>
        }
      >
        {/* Admin-only routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/enquiries" element={<AdminEnquiryListPage />} />
        <Route path="/admin/enquiry/:id" element={<EnquiryDetailPage />} />
        <Route path="/admin/students" element={<StudentListPage />} />
        <Route path="/admin/student/:id" element={<StudentDetailPage />} />
        <Route path="/admin/expenses" element={<ExpenseManagementPage />} />
        <Route path="/admin/stock" element={<StockManagementPage />} />
        <Route path="/admin/courses" element={<CourseManagementPage />} />
        <Route path="/admin/payroll" element={<PayrollManagementPage />} /> 
        <Route path="/admin/receipts" element={<ReceiptManagementPage />} /> 
        <Route path="/admin/analytics" element={<AnalyticsPage />} /> 
        <Route path="/admin/reports/finance" element={<FinanceReportsPage />} /> {/* <-- NEW */}
        <Route path="/admin/attendance-analytics" element={<AttendanceAnalyticsPage />} /> 
        <Route path="/admin/certificates" element={<CertificateManagementPage />} />
        <Route path="/admin/roles" element={<RoleManagementPage />} />
        <Route path="/admin/reminders" element={<FeeReminderLogPage />} />
        <Route path="/admin/users" element={<UserManagementPage />} />
        <Route path="/admin/materials" element={<AdminCourseMaterialsPage />} />
        <Route path="/admin/materials/:courseId" element={<AdminMaterialDetailPage />} />
        <Route path="/admin/menu" element={<AdminMenuPage />} />
        <Route path="/admin/messages" element={<AdminInboxPage />} />
        <Route path="/admin/messages/:conversationId" element={<AdminConversationPage />} />
        <Route path="/admin/calendar" element={<AdminCalendarPage />} />
        <Route path="/admin/feedback" element={<AdminFeedbackPage />} />

        <Route 
          path="/admin/history/students" 
          element={<AuditLogPage modelName="Student" endpoint="/history/students/" />} 
        />
        <Route 
          path="/admin/history/users" 
          element={<AuditLogPage modelName="User" endpoint="/history/users/" />} 
        />
        
        {/* Shared staff routes */}
        <Route path="/admin/account" element={<AccountPage />} />
        <Route path="/admin/account/settings" element={<AccountSettings />} />
        <Route path="/admin/notifications" element={<NotificationsPage />} />
        <Route path="/admin/attendance" element={<AttendancePage />} />
      </Route>
      
      {/* 7. Redirects for any other path */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;