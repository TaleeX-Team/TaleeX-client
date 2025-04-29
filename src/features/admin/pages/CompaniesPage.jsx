import { useState, useEffect } from "react"
import { Search, Check, X, ExternalLink, ArrowUpDown, Trash2, Loader2 } from "lucide-react"
import { useCompanies, useVerifyCompany, useFilterCompanies } from "@/hooks/userQueries.js"
import { useQueryClient } from "@tanstack/react-query"
import { ErrorBanner } from "@/components/admin/ErrorBanner.jsx"
import { SuccessBanner } from "@/components/admin/SuccessBanner.jsx"

const StatusBadge = ({ status }) => {
    const getStatusConfig = () => {
        switch (status) {
            case "verified":
                return {
                    icon: <Check size={12} />,
                    bg: "bg-green-50 dark:bg-green-900/30",
                    text: "text-green-600 dark:text-green-300",
                    border: "border-green-100 dark:border-green-800",
                }
            case "pending":
                return {
                    icon: null,
                    bg: "bg-yellow-50 dark:bg-yellow-900/30",
                    text: "text-yellow-600 dark:text-yellow-300",
                    border: "border-yellow-100 dark:border-yellow-800",
                }
            case "rejected":
                return {
                    icon: <X size={12} />,
                    bg: "bg-red-50 dark:bg-red-900/30",
                    text: "text-red-600 dark:text-red-300",
                    border: "border-red-100 dark:border-red-800",
                }
            default:
                return {
                    icon: null,
                    bg: "bg-gray-50 dark:bg-gray-900/30",
                    text: "text-gray-600 dark:text-gray-300",
                    border: "border-gray-100 dark:border-gray-800",
                }
        }
    }

    const config = getStatusConfig()

    return (
        <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
        >
            {config.icon}
            <span className="capitalize">{status}</span>
        </div>
    )
}

