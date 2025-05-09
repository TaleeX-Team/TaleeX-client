import React, { ReactNode, useState, useEffect } from 'react';

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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog.jsx";
import {useAuth} from "@/hooks/useAuth.js";


const AdminLayout = ({ children, title = "Admin Dashboard" }) => {
    const [scrolled, setScrolled] = useState(false);
    const [notifications, setNotifications] = useState(3);
    const { logout } = useAuth();
    const [openDialog, setOpenDialog] = useState(false);

    const handleLogout = () => {
        logout.mutate();
        setOpenDialog(false);
    };
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
                                <DropdownMenuItem
                                    onSelect={(e) => {
                                        e.preventDefault();
                                        setOpenDialog(true);
                                    }}
                                    className="text-red-600 focus:bg-red-100 dark:focus:bg-red-900 cursor-pointer"
                                >
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Are you sure you want to logout?</DialogTitle>
                            <DialogDescription>
                                You will be logged out of your account. This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setOpenDialog(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleLogout}>
                                Logout
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
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