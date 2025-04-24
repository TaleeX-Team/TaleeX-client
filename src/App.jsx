import {
    createBrowserRouter,
    RouterProvider,
    Outlet,
    Navigate,
    useLocation,
} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {lazy, Suspense} from "react";
import {Toaster} from "@/components/ui/sonner";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import ProtectedLayout from "./layouts/ProtectedLayout";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import Auth from "@/features/auth/Auth.jsx";
import {ThemeProvider} from "@/layouts/theme_provider/ThemeProvider.jsx";
import {useAuth} from "@/hooks/useAuth.js";

const Login = lazy(() => import("./features/auth/login/Login"));
const SignUp = lazy(() => import("./features/auth/sign-up/SignUp"));
const Home = lazy(() => import("./features/home/Home.jsx"));
const VerificationCode = lazy(() =>
    import("./features/auth/verification/VerificationCode.jsx")
);
const ForgetPassword = lazy(() =>
    import("./features/auth/password/ForgetPassword.jsx")
);
const SetPassword = lazy(() =>
    import("./features/auth/password/SetPassword.jsx")
);

const AuthLayout = () => (
    <div className="min-h-screen">
        <Outlet/>
    </div>
);

const ProtectedRoute = ({children}) => {
    const {isAuthenticated} = useAuth();
    return isAuthenticated ? children : <Navigate to="auth" replace/>;
};

const ErrorPage = () => {
    const location = useLocation();
    const errorMessage =
        location.state?.error || "We couldn't find the page you're looking for.";

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
  const queryClient = new QueryClient();

  const router = createBrowserRouter([
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
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center">
                  Loading...
                </div>
              }
            >
              <Home />
            </Suspense>
          ),
        },
      ],
    },
    {
      element: (
        <ProtectedRoute>
          <SettingsLayout />
        </ProtectedRoute>
      ),
      path: "/settings",
      errorElement: <ErrorPage />,
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
              <ProfilePage />
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
              <BillingPage />
            </Suspense>
          ),
        },
      ],
    },

    {
      element: <AuthLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "auth",
          element: (
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center">
                  Loading...
                </div>
              }
            >
              <Auth />
            </Suspense>
          ),
        },
        {
          path: "/auth/callback",
          element: <OAuthCallback />,
        },
        {
          path: "forget-password",
          element: (
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center">
                  Loading...
                </div>
              }
            >
              <ForgetPassword />
            </Suspense>
          ),
        },
        {
          path: "set-password",
          element: (
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center">
                  Loading...
                </div>
              }
            >
              <SetPassword />
            </Suspense>
          ),
        },
      ],
    },
  ]);

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider storageKey="app-theme">

                    <ReactQueryDevtools initialIsOpen={false}/>
                    <RouterProvider router={router}/>
                    <Toaster/>
                </ThemeProvider>
            </QueryClientProvider>

        </>
    );
}

export default App;
