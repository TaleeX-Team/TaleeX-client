import { createCompany, getCompanies } from "@/services/apiCompanies";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCompanies = () => {
  // Get QueryClient instance from the context
  const queryClient = useQueryClient();

  // Query to fetch companies
  const companyData = useQuery({
    queryKey: ["companies"],
    queryFn: getCompanies,
    staleTime: 5 * 60 * 1000, // Prevent refetching for 5 minutes
    refetchOnWindowFocus: false, // Disable refetching on window focus
    onSuccess: (data) => {
      console.log("Companies fetched successfully:", data);
    },
    onError: (error) => {
      console.error("Fetching companies failed:", error.message);
    },
    retry: false, // Retry once on failure
  });

  // Mutation to create a new company
  const createCompanyMutation = useMutation({
    mutationFn: createCompany,
    onSuccess: (newCompany) => {
      // Update companies data in React Query cache
      queryClient.setQueryData(["companies"], (oldData) => {
        // Handle case where oldData might be null or undefined
        if (!oldData || !oldData.companies) {
          return { companies: [newCompany] };
        }

        // Add the new company to the existing companies array
        return {
          ...oldData,
          companies: [...oldData.companies, newCompany]
        };
      });

      // Optionally invalidate the query to trigger a refresh in the background
      queryClient.invalidateQueries({ queryKey: ["companies"] });

      console.log("Company created successfully:", newCompany);
    },
    onError: (error) => {
      console.error("Creating company failed:", error.message);
    },
  });

  return {
    createCompanyMutation: {
      mutate: createCompanyMutation.mutate,
      isLoading: createCompanyMutation.isPending,
      isError: createCompanyMutation.isError,
      error: createCompanyMutation.error,
    },
    companyData,
  };
};