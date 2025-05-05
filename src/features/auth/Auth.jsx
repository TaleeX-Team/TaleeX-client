import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import gsap from "gsap";
import { AnimatedBackground } from "@/components/AnimatedBackground.jsx";
import { ThreeDLogoSection } from "@/components/TheeDLogoSection.jsx";
import { AuthTabs } from "@/components/AuthTabs.jsx";
import { useTheme } from "@/layouts/theme_provider/ThemeProvider";

const Auth = () => {
    const [activeTab, setActiveTab] = useState("login");
    const cardRef = useRef();
    const { theme } = useTheme();
    const isDark = theme === "dark";

    useEffect(() => {
        // Initial animations
        gsap.fromTo(
            cardRef.current,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.4 }
        );
    }, []);

    return (
        <div className="min-h-screen relative w-full flex items-start justify-center pt-20 overflow-hidden">
            {/* Add the auth-bg-gradient from your css */}
            {/* <div className="auth-bg-gradient"></div>
            <AnimatedBackground /> */}

            {/* <div className="container relative z-10 flex flex-col lg:flex-row items-center justify-center px-4 md:px-8"> */}
            {/* Left Panel - Branding */}
            {/* <ThreeDLogoSection /> */}

            {/* Right Panel - Auth Form */}
            <div ref={cardRef} className="w-full max-w-md lg:w-1/2 space-y-6">
                <div className="flex items-center justify-between mb-3">
                    <ThreeDLogoSection isMobile={true} />
                    <ThemeToggle />
                </div>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-2xl font-semibold text-center text-gradient">
                            {activeTab === "login" ? "Welcome back" : "Create an account"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AuthTabs
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                    </CardContent>
                </Card>

                {/* Add a subtle help text with text gradient
                    <p className="text-center text-sm text-muted-foreground">
                        {activeTab === "login"
                            ? "Enter your credentials to access your account"
                            : "Fill out the form to create your free account"}
                    </p> */}
            </div>
            {/* </div> */}
        </div>
    );
};

export default Auth;