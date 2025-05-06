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
    Globe,
} from "lucide-react"
import { format } from "date-fns"

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
    const [showSuccessAlert, setShowSuccessAlert] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm)
    const [rejectionReason, setRejectionReason] = useState("")
    const [showRejectionDialog, setShowRejectionDialog] = useState(false)
    const [companyToReject, setCompanyToReject] = useState(null)

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
    } = useFilterCompanies(filters, {
        enabled: true,
        keepPreviousData: true,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
    })

    // Get all companies (used as fallback)
    const { data: allCompaniesData, isLoading: allCompaniesLoading } = useCompanies({
        enabled: !filters.name && !filters.verificationStatus && !filters.verificationMethod,
    })

    // Determine which data to use
    const companiesData =
        filters.name || filters.verificationStatus || filters.verificationMethod ? filteredCompaniesData : allCompaniesData
    const isLoading =
        filters.name || filters.verificationStatus || filters.verificationMethod
            ? filteredCompaniesLoading
            : allCompaniesLoading
    const isError = isFilterError

    // Company verification mutation
    const { mutate: verifyCompanyMutation, isLoading: verificationLoading } = useVerifyCompany()

    // Handle company verification
    const handleVerifyCompany = (companyId, isApproved = true) => {
        verifyCompanyMutation(
            { id: companyId, status: isApproved ? "verified" : "rejected" },
            {
                onSuccess: () => {
                    setSuccessMessage(isApproved ? "Company successfully verified" : "Company rejection processed")
                    setShowSuccessAlert(true)
                    setTimeout(() => setShowSuccessAlert(false), 3000)

                    // Close modal if open
                    if (selectedCompany && selectedCompany._id === companyId) {
                        setSelectedCompany(null)
                    }
                },
                onError: (error) => {
                    console.error("Verification error:", error)
                    // Handle error display
                },
            },
        )
    }

    // Handle rejecting a company with reason
    const handleRejectCompany = (companyId, reason) => {
        verifyCompanyMutation(
            { id: companyId, status: "rejected", reason },
            {
                onSuccess: () => {
                    setSuccessMessage("Company rejection processed")
                    setShowSuccessAlert(true)
                    setTimeout(() => setShowSuccessAlert(false), 3000)

                    // Close modals
                    setShowRejectionDialog(false)
                    setRejectionReason("")
                    setCompanyToReject(null)

                    if (selectedCompany && selectedCompany._id === companyId) {
                        setSelectedCompany(null)
                    }
                },
                onError: (error) => {
                    console.error("Rejection error:", error)
                    setSuccessMessage(`Error: ${error.response?.data?.message || "Failed to reject company"}`)
                    setShowSuccessAlert(true)
                    setTimeout(() => setShowSuccessAlert(false), 5000)
                },
            },
        )
    }

    // Open rejection dialog
    const openRejectionDialog = (company) => {
        setCompanyToReject(company)
        setRejectionReason("")
        setShowRejectionDialog(true)
    }

    // Handle deleting a company
    const handleDeleteCompany = async (companyId) => {
        try {
            const response = await fetch(`/api/companies/${companyId}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || `Failed to delete company (Status: ${response.status})`)
            }

            setSuccessMessage("Company deleted successfully")
            setShowSuccessAlert(true)
            setTimeout(() => setShowSuccessAlert(false), 3000)

            // Refetch data
            queryClient.invalidateQueries({ queryKey: ["companies"] })
            queryClient.invalidateQueries({ queryKey: ["filteredCompanies"] })
        } catch (error) {
            console.error("Error deleting company:", error)
            setSuccessMessage(`Error: ${error.response?.data?.message || "Failed to delete company"}`)
            setShowSuccessAlert(true)
            setTimeout(() => setShowSuccessAlert(false), 5000)
        }
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

    // Render the grid view of companies
    const renderGridView = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col justify-center items-center py-12 gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading companies...</p>
                </div>
            )
        }

        if (isError) {
            return (
                <div className="col-span-3 py-8 px-4">
                    <ErrorBanner
                        title="Failed to load companies"
                        message={filterError?.message || "There was an error loading the companies data"}
                        onRetry={() => refetchFilteredCompanies()}
                    />
                </div>
            )
        }

        if (companiesData?.companies?.length === 0) {
            return (
                <div className="col-span-3 text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                        <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No companies found</h3>
                    <p className="mt-1 text-muted-foreground">Try adjusting your search or filter criteria</p>
                    <Button variant="link" onClick={clearAllFilters} className="mt-4">
                        Clear filters
                    </Button>
                </div>
            )
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {companiesData?.companies?.map((company) => (
                    <Card key={company._id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <div className="relative h-36 bg-muted">
                            <img src={company.image || "/logo.svg"} alt={company.name} className="w-full h-full object-cover" />
                            <div className="absolute top-2 right-2">
                                <StatusBadge status={company.verification.status} />
                            </div>
                            {company.verification.document && (
                                <div className="absolute bottom-2 right-2">
                                    <a
                                        href={company.verification.document}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white/90 dark:bg-black/70 p-2 rounded-full shadow-sm hover:bg-white dark:hover:bg-black"
                                    >
                                        <FileText className="h-4 w-4 text-primary" />
                                    </a>
                                </div>
                            )}
                        </div>

                        <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                                <h3 className="font-medium text-lg">{company.name}</h3>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteCompany(company._id)}
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>

                            <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{company.description}</p>

                            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                                <a
                                    href={company.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center text-primary hover:underline"
                                >
                                    <ExternalLink size={14} className="mr-1" />
                                    Website
                                </a>

                                {company.verification.method && <MethodBadge method={company.verification.method} />}
                            </div>

                            <div className="mt-3 flex flex-wrap gap-1">
                                {company.values?.slice(0, 3).map((value, idx) => (
                                    <Badge key={idx} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                                        {value}
                                    </Badge>
                                ))}
                            </div>

                            {company.verification.status === "rejected" && company.verification.reason && (
                                <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-md">
                                    <p className="text-xs text-red-700 dark:text-red-400">
                                        <span className="font-medium">Rejection reason:</span> {company.verification.reason}
                                    </p>
                                </div>
                            )}

                            <div className="mt-4 flex justify-between items-center border-t pt-3">
                                <Button variant="link" onClick={() => setSelectedCompany(company)} className="p-0 h-auto text-primary">
                                    View details
                                </Button>
                                {company.verification.status === "pending" && (
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openRejectionDialog(company)}
                                            className="h-8 border-destructive text-destructive hover:bg-destructive/10"
                                        >
                                            Reject
                                        </Button>
                                        <Button
                                            variant="default"
                                            size="sm"
                                            onClick={() => handleVerifyCompany(company._id, true)}
                                            className="h-8 bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            Verify
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    // Render the table view of companies
    const renderTableView = () => (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            <div className="flex items-center gap-1">
                                Company
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <ArrowUpDown size={12} />
                                </Button>
                            </div>
                        </TableHead>
                        <TableHead>
                            <div className="flex items-center gap-1">
                                Status
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <ArrowUpDown size={12} />
                                </Button>
                            </div>
                        </TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Website</TableHead>
                        <TableHead>Document</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {companiesData?.companies?.length > 0 ? (
                        companiesData?.companies?.map((company) => (
                            <TableRow key={company._id}>
                                <TableCell>
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0 mr-3">
                                            <img src={company.image || "/logo.svg"} alt={company.name} className="h-10 w-10 rounded-full" />
                                        </div>
                                        <div>
                                            <div className="font-medium">{company.name}</div>
                                            <div className="text-sm text-muted-foreground truncate max-w-xs">{company.description}</div>
                                            {company.verification.status === "rejected" && company.verification.reason && (
                                                <div className="mt-1 text-xs text-red-600 dark:text-red-400">
                                                    <span className="font-medium">Rejected:</span> {company.verification.reason}
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
                                        <span className="text-muted-foreground">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-muted-foreground">{formatDate(company.createdAt)}</TableCell>
                                <TableCell>
                                    <a
                                        href={company.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline flex items-center"
                                    >
                                        <span className="truncate w-32 inline-block">{company.website}</span>
                                        <ExternalLink size={14} className="ml-1" />
                                    </a>
                                </TableCell>
                                <TableCell>
                                    {company.verification.document ? (
                                        <a
                                            href={company.verification.document}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline flex items-center"
                                        >
                                            <FileText size={14} className="mr-1" />
                                            <span>View</span>
                                        </a>
                                    ) : (
                                        <span className="text-muted-foreground">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        {company.verification.status === "pending" && (
                                            <>
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    onClick={() => handleVerifyCompany(company._id)}
                                                    className="h-8 bg-green-600 hover:bg-green-700 text-white"
                                                >
                                                    Verify
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openRejectionDialog(company)}
                                                    className="h-8 border-destructive text-destructive hover:bg-destructive/10"
                                                >
                                                    Reject
                                                </Button>
                                            </>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setSelectedCompany(company)}
                                            className="h-8 text-primary"
                                        >
                                            View
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteCompany(company._id)}
                                            className="h-8 w-8 text-destructive"
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : isError ? (
                        <TableRow>
                            <TableCell colSpan={7} className="p-6">
                                <ErrorBanner
                                    title="Failed to load companies"
                                    message={filterError?.message || "There was an error loading the companies data"}
                                    onRetry={() => refetchFilteredCompanies()}
                                />
                            </TableCell>
                        </TableRow>
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} className="px-6 py-12 text-center">
                                <div className="inline-flex flex-col items-center justify-center">
                                    <Search className="h-8 w-8 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-medium">No companies found</h3>
                                    <p className="mt-1 text-muted-foreground">Try adjusting your search or filter criteria</p>
                                    <Button variant="link" onClick={clearAllFilters} className="mt-4">
                                        Clear filters
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )

    return (
        <div className="bg-background min-h-screen">
            {/* Success/Error alert */}
            {showSuccessAlert && (
                <div className="fixed top-4 right-4 z-50 w-80 md:w-96 shadow-lg">
                    {successMessage.includes("Error") ? (
                        <ErrorBanner message={successMessage.replace("Error: ", "")} />
                    ) : (
                        <SuccessBanner message={successMessage} />
                    )}
                </div>
            )}

            {/* Rejection Dialog */}
            <Dialog open={showRejectionDialog} onOpenChange={(open) => !open && setShowRejectionDialog(false)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Reject Company</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejecting {companyToReject?.name}. This will be sent to the company.
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

                                                <div className="flex justify-between">
                                                    <span className="text-sm font-medium text-muted-foreground">Requested Date</span>
                                                    <span className="text-sm">{formatDate(selectedCompany.verification.requestedDate)}</span>
                                                </div>

                                                {selectedCompany.verification.reviewedDate && (
                                                    <div className="flex justify-between">
                                                        <span className="text-sm font-medium text-muted-foreground">Reviewed Date</span>
                                                        <span className="text-sm">{formatDate(selectedCompany.verification.reviewedDate)}</span>
                                                    </div>
                                                )}

                                                {selectedCompany.verification.reviewedBy && (
                                                    <div className="flex justify-between">
                                                        <span className="text-sm font-medium text-muted-foreground">Reviewed By</span>
                                                        <span className="text-sm">{selectedCompany.verification.reviewedBy}</span>
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
                                    {filteredCompaniesLoading && searchTerm ? (
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
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
