import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ErrorBanner } from "@/components/admin/ErrorBanner.jsx";
import { SuccessBanner } from "@/components/admin/SuccessBanner.jsx";

import { useCompanyStatistics } from "@/hooks/userQueries";
import {
  useUsers,
  useUserUpdate,
  useDeleteUser,
  usePromoteUser,
} from "@/hooks/userQueries";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Building2,
  CheckCircle,
  Clock,
  XCircle,
  Users,
  UserPlus,
  UserCheck,
  MoreHorizontal,
  RefreshCw,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  ChevronUp,
  ChevronDown,
  Edit,
  Trash2,
  Shield,
  Loader2,
  X,
} from "lucide-react";
import { PasswordDialog } from "@/components/admin/PasswordDialog.jsx";

// Generate mock trend data since API doesn't provide time-series data
const generateMockTrendData = () => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentMonth = new Date().getMonth();

  return months
    .slice(currentMonth - 6, currentMonth + 1)
    .map((month, index) => {
      // Create some realistic looking data with an upward trend
      const baseVerified = 2 + Math.floor(index * 0.7);
      const basePending = 3 + Math.floor(Math.random() * 3);
      const baseRejected = Math.floor(Math.random() * 2);

      return {
        name: month,
        verified: baseVerified,
        pending: basePending,
        rejected: baseRejected,
        total: baseVerified + basePending + baseRejected,
      };
    });
};

const mockTrendData = generateMockTrendData();
const COLORS = ["#9b87f5", "#7E69AB", "#FFDEE2", "#D3E4FD"];

