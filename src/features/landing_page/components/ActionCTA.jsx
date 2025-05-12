
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const ActionCTA = () => {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    return (
        <section className="py-24 px-4 sm:px-6 relative">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background/80 z-0"></div>

            <motion.div
                className="container mx-auto max-w-4xl text-center relative z-10"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <motion.h2
                    className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
                    variants={fadeIn}
                >
                    Ready to transform your hiring process?
                </motion.h2>

                <motion.p
                    className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto"
                    variants={fadeIn}
                >
                    Join thousands of companies using Taleex's AI-powered platform to find the perfect candidates faster and with greater accuracy
                </motion.p>

                <motion.div
                    variants={fadeIn}
                    className="flex flex-col sm:flex-row justify-center gap-4"
                >
                    <Button
                        size="lg"
                        className="bg-primary hover:bg-primary/90 text-white shadow-lg"
                    >
                        Get Started For Free
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <Button
                        size="lg"
                        variant="outline"
                        className="border-primary/30 hover:border-primary hover:bg-primary/5"
                    >
                        Schedule a Demo
                    </Button>
                </motion.div>

                <motion.div
                    variants={fadeIn}
                    className="mt-12 pt-8 border-t border-border/30 grid grid-cols-2 sm:grid-cols-4 gap-8"
                >
                    {[
                        { label: "Start-ups", value: "500+" },
                        { label: "Enterprise clients", value: "200+" },
                        { label: "Interviews conducted", value: "50,000+" },
                        { label: "Successful hires", value: "12,000+" }
                    ].map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-2xl font-bold text-primary">{stat.value}</div>
                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
};

export default ActionCTA;