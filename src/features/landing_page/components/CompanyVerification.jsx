import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Building, Search, UserCheck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const CompanyVerification = () => {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    return (
        <section className="py-24 px-4 sm:px-6 bg-background">
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
                        Trust and Verification
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Ensuring legitimate opportunities and protecting candidates with our company verification system
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    {/* Left side: Verification explanation */}
                    <motion.div variants={fadeIn}>
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="bg-primary/10 p-3 rounded-full mr-4">
                                    <Building className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Verified Companies Only</h3>
                                    <p className="text-muted-foreground">
                                        We verify all companies on our platform through a rigorous process, ensuring candidates apply to legitimate opportunities from real businesses.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="bg-primary/10 p-3 rounded-full mr-4">
                                    <Search className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Transparent Application Process</h3>
                                    <p className="text-muted-foreground">
                                        Jobs from unverified companies are clearly marked, allowing candidates to make informed decisions about where they apply.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="bg-primary/10 p-3 rounded-full mr-4">
                                    <UserCheck className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Candidate Protection</h3>
                                    <p className="text-muted-foreground">
                                        Our verification system protects candidates from fraudulent job postings and ensures time isn't wasted on non-legitimate opportunities.
                                    </p>
                                </div>
                            </div>

                            <Button className="mt-4 bg-primary hover:bg-primary/90 text-white">
                                Learn About Verification Process
                            </Button>
                        </div>
                    </motion.div>

                    {/* Right side: Visual representation */}
                    <motion.div variants={fadeIn}>
                        <div className="rounded-xl overflow-hidden border border-border/40 bg-card/50 p-6 shadow-md">
                            <h3 className="font-semibold text-lg mb-6 flex items-center">
                                <Building className="h-5 w-5 mr-2" />
                                Company Listings Example
                            </h3>

                            <div className="space-y-4">
                                {/* Verified company */}
                                <Card className="border-border/30">
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center mr-3">
                                                    <span className="font-bold text-primary">TC</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium">TechCorp Industries</h4>
                                                    <p className="text-sm text-muted-foreground">Software & Cloud Solutions</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center text-sm text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                Verified
                                            </div>
                                        </div>
                                        <div className="mt-3 text-sm">
                                            <p>4 open positions</p>
                                            <div className="mt-2">
                                                <Button variant="outline" size="sm" className="text-xs h-7 px-2">
                                                    View Jobs
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Unverified company */}
                                <Card className="border-border/30 bg-muted/20">
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center mr-3">
                                                    <span className="font-bold text-muted-foreground">GS</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium">GrowthStart LLC</h4>
                                                    <p className="text-sm text-muted-foreground">Digital Marketing</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">
                                                <XCircle className="h-3 w-3 mr-1" />
                                                Unverified
                                            </div>
                                        </div>
                                        <div className="mt-3 text-sm">
                                            <p>2 open positions (cannot apply)</p>
                                            <div className="mt-2 flex items-center">
                                                <Button variant="outline" size="sm" disabled className="text-xs h-7 px-2 mr-2">
                                                    View Jobs
                                                </Button>
                                                <span className="text-xs text-muted-foreground">Verification pending</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Verified company */}
                                <Card className="border-border/30">
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center mr-3">
                                                    <span className="font-bold text-primary">AW</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium">AceWorks Inc</h4>
                                                    <p className="text-sm text-muted-foreground">Product Design & Development</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center text-sm text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                Verified
                                            </div>
                                        </div>
                                        <div className="mt-3 text-sm">
                                            <p>7 open positions</p>
                                            <div className="mt-2">
                                                <Button variant="outline" size="sm" className="text-xs h-7 px-2">
                                                    View Jobs
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default CompanyVerification;