import React, {useState, useRef, useEffect} from "react";
import {useParams, useNavigate, Link} from "react-router-dom";
import {CheckCircle, Eye, EyeOff, AlertCircle, ArrowLeft, ArrowRight} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {ThemeToggle} from "@/components/ThemeToggle";
import {Alert, AlertDescription} from "@/components/ui/alert";
import gsap from "gsap";
import {toast} from "sonner";

const AdminResetPassword = () => {
    const {verificationToken} = useParams();
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const formRef = useRef(null);
    const cardRef = useRef(null);
    const headingRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline();
        tl.fromTo(
            headingRef.current,
            {y: -30, opacity: 0},
            {y: 0, opacity: 1, duration: 0.8, ease: "power3.out"}
        );
        tl.fromTo(
            cardRef.current,
            {y: 30, opacity: 0},
            {y: 0, opacity: 1, duration: 0.8, ease: "power3.out"},
            "-=0.4"
        );
    }, []);

    useEffect(() => {
        if (isSuccess) {
            gsap.fromTo(
                contentRef.current,
                {opacity: 0, y: 10},
                {opacity: 1, y: 0, duration: 0.5, ease: "power2.out"}
            );

            // Redirect to login after 3 seconds
            const timer = setTimeout(() => {
                navigate("/admin/auth");
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [isSuccess, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate passwords
        if (newPassword.length < 8) {
            setPasswordError("Password must be at least 8 characters long");
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        }

        // Clear any previous errors
        setPasswordError("");
        setIsLoading(true);

        // Small button press animation
        gsap.to(formRef.current, {
            scale: 0.98,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
        });

        try {
            // Replace with your actual reset password API call
            // For example: await resetPassword(verificationToken, newPassword);
            console.log('Resetting password with token:', verificationToken);

            // Simulate API delay
            setTimeout(() => {
                setIsLoading(false);
                setIsSuccess(true);
                toast.success("Password has been reset successfully!");
            }, 1000);
        } catch (error) {
            setIsLoading(false);
            setPasswordError(error?.message || "Failed to reset password. Please try again.");
            toast.error("Failed to reset password. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md p-6 z-10">
                <div ref={headingRef} className="flex items-center justify-center mb-6">
                    <Link to="/admin/auth" className="flex items-center gap-3">
                        <img
                            src="/public/logo.svg"
                            alt="logo"
                            className="h-18"
                        />
                        <h1 className="text-2xl font-bold text-gradient">TalentSync</h1>
                    </Link>
                </div>

                <Card ref={cardRef} className="glass-card border-white/10 shadow-xl">
                    <CardHeader className="space-y-2">
                        <CardTitle className="text-2xl font-semibold text-center">
                            Set New Password
                        </CardTitle>
                        <CardDescription className="text-center">
                            Create a new secure password for your admin account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div ref={contentRef}>
                            {!isSuccess ? (
                                <form
                                    ref={formRef}
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="newPassword"
                                                type={showPassword ? "text" : "password"}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="Enter a secure password"
                                                className="pr-10"
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4 text-gray-400"/>
                                                ) : (
                                                    <Eye className="h-4 w-4 text-gray-400"/>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="confirmPassword"
                                                type={showPassword ? "text" : "password"}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Confirm your password"
                                            />
                                        </div>
                                    </div>

                                    {passwordError && (
                                        <Alert variant="destructive">
                                            <AlertCircle className="h-4 w-4"/>
                                            <AlertDescription>{passwordError}</AlertDescription>
                                        </Alert>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-primary to-pink-400 hover:primary/70 hover:to-pink-500 transition-all duration-300"
                                        disabled={isLoading || !newPassword || !confirmPassword}
                                    >
                                        {isLoading ? "Resetting..." : "Reset Password"}
                                        <ArrowRight className="ml-2"/>
                                    </Button>

                                    <Link
                                        to="/admin/auth"
                                        className="flex items-center justify-center gap-2 text-sm text-primary hover:primary/70 transition-colors mt-4"
                                    >
                                        <ArrowLeft size={16}/> Back to login
                                    </Link>
                                </form>
                            ) : (
                                <div className="text-center space-y-6 py-4">
                                    <div
                                        className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
                                        <CheckCircle className="h-8 w-8 text-green-500"/>
                                    </div>
                                    <h3 className="text-xl font-medium">Password Reset Complete</h3>
                                    <p className="text-muted-foreground">
                                        Your admin password has been successfully reset.
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        You'll be redirected to the login page in a moment.
                                    </p>
                                    <Button
                                        className="w-full"
                                        onClick={() => navigate("/admin/auth")}
                                    >
                                        Go to Login
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-6 text-center">
                    <ThemeToggle/>
                    <p className="text-sm text-muted-foreground mt-4">
                        Need help? Contact <a href="mailto:support@tourvisto.com"
                                              className="text-primary hover:underline">support@tourvisto.com</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminResetPassword;