import React, {useEffect, useRef} from "react";
import {Search, FolderPlus, Building2} from "lucide-react";
import {Input} from "@/components/ui/input";
import CompanyCard from "./company-card/CompanyCard";
import AddCompany from "./modals/add-company";
import {useCompanies} from "./features";
import {CompanySkeleton} from "./company-skeleton";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {Button} from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {AnimatedBackground} from "@/components/AnimatedBackground.jsx";
import Cookies from "js-cookie";

// Register GSAP plugins
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function Companies() {
    const {
        companyData: {data: companies, isLoading, isError},
    } = useCompanies();

    // Refs for animations
    const headerRef = useRef(null);
    const searchRef = useRef(null);
    const cardsContainerRef = useRef(null);
    const emptyStateRef = useRef(null);
    const hasPassword =  Cookies.get('hasPassword');
    console.log(hasPassword,"hasPassword");
    // Initialize animations
    useEffect(() => {
        // Header animation
        gsap.fromTo(
            headerRef.current,
            {y: -20, opacity: 0},
            {y: 0, opacity: 1, duration: 0.8, ease: "power3.out"}
        );

        // Search bar animation
        gsap.fromTo(
            searchRef.current,
            {y: -10, opacity: 0},
            {y: 0, opacity: 1, duration: 0.5, delay: 0.3, ease: "power2.out"}
        );

        // Cards container animation (using GSAP stagger for cards)
        if (cardsContainerRef.current && companies?.companies?.length > 0) {
            // Important: Make sure card animations run and complete
            gsap.to(
                ".company-card-item",
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    delay: 0.4,
                    ease: "power2.out",
                    overwrite: true // Ensures any previous animations are overwritten
                }
            );
        }

        // Empty state animation
        if (emptyStateRef.current && (!companies?.companies || companies?.companies?.length === 0)) {
            gsap.fromTo(
                emptyStateRef.current,
                {scale: 0.9, opacity: 0},
                {scale: 1, opacity: 1, duration: 0.8, delay: 0.2, ease: "back.out(1.7)"}
            );
        }

        // Add scroll animations for cards that come into view later
        const cardItems = document.querySelectorAll(".company-card-item");
        if (cardItems.length) {
            // Ensure initial visibility for cards in view
            cardItems.forEach(card => {
                const rect = card.getBoundingClientRect();
                const isInView = rect.top <= window.innerHeight;
                if (isInView) {
                    gsap.to(card, {opacity: 1, y: 0, duration: 0.5});
                }
            });

            ScrollTrigger.batch(cardItems, {
                onEnter: (elements) => {
                    gsap.to(elements, {
                        y: 0,
                        opacity: 1,
                        stagger: 0.1,
                        duration: 0.6,
                        ease: "power2.out",
                        overwrite: true // Important to ensure animations complete
                    });
                },
                start: "top bottom-=100",
                once: true,
            });
        }

        // Cleanup function for ScrollTrigger
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, [isLoading, companies]); // Dependencies to ensure animations run when data changes

    return (
        <div className="bg-background p-4 md:p-8 min-h-screen">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div
                    ref={headerRef}
                    className="flex flex-col md:flex-row md:items-center justify-between mb-8 bg-gradient-to-r from-background to-muted/50 p-4 md:p-6 rounded-xl shadow-sm"
                >
                    <div className="flex items-center">
                        <div className="bg-primary/10 p-3 rounded-lg mr-4 hidden sm:flex">
                            <Building2 className="h-8 w-8 text-primary"/>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-2">
                                Companies
                            </h1>
                            <p className="text-muted-foreground mt-1">Manage your company directory</p>
                        </div>
                    </div>
                    <div className="mt-4 md:mt-0 animate-pulse">
                        <AddCompany/>
                    </div>
                </div>

                {/* Search and Filter */}
                <div
                    ref={searchRef}
                    className="flex flex-col sm:flex-row gap-4 mb-8 bg-card p-4 rounded-lg shadow-sm border border-border/50"
                >
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                        <Input
                            placeholder="Search companies..."
                            className="pl-10 w-full transition-all duration-300 focus:border-primary focus:ring focus:ring-primary/20"
                        />
                    </div>
                    <div className="flex gap-3">
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Companies</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="favorite">Favorites</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="icon">
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none"
                                 xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                                <path d="M3.5 8.5L7.5 12.5L11.5 8.5M3.5 2.5L7.5 6.5L11.5 2.5" stroke="currentColor"
                                      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                        </Button>
                    </div>
                </div>

                {/* Company Cards */}
                <div className="relative min-h-[300px]">
                    {isLoading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <CompanySkeleton/>
                            <CompanySkeleton/>
                            <CompanySkeleton/>
                        </div>
                    )}
                    {isError && (
                        <div
                            className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/5 rounded-lg border border-destructive/20 p-4 z-50">
                            {/* your error content here */}
                            <div
                                className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                     xmlns="http://www.w3.org/2000/svg" className="text-destructive">
                                    <path
                                        d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z"
                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                        strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-destructive mb-2">Error loading companies</h2>
                            <p className="text-muted-foreground mb-4">There was an error fetching your company data.
                                Please try again.</p>
                            <Button variant="outline" className="mx-auto">
                                Retry
                            </Button>
                        </div>
                    )}
                    {!isLoading && !isError && (
                        <>
                            {companies?.companies?.length > 0 ? (
                                <div
                                    ref={cardsContainerRef}
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                                >
                                    {companies.companies.map((company) => (
                                        <div key={company._id} className="company-card-item">
                                            <CompanyCard company={company}/>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div
                                    ref={emptyStateRef}
                                    className="flex flex-col items-center justify-center py-16 px-4 text-center bg-card rounded-xl border border-dashed border-muted-foreground/20 z-30"
                                >
                                    {/* Empty state */}
                                    <div
                                        className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                                        <FolderPlus className="h-10 w-10 text-primary"/>
                                    </div>
                                    <h3 className="text-2xl font-semibold mb-3">No companies yet</h3>
                                    <p className="text-muted-foreground max-w-md mb-8">
                                        Your company directory is empty. Add your first company to get started tracking
                                        clients, partners, and opportunities.
                                    </p>
                                    <AddCompany/>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}