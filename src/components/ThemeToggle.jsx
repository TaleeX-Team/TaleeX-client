import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/layouts/theme_provider/ThemeProvider.jsx";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="relative theme-toggle-glass transition-colors duration-300 hover:bg-accent dark:hover:bg-accent/30"
        >
            <Sun
                className={`absolute h-5 w-5 transition-transform duration-300 ease-in-out text-primary ${
                    isDark ? "rotate-90 scale-0" : "rotate-0 scale-100"
                }`}
            />
            <Moon
                className={`absolute h-5 w-5 transition-transform duration-300 ease-in-out text-primary ${
                    isDark ? "rotate-0 scale-100" : "-rotate-90 scale-0"
                }`}
            />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
