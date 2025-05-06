import { adminApiClient } from "@/services/apiAuth.js";
import { useQuery } from "@tanstack/react-query";
import {toast} from "sonner"
// Mock data for initial state to prevent UI issues when data is loading
const INITIAL_JOBS_DATA = [];

export const useAdminJobs = () => {
    return useQuery({
        queryKey: ["jobs"],
        queryFn: async () => {
            try {
                const response = await adminApiClient.get("/jobs");
                return response.data || INITIAL_JOBS_DATA;
            } catch (error) {
                console.error("Error fetching jobs:", error);
                toast.success(error?.response?.data?.message);
            }
        },
        placeholderData: INITIAL_JOBS_DATA, // Always provides initial data
        staleTime: 5 * 60 * 1000, // 5 minutes cache
        refetchOnWindowFocus: true,
        retry: 2,
    });
};


export const useAdminFilteredJobs = (filterParams = {}) => {
    // Remove undefined, empty values, and 'all' values from params
    const cleanParams = Object.fromEntries(
        Object.entries(filterParams).filter(
            ([_, value]) => value !== undefined && value !== "" && value !== "all"
        )
    );

    const hasFilters = Object.keys(cleanParams).length > 0;

    return useQuery({
        queryKey: ["jobs", "filter", cleanParams],
        queryFn: async () => {
            try {
                const response = await adminApiClient.get("/jobs/filter", {
                    params: cleanParams,
                });
                return response.data || INITIAL_JOBS_DATA;
            } catch (error) {
                console.error("Error fetching filtered jobs:", error);
                toast.success(error?.response?.data?.message);

            }
        },
        enabled: hasFilters, // Only run query if there are filter params
        placeholderData: INITIAL_JOBS_DATA,
        staleTime: 60 * 1000, // 1 minute
        keepPreviousData: true,
        retry: 1,
    });
};