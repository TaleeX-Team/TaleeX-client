import { useRef, useEffect } from "react";
import gsap from "gsap";
import ThreeDLogo from "@/components/ThreeDLogo";
import { Building2 } from "lucide-react";

export const ThreeDLogoSection = ({ isMobile = false }) => {
    const headingRef = useRef();

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
                <Building2 className="w-8 h-8 mr-2 text-purple-400" />
                <h2 className="text-2xl font-bold text-gradient">TalentSync</h2>
            </div>
        );
    }

    return (
        <div className="hidden lg:flex flex-col items-center space-y-6 w-1/2 pr-12 mb-8 lg:mb-0 animate-fade-in">
            <div className="logo-container w-40 h-32 relative">
                <ThreeDLogo className="absolute inset-y-[-240px] inset-x-[-25px] h-32" />
            </div>

            <div className="text-center space-y-4 max-w-md">
                <h1 ref={headingRef} className="text-4xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400">
                    TalentSync
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    Smarter hiring starts here.
                </p>
                <div className="py-6">
                    <blockquote className="border-l-4 border-purple-500 pl-4 italic text-muted-foreground">
                        <p>"AI-driven insights that transform how you discover and connect with talent."</p>
                    </blockquote>
                </div>
                <div className="pt-8">
                    <div className="glass-card p-4 rounded-xl">
                        <p className="text-sm font-medium mb-2">Trusted by innovative teams</p>
                        <div className="flex justify-center space-x-6 opacity-70">
                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md"></div>
                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md"></div>
                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};