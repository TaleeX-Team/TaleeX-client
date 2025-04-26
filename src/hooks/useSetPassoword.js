import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';
import {setPassword} from "@/services/apiAuth.js";

export function useSetPassword() {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newPassword) => setPassword(newPassword),
        onSuccess: (data) => {
            toast.success("Your account is now secured with a password.");

            // Invalidate and refetch user data to update hasPassword status
            queryClient.invalidateQueries({queryKey: ['user']});

            return data;
        },
        onError: (error) => {
            toast.error( error.message || "An unexpected error occurred.");
        },
    });
}