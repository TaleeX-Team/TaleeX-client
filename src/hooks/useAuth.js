// useAuth.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loginUser, logoutUser, registerUser } from "../services/apiAuth.js";
import {useEffect} from "react";
import TokenService from "@/lib/TokenService";

export const useAuth = () => {
  const queryClient = useQueryClient();

  // 1) Keep track of isAuthenticated by reading TokenService
  const authQuery = useQuery({
    queryKey: ["auth"],
    queryFn: () => ({
      isAuthenticated: TokenService.isAuthenticated(),
    }),
    // we’ll manually invalidate whenever tokens change:
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
      } else {
        queryClient.invalidateQueries({ queryKey: ["user"] });
      }
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  // 3) Logout
  const logoutMutation = useMutation({
    mutationFn: () => logoutUser(TokenService.getRefreshToken()),
    onSuccess: () => {
      TokenService.clearTokens();
      TokenService.setOAuthAuthenticated(false);
      queryClient.removeQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: () => {
      // even on error, clear local
      TokenService.clearTokens();
      TokenService.setOAuthAuthenticated(false);
      queryClient.removeQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  // 4) Register
  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      if (data.user) {
        queryClient.setQueryData(["user"], data.user);
      }
      if (data.accessToken) {
        TokenService.setAccessToken(data.accessToken);
        queryClient.invalidateQueries({ queryKey: ["auth"] });
      }
    },
  });

  // 5) OAuth callback helper
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
    // state
    isAuthenticated: authQuery.data?.isAuthenticated ?? false,
    isLoading:
        authQuery.isLoading ||
        loginMutation.isLoading ||
        logoutMutation.isLoading ||
        registerMutation.isLoading,
    // operations
    login: {
      mutate: loginMutation.mutate,
      isLoading: loginMutation.isLoading,
      isError: loginMutation.isError,
      error: loginMutation.error,
    },
    logout: {
      mutate: logoutMutation.mutate,
      isLoading: logoutMutation.isLoading,
      isError: logoutMutation.isError,
      error: logoutMutation.error,
    },
    register: {
      mutate: registerMutation.mutate,
      isLoading: registerMutation.isLoading,
      isError: registerMutation.isError,
      error: registerMutation.error,
    },
    processOAuthCallback,
  };
};
