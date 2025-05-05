import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useRef } from "react";
import { LockIcon, UserIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AnimatedBackground from "@/components/AnimatedBackground.jsx";
import { ThemeToggle } from "@/components/ThemeToggle.jsx";
import { useAuth } from "@/hooks/useAuth";
import gsap from "gsap";
import {LoadingIndicator} from "@/components/LoadingButton.jsx";

const AdminSignIn = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { login, isAuthenticated } = useAuth();
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
        )
            .fromTo(
                formRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6 }
            )
            .fromTo(
                formElementsRef.current.children,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.4, stagger: 0.15 }
            );

        return () => {
            // Clean up animation
            tl.kill();
        };
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Show button loading state through the useAuth hook's isLoading state
        login.mutate({
            email: formData.email,
            password: formData.password
        });

        // Error handling is now managed by the useAuth hook
    };

    // Animation for error message when it appears
    useEffect(() => {
        if (login.isError && errorRef.current) {
            gsap.fromTo(
                errorRef.current,
                { opacity: 0, y: -10 },
                { opacity: 1, y: 0, duration: 0.3 }
            );
        }
    }, [login.isError]);

    return (
        <main className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Animated background */}
            <AnimatedBackground />

            <div className="glass-card w-full max-w-md p-6 z-10">
                <div className="gradient-border-content">
                    <header ref={headerRef} className="flex items-center justify-center mb-6">
                        <Link to="/" className="flex items-center gap-3">
                            <img
                                src="/public/logo.svg"
                                alt="logo"
                                className="h-18"
                            />
                            <h1 className="text-2xl font-bold text-gradient">TalentSync</h1>
                        </Link>
                    </header>

                    <article className="mb-8">
                        <h2 className="text-xl font-semibold text-center mb-2">Admin Portal</h2>
                        <p className="text-muted-foreground text-center">
                            Sign in to access the admin dashboard and manage your travel platform.
                        </p>
                    </article>

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
                                        placeholder="admin@tourvisto.com"
                                        className="pl-10"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link
                                        to="forgot-password"
                                        className="text-sm font-medium text-primary hover:text-primary/90"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
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
                            </div>

                            {login.isError && (
                                <div ref={errorRef} className="form-error text-sm text-red-500">
                                    {login.error?.message || "Invalid email or password. Please try again."}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-primary to-pink-400 hover:primary/70 hover:to-pink-500 transition-all duration-300"
                                disabled={login.isLoading}
                            >
                                {login.isLoading ? <> <LoadingIndicator/>  Processing </> : 'Sign In'}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Need help? Contact <a href="mailto:support@tourvisto.com" className="text-primary hover:underline">support@tourvisto.com</a>
                        </p>
                    </div>
                </div>
            </div>
            <div className="absolute z-20 inset-x-[50%] inset-y-[85%]">
                <ThemeToggle />
            </div>
        </main>
    );
};

export default AdminSignIn;