"use client"

import {useState} from "react"
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from "@/components/ui/card"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {
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
import {Building2, CheckCircle, Clock, XCircle, RefreshCw, ArrowUpRight, ArrowDownRight, Loader2} from "lucide-react"

// Import our custom hooks
import {
    useApplicationsByStage,
    useInterviewsByState,
    useConversionFunnel,
    useTopAppliedJobs,
} from "@/hooks/useAdminStatistics"

const COLORS = ["#9b87f5", "#7E69AB", "#FFDEE2", "#D3E4FD"]

// StatCard component
const StatCard = ({title, value, description, Icon, trend = 0, color, bgColor}) => {
    const isPositive = trend >= 0

    return (
        <Card className="overflow-hidden border-border/40">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className={`p-2 rounded-md ${bgColor}`}>
                    <Icon className={`h-5 w-5 ${color}`}/>
                </div>
                <div className="flex items-center">
                    {isPositive ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500 mr-1"/>
                    ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500 mr-1"/>
                    )}
                    <span className={isPositive ? "text-green-500" : "text-red-500"}>{Math.abs(trend)}%</span>
                </div>
            </CardHeader>
            <CardContent className="pb-2">
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{title}</p>
            </CardContent>
            <CardContent className="pt-1 text-xs text-muted-foreground">{description}</CardContent>
        </Card>
    )
}

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("overview")
    const getDateRange = () => {
        const today = new Date();
        const fromDate = new Date();
        const [timePeriod, setTimePeriod] = useState("lastWeek");

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
        data: applicationsByStageResponse,
        isLoading: applicationsByStageLoading,
        refetch: refetchApplicationsByStage,
    } = useApplicationsByStage(
         dateRangeValues.from,  dateRangeValues.to
    )

    const {
        data: interviewsByStateResponse,
        isLoading: interviewsByStateLoading,
        refetch: refetchInterviewsByState,
    } = useInterviewsByState(
        dateRangeValues.from,
       dateRangeValues.to,
    )

    const {
        data: conversionFunnelResponse,
        isLoading: conversionFunnelLoading,
        refetch: refetchConversionFunnel,
    } = useConversionFunnel(
    dateRangeValues.from,
         dateRangeValues.to,
    )

    const {
        data: topAppliedJobsResponse,
        isLoading: topAppliedJobsLoading,
        refetch: refetchTopAppliedJobs,
    } = useTopAppliedJobs(
        dateRangeValues.from,
       dateRangeValues.to,
    )

    // Extract actual data from responses
    const applicationsByStageData = applicationsByStageResponse?.data || []
    const interviewsByStateData = interviewsByStateResponse?.data || []
    const conversionFunnelData = conversionFunnelResponse?.data || []
    const topAppliedJobsData = topAppliedJobsResponse?.data || []

    // Check if any data is loading
    const isLoading =
        applicationsByStageLoading || interviewsByStateLoading || conversionFunnelLoading || topAppliedJobsLoading

    // Refetch all data
    const handleRefreshData = () => {
        refetchApplicationsByStage()
        refetchInterviewsByState()
        refetchConversionFunnel()
        refetchTopAppliedJobs()
    }

    // Format data for charts
    const formatApplicationsByStageForChart = () => {
        if (!applicationsByStageData?.length) return []
        return applicationsByStageData.map((item) => ({
            name: item.stage.charAt(0).toUpperCase() + item.stage.slice(1).replace("-", " "),
            value: item.count,
        }))
    }

    const formatInterviewsByStateForChart = () => {
        if (!interviewsByStateData?.length) return []
        return interviewsByStateData.map((item) => ({
            name: item.state.charAt(0).toUpperCase() + item.state.slice(1).replace("-", " "),
            value: item.count,
        }))
    }

    const formatConversionFunnelForChart = () => {
        if (!conversionFunnelData?.length) return []
        return conversionFunnelData.map((item) => ({
            name: item.stage.charAt(0).toUpperCase() + item.stage.slice(1).replace("-", " "),
            count: item.count,
            rate: item.rate,
        }))
    }

    const formatTopAppliedJobsForChart = () => {
        if (!topAppliedJobsData?.length) return []
        return topAppliedJobsData.slice(0, 5).map((item) => ({
            name: item.jobTitle,
            applications: item.count,
        }))
    }

    // Calculate totals for statistics
    const totalApplications = applicationsByStageData?.reduce((sum, item) => sum + item.count, 0) || 0
    const totalInterviews = interviewsByStateData?.reduce((sum, item) => sum + item.count, 0) || 0
    const pendingApplications = applicationsByStageData?.find((item) =>
        item.stage.toLowerCase() === "sending interview" ||
        item.stage.toLowerCase() === "pending" ||
        item.stage.toLowerCase() === "in-progress"
    )?.count || 0
    const rejectedApplications = applicationsByStageData?.find((item) =>
        item.stage.toLowerCase() === "rejected"
    )?.count || 0

    return (
        <div className="bg-gray-50 dark:bg-[var(--color-background)] min-h-screen p-6">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Admin Dashboard
                            <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">
                                {isLoading ? "Loading..." : "Live Data"}
                            </Badge>
                        </h1>
                        <p className="text-muted-foreground mt-1">Overview of application statistics and recruitment
                            metrics</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleRefreshData} disabled={isLoading}>
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1"/> :
                                <RefreshCw className="h-4 w-4 mr-1"/>}
                            Refresh
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto">
                <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-6">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="applications">Applications</TabsTrigger>
                        <TabsTrigger value="interviews">Interviews</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview">
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            {isLoading ? (
                                // Loading skeletons
                                Array(4)
                                    .fill(0)
                                    .map((_, i) => (
                                        <Card key={i} className="overflow-hidden border-border/40">
                                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                                <div
                                                    className="h-9 w-9 rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                                                <div
                                                    className="h-4 w-16 bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                                            </CardHeader>
                                            <CardContent className="pb-2">
                                                <div
                                                    className="h-8 w-16 mb-1 bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                                                <div
                                                    className="h-4 w-24 bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                                            </CardContent>
                                            <CardContent className="pt-1">
                                                <div
                                                    className="h-4 w-full bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                                            </CardContent>
                                        </Card>
                                    ))
                            ) : (
                                <>
                                    <StatCard
                                        title="Total Applications"
                                        value={totalApplications}
                                        description="All applications in the system"
                                        Icon={Building2}
                                        trend={10} // Mock trend data
                                        color="text-blue-500"
                                        bgColor="bg-blue-100 dark:bg-blue-900/30"
                                    />
                                    <StatCard
                                        title="Interviews"
                                        value={totalInterviews}
                                        description="Total interviews conducted"
                                        Icon={CheckCircle}
                                        trend={5} // Mock trend data
                                        color="text-green-500"
                                        bgColor="bg-green-100 dark:bg-green-900/30"
                                    />
                                    <StatCard
                                        title="Pending Applications"
                                        value={pendingApplications}
                                        description="Applications in progress"
                                        Icon={Clock}
                                        trend={-2} // Mock trend data
                                        color="text-amber-500"
                                        bgColor="bg-amber-100 dark:bg-amber-900/30"
                                    />
                                    <StatCard
                                        title="Rejected Applications"
                                        value={rejectedApplications}
                                        description="Applications rejected"
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
                            {/* Applications by Stage */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Applications by Stage</CardTitle>
                                    <CardDescription>Current application stages</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {isLoading ? (
                                        <div className="h-[300px] flex items-center justify-center">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                                        </div>
                                    ) : applicationsByStageData.length === 0 ? (
                                        <div className="h-[300px] flex items-center justify-center">
                                            <p className="text-muted-foreground">No data available</p>
                                        </div>
                                    ) : (
                                        <div className="h-[300px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={formatApplicationsByStageForChart()}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        outerRadius={100}
                                                        innerRadius={60}
                                                        fill="#8884d8"
                                                        dataKey="value"
                                                        label={({
                                                                    name,
                                                                    percent
                                                                }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                    >
                                                        {formatApplicationsByStageForChart().map((entry, index) => (
                                                            <Cell key={`cell-${index}`}
                                                                  fill={COLORS[index % COLORS.length]}/>
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

                            {/* Top Applied Jobs */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Top Applied Jobs</CardTitle>
                                    <CardDescription>Most popular job postings</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {isLoading ? (
                                        <div className="h-[300px] flex items-center justify-center">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                                        </div>
                                    ) : topAppliedJobsData.length === 0 ? (
                                        <div className="h-[300px] flex items-center justify-center">
                                            <p className="text-muted-foreground">No data available</p>
                                        </div>
                                    ) : (
                                        <div className="h-[300px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart
                                                    data={formatTopAppliedJobsForChart()}
                                                    layout="vertical"
                                                    margin={{top: 5, right: 30, left: 20, bottom: 5}}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" opacity={0.1}/>
                                                    <XAxis
                                                        type="number"
                                                        tick={{fontSize: 12}}
                                                        axisLine={{stroke: "var(--border)"}}
                                                        tickLine={false}
                                                    />
                                                    <YAxis
                                                        dataKey="name"
                                                        type="category"
                                                        tick={{fontSize: 12}}
                                                        axisLine={{stroke: "var(--border)"}}
                                                        tickLine={false}
                                                        width={120}
                                                    />
                                                    <Tooltip
                                                        contentStyle={{
                                                            backgroundColor: "var(--card)",
                                                            borderColor: "var(--border)",
                                                            borderRadius: "8px",
                                                        }}
                                                    />
                                                    <Bar dataKey="applications" fill="var(--color-primary)"
                                                         radius={[0, 4, 4, 0]}/>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Conversion Funnel */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Conversion Funnel</CardTitle>
                                <CardDescription>Application stage conversion rates</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="h-[300px] flex items-center justify-center">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                                    </div>
                                ) : conversionFunnelData.length === 0 ? (
                                    <div className="h-[300px] flex items-center justify-center">
                                        <p className="text-muted-foreground">No data available</p>
                                    </div>
                                ) : (
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={formatConversionFunnelForChart()}
                                                margin={{top: 20, right: 30, left: 20, bottom: 5}}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" opacity={0.1}/>
                                                <XAxis
                                                    dataKey="name"
                                                    tick={{fontSize: 12}}
                                                    axisLine={{stroke: "var(--border)"}}
                                                    tickLine={false}
                                                />
                                                <YAxis tick={{fontSize: 12}} axisLine={{stroke: "var(--border)"}}
                                                       tickLine={false}/>
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: "var(--card)",
                                                        borderColor: "var(--border)",
                                                        borderRadius: "8px",
                                                    }}
                                                />
                                                <Legend/>
                                                <Bar dataKey="count" name="Count" fill="var(--color-primary)"
                                                     radius={[4, 4, 0, 0]}/>
                                                <Bar dataKey="rate" name="Rate (%)" fill="#7E69AB"
                                                     radius={[4, 4, 0, 0]}/>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Applications Tab */}
                    <TabsContent value="applications">
                        <Card>
                            <CardHeader>
                                <CardTitle>Application Statistics</CardTitle>
                                <CardDescription>Detailed application metrics</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="h-[200px] flex items-center justify-center">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                                    </div>
                                ) : applicationsByStageData.length === 0 ? (
                                    <div className="h-[200px] flex items-center justify-center">
                                        <p className="text-muted-foreground">No application data available</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* Application Stages */}
                                        <div>
                                            <h3 className="text-lg font-medium mb-4">Applications by Stage</h3>
                                            <div className="space-y-4">
                                                {applicationsByStageData.map((item, index) => (
                                                    <div key={index}>
                                                        <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">
                                      {item.stage.charAt(0).toUpperCase() + item.stage.slice(1).replace("-", " ")}
                                    </span>
                                                            <span className="text-sm font-medium">{item.count}</span>
                                                        </div>
                                                        <div className="w-full bg-muted rounded-full h-2.5">
                                                            <div
                                                                className="bg-primary h-2.5 rounded-full"
                                                                style={{
                                                                    width: `${(item.count / totalApplications) * 100}%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Interviews Tab */}
                    <TabsContent value="interviews">
                        <Card>
                            <CardHeader>
                                <CardTitle>Interview Statistics</CardTitle>
                                <CardDescription>Detailed interview metrics</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="h-[200px] flex items-center justify-center">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                                    </div>
                                ) : interviewsByStateData.length === 0 ? (
                                    <div className="h-[200px] flex items-center justify-center">
                                        <p className="text-muted-foreground">No interview data available</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* Interview States */}
                                        <div>
                                            <h3 className="text-lg font-medium mb-4">Interviews by State</h3>
                                            <div className="space-y-4">
                                                {interviewsByStateData.map((item, index) => (
                                                    <div key={index}>
                                                        <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">
                                      {item.state.charAt(0).toUpperCase() + item.state.slice(1).replace("-", " ")}
                                    </span>
                                                            <span className="text-sm font-medium">{item.count}</span>
                                                        </div>
                                                        <div className="w-full bg-muted rounded-full h-2.5">
                                                            <div
                                                                className="bg-primary h-2.5 rounded-full"
                                                                style={{
                                                                    width: `${(item.count / totalInterviews) * 100}%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
export default AdminDashboard;