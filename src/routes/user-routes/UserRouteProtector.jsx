import FullPageSpinner from "@/components/FullPageSpinner";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { Navigate, useLocation } from "react-router-dom";

const UserRouteProtector = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { data: user, isLoading: isUserLoading } = useUser();
  const location = useLocation();

  if (isLoading || isUserLoading) return <FullPageSpinner />;

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  // If admin tries to access user routes, redirect to admin dashboard
  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};
export default UserRouteProtector;
