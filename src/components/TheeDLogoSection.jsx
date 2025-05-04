import { useRef, useEffect } from "react";
import gsap from "gsap";
import ThreeDLogo from "@/components/ThreeDLogo";
import { Building2 } from "lucide-react";
import { useTheme } from "@/layouts/theme_provider/ThemeProvider";

export const ThreeDLogoSection = ({ isMobile = false }) => {
    const headingRef = useRef();
    const { theme } = useTheme();
    const isDark = theme === "dark";

    useEffect(() => {
        if (!isMobile) {
            // Initial animations
            gsap.fromTo(
                headingRef.current,
                { y: -30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
            );

            // Subtle floating animation for the 3D logo
            gsap.to(".logo-container", {
                y: "10px",
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }
    }, [isMobile]);

    if (isMobile) {
        return (
            <div className="flex items-center">
                {/* <Building2 className="w-8 h-8 mr-2 text-primary dark:text-primary/70" /> */}
                {/* <h2 className="text-2xl font-bold text-gradient dark:text-primary/70"> */}
                {/* </h2> */}
                <h1 className="text-3xl font-bold tracking-tight pl-2">
                    <span className="text-foreground">Talee</span>
                    <span className="text-primary">X</span>
                </h1>
            </div>
        );
    }

    return (
        <div className="hidden lg:flex flex-col items-center space-y-6 w-1/2 pr-12 mb-8 lg:mb-0 animate-fade-in">
            {/* Fixed logo container with proper centering */}

            {/* <div className="text-center space-y-4 max-w-md">
                <h1 ref={headingRef} className="text-4xl font-bold text-gradient bg-clip-text bg-gradient-to-r from-purple-500 via-purple-600 to-purple-400">

                    <span className="text-foreground">Talee</span>
                    <span className="text-primary">X</span>
                </h1>
                <p className="text-xl text-primary dark:text-accent-foreground transition-colors duration-300">
                    Smarter hiring starts here.
                </p>
                <div className="py-6">
                    <blockquote className="border-l-4 border-primary dark:border-accent-foreground pl-4 italic text-primary dark:text-accent-foreground transition-colors duration-300">
                        <p>"AI-driven insights that transform how you discover and connect with talent."</p>
                    </blockquote>
                </div> */}
            {/* <div className="pt-8">
                    <div className="glass-card p-4 rounded-xl">
                        <p className="text-sm font-medium mb-2 text-primary dark:text-primary transition-colors duration-300">
                            Trusted by innovative teams
                        </p>
                        <div className="flex justify-center space-x-6">
                            <div
                                className={`w-8 h-8 rounded-full ${isDark ? 'bg-primary/30' : 'bg-primary/70'
                                    } backdrop-blur-md transition-colors duration-300`}
                            ></div>
                            <div
                                className={`w-8 h-8 rounded-full ${isDark ? 'bg-primary/30' : 'bg-primary/70'
                                    } backdrop-blur-md transition-colors duration-300`}
                            ></div>
                            <div
                                className={`w-8 h-8 rounded-full ${isDark ? 'bg-primary/30' : 'bg-primary/70'
                                    } backdrop-blur-md transition-colors duration-300`}
                            ></div>
                        </div>
                    </div>
                </div> */}
            {/* </div> */}
        </div>
    );
};