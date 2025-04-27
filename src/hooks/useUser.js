// hooks/useUser.js
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

export const useUser = () => {
    const { isAuthenticated } = useAuth();
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ["user"],
        queryFn: () => {
            const cached = queryClient.getQueryData(["user"]);
            if (cached) return cached;

            const stored = localStorage.getItem("react-query-user");
            return stored ? JSON.parse(stored) : null;
        },
        enabled: isAuthenticated,
        staleTime: 1000 * 60 * 5,
        onSuccess: (data) => {
            if (data) {
                localStorage.setItem("react-query-user", JSON.stringify(data));
            }
        }
    });
};