import {createBrowserRouter, RouterProvider, Outlet, Navigate, useLocation} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {lazy, Suspense} from "react";
import {Toaster} from "@/components/ui/sonner"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const Login = lazy(() => import("./features/auth/login/Login"));
const SignUp = lazy(() => import("./features/auth/sign-up/SignUp"));
const Home = lazy(() => import("./features/home/Home.jsx"));
const VerificationCode = lazy(() => import("./features/auth/verification/VerificationCode.jsx"));
const ForgetPassword = lazy(() => import("./features/auth/password/ForgetPassword.jsx"));
const SetPassword = lazy(() => import("./features/auth/password/SetPassword.jsx"));

const AuthLayout = () => (
    <div className="min-h-screen">
        <Outlet/>
    </div>
);


const ProtectedRoute = ({children}) => {
    const isAuthenticated = false; // Replace with your auth logic (e.g., checking a token)
    return isAuthenticated ? children : <Navigate to="/login" replace/>;
};

const ErrorPage = () => {
    const location = useLocation();
    const errorMessage = location.state?.error || "We couldn't find the page you're looking for.";

    return (
        <div className="min-h-screen flex items-center justify-center flex-col gap-4">
            <h1 className="text-2xl font-bold text-red-600">Something went wrong!</h1>
            <p className="text-gray-600 max-w-md text-center">{errorMessage}</p>
            <Button asChild>
                <a href="/">Go to Home</a>
            </Button>
        </div>
    );
};

function App() {
    const queryClient = new QueryClient()

    const router = createBrowserRouter([
        {
            path: "/",
            element: (
                <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
                    <ProtectedRoute>
                        <Home/>
                    </ProtectedRoute>
                </Suspense>
            ),
            errorElement: <ErrorPage/>,
        },
        {
            element: <AuthLayout/>,
            errorElement: <ErrorPage/>,
            children: [
                {
                    path: "login",
                    element: (
                        <Suspense
                            fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
                            <Login/>
                        </Suspense>
                    ),
                },
                {
                    path: "sign-up",
                    element: (
                        <Suspense
                            fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
                            <SignUp/>
                        </Suspense>
                    ),
                },
                {
                    path: "verify",
                    element: (
                        <Suspense
                            fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
                            <VerificationCode/>
                        </Suspense>
                    ),
                },
                {
                    path: "forget-password",
                    element: (
                        <Suspense
                            fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
                            <ForgetPassword/>
                        </Suspense>
                    ),
                },
                {
                    path: "set-password",
                    element: (
                        <Suspense
                            fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
                            <SetPassword/>
                        </Suspense>
                    ),
                },
            ],
        },
    ]);

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router}/>;
                <Toaster/>
            </QueryClientProvider>

        </>)
}

export default App;