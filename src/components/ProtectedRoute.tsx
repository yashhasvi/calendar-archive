import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true, 
  adminOnly = false 
}) => {
  const { currentUser, isGuest } = useAuth();

  if (requireAuth && !currentUser && !isGuest) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && (!currentUser || currentUser.role !== 'admin')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
