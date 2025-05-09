import { useState, useEffect } from "react"
import { useCompanies, useVerifyCompany, useFilterCompanies } from "@/hooks/userQueries.js"
import { useQueryClient } from "@tanstack/react-query"
import { ErrorBanner } from "@/components/admin/ErrorBanner.jsx"
import { SuccessBanner } from "@/components/admin/SuccessBanner.jsx"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Search,
    Check,
    X,
    ExternalLink,
    ArrowUpDown,
    Trash2,
    Loader2,
    LayoutGrid,
    List,
    Filter,
    ChevronDown,
    FileText,
    User,
    Globe, AlertCircle, CheckCircle, XCircle, FileX, Eye,
} from "lucide-react"
import { format } from "date-fns"
import {Tooltip} from "@/components/ui/tooltip.jsx";
import {Alert, AlertTitle} from "@/components/ui/alert.jsx";

const StatusBadge = ({ status }) => {
    const getStatusConfig = () => {
        switch (status) {
            case "verified":
                return {
                    icon: <Check className="h-3 w-3" />,
                    variant: "success",
                }
            case "pending":
                return {
                    icon: null,
                    variant: "warning",
                }
            case "rejected":
                return {
                    icon: <X className="h-3 w-3" />,
                    variant: "destructive",
                }
            default:
                return {
                    icon: null,
                    variant: "secondary",
                }
        }
    }

    const config = getStatusConfig()
    const variantClasses = {
        success:
            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100/80 dark:hover:bg-green-900/20",
        warning:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 hover:bg-yellow-100/80 dark:hover:bg-yellow-900/20",
        destructive:
            "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-100/80 dark:hover:bg-red-900/20",
        secondary: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    }

    return (
        <Badge
            variant="outline"
            className={`flex items-center gap-1 px-2 py-1 font-medium ${variantClasses[config.variant]}`}
        >
            {config.icon}
            <span className="capitalize">{status}</span>
        </Badge>
    )
}

const MethodBadge = ({ method }) => {
    if (!method) return null

    const methodConfig = {
        admin: {
            icon: <User className="h-3 w-3 mr-1" />,
            className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        },
        domain: {
            icon: <Globe className="h-3 w-3 mr-1" />,
            className: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
        },
    }

    const config = methodConfig[method] || methodConfig.admin

    return (
        <Badge variant="outline" className={`flex items-center gap-1 px-2 py-1 font-medium ${config.className}`}>
            {config.icon}
            <span className="capitalize">{method}</span>
        </Badge>
    )
}

export default function CompaniesManagement() {
    // State for UI
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [methodFilters, setMethodFilters] = useState([])
    const [selectedCompany, setSelectedCompany] = useState(null)
    const [viewMode, setViewMode] = useState("grid") // 'grid' or 'table'
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm)
    const [rejectionReason, setRejectionReason] = useState("")
    const [showRejectionDialog, setShowRejectionDialog] = useState(false)
    const [companyToReject, setCompanyToReject] = useState(null)
    const [showSuccessAlert, setShowSuccessAlert] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")

// Add this debounce effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTerm])

// React Query hooks
    const queryClient = useQueryClient()

// Create filters object based on UI state
    const [filters, setFilters] = useState({
        name: searchTerm,
        verificationStatus: statusFilter !== "all" ? statusFilter : undefined,
        verificationMethod: methodFilters.length > 0 ? methodFilters : undefined,
    })

// Update filters when search, status filter, or method filters change
    useEffect(() => {
        // Domain has priority over admin if both are selected
        let methodFilter = methodFilters
        if (methodFilters.includes("domain") && methodFilters.includes("admin")) {
            methodFilter = ["domain"]
        }

        setFilters({
            name: debouncedSearchTerm,
            verificationStatus: statusFilter !== "all" ? statusFilter : undefined,
            verificationMethod: methodFilter.length > 0 ? methodFilter : undefined,
        })
    }, [debouncedSearchTerm, statusFilter, methodFilters])

