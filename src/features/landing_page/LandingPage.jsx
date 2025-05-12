import React, {useEffect} from 'react';

import {toast} from 'sonner';
import HeroSection from "@/features/landing_page/components/HeroSection.jsx";
import AIInterviewFeature from "@/features/landing_page/components/AIInterviewFeature.jsx";
import BusinessWorkflow from "@/features/landing_page/components/BusinessWorkflow.jsx";
import CompanyVerification from "@/features/landing_page/components/CompanyVerification.jsx";
import FutureOfRecruitment from "@/features/landing_page/components/FutureOfRecruitment.jsx";
import ActionCTA from "@/features/landing_page/components/ActionCTA.jsx";
import Footer from "@/features/landing_page/components/Footer.jsx";

const Home = () => {
    useEffect(() => {
        window.scrollTo(0, 0);

        // Show a welcome toast
        toast.success(
            "Transform your hiring process with our AI-powered platform"
        );
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <HeroSection/>
            <AIInterviewFeature/>
            <BusinessWorkflow/>
            <CompanyVerification/>
            <FutureOfRecruitment/>
            <ActionCTA/>
            <Footer/>
        </div>
    );
};

export default Home;