import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <footer className="relative bg-card border-t border-border overflow-hidden">
            {/* Background gradient elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full filter blur-3xl opacity-70"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full filter blur-3xl opacity-50"></div>
            </div>

            <div className="container mx-auto relative z-10">
                {/* Footer top section with subscription */}
                <motion.div
                    className="py-12 px-4"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
                        <motion.div variants={fadeIn} className="lg:col-span-2">
                            <Link to="/" className="inline-block mb-6">
                <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Taleex
                </span>
                            </Link>
                            <p className="text-muted-foreground mb-6 max-w-md">
                                Revolutionizing the recruitment landscape with AI-powered interviews, intelligent matching, and data-driven hiring solutions.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-background/80 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                                    <Facebook size={18} />
                                </a>
                                <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-full bg-background/80 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                                    <Twitter size={18} />
                                </a>
                                <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-background/80 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                                    <Linkedin size={18} />
                                </a>
                                <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-background/80 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                                    <Instagram size={18} />
                                </a>
                            </div>
                        </motion.div>

                        <motion.div variants={fadeIn} className="lg:col-span-1">
                            <h3 className="text-lg font-semibold mb-6">Company</h3>
                            <ul className="space-y-4">
                                <li>
                                    <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link>
                                </li>
                                <li>
                                    <Link to="/careers" className="text-muted-foreground hover:text-primary transition-colors">Careers</Link>
                                </li>
                                <li>
                                    <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link>
                                </li>
                                <li>
                                    <Link to="/pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</Link>
                                </li>
                            </ul>
                        </motion.div>

                        <motion.div variants={fadeIn} className="lg:col-span-1">
                            <h3 className="text-lg font-semibold mb-6">Resources</h3>
                            <ul className="space-y-4">
                                <li>
                                    <Link to="/resources" className="text-muted-foreground hover:text-primary transition-colors">Documentation</Link>
                                </li>
                                <li>
                                    <Link to="/help" className="text-muted-foreground hover:text-primary transition-colors">Help Center</Link>
                                </li>
                                <li>
                                    <Link to="/guides" className="text-muted-foreground hover:text-primary transition-colors">Guides</Link>
                                </li>
                                <li>
                                    <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQs</Link>
                                </li>
                            </ul>
                        </motion.div>

                        <motion.div variants={fadeIn} className="lg:col-span-1">
                            <h3 className="text-lg font-semibold mb-6">Legal</h3>
                            <ul className="space-y-4">
                                <li>
                                    <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
                                </li>
                                <li>
                                    <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
                                </li>
                                <li>
                                    <Link to="/compliance" className="text-muted-foreground hover:text-primary transition-colors">Compliance</Link>
                                </li>
                                <li>
                                    <Link to="/security" className="text-muted-foreground hover:text-primary transition-colors">Security</Link>
                                </li>
                            </ul>
                        </motion.div>

                        <motion.div variants={fadeIn} className="lg:col-span-1">
                            <h3 className="text-lg font-semibold mb-6">Contact</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <Mail size={18} className="mr-2 text-primary mt-1" />
                                    <span className="text-muted-foreground">hello@taleex.ai</span>
                                </li>
                                <li className="flex items-start">
                                    <Phone size={18} className="mr-2 text-primary mt-1" />
                                    <span className="text-muted-foreground">+1 (555) 123-4567</span>
                                </li>
                                <li className="flex items-start">
                                    <MapPin size={18} className="mr-2 text-primary mt-1" />
                                    <span className="text-muted-foreground">San Francisco, CA</span>
                                </li>
                                <li className="flex items-start">
                                    <Globe size={18} className="mr-2 text-primary mt-1" />
                                    <span className="text-muted-foreground">taleex.ai</span>
                                </li>
                            </ul>
                        </motion.div>
                    </div>

                    {/* Newsletter subscription */}
                    <motion.div
                        variants={fadeIn}
                        className="mt-16 py-8 px-6 bg-background/50 border border-border/50 rounded-2xl flex flex-col md:flex-row gap-6 justify-between items-center"
                    >
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Stay in the loop</h3>
                            <p className="text-muted-foreground">Subscribe to our newsletter for the latest updates and insights</p>
                        </div>
                        <div className="flex w-full md:w-auto max-w-md flex-col sm:flex-row gap-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="px-4 py-2 rounded-md border border-border bg-card/80 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <Button className="bg-primary hover:bg-primary/90">
                                Subscribe
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Footer bottom */}
                <motion.div
                    variants={fadeIn}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="py-6 px-4 border-t border-border/40 flex flex-col md:flex-row justify-between items-center"
                >
                    <div className="flex items-center mb-4 md:mb-0">
            <span className="text-muted-foreground text-sm">
              © {currentYear} Taleex. All rights reserved.
            </span>
                    </div>
                    <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                        <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
                        <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
                        <Link to="/cookies" className="hover:text-primary transition-colors">Cookies</Link>
                        <Link to="/sitemap" className="hover:text-primary transition-colors">Sitemap</Link>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;
