import React, {Suspense, useState} from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import {
    createBrowserRouter,
    RouterProvider,
    Outlet,
    Navigate,
} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {Toaster} from "@/components/ui/sonner";
import {ThemeProvider} from "@/layouts/theme_provider/ThemeProvider.jsx";
import {useAuth} from "@/hooks/useAuth.js";
import FullPageSpinner from "@/components/FullPageSpinner";
import {useUser} from "@/hooks/useUser.js";
import UserRoutes from "./routes/user-routes/UserRoutes";
import PublicRoutes from "./routes/public-routes/PublicRoutes";
import AdminRoutes from "./routes/admin-routes/AdminRoutes";
import ErrorPage from "./pages/ErrorPage";
import Interview from "./features/interview/Interview";
import AdminAuthRoutes from "./routes/adnin-auth-route/AdminRoutes";
import JobApplicationPage from "@/features/jobs/form/JobApplicationPage.jsx";
import {InviteJob} from "@/features/jobs/inviteJob/InviteJob.jsx";
import {StartScreen} from "@/components/interview/StartScreen.jsx";
import VerifiedEmail from "@/features/auth/verified-email/VerifiedEmail.jsx";
import LandingPage from "@/features/landing_page/LandingPage.jsx";

const RootRedirect = () => {
    const {isAuthenticated, isLoading} = useAuth();
    const {data: user, isLoading: isUserLoading} = useUser();


    if (isLoading || isUserLoading) return <FullPageSpinner/>;

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace/>;
    }

    // If admin, redirect to admin dashboard
    if (user?.role === "admin") {
        return <Navigate to="/admin" replace/>;
    }

    // Otherwise, go to user home - now directly to companies
    return <Navigate to="/app/companies" replace/>;
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
// console.log("TESTING ENV:", import.meta.env.VITE_TEST_VAR);
const initialOptions = {
  "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
  currency: "USD"
};




function App() {
    const [router] = useState(() =>
        createBrowserRouter([
            // Root redirect
            {
                path: "/",
                element: <RootRedirect/>,
            },

            // Protected user routes
            UserRoutes,

            // Admin Auth Routes
            AdminAuthRoutes,
            // Admin Dashboard Routes
            AdminRoutes,
            // User Auth Routes
            PublicRoutes,
            {
                path: "/landing-page",
                element: <LandingPage/>,
            },
            {
                path: "verify-email/:verificationToken",
                element: (
                    <Suspense fallback={<FullPageSpinner />}>
                        <VerifiedEmail />
                    </Suspense>
                ),
            },
            {
                path: "interviews/:interviewId",
                element: (
                    <Suspense fallback={<FullPageSpinner/>}>
                        <StartScreen/>
                    </Suspense>
                ),
            },
            {
                path: "interviews/:interviewId/live",
                element: (
                    <Suspense fallback={<FullPageSpinner/>}>
                        <Interview/>
                    </Suspense>
                ),
            },
            {
                path: "jobs/:id/apply",
                element: <JobApplicationPage/>,
            },
            {
                path: "accept-invitation/:applicationId/:newJobId",
                element: <InviteJob/>,
            },
            // Catch-all route
            {
                path: "*",
                element: <ErrorPage error="Page not found."/>,
            },
        ])
    );

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider storageKey="app-theme">
                <ReactQueryDevtools initialIsOpen={false}/>
                <Suspense fallback={<FullPageSpinner/>}>
                <PayPalScriptProvider options={initialOptions}>
  <RouterProvider router={router} />
</PayPalScriptProvider>
                </Suspense>
                <Toaster/>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;
