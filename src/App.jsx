import React, {lazy, Suspense, useState} from "react";
import {
    createBrowserRouter,
    RouterProvider,
    Outlet,
    Navigate,
    useLocation,
} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {Toaster} from "@/components/ui/sonner";
import {Button} from "@/components/ui/button";
import ProtectedLayout from "./layouts/ProtectedLayout";
import {ThemeProvider} from "@/layouts/theme_provider/ThemeProvider.jsx";
import {useAuth} from "@/hooks/useAuth.js";
import FullPageSpinner from "@/components/FullPageSpinner";
import ResetPassword from "@/features/auth/password/ResetPassword.jsx";
import SettingsLayout from "@/layouts/SettingsLayout.jsx";
import ProfilePage from "@/features/settings/profile/Profile.jsx";
import BillingPage from "@/features/settings/billing/Billing.jsx";
import OAuthCallback from "@/components/OAuthCallback.jsx";
import Home from "@/features/home/Home.jsx";
import {AnimatedBackground} from "./components/AnimatedBackground";
import SetPassword from "@/features/settings/set-password/SetPassword.jsx";
import ChangePasswordPage from "@/features/settings/change-password/ChangePasswordPage.jsx";
// Lazy pages
const Auth = lazy(() => import("./features/auth/Auth.jsx"));
const ForgetPassword = lazy(() =>
    import("./features/auth/password/ForgetPassword.jsx")
);

// Admin pages (lazy loaded)
const AdminLayout = lazy(() => import("./layouts/AdminLayout.jsx"));
const AdminDashboard = lazy(() => import("./features/admin/AdminDashboard.jsx"));
const UsersPage = lazy(() => import("./features/admin/pages/UsersPage.jsx"));
const ContentManagement = lazy(() => import("./features/admin/ContentManagement.jsx"));
const JobsPage = lazy(() => import("./features/admin/pages/JobsPage.jsx"));
const CreateJob = lazy(() => import("./features/jobs/addJob/CreateJob.jsx"));
const CompaniesPage = lazy(() => import("./features/admin/pages/CompaniesPage.jsx"));
const AnalyticsPage = lazy(() => import("./features/admin/pages/AnalyticsPage.jsx"));
const SettingsPage = lazy(() => import("./features/admin/pages/SettingsPage.jsx"));
const PlansPage = lazy(() => import("./features/admin/pages/PlansPage.jsx"));


const BackgroundWrapper = ({children}) => {
    return (
        <div className="relative min-h-screen">
            <AnimatedBackground/>
            <div className="relative z-10">{children}</div>
        </div>
    );
};

const AuthLayout = () => (
    <BackgroundWrapper>
        <div className="min-h-screen">
            <Outlet/>
        </div>
    </BackgroundWrapper>
);

const PublicRoute = ({children, redirectPath = "/"}) => {
    const {isAuthenticated, isLoading} = useAuth();

    if (isLoading) return <FullPageSpinner/>;

    return isAuthenticated ? (
        <Navigate to={redirectPath} replace/>
    ) : (
        <>{children}</>
    );
};

const ProtectedRoute = ({children, redirectPath = "/auth"}) => {
    const {isAuthenticated, isLoading} = useAuth();
    const location = useLocation();

    if (isLoading) return <FullPageSpinner/>;

    if (!isAuthenticated) {
        return (
            <Navigate to={redirectPath} replace state={{from: location.pathname}}/>
        );
    }

    return <>{children}</>;
};

const AdminRoute = ({children, redirectPath = "/"}) => {
    const {isAuthenticated, isLoading, user} = useAuth();
    const location = useLocation();

    if (isLoading) return <FullPageSpinner/>;

    // Uncomment when ready to enforce admin role check
    // if (!isAuthenticated) {
    //     return (
    //         <Navigate to="/auth" replace state={{from: location.pathname}}/>
    //     );
    // }
    //
    // // Check if user has admin role
    // if (user?.role !== "admin") {
    //     return <Navigate to={redirectPath} replace/>;
    // }

    return <>{children}</>;
};

const ErrorPage = ({error}) => {
    const location = useLocation();
    const message =
        error ?? location.state?.error ?? "We couldn't find that page.";

    return (
        <BackgroundWrapper>
            <div className="min-h-screen flex items-center justify-center flex-col gap-4">
                <h1 className="text-2xl font-bold text-red-600">Oops!</h1>
                <p className="text-gray-600 max-w-md text-center">{message}</p>
                <Button asChild>
                    <a href="/">Go Home</a>
                </Button>
            </div>
        </BackgroundWrapper>
    );
};

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5m
            retry: 1,
        },
    },
});

// Wrapper for ProtectedLayout with background
const ProtectedLayoutWithBackground = () => (
    <BackgroundWrapper>
        <ProtectedLayout/>
    </BackgroundWrapper>
);

// Wrapper for SettingsLayout with background
const SettingsLayoutWithBackground = () => (
    <BackgroundWrapper>
        <SettingsLayout/>
    </BackgroundWrapper>
);

const AdminLayoutWithBackground = ({ children }) => (
    <Suspense fallback={<FullPageSpinner/>}>
        <AdminLayout>
            {children}
        </AdminLayout>
    </Suspense>
);

// Create a placeholder component for routes that haven't been implemented yet
const ComingSoonPage = ({ feature }) => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-4">
        <h1 className="text-3xl font-bold mb-4">{feature} Coming Soon</h1>
        <p className="text-gray-600 max-w-md">
            This feature is currently under development and will be available soon.
        </p>
    </div>
);

function App() {
    const [router] = useState(() =>
        createBrowserRouter([
            {
                element: (
                    <ProtectedRoute>
                        <ProtectedLayoutWithBackground/>
                      </ProtectedRoute>
                ),
                errorElement: <ErrorPage/>,
                children: [
                    {
                        path: "/",
                        element: <Home/>,
                    },
                  //   {
                  //     path: "create-job", 
                  //     element: <CreateJob />
                  // }
                ],
            },
            {
                element: (
                    <ProtectedRoute>
                        <SettingsLayoutWithBackground/>
                    </ProtectedRoute>
                ),
                path: "/settings",
                errorElement: <ErrorPage/>,
                children: [
                    {
                        path: "profile",
                        element: (
                            <Suspense
                                fallback={
                                    <div className="min-h-screen flex items-center justify-center">
                                        Loading...
                                    </div>
                                }
                            >
                                <ProfilePage/>
                            </Suspense>
                        ),
                    },
                    {
                        path: "billing",
                        element: (
                            <Suspense
                                fallback={
                                    <div className="min-h-screen flex items-center justify-center">
                                        Loading...
                                    </div>
                                }
                            >
                                <BillingPage/>
                            </Suspense>
                        ),
                    }, {
                        path: "set-password",
                        element: (
                            <Suspense
                                fallback={
                                    <div className="min-h-screen flex items-center justify-center">
                                        Loading...
                                    </div>
                                }
                            >
                                <SetPassword/>
                            </Suspense>
                        ),
                    }, {
                        path: "change-password",
                        element: (
                            <Suspense
                                fallback={
                                    <div className="min-h-screen flex items-center justify-center">
                                        Loading...
                                    </div>
                                }
                            >
                                <ChangePasswordPage/>
                            </Suspense>
                        ),
                    },
                ],
            },
            // Admin Dashboard Routes
            {
                element: (
                    <AdminRoute>
                        <AdminLayoutWithBackground>
                            <Outlet />
                        </AdminLayoutWithBackground>
                    </AdminRoute>
                ),
                path: "/admin",
                errorElement: <ErrorPage error="Admin access required."/>,
                children: [
                    {
                        index: true,
                        element: (
                            <Suspense fallback={<FullPageSpinner/>}>
                                <AdminDashboard/>
                            </Suspense>
                        ),
                    },
                    {
                        path: "users",
                        element: (
                            <Suspense fallback={<FullPageSpinner/>}>
                                <UsersPage/>
                            </Suspense>
                        ),
                    },
                    // Add Jobs route to match menu item
                    {
                        path: "jobs",
                        element: (
                            <Suspense fallback={<FullPageSpinner/>}>
                               <JobsPage/>
                            </Suspense>
                        ),
                    },
                    {
                        path: "companies",
                        element: (
                            <Suspense fallback={<FullPageSpinner/>}>
                                <CompaniesPage/>
                            </Suspense>
                        ),
                    },
                    // Content route (kept for backward compatibility)
                    {
                        path: "content",
                        element: (
                            <Suspense fallback={<FullPageSpinner/>}>
                                <ContentManagement/>
                            </Suspense>
                        ),
                    },
                    {
                        path: "analytics",
                        element: (
                            <Suspense fallback={<FullPageSpinner/>}>
                                <AnalyticsPage/>
                            </Suspense>
                        ),
                    },
                    // Add Plans route to match menu item
                    {
                        path: "plans",
                        element: (
                            <Suspense fallback={<FullPageSpinner/>}>
                                <PlansPage/>
                            </Suspense>
                        ),
                    },
                    {
                        path: "settings",
                        element: (
                            <Suspense fallback={<FullPageSpinner/>}>
                                <SettingsPage/>
                            </Suspense>
                        ),
                    },
                    {
                        path: "*",
                        element: <ErrorPage error="That admin page doesn't exist."/>,
                    },
                ],
            },
            {
                element: <AuthLayout/>,
                errorElement: <ErrorPage/>,
                children: [
                    {
                        path: "/auth",
                        element: (
                            <Suspense fallback={<FullPageSpinner/>}>
                                <PublicRoute>
                                    <AuthLayout/>
                                </PublicRoute>
                            </Suspense>
                        ),
                        errorElement: <ErrorPage/>,
                        children: [
                            {
                                index: true,
                                element: (
                                    <Suspense fallback={<FullPageSpinner/>}>
                                        <Auth/>
                                    </Suspense>
                                ),
                            },
                            {
                                path: "forget-password",
                                element: (
                                    <Suspense fallback={<FullPageSpinner/>}>
                                        <ForgetPassword/>
                                    </Suspense>
                                ),
                            },
                            {
                                path: "reset-password/:verificationToken",
                                element: (
                                    <Suspense fallback={<FullPageSpinner/>}>
                                        <ResetPassword/>
                                    </Suspense>
                                ),
                            },
                            {
                                path: "callback",
                                element: <OAuthCallback/>,
                            },
                            {
                                path: "*",
                                element: <ErrorPage error="That auth page doesn't exist."/>,
                            },
                        ],
                    },
                ],
            },
        ])
    );

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider storageKey="app-theme">
                <ReactQueryDevtools initialIsOpen={false}/>
                <Suspense fallback={<FullPageSpinner/>}>
                    <RouterProvider router={router}/>
                </Suspense>
                <Toaster/>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;