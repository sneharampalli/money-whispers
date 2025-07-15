import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import React from 'react';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  // If user is null, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If we have a user, render the protected content
  return children;
};

export default ProtectedRoute;