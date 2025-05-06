import {
  createCompany,
  deleteCompany,
  getCompanies,
  requestDomainVerification,
  confirmDomainVerification,
  requestVerification,
} from "@/services/apiCompanies";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {toast}  from "sonner";

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
      toast.error(error.response?.data?.message)
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
          companies: [...oldData.companies, newCompany],
        };
      });

      // Optionally invalidate the query to trigger a refresh in the background
      queryClient.invalidateQueries({ queryKey: ["companies"] });

      console.log("Company created successfully:", newCompany);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message)
    },
  });

  // Function to delete a company
  const deleteCompanyMutation = useMutation({
    mutationFn: deleteCompany,
    onSuccess: (deletedCompany) => {
      // Update companies data in React Query cache
      queryClient.setQueryData(["companies"], (oldData) => {
        if (!oldData || !oldData.companies) {
          return { companies: [] };
        }

        // Filter out the deleted company from the existing companies array
        return {
          ...oldData,
          companies: oldData.companies.filter(
            (company) => company._id !== deletedCompany._id
          ),
        };
      });
      // Optionally invalidate the query to trigger a refresh in the background
      queryClient.invalidateQueries({ queryKey: ["companies"] });

      console.log("Company deleted successfully:", deletedCompany);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message)
    },
  });

  // Mutation to request domain verification
  const requestDomainVerificationMutation = useMutation({
    mutationFn: ({ companyId, data }) =>
      requestDomainVerification(companyId, data),
    onSuccess: (response, variables) => {
      console.log(
        `Verification code requested successfully for company ID: ${variables.companyId}`,
        response
      );

      // Update the company's verification status in the cache if needed
      queryClient.setQueryData(["companies"], (oldData) => {
        if (!oldData || !oldData.companies) return oldData;

        return {
          ...oldData,
          companies: oldData.companies.map((company) => {
            if (company._id === variables.companyId) {
              return {
                ...company,
                domainVerificationRequested: true,
                // Add any other fields that might be updated in the response
              };
            }
            return company;
          }),
        };
      });

      // Optionally invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
    onError: (error, variables) => {
      toast.error(error.response?.data?.message)

    },
  });

  // Mutation to confirm domain verification
  const confirmDomainVerificationMutation = useMutation({
    mutationFn: ({ companyId, data }) =>
      confirmDomainVerification(companyId, data),
    onSuccess: (response, variables) => {
      console.log(
        `Domain verification confirmed successfully for company ID: ${variables.companyId}`,
        response
      );

      // Update the company's verification status in the cache
      queryClient.setQueryData(["companies"], (oldData) => {
        if (!oldData || !oldData.companies) return oldData;

        return {
          ...oldData,
          companies: oldData.companies.map((company) => {
            if (company._id === variables.companyId) {
              return {
                ...company,
                domainVerified: true,
                // Add any other fields that might be updated in the response
              };
            }
            return company;
          }),
        };
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
    onError: (error, variables) => {
      toast.error(error.response?.data?.message)

    },
  });
  const requestVerificationMutation = useMutation({
    mutationFn: ({ companyId, document }) =>
      requestVerification(companyId, document),
    onSuccess: (response, variables) => {
      console.log(
        `Verification requested successfully for company ID: ${variables.companyId}`,
        response
      );

      // Update the company's verification status in the cache if needed
      queryClient.setQueryData(["companies"], (oldData) => {
        if (!oldData || !oldData.companies) return oldData;

        return {
          ...oldData,
          companies: oldData.companies.map((company) => {
            if (company._id === variables.companyId) {
              return {
                ...company,
                verificationRequested: true,
                // Add any other fields that might be updated in the response
              };
            }
            return company;
          }),
        };
      });

      // Optionally invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
    onError: (error, variables) => {
      console.error(
        `Failed to request verification for company ID: ${variables.companyId}`,
        error.response.data.message
      );
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
    deleteCompanyMutation: {
      mutate: deleteCompanyMutation.mutate,
      isLoading: deleteCompanyMutation.isPending,
      isError: deleteCompanyMutation.isError,
      error: deleteCompanyMutation.error,
    },
    requestDomainVerificationMutation: {
      mutate: requestDomainVerificationMutation.mutate,
      isLoading: requestDomainVerificationMutation.isPending,
      isError: requestDomainVerificationMutation.isError,
      error: requestDomainVerificationMutation.error,
      isSuccess: requestDomainVerificationMutation.isSuccess,
    },
    confirmDomainVerificationMutation: {
      mutate: confirmDomainVerificationMutation.mutate,
      isLoading: confirmDomainVerificationMutation.isPending,
      isError: confirmDomainVerificationMutation.isError,
      error: confirmDomainVerificationMutation.error,
      isSuccess: confirmDomainVerificationMutation.isSuccess,
    },
    requestVerificationMutation: {
      mutate: requestVerificationMutation.mutate,
      isLoading: requestVerificationMutation.isPending,
      isError: requestVerificationMutation.isError,
      error: requestVerificationMutation.error,
      isSuccess: requestVerificationMutation.isSuccess,
    },
  };
};
