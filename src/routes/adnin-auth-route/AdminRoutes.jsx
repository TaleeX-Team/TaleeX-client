import FullPageSpinner from "@/components/FullPageSpinner.jsx";
import ErrorPage from "@/pages/ErrorPage.jsx";
import React, { lazy, Suspense } from "react";
import PublicRouteProtector from "../public-routes/PublicRouteProtector.jsx";
import { Outlet } from "react-router-dom";
const AdminSignIn = lazy(() => import("@/features/admin/auth/AdminSignIn.jsx"));
const AdminForgetPassword = lazy(() =>
  import("@/features/admin/auth/AdminForgetPassword.jsx")
);
const AdminSetPassword = lazy(() =>
  import("@/features/admin/auth/AdminResetPassword.jsx")
);

const AdminAuthRoutes = {
  path: "/admin/auth",
  element: (
    <div className="min-h-screen">
      <Outlet />
    </div>
  ),
  errorElement: <ErrorPage />,
  children: [
    {
      index: true,
      element: (
        <Suspense fallback={<FullPageSpinner />}>
          <PublicRouteProtector
            adminRedirect="/admin"
            userRedirect="/app/companies"
          >
            <AdminSignIn />
          </PublicRouteProtector>
        </Suspense>
      ),
    },
    {
      path: "forgot-password",
      element: (
        <Suspense fallback={<FullPageSpinner />}>
          <PublicRouteProtector
            adminRedirect="/admin"
            userRedirect="/app/companies"
          >
            <AdminForgetPassword />
          </PublicRouteProtector>
        </Suspense>
      ),
    },
    {
      path: "reset-password/:verificationToken",
      element: (
        <Suspense fallback={<FullPageSpinner />}>
          <PublicRouteProtector
            adminRedirect="/admin"
            userRedirect="/app/companies"
          >
            <AdminSetPassword />
          </PublicRouteProtector>
        </Suspense>
      ),
    },
  ],
};
export default AdminAuthRoutes;
