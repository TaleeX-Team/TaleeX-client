import { Skeleton } from "@/components/ui/skeleton";
import { useJobs } from "@/features/jobs/useJobs.js";
import { useTranslation } from 'react-i18next';
import JobsHeaderWithFilters from "@/features/jobs/jobheaderandfilter.jsx";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, AlertTriangle, FileX } from "lucide-react";
import JobCard from "@/features/jobs/form/components/JobCard.jsx";
import { useUser } from "@/hooks/useUser.js";
import React from "react";
import { toast } from "sonner";
import VerifyLayout from "@/components/ui/VerifyLayout";
import LanguageToggle from "@/togglingButton";

export default function JobsPage() {
  const { t ,i18n } = useTranslation();
  const { jobsQuery, filteredJobsQuery, setFilter, clearFilters, hasFilters } =
    useJobs();
  const { data: user } = useUser();

  const handleFilterChange = (newFilters) => {
    setFilter(newFilters);
  };

  const isLoading = hasFilters
    ? filteredJobsQuery.isLoading
    : jobsQuery.isLoading;
  const isError = hasFilters ? filteredJobsQuery.isError : jobsQuery.isError;
  const jobData = hasFilters ? filteredJobsQuery.data : jobsQuery.data;

  // Function to render content based on verification status, loading, and errors
  const renderContent = () => {
    // Check user verification status
    if (!user?.isVerified) {
      return <VerifyLayout />;
    }

    // Loading state
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, index) => (
            <JobCardSkeleton key={index} />
          ))}
        </div>
      );
    }
    // console.log(i18n.language);

    // Error state
    if (isError) {
      return (
        <div className="flex flex-col items-center bg-destructive/5 rounded-lg border border-dashed border-destructive/20 z-50 pt-9 pb-6">
          <div className="mx-auto w-17 h-17 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertCircle className="h-9 w-9 text-destructive" />
          </div>
          <h3 className="text-xl font-semibold text-destructive mb-2">
          {t('jobs.error.title')}
          </h3>
          <p className="text-muted-foreground mb-8 max-w-xs">
          {t('jobs.error.message')}
          </p>
          <Button variant="outline" className="mx-auto">
          {t('common.retry')}
          </Button>
        </div>
      );
    }

    // Jobs content - either showing jobs or empty state
    return jobData?.jobs?.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobData.jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50">
        <FileX className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
        {t('jobs.empty.title')}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
        {t('jobs.empty.message')}
        </p>
        {hasFilters && (
          <Button variant="outline" onClick={clearFilters} className="mt-2">
            {t('jobs.empty.clearFilters')}
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="bg-background p-4 md:p-8 min-h-screen">
      <div className="mx-auto max-w-7xl">
      <LanguageToggle></LanguageToggle>

        {/* Always show the header regardless of verification status */}
        <JobsHeaderWithFilters
          onFilterChange={handleFilterChange}
          clearFilters={clearFilters}
          isDisabled={!user?.isVerified}
        />

        {/* Jobs Content */}
        <div className="mt-8">{renderContent()}</div>
      </div>
    </div>
  );
}

// Enhanced skeleton component for better loading states
function JobCardSkeleton() {
  return (
    <Card
      className="overflow-hidden flex flex-col relative border border-border/60 shadow-sm bg-gradient-to-b from-background to-muted/30">
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="shimmer-effect"></div>
      </div>
      <CardHeader className="pb-1">
        <div className="flex items-start gap-4">
          {/* <Skeleton className="h-12 w-12 rounded-md flex-shrink-0" /> */}

          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Skeleton className="h-5 w-3/5" />
              <Skeleton className="h-6 w-10 rounded-full flex-shrink-0" />
              <Skeleton className="h-6 w-10 rounded-full flex-shrink-0" />
            </div>
            <Skeleton className="h-4 w-1/3" />
          </div>

          <Skeleton className="h-6 w-10 rounded-full flex-shrink-0" />
        </div>

      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-4/4" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="flex flex-wrap gap-2">
          {[...Array(3)].map((_, index) => (
            <Skeleton
              key={index}
              className="h-6 w-13 rounded-full"
            />
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-3 border-t flex justify-between items-center">
        <div className="flex items-center">
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-22 rounded-md" />
          <Skeleton className="h-6 w-28 rounded-md" />
        </div>

      </CardFooter>
      <style jsx>{`
        .shimmer-effect {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.08),
            transparent
          );
          animation: shimmer 2s infinite;
          transform: skewX(-20deg);
        }
        
        @keyframes shimmer {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }
      `}</style>
     
    </Card>
    
  );
}