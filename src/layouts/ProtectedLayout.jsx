import React from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import UserAvatar from "@/features/header/UserAvatar";

const ProtectedLayout = () => {
  const { data: user } = useUser();

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
