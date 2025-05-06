import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  loginAdmin,
  loginUser,
  logoutUser,
  registerUser,
  verifyEmail,
} from "../services/apiAuth.js";
import { useEffect } from "react";
import TokenService from "@/lib/TokenService";
import Cookies from "js-cookie";

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

  useEffect(() => {
    const onChange = () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    };

    // patch TokenService to call onChange after set/clear
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
      onChange();
    };

    return () => {
      // restore if you want; skip for brevity
    };
  }, [queryClient]);

  // 2) Login
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
        Cookies.set("userId", data.user.id);
        Cookies.set("hasPassword", data.user.hasPassword);
      } else {
        queryClient.invalidateQueries({ queryKey: ["user"] });
      }
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
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
        Cookies.set("userId", data.user.id);
        Cookies.set("hasPassword", data.user.hasPassword);
      } else {
        queryClient.invalidateQueries({ queryKey: ["user"] });
      }
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
  // 3) Logout
  const logoutMutation = useMutation({
    mutationFn: () => logoutUser(TokenService.getRefreshToken()),
    onSuccess: () => {
      TokenService.clearTokens();
      TokenService.setOAuthAuthenticated(false);
      queryClient.removeQueries({ queryKey: ["user"] });
      queryClient.removeQueries({ queryKey: ["userId"] });
      localStorage.removeItem("userId");

      queryClient.invalidateQueries({ queryKey: ["auth"] });
      Cookies.remove("hasPassword");
      Cookies.remove("userId");
      Cookies.remove("hasPassword");
      Cookies.remove("userId");
    },
    onError: () => {
      // even on error, clear local
      TokenService.clearTokens();
      TokenService.setOAuthAuthenticated(false);
      queryClient.removeQueries({ queryKey: ["user"] });
      localStorage.removeItem("userId");
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  // 4) Register
  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      console.log(data, "Registered");
      console.log(data, "Registered");
      if (data.accessToken) {
        TokenService.setAccessToken(data.accessToken);
      }
      if (data.refreshToken) {
        TokenService.setRefreshToken(data.refreshToken);
      }
      if (data.user) {
        queryClient.setQueryData(["user"], data.user);
        Cookies.set("userId", data.user.id);
        Cookies.set("hasPassword", data.user.hasPassword);
      } else {
        queryClient.invalidateQueries({ queryKey: ["user"] });
      }
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });

  // 5) Verify Email
  const verifyEmailMutation = useMutation({
    mutationFn: verifyEmail,
    onSuccess: (data) => {
      // Update user data or auth state after verification
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  // 6) OAuth callback helper
  const processOAuthCallback = async () => {
    const ok = TokenService.processOAuthTokens();
    if (ok) {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["auth"] }),
        queryClient.invalidateQueries({ queryKey: ["user"] }),
      ]);
    }
    return ok;
  };

  return {
    isAuthenticated: authQuery.data?.isAuthenticated ?? false,
    loginAdmin: {
      mutate: loginAdminMutation.mutate,
      isLoading: loginAdminMutation.isPending,
      isError: loginAdminMutation.isError,
      error: loginAdminMutation.error,
      isSuccess: loginAdminMutation.isSuccess,
    },
    login: {
      mutate: loginMutation.mutate,
      isLoading: loginMutation.isPending,
      isError: loginMutation.isError,
      error: loginMutation.error,
      isSuccess: loginMutation.isSuccess,
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
    processOAuthCallback,
  };
};
