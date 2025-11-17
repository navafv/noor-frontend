import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, studentOnly = false, staffOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-primary-600">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  // 1. Not Logged In -> Redirect to Login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const isAdmin = user.is_staff;

  // 2. Admin trying to access Student pages
  if (studentOnly && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // 3. Student trying to access Admin pages
  if (staffOnly && !isAdmin) {
    return <Navigate to="/student/home" replace />;
  }

  // 4. Authorized
  return children;
};

export default ProtectedRoute;