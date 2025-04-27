import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/layouts/theme_provider/ThemeProvider.jsx";
import { ChevronDown, DownloadCloud, RefreshCw, Calendar } from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const monthlyData = [
    { name: 'Jan', jobPosts: 65, applications: 180, hires: 12 },
    { name: 'Feb', jobPosts: 59, applications: 150, hires: 10 },
    { name: 'Mar', jobPosts: 80, applications: 210, hires: 15 },
    { name: 'Apr', jobPosts: 81, applications: 250, hires: 17 },
    { name: 'May', jobPosts: 56, applications: 190, hires: 14 },
    { name: 'Jun', jobPosts: 55, applications: 170, hires: 12 },
    { name: 'Jul', jobPosts: 40, applications: 150, hires: 8 },
];

const weeklyData = [
    { day: 'Mon', users: 30, sessions: 75 },
    { day: 'Tue', users: 45, sessions: 95 },
    { day: 'Wed', users: 55, sessions: 120 },
    { day: 'Thu', users: 48, sessions: 110 },
    { day: 'Fri', users: 50, sessions: 105 },
    { day: 'Sat', users: 35, sessions: 70 },
    { day: 'Sun', users: 25, sessions: 50 },
];

const channelData = [
    { name: 'LinkedIn', value: 45 },
    { name: 'Direct', value: 30 },
    { name: 'Referral', value: 15 },
    { name: 'Google', value: 10 },
];

const COLORS = ['#9b87f5', '#7E69AB', '#FFDEE2', '#D3E4FD'];

// KPI summary data
const kpiData = [
    { title: "Total Applications", value: "1,250", change: "+12%", icon: "📈" },
    { title: "Conversion Rate", value: "6.8%", change: "+2.4%", icon: "🔄" },
    { title: "Time to Hire", value: "24 days", change: "-3 days", icon: "⏱️" },
    { title: "Open Positions", value: "18", change: "+4", icon: "🔍" },
];

