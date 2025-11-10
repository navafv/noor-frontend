import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Loader2 } from 'lucide-react';

// Add a new prop 'staffOnly'
const ProtectedRoute = ({ children, staffOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
         <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  // 1. Check if user is logged in
  if (!user) {
    // Redirect to login, but remember where they came from
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Check if the route is for staff only AND the user is not staff
  if (staffOnly && !user.is_staff) {
    // Logged in, but not staff. Send to their account page.
    return <Navigate to="/account" replace />;
  }
  
  // 3. Check if route is for students only (non-staff)
  // This is a new rule: if user is staff, don't let them go to /student/dashboard
  // Send them to their own admin dashboard.
  if (!staffOnly && user.is_staff) {
    return <Navigate to="/admin/dashboard" replace />
  }


  // If all checks pass, show the page
  return children;
};

export default ProtectedRoute;