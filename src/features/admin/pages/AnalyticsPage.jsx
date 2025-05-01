"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/layouts/theme_provider/ThemeProvider.jsx"
import {
    DownloadCloud,
    RefreshCw,
    Building2,
    CheckCircle,
    Clock,
    XCircle,
    AlertCircle,
    Download,
    MoreHorizontal,
    ArrowUpRight,
    ArrowDownRight,
    Loader2,
} from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCompanyStatistics } from "@/hooks/userQueries.js"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

// Generate mock data for charts since API doesn't provide time-series data
const generateMockTrendData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const currentMonth = new Date().getMonth()

    return months.slice(currentMonth - 6, currentMonth + 1).map((month, index) => {
        // Create some realistic looking data with an upward trend
        const baseVerified = 2 + Math.floor(index * 0.7)
        const basePending = 3 + Math.floor(Math.random() * 3)
        const baseRejected = Math.floor(Math.random() * 2)

        return {
            name: month,
            verified: baseVerified,
            pending: basePending,
            rejected: baseRejected,
            total: baseVerified + basePending + baseRejected,
        }
    })
}

const mockTrendData = generateMockTrendData()

const verificationMethodsData = [
    { name: "Email", value: 45 },
    { name: "Domain", value: 30 },
    { name: "Manual", value: 15 },
    { name: "API", value: 10 },
]

const weeklyActivityData = [
    { day: "Mon", verifications: 3, rejections: 1 },
    { day: "Tue", verifications: 5, rejections: 0 },
    { day: "Wed", verifications: 2, rejections: 1 },
    { day: "Thu", verifications: 4, rejections: 2 },
    { day: "Fri", verifications: 6, rejections: 1 },
    { day: "Sat", verifications: 1, rejections: 0 },
    { day: "Sun", verifications: 0, rejections: 0 },
]

const COLORS = ["#9b87f5", "#7E69AB", "#FFDEE2", "#D3E4FD"]

// StatCard component from your code
const StatCard = ({ title, value, description, Icon, trend = 0, color, bgColor }) => {
    const isPositive = trend >= 0

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
                    <span className={isPositive ? "text-green-500" : "text-red-500"}>{Math.abs(trend)}%</span>
                </div>
            </CardHeader>
            <CardContent className="pb-2">
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{title}</p>
            </CardContent>
            <CardFooter className="pt-1 text-xs text-muted-foreground">{description}</CardFooter>
        </Card>
    )
}

// Enhanced Charts component from your code
const OverviewChart = ({
                           title,
                           description = "Overview of activity",
                           period = "weekly",
                           chartType = "area",
                           data,
                           dataKey = "value",
                           colors = {},
                       }) => {
    return (
        <Card className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="text-lg">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <Tabs defaultValue={period} className="w-auto">
                        <TabsList className="grid grid-cols-3 h-8">
                            <TabsTrigger value="weekly" className="text-xs px-2">
                                Week
                            </TabsTrigger>
                            <TabsTrigger value="monthly" className="text-xs px-2">
                                Month
                            </TabsTrigger>
                            <TabsTrigger value="yearly" className="text-xs px-2">
                                Year
                            </TabsTrigger>
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
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                                    </linearGradient>
                                    {colors.gradients &&
                                        colors.gradients.map((gradient, index) => (
                                            <linearGradient key={index} id={`color${gradient.id}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={gradient.color} stopOpacity={0.2} />
                                                <stop offset="95%" stopColor={gradient.color} stopOpacity={0} />
                                            </linearGradient>
                                        ))}
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
                                <YAxis tick={{ fontSize: 12 }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "var(--card)",
                                        borderColor: "var(--border)",
                                        borderRadius: "8px",
                                    }}
                                />
                                <Legend />
                                {Array.isArray(dataKey) ? (
                                    dataKey.map((key, index) => (
                                        <Area
                                            key={key}
                                            type="monotone"
                                            dataKey={key}
                                            stroke={colors.strokes?.[index] || "var(--color-primary)"}
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill={colors.fills?.[index] ? `url(#color${colors.fills[index]})` : "url(#colorValue)"}
                                        />
                                    ))
                                ) : (
                                    <Area
                                        type="monotone"
                                        dataKey={dataKey}
                                        stroke="var(--color-primary)"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorValue)"
                                    />
                                )}
                            </AreaChart>
                        ) : chartType === "bar" ? (
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
                                <YAxis tick={{ fontSize: 12 }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "var(--card)",
                                        borderColor: "var(--border)",
                                        borderRadius: "8px",
                                    }}
                                />
                                <Legend />
                                {Array.isArray(dataKey) ? (
                                    dataKey.map((key, index) => (
                                        <Bar
                                            key={key}
                                            dataKey={key}
                                            fill={colors.fills?.[index] || "var(--color-primary)"}
                                            radius={[4, 4, 0, 0]}
                                        />
                                    ))
                                ) : (
                                    <Bar dataKey={dataKey} fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                                )}
                            </BarChart>
                        ) : (
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={100}
                                    innerRadius={60}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "var(--primary-foreground)",
                                        borderColor: "var(--border)",
                                        borderRadius: "8px",
                                    }}
                                />
                            </PieChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}

