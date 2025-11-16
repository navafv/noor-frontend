import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext.jsx'; 
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, studentOnly = false, teacherOnly = false, adminOnly = false, staffOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
         <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  // 1. Check if user is logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Define user roles from backend fields
  const isStudent = !user.is_staff;
  const isTeacher = user.is_staff && !user.is_superuser;
  const isAdmin = user.is_superuser;

  // 3. Student-only route
  if (studentOnly && !isStudent) {
    // A non-student (Admin or Teacher) is trying to access a student-only route
    return <Navigate to={isAdmin ? "/admin/dashboard" : "/teacher/dashboard"} replace />;
  }
  
  // 4. Teacher-only route
  if (teacherOnly && !isTeacher) {
    // A non-teacher (Admin or Student) is trying to access a teacher-only route
    return <Navigate to={isAdmin ? "/admin/dashboard" : "/student/dashboard"} replace />;
  }

  // 5. Admin-only route
  if (adminOnly && !isAdmin) {
    // A non-admin (Teacher or Student) is trying to access an admin-only route
    return <Navigate to={isTeacher ? "/teacher/dashboard" : "/student/dashboard"} replace />;
  }
  
  // 6. General staff route (for shared pages like Attendance)
  // This allows *both* Teachers and Admins
  if (staffOnly && !user.is_staff) {
     // A student is trying to access a staff-only route
     return <Navigate to="/student/dashboard" replace />;
  }

  // If all checks pass, show the page
  return children;
};

export default ProtectedRoute;