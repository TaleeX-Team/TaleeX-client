import { useMutation } from "@tanstack/react-query"
import { shareJobOnLinkedIn } from "@/services/apiAuth.js"
import { toast } from "sonner"
import {acceptJobInvitation} from "@/services/apiCompanies.js";

export function useShareJob() {
    const { mutateAsync: shareOnLinkedIn, isPending: isSharing } = useMutation({
        mutationFn: shareJobOnLinkedIn,
        onSuccess: (data) => {
            // Open the LinkedIn share URL in a new window
            if (data && data.job) {
                window.open(data.job, "_blank")
                toast.success("Job shared on LinkedIn successfully")
            }
        },
        onError: (error) => {
            toast.error(error.message || "Failed to share job on LinkedIn")
        },
    })

    return {
        shareOnLinkedIn,
        isSharing,
    }
}

export const useAcceptJobInvitation = () => {
    return useMutation({
        mutationFn: acceptJobInvitation,
    });
};