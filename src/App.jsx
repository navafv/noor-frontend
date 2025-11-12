import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// --- Import Layouts & Auth ---
import AppLayout from './components/AppLayout.jsx'; // For Student Portal
import AdminLayout from './pages/AdminLayout.jsx'; // For Admin/Teacher Portal
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PublicLayout from './components/PublicLayout.jsx'; // For public pages

// --- Import Pages ---
import HomeRedirect from './pages/HomeRedirect.jsx';
import LoginPage from './pages/LoginPage.jsx';
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import CoursesPage from './pages/CoursesPage.jsx';
import VerifyCertificatePage from './pages/VerifyCertificatePage.jsx'; 

// --- "App" Pages (for logged-in users) ---
import AccountPage from './pages/AccountPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';
import AccountSettings from './pages/AccountSettings.jsx';

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

// --- TEACHER PAGES ---
import TeacherDashboard from './pages/TeacherDashboard.jsx';
import TeacherBatches from './pages/TeacherBatches.jsx';

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
      </Route>

      {/* 3. Login Page (No Layout) */}
      <Route path="/login" element={<LoginPage />} />

      {/* 4. Student Portal (Mobile-first layout) */}
      <Route
        element={
          <ProtectedRoute studentOnly={true}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        {/* These routes are shared but render inside student layout */}
        <Route path="/account" element={<AccountPage />} />
        <Route path="/account/settings" element={<AccountSettings />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>

      {/* 5. Teacher Portal (Desktop-first layout) */}
      <Route
        element={
          <ProtectedRoute teacherOnly={true}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/my-batches" element={<TeacherBatches />} />
        {/* Teachers can also access their account/notifications in this layout */}
        <Route path="/teacher/account" element={<AccountPage />} />
        <Route path="/teacher/account/settings" element={<AccountSettings />} />
        <Route path="/teacher/notifications" element={<NotificationsPage />} />
      </Route>

      {/* 6. Admin Portal (Desktop-first layout) */}
      <Route
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
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
        <Route path="/admin/attendance-analytics" element={<AttendanceAnalyticsPage />} /> 
        <Route path="/admin/certificates" element={<CertificateManagementPage />} />
        <Route path="/admin/roles" element={<RoleManagementPage />} />
        <Route path="/admin/reminders" element={<FeeReminderLogPage />} />

        <Route 
          path="/admin/history/students" 
          element={<AuditLogPage modelName="Student" endpoint="/history/students/" />} 
        />
        <Route 
          path="/admin/history/users" 
          element={<AuditLogPage modelName="User" endpoint="/history/users/" />} 
        />
        
        {/* Admins can also access their account/notifications */}
        <Route path="/admin/account" element={<AccountPage />} />
        <Route path="/admin/account/settings" element={<AccountSettings />} />
        <Route path="/admin/notifications" element={<NotificationsPage />} />
      </Route>
      
      {/* 7. Shared Staff Routes (Admin & Teacher) */}
      <Route
        element={
          <ProtectedRoute staffOnly={true}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
         <Route path="/admin/attendance" element={<AttendancePage />} />
         <Route path="/teacher/attendance" element={<AttendancePage />} />
      </Route>

      {/* 8. Redirects for any other path */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;