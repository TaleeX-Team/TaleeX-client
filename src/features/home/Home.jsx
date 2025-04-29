import React from "react";
import Companies from "../companies/Companies";
import {AnimatedBackground} from "@/components/AnimatedBackground.jsx";

const Home = () => {
    return (
        <div className="min-h-screen">
            {/* <AnimatedBackground/> */}
            <Companies />

        </div>
    );
};

export default Home;