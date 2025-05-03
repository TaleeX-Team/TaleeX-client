"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useJobs } from "@/features/jobs/useJobs.js";
import JobsHeaderWithFilters from "@/features/jobs/jobheaderandfilter.jsx";
import JobCard from "@/features/jobs/form/components/JobCard.jsx";

export default function JobsPage() {
    const { jobsQuery, filteredJobsQuery, setFilter, clearFilters, hasFilters } = useJobs();

    const handleFilterChange = (newFilters) => {
        setFilter(newFilters);
    };

    const isLoading = hasFilters ? filteredJobsQuery.isLoading : jobsQuery.isLoading;
    const isError = hasFilters ? filteredJobsQuery.isError : jobsQuery.isError;
    const jobData = hasFilters ? filteredJobsQuery.data : jobsQuery.data;

    return (
        <>
            <JobsHeaderWithFilters onFilterChange={handleFilterChange}  clearFilters={clearFilters}/>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 mx-4">
                {isLoading ? (
                    <div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, index) => (
                            <JobCardSkeleton key={index} />
                        ))}
                    </div>
                ) : isError ? (
                    <div className="col-span-full text-center p-8 bg-red-50 rounded-lg border border-red-200">
                        Failed to load jobs. Please try again later.
                    </div>
                ) : jobData?.jobs?.length > 0 ? (
                    jobData.jobs.map((job) => <JobCard key={job.id} job={job} />)
                ) : (
                    <div className="col-span-full text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                        No jobs found for the selected filters.
                    </div>
                )}
            </div>
        </>
    );
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
    );
}