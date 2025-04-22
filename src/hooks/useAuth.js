import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser, logoutUser, registerUser, refreshUserToken } from "../services/apiAuth";
import { useState, useEffect, useCallback } from "react";
import {jwtDecode} from "jwt-decode"; // You'll need this package for token expiry checking

export const useAuth = () => {
  const queryClient = useQueryClient();
  const [tokenExpiry, setTokenExpiry] = useState(null);

  // Function to store tokens securely
  const storeTokens = useCallback((accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    // Calculate token expiry (assuming JWT)
    try {
      const decoded = jwtDecode(accessToken);
      if (decoded.exp) {
        setTokenExpiry(decoded.exp * 1000); // Convert to milliseconds
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);

  // Function to check if token needs refresh
  const shouldRefreshToken = useCallback(() => {
    if (!tokenExpiry) return false;

    // Refresh when less than 5 minutes remaining (300,000 ms)
    const fiveMinutes = 5 * 60 * 1000;
    return Date.now() + fiveMinutes > tokenExpiry;
  }, [tokenExpiry]);

  // Token refresh mutation
  const refreshTokenMutation = useMutation({
    mutationFn: () => {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token available");
      return refreshUserToken(refreshToken);
    },
    onSuccess: (data) => {
      storeTokens(data.accessToken, data.refreshToken || localStorage.getItem("refreshToken"));
      // Update auth header for subsequent requests
      updateAuthHeader(data.accessToken);
    },
    onError: (error) => {
      console.error("Token refresh failed:", error);
      // Force logout on refresh failure
      clearAuthData();
    },
  });

  // Function to clear auth data on logout
  const clearAuthData = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    queryClient.removeQueries(["currentUser"], { exact: true });
    setTokenExpiry(null);
    // Remove auth header
    updateAuthHeader(null);
  }, [queryClient]);

  // Update Authorization header for API requests
  const updateAuthHeader = useCallback((token) => {
    // You'll need to implement this in your API client
    // For example:
    // axiosInstance.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : '';
  }, []);

  // Auto refresh token when needed
  useEffect(() => {
    if (shouldRefreshToken()) {
      refreshTokenMutation.mutate();
    }

    // Set up interval to check token expiry
    const checkInterval = setInterval(() => {
      if (shouldRefreshToken()) {
        refreshTokenMutation.mutate();
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkInterval);
  }, [shouldRefreshToken, refreshTokenMutation]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Store tokens
      storeTokens(data.accessToken, data.refreshToken);

      // Update auth header
      updateAuthHeader(data.accessToken);

      // Update user data in React Query cache
      queryClient.setQueryData(["currentUser"], data.user);
    },
    onError: (error) => {
      console.error("Login failed:", error.message);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: logoutUser,
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
    },
    refreshToken: refreshTokenMutation.mutate
  };
};