const AnalyticsPage = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const pageRef = useRef(null);
    const chartsRef = useRef([]);

    const chartConfig = {
        gridColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
        textColor: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
        tooltipBackground: isDark ? '#1A1F2C' : '#fff',
        tooltipBorder: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.1)',
        tooltipColor: isDark ? '#fff' : '#000'
    };

    useEffect(() => {
        // GSAP animations for page load
        if (pageRef.current) {
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
                                { opacity: 1, y: 0, duration: 0.7, delay: index * 0.1, ease: "power2.out" }
                            );
                        },
                        once: true
                    });
                }
            });
        }
    }, []);

    return (
        <div ref={pageRef} className="space-y-8 p-6 max-w-7xl mx-auto">
            <div className="page-header space-y-2">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        Analytics Dashboard
                        <span className="text-sm bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-md">
                            Pro
                        </span>
                    </h2>
                    <div className="flex items-center gap-2">
                        <Select defaultValue="lastMonth">
                            <SelectTrigger className="w-44">
                                <SelectValue placeholder="Select period" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="lastWeek">Last 7 days</SelectItem>
                                <SelectItem value="lastMonth">Last 30 days</SelectItem>
                                <SelectItem value="lastQuarter">Last 90 days</SelectItem>
                                <SelectItem value="lastYear">Last 12 months</SelectItem>
                                <SelectItem value="custom">Custom Range</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="icon">
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                            <DownloadCloud className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <p className="text-muted-foreground">
                    Track your recruitment metrics and optimize your hiring process.
                </p>
            </div>

            {/* KPI Summary Cards */}
            <div className="kpi-cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpiData.map((kpi, index) => (
                    <Card key={index} className="overflow-hidden border border-muted">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                                    <h3 className="text-2xl font-bold mt-1">{kpi.value}</h3>
                                    <p className={`text-xs font-medium mt-1 ${kpi.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                        {kpi.change} from previous period
                                    </p>
                                </div>
                                <div className="text-3xl">{kpi.icon}</div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-muted/50 p-1 rounded-lg">
                    <TabsTrigger value="overview" className="rounded-md">Overview</TabsTrigger>
                    <TabsTrigger value="recruitment" className="rounded-md">Recruitment</TabsTrigger>
                    <TabsTrigger value="engagement" className="rounded-md">Engagement</TabsTrigger>
                    <TabsTrigger value="reports" className="rounded-md">Reports</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <div ref={el => chartsRef.current[0] = el}>
                        <Card className="border border-muted shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div>
                                    <CardTitle>Monthly Recruitment Trends</CardTitle>
                                    <CardDescription>Applications, job posts, and hires over time</CardDescription>
                                </div>
                                <Select defaultValue="sixMonths">
                                    <SelectTrigger className="w-36">
                                        <SelectValue placeholder="Time period" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="threeMonths">Last 3 months</SelectItem>
                                        <SelectItem value="sixMonths">Last 6 months</SelectItem>
                                        <SelectItem value="year">Last 12 months</SelectItem>
                                    </SelectContent>
                                </Select>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart
                                            data={monthlyData}
                                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                        >
                                            <defs>
                                                <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8}/>
                                                    <stop offset="95%" stopColor="#9b87f5" stopOpacity={0.1}/>
                                                </linearGradient>
                                                <linearGradient id="colorJobPosts" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#7E69AB" stopOpacity={0.8}/>
                                                    <stop offset="95%" stopColor="#7E69AB" stopOpacity={0.1}/>
                                                </linearGradient>
                                                <linearGradient id="colorHires" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#FFDEE2" stopOpacity={0.8}/>
                                                    <stop offset="95%" stopColor="#FFDEE2" stopOpacity={0.1}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.gridColor} />
                                            <XAxis
                                                dataKey="name"
                                                stroke={chartConfig.textColor}
                                                tick={{ fill: chartConfig.textColor }}
                                            />
                                            <YAxis
                                                stroke={chartConfig.textColor}
                                                tick={{ fill: chartConfig.textColor }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: chartConfig.tooltipBackground,
                                                    border: chartConfig.tooltipBorder,
                                                    color: chartConfig.tooltipColor,
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                }}
                                            />
                                            <Legend />
                                            <Area
                                                type="monotone"
                                                dataKey="applications"
                                                stroke="#9b87f5"
                                                fillOpacity={1}
                                                fill="url(#colorApplications)"
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="jobPosts"
                                                stroke="#7E69AB"
                                                fillOpacity={1}
                                                fill="url(#colorJobPosts)"
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="hires"
                                                stroke="#FFDEE2"
                                                fillOpacity={1}
                                                fill="url(#colorHires)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div ref={el => chartsRef.current[1] = el}>
                            <Card className="border border-muted shadow-sm h-full">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <div>
                                        <CardTitle>Applicant Sources</CardTitle>
                                        <CardDescription>Where your applicants are coming from</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={channelData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    outerRadius={100}
                                                    innerRadius={60}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                >
                                                    {channelData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: chartConfig.tooltipBackground,
                                                        border: chartConfig.tooltipBorder,
                                                        color: chartConfig.tooltipColor,
                                                        borderRadius: '8px',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                    }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div ref={el => chartsRef.current[2] = el}>
                            <Card className="border border-muted shadow-sm h-full">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <div>
                                        <CardTitle>Weekly User Activity</CardTitle>
                                        <CardDescription>Active users and sessions by day</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={weeklyData}
                                                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.gridColor} />
                                                <XAxis
                                                    dataKey="day"
                                                    stroke={chartConfig.textColor}
                                                    tick={{ fill: chartConfig.textColor }}
                                                />
                                                <YAxis
                                                    stroke={chartConfig.textColor}
                                                    tick={{ fill: chartConfig.textColor }}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: chartConfig.tooltipBackground,
                                                        border: chartConfig.tooltipBorder,
                                                        color: chartConfig.tooltipColor,
                                                        borderRadius: '8px',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                    }}
                                                />
                                                <Legend />
                                                <Bar
                                                    dataKey="users"
                                                    fill="#9b87f5"
                                                    name="Active Users"
                                                    radius={[4, 4, 0, 0]}
                                                />
                                                <Bar
                                                    dataKey="sessions"
                                                    fill="#7E69AB"
                                                    name="Sessions"
                                                    radius={[4, 4, 0, 0]}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="recruitment" className="space-y-6">
                    <div ref={el => chartsRef.current[3] = el}>
                        <Card className="border border-muted shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div>
                                    <CardTitle>Job Post to Hire Conversion</CardTitle>
                                    <CardDescription>Track your recruitment funnel efficiency</CardDescription>
                                </div>
                                <Button variant="outline" size="sm">
                                    <DownloadCloud className="h-4 w-4 mr-2" /> Export
                                </Button>
                            </CardHeader>
                            <CardContent className="h-[390px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={monthlyData}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.gridColor} />
                                        <XAxis
                                            dataKey="name"
                                            stroke={chartConfig.textColor}
                                            tick={{ fill: chartConfig.textColor }}
                                        />
                                        <YAxis
                                            yAxisId="left"
                                            stroke={chartConfig.textColor}
                                            tick={{ fill: chartConfig.textColor }}
                                        />
                                        <YAxis
                                            yAxisId="right"
                                            orientation="right"
                                            stroke={chartConfig.textColor}
                                            tick={{ fill: chartConfig.textColor }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: chartConfig.tooltipBackground,
                                                border: chartConfig.tooltipBorder,
                                                color: chartConfig.tooltipColor,
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                            }}
                                        />
                                        <Legend />
                                        <Line
                                            yAxisId="left"
                                            type="monotone"
                                            dataKey="jobPosts"
                                            name="Job Posts"
                                            stroke="#7E69AB"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            activeDot={{ r: 8, stroke: '#7E69AB', strokeWidth: 2, fill: 'white' }}
                                        />
                                        <Line
                                            yAxisId="left"
                                            type="monotone"
                                            dataKey="applications"
                                            name="Applications"
                                            stroke="#9b87f5"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            activeDot={{ r: 8, stroke: '#9b87f5', strokeWidth: 2, fill: 'white' }}
                                        />
                                        <Line
                                            yAxisId="right"
                                            type="monotone"
                                            dataKey="hires"
                                            name="Hires"
                                            stroke="#FFDEE2"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            activeDot={{ r: 8, stroke: '#FFDEE2', strokeWidth: 2, fill: 'white' }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="engagement">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <Skeleton className="h-12 w-12 rounded-full" />
                            </div>
                            <h3 className="text-lg font-medium">Engagement metrics coming soon</h3>
                            <p className="text-muted-foreground">This feature is under development.</p>
                        </div>
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
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AnalyticsPage;
