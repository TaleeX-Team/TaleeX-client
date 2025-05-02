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
import {useUser} from "@/hooks/useUser.js";
import Interview from "@/features/interview/Interview.jsx";

// Lazy pages
const Auth = lazy(() => import("./features/auth/Auth.jsx"));
const ForgetPassword = lazy(() =>
    import("./features/auth/password/ForgetPassword.jsx")
);

// Admin Auth pages (lazy loaded)
const AdminSignIn = lazy(() => import("./features/admin/auth/AdminSignIn.jsx"));
const AdminForgetPassword = lazy(() => import("./features/admin/auth/AdminForgetPassword.jsx"));
const AdminSetPassword = lazy(() => import("./features/admin/auth/AdminResetPassword.jsx"));

// Admin pages (lazy loaded)
const AdminLayout = lazy(() => import("./layouts/AdminLayout.jsx"));
const AdminDashboard = lazy(() =>
    import("./features/admin/AdminDashboard.jsx")
);
const UsersPage = lazy(() => import("./features/admin/pages/UsersPage.jsx"));
const ContentManagement = lazy(() =>
    import("./features/admin/ContentManagement.jsx")
);
const JobsPage = lazy(() => import("./features/admin/pages/JobsPage.jsx"));
const CompaniesPage = lazy(() =>
    import("./features/admin/pages/CompaniesPage.jsx")
);
const AnalyticsPage = lazy(() =>
    import("./features/admin/pages/AnalyticsPage.jsx")
);
const SettingsPage = lazy(() =>
    import("./features/admin/pages/SettingsPage.jsx")
);
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


const AdminAuthLayout = () => (
    <BackgroundWrapper>
        <div className="min-h-screen">
            <Outlet/>
        </div>
    </BackgroundWrapper>
);

// Root level redirect based on user role
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

    // Otherwise, go to user home
    return <Navigate to="/" replace/>;
};

// Public route (login pages)
const PublicRoute = ({children, adminRedirect = "/admin", userRedirect = "/"}) => {
    const {isAuthenticated, isLoading} = useAuth();
    const {data: user, isLoading: isUserLoading} = useUser();

    if (isLoading || isUserLoading) return <FullPageSpinner/>;

    // If authenticated, redirect based on role
    if (isAuthenticated) {
        if (user?.role === "admin") {
            return <Navigate to={adminRedirect} replace/>;
        }
        return <Navigate to={userRedirect} replace/>;
    }

    return <>{children}</>;
};

// Regular user routes - admins should not access these
const UserRoute = ({children}) => {
    const {isAuthenticated, isLoading} = useAuth();
    const {data: user, isLoading: isUserLoading} = useUser();
    const location = useLocation();

    if (isLoading || isUserLoading) return <FullPageSpinner/>;

    if (!isAuthenticated) {
        return (
            <Navigate to="/auth" replace state={{from: location.pathname}}/>
        );
    }

    // If admin tries to access user routes, redirect to admin dashboard
    if (user?.role === "admin") {
        return <Navigate to="/admin" replace/>;
    }

    return <>{children}</>;
};

// Admin routes - only admins can access
const AdminRoute = ({children}) => {
    const {isAuthenticated, isLoading} = useAuth();
    const {data: user, isLoading: isUserLoading} = useUser();
    const location = useLocation();

    if (isLoading || isUserLoading) return <FullPageSpinner/>;

    // If not authenticated, go to admin login
    if (!isAuthenticated) {
        return <Navigate to="/admin/auth" replace state={{from: location.pathname}}/>;
    }

    // If not admin, redirect to appropriate home based on authentication
    if (user?.role !== "admin") {
        return <Navigate to="/" replace/>;
    }


    return <>{children}</>;
};

const ErrorPage = ({error}) => {
    const location = useLocation();
    const {data: user} = useUser();
    const message = error ?? location.state?.error ?? "We couldn't find that page.";

    // Determine where "home" is based on user role
    const homeLink = user?.role === "admin" ? "/admin" : "/";

    return (
        <BackgroundWrapper>
            <div className="min-h-screen flex items-center justify-center flex-col gap-4">
                <h1 className="text-2xl font-bold text-red-600">Oops!</h1>
                <p className="text-gray-600 max-w-md text-center">{message}</p>
                <Button asChild>
                    <a href={homeLink}>Go Home</a>
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


const AdminLayoutWithBackground = () => (
    <Suspense fallback={<FullPageSpinner/>}>
        <AdminLayout>
            <Outlet/>
        </AdminLayout>
    </Suspense>
);

function App() {
    const [router] = useState(() =>
        createBrowserRouter([
            {
                element: (
                    <UserRoute>
                        <ProtectedLayoutWithBackground/>
                    </UserRoute>
                ),
                errorElement: <ErrorPage/>,
                children: [
                    {
                        path: "/",
                        element: <Home/>,
                    },

                ],
            },
            {
                path: "interview",
                element: (
                    <Suspense fallback={<FullPageSpinner/>}>
                        <Interview/>
                    </Suspense>
                ),
            },
            // User settings routes
            {
                element: (
                    <UserRoute>
                        <SettingsLayoutWithBackground/>
                    </UserRoute>
                ),
                path: "/settings",
                errorElement: <ErrorPage/>,
                children: [
                    {
                        path: "profile",
                        element: (
                            <Suspense fallback={<FullPageSpinner/>}>
                                <ProfilePage/>
                            </Suspense>
                        ),
                    },
                    {
                        path: "billing",
                        element: (
                            <Suspense fallback={<FullPageSpinner/>}>
                                <BillingPage/>
                            </Suspense>
                        ),
                    }, {
                        path: "set-password",
                        element: (
                            <Suspense fallback={<FullPageSpinner/>}>
                                <SetPassword/>
                            </Suspense>
                        ),
                    }, {
                        path: "change-password",
                        element: (
                            <Suspense fallback={<FullPageSpinner/>}>
                                <ChangePasswordPage/>
                            </Suspense>
                        ),
                    },
                ],
            },
            // Admin Auth Routes
            {
                path: "/admin/auth",
                element: <AdminAuthLayout/>,
                errorElement: <ErrorPage/>,
                children: [
                    {
                        index: true,
                        element: (
                            <Suspense fallback={<FullPageSpinner/>}>
                                <PublicRoute adminRedirect="/admin" userRedirect="/">
                                    <AdminSignIn/>
                                </PublicRoute>
                            </Suspense>
                        ),
                    },
                    {
                        path: "forgot-password",
                        element: (
                            <Suspense fallback={<FullPageSpinner/>}>
                                <PublicRoute adminRedirect="/admin" userRedirect="/">
                                    <AdminForgetPassword/>
                                </PublicRoute>
                            </Suspense>
                        ),
                    },
                    {
                        path: "reset-password/:verificationToken",
                        element: (
                            <Suspense fallback={<FullPageSpinner/>}>
                                <PublicRoute adminRedirect="/admin" userRedirect="/">
                                    <AdminSetPassword/>
                                </PublicRoute>
                            </Suspense>
                        ),
                    },
                ],
            },
            // Admin Dashboard Routes
            {
                element: (
                    <AdminRoute>
                        <AdminLayoutWithBackground/>
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
            // User Auth Routes
            {
                element: <AuthLayout/>,
                errorElement: <ErrorPage/>,
                children: [
                    {
                        path: "/auth",
                        element: (
                            <Suspense fallback={<FullPageSpinner/>}>
                                <PublicRoute adminRedirect="/admin" userRedirect="/">
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
                    <RouterProvider router={router}/>
                </Suspense>
                <Toaster/>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;