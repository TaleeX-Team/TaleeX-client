import { useTheme } from "@/layouts/theme_provider/ThemeProvider";

export const AnimatedBackground = () => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div className={`absolute inset-0 ${isDark
            ? "bg-gradient-to-br from-[#121213] via-[#1e293b] to-[#121213]"
            : "bg-gradient-to-br from-[#f1f5f9] via-[#e2e8f0] to-[#f1f5f9]"} z-0 transition-colors duration-300`}>

            {/* Animated Mesh Grid Background - Subtle lines with glow */}
            <div className={`absolute inset-0 opacity-20 ${isDark
                ? "bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.8)_0,_rgba(59,130,246,0)_60%)]"
                : "bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.4)_0,_rgba(37,99,235,0)_60%)]"}`}>
            </div>

            <div className="absolute inset-0" style={{
                backgroundImage: isDark
                    ? "linear-gradient(to right, rgba(60,165,250,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(60,165,250,0.15) 1px, transparent 1px)"
                    : "linear-gradient(to right, rgba(37,99,235,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(37,99,235,0.1) 1px, transparent 1px)",
                backgroundSize: "60px 60px"
            }}></div>

            {/* Add subtle floating particles effect */}
            <div className={`absolute inset-0 opacity-30 ${isDark ? "opacity-40" : "opacity-20"}`}
                 style={{
                     backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='1.5' fill='%23${isDark ? '60A5FA' : '2563EB'}' /%3E%3C/svg%3E")`,
                     backgroundSize: "60px 60px"
                 }}>
            </div>
        </div>
    );
};