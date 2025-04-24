import { createContext, useContext, useEffect, useState } from "react";

const ThemeProviderContext = createContext(undefined);

export function ThemeProvider({ children, storageKey = "app-theme" }) {
    const [theme, setThemeState] = useState(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem(storageKey);
            if (stored === "light" || stored === "dark") return stored;
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
        }
        return "light";
    });

    // Apply theme on initial load and theme changes
    useEffect(() => {
        if (typeof window !== "undefined") {
            const root = document.documentElement;
            if (theme === "dark") {
                root.classList.add("dark");
            } else {
                root.classList.remove("dark");
            }
            localStorage.setItem(storageKey, theme);

            // Create a custom event for theme changes
            const themeChangeEvent = new CustomEvent('themeChanged', { detail: { theme } });
            document.dispatchEvent(themeChangeEvent);
        }
    }, [theme, storageKey]);

    // Listen for system preference changes
    useEffect(() => {
        if (typeof window !== "undefined") {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            const handleChange = (e) => {
                if (localStorage.getItem(storageKey) === null) {
                    setThemeState(e.matches ? "dark" : "light");
                }
            };

            mediaQuery.addEventListener("change", handleChange);
            return () => mediaQuery.removeEventListener("change", handleChange);
        }
    }, [storageKey]);

    const setTheme = (newTheme) => {
        setThemeState(newTheme);
    };

    return (
        <ThemeProviderContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);
    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return context;
};