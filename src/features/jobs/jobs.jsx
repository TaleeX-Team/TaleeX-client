import { Skeleton } from "@/components/ui/skeleton";
import { useJobs } from "@/features/jobs/useJobs.js";
import JobsHeaderWithFilters from "@/features/jobs/jobheaderandfilter.jsx";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {AlertCircle, AlertTriangle, FileX} from "lucide-react";
import JobCard from "@/features/jobs/form/components/JobCard.jsx";
import {useUser} from "@/hooks/useUser.js";
import React from "react";


export default function JobsPage() {
    const { jobsQuery, filteredJobsQuery, setFilter, clearFilters, hasFilters } = useJobs();
    const { data: user } = useUser();

    const handleFilterChange = (newFilters) => {
        setFilter(newFilters);
    };

    const isLoading = hasFilters ? filteredJobsQuery.isLoading : jobsQuery.isLoading;
    const isError = hasFilters ? filteredJobsQuery.isError : jobsQuery.isError;
    const jobData = hasFilters ? filteredJobsQuery.data : jobsQuery.data;

    // Function to render content based on verification status, loading, and errors
    const renderContent = () => {
        // Check user verification status
        if (!user?.isVerified) {
            return (
                <div className="flex flex-col items-center justify-center py-12 px-8 text-center bg-amber-50/50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl shadow-sm">
                    <Alert variant="warning" className="max-w-2xl mb-6 bg-amber-50 dark:bg-amber-900/40 border-amber-300 dark:border-amber-700">
                        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                        <AlertTitle className="text-amber-800 dark:text-amber-300 text-lg font-medium">Account verification required</AlertTitle>
                        <AlertDescription className="text-amber-700 dark:text-amber-400">
                            Your account needs to be verified to access the full job management features.
                            Verification helps us maintain security and provide you with all available functionality.
                        </AlertDescription>
                    </Alert>

                    <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-800/40 flex items-center justify-center mb-6 border-2 border-amber-300 dark:border-amber-700">
                        <AlertTriangle className="h-10 w-10 text-amber-600 dark:text-amber-500" />
                    </div>

                    <h3 className="text-2xl font-semibold mb-3 text-amber-800 dark:text-amber-300">
                        Limited Access
                    </h3>
                    <p className="text-amber-700 dark:text-amber-400 max-w-md mb-6">
                        You can browse the basic information, but you'll need to verify your account to manage job listings.
                    </p>
                    <Button className="bg-amber-600 hover:bg-amber-700 text-white border border-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600 dark:border-amber-600">
                        Verify Account
                    </Button>
                </div>
            );
        }

        // Loading state
        if (isLoading) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                        <JobCardSkeleton key={index} />
                    ))}
                </div>
            );
        }

        // Error state
        if (isError) {
            return (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
                        <AlertCircle className="h-10 w-10 text-destructive" />
                    </div>
                    <h3 className="text-xl font-semibold text-destructive mb-3">
                        Error loading jobs
                    </h3>
                    <p className="text-muted-foreground max-w-md mb-6">
                        There was an error fetching job listings. Please try again or contact support.
                    </p>
                    <Button variant="outline">
                        Retry
                    </Button>
                </div>
            );
        }

        // Jobs content - either showing jobs or empty state
        return jobData?.jobs?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobData.jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                <FileX className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No jobs found</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
                    No jobs match your current filter criteria
                </p>
                {hasFilters && (
                    <Button variant="outline" onClick={clearFilters} className="mt-2">
                        Clear all filters
                    </Button>
                )}
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-6 max-w-7xl">
            {/* Always show the header regardless of verification status */}
            <JobsHeaderWithFilters
                onFilterChange={handleFilterChange}
                clearFilters={clearFilters}
                isDisabled={!user?.isVerified}
            />

            {/* Jobs Content */}
            <div className="mt-8">
                {renderContent()}
            </div>
        </div>
    );
}

// Enhanced skeleton component for better loading states
function JobCardSkeleton() {
    return (
        <Card className="overflow-hidden h-full transition-all hover:shadow-md dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                    <Skeleton className="h-12 w-12 rounded-md flex-shrink-0 dark:bg-gray-700" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-4/5 dark:bg-gray-700" />
                        <Skeleton className="h-4 w-2/3 dark:bg-gray-700" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full flex-shrink-0 dark:bg-gray-700" />
                </div>
            </CardHeader>
            <CardContent className="pb-4">
                <div className="flex flex-wrap gap-2 mb-4">
                    {[...Array(3)].map((_, index) => (
                        <Skeleton key={index} className="h-6 w-16 rounded-full dark:bg-gray-700" />
                    ))}
                </div>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                    {[...Array(4)].map((_, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4 rounded-full dark:bg-gray-700" />
                            <Skeleton className="h-4 flex-1 dark:bg-gray-700" />
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="pt-3 border-t dark:border-gray-700 flex justify-between items-center">
                <Skeleton className="h-4 w-24 dark:bg-gray-700" />
                <Skeleton className="h-9 w-28 rounded-md dark:bg-gray-700" />
            </CardFooter>
        </Card>
    );
}