import { useState, useEffect } from "react"
import { toast } from "sonner"
import { format } from "date-fns"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    AlertCircle,
    CalendarIcon,
    Filter,
    RefreshCw,
    Search,
    X,
    Info,
    Users,
    Briefcase,
    AlertTriangle,
    CheckCircle2,
    Clock,
    ClipboardCheck,
    Ban,
    ArrowUpDown,
    Copy,
    FileText,
    User,
    MessageSquare,
    ExternalLink,
    Mail, Layers, Flag, Activity, CheckCircle, CheckSquare, Edit2, MoreHorizontal, Edit, UserPlus, Trash2
} from 'lucide-react'
import { cn } from "@/lib/utils"
import {
    useGetReports,
    useFilterReports,
    useGetReportById,
    useUpdateReportStatus
} from "@/hooks/useReports"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";

const ReportsPage = () => {

    // Filter states
    const [status, setStatus] = useState("all")
    const [reason, setReason] = useState("all")
    const [jobId, setJobId] = useState("")
    const [fromDate, setFromDate] = useState(undefined)
    const [toDate, setToDate] = useState(undefined)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [activeTab, setActiveTab] = useState("all")
    const [sortField, setSortField] = useState("createdAt")
    const [sortOrder, setSortOrder] = useState("desc")

    // Report details dialog
    const [selectedReportId, setSelectedReportId] = useState(null)
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

    // Status update dialog
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
    const [newStatus, setNewStatus] = useState("")
    const [reportToUpdate, setReportToUpdate] = useState(null)
    const [statusNote, setStatusNote] = useState("")

    // Build filter params
    const filterParams = {
        ...(status !== "all" && { status }),
        ...(reason !== "all" && { reason }),
        ...(jobId && { jobId }),
        ...(fromDate && { fromDate: format(fromDate, "yyyy-MM-dd") }),
        ...(toDate && { toDate: format(toDate, "yyyy-MM-dd") }),
        page,
        limit,
        sort: sortField,
        order: sortOrder
    }

    // Determine if filters are active
    const hasActiveFilters = status !== "all" || reason !== "all" || jobId !== "" || fromDate !== undefined || toDate !== undefined

    // Fetch reports based on filter state
    const {
        data: filteredReportsData,
        isLoading: isLoadingFiltered,
        refetch: refetchFiltered
    } = useFilterReports(hasActiveFilters ? filterParams : null)

    // Fetch all reports if no filters are active
    const {
        data: allReportsData,
        isLoading: isLoadingAll,
        refetch: refetchAll
    } = useGetReports(!hasActiveFilters ? { page, limit, sort: sortField, order: sortOrder } : null)

    // Get report by ID for details view
    const {
        data: reportDetails,
        isLoading: isLoadingDetails,
        refetch: refetchDetails
    } = useGetReportById(selectedReportId)

    // Update report status mutation
    const {
        mutate: updateStatus,
        isPending: isUpdatingStatus
    } = useUpdateReportStatus({
        onSuccess: () => {
            toast.success("Report status updated successfully", {
                style: { background: "#10b981", color: "white" }
            })
            setIsStatusDialogOpen(false)
            setStatusNote("")
            refetchFiltered()
            refetchAll()
            if (selectedReportId) {
                refetchDetails()
            }
        },
        onError: (error) => {
            toast.error(`${error?.response?.data?.message}`, {
                style: { background: "#ef4444", color: "white" }
            })
        }
    })

    // Determine which data to use
    const isLoading = hasActiveFilters ? isLoadingFiltered : isLoadingAll
    const reportsData = hasActiveFilters ? filteredReportsData : allReportsData

    // Extract reports and pagination info
    const reports = reportsData?.reports || []
    const totalReports = reportsData?.totalReports || 0
    const totalPages = Math.ceil(totalReports / limit)

    // Update active tab when status filter changes
    useEffect(() => {
        if (status !== "all") {
            setActiveTab(status)
        }
    }, [status])

    // Update status filter when active tab changes
    useEffect(() => {
        if (activeTab !== "all") {
            setStatus(activeTab)
        } else {
            setStatus("all")
        }
    }, [activeTab])

    // Get reports stats
    const pendingCount = reports.filter(r => r.status === "pending").length
    const reviewedCount = reports.filter(r => r.status === "reviewed").length
    const resolvedCount = reports.filter(r => r.status === "resolved").length

    // Handle opening report details
    const handleViewReportDetails = (reportId) => {
        setSelectedReportId(reportId)
        setIsDetailsDialogOpen(true)
    }

    // Handle opening status update dialog
    const handleOpenStatusUpdate = (reportId, currentStatus) => {
        setReportToUpdate(reportId)
        setNewStatus(currentStatus)
        setIsStatusDialogOpen(true)
    }

    // Handle status update submission
    const handleUpdateStatus = () => {
        if (reportToUpdate && newStatus) {
            updateStatus({
                id: reportToUpdate,
                status: newStatus,
                notes: statusNote || undefined
            })
        }
    }

    // Handle clearing all filters
    const handleClearFilters = () => {
        setStatus("all")
        setReason("all")
        setJobId("")
        setFromDate(undefined)
        setToDate(undefined)
        setActiveTab("all")
        setPage(1)
    }

    // Handle sorting
    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortOrder("desc")
        }
    }

    // Get status badge style
    const getStatusBadgeStyle = (status) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-500"
            case "reviewed":
                return "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-500"
            case "resolved":
                return "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-500"
            default:
                return "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
        }
    }

    // Get status icon
    const getStatusIcon = (status) => {
        switch (status) {
            case "pending":
                return <Clock className="h-4 w-4" />
            case "reviewed":
                return <ClipboardCheck className="h-4 w-4" />
            case "resolved":
                return <CheckCircle2 className="h-4 w-4" />
            default:
                return <Info className="h-4 w-4" />
        }
    }

    // Get reason badge style
    const getReasonBadgeStyle = (reason) => {
        switch (reason) {
            case "spam":
                return "bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-500"
            case "inappropriate":
                return "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-500"
            case "scam":
                return "bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-500"
            case "duplicate":
                return "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-500"
            case "other":
                return "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
            default:
                return "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
        }
    }

    // Get reason icon
    const getReasonIcon = (reason) => {
        switch (reason) {
            case "spam":
                return <Ban className="h-4 w-4" />
            case "inappropriate":
                return <AlertTriangle className="h-4 w-4" />
            case "scam":
                return <AlertCircle className="h-4 w-4" />
            case "duplicate":
                return <Copy className="h-4 w-4" />
            case "other":
                return <Info className="h-4 w-4" />
            default:
                return <Info className="h-4 w-4" />
        }
    }

    // Format date for display
    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), "MMM dd, yyyy • HH:mm")
        } catch (error) {
            return "Invalid date"
        }
    }

    // Get initials for avatar
    const getInitials = (name) => {
        if (!name || name === "Anonymous") return "??"
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .substring(0, 2)
            .toUpperCase()
    }

    // Get avatar color based on string
    const getAvatarColorClass = (str) => {
        const colorClasses = [
            "bg-blue-500", "bg-green-500", "bg-purple-500",
            "bg-pink-500", "bg-indigo-500", "bg-cyan-500",
            "bg-amber-500", "bg-emerald-500", "bg-rose-500"
        ]

        if (!str) return colorClasses[0]

        const hash = str.split('').reduce((acc, char) => {
            return acc + char.charCodeAt(0)
        }, 0)

        return colorClasses[hash % colorClasses.length]
    }

    // Get reported item type icon
    const getReportedItemIcon = (report) => {
        if (report.jobId) return <Briefcase className="h-4 w-4 text-blue-500" />
        if (report.userId) return <User className="h-4 w-4 text-purple-500" />
        return <FileText className="h-4 w-4 text-gray-500" />
    }

    // Get reported item name
    const getReportedItemName = (report) => {
        if (report.jobId) {
            return report.jobTitle ?
                `Job: ${report.jobTitle}` :
                `Job: ${report.jobId.substring(0, 8)}...`
        }
        if (report.userId) {
            return report.userName ?
                `User: ${report.userName}` :
                `User: ${report.userId.substring(0, 8)}...`
        }
        return "Unknown item"
    }

    return (
        <div className="space-y-6">
            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/10 border border-yellow-200 dark:border-yellow-900/30 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center text-yellow-800 dark:text-yellow-500">
                            <Clock className="h-5 w-5 mr-2" />
                            Pending Reports
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-yellow-800 dark:text-yellow-500">
                            {isLoading ? (
                                <Skeleton className="h-9 w-12" />
                            ) : (
                                pendingCount
                            )}
                        </div>
                        <p className="text-sm text-yellow-700/70 dark:text-yellow-500/70 mt-1">
                            Awaiting review
                        </p>
                    </CardContent>
                    <CardFooter className="pt-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-yellow-800 dark:text-yellow-500 hover:text-yellow-900 hover:bg-yellow-200/50 dark:hover:bg-yellow-900/30"
                            onClick={() => setActiveTab("pending")}
                        >
                            View all pending
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 border border-blue-200 dark:border-blue-900/30 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center text-blue-800 dark:text-blue-500">
                            <ClipboardCheck className="h-5 w-5 mr-2" />
                            Reviewed Reports
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-800 dark:text-blue-500">
                            {isLoading ? (
                                <Skeleton className="h-9 w-12" />
                            ) : (
                                reviewedCount
                            )}
                        </div>
                        <p className="text-sm text-blue-700/70 dark:text-blue-500/70 mt-1">
                            In progress
                        </p>
                    </CardContent>
                    <CardFooter className="pt-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-800 dark:text-blue-500 hover:text-blue-900 hover:bg-blue-200/50 dark:hover:bg-blue-900/30"
                            onClick={() => setActiveTab("reviewed")}
                        >
                            View all reviewed
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 border border-green-200 dark:border-green-900/30 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center text-green-800 dark:text-green-500">
                            <CheckCircle2 className="h-5 w-5 mr-2" />
                            Resolved Reports
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-800 dark:text-green-500">
                            {isLoading ? (
                                <Skeleton className="h-9 w-12" />
                            ) : (
                                resolvedCount
                            )}
                        </div>
                        <p className="text-sm text-green-700/70 dark:text-green-500/70 mt-1">
                            Successfully handled
                        </p>
                    </CardContent>
                    <CardFooter className="pt-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-800 dark:text-green-500 hover:text-green-900 hover:bg-green-200/50 dark:hover:bg-green-900/30"
                            onClick={() => setActiveTab("resolved")}
                        >
                            View all resolved
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            <Card className="border border-border shadow-lg overflow-visible">
                <CardHeader className="pb-4 bg-gradient-to-r from-background to-muted/30">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                Reports Management
                            </CardTitle>
                            <CardDescription className="mt-1 text-muted-foreground">
                                View, filter, and manage content reports
                            </CardDescription>
                        </div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            refetchAll()
                                            refetchFiltered()
                                            toast.info("Refreshing reports data...", {autoClose: 1500})
                                        }}
                                        className="gap-1 transition-all duration-200 hover:shadow-md"
                                    >
                                        <RefreshCw className="h-4 w-4" />
                                        Refresh
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Fetch latest report data</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </CardHeader>

                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <div className="px-6">
                        <TabsList className="bg-muted/80 grid grid-cols-4 md:w-auto">
                            <TabsTrigger value="all" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">All Reports</TabsTrigger>
                            <TabsTrigger value="pending" className="data-[state=active]:bg-yellow-50 data-[state=active]:text-yellow-800 dark:data-[state=active]:bg-yellow-900/20 dark:data-[state=active]:text-yellow-500">
                                <Clock className="h-4 w-4 mr-1" />
                                Pending
                            </TabsTrigger>
                            <TabsTrigger value="reviewed" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-800 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-500">
                                <ClipboardCheck className="h-4 w-4 mr-1" />
                                Reviewed
                            </TabsTrigger>
                            <TabsTrigger value="resolved" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-800 dark:data-[state=active]:bg-green-900/20 dark:data-[state=active]:text-green-500">
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Resolved
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <CardContent className="space-y-6 p-6">
                        {/* Filters */}
                        <Card className="bg-muted/40 shadow-inner border border-border transition-all duration-300 hover:border-border/80">
                            <CardContent className="p-4">
                                <div className="flex flex-col space-y-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Filter className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium text-sm">Filter Reports</span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Select value={reason} onValueChange={setReason}>
                                                <SelectTrigger className="w-full bg-background border-border transition-all duration-200">
                                                    <SelectValue placeholder="Filter by reason" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-background border-border">
                                                    <SelectItem value="all">All Reasons</SelectItem>
                                                    <SelectItem value="spam" className="flex items-center gap-2">
                                                        <Ban className="h-4 w-4 text-orange-500" />
                                                        <span>Spam</span>
                                                    </SelectItem>
                                                    <SelectItem value="inappropriate" className="flex items-center gap-2">
                                                        <AlertTriangle className="h-4 w-4 text-red-500" />
                                                        <span>Inappropriate</span>
                                                    </SelectItem>
                                                    <SelectItem value="scam" className="flex items-center gap-2">
                                                        <AlertCircle className="h-4 w-4 text-purple-500" />
                                                        <span>Scam</span>
                                                    </SelectItem>
                                                    <SelectItem value="duplicate" className="flex items-center gap-2">
                                                        <Copy className="h-4 w-4 text-blue-500" />
                                                        <span>Duplicate</span>
                                                    </SelectItem>
                                                    <SelectItem value="other" className="flex items-center gap-2">
                                                        <Info className="h-4 w-4 text-gray-500" />
                                                        <span>Other</span>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="relative">
                                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search by Job ID"
                                                className="pl-9 bg-background border-border"
                                                value={jobId}
                                                onChange={(e) => setJobId(e.target.value)}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "justify-start text-left font-normal",
                                                            !fromDate && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {fromDate ? format(fromDate, "MMM dd") : "From"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={fromDate}
                                                        onSelect={setFromDate}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>

                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "justify-start text-left font-normal",
                                                            !toDate && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {toDate ? format(toDate, "MMM dd") : "To"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={toDate}
                                                        onSelect={setToDate}
                                                        initialFocus
                                                        disabled={(date) =>
                                                            fromDate ? date < fromDate : false
                                                        }
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>

                                    {/* Active filters display */}
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-wrap gap-2">
                                            {hasActiveFilters ? (
                                                <>
                                                    {status !== "all" && (
                                                        <Badge variant="outline" className="flex items-center gap-1 px-2 py-1 bg-background">
                                                            Status: {status}
                                                            <button
                                                                onClick={() => setStatus("all")}
                                                                className="ml-1 rounded-full hover:bg-muted-foreground/20 p-1"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </Badge>
                                                    )}

                                                    {reason !== "all" && (
                                                        <Badge variant="outline" className="flex items-center gap-1 px-2 py-1 bg-background">
                                                            Reason: {reason}
                                                            <button
                                                                onClick={() => setReason("all")}
                                                                className="ml-1 rounded-full hover:bg-muted-foreground/20 p-1"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </Badge>
                                                    )}

                                                    {jobId && (
                                                        <Badge variant="outline" className="flex items-center gap-1 px-2 py-1 bg-background">
                                                            Job ID: {jobId}
                                                            <button
                                                                onClick={() => setJobId("")}
                                                                className="ml-1 rounded-full hover:bg-muted-foreground/20 p-1"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </Badge>
                                                    )}

                                                    {fromDate && (
                                                        <Badge variant="outline" className="flex items-center gap-1 px-2 py-1 bg-background">
                                                            From: {format(fromDate, "MMM dd, yyyy")}
                                                            <button
                                                                onClick={() => setFromDate(undefined)}
                                                                className="ml-1 rounded-full hover:bg-muted-foreground/20 p-1"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </Badge>
                                                    )}

                                                    {toDate && (
                                                        <Badge variant="outline" className="flex items-center gap-1 px-2 py-1 bg-background">
                                                            To: {format(toDate, "MMM dd, yyyy")}
                                                            <button
                                                                onClick={() => setToDate(undefined)}
                                                                className="ml-1 rounded-full hover:bg-muted-foreground/20 p-1"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </Badge>
                                                    )}
                                                </>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">
                                                    No filters applied
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {hasActiveFilters && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={handleClearFilters}
                                                    className="text-xs h-8"
                                                >
                                                    <X className="mr-1 h-4 w-4" />
                                                    Clear All
                                                </Button>
                                            )}

                                            <span className="text-xs text-muted-foreground">
                                                Showing {reports.length} of {totalReports} reports
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Reports Table */}
                        <Card className="border border-border rounded-lg overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/70 hover:bg-muted">
                                            <TableHead>
                                                <button
                                                    className="flex items-center font-medium text-muted-foreground hover:text-foreground"
                                                    onClick={() => handleSort("reporterId")}
                                                >
                                                    Reporter
                                                    <ArrowUpDown className="ml-1 h-3 w-3" />
                                                </button>
                                            </TableHead>

                                            <TableHead>
                                                <button
                                                    className="flex items-center font-medium text-muted-foreground hover:text-foreground"
                                                    onClick={() => handleSort("reporterId")}
                                                >
                                                    Reporter E-mail
                                                    <ArrowUpDown className="ml-1 h-3 w-3" />
                                                </button>
                                            </TableHead>
                                            <TableHead>
                                                <span className="flex items-center font-medium text-muted-foreground">
                                                    Reported Item
                                                </span>
                                            </TableHead>
                                            <TableHead>
                                                <button
                                                    className="flex items-center font-medium text-muted-foreground hover:text-foreground"
                                                    onClick={() => handleSort("reason")}
                                                >
                                                    Reason
                                                    <ArrowUpDown className="ml-1 h-3 w-3" />
                                                </button>
                                            </TableHead>
                                            <TableHead>
                                                <button
                                                    className="flex items-center font-medium text-muted-foreground hover:text-foreground"
                                                    onClick={() => handleSort("status")}
                                                >
                                                    Status
                                                    <ArrowUpDown className="ml-1 h-3 w-3" />
                                                </button>
                                            </TableHead>
                                            <TableHead>
                                                <button
                                                    className="flex items-center font-medium text-muted-foreground hover:text-foreground"
                                                    onClick={() => handleSort("createdAt")}
                                                >
                                                    Date
                                                    <ArrowUpDown className="ml-1 h-3 w-3" />
                                                </button>
                                            </TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isLoading ? (
                                            // Loading skeletons
                                            Array(5)
                                                .fill(0)
                                                .map((_, index) => (
                                                    <TableRow key={`skeleton-${index}`}>
                                                        <TableCell>
                                                            <Skeleton className="h-5 w-16 animate-pulse" />
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <Skeleton className="h-8 w-8 rounded-full animate-pulse" />
                                                                <Skeleton className="h-5 w-24 animate-pulse" />
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Skeleton className="h-5 w-40 animate-pulse" />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Skeleton className="h-6 w-24 rounded-full animate-pulse" />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Skeleton className="h-6 w-20 rounded-full animate-pulse" />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Skeleton className="h-5 w-32 animate-pulse" />
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Skeleton className="h-9 w-20 rounded animate-pulse ml-auto" />
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                        ) : reports.length > 0 ? (
                                            reports.map((report) => (
                                                <TableRow key={report._id} className="hover:bg-muted/50">

                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className={`h-8 w-8 ${getAvatarColorClass(report.name || report)}`}>
                                                                <AvatarFallback>
                                                                    {getInitials(report.name || report)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <span className="font-medium">
                                                                {report.name || report || "Anonymous"}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Mail className="h-4 w-4 rounded-full " />
                                                            <span>{report.email}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            {getReportedItemIcon(report)}
                                                            <span>{getReportedItemName(report)}</span>
                                                        </div>
                                                    </TableCell>

                                                    <TableCell>
                                                        <Badge className={getReasonBadgeStyle(report.reason)}>
                                                            <span className="flex items-center gap-1">
                                                                {getReasonIcon(report.reason)}
                                                                {report.reason}
                                                            </span>
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            className={`${getStatusBadgeStyle(report.status)} cursor-pointer`}
                                                            onClick={() => handleOpenStatusUpdate(report._id, report.status)}
                                                        >
                                                            <span className="flex items-center gap-1">
                                                                {getStatusIcon(report.status)}
                                                                {report.status}
                                                            </span>
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger className="text-sm text-muted-foreground">
                                                                    {formatDate(report.createdAt)}
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    {/*<p>Reported on {format(new Date(report.createdAt), "MMMM d, yyyy 'at' h:mm a")}</p>*/}
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleViewReportDetails(report._id)}
                                                            className="hover:bg-muted transition-colors"
                                                        >
                                                            View Details
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7} className="h-24 text-center">
                                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                        <AlertCircle className="h-8 w-8 mb-2" />
                                                        <h3 className="font-medium">No reports found</h3>
                                                        <p className="text-sm">
                                                            {hasActiveFilters
                                                                ? "Try adjusting your filters or search criteria"
                                                                : "There are no reports in the system yet"}
                                                        </p>
                                                        {hasActiveFilters && (
                                                            <Button variant="link" onClick={handleClearFilters} className="mt-2">
                                                                Clear all filters
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>

                        {/* Pagination */}
                        {!isLoading && reports.length > 0 && totalPages > 1 && (
                            <Pagination className="mx-auto">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => setPage(page > 1 ? page - 1 : 1)}
                                            className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                                        />
                                    </PaginationItem>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter((pageNum) => {
                                            // Show first page, last page, current page, and pages around current page
                                            return pageNum === 1 || pageNum === totalPages || (pageNum >= page - 1 && pageNum <= page + 1)
                                        })
                                        .map((pageNum, i, array) => {
                                            // Add ellipsis where needed
                                            if (i > 0 && array[i - 1] !== pageNum - 1) {
                                                return (
                                                    <PaginationItem key={`ellipsis-${pageNum}`}>
                                                        <PaginationEllipsis />
                                                    </PaginationItem>
                                                )
                                            }

                                            return (
                                                <PaginationItem key={pageNum}>
                                                    <PaginationLink isActive={page === pageNum} onClick={() => setPage(pageNum)}>
                                                        {pageNum}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            )
                                        })}

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
                                            className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        )}
                    </CardContent>
                </Tabs>
            </Card>

            {/* Report Details Dialog */}
            {/* Report Details Dialog with Improved UX */}
            {/* Report Details Dialog with Improved UX */}
            <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
                <DialogContent className="w-auto max-w-[95vw] md:max-w-[85vw] lg:max-w-[80vw] xl:max-w-[75vw]
                            h-auto max-h-[95vh] overflow-hidden flex flex-col">
                    {isLoadingDetails ? (
                        <div className="space-y-4 py-4">
                            <Skeleton className="h-8 w-3/4" />
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-6 w-24 rounded-full" />
                                <Skeleton className="h-4 w-48" />
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-24 w-full rounded-lg" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-24 w-full rounded-lg" />
                                </div>
                            </div>
                            <Skeleton className="h-32 w-full mt-4 rounded-lg" />
                        </div>
                    ) : reportDetails ? (
                        <>
                            <div className="flex items-start justify-between">
                                <DialogHeader className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Badge className={getReasonBadgeStyle(reportDetails.reason)} size="lg">
                                            {getReasonIcon(reportDetails.reason)}
                                            {reportDetails.reason}
                                        </Badge>
                                        <DialogTitle className="text-xl font-bold">Report Details</DialogTitle>
                                    </div>
                                    <DialogDescription className="flex items-center gap-1 mt-0.5">
                          <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            {reportDetails._id}
                          </span>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-5 w-5">
                                                    <Copy className="h-3 w-3" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Copy ID</TooltipContent>
                                        </Tooltip>
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="flex items-center gap-2">
                                    <Badge className={getStatusBadgeStyle(reportDetails.status)} size="lg">
                                        {getStatusIcon(reportDetails.status)}
                                        <span className="capitalize">{reportDetails.status}</span>
                                    </Badge>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleOpenStatusUpdate(reportDetails._id, reportDetails.status)}
                                    >
                                        <RefreshCw className="h-3.5 w-3.5 mr-1" /> Update
                                    </Button>
                                </div>
                            </div>

                            <Tabs defaultValue="details" className="mt-3 flex-1 flex flex-col">
                                <div className="flex justify-between items-center border-b pb-0.5">
                                    <TabsList className="bg-transparent p-0 h-auto">
                                        <TabsTrigger
                                            value="details"
                                            className="data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-3 py-1.5"
                                        >
                                            <Layers className="h-3.5 w-3.5 mr-1.5" />
                                            Details
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="description"
                                            className="data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-3 py-1.5"
                                        >
                                            <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                                            Description
                                        </TabsTrigger>
                                        {reportDetails.notes && (
                                            <TabsTrigger
                                                value="notes"
                                                className="data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-3 py-1.5"
                                            >
                                                <FileText className="h-3.5 w-3.5 mr-1.5" />
                                                Admin Notes
                                            </TabsTrigger>
                                        )}
                                    </TabsList>

                                    <div className="text-xs text-muted-foreground flex items-center">
                                        <Clock className="h-3 w-3 mr-1" />
                                        Last updated: {formatDate(reportDetails.updatedAt)}
                                    </div>
                                </div>

                                <div className="pt-3 pr-0.5 overflow-y-auto">
                                    <TabsContent value="details" className="space-y-4 mt-0 h-full">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Card className="overflow-hidden border-l-4 border-l-blue-500 shadow-sm hover:shadow transition-shadow">
                                                <CardHeader className="bg-slate-50 dark:bg-slate-900 py-2 px-4">
                                                    <CardTitle className="text-sm flex items-center gap-2">
                                                        <User className="h-3.5 w-3.5" />
                                                        Reporter Information
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="py-3 px-4">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <Avatar className={`h-10 w-10 ring-2 ring-offset-1 ${getAvatarColorClass(reportDetails?.name || reportDetails)}`}>
                                                            <AvatarFallback>
                                                                {getInitials(reportDetails.name || reportDetails)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-medium">
                                                                {reportDetails.name || reportDetails || "Anonymous"}
                                                            </p>
                                                            {reportDetails.email && (
                                                                <div className="flex items-center text-sm text-muted-foreground">
                                                                    <Mail className="h-3 w-3 mr-1" />
                                                                    {reportDetails.email}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {reportDetails.role && (
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <Badge variant="outline" className="pl-1.5">
                                                                <Shield className="h-3 w-3 mr-1.5" />
                                                                {reportDetails.role}
                                                            </Badge>
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>

                                            <Card className="overflow-hidden border-l-4 border-l-purple-500 shadow-sm hover:shadow transition-shadow">
                                                <CardHeader className="bg-slate-50 dark:bg-slate-900 py-2 px-4">
                                                    <CardTitle className="text-sm flex items-center gap-2">
                                                        <Flag className="h-3.5 w-3.5" />
                                                        Reported Item
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="py-3 px-4">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className={`p-2 rounded-full ${
                                                            reportDetails.jobId ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                                                                reportDetails.userId ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" :
                                                                    "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                                                        }`}>
                                                            {getReportedItemIcon(reportDetails)}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">
                                                               Job Name
                                                            </p>
                                                            <div className="flex items-center">
                                                                <p className="text-xs font-mono text-muted-foreground">
                                                                    {reportDetails.jobId || reportDetails.userId || "Unknown ID"}
                                                                </p>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button variant="ghost" size="icon" className="h-4 w-4 ml-1">
                                                                            <Copy className="h-2.5 w-2.5" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>Copy ID</TooltipContent>
                                                                </Tooltip>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {reportDetails.jobId && (
                                                        <Button variant="secondary" size="sm" className="w-full mt-2 py-1 h-8">
                                                            <ExternalLink className="h-3 w-3 mr-1.5" />
                                                            View Job Details
                                                        </Button>
                                                    )}

                                                    {reportDetails.userId && (
                                                        <Button variant="secondary" size="sm" className="w-full mt-2 py-1 h-8">
                                                            <ExternalLink className="h-3 w-3 mr-1.5" />
                                                            View User Profile
                                                        </Button>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </div>

                                        <Card className="shadow-sm hover:shadow transition-shadow">
                                            <CardHeader className="py-2 px-4 bg-slate-50 dark:bg-slate-900">
                                                <CardTitle className="text-sm flex items-center gap-2">
                                                    <Activity className="h-3.5 w-3.5" />
                                                    Status & Assignment
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="py-3 px-4">
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    <div>
                                                        <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center">
                                                            <CheckCircle className="h-3 w-3 mr-1" />
                                                            Current Status
                                                        </p>
                                                        <div className="flex items-center gap-2">
                                                            <Badge className={`${getStatusBadgeStyle(reportDetails.status)} text-xs px-2 py-0.5`}>
                                                                {getStatusIcon(reportDetails.status)}
                                                                <span className="ml-1 capitalize">{reportDetails.status}</span>
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    {reportDetails.reviewedBy && (
                                                        <div>
                                                            <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center">
                                                                <Eye className="h-3 w-3 mr-1" />
                                                                Reviewed By
                                                            </p>
                                                            <div className="flex items-center">
                                                                <Avatar className="h-4 w-4 mr-1">
                                                                    <AvatarFallback className="text-xs">
                                                                        {getInitials(reportDetails.reviewedBy)}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <p className="text-xs">{reportDetails.reviewedBy}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {reportDetails.resolvedBy && (
                                                        <div>
                                                            <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center">
                                                                <CheckSquare className="h-3 w-3 mr-1" />
                                                                Resolved By
                                                            </p>
                                                            <div className="flex items-center">
                                                                <Avatar className="h-4 w-4 mr-1">
                                                                    <AvatarFallback className="text-xs">
                                                                        {getInitials(reportDetails.resolvedBy)}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <p className="text-xs">{reportDetails.resolvedBy}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div>
                                                        <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center">
                                                            <Clock className="h-3 w-3 mr-1" />
                                                            Created
                                                        </p>
                                                        <p className="text-xs">{formatDate(reportDetails.createdAt)}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="description" className="mt-0 h-full">
                                        <Card className="shadow-sm hover:shadow transition-shadow h-full">
                                            <CardHeader className="py-2 px-4 bg-slate-50 dark:bg-slate-900">
                                                <CardTitle className="text-sm flex items-center gap-2">
                                                    <MessageSquare className="h-3.5 w-3.5" />
                                                    Report Description
                                                </CardTitle>
                                                {reportDetails.createdAt && (
                                                    <CardDescription className="flex items-center text-xs">
                                                        <Calendar className="h-3 w-3 mr-1" />
                                                        Submitted: {formatDate(reportDetails.createdAt)}
                                                    </CardDescription>
                                                )}
                                            </CardHeader>
                                            <CardContent className="py-3 px-4">
                                                <div className="rounded-md border bg-slate-50/50 dark:bg-slate-900/50 p-4 h-48 overflow-y-auto">
                                                    {reportDetails.description ? (
                                                        <p className="whitespace-pre-wrap text-sm">{reportDetails.description}</p>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center h-full text-center p-4">
                                                            <AlertCircle className="h-8 w-8 text-muted-foreground mb-2 opacity-50" />
                                                            <p className="text-muted-foreground italic text-sm">No description was provided with this report</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    {reportDetails.notes && (
                                        <TabsContent value="notes" className="mt-0 h-full">
                                            <Card className="shadow-sm hover:shadow transition-shadow h-full">
                                                <CardHeader className="flex flex-row items-center justify-between py-2 px-4 bg-slate-50 dark:bg-slate-900">
                                                    <div>
                                                        <CardTitle className="text-sm flex items-center gap-2">
                                                            <FileText className="h-3.5 w-3.5" />
                                                            Admin Notes
                                                        </CardTitle>
                                                        {reportDetails.updatedAt && (
                                                            <CardDescription className="flex items-center text-xs">
                                                                <Calendar className="h-3 w-3 mr-1" />
                                                                Updated: {formatDate(reportDetails.updatedAt)}
                                                            </CardDescription>
                                                        )}
                                                    </div>
                                                    <Button variant="outline" size="sm" className="h-7 px-2 py-0">
                                                        <Edit2 className="h-3 w-3 mr-1" />
                                                        Edit Notes
                                                    </Button>
                                                </CardHeader>
                                                <CardContent className="py-3 px-4">
                                                    <div className="rounded-md border bg-slate-50/50 dark:bg-slate-900/50 p-4 h-48 overflow-y-auto">
                                                        <p className="whitespace-pre-wrap text-sm">{reportDetails.notes}</p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </TabsContent>
                                    )}
                                </div>
                            </Tabs>

                            <DialogFooter className="border-t pt-3 mt-1">
                                <div className="flex justify-between items-center w-full gap-2">
                                    <div className="flex items-center gap-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="sm" className="h-8">
                                                    <MoreHorizontal className="h-3.5 w-3.5 mr-1.5" />
                                                    Actions
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start">
                                                <DropdownMenuItem>
                                                    <Edit className="h-3.5 w-3.5 mr-1.5" />
                                                    Add Notes
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                                                    Assign to Team Member
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600 dark:text-red-400">
                                                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                                                    Delete Report
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                        {reportDetails.jobId || reportDetails.userId ? (
                                            <Button variant="secondary" size="sm" className="h-8">
                                                <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                                                View {reportDetails.jobId ? "Job" : "User"}
                                            </Button>
                                        ) : null}
                                    </div>

                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="h-8" onClick={() => setIsDetailsDialogOpen(false)}>
                                            Close
                                        </Button>
                                        <Button size="sm" className="h-8" onClick={() => handleOpenStatusUpdate(reportDetails._id, reportDetails.status)}>
                                            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                                            Update Status
                                        </Button>
                                    </div>
                                </div>
                            </DialogFooter>
                        </>
                    ) : (
                        <div className="py-8 text-center">
                            <div className="bg-slate-100 dark:bg-slate-800 rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                                <AlertCircle className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium mb-1.5">Report not found</h3>
                            <p className="text-muted-foreground mb-4 text-sm">The requested report details could not be loaded</p>
                            <div className="flex justify-center">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsDetailsDialogOpen(false)}
                                    className="mr-2 h-8"
                                >
                                    Go Back
                                </Button>
                                <Button size="sm" onClick={() => refetchAll()} className="h-8">
                                    <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                                    Refresh Reports
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Status Update Dialog */}
            <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Update Report Status</DialogTitle>
                        <DialogDescription>Change the status of this report to track its progress.</DialogDescription>
                    </DialogHeader>

                    <div className="py-4 space-y-4">
                        <Select value={newStatus} onValueChange={setNewStatus}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select new status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending" className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-yellow-500" />
                                    <span>Pending</span>
                                </SelectItem>
                                <SelectItem value="reviewed" className="flex items-center gap-2">
                                    <ClipboardCheck className="h-4 w-4 text-blue-500" />
                                    <span>Reviewed</span>
                                </SelectItem>
                                <SelectItem value="resolved" className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    <span>Resolved</span>
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="space-y-2">
                            <label htmlFor="status-note" className="text-sm font-medium">
                                Add a note (optional)
                            </label>
                            <textarea
                                id="status-note"
                                className="w-full min-h-[100px] p-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                placeholder="Add details about this status change..."
                                value={statusNote}
                                onChange={(e) => setStatusNote(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateStatus} disabled={isUpdatingStatus}>
                            {isUpdatingStatus ? "Updating..." : "Update Status"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ReportsPage
