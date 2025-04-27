import React, { useRef, useEffect } from "react";
import { useTheme } from "@/layouts/theme_provider/ThemeProvider";
import { gsap } from "gsap";

export const AnimatedBackground = () => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    // Refs for GSAP animations
    const containerRef = useRef(null);
    const particlesRef = useRef(null);
    const glowRef = useRef(null);
    const gridRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Clear any existing animations
        gsap.killTweensOf([particlesRef.current, glowRef.current, gridRef.current]);

        // Create floating particles animation
        const particles = Array.from({ length: 30 }).map((_, i) => {
            const particle = document.createElement("div");
            particle.className = `absolute rounded-full ${isDark ? "bg-blue-400/30" : "bg-blue-600/20"}`;

            // Random size between 2-6px
            const size = 2 + Math.random() * 4;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            // Random starting position
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;

            particlesRef.current.appendChild(particle);

            // Animate each particle
            gsap.to(particle, {
                x: `${-50 + Math.random() * 100}px`,
                y: `${-50 + Math.random() * 100}px`,
                opacity: () => Math.random() * 0.7 + 0.3,
                duration: 5 + Math.random() * 10,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
                delay: Math.random() * 5
            });

            return particle;
        });

        // Animate glow effect
        gsap.to(glowRef.current, {
            opacity: isDark ? 0.3 : 0.15,
            duration: 4,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true
        });

        // Subtle grid movement
        gsap.to(gridRef.current, {
            backgroundPositionX: "+=20",
            backgroundPositionY: "+=20",
            duration: 30,
            ease: "none",
            repeat: -1
        });

        // Cleanup function
        return () => {
            gsap.killTweensOf([particlesRef.current, glowRef.current, gridRef.current]);
            particles.forEach(particle => particle.remove());
        };
    }, [isDark, theme]);

    return (
        <div
            ref={containerRef}
            className={`absolute inset-0 overflow-hidden ${
                isDark
                    ? "bg-gradient-to-br from-[#121213] via-[#1e293b] to-[#121213]"
                    : "bg-gradient-to-br from-[#f1f5f9] via-[#e2e8f0] to-[#f1f5f9]"
            } z-0 transition-colors duration-700`}
        >
            {/* Animated Glow Effect */}
            <div
                ref={glowRef}
                className={`absolute inset-0 ${
                    isDark
                        ? "bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.8)_0,_rgba(59,130,246,0)_60%)]"
                        : "bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.4)_0,_rgba(37,99,235,0)_60%)]"
                }`}
            ></div>

            {/* Animated Grid */}
            <div
                ref={gridRef}
                className="absolute inset-0"
                style={{
                    backgroundImage: isDark
                        ? "linear-gradient(to right, rgba(60,165,250,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(60,165,250,0.15) 1px, transparent 1px)"
                        : "linear-gradient(to right, rgba(37,99,235,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(37,99,235,0.1) 1px, transparent 1px)",
                    backgroundSize: "60px 60px"
                }}
            ></div>

            {/* Dynamic Particles Container */}
            <div
                ref={particlesRef}
                className="absolute inset-0"
            ></div>
        </div>
    );
};

export default AnimatedBackground;