import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, LockIcon, UserIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AnimatedBackground from "@/components/AnimatedBackground.jsx";
import { ThemeToggle } from "@/components/ThemeToggle.jsx";
import { useAuth } from "@/hooks/useAuth";
import gsap from "gsap";
import { LoadingIndicator } from "@/components/LoadingButton.jsx";
import { ThreeDLogoSection } from "@/components/TheeDLogoSection.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const AdminSignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { loginAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const formRef = useRef(null);
  const headerRef = useRef(null);
  const formElementsRef = useRef(null);
  const errorRef = useRef(null);

  // Handle authentication status change
  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to dashboard when authenticated
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // GSAP animations
  useEffect(() => {
    // Create a timeline for the animations
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Animate the form elements
    tl.fromTo(
      headerRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 0.8 }
    );
    // .fromTo(
    //     formRef.current,
    //     { opacity: 0, y: 30 },
    //     { opacity: 1, y: 0, duration: 0.6 }
    // )
    // .fromTo(
    //     formElementsRef.current.children,
    //     { opacity: 0, y: 20 },
    //     { opacity: 1, y: 0, duration: 0.4, stagger: 0.15 }
    // );

    return () => {
      // Clean up animation
      tl.kill();
    };
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Show button loading state through the useAuth hook's isLoading state
    loginAdmin.mutate({
      email: formData.email,
      password: formData.password,
    });

    // Error handling is now managed by the useAuth hook
  };

  // Animation for error message when it appears
  useEffect(() => {
    if (loginAdmin.isError && errorRef.current) {
      gsap.fromTo(
        errorRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3 }
      );
    }
  }, [loginAdmin.isError]);

  return (
    <main className="min-h-screen relative w-full flex items-start justify-center pt-20 overflow-hidden">
      <div className="w-full max-w-md lg:w-1/2 space-y-6">
        <div className="flex items-center justify-between mb-3">
          <ThreeDLogoSection isMobile={true} />
          <ThemeToggle />
        </div>

        <Card className="border-white/10 shadow-xl">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-semibold text-center">
              Admin Portal
            </CardTitle>
            <CardDescription className="text-center">
              Sign in to access the admin dashboard and manage your travel
              platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <div ref={formElementsRef} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="admin@taleex.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <Link
                      to="forgot-password"
                      className="text-sm font-medium text-primary hover:text-primary/90"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>
                {loginAdmin.isError && (
                  <div
                    ref={errorRef}
                    className="form-error text-sm text-red-500"
                  >
                    {loginAdmin.error?.message ||
                      "Invalid email or password. Please try again."}
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-pink-400 hover:primary/70 hover:to-pink-500 transition-all duration-300 mt-2"
                  disabled={loginAdmin.isLoading}
                >
                  {loginAdmin.isLoading ? (
                    <>
                      <LoadingIndicator /> Processing
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default AdminSignIn;