// Use the filtered companies data
    const {
        data: filteredCompaniesData,
        isLoading: filteredCompaniesLoading,
        isError: isFilterError,
        error: filterError,
        refetch: refetchFilteredCompanies,
        isFetching: isFilterFetching,
    } = useFilterCompanies(filters, {
        enabled: true,
        keepPreviousData: true,
    })

// Get all companies (used as fallback)
    const {
        data: allCompaniesData,
        isLoading: allCompaniesLoading,
        isFetching: allCompaniesFetching
    } = useCompanies({
        enabled: !filters.name && !filters.verificationStatus && !filters.verificationMethod,
    })

// Company verification mutation
    const { mutate: verifyCompanyMutation, isPending: verificationLoading } = useVerifyCompany({
        onSuccess: (data, variables) => {
            const actionType = variables.status === "verified" ? "verified" : "rejected"
            setSuccessMessage(`Company successfully ${actionType}`)
            setShowSuccessAlert(true)
            setTimeout(() => setShowSuccessAlert(false), 3000)

            // Close modal if open
            if (selectedCompany && selectedCompany._id === variables.id) {
                setSelectedCompany(null)
            }

            // Close rejection dialog if open
            if (showRejectionDialog) {
                setShowRejectionDialog(false)
                setRejectionReason("")
                setCompanyToReject(null)
            }
        },
        onError: (error) => {
            console.error("Verification error:", error)
            setSuccessMessage(`Error: ${error.message || "Failed to process verification"}`)
            setShowSuccessAlert(true)
            setTimeout(() => setShowSuccessAlert(false), 5000)

            if (showRejectionDialog) {
                setShowRejectionDialog(false)
            }
        }
    })

// Determine which data to use
    const companiesData =
        filters.name || filters.verificationStatus || filters.verificationMethod ? filteredCompaniesData : allCompaniesData
    const isLoading = filteredCompaniesLoading || allCompaniesLoading || verificationLoading
    const isFetching = filteredCompaniesData ? isFilterFetching : allCompaniesFetching
    const isError = isFilterError

// Handle company verification
    const handleVerifyCompany = (companyId, isApproved = true) => {
        verifyCompanyMutation({
            id: companyId,
            status: isApproved ? "verified" : "rejected"
        })
    }

// Handle rejecting a company with reason
    const handleRejectCompany = (companyId, reason) => {
        verifyCompanyMutation({
            id: companyId,
            status: "rejected",
            reason
        })
    }

// Open rejection dialog
    const openRejectionDialog = (company) => {
        setCompanyToReject(company)
        setRejectionReason("")
        setShowRejectionDialog(true)
    }

// Format date helper
    const formatDate = (dateString) => {
        if (!dateString) return "-"
        try {
            return format(new Date(dateString), "MMM d, yyyy")
        } catch (error) {
            return dateString
        }
    }

// Toggle method filter
    const toggleMethodFilter = (method) => {
        setMethodFilters((current) => {
            if (current.includes(method)) {
                return current.filter((m) => m !== method)
            } else {
                return [...current, method]
            }
        })
    }

