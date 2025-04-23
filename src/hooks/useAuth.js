// useAuth.js - Updated version
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser, logoutUser, registerUser, TokenService } from "../services/apiAuth.js";

export const useAuth = () => {
  const queryClient = useQueryClient();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Update user data in React Query cache
      queryClient.setQueryData(["currentUser"], data.user);
    },
    onError: (error) => {
      console.error("Login failed:", error.message);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => {
      const refreshToken = TokenService.getRefreshToken();
      return logoutUser(refreshToken);
    },
    onSuccess: () => {
      queryClient.removeQueries(["currentUser"], { exact: true });
    },
    onError: (error) => {
      console.error("Logout failed:", error.message);
      // Still clear React Query cache even if server logout fails
      queryClient.removeQueries(["currentUser"], { exact: true });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      console.log("Registration successful:", data.message);
      // If registration returns user data, set it
      if (data.user) {
        queryClient.setQueryData(["currentUser"], data.user);
      }
    },
    onError: (error) => {
      console.error("Registration failed:", error.message);
    },
  });

  // Get current user
  const user = queryClient.getQueryData(["currentUser"]);

  // Check if user is authenticated
  const isAuthenticated = !!TokenService.getAccessToken();

  return {
    user,
    isAuthenticated,
    login: {
      mutate: loginMutation.mutate,
      isLoading: loginMutation.isPending,
      isError: loginMutation.isError,
      error: loginMutation.error
    },
    logout: {
      mutate: logoutMutation.mutate,
      isLoading: logoutMutation.isPending,
      isError: logoutMutation.isError,
      error: logoutMutation.error
    },
    register: {
      mutate: registerMutation.mutate,
      isLoading: registerMutation.isPending,
      isError: registerMutation.isError,
      error: registerMutation.error
    }
  };
};