import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/layouts/theme_provider/ThemeProvider.jsx";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="relative theme-toggle-glass hover:bg-purple-50 dark:hover:bg-purple-900/30"
        >
            <Sun
                className={`h-5 w-5 transition-all text-purple-600 ${theme === "dark" ? "rotate-90 scale-0 absolute" : "rotate-0 scale-100"}`}
            />
            <Moon
                className={`h-5 w-5 transition-all absolute text-purple-300 ${theme === "dark" ? "rotate-0 scale-100" : "-rotate-90 scale-0"}`}
            />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}