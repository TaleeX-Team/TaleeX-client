"use client";

import { useState, useEffect, useRef } from "react";
import {
    Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter
} from "@/components/ui/card";
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
    DownloadCloud, RefreshCw, Building2, CheckCircle, Clock, XCircle,
    AlertCircle, Download, MoreHorizontal, ArrowUpRight, ArrowDownRight, Loader2
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useAllStatistics } from "@/hooks/useAdminStatistics";
import { useTheme } from "@/layouts/theme_provider/ThemeProvider.jsx";

gsap.registerPlugin(ScrollTrigger);

const COLORS = ["#9b87f5", "#7E69AB", "#FFDEE2", "#D3E4FD"];

// StatCard component
const StatCard = ({ title, value, description, Icon, trend = 0, color, bgColor }) => {
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
                    <span className={isPositive ? "text-green-500" : "text-red-500"}>{Math.abs(trend)}%</span>
                </div>
            </CardHeader>
            <CardContent className="pb-2">
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{title}</p>
            </CardContent>
            <CardFooter className="pt-1 text-xs text-muted-foreground">{description}</CardFooter>
        </Card>
    );
};

// OverviewChart component
const OverviewChart = ({
                           title,
                           description = "Overview of activity",
                           chartType = "area",
                           data,
                           dataKey = "value",
                           colors = {},
                           onRefresh
                       }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Clean, simplified tooltip component
    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload || !payload.length) return null;

        return (
            <div className={`p-4 ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'} rounded-md shadow-md`}>
                <p className="text-sm font-medium mb-2">{label}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-xs">{entry.name}: <strong>{entry.value}</strong></span>
                    </div>
                ))}
            </div>
        );
    };

    // Primary color and theme-based styling
    const primaryColor = '#2563eb';
    const axisColor = isDark ? '#6b7280' : '#d1d5db';
    const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

    // Simplified chart rendering helper
    const renderChart = () => {
        if (chartType === "area") {
            return (
                <AreaChart  data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={primaryColor} stopOpacity={0.2} />
                            <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
                        </linearGradient>
                        {colors.gradients?.map((gradient, index) => (
                            <linearGradient key={index} id={`color${gradient.id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={gradient.color} stopOpacity={0.2} />
                                <stop offset="95%" stopColor={gradient.color} stopOpacity={0} />
                            </linearGradient>
                        ))}
                    </defs>
                    <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
                    <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11, fill: isDark ? '#e5e7eb' : '#4b5563' }}
                        axisLine={{ stroke: axisColor }}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 11, fill: isDark ? '#e5e7eb' : '#4b5563' }}
                        axisLine={{ stroke: axisColor }}
                        tickLine={false}
                        width={30}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ paddingTop: 20 }}
                    />
                    {Array.isArray(dataKey) ? (
                        dataKey.map((key, index) => (
                            <Area
                                key={key}
                                type="monotone"
                                dataKey={key}
                                stroke={colors.strokes?.[index] || COLORS[index % COLORS.length]}
                                strokeWidth={2}
                                fillOpacity={1}
                                fill={colors.fills?.[index] ? `url(#color${colors.fills[index]})` : index === 0 ? "url(#colorValue)" : `url(#color${key})`}
                            />
                        ))
                    ) : (
                        <Area
                            type="monotone"
                            dataKey={dataKey}
                            stroke={primaryColor}
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                        />
                    )}
                </AreaChart>
            );
        } else if (chartType === "bar") {
            return (
                <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                    <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
                    <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11, fill: isDark ? '#e5e7eb' : '#4b5563' }}
                        axisLine={{ stroke: axisColor }}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 11, fill: isDark ? '#e5e7eb' : '#4b5563' }}
                        axisLine={{ stroke: axisColor }}
                        tickLine={false}
                        width={30}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ paddingTop: 20 }}
                    />
                    {Array.isArray(dataKey) ? (
                        dataKey.map((key, index) => (
                            <Bar
                                key={key}
                                dataKey={key}
                                fill={colors.fills?.[index] || COLORS[index % COLORS.length]}
                                radius={[4, 4, 0, 0]}
                                barSize={30}
                            />
                        ))
                    ) : (
                        <Bar
                            dataKey={dataKey}
                            fill={primaryColor}
                            radius={[4, 4, 0, 0]}
                            barSize={30}
                        />
                    )}
                </BarChart>
            );
        } else {
            return (
                <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={90}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        iconType="circle"
                        iconSize={8}
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        wrapperStyle={{ paddingTop: 20 }}
                    />
                </PieChart>
            );
        }
    };

    return (
        <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem className="cursor-pointer hover:bg-primary hover:text-white">
                                <Download className="mr-2 h-4 w-4" />
                                <span>Download</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={onRefresh} className="cursor-pointer hover:bg-primary hover:text-white">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                <span>Refresh</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent className="pt-4 pb-4">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        {renderChart()}
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

const AnalyticsPage = () => {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const pageRef = useRef(null);
    const chartsRef = useRef([]);
    const [timePeriod, setTimePeriod] = useState("lastWeek");
    const [isRefetching, setIsRefetching] = useState(false);

    // Calculate date range based on selected time period
    const getDateRange = () => {
        const today = new Date();
        const fromDate = new Date();

        switch (timePeriod) {
            case "lastWeek":
                fromDate.setDate(today.getDate() - 7);
                break;
            case "lastMonth":
                fromDate.setDate(today.getDate() - 30);
                break;
            case "lastQuarter":
                fromDate.setDate(today.getDate() - 90);
                break;
            case "lastYear":
                fromDate.setDate(today.getDate() - 365);
                break;
            default:
                fromDate.setDate(today.getDate() - 30);
        }

        const formatDate = (date) => {
            const day = date.getDate().toString().padStart(2, "0");
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        };

        return {
            from: formatDate(fromDate),
            to: formatDate(today),
        };
    };

    const dateRangeValues = getDateRange();
    const {
        applicationsByStage,
        dailyApplications,
        jobsByCompany,
        dailyRegistrations,
        reportsByReason,
        interviewsByState,
        avgTimePerStage,
        conversionFunnel,
        timeToOfferPerJob,
        topAppliedJobs,
        isLoading,
        isError,
        errors,
        refetch,
    } = useAllStatistics({
        from: dateRangeValues.from,
        to: dateRangeValues.to,
    });

    // Handle refresh
    const handleRefresh = async () => {
        setIsRefetching(true);
        await refetch();
        setIsRefetching(false);
    };

    // Handle time period change
    const handleTimePeriodChange = async (newPeriod) => {
        setTimePeriod(newPeriod);
        setIsRefetching(true);
        await refetch();
        setIsRefetching(false);
    };

    // Data formatting functions
    const formatApplicationsByStageForChart = () => {
        if (!applicationsByStage?.length) return [];
        return applicationsByStage.map((item) => ({
            name: item.stage.charAt(0).toUpperCase() + item.stage.slice(1).replace(/-/g, " "),
            value: item.count,
        }));
    };

    const formatDailyApplicationsForChart = () => {
        return dailyApplications.map((item) => ({
            name: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            applications: item.count,
        }));
    };

    const formatInterviewsByStateForChart = () => {
        if (!interviewsByState?.length) return [];
        return interviewsByState.map((item) => ({
            name: item.state.charAt(0).toUpperCase() + item.state.slice(1).replace(/-/g, " "),
            value: item.count,
        }));
    };

    const formatConversionFunnelForChart = () => {
        if (!conversionFunnel?.length) return [];
        return conversionFunnel.map((item) => ({
            name: item.stage.charAt(0).toUpperCase() + item.stage.slice(1).replace(/-/g, " "),
            count: item.count,
            rate: Number.parseFloat((item.rate * 100).toFixed(1)),
        }));
    };

    const formatTopAppliedJobsForChart = () => {
        if (!topAppliedJobs?.length) return [];
        return topAppliedJobs.slice(0, 5).map((item) => ({
            name: item.jobTitle,
            applications: item.count,
        }));
    };

    const formatJobsByCompanyForChart = () => {
        if (!jobsByCompany?.length) {
            console.log("Using fallback data for jobs by company");
            return getFallbackJobsByCompanyData().map((item) => ({
                name: item.companyName,
                value: item.jobCount,
            }));
        }
        return jobsByCompany.map((item) => ({
            name: item.companyName,
            value: item.jobCount,
        }));
    };

    // Fallback data
    const getFallbackDailyApplicationsData = () => {
        return [
            { date: "2023-05-01", count: 12 },
            { date: "2023-05-02", count: 15 },
            { date: "2023-05-03", count: 8 },
            { date: "2023-05-04", count: 10 },
            { date: "2023-05-05", count: 14 },
            { date: "2023-05-06", count: 7 },
            { date: "2023-05-07", count: 9 },
        ];
    };

    const getFallbackJobsByCompanyData = () => {
        return [
            { companyName: "Tech Solutions", jobCount: 8, activeJobs: 5, industry: "Technology" },
            { companyName: "Global Innovations", jobCount: 12, activeJobs: 9, industry: "Technology" },
            { companyName: "Future Systems", jobCount: 7, activeJobs: 4, industry: "Software" },
            { companyName: "Digital Experts", jobCount: 10, activeJobs: 8, industry: "IT Services" },
            { companyName: "Smart Technologies", jobCount: 6, activeJobs: 3, industry: "Hardware" },
            { companyName: "Cloud Solutions", jobCount: 9, activeJobs: 7, industry: "Cloud Computing" },
            { companyName: "Data Insights", jobCount: 5, activeJobs: 4, industry: "Data Analytics" },
            { companyName: "AI Research", jobCount: 4, activeJobs: 3, industry: "Artificial Intelligence" },
            { companyName: "Web Creators", jobCount: 11, activeJobs: 8, industry: "Web Development" },
            { companyName: "Mobile Masters", jobCount: 7, activeJobs: 5, industry: "Mobile Development" },
        ];
    };

    const getFallbackApplicationTrendsData = () => {
        const data = [];
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            const dayOfWeek = date.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const baseCount = isWeekend ? 3 + Math.floor(Math.random() * 5) : 8 + Math.floor(Math.random() * 12);
            const trendFactor = 1 + i / 60;
            const count = Math.floor(baseCount / trendFactor);
            let growth = 0;
            if (data.length > 0) {
                const prevCount = data[data.length - 1].count;
                growth = prevCount > 0 ? Math.round(((count - prevCount) / prevCount) * 100) : 0;
            }
            data.push({
                date: date.toISOString().split("T")[0],
                count,
                growth,
            });
        }
        return data;
    };

    // Calculate totals
    const totalApplications = applicationsByStage?.reduce((sum, item) => sum + item.count, 0) || 0;
    const totalInterviews = interviewsByState?.reduce((sum, item) => sum + item.count, 0) || 0;
    const pendingApplications =
        applicationsByStage?.find(
            (item) =>
                item.stage.toLowerCase() === "sending-interview" ||
                item.stage.toLowerCase() === "pending" ||
                item.stage.toLowerCase() === "in-progress"
        )?.count || 0;
    const rejectedApplications = applicationsByStage?.find((item) => item.stage.toLowerCase() === "rejected")?.count || 0;

    // GSAP animations
    useEffect(() => {
        if (typeof window !== "undefined" && pageRef.current) {
            gsap.fromTo(
                pageRef.current.querySelector(".page-header"),
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
            );

            gsap.fromTo(
                pageRef.current.querySelector(".kpi-cards"),
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power3.out" }
            );

            chartsRef.current.forEach((chart, index) => {
                if (chart) {
                    ScrollTrigger.create({
                        trigger: chart,
                        start: "top bottom-=100",
                        onEnter: () => {
                            gsap.fromTo(
                                chart,
                                { opacity: 0, y: 40 },
                                { opacity: 1, y: 0, duration: 0.7, delay: index * 0.1, ease: "power2.out" }
                            );
                        },
                        once: true,
                    });
                }
            });
        }
    }, []);

    return (
        <div ref={pageRef} className="space-y-8 p-6 max-w-7xl mx-auto">
            <div className="page-header space-y-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            Analytics Dashboard
                            <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">
                                {isLoading || isRefetching ? "Loading..." : "Live Data"}
                            </Badge>
                        </h2>
                        <p className="text-muted-foreground mt-1">
                            Track application metrics and optimize your recruitment process.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Select value={timePeriod} onValueChange={handleTimePeriodChange}>
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
                        <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading || isRefetching}>
                            {isLoading || isRefetching ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <RefreshCw className="h-4 w-4" />
                            )}
                        </Button>
                        <Button variant="outline" size="icon">
                            <DownloadCloud className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {isError && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>Failed to load statistics. Please try refreshing the page.</AlertDescription>
                </Alert>
            )}

            <div className="kpi-cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {isLoading || isRefetching ? (
                    Array(4).fill(0).map((_, i) => (
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
                    <>
                        <StatCard
                            title="Total Applications"
                            value={totalApplications}
                            description="All applications in the system"
                            Icon={Building2}
                            trend={10}
                            color="text-blue-500"
                            bgColor="bg-blue-100 dark:bg-blue-900/30"
                        />
                        <StatCard
                            title="Interviews"
                            value={totalInterviews}
                            description="Total interviews conducted"
                            Icon={CheckCircle}
                            trend={5}
                            color="text-green-500"
                            bgColor="bg-green-100 dark:bg-green-900/30"
                        />
                        <StatCard
                            title="Pending Applications"
                            value={pendingApplications}
                            description="Applications in progress"
                            Icon={Clock}
                            trend={-2}
                            color="text-amber-500"
                            bgColor="bg-amber-100 dark:bg-amber-900/30"
                        />
                        <StatCard
                            title="Rejected Applications"
                            value={rejectedApplications}
                            description="Applications rejected"
                            Icon={XCircle}
                            trend={0}
                            color="text-red-500"
                            bgColor="bg-red-100 dark:bg-red-900/30"
                        />
                    </>
                )}
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-muted/50 p-1 rounded-lg">
                    <TabsTrigger value="overview" className="rounded-md">Overview</TabsTrigger>
                    <TabsTrigger value="applications" className="rounded-md">Applications</TabsTrigger>
                    <TabsTrigger value="interviews" className="rounded-md">Interviews</TabsTrigger>
                    <TabsTrigger value="companies" className="rounded-md">Companies</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <div ref={(el) => (chartsRef.current[0] = el)}>
                        {isLoading || isRefetching ? (
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
                                title="Daily Applications"
                                description="Applications received over time"
                                chartType="area"
                                data={formatDailyApplicationsForChart()}
                                dataKey="applications"
                                colors={{
                                    strokes: ["var(--color-primary)"],
                                    fills: ["Primary"],
                                    gradients: [{ id: "Primary", color: "var(--color-primary)" }],
                                }}
                                onRefresh={handleRefresh}
                            />
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div ref={(el) => (chartsRef.current[1] = el)}>
                            {isLoading || isRefetching ? (
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
                                    title="Applications by Stage"
                                    description="Current application stages"
                                    chartType="pie"
                                    data={formatApplicationsByStageForChart()}
                                    onRefresh={handleRefresh}
                                />
                            )}
                        </div>

                        <div ref={(el) => (chartsRef.current[2] = el)}>
                            {isLoading || isRefetching ? (
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
                                    title="Top Applied Jobs"
                                    description="Most popular job postings"
                                    chartType="bar"
                                    data={formatTopAppliedJobsForChart()}
                                    dataKey="applications"
                                    colors={{ fills: ["var(--color-primary)"] }}
                                    onRefresh={handleRefresh}
                                />
                            )}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="applications" className="space-y-6">
                    <div ref={(el) => (chartsRef.current[3] = el)}>
                        {isLoading || isRefetching ? (
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
                                title="Conversion Funnel"
                                description="Application stage conversion rates"
                                chartType="bar"
                                data={formatConversionFunnelForChart()}
                                dataKey={["count", "rate"]}
                                colors={{ fills: ["var(--color-primary)", "#7E69AB"] }}
                                onRefresh={handleRefresh}
                            />
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                        <Card className="border-border/40">
                            <CardHeader>
                                <CardTitle className="text-lg">Application Statistics</CardTitle>
                                <CardDescription>Detailed application metrics</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                {isLoading || isRefetching ? (
                                    <div className="h-[300px] flex items-center justify-center">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                                ) : applicationsByStage?.length === 0 ? (
                                    <div className="h-[300px] flex items-center justify-center flex-col">
                                        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                                        <p className="text-muted-foreground text-center">No data available</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {applicationsByStage?.map((item, index) => (
                                            <div key={index}>
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-sm font-medium">
                                                        {item.stage.charAt(0).toUpperCase() + item.stage.slice(1).replace(/-/g, " ")}
                                                    </span>
                                                    <span className="text-sm font-medium">{item.count}</span>
                                                </div>
                                                <div className="w-full bg-muted rounded-full h-2">
                                                    <div
                                                        className="bg-primary h-2 rounded-full"
                                                        style={{ width: `${(item.count / totalApplications) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="interviews" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-border/40">
                            <CardHeader>
                                <CardTitle className="text-lg">Interviews by State</CardTitle>
                                <CardDescription>Current interview statuses</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                {isLoading || isRefetching ? (
                                    <div className="h-[300px] flex items-center justify-center">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                                ) : interviewsByState?.length === 0 ? (
                                    <div className="h-[300px] flex items-center justify-center flex-col">
                                        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                                        <p className="text-muted-foreground text-center">No data available</p>
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={formatInterviewsByStateForChart()}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={100}
                                                innerRadius={60}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {formatInterviewsByStateForChart().map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "8px" }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-border/40">
                            <CardHeader>
                                <CardTitle className="text-lg">Interview Statistics</CardTitle>
                                <CardDescription>Detailed interview metrics</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                {isLoading || isRefetching ? (
                                    <div className="h-[300px] flex items-center justify-center">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                                ) : interviewsByState?.length === 0 ? (
                                    <div className="h-[300px] flex items-center justify-center flex-col">
                                        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                                        <p className="text-muted-foreground text-center">No interview data available</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {interviewsByState?.map((item, index) => (
                                            <div key={index}>
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-sm font-medium">
                                                        {item.state.charAt(0).toUpperCase() + item.state.slice(1).replace(/-/g, " ")}
                                                    </span>
                                                    <span className="text-sm font-medium">{item.count}</span>
                                                </div>
                                                <div className="w-full bg-muted rounded-full h-2">
                                                    <div
                                                        className="bg-primary h-2 rounded-full"
                                                        style={{ width: `${(item.count / totalInterviews) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="companies" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                        <Card className="border-border/40">
                            <CardHeader>
                                <CardTitle className="text-lg">Reports by Reason</CardTitle>
                                <CardDescription>Reasons for reported content</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                {isLoading || isRefetching ? (
                                    <div className="h-[300px] flex items-center justify-center">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={reportsByReason?.map((item) => ({
                                                    name: item.reason.charAt(0).toUpperCase() + item.reason.slice(1),
                                                    value: item.count,
                                                }))}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={100}
                                                innerRadius={60}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {reportsByReason?.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "8px" }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AnalyticsPage;