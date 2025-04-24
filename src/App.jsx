import React, { lazy, Suspense, useEffect, useState } from "react";
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
import ProtectedLayout from "./layouts/ProtectedLayout";
import { ThemeProvider } from "@/layouts/theme_provider/ThemeProvider.jsx";
import { useAuth } from "@/hooks/useAuth.js";
import OAuthCallback from "@/components/OAuthCallback.jsx";
import FullPageSpinner from "@/components/FullPageSpinner";
import ResetPassword from "@/features/auth/password/ResetPassword.jsx";

// Lazy pages
const Home = lazy(() => import("./features/home/Home.jsx"));
const Auth = lazy(() => import("./features/auth/Auth.jsx"));
const ForgetPassword = lazy(
    () => import("./features/auth/password/ForgetPassword.jsx")
);



const AuthLayout= () => (
    <div className="min-h-screen">
        <Outlet />
    </div>
);

const ProtectedRoute = ({ children, redirectPath = "/auth" }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-700">Verifying authentication...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to={redirectPath}
                state={{ from: location.pathname }}
                replace
            />
        );
    }

    return <>{children}</>;
};


const ErrorPage = ({ error }) => {
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
                        <ProtectedLayout />
                    </ProtectedRoute>
                ),
                errorElement: <ErrorPage />,
                children: [
                    {
                        path: "/",
                        element: (
                            <Suspense fallback={<FullPageSpinner />}>
                                <Home />
                            </Suspense>
                        ),
                    },
                ],
            },
            {
                path: "/auth",
                element: (
                    <Suspense fallback={<FullPageSpinner />}>
                        <AuthLayout />
                    </Suspense>
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
                        path: "reset-password/:accessToken",
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
                        element: <ErrorPage error="That auth page doesn’t exist." />,
                    },
                ],
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
