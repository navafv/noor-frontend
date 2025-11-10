import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Loader2 } from 'lucide-react';

function HomeRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    // Show a full-page loader while we check auth
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={48} />
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

  // Not logged in: Redirect to the public Home Page
  return <Navigate to="/home" replace />;
}

export default HomeRedirect;