import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser, logoutUser, registerUser } from "../services/apiAuth";
import { useCallback } from "react";

export const useAuth = () => {
  const queryClient = useQueryClient();

  // Function to store tokens securely
  const storeTokens = useCallback((accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }, []);

  // Function to clear auth data on logout
  const clearAuthData = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    queryClient.removeQueries(["currentUser"], { exact: true });
  }, [queryClient]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Store tokens
      storeTokens(data.accessToken, data.refreshToken);

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
      const refreshToken = localStorage.getItem("refreshToken");
      return logoutUser(refreshToken);
    },
    onSuccess: () => {
      clearAuthData();
    },
    onError: (error) => {
      console.error("Logout failed:", error.message);
      // Still clear local data even if server logout fails
      clearAuthData();
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      console.log("Registration successful:", data.message);
    },
    onError: (error) => {
      console.error("Registration failed:", error.message);
    },
  });

  // Get current user
  const user = queryClient.getQueryData(["currentUser"]);

  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem("accessToken");

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