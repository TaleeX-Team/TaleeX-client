import { useQuery, useMutation, useQueryClient } from "react-query";
import { loginUser, fetchCurrentUser, logoutUser } from "../services/apiAuth";

export const useAuth = () => {
  const queryClient = useQueryClient();

  // Fetch current user
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery("currentUser", fetchCurrentUser, {
    enabled: !!localStorage.getItem("token"), // Only fetch if token exists
  })

  // Login mutation
  const login = useMutation(loginUser, {
    onSuccess: (data) => {
      // Save token to localStorage
      localStorage.setItem("token", data.token);

      // Refetch the current user
      queryClient.invalidateQueries("currentUser");
    },
  })

  // Logout mutation
  const logout = useMutation(logoutUser, {
    onSuccess: () => {
      // Remove token from localStorage
      localStorage.removeItem("token");

      // Clear the current user cache
      queryClient.removeQueries("currentUser");
    },
  })

  return {
    user,
    isLoading,
    isError,
    login,
    logout,
  };
};
