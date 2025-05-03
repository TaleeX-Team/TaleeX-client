"use client"
import { useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { useJobs } from "@/features/jobs/useJobs.js"
import JobsHeaderWithFilters from "@/features/jobs/jobheaderandfilter.jsx"
import JobCard from "@/features/jobs/form/components/JobCard.jsx"

export default function JobsPage() {
    // Use the useJobs hook with initial empty filters
    const { jobsQuery, filteredJobsQuery, setFilter } = useJobs()

    // Function to handle filter changes from the JobsHeaderWithFilters component
    const handleFilterChange = (newFilters) => {
        setFilter(newFilters)
    }

    // Determine which data to use based on which query has data
    const isFiltering = filteredJobsQuery.data !== undefined
    const activeQuery = isFiltering ? filteredJobsQuery : jobsQuery
    const { data: jobData, isLoading, isError } = activeQuery

    return (
        <div className="p-6">
            <JobsHeaderWithFilters onFilterChange={handleFilterChange} />

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                        <JobCardSkeleton key={index} />
                    ))}
                </div>
            ) : isError ? (
                <div className="p-8 text-center">
                    <p className="text-red-500">Failed to load jobs. Please try again later.</p>
                </div>
            ) : jobData?.jobs?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobData.jobs.map((job) => (
                        <JobCard key={job._id} job={job} />
                    ))}
                </div>
            ) : (
                <div className="p-8 text-center">
                    <p className="text-muted-foreground">No jobs found for the selected filters.</p>
                </div>
            )}
        </div>
    )
}

function JobCardSkeleton() {
    return (
        <div className="border rounded-lg overflow-hidden">
            <div className="p-4">
                <div className="flex items-start gap-3">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                    <Skeleton className="h-5 w-16 rounded-full" />
                </div>
            </div>

            <div className="px-4 py-2">
                <div className="grid grid-cols-2 gap-y-2">
                    {[...Array(4)].map((_, index) => (
                        <Skeleton key={index} className="h-4 w-24" />
                    ))}
                </div>
            </div>

            <div className="px-4 py-3 border-t flex justify-between items-center">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
            </div>
        </div>
    )
}