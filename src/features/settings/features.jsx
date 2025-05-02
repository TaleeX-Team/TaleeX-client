import { updateUser } from "@/services/apiAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useProfile = () => {
  const queryClient = useQueryClient();

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (newUser) => {
      // Update companies data in React Query cache
      console.log("User updated successfully:", newUser);
      queryClient.setQueryData(["user"], (oldData) => {
        // Handle case where oldData might be null or undefined
        if (!oldData || !oldData.user) {
          return { user: newUser };
        }
        localStorage.setItem("react-query-user", JSON.stringify(newUser));
        // Update the existing user data with the new user data
        return {
          ...oldData,
          user: { ...oldData.user, ...newUser },
        };
      });

      // Optionally invalidate the query to trigger a refresh in the background
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.error("User updated successfully:", error.message);
    },
  });
  return {
    updateUserMutation: {
      mutate: updateUserMutation.mutate,
      isLoading: updateUserMutation.isPending,
      isError: updateUserMutation.isError,
      error: updateUserMutation.error,
      isSuccess: updateUserMutation.isSuccess,
    },
  };
};
