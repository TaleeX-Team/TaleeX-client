import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import {useParams} from "react-router-dom";
import {useJobApplication} from "@/hooks/useJobApplication.js";
import {JobDetails} from "@/features/jobs/form/components/JobDetails.jsx";
import {ApplicationForm} from "@/features/jobs/form/components/ApplicationForm.jsx";

export default function JobApplicationPage() {
    const { id } = useParams()
    const { jobData, isLoading, isError, error, submitApplication, isSubmitting, isSubmitSuccess } = useJobApplication(id)

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
        )
    }

    if (isError) {
        return (
            <div className="container max-w-4xl mx-auto py-8 px-4">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error instanceof Error ? error.message : "Failed to load job details"}</AlertDescription>
                </Alert>
            </div>
        )
    }

    return (
        <div className="container max-w-4xl mx-auto py-8 px-4">
            {isSubmitSuccess && (
                <Alert className="mb-6 bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Application Submitted</AlertTitle>
                    <AlertDescription className="text-green-700">
                        Your application has been successfully submitted. The company will contact you if they're interested.
                    </AlertDescription>
                </Alert>
            )}

            {/* Display job and company details */}
            <JobDetails job={jobData} />

            {/* Show warning for pending jobs */}
            {jobData.company.verification.status === "pending" && (
                <Alert className="my-6 bg-amber-50 border-amber-200">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800">Job Pending Review</AlertTitle>
                    <AlertDescription className="text-amber-700">
                        This job posting is currently pending review. It's your responsibility to ensure you want to apply for this
                        position.
                    </AlertDescription>
                </Alert>
            )}

            {/* Only show form if job status is open */}
            {jobData.status === "open" ? (
                <ApplicationForm jobId={id } onSubmit={submitApplication} isSubmitting={isSubmitting} />
            ) : (
                <Alert className="my-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Job Not Available</AlertTitle>
                    <AlertDescription>This job is not currently accepting applications.</AlertDescription>
                </Alert>
            )}
        </div>
    )
}
