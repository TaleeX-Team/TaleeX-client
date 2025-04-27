import { Users, Briefcase, Building2, ArrowUpRight, ArrowDownRight, MoreHorizontal, Download, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip }
    from "recharts";
import AdminLayout from "@/layouts/AdminLayout.jsx";

// Sample data for dashboard
const statsData = [
    {
        title: "Total Users",
        value: "3,721",
        icon: Users,
        trend: 12.5,
        description: "vs. previous month",
        color: "text-blue-500",
        bgColor: "bg-blue-500/10"
    },
    {
        title: "Active Jobs",
        value: "246",
        icon: Briefcase,
        trend: 5.2,
        description: "vs. previous month",
        color: "text-green-500",
        bgColor: "bg-green-500/10"
    },
    {
        title: "Companies",
        value: "87",
        icon: Building2,
        trend: -2.3,
        description: "vs. previous month",
        color: "text-amber-500",
        bgColor: "bg-amber-500/10"
    },
    {
        title: "Conversion Rate",
        value: "18.2%",
        icon: BarChart,
        trend: 8.1,
        description: "vs. previous month",
        color: "text-purple-500",
        bgColor: "bg-purple-500/10"
    },
];

const chartData = [
    { name: "Jan", value: 2400, applications: 1400 },
    { name: "Feb", value: 1398, applications: 1210 },
    { name: "Mar", value: 9800, applications: 5400 },
    { name: "Apr", value: 3908, applications: 2000 },
    { name: "May", value: 4800, applications: 2400 },
    { name: "Jun", value: 3800, applications: 2100 },
    { name: "Jul", value: 4300, applications: 2500 },
];

const recentUsers = [
    {
        id: "1",
        name: "Alex Johnson",
        email: "alex@example.com",
        role: "Admin",
        status: "active",
        lastActive: "2 minutes ago",
        avatarUrl: "/placeholder.svg"
    },
    {
        id: "2",
        name: "Sarah Chen",
        email: "sarah@example.com",
        role: "Recruiter",
        status: "active" ,
        lastActive: "1 hour ago",
        avatarUrl: null
    },
    {
        id: "3",
        name: "Michael Smith",
        email: "michael@example.com",
        role: "Manager",
        status: "inactive" ,
        lastActive: "2 days ago",
        avatarUrl: "/placeholder.svg"
    },
    {
        id: "4",
        name: "Lisa Parker",
        email: "lisa@example.com",
        role: "Candidate",
        status: "pending",
        lastActive: "Just now",
        avatarUrl: null
    },
    {
        id: "5",
        name: "David Wilson",
        email: "david@example.com",
        role: "Employer",
        status: "active" ,
        lastActive: "3 hours ago",
        avatarUrl: "/placeholder.svg"
    },
];

// Enhanced Stat Card component
const StatCard = ({ title, value, description, Icon, trend, color, bgColor }) => {
    const isPositive = trend >= 0;

    return (
        <Card className="overflow-hidden border-border/40">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className={`p-2 rounded-md ${bgColor}`}>
                    <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <div className="flex items-center">
                    {isPositive ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={isPositive ? "text-green-500" : "text-red-500"}>
            {Math.abs(trend)}%
          </span>
                </div>
            </CardHeader>
            <CardContent className="pb-2">
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{title}</p>
            </CardContent>
            <CardFooter className="pt-1 text-xs text-muted-foreground">
                {description}
            </CardFooter>
        </Card>
    );
};

// Enhanced Charts component
const OverviewChart = ({ title, period = "weekly", chartType = "area" }) => {
    return (
        <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="text-lg">{title}</CardTitle>
                    <CardDescription>Overview of activity</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <Tabs defaultValue={period} className="w-auto">
                        <TabsList className="grid grid-cols-3 h-8">
                            <TabsTrigger value="weekly" className="text-xs px-2">Week</TabsTrigger>
                            <TabsTrigger value="monthly" className="text-xs px-2">Month</TabsTrigger>
                            <TabsTrigger value="yearly" className="text-xs px-2">Year</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                <span>Download data</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                <span>Refresh</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent className="pt-4 pb-0">
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        {chartType === "area" ? (
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 12 }}
                                    axisLine={{ stroke: 'var(--border)' }}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 12 }}
                                    axisLine={{ stroke: 'var(--border)' }}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--card)',
                                        borderColor: 'var(--border)',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="var(--color-primary)"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        ) : (
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 12 }}
                                    axisLine={{ stroke: 'var(--border)' }}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 12 }}
                                    axisLine={{ stroke: 'var(--border)' }}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--card)',
                                        borderColor: 'var(--border)',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Bar
                                    dataKey="applications"
                                    fill="var(--color-accent)"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

// Enhanced Recent Users Table
const RecentUsersTable = ({ users }) => {
    const getStatusStyles = (status) => {
        switch(status) {
            case 'active':
                return 'bg-green-500/15 text-green-500 hover:bg-green-500/25';
            case 'inactive':
                return 'bg-red-500/15 text-red-500 hover:bg-red-500/25';
            case 'pending':
                return 'bg-amber-500/15 text-amber-500 hover:bg-amber-500/25';
            default:
                return 'bg-muted text-muted-foreground';
        }
    };

    return (
        <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="text-lg">Recent Users</CardTitle>
                    <CardDescription>Latest user activity</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="h-8">
                    View All
                </Button>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto -mx-2">
                    <table className="w-full">
                        <thead>
                        <tr className="text-left text-xs text-muted-foreground">
                            <th className="font-medium px-4 py-3">User</th>
                            <th className="font-medium px-4 py-3">Role</th>
                            <th className="font-medium px-4 py-3">Status</th>
                            <th className="font-medium px-4 py-3">Last Active</th>
                            <th className="font-medium px-4 py-3 text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8 border border-border/50">
                                            <AvatarImage src={user.avatarUrl || ""} alt={user.name} />
                                            <AvatarFallback className="bg-primary/10 text-primary">
                                                {user.name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{user.name}</div>
                                            <div className="text-xs text-muted-foreground">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="text-sm">{user.role}</div>
                                </td>
                                <td className="px-4 py-3">
                                    <Badge variant="outline" className={`${getStatusStyles(user.status)} font-normal`}>
                                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="text-sm">{user.lastActive}</div>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Open menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>View details</DropdownMenuItem>
                                            <DropdownMenuItem>Edit user</DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-500 focus:text-red-500">
                                                Deactivate
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};

const AdminDashboard = () => {
    return (

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight mb-1">Dashboard</h2>
                        <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Export
                        </Button>
                        <Button size="sm">
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Refresh
                        </Button>
                    </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {statsData.map((stat, index) => (
                        <StatCard
                            key={index}
                            title={stat.title}
                            value={stat.value}
                            description={stat.description}
                            Icon={stat.icon}
                            trend={stat.trend}
                            color={stat.color}
                            bgColor={stat.bgColor}
                        />
                    ))}
                </div>

                {/* Charts row */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <OverviewChart
                        title="User Growth"
                        chartType="area"
                    />
                    <OverviewChart
                        title="Job Applications"
                        chartType="bar"
                    />
                </div>

                {/* Recent users table */}
                <RecentUsersTable users={recentUsers} />
            </div>
    );
};

export default AdminDashboard;