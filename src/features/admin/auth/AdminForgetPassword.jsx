import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Building2, Mail, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
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
import { useForgotPassword } from "@/hooks/useForgotPassoword.js";

const AdminForgetPassword = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [email, setEmail] = useState("");
    const formRef = useRef(null);
    const cardRef = useRef(null);
    const headingRef = useRef(null);
    const contentRef = useRef(null);

    const { sendReset, isLoading, isError, error } = useForgotPassword();

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

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(false);

        // small button press animation
        gsap.to(formRef.current, {
            scale: 0.98,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
        });

        // call the forgot-password endpoint for admin
        sendReset(email, {
            onSuccess: () => {
                setIsSubmitted(true);
                toast.success(`We've sent password reset instructions to ${email}`);
            },
            onError: (error) => {
                toast.error(error?.message || "Failed to send reset link");
            },
        });
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
                            Admin Password Reset
                        </CardTitle>
                        <CardDescription className="text-center">
                            Enter your admin email to receive reset instructions
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
                                        <Label htmlFor="email">Email address</Label>
                                        <div className="relative">
                                            <Mail
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                                                size={16}
                                            />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="admin@tourvisto.com"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-primary to-pink-400 hover:primary/70 hover:to-pink-500 transition-all duration-300"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Sending..." : "Send reset instructions"}
                                        <ArrowRight className="ml-2" />
                                    </Button>
                                    <Link
                                        to="/admin/auth"
                                        className="flex items-center justify-center gap-2 text-sm text-primary hover:primary/70 transition-colors mt-4"
                                    >
                                        <ArrowLeft size={16} /> Back to login
                                    </Link>
                                </form>
                            ) : (
                                <div className="text-center space-y-6 py-4">
                                    <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
                                        <CheckCircle className="h-8 w-8 text-green-500" />
                                    </div>
                                    <h3 className="text-xl font-medium">Check your inbox</h3>
                                    <p className="text-muted-foreground">
                                        We've sent a password reset link to{" "}
                                        <span className="font-medium text-foreground">
                                            {email}
                                        </span>
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Didn't receive the email? Check your spam or try again.
                                    </p>
                                    <Button
                                        variant="outline"
                                        className="glass-card"
                                        onClick={() => setIsSubmitted(false)}
                                    >
                                        Try again
                                    </Button>
                                    <Link
                                        to="/admin/auth"
                                        className="flex items-center justify-center gap-2 text-sm text-primary hover:primary/70 transition-colors mt-4"
                                    >
                                        <ArrowLeft size={16} /> Back to login
                                    </Link>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-6 text-center">
                    <ThemeToggle />
                    <p className="text-sm text-muted-foreground mt-4">
                        Need help? Contact <a href="mailto:support@tourvisto.com" className="text-primary hover:underline">support@tourvisto.com</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminForgetPassword;