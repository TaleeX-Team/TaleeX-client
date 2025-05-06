import { useState, useEffect, useRef } from "react";
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
import ThreeDLogo from "@/components/ThreeDLogo";
import { toast } from "sonner";
import { useForgotPassword } from "@/hooks/useForgotPassoword.js";
import { AnimatedBackground } from "@/components/AnimatedBackground.jsx";
import { ThreeDLogoSection } from "@/components/TheeDLogoSection.jsx";
import { LoadingIndicator } from "@/components/LoadingButton.jsx";

const ForgotPassword = () => {
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

        // call the forgot-password endpoint
        sendReset(email, {
            onSuccess: () => {
                setIsSubmitted(true);
                toast.success(`We've sent password reset instructions to ${email}`);
            },
            onError: (error) => {
                toast.error(error?.response?.data?.message || "Failed to send reset link");
            },
        });
    };

    return (
        <div className="min-h-screen relative w-full flex items-start justify-center pt-20 overflow-hidden">
            {/* Background */}
            {/* <AnimatedBackground /> */}

            {/* <div className="container relative z-10 flex flex-col lg:flex-row items-center justify-center px-4 md:px-8">
                Branding
                <ThreeDLogoSection /> */}

            {/* Form */}
            <div ref={cardRef} className="w-full max-w-md lg:w-1/2 space-y-6">
                <div className="flex items-center justify-between mb-3">
                    <ThreeDLogoSection isMobile={true} />
                    <ThemeToggle />
                </div>

                <Card className="border-white/10 shadow-xl">
                    <CardHeader className="space-y-2">
                        <CardTitle className="text-2xl font-semibold text-center">
                            Reset Password
                        </CardTitle>
                        <CardDescription className="text-center">
                            Enter your email to receive reset instructions
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
                                                placeholder="name@company.com"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className=" pl-10"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-primary to-pink-400 hover:primary/70 hover:to-pink-500 transition-all duration-300 mt-6"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? <>
                                            <LoadingIndicator className="mr-2" />
                                            Processing
                                        </> : "Send reset instructions"}
                                        <ArrowRight className="ml-2" />
                                    </Button>
                                </form>
                            ) : (
                                <div className="text-center space-y-6 py-4">
                                    <div
                                        className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
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
                                        to="/auth"
                                        className="flex items-center justify-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors mt-4"
                                    >
                                        <ArrowLeft size={16} /> Back to login
                                    </Link>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
                <Link
                    to="/auth"
                    className="flex justify-start gap-2 text-sm text-primary hover:primary/70 transition-colors mt-4"
                >
                    <ArrowLeft size={16} /> Back to login
                </Link>
            </div>
            {/* </div> */}
        </div>
    );
};

export default ForgotPassword;