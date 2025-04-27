import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, UserPlus, Clock, Trash2, UserCircle, Edit2, X } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useRef, useState } from "react";
import { toast } from 'sonner';
import gsap from 'gsap';

const users = [
    {
        id: "1",
        name: "Alex Johnson",
        email: "alex@example.com",
        role: "Admin",
        status: "active",
        lastActive: "2 minutes ago"
    },
    {
        id: "2",
        name: "Sarah Chen",
        email: "sarah@example.com",
        role: "Recruiter",
        status: "active",
        lastActive: "1 hour ago"
    },
    {
        id: "3",
        name: "Michael Smith",
        email: "michael@example.com",
        role: "Manager",
        status: "inactive",
        lastActive: "2 days ago"
    },
    {
        id: "4",
        name: "Lisa Parker",
        email: "lisa@example.com",
        role: "Candidate",
        status: "pending",
        lastActive: "Just now"
    },
    {
        id: "5",
        name: "David Wilson",
        email: "david@example.com",
        role: "Employer",
        status: "active",
        lastActive: "3 hours ago"
    },
    {
        id: "6",
        name: "Emma Torres",
        email: "emma@example.com",
        role: "Candidate",
        status: "active",
        lastActive: "5 hours ago"
    },
    {
        id: "7",
        name: "James Lee",
        email: "james@example.com",
        role: "Employer",
        status: "inactive",
        lastActive: "1 day ago"
    },
    {
        id: "8",
        name: "Olivia Miller",
        email: "olivia@example.com",
        role: "Recruiter",
        status: "active",
        lastActive: "4 hours ago"
    },
];

const UsersPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilters, setActiveFilters] = useState([]);

    const tableRef = useRef(null);
    const cardRef = useRef(null);
    const headerRef = useRef(null);

    // Simulate loading state
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    // GSAP animations
    useEffect(() => {
        if (!isLoading) {
            // Animate card entry
            gsap.fromTo(cardRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
            );

            // Animate header elements
            gsap.fromTo(headerRef.current.children,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.2 }
            );

            // Animate table rows
            if (tableRef.current) {
                const rows = tableRef.current.querySelectorAll('tbody tr');
                gsap.fromTo(rows,
                    { opacity: 0, x: -20 },
                    { opacity: 1, x: 0, duration: 0.4, stagger: 0.05, ease: "power1.out", delay: 0.4 }
                );
            }
        }
    }, [isLoading]);

    // Update active filters for better UX
    useEffect(() => {
        const newFilters = [];

        if (roleFilter !== "all") {
            newFilters.push({ type: 'role', value: roleFilter });
        }

        if (statusFilter !== "all") {
            newFilters.push({ type: 'status', value: statusFilter });
        }

        if (searchQuery) {
            newFilters.push({ type: 'search', value: searchQuery });
        }

        setActiveFilters(newFilters);
    }, [roleFilter, statusFilter, searchQuery]);

    const filteredUsers = users.filter(user => {
        // Search filter
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());

        // Role filter
        const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter.toLowerCase();

        // Status filter
        const matchesStatus = statusFilter === "all" || user.status === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;
    });

    const handleAddUser = () => {
        gsap.to(".add-user-btn", {
            scale: 0.95,
            duration: 0.1,
            onComplete: () => {
                gsap.to(".add-user-btn", {
                    scale: 1,
                    duration: 0.2,
                });
            }
        });
        toast.success("This feature would open a user creation modal", {
            description: "You can customize the user creation form here.",
            position: "top-center",
        });
    };

    const handleAction = (action, user) => {
        toast.success(`${action} ${user.name}`, {
            description: `Action performed on user ID: ${user.id}`,
        });
    };

    const handleClearFilters = () => {
        // Animate filter clearing
        gsap.to(".filter-badge", {
            scale: 0.5,
            opacity: 0,
            stagger: 0.05,
            duration: 0.2,
            onComplete: () => {
                setSearchQuery("");
                setRoleFilter("all");
                setStatusFilter("all");
            }
        });
    };

    const removeFilter = (type) => {
        // Animate the specific filter removal
        gsap.to(`#filter-${type}`, {
            scale: 0.5,
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
                if (type === 'search') setSearchQuery("");
                if (type === 'role') setRoleFilter("all");
                if (type === 'status') setStatusFilter("all");
            }
        });
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case "active":
                return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20";
            case "inactive":
                return "bg-slate-500/10 text-slate-600 dark:text-slate-400 hover:bg-slate-500/20";
            case "pending":
                return "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20";
            default:
                return "bg-gray-500/10 text-gray-600 dark:text-gray-400 hover:bg-gray-500/20";
        }
    };

    return (
        <Card className="border border-border shadow-lg transition-all duration-200 hover:shadow-md" ref={cardRef}>
            <CardHeader className="pb-4" ref={headerRef}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Users</CardTitle>
                        <CardDescription className="mt-1 text-muted-foreground">
                            Manage your platform users and their access permissions
                        </CardDescription>
                    </div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button onClick={handleAddUser} className="add-user-btn transition-all hover:shadow-md relative overflow-hidden group">
                                    <span className="absolute inset-0 bg-primary/10 transform scale-0 group-hover:scale-100 transition-transform duration-300 rounded-md"></span>
                                    <UserPlus className="mr-2 h-4 w-4" /> Add User
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-popover text-popover-foreground">
                                <p>Add a new user to the platform</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Filters */}
                <div className="bg-muted/50 p-4 rounded-lg border border-border transition-all duration-300 hover:border-border/80">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                            <Input
                                placeholder="Search by name or email..."
                                className="pl-9 bg-background border-border focus-visible:ring-primary transition-all duration-200"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-full sm:w-40 bg-background border-border transition-all duration-200">
                                    <SelectValue placeholder="Role" />
                                </SelectTrigger>
                                <SelectContent className="bg-background border-border">
                                    <SelectGroup>
                                        <SelectLabel className="text-muted-foreground">Filter by role</SelectLabel>
                                        <SelectItem value="all">All Roles</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="recruiter">Recruiter</SelectItem>
                                        <SelectItem value="manager">Manager</SelectItem>
                                        <SelectItem value="candidate">Candidate</SelectItem>
                                        <SelectItem value="employer">Employer</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full sm:w-40 bg-background border-border transition-all duration-200">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent className="bg-background border-border">
                                    <SelectGroup>
                                        <SelectLabel className="text-muted-foreground">Filter by status</SelectLabel>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={handleClearFilters}
                                            className="bg-background border-border hover:bg-accent transition-colors duration-200"
                                            disabled={activeFilters.length === 0}
                                        >
                                            <Filter className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-popover text-popover-foreground">
                                        <p>Clear all filters</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>

                    {activeFilters.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                            {activeFilters.map((filter) => (
                                <Badge
                                    key={filter.type}
                                    id={`filter-${filter.type}`}
                                    variant="secondary"
                                    className="filter-badge flex items-center gap-1 px-2 py-1 bg-muted hover:bg-muted/80 transition-all"
                                >
                                    <span className="capitalize">{filter.type}:</span> {filter.value}
                                    <button
                                        onClick={() => removeFilter(filter.type)}
                                        className="ml-1 rounded-full hover:bg-muted-foreground/20 p-1"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                            {filteredUsers.length > 0 && (
                                <span className="text-sm text-muted-foreground ml-2">
                  Showing {filteredUsers.length} of {users.length} users
                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Users table */}
                <div className="border border-border rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm" ref={tableRef}>
                            <thead>
                            <tr className="bg-muted/70 border-b border-border">
                                <th className="px-6 py-4 text-left font-medium text-muted-foreground">User</th>
                                <th className="px-6 py-4 text-left font-medium text-muted-foreground">Role</th>
                                <th className="px-6 py-4 text-left font-medium text-muted-foreground">Status</th>
                                <th className="px-6 py-4 text-left font-medium text-muted-foreground">Last Active</th>
                                <th className="px-6 py-4 text-right font-medium text-muted-foreground">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {isLoading ? (
                                Array(5).fill(0).map((_, index) => (
                                    <tr key={index} className="border-b border-border">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="h-10 w-10 rounded-full bg-muted" />
                                                <div className="space-y-2">
                                                    <Skeleton className="h-4 w-32 bg-muted" />
                                                    <Skeleton className="h-3 w-24 bg-muted" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-16 bg-muted" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-6 w-16 rounded-full bg-muted" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-24 bg-muted" /></td>
                                        <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-8 rounded-full bg-muted ml-auto" /></td>
                                    </tr>
                                ))
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="border-b border-border hover:bg-accent/30 transition-colors duration-200">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 border border-border ring-2 ring-background transition-all duration-300 hover:ring-primary/20">
                                                    <AvatarImage src={`/placeholder.svg`} alt={user.name} />
                                                    <AvatarFallback className="bg-muted text-primary font-medium">
                                                        {user.name.split(' ').map(n => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium text-foreground hover:text-primary transition-colors duration-200">{user.name}</div>
                                                    <div className="text-xs text-muted-foreground">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <span className="font-medium text-foreground">{user.role}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge
                                                variant="outline"
                                                className={`${getStatusStyles(user.status)} font-medium capitalize border-none transition-all duration-200`}
                                            >
                                                {user.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-muted-foreground">
                                                <Clock className="h-3 w-3 mr-1 inline-block" />
                                                {user.lastActive}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-accent transition-colors duration-200">
                                                        <span className="sr-only">Open menu</span>
                                                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                                                            <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                                                        </svg>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 bg-popover border-border shadow-lg animate-in slide-in-from-top-5 fade-in-80">
                                                    <DropdownMenuLabel className="text-foreground">User Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator className="bg-border" />
                                                    <DropdownMenuItem
                                                        onClick={() => handleAction("View profile", user)}
                                                        className="focus:bg-accent focus:text-accent-foreground transition-colors duration-200 cursor-pointer"
                                                    >
                                                        <UserCircle className="h-4 w-4 mr-2" />
                                                        View profile
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleAction("Edit", user)}
                                                        className="focus:bg-accent focus:text-accent-foreground transition-colors duration-200 cursor-pointer"
                                                    >
                                                        <Edit2 className="h-4 w-4 mr-2" />
                                                        Edit user
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-border" />
                                                    <DropdownMenuItem
                                                        onClick={() => handleAction("Delete", user)}
                                                        className="text-destructive focus:text-destructive focus:bg-destructive/10 transition-colors duration-200 cursor-pointer"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Delete user
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className="relative">
                                                <Search className="h-10 w-10 text-muted" />
                                                <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-primary/30 animate-ping"></span>
                                            </div>
                                            <div>
                                                <p className="text-lg font-medium text-foreground">No users found</p>
                                                <p className="text-sm">Try adjusting your search or filter criteria</p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                onClick={handleClearFilters}
                                                className="mt-2 transition-all duration-200 hover:border-primary/30"
                                            >
                                                Clear filters
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default UsersPage;