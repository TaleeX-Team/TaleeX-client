import { ReactNode, useState, useEffect } from 'react';

import { Bell, ChevronDown, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Sheet,
    SheetContent,
    SheetTrigger
} from '@/components/ui/sheet';
import AdminSidebar from "@/components/admin/AdminSidebar.jsx";
import {ThemeToggle} from "@/components/ThemeToggle.jsx";


const AdminLayout = ({ children, title = "Admin Dashboard" }) => {
    const [scrolled, setScrolled] = useState(false);
    const [notifications, setNotifications] = useState(3);

    // Listen for scroll events to add shadow to header when scrolled
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-background flex">
            <AdminSidebar />

            <div className="flex-1 md:ml-64">
                {/* Header */}
                <header className={`sticky top-0 z-20 w-full h-16 px-4 bg-background/95 backdrop-blur-md border-b border-border/30 flex items-center justify-between transition-all duration-200 ${scrolled ? 'shadow-sm' : ''}`}>
                    <div className="flex items-center">
                        <h1 className="text-xl font-semibold md:text-2xl hidden md:block">{title}</h1>

                        {/* Search Bar - Hidden on mobile to save space */}
                        <div className="hidden md:flex ml-6 relative">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search..."
                                    className="pl-9 w-64 bg-muted/40 border-none focus-visible:ring-primary/20"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Mobile search trigger */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden rounded-full">
                                    <Search size={18} />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="top" className="pt-12">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search anything..."
                                        className="pl-9"
                                        autoFocus
                                    />
                                </div>
                            </SheetContent>
                        </Sheet>

                        {/* Notifications */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full relative">
                                    <Bell size={18} />
                                    {notifications > 0 && (
                                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                                            {notifications}
                                        </Badge>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80">
                                <DropdownMenuLabel className="flex items-center justify-between">
                                    <span>Notifications</span>
                                    <Button variant="ghost" size="sm" className="h-auto p-0 text-primary text-xs font-normal">
                                        Mark all as read
                                    </Button>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <div className="max-h-80 overflow-y-auto">
                                    {[1, 2, 3].map((_, i) => (
                                        <DropdownMenuItem key={i} className="p-3 cursor-pointer flex flex-col items-start">
                                            <div className="flex justify-between w-full">
                                                <span className="font-medium">New user registered</span>
                                                <span className="text-xs text-muted-foreground">2m ago</span>
                                            </div>
                                            <span className="text-sm text-muted-foreground mt-1">
                        Sarah Chen has joined as a recruiter
                      </span>
                                        </DropdownMenuItem>
                                    ))}
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="flex justify-center text-primary font-medium">
                                    View all notifications
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {/* User Profile */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="rounded-full px-2 gap-1">
                                    <Avatar className="h-8 w-8 border-2 border-primary/20">
                                        <AvatarImage src="/placeholder.svg" alt="Admin" />
                                        <AvatarFallback className="bg-primary/10 text-primary">AD</AvatarFallback>
                                    </Avatar>
                                    <ChevronDown size={14} className="text-muted-foreground ml-1 hidden sm:block" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium">Admin User</p>
                                        <p className="text-xs text-muted-foreground">admin@example.com</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-500 focus:text-red-500">
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Main content */}
                <main className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
                    <div className="animate-in fade-in duration-500">
                        {children}
                    </div>
                </main>

                {/* Footer */}
                <footer className="py-6 px-4 md:px-6 lg:px-8 border-t border-border/30 mt-auto">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-muted-foreground">
                            © 2025 Admin Portal. All rights reserved.
                        </p>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                            <a href="#" className="hover:text-foreground transition-colors">Help</a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default AdminLayout;