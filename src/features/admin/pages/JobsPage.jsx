"use client";

import { useMemo } from "react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Filter,
  Briefcase,
  CalendarDays,
  MapPin,
  Users,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminJobs, useAdminFilteredJobs } from "@/hooks/useAdminJob.js";
import { formatOpenTime } from "@/lib/utils.js";
import JobDetailsDialog from "@/features/admin/pages/component/JobDetailsDialog";

const JobsPage = () => {
  // State for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [activeFilters, setActiveFilters] = useState([]);

  // Filter parameters for API
  const [filterParams, setFilterParams] = useState({});

  // State for job details dialog
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // Refs for animations
  const tableRef = useRef(null);
  const cardRef = useRef(null);
  const headerRef = useRef(null);

  // Fetch jobs data
  const {
    data: jobsData,
    isLoading: isLoadingJobs,
    isError: isJobsError,
    error: jobsError,
  } = useAdminJobs();

  // Fetch filtered jobs when filter params change
  const {
    data: filteredJobsData,
    isLoading: isLoadingFiltered,
    isError: isFilteredError,
    error: filteredError,
  } = useAdminFilteredJobs(filterParams);

  // Determine which jobs data to use
  const hasFilterParams = Object.keys(filterParams).length > 0;
  const isLoading = hasFilterParams ? isLoadingFiltered : isLoadingJobs;
  const isError = hasFilterParams ? isFilteredError : isJobsError;
  const error = hasFilterParams ? filteredError : jobsError;

  // Safely extract jobs array
  const jobsArray = useMemo(() => {
    if (hasFilterParams && filteredJobsData) {
      return filteredJobsData.jobs || [];
    }
    return jobsData && jobsData.jobs ? jobsData.jobs : [];
  }, [hasFilterParams, filteredJobsData, jobsData]);

  // Get total count for display
  const totalCount = useMemo(() => {
    if (hasFilterParams && filteredJobsData) {
      return filteredJobsData.count || 0;
    }
    return jobsData && jobsData.count ? jobsData.count : 0;
  }, [hasFilterParams, filteredJobsData, jobsData]);

  // Log errors for debugging
  useEffect(() => {
    if (isError && error) {
      console.error("Error fetching jobs:", error);
    }
  }, [isError, error]);

  // Update filter params when UI filters change
  useEffect(() => {
    const newFilters = {};

    if (searchQuery) {
      newFilters.title = searchQuery;
    }

    if (statusFilter !== "all") {
      newFilters.status = statusFilter;
    }

    if (typeFilter !== "all") {
      newFilters.jobType = typeFilter;
    }

    setFilterParams(newFilters);
  }, [searchQuery, statusFilter, typeFilter]);

  // Update active filters for UI
  useEffect(() => {
    const newFilters = [];

    if (typeFilter !== "all") {
      newFilters.push({ type: "type", value: typeFilter });
    }

    if (statusFilter !== "all") {
      newFilters.push({ type: "status", value: statusFilter });
    }

    if (searchQuery) {
      newFilters.push({ type: "search", value: searchQuery });
    }

    setActiveFilters(newFilters);
  }, [typeFilter, statusFilter, searchQuery]);

  // Fixed GSAP animations - safely check refs before using them
  useEffect(() => {
    if (!isLoading && jobsArray && jobsArray.length > 0) {
      // Only run animations if refs are set
      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
        );
      }

      // Safely animate header elements if they exist
      if (headerRef.current && headerRef.current.children) {
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
          }
        );
      }

      // Safely animate table rows if they exist
      if (tableRef.current) {
        const rows = tableRef.current.querySelectorAll("tbody tr");
        if (rows.length > 0) {
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
            }
          );
        }
      }
    }
  }, [isLoading, jobsArray]);

  const handleCreateJob = () => {
    gsap.to(".create-job-btn", {
      scale: 0.95,
      duration: 0.1,
      onComplete: () => {
        gsap.to(".create-job-btn", {
          scale: 1,
          duration: 0.2,
        });
      },
    });
    toast.success("Create Job", {
      description: "This would open a job creation form modal.",
      position: "top-center",
    });
  };

  const handleDeleteJob = (job) => {
    toast.success(`Delete job: ${job.title}`, {
      description: `This would delete job ID: ${job._id}`,
    });
  };

  const handleOpenJobDetails = (job) => {
    // Set the selected job and open the dialog
    setSelectedJob(job);
    setIsDetailsDialogOpen(true);
  };

  const handleCloseJobDetails = () => {
    setIsDetailsDialogOpen(false);
    // Optional: Clear the selected job when dialog closes
    // setSelectedJob(null)
  };

  const handleAction = (action, job) => {
    if (action === "Delete") {
      handleDeleteJob(job);
    } else if (action === "View details") {
      handleOpenJobDetails(job);
    } else {
      toast.success(`${action} job: ${job.title}`, {
        description: `Action performed on job ID: ${job._id}`,
      });
    }
  };

  const handleClearFilters = () => {
    // Safely animate filter clearing
    const filterElements = document.querySelectorAll(".filter-badge");
    if (filterElements.length > 0) {
      gsap.to(".filter-badge", {
        scale: 0.5,
        opacity: 0,
        stagger: 0.05,
        duration: 0.2,
        onComplete: () => {
          setSearchQuery("");
          setStatusFilter("all");
          setTypeFilter("all");
          // Clear filter params to go back to normal allJobsData
          setFilterParams({});
        },
      });
    } else {
      // If no elements found, just clear the filters
      setSearchQuery("");
      setStatusFilter("all");
      setTypeFilter("all");
      // Clear filter params to go back to normal allJobsData
      setFilterParams({});
    }
  };

  const removeFilter = (type) => {
    // Safely animate specific filter removal
    const filterElement = document.getElementById(`filter-${type}`);
    if (filterElement) {
      gsap.to(`#filter-${type}`, {
        scale: 0.5,
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
          if (type === "search") {
            setSearchQuery("");
            // Update filter params
            const { title, ...rest } = filterParams;
            setFilterParams(rest);
          }
          if (type === "status") {
            setStatusFilter("all");
            // Update filter params
            const { status, ...rest } = filterParams;
            setFilterParams(rest);
          }
          if (type === "type") {
            setTypeFilter("all");
            // Update filter params
            const { jobType, ...rest } = filterParams;
            setFilterParams(rest);
          }
        },
      });
    } else {
      // If element not found, just clear the specific filter
      if (type === "search") {
        setSearchQuery("");
        // Update filter params
        const { title, ...rest } = filterParams;
        setFilterParams(rest);
      }
      if (type === "status") {
        setStatusFilter("all");
        // Update filter params
        const { status, ...rest } = filterParams;
        setFilterParams(rest);
      }
      if (type === "type") {
        setTypeFilter("all");
        // Update filter params
        const { jobType, ...rest } = filterParams;
        setFilterParams(rest);
      }
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "open":
        return "bg-green-500/20 text-green-600 dark:text-green-400 hover:bg-green-500/30";
      case "closed":
        return "bg-gray-500/20 text-gray-600 dark:text-gray-400 hover:bg-gray-500/30";
      case "paused":
        return "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/30";
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400 hover:bg-gray-500/20";
    }
  };

  // Helper function to safely get company name
  const getCompanyName = (job) => {
    if (!job.company) return "Unknown Company";

    // If company is an object with a name property
    if (typeof job.company === "object" && job.company !== null) {
      return job.company.name || "Unnamed Company";
    }

    // If company is a string
    if (typeof job.company === "string") {
      return job.company;
    }

    return "Unknown Company";
  };

  return (
    <Card className="border border-border shadow-lg" ref={cardRef}>
      <CardHeader className="pb-4" ref={headerRef}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Jobs
            </CardTitle>
            <CardDescription className="mt-1 text-muted-foreground">
              View and manage your job listings
            </CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleCreateJob}
                  className="create-job-btn transition-all hover:shadow-md relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-primary/10 transform scale-0 group-hover:scale-100 transition-transform duration-300 rounded-md"></span>
                  <Plus className="mr-2 h-4 w-4" /> Create Job
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-popover text-popover-foreground">
                <p>Create a new job listing</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="bg-muted/50 p-4 rounded-lg border border-border transition-all duration-300 hover:border-border/80">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
              <Input
                placeholder="Search jobs or companies..."
                className="pl-9 bg-background border-border focus-visible:ring-primary transition-all duration-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40 bg-background border-border transition-all duration-200">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-40 bg-background border-border transition-all duration-200">
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="temporary">Temporary</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
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
                  <span className="capitalize">{filter.type}:</span>{" "}
                  {filter.value}
                  <button
                    onClick={() => removeFilter(filter.type)}
                    className="ml-1 rounded-full hover:bg-muted-foreground/20 p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {jobsArray && (
                <span className="text-sm text-muted-foreground ml-2">
                  Showing {jobsArray.length} of {totalCount} jobs
                </span>
              )}
            </div>
          )}
        </div>

        {/* Jobs table */}
        <div className="border border-border rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" ref={tableRef}>
              <thead>
                <tr className="bg-muted/70 border-b border-border">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Job Title
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Company
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Applicants
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Posted
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  // Loading shimmer effect - show 5 skeleton rows
                  Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <tr
                        key={`skeleton-${index}`}
                        className="border-b border-border"
                      >
                        <td className="px-4 py-3">
                          <Skeleton className="h-5 w-40 bg-muted animate-pulse" />
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton className="h-5 w-32 bg-muted animate-pulse" />
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton className="h-5 w-28 bg-muted animate-pulse" />
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton className="h-5 w-20 bg-muted animate-pulse" />
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton className="h-6 w-16 rounded-full bg-muted animate-pulse" />
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton className="h-5 w-10 bg-muted animate-pulse" />
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton className="h-5 w-20 bg-muted animate-pulse" />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Skeleton className="h-8 w-8 rounded-full bg-muted animate-pulse ml-auto" />
                        </td>
                      </tr>
                    ))
                ) : isError ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-10 text-center text-destructive"
                    >
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <p className="text-lg font-medium">
                          Error loading jobs
                        </p>
                        <p className="text-sm">
                          {error instanceof Error
                            ? `Error: ${error.response?.data?.message}`
                            : "There was a problem fetching the job data. Please try again."}
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => window.location.reload()}
                          className="mt-2 transition-all duration-200 hover:border-primary/30"
                        >
                          Refresh
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : jobsArray && jobsArray.length > 0 ? (
                  jobsArray.map((job) => (
                    <tr
                      key={
                        job._id ||
                        `job-${Math.random().toString(36).substr(2, 9)}`
                      }
                      className="border-b border-border hover:bg-accent/30 transition-colors duration-200"
                    >
                      <td className="px-4 py-3">
                        <div
                          className="font-medium hover:text-primary transition-colors duration-200 cursor-pointer"
                          onClick={() => handleOpenJobDetails(job)}
                        >
                          {job.title || "Untitled Job"}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center text-muted-foreground">
                          <Briefcase className="h-3 w-3 mr-2 inline-block" />
                          {getCompanyName(job)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-2 inline-block" />
                          {job.location || job.workPlaceType || "Not specified"}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className="font-normal bg-primary/5 hover:bg-primary/10 text-primary border-primary/20 transition-colors duration-200"
                        >
                          {job.jobType || "Not specified"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={`${getStatusStyles(
                            job.status
                          )} capitalize border-none transition-all duration-200`}
                        >
                          {job.status || "Unknown"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center text-muted-foreground">
                          <Users className="h-3 w-3 mr-2 inline-block" />
                          {job.applicants || 0}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center text-muted-foreground">
                          <CalendarDays className="h-3 w-3 mr-2 inline-block" />
                          {formatOpenTime(job.openTime)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full hover:bg-accent transition-colors duration-200"
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
                            <DropdownMenuLabel className="text-foreground">
                              Job Actions
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-border" />
                            <DropdownMenuItem
                              onClick={() => handleAction("View details", job)}
                              className="focus:bg-accent focus:text-accent-foreground transition-colors duration-200 cursor-pointer"
                            >
                              View details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleAction("Edit", job)}
                              className="focus:bg-accent focus:text-accent-foreground transition-colors duration-200 cursor-pointer"
                            >
                              Edit job
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleAction("View applicants for", job)
                              }
                              className="focus:bg-accent focus:text-accent-foreground transition-colors duration-200 cursor-pointer"
                            >
                              View applicants
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-border" />
                            <DropdownMenuItem
                              onClick={() => handleAction("Delete", job)}
                              className="text-destructive focus:text-destructive focus:bg-destructive/10 transition-colors duration-200 cursor-pointer"
                            >
                              Delete job
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-10 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="relative">
                          <Search className="h-10 w-10 text-muted" />
                          <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-primary/30 animate-ping"></span>
                        </div>
                        <div>
                          <p className="text-lg font-medium text-foreground">
                            No jobs found
                          </p>
                          <p className="text-sm">
                            Try adjusting your search or filter criteria
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={handleClearFilters}
                          className="mt-2 transition-all duration-200 hover:border-primary/30"
                        >
                          Clear filters
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Job Details Dialog */}
        {selectedJob && (
          <JobDetailsDialog
            job={selectedJob}
            isOpen={isDetailsDialogOpen}
            onClose={handleCloseJobDetails}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default JobsPage;
