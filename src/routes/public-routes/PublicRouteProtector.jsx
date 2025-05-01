import FullPageSpinner from "@/components/FullPageSpinner";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const PublicRouteProtector = ({
  children,
  adminRedirect = "/admin",
  userRedirect = "/app/companies",
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { data: user, isLoading: isUserLoading } = useUser();
  const location = useLocation();
  const from = location.state?.from || "";

  if (isLoading || isUserLoading) return <FullPageSpinner />;

  // If authenticated, redirect based on role
  if (isAuthenticated) {
    // If there's a saved location, redirect there
    if (from) {
      return <Navigate to={from} replace />;
    }

    // Otherwise redirect to default location based on role
    if (user?.role === "admin") {
      return <Navigate to={adminRedirect} replace />;
    }
    return <Navigate to={userRedirect} replace />;
  }

  return <>{children}</>;
};
export default PublicRouteProtector;
