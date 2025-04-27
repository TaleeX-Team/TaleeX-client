import {useMutation} from '@tanstack/react-query';
import {changePassword} from "@/services/apiAuth.js";
import {toast} from 'sonner';

export function useChangePassword() {

    return useMutation({
        mutationFn: (passwordData) => changePassword(passwordData),
        onSuccess: () => {
            toast.success("Your password has been updated.")
            ;
            return true;
        },
        onError: (error) => {
            toast.error(error.message || "An unexpected error occurred.");
            return false;
        },
    });
}