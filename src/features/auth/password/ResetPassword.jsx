import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Building2, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
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
import gsap from "gsap";
import { toast } from "sonner";
import { AnimatedBackground } from "@/components/AnimatedBackground.jsx";
import { ThreeDLogoSection } from "@/components/TheeDLogoSection.jsx";
import {useResetPassword} from "@/hooks/useResetPassowrd.js";

const ResetPassword = () => {
    const { accessToken } = useParams();
    const navigate = useNavigate();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const formRef = useRef(null);
    const cardRef = useRef(null);
    const headingRef = useRef(null);
    const contentRef = useRef(null);

    const { resetPassword, isLoading, isError, error } = useResetPassword();

    useEffect(() => {
        const tl = gsap.timeline();
        tl.fromTo(
            headingRef.current,
            { y: -30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
        );
        tl.fromTo(
            cardRef.current,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
            "-=0.4"
        );
        gsap.to(".logo-container", {
            y: "10px",
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
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
            );
        }
    }, [isSubmitted]);

    // Calculate password strength
    useEffect(() => {
        if (!password) {
            setPasswordStrength(0);
            return;
        }

        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;

        setPasswordStrength(strength);
    }, [password]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }

        if (passwordStrength < 3) {
            toast.warning("Please use a stronger password");
            return;
        }

        // small button press animation
        gsap.to(formRef.current, {
            scale: 0.98,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
        });

        // call the reset-password endpoint using react-query mutation
        resetPassword(
            { accessToken, password },
            {
                onSuccess: () => {
                    setIsSubmitted(true);
                    toast.success("Your password has been reset successfully");
                },
                onError: (err) => {
                    toast.error(err.message || "Failed to reset password");
                },
            }
        );
    };

    const getStrengthColor = () => {
        if (passwordStrength === 0) return "bg-gray-200 dark:bg-gray-700";
        if (passwordStrength === 1) return "bg-red-500";
        if (passwordStrength === 2) return "bg-yellow-500";
        if (passwordStrength === 3) return "bg-blue-500";
        return "bg-green-500";
    };

    const renderPasswordStrength = () => {
        return (
            <div className="mt-2">
                <div className="flex gap-2 mb-1">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                                i < passwordStrength ? getStrengthColor() : "bg-gray-200 dark:bg-gray-700"
                            }`}
                        />
                    ))}
                </div>
                <p className="text-xs text-muted-foreground">
                    {passwordStrength === 0 && "Enter a password"}
                    {passwordStrength === 1 && "Weak - Add uppercase, numbers or symbols"}
                    {passwordStrength === 2 && "Fair - Add more variety"}
                    {passwordStrength === 3 && "Good - Almost there"}
                    {passwordStrength === 4 && "Strong - Great password!"}
                </p>
            </div>
        );
    };

    return (
        <div className="min-h-screen relative w-full flex items-center justify-center overflow-hidden">
            {/* Background */}
            <AnimatedBackground />

            <div className="container relative z-10 flex flex-col lg:flex-row items-center justify-center px-4 md:px-8">
                {/* Branding */}
                <ThreeDLogoSection />

                {/* Form */}
                <div ref={cardRef} className="w-full max-w-md lg:w-1/2 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <div className="lg:hidden flex items-center">
                            <Building2 className="w-8 h-8 mr-2 text-purple-400" />
                            <h2 className="text-2xl font-bold text-gradient">TalentSync</h2>
                        </div>
                        <ThemeToggle />
                    </div>

                    <Card className="glass-card border-white/10 shadow-xl">
                        <CardHeader className="space-y-2">
                            <CardTitle ref={headingRef} className="text-2xl font-semibold text-center">
                                Create New Password
                            </CardTitle>
                            <CardDescription className="text-center">
                                Your new password must be different from previous passwords
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div ref={contentRef}>
                                {!isSubmitted ? (
                                    <form
                                        ref={formRef}
                                        onSubmit={handleSubmit}
                                        className="space-y-4"
                                    >
                                        <div className="space-y-2">
                                            <Label htmlFor="password">New Password</Label>
                                            <div className="relative">
                                                <Lock
                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                                                    size={16}
                                                />
                                                <Input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    required
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="glass-card pl-10 pr-10"
                                                    minLength={8}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                >
                                                    {showPassword ? (
                                                        <EyeOff size={16} />
                                                    ) : (
                                                        <Eye size={16} />
                                                    )}
                                                </button>
                                            </div>
                                            {renderPasswordStrength()}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                                            <div className="relative">
                                                <Lock
                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                                                    size={16}
                                                />
                                                <Input
                                                    id="confirmPassword"
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    required
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className={`glass-card pl-10 pr-10 ${
                                                        confirmPassword && password !== confirmPassword
                                                            ? "border-red-500 focus-visible:ring-red-500"
                                                            : ""
                                                    }`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                >
                                                    {showConfirmPassword ? (
                                                        <EyeOff size={16} />
                                                    ) : (
                                                        <Eye size={16} />
                                                    )}
                                                </button>
                                            </div>
                                            {confirmPassword && password !== confirmPassword && (
                                                <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
                                            )}
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                                            disabled={isLoading || password !== confirmPassword}
                                        >
                                            {isLoading ? "Resetting..." : "Reset Password"}
                                            <ArrowRight className="ml-2" />
                                        </Button>
                                        <Link
                                            to="/auth"
                                            className="flex items-center justify-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors mt-4"
                                        >
                                            <ArrowLeft size={16} /> Back to login
                                        </Link>
                                    </form>
                                ) : (
                                    <div className="text-center space-y-6 py-4">
                                        <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
                                            <CheckCircle className="h-8 w-8 text-green-500" />
                                        </div>
                                        <h3 className="text-xl font-medium">Password Reset Complete</h3>
                                        <p className="text-muted-foreground">
                                            Your password has been successfully reset. You can now log in with your new password.
                                        </p>
                                        <Button
                                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                                            onClick={() => navigate("/auth")}
                                        >
                                            Go to Login
                                            <ArrowRight className="ml-2" />
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
};

export default ResetPassword;