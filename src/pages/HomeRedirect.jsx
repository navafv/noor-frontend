import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

function HomeRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    // Show a full-page loader while we check auth
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-noor-pink" size={48} />
      </div>
    );
  }

  if (user) {
    // User is logged in, redirect to their dashboard
    return user.is_staff ? (
      <Navigate to="/admin/dashboard" replace />
    ) : (
      <Navigate to="/student/dashboard" replace />
    );
  }

  // Not logged in: Redirect to the Login page
  return <Navigate to="/login" replace />;
}

export default HomeRedirect;