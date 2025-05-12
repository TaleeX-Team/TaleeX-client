import AdminRouteProtector from "./AdminRouteProtector";
import { Outlet } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import FullPageSpinner from "@/components/FullPageSpinner";
import ErrorPage from "@/pages/ErrorPage";
import TokenManagementPage from "@/features/admin/pages/TokenManagementPage.jsx";

// Admin Auth pages (lazy loaded)

// Admin pages (lazy loaded)
const AdminLayout = lazy(() => import("../../layouts/AdminLayout.jsx"));
const AdminDashboard = lazy(() =>
  import("../../features/admin/AdminDashboard.jsx")
);
const UsersPage = lazy(() =>
  import("../../features/admin/pages/UsersPage.jsx")
);
const ReportsPage = lazy(() =>
  import("../../features/admin/pages/ReportsPage.jsx")
);
const JobsPage = lazy(() => import("../../features/admin/pages/JobsPage.jsx"));
const CompaniesPage = lazy(() =>
  import("../../features/admin/pages/CompaniesPage.jsx")
);
const AnalyticsPage = lazy(() =>
  import("../../features/admin/pages/AnalyticsPage.jsx")
);
const SettingsPage = lazy(() =>
  import("../../features/admin/pages/SettingsPage.jsx")
);
const PlansPage = lazy(() =>
  import("../../features/admin/pages/TokenManagementPage.jsx")
);
const AdminRoutes = {
  path: "/admin",
  element: (
    <AdminRouteProtector>
      <Suspense fallback={<FullPageSpinner />}>
        <AdminLayout>
          <Outlet />
        </AdminLayout>
      </Suspense>
    </AdminRouteProtector>
  ),
  errorElement: <ErrorPage error="Admin access required." />,
  children: [
    {
      index: true,
      element: (
        <Suspense fallback={<FullPageSpinner />}>
          <AdminDashboard />
        </Suspense>
      ),
    },
    {
      path: "users",
      element: (
        <Suspense fallback={<FullPageSpinner />}>
          <UsersPage />
        </Suspense>
      ),
    },
    {
      path: "jobs",
      element: (
        <Suspense fallback={<FullPageSpinner />}>
          <JobsPage />
        </Suspense>
      ),
    },
    {
      path: "companies",
      element: (
        <Suspense fallback={<FullPageSpinner />}>
          <CompaniesPage />
        </Suspense>
      ),
    },
    {
      path: "reports",
      element: (
        <Suspense fallback={<FullPageSpinner />}>
          <ReportsPage />
        </Suspense>
      ),
    },
    {
      path: "analytics",
      element: (
        <Suspense fallback={<FullPageSpinner />}>
          <AnalyticsPage />
        </Suspense>
      ),
    },
    {
      path: "plans",
      element: (
        <Suspense fallback={<FullPageSpinner />}>
          <TokenManagementPage />
        </Suspense>
      ),
    },
    {
      path: "settings",
      element: (
        <Suspense fallback={<FullPageSpinner />}>
          <SettingsPage />
        </Suspense>
      ),
    },
    {
      path: "*",
      element: <ErrorPage error="That admin page doesn't exist." />,
    },
  ],
};

export default AdminRoutes;
