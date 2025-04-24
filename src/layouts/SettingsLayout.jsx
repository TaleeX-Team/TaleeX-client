import React from "react";
import { SidebarNav } from "@/features/settings/side-nav/SideNav";
import { Button } from "@/components/ui/button";
import { Link, Outlet } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const sidebarNavItems = [
  { title: "Profile", href: "/settings/profile" },
  { title: "Billing", href: "/settings/billing" },
];

export default function SettingsLayout() {
  return (
    <div className="container mx-auto space-y-6 p-6 pb-16 h-screen">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/" className="gap-2 flex items-center">
            <ArrowLeft className="h-4 w-4" />
            Back to Homepage
          </Link>
        </Button>
      </div>
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
