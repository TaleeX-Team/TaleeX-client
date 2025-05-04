import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/features/header/Header";
import VerificationBanner from "@/components/VerificationBanner";
import { useUser } from "@/hooks/useUser";
import UnVerifiedHeader from "@/features/unverified-header/header/Header";

const ProtectedLayout = () => {
  const { data: user } = useUser();

  return (
    <SidebarProvider>
      <SidebarInset>
        <>
          {user && !user.isVerified && (
            <>
              <UnVerifiedHeader user={user} />
              <VerificationBanner />
            </>
          )}
          {user && user.isVerified && (
            <>
              <Header user={user} />
              <Outlet context={{ user }} />
            </>
          )}
        </>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ProtectedLayout;
