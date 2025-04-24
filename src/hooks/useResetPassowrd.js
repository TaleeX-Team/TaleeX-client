import { useMutation } from "@tanstack/react-query";
import { resetPassword as resetPasswordAPI } from "@/services/apiAuth";

export const useResetPassword = () => {
    const mutation = useMutation({
        mutationFn: resetPasswordAPI,
        onError: (err) => {
            console.error("Reset password error:", err.message);
        },
        onSuccess: (data) => {
            console.log("Password reset successfully:", data);
        },
    });

    return {
        // trigger the reset:
        triggerResetPassword: mutation.mutate,
        // status flags:
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
        isSuccess: mutation.isSuccess,
        data: mutation.data,
    };
};