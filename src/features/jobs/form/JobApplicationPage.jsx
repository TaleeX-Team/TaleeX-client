"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  CheckCircle2,
  Flag,
  Shield,
  AlertTriangle,
  Building,
  Calendar,
  MapPin,
  Brain,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "react-router-dom";
import { useJobApplication } from "@/hooks/useJobApplication.js";
import { JobDetails } from "@/features/jobs/form/components/JobDetails.jsx";
import { ApplicationForm } from "@/features/jobs/form/components/ApplicationForm.jsx";
import { ReportJobDialog } from "@/features/jobs/form/components/ReportJobDialog.jsx";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import FormAndInterviewHeader from "@/features/interview-appform-header/Header";

export default function JobApplicationPage() {
  const { id } = useParams();
  const {
    jobData,
    isLoading,
    isError,
    error,
    submitApplication,
    isSubmitting,
    isSubmitSuccess,
  } = useJobApplication(id);

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error?.response?.data?.message
              : "Failed to load job details"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Format job posted date
  const formatOpenTime = (openTime) => {
    if (openTime.days > 0) {
      return `${openTime.days} day${openTime.days > 1 ? "s" : ""} ago`;
    } else if (openTime.hours > 0) {
      return `${openTime.hours} hour${openTime.hours > 1 ? "s" : ""} ago`;
    } else {
      return `${openTime.minutes} minute${openTime.minutes > 1 ? "s" : ""} ago`;
    }
  };

  // Helper for verification status badge
  const getVerificationBadge = () => {
    const status = jobData?.company?.verification?.status;

    if (status === "verified") {
      return (
        <Badge
          variant="outline"
          className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 flex items-center gap-1"
        >
          <Shield className="h-3 w-3" />
          Verified Company
        </Badge>
      );
    } else if (status === "pending") {
      return (
        <Badge
          variant="outline"
          className="bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800 flex items-center gap-1"
        >
          <AlertTriangle className="h-3 w-3" />
          Pending Verification
        </Badge>
      );
    }

    return null;
  };

  // Create a reference to trigger the dialog
  const handleOpenReportDialog = () => {
    document.querySelector("[data-report-trigger]")?.click();
  };

  return (
    <>
      <FormAndInterviewHeader />
      <div className="container max-w-4xl mx-auto py-8 px-4">
        {isSubmitSuccess && (
          <Alert className="mb-6 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertTitle className="text-green-800 dark:text-green-400">
              Application Submitted
            </AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-300">
              Your application has been successfully submitted. The company will
              contact you if they're interested.
            </AlertDescription>
          </Alert>
        )}

        {/* Only show form if job status is open */}
        {jobData.status !== "open" && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Job Not Available</AlertTitle>
            <AlertDescription>
              This job is not currently accepting applications.
            </AlertDescription>
          </Alert>
        )}

        {/* Show warning for pending jobs */}
        {jobData?.company?.verification?.status === "pending" && (
          <Alert className="my-6 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-600/30">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
            <AlertTitle className="text-amber-800 dark:text-amber-400">
              Company Pending Review
            </AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-300">
              This company's profile has not yet been verified by Taleex. We
              recommend researching the company before submitting your
              application. If anything appears suspicious, please use the report
              feature to notify our team.
            </AlertDescription>
          </Alert>
        )}

        {/* Display detailed job info */}
        <JobDetails job={jobData} />

        {jobData.status === "open" && (
          <>
            <Separator className="my-8" />
            <ApplicationForm
              jobId={id}
              onSubmit={submitApplication}
              isSubmitting={isSubmitting}
            />
          </>
        )}

        <p className="text-xs text-muted-foreground text-center mt-6">
          This job is posted by Taleex on behalf of an external company. Please
          verify the company’s legitimacy before proceeding with your
          application.
        </p>

        {/* Place the report dialog trigger without wrapping it in a button */}
        {/* <div className="hidden">
        <ReportJobDialog
          jobId={id}
          defaultName=""
          defaultEmail=""
          data-report-trigger
        />
      </div> */}

        {/* Job Header Card with Report Button */}
        {/* <Card className="mb-6 overflow-hidden">
        <div className="bg-slate-50 dark:bg-slate-900 p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold">{jobData.title}</h1>
                <Badge
                  variant={jobData.status === "open" ? "success" : "secondary"}
                >
                  {jobData.status === "open" ? "Active" : "Closed"}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Building className="h-4 w-4" />
                <span className="font-medium">{jobData.company.name}</span>
                {getVerificationBadge()}
              </div>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <ReportJobDialog
                      jobId={id}
                      defaultName=""
                      defaultEmail=""
                    />
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Report this job if it seems suspicious or inappropriate</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-slate-500 dark:text-slate-400" />
              <span>{jobData.company.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              <span>Posted on {formatOpenTime(jobData.openTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              <span>{jobData.experienceLevel}</span>
            </div>
          </div>

          Job safety banner
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md border border-blue-200 dark:border-blue-800 mt-4">
            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <span className="font-medium">Safety Notice:</span> If this job
                appears suspicious, please use the{" "}
                <Flag className="h-3 w-3 inline mx-1" /> Report button. Never
                send money or share financial details.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="ml-0 sm:ml-auto mt-2 sm:mt-0 bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/50"
              onClick={handleOpenReportDialog}
            >
              <Flag className="h-4 w-4 mr-2" />
              Report
            </Button>
          </div>
        </CardContent>
      </Card> */}
      </div>
    </>
  );
}
