
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requireAdmin?: boolean;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { user, isLoading, isAdmin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('ProtectedRoute state:', { 
      path: location.pathname,
      isLoading, 
      isAuthenticated: !!user, 
      isAdmin,
      requireAdmin 
    });
  }, [isLoading, user, isAdmin, requireAdmin, location.pathname]);

  // Check if the auth state is still loading
  if (isLoading) {
    console.log('Auth is still loading...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-ems-600 mx-auto"></div>
          <p className="mt-4 text-ems-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    console.log('User not authenticated, redirecting to login');
    // Save the attempted URL to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If admin access is required but user is not admin
  if (requireAdmin && !isAdmin) {
    console.log('Admin access required but user is not admin');
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated, render the protected component
  console.log('User authenticated, rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute;
