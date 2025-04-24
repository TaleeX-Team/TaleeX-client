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

// Lazy pages
const Home = lazy(() => import("./features/home/Home.jsx"));
const Auth = lazy(() => import("./features/auth/Auth.jsx"));
const ForgetPassword = lazy(
    () => import("./features/auth/password/ForgetPassword.jsx")
);


const AuthLayout = () => (
    <div className="min-h-screen">
        <Outlet/>
    </div>
);
const PublicRoute = ({children, redirectPath = "/"}) => {
    const {isAuthenticated, isLoading} = useAuth();

    if (isLoading) return <FullPageSpinner/>;

    return isAuthenticated ? <Navigate to={redirectPath} replace/> : <>{children}</>;
};
const ProtectedRoute = ({children, redirectPath = "/auth"}) => {
    const {isAuthenticated, isLoading} = useAuth();
    const location = useLocation();

    if (isLoading) return <FullPageSpinner/>;

    if (!isAuthenticated) {
        return (
            <Navigate
                to={redirectPath}
                replace
                state={{from: location.pathname}}
            />
        );
    }

    return <>{children}</>;
};


const ErrorPage = ({error}) => {
    const location = useLocation();
    const message =
        error ?? location.state?.error ?? "We couldn't find that page.";

    return (
        <div className="min-h-screen flex items-center justify-center flex-col gap-4">
            <h1 className="text-2xl font-bold text-red-600">Oops!</h1>
            <p className="text-gray-600 max-w-md text-center">{message}</p>
            <Button asChild>
                <a href="/">Go Home</a>
            </Button>
        </div>
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
function App() {
    const [router] = useState(() =>
        createBrowserRouter([
            {
                element: (
                    <ProtectedRoute>
                        <ProtectedLayout/>
                    </ProtectedRoute>
                ),
                errorElement: <ErrorPage/>,
                children: [
                    {
                        path: "/",
                        element: (
                            <Suspense
                                fallback={
                                    <div className="min-h-screen flex items-center justify-center">
                                        Loading...
                                    </div>
                                }
                            >
                                <Home/>
                            </Suspense>
                        ),
                    },
                ],
            },
            {
                element: (
                    <ProtectedRoute>
                        <SettingsLayout/>
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
                                element: <ErrorPage error="That auth page doesn’t exist."/>,
                            },
                        ],
                    },
                ],
            },
        ]));


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
