import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";


export default function AboutContactHeader() {
     const { t } = useTranslation();
  return (
   
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200">
      <div className="flex items-center justify-between w-full px-4 md:px-6">
        {/* Project Name */}
        <div className="flex items-center">
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-foreground">Talee</span>
            <span className="text-primary">X</span>
          </h1>
        </div>
        <div className="flex items-center justify-center gap-5">
          <ThemeToggle />
          <Link to={"/auth"}>
            <Button>{t("headerAbout.getstarted")}</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
