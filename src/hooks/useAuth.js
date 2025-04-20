import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser, logoutUser } from "../services/apiAuth";

export const useAuth = () => {
  const queryClient = useQueryClient();

  // Login mutation
  const login = useMutation({
    mutationFn: loginUser, // Ensure this is a valid function
    onSuccess: (data) => {
      // Save token to localStorage
      localStorage.setItem("token", data.token);

      // Save the logged-in user directly into the cache
      queryClient.setQueryData(["currentUser"], data.user);
    },
    onError: (error) => {
      console.error("Login failed:", error.message);
    },
  });

  // Logout mutation
  const logout = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      // Remove token from localStorage
      localStorage.removeItem("token");

      // Clear the current user cache
      queryClient.removeQueries(["currentUser"], { exact: true });
    },
    onError: (error) => {
      console.error("Logout failed:", error.message);
    },
  });

  // Get the current user from the cache
  const user = queryClient.getQueryData("currentUser");

  return {
    user,
    login,
    logout,
  };
};
