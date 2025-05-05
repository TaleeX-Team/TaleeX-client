import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    promoteUser,
    getAllCompanies, verifyCompany, filterCompanies, getCompanyStatistics, deleteAdminUser,

} from '../services/apiAuth.js';

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


export const useCompanies = () => {
    return useQuery({
        queryKey: ['companies'],
        queryFn: getAllCompanies,
    });
};

// Hook for verifying/rejecting a company
export const useVerifyCompany = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: verifyCompany,
        onSuccess: () => {
            // Invalidate and refetch companies data after verification
            queryClient.invalidateQueries({ queryKey: ['companies'] });
            queryClient.invalidateQueries({ queryKey: ['companyStatistics'] });
        },
    });
};

// Hook for filtering companies
export const useFilterCompanies = (filters = {}, options = {}) => {
    const {
        enabled = true,
        keepPreviousData = true,
        staleTime = 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus = false,
        ...queryOptions
    } = options

    return useQuery({
        queryKey: ["filteredCompanies", filters],
        queryFn: () => filterCompanies(filters),
        enabled,
        keepPreviousData,
        staleTime,
        refetchOnWindowFocus,
        ...queryOptions,
    })
}

// Hook for fetching company statistics
export const useCompanyStatistics = () => {
    return useQuery({
        queryKey: ["companyStatistics"],
        queryFn: getCompanyStatistics,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}

// Example custom hook that combines filtering with pagination
export const usePaginatedCompanies = (filters = {}, page = 1, pageSize = 10) => {
    // Merge pagination with other filters
    const paginatedFilters = {
        ...filters,
        page,
        pageSize,
    };

    return useFilterCompanies(paginatedFilters);
};