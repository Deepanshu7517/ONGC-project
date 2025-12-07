import React from "react";

import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../config/useAuth"; // Assuming you have a hook to get the auth state

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth(); // 'loading' state is crucial for Firebase

  // Wait for the auth state to be loaded from Firebase

  if (loading) {
    return <div>Loading...</div>;
  }

  // If user is not authenticated, redirect to the login page

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child routes or components

  return children ? children : <Outlet />;
};

export default PrivateRoute;
