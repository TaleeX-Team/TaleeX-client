import FullPageSpinner from "@/components/FullPageSpinner";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { Navigate, useLocation } from "react-router-dom";

const AdminRouteProtector = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { data: user, isLoading: isUserLoading } = useUser();
  const location = useLocation();

  if (isLoading || isUserLoading) return <FullPageSpinner />;

  // If not authenticated, go to admin login
  if (!isAuthenticated) {
    return (
      <Navigate to="/admin/auth" replace state={{ from: location.pathname }} />
    );
  }

  // If not admin, redirect to appropriate home based on authentication
  if (user?.role !== "admin") {
    return <Navigate to="/app/companies" replace />;
  }

  return <>{children}</>;
};
export default AdminRouteProtector;
