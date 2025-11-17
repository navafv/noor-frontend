import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts & Auth
import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

// Public Pages
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage'; // Keep generic home or redirect

// Admin Pages (Teacher)
import AdminDashboard from './pages/AdminDashboard';
import StudentListPage from './pages/StudentListPage';
import StudentDetailPage from './pages/StudentDetailPage';
import CourseManagementPage from './pages/CourseManagementPage';
import ReceiptManagementPage from './pages/ReceiptManagementPage';
import AdminMenuPage from './pages/AdminMenuPage';
import AdminCourseMaterialsPage from './pages/AdminCourseMaterialsPage';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import StudentMaterialsPage from './pages/StudentMaterialsPage';
import StudentFinancePage from './pages/StudentFinancePage';
import StudentMenuPage from './pages/StudentMenuPage'; // Renamed from Profile for consistency

// Components
import MeasurementHistoryModal from './components/MeasurementHistoryModal'; // Example of keeping useful modals

function App() {
  return (
    <>
      <Toaster position="top-center" />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Root Redirect */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="/home" element={<HomePage />} />

        {/* --- Admin / Teacher Routes --- */}
        <Route element={<ProtectedRoute staffOnly={true}><AppLayout /></ProtectedRoute>}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<StudentListPage />} />
          <Route path="/admin/students/:id" element={<StudentDetailPage />} />
          <Route path="/admin/courses" element={<CourseManagementPage />} />
          <Route path="/admin/finance" element={<ReceiptManagementPage />} />
          <Route path="/admin/menu" element={<AdminMenuPage />} />
          <Route path="/admin/materials" element={<AdminCourseMaterialsPage />} />
        </Route>

        {/* --- Student Routes --- */}
        <Route element={<ProtectedRoute studentOnly={true}><AppLayout /></ProtectedRoute>}>
          <Route path="/student/home" element={<StudentDashboard />} />
          <Route path="/student/materials" element={<StudentMaterialsPage />} />
          <Route path="/student/finance" element={<StudentFinancePage />} />
          <Route path="/student/profile" element={<StudentMenuPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

// Helper to redirect based on login status
function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return user.is_staff ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/student/home" replace />;
}

export default App;