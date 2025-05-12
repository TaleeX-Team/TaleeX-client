import React from "react";
import { motion } from "framer-motion";
import { Video, UserCheck, MessageSquare, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const AIInterviewFeature = () => {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    return (
        <section className="py-24 px-4 sm:px-6 bg-background relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 right-10 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-20 left-10 w-80 h-80 bg-blue-400/10 rounded-full filter blur-3xl"></div>
            </div>

            <motion.div
                className="container mx-auto"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <motion.div
                    className="text-center mb-16"
                    variants={fadeIn}
                >
                    <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
                        <Award className="mr-1 h-4 w-4" />
                        Our Core Innovation
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                        AI-Powered Mock Interview Platform
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Replace traditional interviews with our cutting-edge AI system that eliminates bias and delivers consistent candidate evaluation
                    </p>
                </motion.div>

                {/* Main feature showcase */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* Video preview */}
                    <motion.div
                        className="lg:col-span-7 relative"
                        variants={fadeIn}
                    >
                        <div className="aspect-video rounded-xl overflow-hidden border border-border/40 bg-card shadow-xl relative">
                            {/* Mock interview screen */}
                            <div className="absolute inset-0 bg-card">
                                <div className="h-12 bg-muted/30 border-b border-border/30 flex items-center px-4">
                                    <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                                    <div className="text-xs text-muted-foreground ml-2">Taleex AI Interview</div>
                                </div>
                                <div className="p-6 h-full flex flex-col">
                                    <div className="flex-1 flex">
                                        <div className="w-2/3 pr-4 flex flex-col">
                                            <div className="mb-4">
                                                <div className="font-medium mb-2">Current Question:</div>
                                                <div className="p-3 bg-background/80 rounded-lg border border-border/30">
                                                    Tell me about a time when you had to handle a challenging problem and how you solved it?
                                                </div>
                                            </div>
                                            <div className="flex-1 bg-background/80 rounded-lg border border-border/30 p-3 flex flex-col">
                                                <div className="text-xs text-muted-foreground mb-2">Live Transcript</div>
                                                <div className="flex-1 text-sm">
                                                    "In my previous role, we faced a critical deadline with unexpected technical challenges. I organized a cross-functional team to break down the problem and..."
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-1/3 bg-muted/30 rounded-lg border border-border/30 flex items-center justify-center">
                                            <div className="text-center">
                                                <Video className="h-8 w-8 mx-auto mb-2 text-primary opacity-60" />
                                                <div className="text-xs text-muted-foreground">Candidate View</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-16 mt-4 bg-background rounded-lg border border-border/30 flex items-center px-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                                <MessageSquare className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                                <Video className="h-4 w-4 text-primary" />
                                            </div>
                                        </div>
                                        <div className="ml-auto text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                            AI Analyzing...
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -bottom-4 -right-4 bg-primary px-4 py-2 text-white rounded-lg shadow-lg text-sm font-medium">
                            Live AI Analysis
                        </div>
                    </motion.div>

                    {/* Feature description */}
                    <motion.div
                        className="lg:col-span-5"
                        variants={fadeIn}
                    >
                        <div className="space-y-6">
                            <div className="p-4 rounded-lg bg-card border border-border/30 shadow-sm">
                                <div className="flex items-start">
                                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                                        <Video className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-1">Automated Video Interviews</h3>
                                        <p className="text-muted-foreground">Candidates record responses to pre-defined questions with our AI evaluating technical skills and soft factors.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-card border border-border/30 shadow-sm">
                                <div className="flex items-start">
                                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                                        <UserCheck className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-1">Unbiased Assessments</h3>
                                        <p className="text-muted-foreground">Our AI evaluates candidates based purely on responses and qualifications, eliminating human bias from the equation.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-card border border-border/30 shadow-sm">
                                <div className="flex items-start">
                                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                                        <MessageSquare className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-1">Custom Question Generation</h3>
                                        <p className="text-muted-foreground">Our AI crafts tailored questions based on job requirements and candidate profiles for targeted evaluation.</p>
                                    </div>
                                </div>
                            </div>

                            <Button className="w-full bg-primary hover:bg-primary/90 text-white mt-4">
                                Schedule a Demo
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default AIInterviewFeature;