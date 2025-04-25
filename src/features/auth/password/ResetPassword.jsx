// Enhanced ResetPassword component with improved accessibility, UX, and code structure

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    Building2,
    Lock,
    Eye,
    EyeOff,
    ArrowLeft,
    ArrowRight,
    CheckCircle,
    Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { ThemeToggle } from "@/components/ThemeToggle";
import { AnimatedBackground } from "@/components/AnimatedBackground.jsx";
import { ThreeDLogoSection } from "@/components/TheeDLogoSection.jsx";
import { useResetPassword } from "@/hooks/useResetPassowrd.js";
import { toast } from "sonner";
import gsap from "gsap";

function useToggle(initial = false) {
    const [state, setState] = useState(initial);
    return [state, () => setState((v) => !v)];
}

function usePasswordStrength(password) {
    const [strength, setStrength] = useState(0);

    useEffect(() => {
        let s = 0;
        if (password.length >= 8) s++;
        if (/[A-Z]/.test(password)) s++;
        if (/[0-9]/.test(password)) s++;
        if (/[^A-Za-z0-9]/.test(password)) s++;
        setStrength(password ? s : 0);
    }, [password]);

    return strength;
}

export default function ResetPassword() {
    const { verificationToken } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, toggleShowPassword] = useToggle(false);
    const [showConfirm, toggleShowConfirm] = useToggle(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const strength = usePasswordStrength(password);
    const {
        triggerResetPassword,
        isLoading,
        isError,
        error,
    } = useResetPassword();

    const headingRef = useRef(null);
    const cardRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline();
        tl.fromTo(
            headingRef.current,
            { y: -30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8 }
        );
        tl.fromTo(
            cardRef.current,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8 },
            "-=0.4"
        );
        gsap.to(".logo-container", {
            y: 10,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });
    }, []);

    useEffect(() => {
        if (isSubmitted) {
            gsap.fromTo(
                contentRef.current,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.5 }
            );
        }
    }, [isSubmitted]);

    function handleSubmit(e) {
        e.preventDefault();
        if (password !== confirmPassword) {
            return toast.error("Passwords don't match");
        }
        if (strength < 3) {
            return toast.warning("Please use a stronger password");
        }

        triggerResetPassword(
            { token: verificationToken, password, confirmPassword },
            {
                onSuccess: () => {
                    setIsSubmitted(true);
                    toast.success("Password reset successfully");
                },
                onError: (err) => {
                    toast.error(err.message || "Failed to reset password");
                },
            }
        );
    }

    const strengthColors = [
        "bg-gray-200 dark:bg-gray-700",
        "bg-red-500",
        "bg-yellow-500",
        "bg-blue-500",
        "bg-green-500",
    ];
    const strengthText = [
        "Enter a password",
        "Weak — add uppercase, numbers, or symbols",
        "Fair — add more variety",
        "Good — almost there",
        "Strong — great password!",
    ];

    const renderStrength = () => (
        <div className="mt-2" aria-live="polite">
            <div className="flex gap-2 mb-1">
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                            i < strength ? strengthColors[strength] : strengthColors[0]
                        }`}
                    />
                ))}
            </div>
            <p className="text-xs text-muted-foreground">{strengthText[strength]}</p>
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center overflow-hidden relative">
            <AnimatedBackground />

            <div className="container z-10 flex flex-col lg:flex-row items-center justify-center px-4 md:px-8">
                <ThreeDLogoSection />

                <div ref={cardRef} className="w-full max-w-md lg:w-1/2 space-y-6">
                    <div className="flex justify-between items-center mb-2">
                        <div className="lg:hidden flex items-center">
                            <Building2 className="w-8 h-8 mr-2 text-primary dark:text-primary/70" />
                            <h2 className="text-2xl font-bold text-gradient dark:text-primary/70">TalentSync</h2>
                        </div>
                        <ThemeToggle />
                    </div>

                    <Card className="glass-card border-white/10 shadow-xl">
                        <CardHeader className="space-y-2">
                            <CardTitle ref={headingRef} className="text-2xl font-semibold text-center">
                                Create New Password
                            </CardTitle>
                            <CardDescription className="text-center">
                                Your new password must be different from previous ones.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div ref={contentRef}>
                                {!isSubmitted ? (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <Label htmlFor="password">New Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                minLength={8}
                                                disabled={isLoading}
                                                className="pl-10 pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={toggleShowPassword}
                                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                            >
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                        {renderStrength()}

                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                                            <Input
                                                id="confirmPassword"
                                                type={showConfirm ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                                disabled={isLoading}
                                                className={`pl-10 pr-10 ${
                                                    confirmPassword && password !== confirmPassword
                                                        ? "border-red-500 focus-visible:ring-red-500"
                                                        : ""
                                                }`}
                                            />
                                            <button
                                                type="button"
                                                onClick={toggleShowConfirm}
                                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                                aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                                            >
                                                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                        {confirmPassword && password !== confirmPassword && (
                                            <p className="text-xs text-red-500">Passwords don’t match</p>
                                        )}

                                        <Button
                                            type="submit"
                                            disabled={isLoading || password !== confirmPassword}
                                            className="w-full bg-gradient-to-r from-primary to-pink-400 hover:primary/70 hover:to-pink-500 transition-all duration-300"
                                        >
                                            {isLoading ? (
                                                <>
                                                    Resetting… <Loader2 className="animate-spin inline-block ml-2" />
                                                </>
                                            ) : (
                                                <>
                                                    Reset Password <ArrowRight className="ml-2" />
                                                </>
                                            )}
                                        </Button>

                                        {isError && (
                                            <p className="text-sm text-red-500">
                                                {error?.message || "Something went wrong."}
                                            </p>
                                        )}

                                        <Link
                                            to="/auth"
                                            className="flex justify-center items-center gap-2 text-sm text-primary"
                                        >
                                            <ArrowLeft size={16}/> Back to login
                                        </Link>
                                    </form>
                                ) : (
                                    <div className="text-center space-y-6 py-4">
                                        <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center animate-in zoom-in-95">
                                            <CheckCircle className="h-8 w-8 text-green-500 animate-bounce" />
                                        </div>
                                        <h3 className="text-xl font-medium">Password Reset Complete</h3>
                                        <p className="text-muted-foreground">
                                            Your password has been successfully reset. You can now log in.
                                        </p>
                                        <Button
                                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
                                            onClick={() => navigate("/auth")}
                                        >
                                            Go to Login <ArrowRight size={16} className="ml-2 " />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
