import React, { lazy, Suspense } from "react";
import PublicRouteProtector from "./PublicRouteProtector";
import { Outlet } from "react-router-dom";
import ErrorPage from "@/pages/ErrorPage";
import ResetPassword from "@/features/auth/password/ResetPassword";
import OAuthCallback from "@/components/OAuthCallback";
import FullPageSpinner from "@/components/FullPageSpinner";
import VerifiedEmail from "@/features/auth/verified-email/VerifiedEmail.jsx";
const Auth = lazy(() => import("../../features/auth/Auth"));
const ForgetPassword = lazy(() =>
  import("../../features/auth/password/ForgetPassword.jsx")
);
const PublicRoutes = {
  path: "/auth",
  element: (
    <PublicRouteProtector adminRedirect="/admin" userRedirect="/app/companies">
      <div className="min-h-screen">
        <Outlet />
      </div>
    </PublicRouteProtector>
  ),
  errorElement: <ErrorPage />,
  children: [
    {
      index: true,
      element: (
        <Suspense fallback={<FullPageSpinner />}>
          <Auth />
        </Suspense>
      ),
    },
    {
      path: "forget-password",
      element: (
        <Suspense fallback={<FullPageSpinner />}>
          <ForgetPassword />
        </Suspense>
      ),
    },
    {
      path: "reset-password/:verificationToken",
      element: (
        <Suspense fallback={<FullPageSpinner />}>
          <ResetPassword />
        </Suspense>
      ),
    },
    {
      path: "callback",
      element: <OAuthCallback />,
    },
    {
      path: "*",
      element: <ErrorPage error="That auth page doesn't exist." />,
    },
  ],
};

export default PublicRoutes;
