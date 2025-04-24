// useAuth.js - Updated for hybrid authentication
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loginUser, logoutUser, registerUser } from "../services/apiAuth.js";
import TokenService from "@/lib/TokenService";

export const useAuth = () => {
  const queryClient = useQueryClient();

    const authQuery = useQuery({
    queryKey: ["auth"],
    queryFn: () => {
      return {
        isAuthenticated: TokenService.isAuthenticated(),
      };
    },
    staleTime: 0,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Set tokens if they exist in response
      if (data.accessToken) {
        TokenService.setAccessToken(data.accessToken);
      }
      if (data.refreshToken) {
        TokenService.setRefreshToken(data.refreshToken);
      }

      // Update user data in React Query cache
      if (data.user) {
        queryClient.setQueryData(["currentUser"], data.user);
      } else {
        // If no user data was returned, fetch it
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      }

      // Invalidate auth status
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: (error) => {
      console.error("Login failed:", error.message);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => {
      // For token-based auth, send the refresh token
      // For OAuth, just call the endpoint with credentials
      const refreshToken = TokenService.getRefreshToken();
      return logoutUser(refreshToken);
    },
    onSuccess: () => {
      // Clear all auth state
      TokenService.clearTokens();
      TokenService.setOAuthAuthenticated(false);
      queryClient.removeQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: (error) => {
      console.error("Logout failed:", error.message);
      // Still clear local state even if server logout fails
      TokenService.clearTokens();
      TokenService.setOAuthAuthenticated(false);
      queryClient.removeQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
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
      // If registration includes tokens (some flows do this)
      if (data.accessToken) {
        TokenService.setAccessToken(data.accessToken);
        queryClient.invalidateQueries({ queryKey: ["auth"] });
      }
    },
    onError: (error) => {
      console.error("Registration failed:", error.message);
    },
  });

  return {
    isAuthenticated: authQuery.data?.isAuthenticated || false,
    isLoading: authQuery.isLoading || loginMutation.isPending || logoutMutation.isPending || registerMutation.isPending,
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