// StatCard component for displaying statistics
const StatCard = ({
  title,
  value,
  description,
  Icon,
  trend = 0,
  color,
  bgColor,
}) => {
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

// User management dia`log` component
const UserDialog = ({ user, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "user",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...user, ...formData });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {user
              ? "Make changes to the user details."
              : "Enter details for the new user."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Name
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="role" className="text-right">
                Role
              </label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Main Dashboard Component
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "ascending",
  });
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Fetch company statistics
  const {
    data: companyStatsData,
    isLoading: statsLoading,
    isError: statsError,
    error: statsErrorData,
    refetch: refetchStats,
  } = useCompanyStatistics();

  // Fetch users
  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersError,
    error: usersErrorData,
    refetch: refetchUsers,
  } = useUsers();

  // User mutation hooks
  const updateUserMutation = useUserUpdate();
  const deleteUserMutation = useDeleteUser();
  const promoteUserMutation = usePromoteUser();

  // Extract company statistics
  const companyStats = companyStatsData?.statistics || {
    totalCompanies: 0,
    verifiedCompanies: 0,
    pendingCompanies: 0,
    rejectedCompanies: 0,
  };

  // Calculate verification rate
  const verificationRate =
    companyStats.totalCompanies > 0
      ? Math.round(
          (companyStats.verifiedCompanies / companyStats.totalCompanies) * 100
        )
      : 0;

  // Calculate pending rate
  const pendingRate =
    companyStats.totalCompanies > 0
      ? Math.round(
          (companyStats.pendingCompanies / companyStats.totalCompanies) * 100
        )
      : 0;

  // Calculate rejection rate
  const rejectionRate =
    companyStats.totalCompanies > 0
      ? Math.round(
          (companyStats.rejectedCompanies / companyStats.totalCompanies) * 100
        )
      : 0;

  // Filter users based on search term
  const filteredUsers = usersData?.users
    ? usersData?.users?.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Sort users
  const sortedUsers = [...(filteredUsers || [])].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  // Handle sort request
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Handle user edit
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  // Handle user save
  const handleSaveUser = (userData) => {
    updateUserMutation.mutate(
      { userId: userData._id, ...userData },
      {
        onSuccess: () => {
          setNotification({
            type: "success",
            message: `User ${userData.name} updated successfully`,
          });
          setTimeout(() => setNotification(null), 3000);
        },
        onError: (error) => {
          setNotification({
            type: "error",
            message: `Error updating user: ${error.message}`,
          });
          setTimeout(() => setNotification(null), 5000);
        },
      }
    );
  };

  // Handle user delete
  const handleDeleteUser = (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
      setUserToDelete({ id: userId, name: userName });
      setIsPasswordDialogOpen(true);
    }
  };

  // Add this new function after handleDeleteUser
  // Handle password confirmation and actual deletion
  const handlePasswordConfirm = (password) => {
    if (!userToDelete) return;

    deleteUserMutation.mutate(
      { userId: userToDelete.id, password },
      {
        onSuccess: () => {
          setNotification({
            type: "success",
            message: `User ${userToDelete.name} deleted successfully`,
          });
          setTimeout(() => setNotification(null), 3000);
          setIsPasswordDialogOpen(false);
          setUserToDelete(null);
        },
        onError: (error) => {
          setNotification({
            type: "error",
            message: `Error deleting user: ${
              error.message || "Invalid password or insufficient permissions"
            }`,
          });
          setTimeout(() => setNotification(null), 5000);
        },
      }
    );
  };

  // Handle user promote
  const handlePromoteUser = (userId, userName) => {
    promoteUserMutation.mutate(userId, {
      onSuccess: () => {
        setNotification({
          type: "success",
          message: `User ${userName} promoted successfully`,
        });
        setTimeout(() => setNotification(null), 3000);
      },
      onError: (error) => {
        setNotification({
          type: "error",
          message: `Error promoting user: ${error.message}`,
        });
        setTimeout(() => setNotification(null), 5000);
      },
    });
  };

  // Handle refresh data
  const handleRefreshData = () => {
    if (activeTab === "overview" || activeTab === "companies") {
      refetchStats();
    } else if (activeTab === "users") {
      refetchUsers();
    }
  };

  // Prepare chart data for company verification methods
  const verificationMethodsData = [
    { name: "Email", value: 45 },
    { name: "Domain", value: 30 },
    { name: "Manual", value: 15 },
    { name: "API", value: 10 },
  ];

  return (
    <div className="bg-gray-50 dark:bg-[var(--color-background)] min-h-screen p-6">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 w-80 md:w-96 shadow-lg">
          {notification.type === "error" ? (
            <ErrorBanner message={notification.message} />
          ) : (
            <SuccessBanner message={notification.message} />
          )}
        </div>
      )}

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your platform's companies, users, and view analytics.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefreshData}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            {statsError && (
              <ErrorBanner
                title="Failed to load statistics"
                message={
                  statsErrorData?.message ||
                  "There was an error loading the statistics data"
                }
                onRetry={refetchStats}
                className="mb-6"
              />
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {statsLoading ? (
                // Loading skeletons
                Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="overflow-hidden border-border/40">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="h-9 w-9 rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="h-8 w-16 mb-1 bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                      </CardContent>
                      <CardFooter className="pt-1">
                        <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                      </CardFooter>
                    </Card>
                  ))
              ) : (
                <>
                  <StatCard
                    title="Total Companies"
                    value={companyStats.totalCompanies}
                    description="All companies in the system"
                    Icon={Building2}
                    trend={10} // Mock trend data
                    color="text-blue-500"
                    bgColor="bg-blue-100 dark:bg-blue-900/30"
                  />
                  <StatCard
                    title="Verified Companies"
                    value={companyStats.verifiedCompanies}
                    description={`${verificationRate}% verification rate`}
                    Icon={CheckCircle}
                    trend={5} // Mock trend data
                    color="text-green-500"
                    bgColor="bg-green-100 dark:bg-green-900/30"
                  />
                  <StatCard
                    title="Pending Verification"
                    value={companyStats.pendingCompanies}
                    description={`${pendingRate}% of total companies`}
                    Icon={Clock}
                    trend={-2} // Mock trend data
                    color="text-amber-500"
                    bgColor="bg-amber-100 dark:bg-amber-900/30"
                  />
                  <StatCard
                    title="Rejected Companies"
                    value={companyStats.rejectedCompanies}
                    description={`${rejectionRate}% rejection rate`}
                    Icon={XCircle}
                    trend={0} // Mock trend data
                    color="text-red-500"
                    bgColor="bg-red-100 dark:bg-red-900/30"
                  />
                </>
              )}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Company Verification Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Company Verification Trends</CardTitle>
                  <CardDescription>
                    Monthly verification statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {statsLoading ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={mockTrendData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient
                              id="colorVerified"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#9b87f5"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor="#9b87f5"
                                stopOpacity={0.1}
                              />
                            </linearGradient>
                            <linearGradient
                              id="colorPending"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#7E69AB"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor="#7E69AB"
                                stopOpacity={0.1}
                              />
                            </linearGradient>
                            <linearGradient
                              id="colorRejected"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#FFDEE2"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor="#FFDEE2"
                                stopOpacity={0.1}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                          <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12 }}
                            axisLine={{ stroke: "var(--border)" }}
                            tickLine={false}
                          />
                          <YAxis
                            tick={{ fontSize: 12 }}
                            axisLine={{ stroke: "var(--border)" }}
                            tickLine={false}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "var(--card)",
                              borderColor: "var(--border)",
                              borderRadius: "8px",
                            }}
                          />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="verified"
                            name="Verified"
                            stroke="#9b87f5"
                            fillOpacity={1}
                            fill="url(#colorVerified)"
                          />
                          <Area
                            type="monotone"
                            dataKey="pending"
                            name="Pending"
                            stroke="#7E69AB"
                            fillOpacity={1}
                            fill="url(#colorPending)"
                          />
                          <Area
                            type="monotone"
                            dataKey="rejected"
                            name="Rejected"
                            stroke="#FFDEE2"
                            fillOpacity={1}
                            fill="url(#colorRejected)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Verification Methods */}
              <Card>
                <CardHeader>
                  <CardTitle>Verification Methods</CardTitle>
                  <CardDescription>
                    How companies are being verified
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {statsLoading ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={verificationMethodsData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            innerRadius={60}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {verificationMethodsData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "var(--card)",
                              borderColor: "var(--border)",
                              borderRadius: "8px",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Statistics</CardTitle>
                  <CardDescription>Overview of user accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  {usersLoading ? (
                    <div className="h-[200px] flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : usersError ? (
                    <ErrorBanner
                      message={
                        usersErrorData?.message || "Failed to load user data"
                      }
                      onRetry={refetchUsers}
                    />
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Total Users
                        </span>
                        <span className="font-bold text-lg">
                          {usersData?.length || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Admins</span>
                        <span className="font-bold text-lg">
                          {usersData?.users?.filter(
                            (user) => user.role === "admin"
                          ).length || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Moderators
                        </span>
                        <span className="font-bold text-lg">
                          {usersData?.users?.filter(
                            (user) => user.role === "moderator"
                          ).length || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Regular Users
                        </span>
                        <span className="font-bold text-lg">
                          {usersData?.users?.filter(
                            (user) => user.role === "user"
                          ).length || 0}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest actions on the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                        <UserCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          New user registered
                        </p>
                        <p className="text-xs text-muted-foreground">
                          2 minutes ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Company verified</p>
                        <p className="text-xs text-muted-foreground">
                          15 minutes ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                        <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          New company pending verification
                        </p>
                        <p className="text-xs text-muted-foreground">
                          1 hour ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                        <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          User promoted to admin
                        </p>
                        <p className="text-xs text-muted-foreground">
                          3 hours ago
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Companies Tab */}
          <TabsContent value="companies">
            <Card>
              <CardHeader>
                <CardTitle>Company Verification Status</CardTitle>
                <CardDescription>
                  Current verification statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div className="h-[200px] flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : statsError ? (
                  <ErrorBanner
                    message={
                      statsErrorData?.message ||
                      "Failed to load company statistics"
                    }
                    onRetry={refetchStats}
                  />
                ) : (
                  <div className="space-y-6">
                    {/* Verification Rate */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">
                          Verification Rate
                        </span>
                        <span className="text-sm font-medium">
                          {verificationRate}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div
                          className="bg-green-600 h-2.5 rounded-full"
                          style={{ width: `${verificationRate}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {companyStats.verifiedCompanies} out of{" "}
                        {companyStats.totalCompanies} companies verified
                      </p>
                    </div>

                    {/* Pending Rate */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">
                          Pending Rate
                        </span>
                        <span className="text-sm font-medium">
                          {pendingRate}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div
                          className="bg-amber-500 h-2.5 rounded-full"
                          style={{ width: `${pendingRate}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {companyStats.pendingCompanies} out of{" "}
                        {companyStats.totalCompanies} companies pending
                      </p>
                    </div>

                    {/* Rejection Rate */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">
                          Rejection Rate
                        </span>
                        <span className="text-sm font-medium">
                          {rejectionRate}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div
                          className="bg-red-500 h-2.5 rounded-full"
                          style={{ width: `${rejectionRate}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {companyStats.rejectedCompanies} out of{" "}
                        {companyStats.totalCompanies} companies rejected
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                      Manage user accounts and permissions
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        className="pl-8 w-full md:w-[250px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm("")}
                          className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <Button
                      onClick={() => {
                        setSelectedUser(null);
                        setIsDialogOpen(true);
                      }}
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Add User
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="h-[200px] flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : usersError ? (
                  <ErrorBanner
                    message={
                      usersErrorData?.message || "Failed to load user data"
                    }
                    onRetry={refetchUsers}
                  />
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[250px]">
                            <button
                              className="flex items-center gap-1"
                              onClick={() => requestSort("name")}
                            >
                              Name
                              {sortConfig.key === "name" ? (
                                sortConfig.direction === "ascending" ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )
                              ) : (
                                <ChevronUp className="h-4 w-4 opacity-0" />
                              )}
                            </button>
                          </TableHead>
                          <TableHead>
                            <button
                              className="flex items-center gap-1"
                              onClick={() => requestSort("email")}
                            >
                              Email
                              {sortConfig.key === "email" ? (
                                sortConfig.direction === "ascending" ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )
                              ) : (
                                <ChevronUp className="h-4 w-4 opacity-0" />
                              )}
                            </button>
                          </TableHead>
                          <TableHead>
                            <button
                              className="flex items-center gap-1"
                              onClick={() => requestSort("role")}
                            >
                              Role
                              {sortConfig.key === "role" ? (
                                sortConfig.direction === "ascending" ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )
                              ) : (
                                <ChevronUp className="h-4 w-4 opacity-0" />
                              )}
                            </button>
                          </TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedUsers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8">
                              {searchTerm ? (
                                <div className="flex flex-col items-center">
                                  <Search className="h-8 w-8 text-muted-foreground mb-2" />
                                  <p className="text-muted-foreground">
                                    No users found matching "{searchTerm}"
                                  </p>
                                  <Button
                                    variant="link"
                                    onClick={() => setSearchTerm("")}
                                    className="mt-2"
                                  >
                                    Clear search
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center">
                                  <Users className="h-8 w-8 text-muted-foreground mb-2" />
                                  <p className="text-muted-foreground">
                                    No users found
                                  </p>
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedUser(null);
                                      setIsDialogOpen(true);
                                    }}
                                    className="mt-2"
                                  >
                                    <UserPlus className="h-4 w-4 mr-1" />
                                    Add User
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ) : (
                          sortedUsers.map((user) => (
                            <TableRow key={user._id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage
                                      src={
                                        user.imageUrl || user.socialLoginAvatar
                                      }
                                      alt={user.firstName}
                                    />
                                    <AvatarFallback>
                                      {user.firstName.charAt(0).toUpperCase() +
                                        user.lastName.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  {user.name}
                                </div>
                              </TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    user.role === "admin"
                                      ? "default"
                                      : user.role === "moderator"
                                      ? "outline"
                                      : "secondary"
                                  }
                                >
                                  {user.role}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                      Actions
                                    </DropdownMenuLabel>
                                    <DropdownMenuItem
                                      onClick={() => handleEditUser(user)}
                                    >
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    {user.role !== "admin" && (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handlePromoteUser(
                                            user._id,
                                            user.firstName
                                          )
                                        }
                                      >
                                        <Shield className="h-4 w-4 mr-2" />
                                        Promote
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-red-600 focus:text-red-600"
                                      onClick={() =>
                                        handleDeleteUser(
                                          user._id,
                                          user.firsName
                                        )
                                      }
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* User Dialog */}
      <UserDialog
        user={selectedUser}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveUser}
      />
      {/* Password Confirmation Dialog */}
      <PasswordDialog
        isOpen={isPasswordDialogOpen}
        onClose={() => {
          setIsPasswordDialogOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={handlePasswordConfirm}
        title="Confirm User Deletion"
        description={`Please enter your password to delete user ${
          userToDelete?.name || ""
        }`}
        isLoading={deleteUserMutation.isPending}
      />
    </div>
  );
}
