import { createCompany, getCompanies } from "@/services/apiCompanies";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCompanies = () => {
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

  const createCompanyMutation = useMutation({
    mutationFn: createCompany,
    onSuccess: (data) => {
      // Update user data in React Query cache
      // queryClient.setQueryData(["companies"], (oldData) => {
      //     return [...oldData, data];
      // });
      console.log("Company created successfully:", data);
    },
    onError: (error) => {
      console.error("Creating company failed:", error.message);
    },
  });

  return {
    createCompanyMutation: {
      mutate: createCompanyMutation.mutate,
      isLoading: createCompanyMutation.isLoading,
      isError: createCompanyMutation.isError,
      error: createCompanyMutation.error,
    },
    companyData,
  };
};
