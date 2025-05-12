import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Network, Lightbulb, Zap, PieChart, BarChart4 } from "lucide-react";

const FutureOfRecruitment = () => {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    const staggerContainer = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-20 left-[10%] w-72 h-72 bg-primary/5 rounded-full filter blur-3xl opacity-70"></div>
                <div className="absolute bottom-20 right-[10%] w-80 h-80 bg-blue-500/10 rounded-full filter blur-3xl opacity-50"></div>
            </div>

            <motion.div
                className="container mx-auto relative z-10"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <motion.div
                    className="text-center mb-16"
                    variants={fadeIn}
                >
          <span className="text-sm font-medium text-primary px-4 py-1.5 rounded-full bg-primary/5 mb-4 inline-block">
            The Future Is Here
          </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                        Pioneering the Future of <span className="text-primary">Recruitment</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        Our vision goes beyond today's hiring challenges. We're building the next generation of tools that will transform how companies find, evaluate, and hire talent.
                    </p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={staggerContainer}
                >
                    {[
                        {
                            icon: <Brain className="h-8 w-8 text-primary" />,
                            title: "AI-Powered Decision Making",
                            description: "Our advanced algorithms learn from each interaction, continuously improving candidate evaluations and matching precision."
                        },
                        {
                            icon: <Network className="h-8 w-8 text-primary" />,
                            title: "Ecosystem Integration",
                            description: "Seamlessly connect with your existing HR tools and platforms for a comprehensive talent management experience."
                        },
                        {
                            icon: <Lightbulb className="h-8 w-8 text-primary" />,
                            title: "Continuous Innovation",
                            description: "Our dedicated research team constantly evolves our platform with cutting-edge advancements in AI and recruitment science."
                        },
                        {
                            icon: <Zap className="h-8 w-8 text-primary" />,
                            title: "Speed & Efficiency",
                            description: "Reduce time-to-hire by up to 75% while improving the quality of candidates that reach the final stages."
                        },
                        {
                            icon: <PieChart className="h-8 w-8 text-primary" />,
                            title: "Unparalleled Analytics",
                            description: "Gain deep insights into your hiring process with customizable dashboards and predictive analytics."
                        },
                        {
                            icon: <BarChart4 className="h-8 w-8 text-primary" />,
                            title: "Scalable Growth",
                            description: "Whether you're a startup or enterprise, our platform scales with your needs and evolves with your business."
                        }
                    ].map((item, index) => (
                        <motion.div key={index} variants={fadeIn}>
                            <Card className="h-full border-border/40 bg-card hover:shadow-lg transition-shadow duration-300 hover:border-primary/30">
                                <CardContent className="p-6">
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                                    <p className="text-muted-foreground">{item.description}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Innovation Highlight */}
                <motion.div
                    className="mt-20 bg-gradient-to-br from-card/80 to-card border border-border/50 rounded-2xl p-8 relative overflow-hidden"
                    variants={fadeIn}
                >
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full filter blur-3xl"></div>
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full filter blur-3xl"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="md:w-1/2">
              <span className="text-sm font-medium text-primary px-4 py-1.5 rounded-full bg-primary/10 mb-4 inline-block">
                Coming Soon
              </span>
                            <h3 className="text-2xl md:text-3xl font-bold mb-4">Talent Marketplace & Advanced Matching</h3>
                            <p className="text-muted-foreground mb-6">
                                We're creating a dynamic ecosystem where pre-vetted candidates and forward-thinking companies connect through our AI matching system, dramatically reducing time-to-hire and improving match quality.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    "Pre-vetted talent pool with AI-verified credentials",
                                    "Advanced matching based on skills, culture, and career goals",
                                    "Real-time talent availability and engagement tracking"
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3 mt-0.5">✓</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="md:w-1/2 aspect-video rounded-xl bg-gradient-to-br from-primary/30 via-blue-400/20 to-primary/10 flex items-center justify-center">
                            <div className="text-center px-6">
                                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl inline-block mb-4">
                                    <Brain className="h-10 w-10 text-primary" />
                                </div>
                                <h4 className="text-xl font-medium mb-2">Talent Ecosystem</h4>
                                <p className="text-sm text-muted-foreground">
                                    Launching Q4 2023
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default FutureOfRecruitment;