const AnalyticsPage = () => {
    const { theme } = useTheme()
    const isDark = theme === "dark"
    const pageRef = useRef(null)
    const chartsRef = useRef([])
    const [timePeriod, setTimePeriod] = useState("lastMonth")

    // Fetch company statistics
    const {
        data: apiResponse,
        isLoading: statsLoading,
        isError: statsError,
        refetch: refetchStats,
    } = useCompanyStatistics()

    // Extract statistics from API response
    const companyStats = apiResponse?.statistics || {
        totalCompanies: 0,
        verifiedCompanies: 0,
        pendingCompanies: 0,
        rejectedCompanies: 0,
    }

    // Calculate verification rate
    const verificationRate =
        companyStats.totalCompanies > 0
            ? Math.round((companyStats.verifiedCompanies / companyStats.totalCompanies) * 100)
            : 0

    // Calculate pending rate
    const pendingRate =
        companyStats.totalCompanies > 0
            ? Math.round((companyStats.pendingCompanies / companyStats.totalCompanies) * 100)
            : 0

    // Calculate rejection rate
    const rejectionRate =
        companyStats.totalCompanies > 0
            ? Math.round((companyStats.rejectedCompanies / companyStats.totalCompanies) * 100)
            : 0

    // Handle refresh
    const handleRefresh = () => {
        refetchStats()
    }

    // Handle time period change
    const handleTimePeriodChange = (value) => {
        setTimePeriod(value)
    }

    useEffect(() => {
        // GSAP animations for page load
        if (pageRef.current) {
            gsap.fromTo(
                pageRef.current.querySelector(".page-header"),
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
            )

            gsap.fromTo(
                pageRef.current.querySelector(".kpi-cards"),
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power3.out" },
            )

            // Set up animations for charts
            chartsRef.current.forEach((chart, index) => {
                if (chart) {
                    ScrollTrigger.create({
                        trigger: chart,
                        start: "top bottom-=100",
                        onEnter: () => {
                            gsap.fromTo(
                                chart,
                                { opacity: 0, y: 40 },
                                { opacity: 1, y: 0, duration: 0.7, delay: index * 0.1, ease: "power2.out" },
                            )
                        },
                        once: true,
                    })
                }
            })
        }
    }, [])

    return (
        <div ref={pageRef} className="space-y-8 p-6 max-w-7xl mx-auto">
            <div className="page-header space-y-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            Company Analytics
                            <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">
                                {statsLoading ? "Loading..." : "Live Data"}
                            </Badge>
                        </h2>
                        <p className="text-muted-foreground mt-1">
                            Track company verification metrics and optimize your approval process.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Select defaultValue={timePeriod} onValueChange={handleTimePeriodChange}>
                            <SelectTrigger className="w-full sm:w-44">
                                <SelectValue placeholder="Select period" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="lastWeek">Last 7 days</SelectItem>
                                <SelectItem value="lastMonth">Last 30 days</SelectItem>
                                <SelectItem value="lastQuarter">Last 90 days</SelectItem>
                                <SelectItem value="lastYear">Last 12 months</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="icon" onClick={handleRefresh} disabled={statsLoading}>
                            {statsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                        </Button>
                        <Button variant="outline" size="icon">
                            <DownloadCloud className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Error Alert */}
            {statsError && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>Failed to load company statistics. Please try refreshing the page.</AlertDescription>
                </Alert>
            )}

            {/* KPI Summary Cards */}
            <div className="kpi-cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsLoading ? (
                    // Loading skeletons
                    Array(4)
                        .fill(0)
                        .map((_, i) => (
                            <Card key={i} className="overflow-hidden border-border/40">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <Skeleton className="h-9 w-9 rounded-md" />
                                    <Skeleton className="h-4 w-16" />
                                </CardHeader>
                                <CardContent className="pb-2">
                                    <Skeleton className="h-8 w-16 mb-1" />
                                    <Skeleton className="h-4 w-24" />
                                </CardContent>
                                <CardFooter className="pt-1">
                                    <Skeleton className="h-4 w-full" />
                                </CardFooter>
                            </Card>
                        ))
                ) : (
                    // Actual stat cards
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

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-muted/50 p-1 rounded-lg">
                    <TabsTrigger value="overview" className="rounded-md">
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="verification" className="rounded-md">
                        Verification
                    </TabsTrigger>
                    <TabsTrigger value="sources" className="rounded-md">
                        Sources
                    </TabsTrigger>
                    <TabsTrigger value="reports" className="rounded-md">
                        Reports
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <div ref={(el) => (chartsRef.current[0] = el)}>
                        {statsLoading ? (
                            <Card className="border-border/40">
                                <CardHeader>
                                    <Skeleton className="h-6 w-48 mb-2" />
                                    <Skeleton className="h-4 w-64" />
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px] flex items-center justify-center">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <OverviewChart
                                title="Company Verification Trends"
                                description="Verified, pending, and rejected companies over time"
                                period="monthly"
                                chartType="area"
                                data={mockTrendData}
                                dataKey={["verified", "pending", "rejected"]}
                                colors={{
                                    strokes: ["var(--color-primary)", "#7E69AB", "#FFDEE2"],
                                    fills: ["Primary", "Secondary", "Accent"],
                                    gradients: [
                                        { id: "Primary", color: "var(--color-primary)" },
                                        { id: "Secondary", color: "#7E69AB" },
                                        { id: "Accent", color: "#FFDEE2" },
                                    ],
                                }}
                            />
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div ref={(el) => (chartsRef.current[1] = el)}>
                            {statsLoading ? (
                                <Card className="border-border/40">
                                    <CardHeader>
                                        <Skeleton className="h-6 w-48 mb-2" />
                                        <Skeleton className="h-4 w-64" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-[300px] flex items-center justify-center">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <OverviewChart
                                    title="Verification Methods"
                                    description="How companies are being verified"
                                    period="monthly"
                                    chartType="pie"
                                    data={verificationMethodsData}
                                />
                            )}
                        </div>

                        <div ref={(el) => (chartsRef.current[2] = el)}>
                            {statsLoading ? (
                                <Card className="border-border/40">
                                    <CardHeader>
                                        <Skeleton className="h-6 w-48 mb-2" />
                                        <Skeleton className="h-4 w-64" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-[300px] flex items-center justify-center">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <OverviewChart
                                    title="Weekly Verification Activity"
                                    description="Verifications and rejections by day"
                                    period="weekly"
                                    chartType="bar"
                                    data={weeklyActivityData}
                                    dataKey={["verifications", "rejections"]}
                                    colors={{
                                        fills: ["var(--color-primary)", "#FFDEE2"],
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="verification" className="space-y-6">
                    <div ref={(el) => (chartsRef.current[3] = el)}>
                        {statsLoading ? (
                            <Card className="border-border/40">
                                <CardHeader>
                                    <Skeleton className="h-6 w-48 mb-2" />
                                    <Skeleton className="h-4 w-64" />
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px] flex items-center justify-center">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <OverviewChart
                                title="Verification Efficiency"
                                description="Track your verification process efficiency"
                                period="monthly"
                                chartType="area"
                                data={mockTrendData}
                                dataKey={["verified", "pending", "rejected"]}
                                colors={{
                                    strokes: ["var(--color-primary)", "#7E69AB", "#FFDEE2"],
                                    fills: ["Primary", "Secondary", "Accent"],
                                    gradients: [
                                        { id: "Primary", color: "var(--color-primary)" },
                                        { id: "Secondary", color: "#7E69AB" },
                                        { id: "Accent", color: "#FFDEE2" },
                                    ],
                                }}
                            />
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-border/40">
                            <CardHeader>
                                <CardTitle className="text-lg">Verification Rate</CardTitle>
                                <CardDescription>Percentage of companies verified</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="flex flex-col items-center justify-center h-[200px]">
                                    <div className="text-5xl font-bold text-primary">{verificationRate}%</div>
                                    <p className="text-muted-foreground mt-2">
                                        {companyStats.verifiedCompanies} out of {companyStats.totalCompanies} companies
                                    </p>
                                    <div className="w-full mt-6 bg-muted rounded-full h-4 overflow-hidden">
                                        <div className="bg-primary h-full rounded-full" style={{ width: `${verificationRate}%` }}></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border/40">
                            <CardHeader>
                                <CardTitle className="text-lg">Pending Rate</CardTitle>
                                <CardDescription>Percentage of companies pending verification</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="flex flex-col items-center justify-center h-[200px]">
                                    <div className="text-5xl font-bold text-amber-500">{pendingRate}%</div>
                                    <p className="text-muted-foreground mt-2">
                                        {companyStats.pendingCompanies} out of {companyStats.totalCompanies} companies
                                    </p>
                                    <div className="w-full mt-6 bg-muted rounded-full h-4 overflow-hidden">
                                        <div className="bg-amber-500 h-full rounded-full" style={{ width: `${pendingRate}%` }}></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="sources">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-border/40">
                            <CardHeader>
                                <CardTitle className="text-lg">Verification by Source</CardTitle>
                                <CardDescription>Where verified companies are coming from</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                {statsLoading ? (
                                    <div className="h-[300px] flex items-center justify-center">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height={300}>
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
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {verificationMethodsData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-border/40">
                            <CardHeader>
                                <CardTitle className="text-lg">Verification Method Effectiveness</CardTitle>
                                <CardDescription>Success rates by verification method</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                {statsLoading ? (
                                    <div className="h-[300px] flex items-center justify-center">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart
                                            data={[
                                                { method: "Email", success: 85, failure: 15 },
                                                { method: "Domain", success: 92, failure: 8 },
                                                { method: "Manual", success: 78, failure: 22 },
                                                { method: "API", success: 95, failure: 5 },
                                            ]}
                                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                            <XAxis
                                                dataKey="method"
                                                tick={{ fontSize: 12 }}
                                                axisLine={{ stroke: "var(--border)" }}
                                                tickLine={false}
                                            />
                                            <YAxis tick={{ fontSize: 12 }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "var(--card)",
                                                    borderColor: "var(--border)",
                                                    borderRadius: "8px",
                                                }}
                                            />
                                            <Legend />
                                            <Bar
                                                dataKey="success"
                                                name="Success"
                                                fill="var(--color-primary)"
                                                stackId="a"
                                                radius={[4, 4, 0, 0]}
                                            />
                                            <Bar dataKey="failure" name="Failure" fill="#FFDEE2" stackId="a" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="reports">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <Skeleton className="h-12 w-12 rounded-full" />
                            </div>
                            <h3 className="text-lg font-medium">Custom reports coming soon</h3>
                            <p className="text-muted-foreground">This feature is under development.</p>
                            <Button variant="outline">Request Early Access</Button>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default AnalyticsPage

