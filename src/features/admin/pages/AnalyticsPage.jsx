import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {useTheme} from "@/layouts/theme_provider/ThemeProvider.jsx";

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

const AnalyticsPage = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const chartConfig = {
        gridColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
        textColor: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
        tooltipBackground: isDark ? '#1A1F2C' : '#fff',
        tooltipBorder: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.1)',
        tooltipColor: isDark ? '#fff' : '#000'
    };

    return (
            <div className="space-y-6 p-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
                    <p className="text-muted-foreground">
                        Track your recruitment metrics and performance.
                    </p>
                </div>

                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="bg-muted/50">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
                        <TabsTrigger value="engagement">Engagement</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Monthly Recruitment Trends</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[350px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart
                                                data={monthlyData}
                                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                            >
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
                                                        color: chartConfig.tooltipColor
                                                    }}
                                                />
                                                <Legend />
                                                <Area type="monotone" dataKey="applications" stackId="1" stroke="#9b87f5" fill="#9b87f5" />
                                                <Area type="monotone" dataKey="jobPosts" stackId="2" stroke="#7E69AB" fill="#7E69AB" />
                                                <Area type="monotone" dataKey="hires" stackId="3" stroke="#FFDEE2" fill="#FFDEE2" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Applicant Sources</CardTitle>
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
                                                            color: chartConfig.tooltipColor
                                                        }}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Weekly User Activity</CardTitle>
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
                                                            color: chartConfig.tooltipColor
                                                        }}
                                                    />
                                                    <Legend />
                                                    <Bar dataKey="users" fill="#9b87f5" name="Active Users" />
                                                    <Bar dataKey="sessions" fill="#7E69AB" name="Sessions" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="recruitment" className="space-y-6">
                        <div>
                            <Card className="h-[450px]">
                                <CardHeader>
                                    <CardTitle>Job Post to Hire Conversion</CardTitle>
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
                                                    color: chartConfig.tooltipColor
                                                }}
                                            />
                                            <Legend />
                                            <Line
                                                yAxisId="left"
                                                type="monotone"
                                                dataKey="jobPosts"
                                                name="Job Posts"
                                                stroke="#7E69AB"
                                                activeDot={{ r: 8 }}
                                            />
                                            <Line
                                                yAxisId="left"
                                                type="monotone"
                                                dataKey="applications"
                                                name="Applications"
                                                stroke="#9b87f5"
                                                activeDot={{ r: 8 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
    );
};

export default AnalyticsPage;
