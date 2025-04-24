import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/services/apiAuth";

export const useResetPassword = () => {
    const mutation = useMutation({
        mutationFn: ({ token, password }) => resetPassword({ token, password }),
        onError: (err) => {
            console.error("Reset password error:", err.message);
        },
    });

    return {
        resetPassword: mutation.mutate,
        isLoading: mutation.isLoading,
        isError: mutation.isError,
        error: mutation.error,
    };
};