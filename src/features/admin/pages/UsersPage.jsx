"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, UserPlus, Clock, Trash2, UserCircle, X, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import gsap from "gsap"
import { useUsers, useDeleteUser, usePromoteUser } from "@/hooks/userQueries.js"
import UserProfileDialog from "@/components/admin/UserProfileDialog.jsx"
import LoadingDialog from "@/features/admin/pages/component/LoadingDialog.jsx"

const UsersPage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeFilters, setActiveFilters] = useState([])
  const [deletePassword, setDeletePassword] = useState("")
  const [profileViewOpen, setProfileViewOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  // Track which users are currently being operated on
  const [actionInProgressMap, setActionInProgressMap] = useState({})
  const [loadingDialogOpen, setLoadingDialogOpen] = useState(false)
  const [loadingDialogConfig, setLoadingDialogConfig] = useState({
    title: "Processing...",
    description: "Please wait while we process your request.",
  })

  const tableRef = useRef(null)
  const cardRef = useRef(null)
  const headerRef = useRef(null)

  // Use the React Query hooks
  const { data: users = [], isLoading, error, refetch } = useUsers()

  const deleteUserMutation = useDeleteUser()
  const promoteUserMutation = usePromoteUser()

  // Update action in progress map when mutations are running
  useEffect(() => {
    if (selectedUser && deleteUserMutation.isPending) {
      setActionInProgressMap((prev) => ({
        ...prev,
        [`delete-${selectedUser.id}`]: true,
      }))
    } else if (selectedUser && !deleteUserMutation.isPending) {
      setActionInProgressMap((prev) => {
        const updated = { ...prev }
        delete updated[`delete-${selectedUser.id}`]
        return updated
      })
    }
  }, [deleteUserMutation.isPending, selectedUser])

  // GSAP animations
  useEffect(() => {
    if (!isLoading) {
      // Animate card entry
      gsap.fromTo(cardRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })

      // Animate header elements
      gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
            delay: 0.2,
          },
      )

      // Animate table rows
      if (tableRef.current) {
        const rows = tableRef.current.querySelectorAll("tbody tr")
        gsap.fromTo(
            rows,
            { opacity: 0, x: -20 },
            {
              opacity: 1,
              x: 0,
              duration: 0.4,
              stagger: 0.05,
              ease: "power1.out",
              delay: 0.4,
            },
        )
      }
    }
  }, [isLoading])

  // Update active filters for better UX
  useEffect(() => {
    const newFilters = []

    if (roleFilter !== "all") {
      newFilters.push({ type: "role", value: roleFilter })
    }

    if (statusFilter !== "all") {
      newFilters.push({ type: "status", value: statusFilter })
    }

    if (searchQuery) {
      newFilters.push({ type: "search", value: searchQuery })
    }

    setActiveFilters(newFilters)
  }, [roleFilter, statusFilter, searchQuery])

  // If there's an error fetching users, show a toast
  useEffect(() => {
    if (error) {
      toast.error(`Failed :${error.message}`)
    }
  }, [error])

  const filteredUsers = users?.users?.filter((user) => {
    // Search filter (search by name, email, or id)
    const matchesSearch =
        !searchQuery ||
        (user.firstName && user.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.lastName && user.lastName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.id && user.id.toLowerCase().includes(searchQuery.toLowerCase()))

    // Role filter
    const matchesRole = roleFilter === "all" || (user.role && user.role.toLowerCase() === roleFilter.toLowerCase())

    // Status filter (assuming status field exists, if not we'd need to adapt this)
    const matchesStatus = statusFilter === "all" || (user.status && user.status === statusFilter)

    return matchesSearch && matchesRole && matchesStatus
  })

  const handleAddUser = () => {
    gsap.to(".add-user-btn", {
      scale: 0.95,
      duration: 0.1,
      onComplete: () => {
        gsap.to(".add-user-btn", {
          scale: 1,
          duration: 0.2,
        })
      },
    })
    toast.success("This feature would open a user creation modal", {
      description: "You can customize the user creation form here.",
      position: "top-center",
    })
  }

  const handleDeleteUser = (user) => {
    // Show loading dialog for delete operation
    setLoadingDialogConfig({
      title: "Deleting User",
      description: `Deleting ${user.firstName} ${user.lastName}. This may take a moment.`,
    })
    setLoadingDialogOpen(true)

    // Mark this user as having delete in progress
    setActionInProgressMap((prev) => ({
      ...prev,
      [`delete-${user.id}`]: true,
    }))

    // Set the selected user
    setSelectedUser(user)

    // Directly delete the user without waiting for state update
    deleteUserMutation.mutate(
        { userId: user.id },
        {
          onSuccess: () => {
            // Close loading dialog
            setLoadingDialogOpen(false)

            toast.success(`User ${user.firstName} ${user.lastName} deleted successfully`)
            // Remove the action in progress
            setActionInProgressMap((prev) => {
              const updated = { ...prev }
              delete updated[`delete-${user.id}`]
              return updated
            })
            setSelectedUser(null)
          },
          onError: (error) => {
            // Close loading dialog
            setLoadingDialogOpen(false)

            toast.error(`Failed: ${error.message}`)
            // Remove the action in progress on error as well
            setActionInProgressMap((prev) => {
              const updated = { ...prev }
              delete updated[`delete-${user.id}`]
              return updated
            })
          },
        },
    )
  }

  // Remove or comment out the confirmDelete function since we're no longer using it
  // const confirmDelete = () => {
  //   if (!selectedUser) return
  //   ...
  // }

  // Also update the handlePromoteUser function to follow the same pattern
  const handlePromoteUser = (user) => {
    // Show loading dialog for promote operation
    setLoadingDialogConfig({
      title: "Promoting User",
      description: `Promoting ${user.firstName} ${user.lastName}. This may take a moment.`,
    })
    setLoadingDialogOpen(true)

    // Mark this user as having promote in progress
    setActionInProgressMap((prev) => ({
      ...prev,
      [`promote-${user.id}`]: true,
    }))

    // Set the selected user
    setSelectedUser(user)

    promoteUserMutation.mutate(user.id, {
      onSuccess: () => {
        // Close loading dialog
        setLoadingDialogOpen(false)

        toast.success(`User ${user.firstName} ${user.lastName} promoted successfully`)
        // Remove the action in progress
        setActionInProgressMap((prev) => {
          const updated = { ...prev }
          delete updated[`promote-${user.id}`]
          return updated
        })
      },
      onError: (error) => {
        // Close loading dialog
        setLoadingDialogOpen(false)

        toast.error(`Failed: ${error.message}`)
        // Remove the action in progress on error
        setActionInProgressMap((prev) => {
          const updated = { ...prev }
          delete updated[`promote-${user.id}`]
          return updated
        })
      },
    })
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setEditDialogOpen(true)
    toast.info(`Edit user: ${user.firstName} ${user.lastName}`, {
      description: `User ID: ${user.id}`,
    })
  }

  const handleViewProfile = (user) => {
    setSelectedUser(user)
    setProfileViewOpen(true)
    toast.info(`View profile: ${user.firstName} ${user.lastName}`, {
      description: `User ID: ${user.id}`,
    })
  }

  const handleClearFilters = () => {
    // Animate filter clearing
    gsap.to(".filter-badge", {
      scale: 0.5,
      opacity: 0,
      stagger: 0.05,
      duration: 0.2,
      onComplete: () => {
        setSearchQuery("")
        setRoleFilter("all")
        setStatusFilter("all")
      },
    })
  }

  const removeFilter = (type) => {
    // Animate the specific filter removal
    gsap.to(`#filter-${type}`, {
      scale: 0.5,
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        if (type === "search") setSearchQuery("")
        if (type === "role") setRoleFilter("all")
        if (type === "status") setStatusFilter("all")
      },
    })
  }

  const getStatusStyles = (status) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
      case "inactive":
        return "bg-slate-500/10 text-slate-600 dark:text-slate-400 hover:bg-slate-500/20"
      case "pending":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400 hover:bg-gray-500/20"
    }
  }

  // Helper function to get a user's full name
  const getUserFullName = (user) => {
    return `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown User"
  }

  // Helper function to get user initials for avatar fallback
  const getUserInitials = (user) => {
    return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "??"
  }

  // Function to get user status (we may need to derive this from other fields if it doesn't exist)
  const getUserStatus = (user) => {
    // If there's a status field, use it
    if (user.status) return user.status

    // Otherwise derive status from other fields
    // This is just an example, adjust according to your data structure
    if (user.isVerified) return "active"
    if (user.lastLoginDate) return "inactive"
    return "pending"
  }

  // Format the last active date
  const formatLastActive = (dateString) => {
    if (!dateString) return "Never"

    try {
      const date = new Date(dateString)
      // Check if date is valid
      if (isNaN(date.getTime())) return "Invalid date"

      // Format the date
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    } catch (error) {
      return "Unknown"
    }
  }

  // Check if a specific action is in progress for a user
  const isActionInProgress = (userId, actionType) => {
    return !!actionInProgressMap[`${actionType}-${userId}`]
  }

  return (
      <>
        <Card className="border border-border shadow-lg transition-all duration-200 hover:shadow-md" ref={cardRef}>
          <CardHeader className="pb-4" ref={headerRef}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Users
                </CardTitle>
                <CardDescription className="mt-1 text-muted-foreground">
                  Manage your platform users and their access permissions
                </CardDescription>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                        onClick={handleAddUser}
                        className="add-user-btn transition-all hover:shadow-md relative overflow-hidden group"
                    >
                      <span className="absolute inset-0 bg-primary/10 transform scale-0 group-hover:scale-100 transition-transform duration-300 rounded-md"></span>
                      <UserPlus className="mr-2 h-4 w-4" /> Add User
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-popover text-popover-foreground">
                    <p>Add a new user to the platform</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Filters */}
            <div className="bg-muted/50 p-4 rounded-lg border border-border transition-all duration-300 hover:border-border/80">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                  <Input
                      placeholder="Search by name, email or ID..."
                      className="pl-9 bg-background border-border focus-visible:ring-primary transition-all duration-200"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-full sm:w-40 bg-background border-border transition-all duration-200">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
                      <SelectGroup>
                        <SelectLabel className="text-muted-foreground">Filter by role</SelectLabel>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="recruiter">Recruiter</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="candidate">Candidate</SelectItem>
                        <SelectItem value="employer">Employer</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-40 bg-background border-border transition-all duration-200">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
                      <SelectGroup>
                        <SelectLabel className="text-muted-foreground">Filter by status</SelectLabel>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleClearFilters}
                            className="bg-background border-border hover:bg-accent transition-colors duration-200"
                            disabled={activeFilters.length === 0}
                        >
                          <Filter className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-popover text-popover-foreground">
                        <p>Clear all filters</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {activeFilters.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    {activeFilters.map((filter) => (
                        <Badge
                            key={filter.type}
                            id={`filter-${filter.type}`}
                            variant="secondary"
                            className="filter-badge flex items-center gap-1 px-2 py-1 bg-muted hover:bg-muted/80 transition-all"
                        >
                          <span className="capitalize">{filter.type}:</span> {filter.value}
                          <button
                              onClick={() => removeFilter(filter.type)}
                              className="ml-1 rounded-full hover:bg-muted-foreground/20 p-1"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                    ))}
                    {filteredUsers?.length > 0 && (
                        <span className="text-sm text-muted-foreground ml-2">
                    Showing {filteredUsers.length} of {users?.users?.length || 0} users
                  </span>
                    )}
                  </div>
              )}
            </div>

            {/* Users table */}
            <div className="border border-border rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-sm" ref={tableRef}>
                  <thead>
                  <tr className="bg-muted/70 border-b border-border">
                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">User</th>
                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">Role</th>
                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">Status</th>
                    <th className="px-6 py-4 text-left font-medium text-muted-foreground">Last Active</th>
                    <th className="px-6 py-4 text-right font-medium text-muted-foreground">Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {isLoading ? (
                      Array(5)
                          .fill(0)
                          .map((_, index) => (
                              <tr key={index} className="border-b border-border">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <Skeleton className="h-10 w-10 rounded-full bg-muted" />
                                    <div className="space-y-2">
                                      <Skeleton className="h-4 w-32 bg-muted" />
                                      <Skeleton className="h-3 w-24 bg-muted" />
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <Skeleton className="h-4 w-16 bg-muted" />
                                </td>
                                <td className="px-6 py-4">
                                  <Skeleton className="h-6 w-16 rounded-full bg-muted" />
                                </td>
                                <td className="px-6 py-4">
                                  <Skeleton className="h-4 w-24 bg-muted" />
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <Skeleton className="h-8 w-8 rounded-full bg-muted ml-auto" />
                                </td>
                              </tr>
                          ))
                  ) : filteredUsers?.length > 0 ? (
                      filteredUsers.map((user) => (
                          <tr
                              key={user.id}
                              className={`border-b border-border hover:bg-accent/30 transition-colors duration-200 ${
                                  isActionInProgress(user.id, "delete") ? "opacity-60" : ""
                              }`}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border border-border ring-2 ring-background transition-all duration-300 hover:ring-primary/20">
                                  <AvatarImage src={user.imageUrl || user.socialLoginAvatar} alt={getUserFullName(user)} />
                                  <AvatarFallback className="bg-muted text-primary font-medium">
                                    {getUserInitials(user)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-foreground hover:text-primary transition-colors duration-200">
                                    {getUserFullName(user)}
                                  </div>
                                  <div className="text-xs text-muted-foreground">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <span className="font-medium text-foreground">{user.role || "User"}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Badge
                                  variant="outline"
                                  className={`${getStatusStyles(
                                      getUserStatus(user),
                                  )} font-medium capitalize border-none transition-all duration-200`}
                              >
                                {getUserStatus(user)}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1 inline-block" />
                                {formatLastActive(user.lastLoginDate)}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 rounded-full hover:bg-accent transition-colors duration-200"
                                      disabled={isActionInProgress(user.id, "delete")}
                                  >
                                    <span className="sr-only">Open menu</span>
                                    <svg
                                        width="15"
                                        height="15"
                                        viewBox="0 0 15 15"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                    >
                                      <path
                                          d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                                          fill="currentColor"
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                      ></path>
                                    </svg>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-48 bg-popover border-border shadow-lg animate-in slide-in-from-top-5 fade-in-80"
                                >
                                  <DropdownMenuLabel className="text-foreground">User Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator className="bg-border" />
                                  <DropdownMenuItem
                                      onClick={() => handleViewProfile(user)}
                                      className="focus:bg-accent focus:text-accent-foreground transition-colors duration-200 cursor-pointer"
                                  >
                                    <UserCircle className="h-4 w-4 mr-2" />
                                    View profile
                                  </DropdownMenuItem>

                                  <DropdownMenuItem
                                      onClick={() => handlePromoteUser(user)}
                                      className="focus:bg-accent focus:text-accent-foreground transition-colors duration-200 cursor-pointer"
                                      disabled={isActionInProgress(user.id, "promote")}
                                  >
                                    {isActionInProgress(user.id, "promote") ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 mr-2"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                          <polyline points="9 11 12 14 22 4"></polyline>
                                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                                        </svg>
                                    )}
                                    Promote user
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="bg-border" />
                                  <DropdownMenuItem
                                      onClick={() => handleDeleteUser(user)}
                                      className="text-destructive focus:text-destructive focus:bg-destructive/10 transition-colors duration-200 cursor-pointer"
                                      disabled={isActionInProgress(user.id, "delete")}
                                  >
                                    {isActionInProgress(user.id, "delete") ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <Trash2 className="h-4 w-4 mr-2" />
                                    )}
                                    Delete user
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                      ))
                  ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                          <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="relative">
                              <Search className="h-10 w-10 text-muted" />
                              <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-primary/30 animate-ping"></span>
                            </div>
                            <div>
                              <p className="text-lg font-medium text-foreground">No users found</p>
                              <p className="text-sm">Try adjusting your search or filter criteria</p>
                            </div>
                            <Button
                                variant="outline"
                                onClick={handleClearFilters}
                                className="mt-2 transition-all duration-200 hover:border-primary/30"
                            >
                              Clear filters
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => refetch()}
                                className="transition-all duration-200 hover:border-primary/30"
                            >
                              Refresh data
                            </Button>
                          </div>
                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fixed: Use userId instead of user object */}
        {selectedUser && (
            <UserProfileDialog
                userId={selectedUser.id} // Pass userId instead of user object
                isOpen={profileViewOpen}
                onClose={() => setProfileViewOpen(false)}
                onEdit={(user) => {
                  setProfileViewOpen(false)
                  handleEditUser(user)
                }}
            />
        )}
        {/* Add the loading dialog */}
        <LoadingDialog
            isOpen={loadingDialogOpen}
            title={loadingDialogConfig.title}
            description={loadingDialogConfig.description}
        />
      </>
  )
}

export default UsersPage
