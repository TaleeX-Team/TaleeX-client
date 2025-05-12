import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Users, FileText, CheckCircle, Clock, ArrowRight, Video, MessageSquare, ShieldCheck, Flag } from "lucide-react";

const BusinessWorkflow = () => {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    const workflowSteps = [
        {
            icon: <Briefcase className="h-5 w-5" />,
            title: "Create Company Profile",
            description: "Companies register and build their verified profile"
        },
        {
            icon: <FileText className="h-5 w-5" />,
            title: "Post Job Openings",
            description: "Define roles, requirements and ideal candidate attributes"
        },
        {
            icon: <Users className="h-5 w-5" />,
            title: "Review Applicants",
            description: "Receive and review matched candidate applications"
        },
        {
            icon: <Video className="h-5 w-5" />,
            title: "AI Interview Round",
            description: "Candidates complete asynchronous AI interviews"
        },
        {
            icon: <CheckCircle className="h-5 w-5" />,
            title: "Feedback & Selection",
            description: "Review AI feedback and make final selections"
        }
    ];

    return (
        <section className="py-24 px-4 sm:px-6 bg-muted/20 relative">
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
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Complete Hiring Workflow
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        From company verification to final selection, our platform handles every stage of the recruitment process
                    </p>
                </motion.div>

                {/* Workflow visualization */}
                <motion.div
                    variants={fadeIn}
                    className="relative"
                >
                    <div className="hidden md:block absolute left-0 right-0 top-1/2 h-0.5 bg-border/50 -translate-y-1/2 z-0"></div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6 relative z-10">
                        {workflowSteps.map((step, index) => (
                            <React.Fragment key={index}>
                                <Card className="bg-card border-border/40 relative hover:shadow-md transition-shadow duration-300">
                                    <CardContent className="p-6">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                                            {React.cloneElement(step.icon, { className: "h-5 w-5 text-primary" })}
                                        </div>
                                        <h3 className="font-semibold text-center mb-2">{step.title}</h3>
                                        <p className="text-sm text-muted-foreground text-center">{step.description}</p>
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                                            Step {index + 1}
                                        </div>
                                    </CardContent>
                                </Card>
                                {index < workflowSteps.length - 1 && (
                                    <div className="hidden md:flex absolute top-1/2 left-[calc((100%/5)*{index+1}-8px)] -translate-y-1/2 z-20">
                                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </motion.div>

                {/* Application stages */}
                <motion.div
                    variants={fadeIn}
                    className="mt-20"
                >
                    <h3 className="text-2xl font-bold mb-8 text-center">Application Stage Tracking</h3>
                    <div className="max-w-4xl mx-auto bg-card border border-border/40 rounded-xl overflow-hidden shadow-md">
                        <div className="border-b border-border/30 bg-muted/30 p-4 flex justify-between items-center">
                            <div className="font-medium">Application Progress</div>
                            <div className="text-sm text-muted-foreground">Job: Senior Front-end Developer</div>
                        </div>
                        <div className="p-6">
                            <div className="relative">
                                <div className="absolute left-9 top-0 bottom-0 w-0.5 bg-border/40"></div>

                                {[
                                    {
                                        title: "CV Review",
                                        status: "Completed",
                                        date: "June 10, 2025",
                                        icon: <FileText className="h-5 w-5 text-white" />,
                                        bgColor: "bg-green-500",
                                        description: "CV matched job requirements at 92% compatibility"
                                    },
                                    {
                                        title: "Identity Verification",
                                        status: "Completed",
                                        date: "June 12, 2025",
                                        icon: <ShieldCheck className="h-5 w-5 text-white" />,
                                        bgColor: "bg-green-500",
                                        description: "Verified candidate identity with periodic screenshots during screening questions"
                                    },
                                    {
                                        title: "AI Mock Interview",
                                        status: "In Progress",
                                        date: "June 15, 2025",
                                        icon: <Video className="h-5 w-5 text-white" />,
                                        bgColor: "bg-blue-500",
                                        description: "Technical assessment and behavioral questions"
                                    },
                                    {
                                        title: "Interview Feedback",
                                        status: "Pending",
                                        date: "Expected June 16, 2025",
                                        icon: <Clock className="h-5 w-5 text-white" />,
                                        bgColor: "bg-muted",
                                        description: "AI will analyze responses and generate detailed feedback"
                                    }
                                ].map((stage, index) => (
                                    <div key={index} className="flex mb-8 last:mb-0 relative">
                                        <div className={`w-9 h-9 rounded-full ${stage.bgColor} flex items-center justify-center flex-shrink-0 z-10`}>
                                            {stage.icon}
                                        </div>
                                        <div className="ml-6">
                                            <div className="flex items-center">
                                                <h4 className="font-medium">{stage.title}</h4>
                                                <span className={`ml-3 text-xs px-2 py-0.5 rounded-full ${
                                                    stage.status === "Completed" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                                                        stage.status === "In Progress" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
                                                            "bg-muted text-muted-foreground"
                                                }`}>
                          {stage.status}
                        </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">{stage.date}</p>
                                            <p className="mt-2">{stage.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Job trust and safety callout */}
                <motion.div
                    variants={fadeIn}
                    className="mt-16 bg-card border border-border/40 rounded-xl p-6 shadow-md"
                >
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="md:w-2/3">
                            <div className="flex items-center mb-4">
                                <Flag className="h-6 w-6 text-primary mr-2" />
                                <h3 className="text-xl font-semibold">Job Safety & Reporting</h3>
                            </div>
                            <p className="text-muted-foreground mb-4">
                                We take the legitimacy and safety of job listings seriously. If you encounter any suspicious job postings, fraudulent activity, or inappropriate content, please use our reporting system.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3 mt-0.5">✓</span>
                                    <span>One-click reporting for suspicious job listings</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3 mt-0.5">✓</span>
                                    <span>Our team reviews all reports within 24 hours</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3 mt-0.5">✓</span>
                                    <span>Job listings can be removed immediately upon valid reports</span>
                                </li>
                            </ul>
                        </div>
                        <div className="md:w-1/3 flex justify-center">
                            <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 w-full max-w-xs">
                                <div className="text-center mb-3">
                                    <Flag className="h-8 w-8 text-primary mx-auto mb-2" />
                                    <h4 className="font-medium">Report a Job</h4>
                                </div>
                                <div className="bg-card/80 border border-border/30 rounded-lg p-3 mb-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-sm">Senior Developer</span>
                                        <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">Report</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground">TechCorp Industries</div>
                                </div>
                                <button className="w-full bg-primary/90 hover:bg-primary text-white py-2 rounded-lg text-sm transition-colors">
                                    View Reporting Guidelines
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default BusinessWorkflow;