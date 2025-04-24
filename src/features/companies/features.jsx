import { createCompany, getCompanies } from "@/services/apiCompanies";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCompanies = () => {
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
  //   const companies2 = useQuery({
  //     queryKey: ["companies"],
  //     queryFn: getCompanies,
  //     onSuccess: (data) => {
  //       console.log("Companies fetched successfully:", data);
  //     },
  //   });

  return {
    createCompanyMutation: {
      mutate: createCompanyMutation.mutate,
      isLoading: createCompanyMutation.isLoading,
      isError: createCompanyMutation.isError,
      error: createCompanyMutation.error,
    },
  };
};
