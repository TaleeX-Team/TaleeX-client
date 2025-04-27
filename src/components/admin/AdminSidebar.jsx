import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Briefcase,
    BarChart,
    Settings,
    LogOut,
    Menu,
    ChevronLeft,
    CreditCard,
    ChevronRight,
    Moon,
    Sun,
    Laptop
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {useTheme} from "@/layouts/theme_provider/ThemeProvider.jsx";


const SidebarItem = ({ icon, label, href, active, onClick, collapsed = false }) => {
    const content = (
        <div
            className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-300",
                active
                    ? "bg-gradient-to-r from-primary/80 to-primary/60 text-primary-foreground shadow-md"
                    : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
            )}
        >
            <div className={collapsed ? "mx-auto" : ""}>{icon}</div>
            {!collapsed && <span className="font-medium whitespace-nowrap">{label}</span>}
        </div>
    );

    return collapsed ? (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link to={href} onClick={onClick}>
                        {content}
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-card border border-border/50 shadow-lg">
                    {label}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    ) : (
        <Link to={href} onClick={onClick}>
            {content}
        </Link>
    );
};

const AdminSidebar = () => {
    const location = useLocation();
    const { theme, setTheme } = useTheme();
    const [isMobileView, setIsMobileView] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const currentPath = location.pathname;

    // Check if the current view is mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobileView(window.innerWidth < 768);
            if (window.innerWidth < 768) {
                setCollapsed(false); // Always expand on mobile
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggleMobileSidebar = () => {
        setMobileOpen(!mobileOpen);
    };

    const toggleSidebarCollapse = () => {
        setCollapsed(!collapsed);
    };

    const menuItems = [
        {
            icon: <LayoutDashboard size={collapsed ? 20 : 18} />,
            label: "Dashboard",
            href: "/admin",
            active: currentPath === "/admin"
        },
        {
            icon: <Users size={collapsed ? 20 : 18} />,
            label: "Users",
            href: "/admin/users",
            active: currentPath.includes("/admin/users")
        },
        {
            icon: <Briefcase size={collapsed ? 20 : 18} />,
            label: "Jobs",
            href: "/admin/jobs",
            active: currentPath.includes("/admin/jobs")
        },
        {
            icon: <BarChart size={collapsed ? 20 : 18} />,
            label: "Analytics",
            href: "/admin/analytics",
            active: currentPath.includes("/admin/analytics")
        },
        {
            icon: <CreditCard size={collapsed ? 20 : 18} />,
            label: "Plans",
            href: "/admin/plans",
            active: currentPath.includes("/admin/plans")
        },
        {
            icon: <Settings size={collapsed ? 20 : 18} />,
            label: "Settings",
            href: "/admin/settings",
            active: currentPath.includes("/admin/settings")
        },
    ];

    return (
        <>
            {/* Mobile sidebar toggle */}
            <div className="fixed top-4 left-4 z-50 md:hidden">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleMobileSidebar}
                    className="rounded-full bg-background/80 backdrop-blur-sm border border-border/40 shadow-sm"
                >
                    <Menu size={18} />
                </Button>
            </div>

            {/* Sidebar overlay for mobile */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
                    onClick={toggleMobileSidebar}
                />
            )}

            {/* Sidebar */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 border-r border-border/30 bg-card/95 backdrop-blur-lg flex flex-col transform transition-all duration-300 ease-in-out",
                    collapsed && !isMobileView ? "w-16" : "w-64",
                    isMobileView ? (mobileOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
                )}
            >
                {/* Close button for mobile */}
                {isMobileView && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleMobileSidebar}
                        className="absolute right-2 top-2 md:hidden"
                    >
                        <ChevronLeft size={18} />
                    </Button>
                )}

                {/* Toggle collapse button (desktop only) */}
                {!isMobileView && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleSidebarCollapse}
                        className="absolute -right-3 top-6 hidden md:flex h-6 w-6 rounded-full border border-border/50 bg-background shadow-sm"
                    >
                        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
                    </Button>
                )}

                {/* Logo section */}
                <div className={cn(
                    "flex items-center gap-2 p-4 border-b border-border/30",
                    collapsed && !isMobileView ? "justify-center" : ""
                )}>
                    <div className="w-8 h-8" />
                    {!collapsed && (
                        <span className="font-bold text-lg bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text whitespace-nowrap">
              Admin Portal
            </span>
                    )}
                </div>

                {/* Navigation links */}
                <div className="p-2 flex-1 overflow-auto">
                    <div className={cn(
                        "space-y-1",
                        collapsed && !isMobileView ? "px-0" : "px-2"
                    )}>
                        {menuItems.map((item) => (
                            <SidebarItem
                                key={item.href}
                                icon={item.icon}
                                label={item.label}
                                href={item.href}
                                active={item.active}
                                collapsed={collapsed && !isMobileView}
                                onClick={() => isMobileView && setMobileOpen(false)}
                            />
                        ))}
                    </div>
                </div>

                {/* Theme toggler */}
                {!collapsed ? (
                    <div className="px-6 py-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="w-full justify-start gap-2 px-2">
                                    {theme === 'dark' && <Moon size={16} />}
                                    {theme === 'light' && <Sun size={16} />}
                                    {theme === 'system' && <Laptop size={16} />}
                                    <span className="capitalize">
                    {theme} Theme
                  </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="center" className="w-40">
                                <DropdownMenuItem onClick={() => setTheme("light")} className="gap-2">
                                    <Sun size={16} /> Light
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("dark")} className="gap-2">
                                    <Moon size={16} /> Dark
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("system")} className="gap-2">
                                    <Laptop size={16} /> System
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ) : (
                    <div className="px-4 py-2 flex justify-center">
                        <TooltipProvider delayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md" onClick={() => {
                                        if (theme === 'dark') setTheme('light');
                                        else if (theme === 'light') setTheme('system');
                                        else setTheme('dark');
                                    }}>
                                        {theme === 'dark' && <Moon size={16} />}
                                        {theme === 'light' && <Sun size={16} />}
                                        {theme === 'system' && <Laptop size={16} />}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    Change Theme
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                )}

                {/* Footer with logout */}
                <div className="p-4 border-t border-border/30">
                    {collapsed && !isMobileView ? (
                        <TooltipProvider delayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="w-full h-10 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                    >
                                        <LogOut size={18} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    Logout
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ) : (
                        <Button
                            variant="ghost"
                            className="w-full justify-start px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                            <LogOut size={18} className="mr-3" />
                            <span className="font-medium">Logout</span>
                        </Button>
                    )}
                </div>
            </div>
        </>
    );
};

export default AdminSidebar;