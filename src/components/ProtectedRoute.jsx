import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext.jsx'; 
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, studentOnly = false, staffOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
         <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const isStudent = !user.is_staff;
  const isStaff = user.is_staff;

  if (studentOnly && !isStudent) {
    // A staff member is trying to access a student-only route
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  if (staffOnly && !isStaff) {
     // A student is trying to access a staff-only route
     return <Navigate to="/student/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;