// Main component
export default function CompaniesManagement() {
    // State for UI
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [selectedCompany, setSelectedCompany] = useState(null)
    const [viewMode, setViewMode] = useState("grid") // 'grid' or 'table'
    const [showSuccessAlert, setShowSuccessAlert] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [newCompany, setNewCompany] = useState({
        name: "",
        address: "",
        website: "",
        description: "",
        values: [],
        verification: {
            method: "email",
            status: "pending",
            domain: "",
            email: "",
        },
    })
    const [tempValue, setTempValue] = useState("")

    // Add this after the state declarations
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm)

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
    })

    // Update filters when search or status filter changes
    useEffect(() => {
        setFilters({
            name: debouncedSearchTerm,
            verificationStatus: statusFilter !== "all" ? statusFilter : undefined,
        })
    }, [debouncedSearchTerm, statusFilter])

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
        enabled: !filters.name && !filters.verificationStatus,
    })

    // Determine which data to use
    const companiesData = filters.name || filters.verificationStatus ? filteredCompaniesData : allCompaniesData
    const isLoading = filters.name || filters.verificationStatus ? filteredCompaniesLoading : allCompaniesLoading
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
            setSuccessMessage(`Error: ${error.message || "Failed to delete company"}`)
            setShowSuccessAlert(true)
            setTimeout(() => setShowSuccessAlert(false), 5000)
        }
    }

    // Handle rejecting a company (wrapper for handleVerifyCompany with isApproved=false)
    const handleRejectCompany = (companyId) => {
        handleVerifyCompany(companyId, false)
    }

    // Company detail view
    const CompanyDetail = () => {
        if (!selectedCompany) return null

        const isLoading = verificationLoading

        return (
            <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-[var(--color-card)] rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
                    <div className="sticky top-0 bg-white dark:bg-[var(--color-card)] p-4 border-b dark:border-[var(--color-border)] flex items-center justify-between">
                        <h2 className="text-xl font-bold dark:text-[var(--color-foreground)]">{selectedCompany.name}</h2>
                        <button
                            onClick={() => setSelectedCompany(null)}
                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[var(--color-muted)]"
                        >
                            <X size={20} className="dark:text-[var(--color-foreground)]" />
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col justify-center items-center p-12 gap-4">
                            <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-[var(--color-primary)]" />
                            <p className="text-gray-600 dark:text-[var(--color-muted-foreground)]">Processing...</p>
                        </div>
                    ) : (
                        <div className="p-6 space-y-6">
                            {/* Company image */}
                            <div className="flex items-center justify-center">
                                <div className="w-32 h-32 bg-gray-200 dark:bg-[var(--color-muted)] rounded-lg flex items-center justify-center">
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
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-[var(--color-muted-foreground)]">
                                        Description
                                    </h3>
                                    <p className="mt-1 dark:text-[var(--color-foreground)]">{selectedCompany.description}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-[var(--color-muted-foreground)]">
                                        Address
                                    </h3>
                                    <p className="mt-1 dark:text-[var(--color-foreground)]">{selectedCompany.address}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-[var(--color-muted-foreground)]">
                                        Website
                                    </h3>
                                    <div className="mt-1 flex items-center">
                                        <a
                                            href={selectedCompany.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 dark:text-[var(--color-primary)] hover:underline flex items-center"
                                        >
                                            {selectedCompany.website}
                                            <ExternalLink size={14} className="ml-1" />
                                        </a>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-[var(--color-muted-foreground)]">
                                        Company Values
                                    </h3>
                                    <div className="mt-1 flex flex-wrap gap-2">
                                        {selectedCompany.values.map((value, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2 py-1 bg-blue-100 dark:bg-[var(--color-primary)]/20 text-blue-800 dark:text-[var(--color-primary)] rounded-full text-xs"
                                            >
                        {value}
                      </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Verification details */}
                                <div className="border-t dark:border-[var(--color-border)] pt-4 mt-4">
                                    <h3 className="text-lg font-medium dark:text-[var(--color-foreground)]">Verification Details</h3>
                                    <div className="mt-4 space-y-3">
                                        <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500 dark:text-[var(--color-muted-foreground)]">
                        Status
                      </span>
                                            <StatusBadge status={selectedCompany.verification.status} />
                                        </div>

                                        <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500 dark:text-[var(--color-muted-foreground)]">
                        Method
                      </span>
                                            <span className="text-sm dark:text-[var(--color-foreground)] capitalize">
                        {selectedCompany.verification.method}
                      </span>
                                        </div>

                                        {selectedCompany.verification.domain && (
                                            <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500 dark:text-[var(--color-muted-foreground)]">
                          Domain
                        </span>
                                                <span className="text-sm dark:text-[var(--color-foreground)]">
                          {selectedCompany.verification.domain}
                        </span>
                                            </div>
                                        )}

                                        {selectedCompany.verification.email && (
                                            <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500 dark:text-[var(--color-muted-foreground)]">
                          Email
                        </span>
                                                <span className="text-sm dark:text-[var(--color-foreground)]">
                          {selectedCompany.verification.email}
                        </span>
                                            </div>
                                        )}

                                        {selectedCompany.verification.reviewedDate && (
                                            <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500 dark:text-[var(--color-muted-foreground)]">
                          Reviewed Date
                        </span>
                                                <span className="text-sm dark:text-[var(--color-foreground)]">
                          {new Date(selectedCompany.verification.reviewedDate).toLocaleDateString()}
                        </span>
                                            </div>
                                        )}

                                        {selectedCompany.verification.reason && (
                                            <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500 dark:text-[var(--color-muted-foreground)]">
                          Reason
                        </span>
                                                <span className="text-sm dark:text-[var(--color-foreground)]">
                          {selectedCompany.verification.reason}
                        </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="border-t dark:border-[var(--color-border)] pt-4 flex gap-3 justify-end">
                                {selectedCompany.verification.status === "pending" && (
                                    <>
                                        <button
                                            onClick={() => handleVerifyCompany(selectedCompany._id, false)}
                                            disabled={verificationLoading}
                                            className="px-4 py-2 border border-red-600 dark:border-[var(--color-destructive)] text-red-600 dark:text-[var(--color-destructive)] rounded-md hover:bg-red-50 dark:hover:bg-[var(--color-destructive)]/10 disabled:opacity-50"
                                        >
                                            {verificationLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reject"}
                                        </button>
                                        <button
                                            onClick={() => handleVerifyCompany(selectedCompany._id, true)}
                                            disabled={verificationLoading}
                                            className="px-4 py-2 bg-green-600 dark:bg-[var(--color-primary)] text-white dark:text-[var(--color-primary-foreground)] rounded-md hover:bg-green-700 dark:hover:bg-[var(--color-primary)]/90 disabled:opacity-50"
                                        >
                                            {verificationLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => setSelectedCompany(null)}
                                    className="px-4 py-2 border border-gray-300 dark:border-[var(--color-border)] text-gray-700 dark:text-[var(--color-foreground)] rounded-md hover:bg-gray-50 dark:hover:bg-[var(--color-muted)]"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    // Add company modal

    // Render the grid view of companies
    const renderGridView = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col justify-center items-center py-12 gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-[var(--color-primary)]" />
                    <p className="text-gray-600 dark:text-[var(--color-muted-foreground)]">Loading companies...</p>
                </div>
            )
        }

        // Improve the error display in the grid view by using the ErrorBanner component
        // Replace the isError section in renderGridView with this
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
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-[var(--color-muted)] mb-4">
                        <Search className="h-8 w-8 text-gray-400 dark:text-[var(--color-muted-foreground)]" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-[var(--color-foreground)]">No companies found</h3>
                    <p className="mt-1 text-gray-500 dark:text-[var(--color-muted-foreground)]">
                        Try adjusting your search or filter criteria
                    </p>
                    <button
                        onClick={() => {
                            setSearchTerm("")
                            setStatusFilter("all")
                        }}
                        className="mt-4 text-blue-600 dark:text-[var(--color-primary)] hover:underline"
                    >
                        Clear filters
                    </button>
                </div>
            )
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {companiesData?.companies?.map((company) => (
                    <div
                        key={company._id}
                        className="bg-white dark:bg-[var(--color-card)] border dark:border-[var(--color-border)] rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                        {/* Company card content remains the same */}
                        <div className="relative h-36 bg-gray-200 dark:bg-[var(--color-muted)]">
                            <img
                                src={company.image || "/logo.svg"}
                                alt={company.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2">
                                <StatusBadge status={company.verification.status} />
                            </div>
                        </div>

                        <div className="p-4">
                            <div className="flex justify-between items-start">
                                <h3 className="font-medium text-lg dark:text-[var(--color-foreground)]">{company.name}</h3>
                                <div className="dropdown relative">
                                    <button
                                        onClick={() => handleDeleteCompany(company._id)}
                                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[var(--color-muted)] text-gray-500 hover:text-red-600 dark:hover:text-[var(--color-destructive)]"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <p className="text-gray-600 dark:text-[var(--color-muted-foreground)] text-sm mt-2 line-clamp-2">
                                {company.description}
                            </p>

                            <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-[var(--color-muted-foreground)]">
                                <a
                                    href={company.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center text-blue-600 dark:text-[var(--color-primary)] hover:underline"
                                >
                                    <ExternalLink size={14} className="mr-1" />
                                    Website
                                </a>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-1">
                                {company.values.slice(0, 3).map((value, idx) => (
                                    <span
                                        key={idx}
                                        className="px-2 py-0.5 bg-blue-100 dark:bg-[var(--color-primary)]/20 text-blue-800 dark:text-[var(--color-primary)] rounded-full text-xs"
                                    >
                    {value}
                  </span>
                                ))}
                            </div>

                            <div className="mt-4 flex justify-between items-center border-t dark:border-[var(--color-border)] pt-3">
                                <button
                                    onClick={() => setSelectedCompany(company)}
                                    className="text-sm text-blue-600 dark:text-[var(--color-primary)] hover:underline"
                                >
                                    View details
                                </button>
                                {company.verification.status === "pending" && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleVerifyCompany(company._id, false)}
                                            className="px-2 py-1 text-xs border border-red-600 dark:border-[var(--color-destructive)] text-red-600 dark:text-[var(--color-destructive)] rounded hover:bg-red-50 dark:hover:bg-[var(--color-destructive)]/10"
                                        >
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => handleVerifyCompany(company._id, true)}
                                            className="px-2 py-1 text-xs bg-green-600 dark:bg-[var(--color-primary)] text-white dark:text-[var(--color-primary-foreground)] rounded hover:bg-green-700 dark:hover:bg-[var(--color-primary)]/90"
                                        >
                                            Verify
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    // Render the table view of companies
    const renderTableView = () => (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-[var(--color-border)]">
                <thead className="bg-gray-50 dark:bg-[var(--color-muted)]">
                <tr>
                    <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-[var(--color-muted-foreground)] uppercase tracking-wider"
                    >
                        <div className="flex items-center gap-1">
                            Company
                            <button className="p-1 hover:bg-gray-200 dark:hover:bg-[var(--color-muted)] rounded">
                                <ArrowUpDown size={12} className="dark:text-[var(--color-muted-foreground)]" />
                            </button>
                        </div>
                    </th>
                    <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-[var(--color-muted-foreground)] uppercase tracking-wider"
                    >
                        <div className="flex items-center gap-1">
                            Status
                            <button className="p-1 hover:bg-gray-200 dark:hover:bg-[var(--color-muted)] rounded">
                                <ArrowUpDown size={12} className="dark:text-[var(--color-muted-foreground)]" />
                            </button>
                        </div>
                    </th>
                    <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-[var(--color-muted-foreground)] uppercase tracking-wider"
                    >
                        Method
                    </th>
                    <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-[var(--color-muted-foreground)] uppercase tracking-wider"
                    >
                        Website
                    </th>
                    <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-[var(--color-muted-foreground)] uppercase tracking-wider"
                    >
                        Reviewed
                    </th>
                    <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-[var(--color-muted-foreground)] uppercase tracking-wider"
                    >
                        Actions
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white dark:bg-[var(--color-card)] divide-y divide-gray-200 dark:divide-[var(--color-border)]">
                {companiesData?.companies?.length > 0 ? (
                        companiesData?.companies?.map((company, idx) => (
                            <tr
                                key={company._id}
                                className={
                                    idx % 2 === 0 ? "bg-white dark:bg-[var(--color-card)]" : "bg-gray-50 dark:bg-[var(--color-muted)]"
                                }
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0 mr-3">
                                            <img
                                                src={company.image  || "/logo.svg"}
                                                alt={company.name}
                                                className="h-10 w-10 rounded-full"
                                            />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-[var(--color-foreground)]">
                                                {company.name}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-[var(--color-muted-foreground)] truncate max-w-xs">
                                                {company.description}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={company.verification.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="capitalize dark:text-[var(--color-foreground)]">{company.verification.method}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <a
                                        href={company.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 dark:text-[var(--color-primary)] hover:underline flex items-center"
                                    >
                                        <span className="truncate w-32 inline-block">{company.website}</span>
                                        <ExternalLink size={14} className="ml-1" />
                                    </a>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-[var(--color-muted-foreground)]">
                                    {company.verification.reviewedDate
                                        ? new Date(company.verification.reviewedDate).toLocaleDateString()
                                        : "-"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end gap-2">
                                        {company.verification.status === "pending" && (
                                            <>
                                                <button
                                                    onClick={() => handleVerifyCompany(company._id)}
                                                    className="px-3 py-1 bg-green-600 dark:bg-[var(--color-primary)] text-white dark:text-[var(--color-primary-foreground)] text-xs rounded-md hover:bg-green-700 dark:hover:bg-[var(--color-primary)]/90"
                                                >
                                                    Verify
                                                </button>
                                                <button
                                                    onClick={() => handleRejectCompany(company._id)}
                                                    className="px-3 py-1 border border-red-600 dark:border-[var(--color-destructive)] text-red-600 dark:text-[var(--color-destructive)] text-xs rounded-md hover:bg-red-50 dark:hover:bg-[var(--color-destructive)]/10"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => setSelectedCompany(company)}
                                            className="text-blue-600 dark:text-[var(--color-primary)] hover:text-blue-900 dark:hover:text-[var(--color-primary)]/80"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCompany(company._id)}
                                            className="text-red-600 dark:text-[var(--color-destructive)] hover:text-red-900 dark:hover:text-[var(--color-destructive)]/80"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : // Improve the error display in the table view by using the ErrorBanner component
                    // Find the isError section in renderTableView and replace it with this
                    isError ? (
                        <tr>
                            <td colSpan={6} className="p-6">
                                <ErrorBanner
                                    title="Failed to load companies"
                                    message={filterError?.message || "There was an error loading the companies data"}
                                    onRetry={() => refetchFilteredCompanies()}
                                />
                            </td>
                        </tr>
                    ) : (
                        <tr>
                            <td colSpan={6} className="px-6 py-12 text-center">
                                <div className="inline-flex flex-col items-center justify-center">
                                    <Search className="h-8 w-8 text-gray-400 dark:text-[var(--color-muted-foreground)] mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-[var(--color-foreground)]">
                                        No companies found
                                    </h3>
                                    <p className="mt-1 text-gray-500 dark:text-[var(--color-muted-foreground)]">
                                        Try adjusting your search or filter criteria
                                    </p>
                                    <button
                                        onClick={() => {
                                            setSearchTerm("")
                                            setStatusFilter("all")
                                        }}
                                        className="mt-4 text-blue-600 dark:text-[var(--color-primary)] hover:underline"
                                    >
                                        Clear filters
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )

    return (
        <div className="bg-gray-50 dark:bg-[var(--color-background)] min-h-screen">
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

            {/* Header */}
            <div className="bg-white dark:bg-[var(--color-card)] border-b dark:border-[var(--color-border)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-[var(--color-foreground)]">
                            Companies Management
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-[var(--color-muted-foreground)]">
                            Manage and verify company listings in the system
                        </p>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Toolbar */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                {filteredCompaniesLoading && searchTerm ? (
                                    <Loader2 className="h-4 w-4 animate-spin text-gray-400 dark:text-[var(--color-muted-foreground)]" />
                                ) : (
                                    <Search className="h-5 w-5 text-gray-400 dark:text-[var(--color-muted-foreground)]" />
                                )}
                            </div>
                            <input
                                type="text"
                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 py-2 border-gray-300 dark:border-[var(--color-border)] dark:bg-[var(--color-input)] rounded-md"
                                placeholder="Search companies..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        className="text-gray-400 hover:text-gray-500 dark:text-[var(--color-muted-foreground)] dark:hover:text-[var(--color-foreground)]"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                        {(searchTerm || statusFilter !== "all") && (
                            <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-[var(--color-muted-foreground)]">
                                <span className="mr-2">Active filters:</span>
                                <div className="flex flex-wrap gap-2">
                                    {searchTerm && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-[var(--color-primary)]/20 text-blue-800 dark:text-[var(--color-primary)]">
                      Search: {searchTerm}
                                            <button
                                                onClick={() => setSearchTerm("")}
                                                className="ml-1 text-blue-600 dark:text-[var(--color-primary)] hover:text-blue-800 dark:hover:text-[var(--color-primary)]/80"
                                            >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                                    )}
                                    {statusFilter !== "all" && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-[var(--color-primary)]/20 text-blue-800 dark:text-[var(--color-primary)]">
                      Status: {statusFilter}
                                            <button
                                                onClick={() => setStatusFilter("all")}
                                                className="ml-1 text-blue-600 dark:text-[var(--color-primary)] hover:text-blue-800 dark:hover:text-[var(--color-primary)]/80"
                                            >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                                    )}
                                </div>
                            </div>
                        )}
                        {(searchTerm || statusFilter !== "all") && (
                            <button
                                onClick={() => {
                                    setSearchTerm("")
                                    setStatusFilter("all")
                                }}
                                className="mt-2 text-sm text-blue-600 dark:text-[var(--color-primary)] hover:underline"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white dark:bg-[var(--color-card)] shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">{viewMode === "grid" ? renderGridView() : renderTableView()}</div>
                </div>
            </div>

            {/* Modals */}
            <CompanyDetail />
        </div>
    )
}
