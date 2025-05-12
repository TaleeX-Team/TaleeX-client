import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-16">
            {/* Background gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background dark:from-background dark:via-background/80 dark:to-background z-0">
                <div className="absolute top-20 left-[10%] w-72 h-72 bg-primary/10 rounded-full filter blur-3xl opacity-70 animate-pulse-light hidden dark:block"></div>
                <div className="absolute bottom-10 right-[5%] w-96 h-96 bg-primary/20 rounded-full filter blur-3xl opacity-50 animate-float hidden dark:block"></div>
                <div className="absolute top-20 right-[15%] w-72 h-72 bg-blue-500/20 rounded-full filter blur-3xl opacity-70 animate-pulse-light dark:hidden"></div>
                <div className="absolute bottom-32 left-[10%] w-80 h-80 bg-indigo-500/10 rounded-full filter blur-3xl opacity-60 animate-float dark:hidden"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    className="max-w-4xl mx-auto text-center flex flex-col items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Logo and branding */}
                    <motion.div
                        className="mb-6"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
            <span className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Taleex
            </span>
                    </motion.div>

                    {/* Eyebrow text */}
                    <motion.div
                        className="inline-flex items-center rounded-full border border-border bg-background/50 dark:bg-card/20 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-muted-foreground mb-6"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                        Revolutionary AI-Powered Recruitment Platform
                    </motion.div>

                    {/* Main headline */}
                    <motion.h1
                        className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 dark:from-primary dark:to-blue-400">
              Transform
            </span>{" "}
                        your hiring with{" "}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500 dark:from-primary dark:to-blue-400">
              intelligent AI
            </span>
                    </motion.h1>

                    {/* Subheading */}
                    <motion.p
                        className="text-lg sm:text-xl md:text-2xl text-muted-foreground dark:text-slate-300 max-w-3xl mx-auto mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        Our AI Mock Interview technology delivers unparalleled candidate assessment, eliminating bias and saving valuable time
                    </motion.p>

                    {/* Key features bullets */}
                    <motion.div
                        className="flex flex-col sm:flex-row justify-center gap-4 mb-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        {[
                            "Conduct AI-powered interviews",
                            "Match CVs to ideal jobs",
                            "Generate intelligent questions"
                        ].map((feature, index) => (
                            <div key={index} className="flex items-center text-sm sm:text-base">
                                <CheckCircle className="h-5 w-5 mr-2 text-primary" />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </motion.div>

                    {/* CTA buttons */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.8 }}
                    >
                        <Button
                            size="lg"
                            className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 px-8"
                        >
                            Try AI Interview Demo
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="text-foreground border-border hover:bg-secondary/50 transition-all duration-300 px-8 flex items-center gap-2"
                        >
                            See How It Works
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </motion.div>

                    {/* Product stats */}
                    <motion.div
                        className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9, duration: 1 }}
                    >
                        {[
                            ["98%", "Interview accuracy"],
                            ["75%", "Faster hiring"],
                            ["30+", "Interview templates"],
                            ["1000+", "Companies trust us"]
                        ].map((stat, index) => (
                            <div key={index} className="flex flex-col">
                                <span className="text-2xl font-bold text-foreground">{stat[0]}</span>
                                <span className="text-sm text-muted-foreground">{stat[1]}</span>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>

            {/* Bottom wave divider */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1440 100"
                    fill="none"
                    preserveAspectRatio="none"
                    className="w-full h-[100px]"
                >
                    <path
                        d="M0 80L48 73.3C96 66.7 192 53.3 288 46.7C384 40 480 40 576 46.7C672 53.3 768 66.7 864 66.7C960 66.7 1056 53.3 1152 46.7C1248 40 1344 40 1392 40H1440V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V80Z"
                        className="fill-card dark:fill-card/30"
                    />
                </svg>
            </div>
        </div>
    );
};

export default HeroSection;