// Clear all filters
    const clearAllFilters = () => {
        setSearchTerm("")
        setStatusFilter("all")
        setMethodFilters([])
    }

    // Render loading skeleton for grid view
    const renderGridSkeleton = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
                <Card key={item} className="overflow-hidden">
                    <div className="h-36 bg-muted animate-pulse" />
                    <CardContent className="p-4">
                        <div className="h-6 bg-muted animate-pulse rounded w-3/4 mb-3" />
                        <div className="h-4 bg-muted animate-pulse rounded w-full mb-2" />
                        <div className="h-4 bg-muted animate-pulse rounded w-5/6 mb-4" />
                        <div className="flex justify-between items-center">
                            <div className="h-5 bg-muted animate-pulse rounded w-1/3" />
                            <div className="h-5 bg-muted animate-pulse rounded w-1/4" />
                        </div>
                        <div className="mt-4 pt-3 border-t flex justify-between">
                            <div className="h-8 bg-muted animate-pulse rounded w-1/4" />
                            <div className="flex gap-2">
                                <div className="h-8 bg-muted animate-pulse rounded w-16" />
                                <div className="h-8 bg-muted animate-pulse rounded w-16" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )

    // Render loading skeleton for table view
    const renderTableSkeleton = () => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Website</TableHead>
                    <TableHead>Document</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {[1, 2, 3, 4, 5].map((item) => (
                    <TableRow key={item}>
                        <TableCell>
                            <div className="flex items-center">
                                <div className="h-10 w-10 bg-muted animate-pulse rounded-full mr-3"></div>
                                <div className="space-y-2">
                                    <div className="h-5 bg-muted animate-pulse rounded w-32"></div>
                                    <div className="h-4 bg-muted animate-pulse rounded w-48"></div>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell><div className="h-6 bg-muted animate-pulse rounded w-20"></div></TableCell>
                        <TableCell><div className="h-6 bg-muted animate-pulse rounded w-16"></div></TableCell>
                        <TableCell><div className="h-5 bg-muted animate-pulse rounded w-24"></div></TableCell>
                        <TableCell><div className="h-5 bg-muted animate-pulse rounded w-32"></div></TableCell>
                        <TableCell><div className="h-5 bg-muted animate-pulse rounded w-16"></div></TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                                <div className="h-8 bg-muted animate-pulse rounded w-16"></div>
                                <div className="h-8 bg-muted animate-pulse rounded w-16"></div>
                                <div className="h-8 bg-muted animate-pulse rounded w-8"></div>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )

    // Render the grid view of companies
    const renderGridView = () => {
        if (isLoading && !isFetching) {
            return renderGridSkeleton();
        }

        if (isError) {
            return (
                <div className="col-span-full py-12 px-6">
                    <ErrorBanner
                        title="Failed to load companies"
                        message={filterError?.message || "There was an error loading the companies data"}
                        onRetry={() => {
                            queryClient.invalidateQueries({ queryKey: ['filteredCompanies'] });
                            queryClient.invalidateQueries({ queryKey: ['companies'] });
                            refetchFilteredCompanies();
                        }}
                    />
                </div>
            );
        }

        if (companiesData?.companies?.length === 0) {
            return (
                <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-5">
                        <Search className="h-10 w-10 text-muted-foreground opacity-70" />
                    </div>
                    <h3 className="text-xl font-semibold mt-2">No companies found</h3>
                    <p className="mt-2 text-muted-foreground text-center max-w-md">
                        Try adjusting your search or filter criteria
                    </p>
                    <Button variant="outline" onClick={clearAllFilters} className="mt-6 px-6">
                        Clear all filters
                    </Button>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-1">
                {companiesData?.companies?.map((company) => (
                    <Card
                        key={company._id}
                        className="overflow-hidden hover:shadow-lg transition-all duration-300 border-muted/80 flex flex-col"
                    >
                        <div className="relative h-48 bg-gradient-to-b from-muted/30 to-muted">
                            <img
                                src={company.image || "/TaleexLogo.png"}
                                alt={company.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 right-3">
                                <StatusBadge status={company.verification.status} />
                            </div>
                            {company.verification.document && (
                                <div className="absolute bottom-3 right-3">
                                    <Tooltip content="View verification document">
                                        <a
                                            href={company.verification.document}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-center gap-1 bg-white/95 dark:bg-black/90 px-3 py-2 rounded-lg shadow-md hover:shadow-lg hover:bg-white dark:hover:bg-black transition-all duration-200 border border-primary/20"
                                        >
                                            <FileText className="h-4 w-4 text-primary group-hover:text-primary/80" />
                                            <span className="text-xs font-medium text-primary group-hover:text-primary/80">Document</span>
                                        </a>
                                    </Tooltip>
                                </div>
                            )}
                        </div>

                        <CardContent className="p-5 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-lg tracking-tight truncate">{company.name}</h3>
                            </div>

                            <p className="text-muted-foreground text-sm line-clamp-2 min-h-12">
                                {company.description || "No description available"}
                            </p>

                            <div className="mt-4 flex items-center justify-between text-sm">
                                {company.website ? (
                                    <a
                                        href={company.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center text-primary hover:underline hover:text-primary/80 transition-colors"
                                    >
                                        <ExternalLink size={14} className="mr-1" />
                                        Website
                                    </a>
                                ) : (
                                    <span className="text-muted-foreground flex items-center">
                                    <XCircle size={14} className="mr-1 opacity-70" />
                                    No website
                                </span>
                                )}

                                {company.verification.method && (
                                    <MethodBadge method={company.verification.method} />
                                )}
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {company.values?.slice(0, 3).map((value, idx) => (
                                    <Badge
                                        key={idx}
                                        variant="secondary"
                                        className="bg-primary/10 text-primary hover:bg-primary/20 px-2 py-1"
                                    >
                                        {value}
                                    </Badge>
                                ))}
                                {company.values?.length > 3 && (
                                    <Badge variant="outline" className="text-muted-foreground">
                                        +{company.values.length - 3}
                                    </Badge>
                                )}
                                {(!company.values || company.values.length === 0) && (
                                    <span className="text-xs text-muted-foreground italic">No values listed</span>
                                )}
                            </div>

                            {company.verification.status === "rejected" && company.verification.reason && (
                                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-md">
                                    <p className="text-xs text-red-700 dark:text-red-400 flex items-start">
                                        <AlertCircle size={12} className="mr-1 mt-0.5 flex-shrink-0" />
                                        <span>
                                        <span className="font-medium">Rejection reason:</span> {company.verification.reason}
                                    </span>
                                    </p>
                                </div>
                            )}

                            <div className="mt-auto pt-4 flex justify-between items-center border-t border-muted/60 mt-4">
                                <Button
                                    variant="link"
                                    onClick={() => setSelectedCompany(company)}
                                    className="p-0 h-auto text-primary font-medium hover:text-primary/80 transition-colors"
                                >
                                    View details
                                </Button>
                                {company.verification.status === "pending" && (
                                    <div className="flex gap-2">
                                        <Tooltip content="Reject company">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openRejectionDialog(company)}
                                                className="h-8 border-destructive text-destructive hover:bg-destructive/10 transition-colors"
                                                disabled={verificationLoading}
                                            >
                                                {verificationLoading && companyToReject?._id === company._id ? (
                                                    <Loader2 size={14} className="animate-spin mr-1" />
                                                ) : (
                                                    <X size={14} className="mr-1" />
                                                )}
                                                Reject
                                            </Button>
                                        </Tooltip>
                                        <Tooltip content="Verify company">
                                            <Button
                                                variant="default"
                                                size="sm"
                                                onClick={() => handleVerifyCompany(company._id, true)}
                                                className="h-8 bg-green-600 hover:bg-green-700 text-white transition-colors"
                                                disabled={verificationLoading}
                                            >
                                                {verificationLoading && !companyToReject && selectedCompany?._id === company._id ? (
                                                    <Loader2 size={14} className="animate-spin mr-1" />
                                                ) : (
                                                    <Check size={14} className="mr-1" />
                                                )}
                                                Verify
                                            </Button>
                                        </Tooltip>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {isFetching && !isLoading && (
                    <div className="col-span-full flex justify-center py-8">
                        <div className="flex flex-col items-center">
                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                            <span className="text-sm text-muted-foreground mt-2">Loading more companies...</span>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Render the table view of companies
    const renderTableView = () => (
        <div className="overflow-x-auto rounded-lg border border-muted/60">
            {isLoading && !isFetching ? (
                renderTableSkeleton()
            ) : (
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="hover:bg-muted/40 border-b border-muted/60">
                            <TableHead className="font-semibold">
                                <div className="flex items-center gap-1">
                                    Company
                                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-muted/80">
                                        <ArrowUpDown size={12} />
                                    </Button>
                                </div>
                            </TableHead>
                            <TableHead className="font-semibold">
                                <div className="flex items-center gap-1">
                                    Status
                                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-muted/80">
                                        <ArrowUpDown size={12} />
                                    </Button>
                                </div>
                            </TableHead>
                            <TableHead className="font-semibold">Method</TableHead>
                            <TableHead className="font-semibold">Created</TableHead>
                            <TableHead className="font-semibold">Website</TableHead>
                            <TableHead className="font-semibold">Document</TableHead>
                            <TableHead className="text-right font-semibold">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {companiesData?.companies?.length > 0 ? (
                            companiesData?.companies?.map((company) => (
                                <TableRow
                                    key={company._id}
                                    className="hover:bg-muted/10 transition-colors cursor-pointer"
                                    onClick={() => setSelectedCompany(company)}
                                >
                                    <TableCell className="py-4">
                                        <div className="flex items-center">
                                            <div className="h-12 w-12 flex-shrink-0 mr-4 rounded-md overflow-hidden border border-muted/30 bg-muted/20">
                                                <img
                                                    src={company.image || "/logo.svg"}
                                                    alt={company.name}
                                                    className="h-12 w-12 object-cover"
                                                />
                                            </div>
                                            <div className="max-w-md">
                                                <div className="font-medium text-base">{company.name}</div>
                                                <div className="text-sm text-muted-foreground truncate max-w-xs">
                                                    {company.description || "No description"}
                                                </div>
                                                {company.verification.status === "rejected" && company.verification.reason && (
                                                    <div className="mt-1.5 text-xs flex items-start text-red-600 dark:text-red-400 max-w-xs">
                                                        <AlertCircle size={12} className="mr-1 mt-0.5 flex-shrink-0" />
                                                        <span className="line-clamp-2">
                                                        <span className="font-medium">Rejected:</span> {company.verification.reason}
                                                    </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={company.verification.status} />
                                    </TableCell>
                                    <TableCell>
                                        {company.verification.method ? (
                                            <MethodBadge method={company.verification.method} />
                                        ) : (
                                            <span className="text-muted-foreground text-sm">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        <div className="flex flex-col">
                                            <span>{formatDate(company.createdAt)}</span>
                                            <span className="text-xs text-muted-foreground/70">
                                            {formatDate(company.createdAt)}
                                        </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="min-w-40">
                                        {company.website ? (
                                            <a
                                                href={company.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:text-primary/80 flex items-center group transition-colors"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <span className="truncate w-36 inline-block">{company.website}</span>
                                                <ExternalLink size={14} className="ml-1.5 opacity-70 group-hover:opacity-100" />
                                            </a>
                                        ) : (
                                            <span className="text-muted-foreground flex items-center text-sm">
                                            <XCircle size={14} className="mr-1.5 opacity-60" />
                                            Not available
                                        </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {company.verification.document ? (
                                            <a
                                                href={company.verification.document}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:text-primary/80 flex items-center bg-primary/5 hover:bg-primary/10 px-2.5 py-1.5 rounded-md transition-colors inline-flex group"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <FileText size={14} className="mr-1.5" />
                                                <span className="font-medium text-sm">View document</span>
                                            </a>
                                        ) : (
                                            <span className="text-muted-foreground flex items-center text-sm">
                                            <FileX size={14} className="mr-1.5 opacity-60" />
                                            No document
                                        </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right p-0" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center justify-end pr-4 h-full">
                                            {company.verification.status === "pending" ? (
                                                <div className="flex items-center gap-1">
                                                    <Tooltip content="Verify company">
                                                        <Button
                                                            variant="default"
                                                            size="icon"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleVerifyCompany(company._id);
                                                            }}
                                                            className="h-7 w-7 bg-green-600 hover:bg-green-700 text-white rounded-md"
                                                            disabled={verificationLoading}
                                                        >
                                                            {verificationLoading && !companyToReject && selectedCompany?._id === company._id ? (
                                                                <Loader2 size={14} className="animate-spin" />
                                                            ) : (
                                                                <Check size={14} />
                                                            )}
                                                        </Button>
                                                    </Tooltip>

                                                    <Tooltip content="Reject company">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openRejectionDialog(company);
                                                            }}
                                                            className="h-7 w-7 border-destructive text-destructive hover:bg-destructive/10 rounded-md"
                                                            disabled={verificationLoading}
                                                        >
                                                            {verificationLoading && companyToReject?._id === company._id ? (
                                                                <Loader2 size={14} className="animate-spin" />
                                                            ) : (
                                                                <X size={14} />
                                                            )}
                                                        </Button>
                                                    </Tooltip>
                                                </div>
                                            ) : null}

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedCompany(company);
                                                }}
                                                className="h-7 w-7 text-primary hover:text-primary/80 hover:bg-primary/5 rounded-md ml-1"
                                            >
                                                <Eye size={16} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : isError ? (
                            <TableRow>
                                <TableCell colSpan={7} className="p-8">
                                    <ErrorBanner
                                        title="Failed to load companies"
                                        message={filterError?.message || "There was an error loading the companies data"}
                                        onRetry={() => {
                                            queryClient.invalidateQueries({ queryKey: ['filteredCompanies'] });
                                            queryClient.invalidateQueries({ queryKey: ['companies'] });
                                            refetchFilteredCompanies();
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="px-6 py-16 text-center">
                                    <div className="inline-flex flex-col items-center justify-center">
                                        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-5">
                                            <Search className="h-8 w-8 text-muted-foreground opacity-70" />
                                        </div>
                                        <h3 className="text-xl font-semibold">No companies found</h3>
                                        <p className="mt-2 text-muted-foreground max-w-md">
                                            Try adjusting your search or filter criteria
                                        </p>
                                        <Button variant="outline" onClick={clearAllFilters} className="mt-6 px-6">
                                            Clear all filters
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            )}
            {isFetching && !isLoading && (
                <div className="flex justify-center py-6 border-t border-muted/40">
                    <div className="flex flex-col items-center">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground mt-2">Loading more companies...</span>
                    </div>
                </div>
            )}
        </div>
    )
// Error handling component
    const ErrorSection = () => {
        const queryClient = useQueryClient();

        if (isError) {
            return (
                <div className="col-span-3 py-8 px-4">
                    <ErrorBanner
                        title="Failed to load companies"
                        message={filterError?.message || "There was an error loading the companies data"}
                        onRetry={() => {
                            queryClient.invalidateQueries({ queryKey: ['filteredCompanies'] });
                            queryClient.invalidateQueries({ queryKey: ['companies'] });
                            refetchFilteredCompanies();
                        }}
                    />
                </div>
            );
        }

        return null;
    };

// Success Alert component
    const SuccessAlert = () => {
        if (!showSuccessAlert) return null;

        return (
            <div className="fixed bottom-4 right-4 z-50">
                <Alert className={`${successMessage.includes("Error") ? "bg-destructive" : "bg-green-600"} text-white`}>
                    <div className="flex items-center gap-2">
                        {successMessage.includes("Error") ? (
                            <AlertCircle className="h-4 w-4" />
                        ) : (
                            <CheckCircle className="h-4 w-4" />
                        )}
                        <AlertTitle>{successMessage}</AlertTitle>
                    </div>
                </Alert>
            </div>
        );
    };

    return (
        <div className="bg-background min-h-screen">
            {/* Success Alert */}
            <SuccessAlert />

            {/* Rejection Dialog */}
            <Dialog open={showRejectionDialog} onOpenChange={(open) => !open && setShowRejectionDialog(false)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Reject Company</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejecting <span className="font-medium">{companyToReject?.name}</span>. This will be sent to the company.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <Textarea
                            placeholder="Reason for rejection"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>
                    <DialogFooter className="sm:justify-between">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setShowRejectionDialog(false)}
                            disabled={verificationLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => handleRejectCompany(companyToReject?._id, rejectionReason)}
                            disabled={verificationLoading || !rejectionReason.trim()}
                        >
                            {verificationLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Reject Company
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Company Detail Dialog */}
            <Dialog open={!!selectedCompany} onOpenChange={(open) => !open && setSelectedCompany(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    {selectedCompany && (
                        <>
                            <DialogHeader>
                                <DialogTitle>{selectedCompany.name}</DialogTitle>
                                <DialogDescription>Company details and verification information</DialogDescription>
                            </DialogHeader>

                            {verificationLoading ? (
                                <div className="flex flex-col justify-center items-center p-12 gap-4">
                                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                    <p className="text-muted-foreground">Processing...</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Company image */}
                                    <div className="flex items-center justify-center">
                                        <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center">
                                            <img
                                                src={selectedCompany.image || "/logo.svg"}
                                                alt={selectedCompany.name}
                                                className="rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    {/* Company details */}
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                                            <p className="mt-1">{selectedCompany.description}</p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                                            <p className="mt-1">{selectedCompany.address}</p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">Website</h3>
                                            <div className="mt-1 flex items-center">
                                                <a
                                                    href={selectedCompany.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline flex items-center"
                                                >
                                                    {selectedCompany.website}
                                                    <ExternalLink size={14} className="ml-1" />
                                                </a>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">Company Values</h3>
                                            <div className="mt-1 flex flex-wrap gap-2">
                                                {selectedCompany.values?.map((value, idx) => (
                                                    <Badge key={idx} variant="secondary" className="bg-primary/10 text-primary">
                                                        {value}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <h3 className="text-sm font-medium text-muted-foreground">Created At</h3>
                                                <p className="mt-1">{formatDate(selectedCompany.createdAt)}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-muted-foreground">Updated At</h3>
                                                <p className="mt-1">{formatDate(selectedCompany.updatedAt)}</p>
                                            </div>
                                        </div>

                                        {/* Verification details */}
                                        <div className="border-t pt-4 mt-4">
                                            <h3 className="text-lg font-medium">Verification Details</h3>
                                            <div className="mt-4 space-y-3">
                                                <div className="flex justify-between">
                                                    <span className="text-sm font-medium text-muted-foreground">Status</span>
                                                    <StatusBadge status={selectedCompany.verification.status} />
                                                </div>

                                                {selectedCompany.verification.method && (
                                                    <div className="flex justify-between">
                                                        <span className="text-sm font-medium text-muted-foreground">Method</span>
                                                        <MethodBadge method={selectedCompany.verification.method} />
                                                    </div>
                                                )}

                                                {selectedCompany.verification.email && (
                                                    <div className="flex justify-between">
                                                        <span className="text-sm font-medium text-muted-foreground">Email</span>
                                                        <MethodBadge method={selectedCompany.verification.email} />
                                                    </div>
                                                )}


                                                <div className="flex justify-between">
                                                    <span className="text-sm font-medium text-muted-foreground">Requested Date</span>
                                                    <span className="text-sm">{formatDate(selectedCompany.createdAt)}</span>
                                                </div>

                                                {selectedCompany.verification.reviewedDate && (
                                                    <div className="flex justify-between">
                                                        <span className="text-sm font-medium text-muted-foreground">Reviewed Date</span>
                                                        <span className="text-sm">{formatDate(selectedCompany.verification.reviewedDate)}</span>
                                                    </div>
                                                )}


                                                {selectedCompany.verification.document && (
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-medium text-muted-foreground">Verification Document</span>
                                                        <a
                                                            href={selectedCompany.verification.document}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-primary hover:underline flex items-center"
                                                        >
                                                            <FileText size={14} className="mr-1" />
                                                            View Document
                                                        </a>
                                                    </div>
                                                )}

                                                {selectedCompany.verification.reason && (
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-muted-foreground">Rejection Reason</span>
                                                        <span className="text-sm mt-1 p-2 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-md text-red-700 dark:text-red-400">
                                                        {selectedCompany.verification.reason}
                                                    </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <DialogFooter className="flex gap-3">
                                {selectedCompany.verification.status === "pending" && (
                                    <>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setSelectedCompany(null)
                                                openRejectionDialog(selectedCompany)
                                            }}
                                            disabled={verificationLoading}
                                            className="border-destructive text-destructive hover:bg-destructive/10"
                                        >
                                            Reject
                                        </Button>
                                        <Button
                                            variant="default"
                                            onClick={() => handleVerifyCompany(selectedCompany._id, true)}
                                            disabled={verificationLoading}
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            {verificationLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                            Verify
                                        </Button>
                                    </>
                                )}
                                <Button variant="secondary" onClick={() => setSelectedCompany(null)}>
                                    Close
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Header */}
            <div className="bg-card border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <h1 className="text-2xl font-bold">Companies Management</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Manage and verify company listings in the system</p>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Toolbar */}
                <div className="mb-6 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    {isFilterFetching && searchTerm ? (
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                    ) : (
                                        <Search className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </div>
                                <Input
                                    type="text"
                                    className="pl-10 pr-12"
                                    placeholder="Search companies..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && (
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setSearchTerm("")}
                                            className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="gap-1">
                                            <Filter className="h-4 w-4" />
                                            Filter
                                            <ChevronDown className="h-4 w-4 ml-1" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <div className="p-2">
                                            <p className="text-sm font-medium mb-2">Status</p>
                                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="all">All Statuses</SelectItem>
                                                        <SelectItem value="verified">Verified</SelectItem>
                                                        <SelectItem value="pending">Pending</SelectItem>
                                                        <SelectItem value="rejected">Rejected</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <DropdownMenuSeparator />

                                        <div className="p-2">
                                            <p className="text-sm font-medium mb-2">Verification Method</p>
                                            <div className="space-y-2">
                                                <DropdownMenuCheckboxItem
                                                    checked={methodFilters.includes("domain")}
                                                    onCheckedChange={() => toggleMethodFilter("domain")}
                                                >
                                                    Domain
                                                </DropdownMenuCheckboxItem>
                                                <DropdownMenuCheckboxItem
                                                    checked={methodFilters.includes("admin")}
                                                    onCheckedChange={() => toggleMethodFilter("admin")}
                                                >
                                                    Admin
                                                </DropdownMenuCheckboxItem>
                                            </div>
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <div className="flex items-center border rounded-md overflow-hidden">
                                    <Button
                                        variant={viewMode === "grid" ? "default" : "ghost"}
                                        size="icon"
                                        onClick={() => setViewMode("grid")}
                                        className="rounded-none h-10 px-3"
                                    >
                                        <LayoutGrid className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === "table" ? "default" : "ghost"}
                                        size="icon"
                                        onClick={() => setViewMode("table")}
                                        className="rounded-none h-10 px-3"
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {(searchTerm || statusFilter !== "all" || methodFilters.length > 0) && (
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm text-muted-foreground">Active filters:</span>
                                <div className="flex flex-wrap gap-2">
                                    {searchTerm && (
                                        <Badge variant="outline" className="bg-primary/10 text-primary flex items-center gap-1">
                                            Search: {searchTerm}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setSearchTerm("")}
                                                className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </Badge>
                                    )}
                                    {statusFilter !== "all" && (
                                        <Badge variant="outline" className="bg-primary/10 text-primary flex items-center gap-1">
                                            Status: {statusFilter}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setStatusFilter("all")}
                                                className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </Badge>
                                    )}
                                    {methodFilters.map((method) => (
                                        <Badge
                                            key={method}
                                            variant="outline"
                                            className="bg-primary/10 text-primary flex items-center gap-1"
                                        >
                                            Method: {method}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => toggleMethodFilter(method)}
                                                className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </Badge>
                                    ))}
                                </div>
                                {(searchTerm || statusFilter !== "all" || methodFilters.length > 0) && (
                                    <Button variant="link" onClick={clearAllFilters} className="text-sm h-auto p-0">
                                        Clear all filters
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <Card className="shadow-sm">
                    <CardContent className="p-0">
                        {/* Error handling */}
                        <ErrorSection />

                        {/* Loading state */}
                        {isLoading && !isError && (
                            <div className="flex flex-col justify-center items-center p-12 gap-4">
                                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                <p className="text-muted-foreground">Loading companies...</p>
                            </div>
                        )}

                        {/* Data view */}
                        {!isLoading && !isError && (
                            <Tabs defaultValue={viewMode} value={viewMode} onValueChange={setViewMode} className="w-full">
                                <TabsList className="hidden">
                                    <TabsTrigger value="grid">Grid</TabsTrigger>
                                    <TabsTrigger value="table">Table</TabsTrigger>
                                </TabsList>
                                <TabsContent value="grid" className="p-4 sm:p-6">
                                    {renderGridView()}
                                </TabsContent>
                                <TabsContent value="table" className="p-0">
                                    {renderTableView()}
                                </TabsContent>
                            </Tabs>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
