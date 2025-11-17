import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts & Auth
import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

// Public Pages
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import VerifyCertificatePage from './pages/VerifyCertificatePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import NotFoundPage from './pages/NotFoundPage';

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

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import StudentMaterialsPage from './pages/StudentMaterialsPage';
import StudentFinancePage from './pages/StudentFinancePage';
import StudentMenuPage from './pages/StudentMenuPage';

function App() {
  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 3000, className: 'text-sm font-medium' }} />
      
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify" element={<VerifyCertificatePage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPasswordPage />} />
        <Route path="/" element={<RootRedirect />} />
        
        {/* --- App Wrapper (Layout + Navigation) --- */}
        <Route element={<AppLayout />}>
          
          {/* --- Admin / Teacher Section --- */}
          <Route path="/admin">
             <Route path="dashboard" element={<ProtectedRoute staffOnly={true}><AdminDashboard /></ProtectedRoute>} />
             <Route path="students" element={<ProtectedRoute staffOnly={true}><StudentListPage /></ProtectedRoute>} />
             <Route path="students/:id" element={<ProtectedRoute staffOnly={true}><StudentDetailPage /></ProtectedRoute>} />
             <Route path="courses" element={<ProtectedRoute staffOnly={true}><CourseManagementPage /></ProtectedRoute>} />
             <Route path="finance" element={<ProtectedRoute staffOnly={true}><ReceiptManagementPage /></ProtectedRoute>} />
             <Route path="attendance" element={<ProtectedRoute staffOnly={true}><AttendancePage /></ProtectedRoute>} />
             <Route path="certificates" element={<ProtectedRoute staffOnly={true}><CertificateManagementPage /></ProtectedRoute>} />
             <Route path="materials" element={<ProtectedRoute staffOnly={true}><AdminCourseMaterialsPage /></ProtectedRoute>} />
             <Route path="menu" element={<ProtectedRoute staffOnly={true}><AdminMenuPage /></ProtectedRoute>} />
             {/* Profile / Settings */}
             <Route path="profile" element={<ProtectedRoute staffOnly={true}><AccountSettings /></ProtectedRoute>} />
          </Route>

          {/* --- Student Section --- */}
          <Route path="/student">
             <Route path="home" element={<ProtectedRoute studentOnly={true}><StudentDashboard /></ProtectedRoute>} />
             <Route path="materials" element={<ProtectedRoute studentOnly={true}><StudentMaterialsPage /></ProtectedRoute>} />
             <Route path="finance" element={<ProtectedRoute studentOnly={true}><StudentFinancePage /></ProtectedRoute>} />
             <Route path="profile" element={<ProtectedRoute studentOnly={true}><StudentMenuPage /></ProtectedRoute>} />
             {/* Student Settings (Optional, reused component) */}
             <Route path="settings" element={<ProtectedRoute studentOnly={true}><AccountSettings /></ProtectedRoute>} />
          </Route>
          
        </Route>

        {/* --- 404 --- */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <HomePage />;
  return user.is_staff ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/student/home" replace />;
}

export default App;