import React, { lazy, Suspense, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  useLocation,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/layouts/theme_provider/ThemeProvider.jsx";
import { useAuth } from "@/hooks/useAuth.js";
import FullPageSpinner from "@/components/FullPageSpinner";
import SettingsLayout from "@/layouts/SettingsLayout.jsx";
import ProfilePage from "@/features/settings/profile/Profile.jsx";
import BillingPage from "@/features/settings/billing/Billing.jsx";

import { AnimatedBackground } from "./components/AnimatedBackground";
import SetPassword from "@/features/settings/set-password/SetPassword.jsx";
import ChangePasswordPage from "@/features/settings/change-password/ChangePasswordPage.jsx";
import { useUser } from "@/hooks/useUser.js";

import UserRoutes from "./routes/user-routes/UserRoutes";
import PublicRoutes from "./routes/public-routes/PublicRoutes";
import AdminRoutes from "./routes/admin-routes/AdminRoutes";
import ErrorPage from "./pages/ErrorPage";
import Interview from "./features/interview/Interview";

// Lazy pages

// Admin Auth pages (lazy loaded)
const AdminSignIn = lazy(() => import("./features/admin/auth/AdminSignIn.jsx"));
const AdminForgetPassword = lazy(() =>
  import("./features/admin/auth/AdminForgetPassword.jsx")
);
const AdminSetPassword = lazy(() =>
  import("./features/admin/auth/AdminResetPassword.jsx")
);

const BackgroundWrapper = ({ children }) => {
  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

const AdminAuthLayout = () => (
  <BackgroundWrapper>
    <div className="min-h-screen">
      <Outlet />
    </div>
  </BackgroundWrapper>
);

// Root level redirect based on user role
const RootRedirect = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { data: user, isLoading: isUserLoading } = useUser();

  if (isLoading || isUserLoading) return <FullPageSpinner />;

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // If admin, redirect to admin dashboard
  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  // Otherwise, go to user home - now directly to companies
  return <Navigate to="/app/companies" replace />;
};

// Public route (login pages)
const PublicRoute = ({
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

// Regular user routes - admins should not access these

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5m
      retry: 1,
    },
  },
});

function App() {
  const [router] = useState(() =>
    createBrowserRouter([
      // Root redirect
      {
        path: "/",
        element: <RootRedirect />,
      },

      // Protected user routes
      UserRoutes,

      // Admin Auth Routes
      {
        path: "/admin/auth",
        element: <AdminAuthLayout />,
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<FullPageSpinner />}>
                <PublicRoute
                  adminRedirect="/admin"
                  userRedirect="/app/companies"
                >
                  <AdminSignIn />
                </PublicRoute>
              </Suspense>
            ),
          },
          {
            path: "forgot-password",
            element: (
              <Suspense fallback={<FullPageSpinner />}>
                <PublicRoute
                  adminRedirect="/admin"
                  userRedirect="/app/companies"
                >
                  <AdminForgetPassword />
                </PublicRoute>
              </Suspense>
            ),
          },
          {
            path: "reset-password/:verificationToken",
            element: (
              <Suspense fallback={<FullPageSpinner />}>
                <PublicRoute
                  adminRedirect="/admin"
                  userRedirect="/app/companies"
                >
                  <AdminSetPassword />
                </PublicRoute>
              </Suspense>
            ),
          },
        ],
      },

      // Admin Dashboard Routes
      AdminRoutes,
      // User Auth Routes
      PublicRoutes,
      {
        path: "interview",
        element: (
          <Suspense fallback={<FullPageSpinner />}>
            <Interview />
          </Suspense>
        ),
      },
      // Catch-all route
      {
        path: "*",
        element: <ErrorPage error="Page not found." />,
      },
    ])
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider storageKey="app-theme">
        <ReactQueryDevtools initialIsOpen={false} />
        <Suspense fallback={<FullPageSpinner />}>
          <RouterProvider router={router} />
        </Suspense>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
