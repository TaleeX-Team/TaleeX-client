import {useMutation} from '@tanstack/react-query';
import {toast} from 'sonner';
import {sendVerificationEmail} from "@/services/apiAuth.js";

export function useVerificationEmail() {

    return useMutation({
        mutationFn: (email) => sendVerificationEmail(email),
        onSuccess: (data) => {
            toast.success("Please check your inbox for the verification link.");
            return data;
        },
        onError: (error) => {
            toast.error(error.message || "An unexpected error occurred.");
        },
    });
}