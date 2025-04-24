import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import TokenService from "@/lib/TokenService.js";

export const useOAuth = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();
    const [isProcessingOAuth, setIsProcessingOAuth] = useState(false);

    /**
     * Kick off the OAuth flow by redirecting to your provider’s endpoint
     */
    const initiateOAuthLogin = useCallback((provider) => {
        setIsProcessingOAuth(true);
        sessionStorage.setItem("oauth_provider", provider);

        const baseUrl = "https://hirex-production.up.railway.app/api/v1/auth";
        const redirectUri = encodeURIComponent(
            `${window.location.origin}/auth/callback`
        );

        window.location.href = `${baseUrl}/${provider}?redirect_uri=${redirectUri}`;
    }, []);

    /**
     * After redirect back to /auth/callback, read tokens from cookies,
     * stash them via TokenService, mark OAuth flag, and refresh queries.
     */
    const processOAuthCallback = useCallback(async () => {
        setIsProcessingOAuth(true);

        // TokenService.processOAuthTokens reads cookies and writes to localStorage as needed
        const success = TokenService.processOAuthTokens();

        if (success) {
            // refresh React Query auth/user data
            await Promise.all([
                queryClient.invalidateQueries(["auth"]),
                queryClient.invalidateQueries(["user"]),
            ]);

            // clear the saved provider (optional)
            sessionStorage.removeItem("oauth_provider");
            // send user home (or wherever)
            navigate("/", { replace: true });
        } else {
            console.error("OAuth callback processing failed: no tokens found");
            // you might want to navigate to an error page
            navigate("/login?error=oauth_failed", { replace: true });
        }

        setIsProcessingOAuth(false);
    }, [queryClient, navigate]);

    const refreshUserData = useCallback(async () => {
        await Promise.all([
            queryClient.invalidateQueries(["auth"]),
            queryClient.invalidateQueries(["user"]),
        ]);
    }, [queryClient]);

    /**
     * On mount, if we’re on the callback route, kick off processing
     */
    useEffect(() => {
        if (location.pathname === "/auth/callback") {
            processOAuthCallback();
        }
    }, [location.pathname, processOAuthCallback]);

    return {
        initiateOAuthLogin,
        isProcessingOAuth,
        refreshUserData,
    };
};
