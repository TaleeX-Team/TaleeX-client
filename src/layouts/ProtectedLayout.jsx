import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/features/header/Header";
import VerificationBanner from "@/components/VerificationBanner";
import { useUser } from "@/hooks/useUser";

const ProtectedLayout = () => {
    const { data: user } = useUser();
    console.log(user,"user");
    return (
        <SidebarProvider>
            <SidebarInset>
                <>
                    {user && user.isVerified && <VerificationBanner />}
                    <Header user={user} />
                    <Outlet context={{ user }} />
                </>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default ProtectedLayout;