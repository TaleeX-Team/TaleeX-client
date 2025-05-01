import ProtectedLayout from "@/layouts/ProtectedLayout";
import UserRouteProtector from "./UserRouteProtector";
import Companies from "@/features/companies/Companies";
import CompanyDetails from "@/features/companies/company-details";
import Home from "@/features/home/Home";
import ErrorPage from "@/pages/ErrorPage";

const AppRedirect = () => {
  return <Navigate to="/app/companies" replace />;
};

const UserRoutes = {
  path: "/app",
  element: (
    <UserRouteProtector>
      <ProtectedLayout />
    </UserRouteProtector>
  ),
  errorElement: <ErrorPage />,
  children: [
    {
      index: true,
      element: <AppRedirect />, // Redirect /app to /app/companies
    },
    {
      path: "companies",
      children: [
        {
          index: true,
          element: <Companies />, // Show companies list at /app/companies
        },
        {
          path: ":companyId", // Company details as child of companies
          element: <CompanyDetails />,
        },
      ],
    },
    // Keep home route but make it accessible via explicit path
    {
      path: "home",
      element: <Home />,
    },
  ],
};

export default UserRoutes;
