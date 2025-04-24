// hooks/useOAuth.ts
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import TokenService from "@/lib/TokenService";

export const useOAuth = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const [isProcessingOAuth, setIsProcessingOAuth] = useState(false);

    useEffect(() => {
        if (location.pathname !== "/auth/callback") return;

        const handleOAuthCallback = async () => {
            setIsProcessingOAuth(true);
            try {
                const params = new URLSearchParams(location.search);

                // 1. Check for explicit errors first
                if (params.get("error")) {
                    throw new Error(params.get("error") || "oauth_error");
                }

                // 2. Verify success flag
                const success = params.get("success") === "true";
                if (!success) {
                    throw new Error("oauth_failed_no_success_flag");
                }

                // 3. Mark as authenticated
                TokenService.setOAuthAuthenticated(true);
                console.log("OAuth authentication confirmed");

                // 4. Refresh application state
                await Promise.all([
                    queryClient.invalidateQueries(["auth"]),
                    queryClient.invalidateQueries(["user"])
                ]);

                // 5. Redirect to home or original path
                navigate("/", { replace: true });

            } catch (error) {
                console.error("OAuth processing error:", error);
                TokenService.setOAuthAuthenticated(false);
                navigate(`/auth?error=${error.message}`);
            } finally {
                setIsProcessingOAuth(false);
            }
        };

        handleOAuthCallback();
    }, [location, navigate, queryClient]);

    const initiateOAuthLogin = useCallback((provider) => {
        // Store provider in session storage for debugging
        sessionStorage.setItem("oauth_provider", provider);

        const baseUrl = "https://hirex-production.up.railway.app/api/v1/auth";
        const redirectUri = encodeURIComponent(
            `${window.location.origin}/auth/callback`
        );
        window.location.href = `${baseUrl}/${provider}?redirect_uri=${redirectUri}`;
    }, []);

    return { initiateOAuthLogin, isProcessingOAuth };
};