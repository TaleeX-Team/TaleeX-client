import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/services/apiAuth";

export const useForgotPassword = () => {
    const mutation = useMutation({
        mutationFn: (email) => forgotPassword({ email }),
        onError: (err) => {
            console.error("Forgot password error:", err.message);
        },
    });

    return {
        sendReset: mutation.mutate,
        isLoading: mutation.isLoading,
        isError: mutation.isError,
        error: mutation.error,
    };
};
