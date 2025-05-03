import { useQuery } from "@tanstack/react-query";
import { getNonRejectedCompanies } from "@/services/apiCompanies";

export const useNonRejectedCompanies = () => {
    return useQuery({
        queryKey: ["nonRejectedCompanies"],
        queryFn: async () => {
            const response = await getNonRejectedCompanies();
            return response.companies || []; // Fallback to empty array if companies is missing
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
        retry: 2,
        onError: (error) => {
            console.error("Error fetching non-rejected companies:", error.message);
        },
    });
};