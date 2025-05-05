import {  useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { JobDetails } from "@/features/jobs/form/components/JobDetails.jsx";
import {useAcceptJobInvitation} from "@/hooks/useShareJob.js";
import {useJobApplication} from "@/hooks/useJobApplication.js";

export const InviteJob = () => {
    const { applicationId, newJobId } = useParams(); // Get params from route
    const queryClient = useQueryClient();

    // Assuming useJob hook fetches job details
    const { jobData, isLoading, isError, error,  } = useJobApplication(newJobId)

    const acceptMutation = useAcceptJobInvitation();


    const handleAccept = () => {
        acceptMutation.mutate(
            { applicationId, newJobId },
            {
                onSuccess: () => {
                    toast.success("Invitation accepted successfully!");
                    queryClient.invalidateQueries(["job", jobData?._id]);
                },
                onError: (error) => {
                    toast.error(`Failed to accept invitation: ${error.message}`);
                },
            }
        );
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center text-red-600">
                Failed to load job details: {error.message}
            </div>
        );
    }

    const isInvitationProcessed = jobData?.invitationStatus === "accepted" || jobData?.invitationStatus === "rejected";

    return (
        <div className="container mx-auto py-8 space-y-6">
            <JobDetails job={jobData} />
            <Card>
                <CardHeader>
                    <CardTitle>Manage Invitation</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <Button
                            onClick={handleAccept}
                            disabled={isInvitationProcessed || acceptMutation.isPending }
                            className="bg-primary hover:bg-primary/90"
                        >
                            {acceptMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Accepting...
                                </>
                            ) : (
                                "Accept Invitation"
                            )}
                        </Button>
                        <Button
                            onClick={() => {}}
                            variant="destructive"
                            disabled={isInvitationProcessed || acceptMutation.isPending }
                        >

                                "Reject Invitation"
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};