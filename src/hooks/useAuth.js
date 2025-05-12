import TokenService from "@/lib/TokenService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useEffect } from "react";
import {
  loginAdmin,
  loginUser,
  logoutUser,
  registerUser,
  verifyEmail,
} from "../services/apiAuth.js";

export const useAuth = () => {
  const queryClient = useQueryClient();

  // 1) Keep track of isAuthenticated by reading TokenService
  const authQuery = useQuery({
    queryKey: ["auth"],
    queryFn: () => ({
      isAuthenticated: TokenService.isAuthenticated(),
    }),
    // we'll manually invalidate whenever tokens change:
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  // Invalidate auth/user queries when tokens change
  useEffect(() => {
    const onChange = () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    };

    const origSetAccess = TokenService.setAccessToken.bind(TokenService);
    TokenService.setAccessToken = (token) => {
      origSetAccess(token);
      onChange();
    };
    const origSetRefresh = TokenService.setRefreshToken.bind(TokenService);
    TokenService.setRefreshToken = (token) => {
      origSetRefresh(token);
      onChange();
    };
    const origClear = TokenService.clearTokens.bind(TokenService);
    TokenService.clearTokens = () => {
      origClear();
      TokenService.setOAuthAuthenticated(false);
      onChange();
    };

    // Process any OAuth callback fragment on mount
    const didOAuth = TokenService.processOAuthCallback();
    if (didOAuth) {
      onChange();
      // navigate home once tokens are stored
      window.location.replace("/");
    }

    // cleanup if needed
    return () => {
      // optionally restore original methods
    };
  }, [queryClient]);

  // 2) Login user
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data.accessToken) {
        TokenService.setAccessToken(data.accessToken);
      }
      if (data.refreshToken) {
        TokenService.setRefreshToken(data.refreshToken);
      }
      if (data.user) {
        queryClient.setQueryData(["user"], data.user);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("hasPassword", data.user.hasPassword);

        Cookies.set("userId", data.user.id);
        Cookies.set("hasPassword", data.user.hasPassword);
      } else {
        queryClient.invalidateQueries({ queryKey: ["user"] });
      }
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });

  // 3) Login admin
  const loginAdminMutation = useMutation({
    mutationFn: loginAdmin,
    onSuccess: (data) => {
      if (data.accessToken) {
        TokenService.setAccessToken(data.accessToken);
      }
      if (data.refreshToken) {
        TokenService.setRefreshToken(data.refreshToken);
      }
      if (data.user) {
        queryClient.setQueryData(["user"], data.user);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("hasPassword", data.user.hasPassword);
        Cookies.set("userId", data.user.id);
        Cookies.set("hasPassword", data.user.hasPassword);
      } else {
        queryClient.invalidateQueries({ queryKey: ["user"] });
      }
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });

  // 4) Logout
  const logoutMutation = useMutation({
    mutationFn: () => logoutUser(TokenService.getRefreshToken()),
    onSuccess: () => {
      TokenService.clearTokens();
      queryClient.removeQueries({ queryKey: ["user"] });
      queryClient.removeQueries({ queryKey: ["userId"] });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      localStorage.setItem("userId");
      localStorage.setItem("hasPassword");
      Cookies.remove("hasPassword");
      Cookies.remove("userId");
    },
    onError: () => {
      TokenService.clearTokens();
      queryClient.removeQueries({ queryKey: ["user"] });
      localStorage.removeItem("userId");
      localStorage.removeItem("hasPassword");
    },
  });

  // 5) Register
  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      if (data.accessToken) {
        TokenService.setAccessToken(data.accessToken);
      }
      if (data.refreshToken) {
        TokenService.setRefreshToken(data.refreshToken);
      }
      if (data.user) {
        queryClient.setQueryData(["user"], data.user);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("hasPassword", data.user.hasPassword);
        Cookies.set("userId", data.user.id);
        Cookies.set("hasPassword", data.user.hasPassword);
      } else {
        queryClient.invalidateQueries({ queryKey: ["user"] });
      }
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });

  // 6) Verify Email
  const verifyEmailMutation = useMutation({
    mutationFn: verifyEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  return {
    isAuthenticated: authQuery.data?.isAuthenticated ?? false,
    login: {
      mutate: loginMutation.mutate,
      isLoading: loginMutation.isPending,
      isError: loginMutation.isError,
      error: loginMutation.error,
      isSuccess: loginMutation.isSuccess,
    },
    loginAdmin: {
      mutate: loginAdminMutation.mutate,
      isLoading: loginAdminMutation.isPending,
      isError: loginAdminMutation.isError,
      error: loginAdminMutation.error,
      isSuccess: loginAdminMutation.isSuccess,
    },
    logout: {
      mutate: logoutMutation.mutate,
      isLoading: logoutMutation.isPending,
      isError: logoutMutation.isError,
      error: logoutMutation.error,
    },
    register: {
      mutate: registerMutation.mutate,
      isLoading: registerMutation.isPending,
      isError: registerMutation.isError,
      error: registerMutation.error,
      isSuccess: registerMutation.isSuccess,
    },
    verifyEmail: {
      mutate: verifyEmailMutation.mutate,
      isLoading: verifyEmailMutation.isPending,
      isError: verifyEmailMutation.isError,
      error: verifyEmailMutation.error,
      isSuccess: verifyEmailMutation.isSuccess,
      data: verifyEmailMutation.data,
    },
  };
};
