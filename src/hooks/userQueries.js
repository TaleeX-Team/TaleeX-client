import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getUsers,
    getUserById,
    updateUser,
    promoteUser,
    getAllCompanies, verifyCompany, filterCompanies, getCompanyStatistics, deleteAdminUser,

} from '../services/apiAuth.js';
import {toast} from 'sonner'
// Hook for fetching all users
export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: getUsers,
    });
};

// Hook for fetching a specific user by ID
export const useUser = (userId) => {
    return useQuery({
        queryKey: ['users', userId],
        queryFn: () => getUserById(userId),
        enabled: !!userId, // Only run the query if userId exists
    });
};


// Hook for updating a user
export const useUserUpdate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateUser,
        onSuccess: (data, variables) => {
            // Invalidate and refetch the specific user query
            queryClient.invalidateQueries({ queryKey: ['users', variables.userId] });

            // Also update the users list
            queryClient.invalidateQueries({ queryKey: ['users'] });

            // If updating the current user, invalidate that query too
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });

            return data;
        },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteAdminUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};

// Hook for promoting a user
export const usePromoteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: promoteUser,
        onSuccess: (data, userId) => {
            // Invalidate and refetch the specific user query
            queryClient.invalidateQueries({ queryKey: ['users', userId] });

            // Also update the users list
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};


export const useCompanies = (options = {}) => {
    return useQuery({
        queryKey: ['companies'],
        queryFn: async () => {
            try {
                const data = await getAllCompanies();
                return data;
            } catch (error) {
                // Standardize error handling
                console.error("Failed to fetch companies:", error);
                throw new Error(error.response?.data?.message || "Failed to fetch companies");
            }
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
        ...options,
    });
};

/**
 * Hook for verifying/rejecting a company with toast notifications
 */
export const useVerifyCompany = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (verificationData) => {
            try {
                return await verifyCompany(verificationData);
            } catch (error) {
                console.error("Verification error:", error);
                throw new Error(error.response?.data?.message || "Failed to process verification");
            }
        },
        onSuccess: (data, variables) => {
            // Toast success message based on the verification action
            const action = variables.status === "verified" ? "verified" : "rejected";
            toast.success(`Company successfully ${action}`);

            // Invalidate and refetch companies data after verification
            queryClient.invalidateQueries({ queryKey: ['companies'] });
            queryClient.invalidateQueries({ queryKey: ['filteredCompanies'] });
            queryClient.invalidateQueries({ queryKey: ['companyStatistics'] });

            // Execute any custom success callback
            if (options.onSuccess) options.onSuccess(data, variables);
        },
        onError: (error, variables) => {
            // Toast error message
            toast.error(error.message || "An error occurred during verification");

            // Execute any custom error callback
            if (options.onError) options.onError(error, variables);
        },
        onSettled: (...args) => {
            // Execute any custom settled callback
            if (options.onSettled) options.onSettled(...args);
        },
    });
};

/**
 * Hook for filtering companies with debounce support
 */
export const useFilterCompanies = (filters = {}, options = {}) => {
    const {
        enabled = true,
        keepPreviousData = true,
        staleTime = 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus = false,
        ...queryOptions
    } = options;

    return useQuery({
        queryKey: ["filteredCompanies", filters],
        queryFn: async () => {
            try {
                return await filterCompanies(filters);
            } catch (error) {
                console.error("Filter error:", error);
                throw new Error(error.response?.data?.message);
            }
        },
        enabled,
        keepPreviousData,
        staleTime,
        refetchOnWindowFocus,
        ...queryOptions,
    });
};

/**
 * Hook for fetching company statistics with error handling
 */
export const useCompanyStatistics = (options = {}) => {
    return useQuery({
        queryKey: ["companyStatistics"],
        queryFn: async () => {
            try {
                return await getCompanyStatistics();
            } catch (error) {
                console.error("Statistics error:", error);
                throw new Error(error.response?.data?.message );
            }
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
        ...options,
    });
};

/**
 * Hook for paginated companies with better error handling
 */
export const usePaginatedCompanies = (filters = {}, page = 1, pageSize = 10, options = {}) => {
    // Merge pagination with other filters
    const paginatedFilters = {
        ...filters,
        page,
        pageSize,
    };

    return useFilterCompanies(paginatedFilters, {
        onError: (error) => {
            toast.error(`Failed to load companies: ${error.message}`);
            if (options.onError) options.onError(error);
        },
        ...options,
    });
};
