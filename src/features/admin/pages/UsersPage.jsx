import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {Search, Filter, Plus, MoreHorizontal, UserPlus, Clock, Trash2, UserCircle, Edit2} from "lucide-react";
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
import {useState} from "react";
import AdminLayout from "@/layouts/AdminLayout.jsx";
import {toast} from 'sonner';


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
        toast.success("This feature would open a user creation modal");
    };

    const handleAction = (action, user) => {
        toast.success(`${action} ${user.name}`);
    };

    const handleClearFilters = () => {
        setSearchQuery("");
        setRoleFilter("all");
        setStatusFilter("all");
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
        <Card className="border border-border shadow-sm">
            <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <CardTitle className="text-3xl font-bold tracking-tight">Users</CardTitle>
                        <CardDescription className="mt-1">
                            Manage your platform users and their access permissions
                        </CardDescription>
                    </div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button onClick={handleAddUser} className="transition-all hover:shadow-md">
                                    <UserPlus className="mr-2 h-4 w-4"/> Add User
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
                <div className="bg-muted p-4 rounded-lg border border-border">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                            <Input
                                placeholder="Search by name or email..."
                                className="pl-9 bg-background border-border focus-visible:ring-ring"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-full sm:w-40 bg-background border-border">
                                    <SelectValue placeholder="Role"/>
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
                                <SelectTrigger className="w-full sm:w-40 bg-background border-border">
                                    <SelectValue placeholder="Status"/>
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
                                            className="bg-background border-border hover:bg-accent"
                                        >
                                            <Filter className="h-4 w-4"/>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-popover text-popover-foreground">
                                        <p>Clear all filters</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>

                    {(searchQuery || roleFilter !== "all" || statusFilter !== "all") && (
                        <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                            <span>Showing {filteredUsers.length} of {users.length} users</span>
                            {filteredUsers.length === 0 && (
                                <span className="text-destructive">No results found with current filters</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Users table */}
                <div className="border border-border rounded-lg overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="bg-muted border-b border-border">
                                <th className="px-6 py-4 text-left font-medium text-muted-foreground">User</th>
                                <th className="px-6 py-4 text-left font-medium text-muted-foreground">Role</th>
                                <th className="px-6 py-4 text-left font-medium text-muted-foreground">Status</th>
                                <th className="px-6 py-4 text-left font-medium text-muted-foreground">Last Active</th>
                                <th className="px-6 py-4 text-right font-medium text-muted-foreground">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id}
                                        className="border-b border-border hover:bg-accent/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 border border-border">
                                                    <AvatarImage src={`/placeholder.svg`} alt={user.name}/>
                                                    <AvatarFallback className="bg-muted text-muted-foreground">
                                                        {user.name.split(' ').map(n => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium text-foreground">{user.name}</div>
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
                                                className={`${getStatusStyles(user.status)} font-medium capitalize border-none`}
                                            >
                                                {user.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-muted-foreground">
                                                <Clock className="h-3 w-3 mr-1 inline-block"/>
                                                {user.lastActive}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon"
                                                            className="h-8 w-8 rounded-full hover:bg-accent">
                                                        <MoreHorizontal className="h-4 w-4"/>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end"
                                                                     className="w-48 bg-popover border-border">
                                                    <DropdownMenuLabel className="text-foreground">User
                                                        Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator className="bg-border"/>
                                                    <DropdownMenuItem
                                                        onClick={() => handleAction("View profile", user)}
                                                        className="focus:bg-accent focus:text-accent-foreground"
                                                    >
                                                        <UserCircle className="h-4 w-4 mr-2"/>
                                                        View profile
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleAction("Edit", user)}
                                                        className="focus:bg-accent focus:text-accent-foreground"
                                                    >
                                                        <Edit2 className="h-4 w-4 mr-2"/>
                                                        Edit user
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-border"/>
                                                    <DropdownMenuItem
                                                        onClick={() => handleAction("Delete", user)}
                                                        className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2"/>
                                                        Delete user
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <Search className="h-8 w-8 text-muted"/>
                                            <div>
                                                <p className="text-lg font-medium text-foreground">No users found</p>
                                                <p className="text-sm">Try adjusting your search or filter criteria</p>
                                            </div>
                                            <Button variant="outline" onClick={handleClearFilters} className="mt-2">
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