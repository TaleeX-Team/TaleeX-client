import React from "react";
import { SidebarNav } from "@/features/settings/side-nav/SideNav";
import { Button } from "@/components/ui/button";
import { Link, Outlet } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next"; // Import translation hook

export default function SettingsLayout() {
  const { t } = useTranslation(); // Initialize translation hook
  const hasPassword = localStorage.getItem("hasPassword") === "true";

  const sidebarNavItems = React.useMemo(() => {
    const baseItems = [
      { title: t("settingsLayout.profile"), href: "profile" },
      { title: t("settingsLayout.billing"), href: "billing" },
    ];

    if (hasPassword) {
      baseItems.push({
        title: t("settingsLayout.changePassword"),
        href: "change-password",
      });
    } else {
      baseItems.push({ title: t("settingsLayout.setPassword"), href: "set-password" });
    }

    return baseItems;
  }, [hasPassword, t]);

  return (
    <div className="container mx-auto space-y-6 p-6 pb-16 min-h-screen ">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">{t("settingsLayout.settings")}</h2>
          <p className="text-muted-foreground">
            {t("settingsLayout.manageSettings")}
          </p>
        </div>
        {/* <Button variant="outline" asChild>
          <Link to="/" className="gap-2 flex items-center">
            <ArrowLeft className="h-4 w-4" />
            {t("settingsLayout.backToHomepage")}
          </Link>
        </Button> */}
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

