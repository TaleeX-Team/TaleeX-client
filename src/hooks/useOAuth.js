import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export const useOAuth = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const hasProcessedRef = useRef(false);
    const [isProcessingOAuth, setIsProcessingOAuth] = useState(false);

    useEffect(() => {
        if (hasProcessedRef.current || location.pathname !== "/auth/callback") return;

        const handleOAuthCallback = async () => {
            hasProcessedRef.current = true;
            setIsProcessingOAuth(true);

            try {
                console.log("Processing OAuth callback");
                const params = new URLSearchParams(location.search);
                const error = params.get("error");
                const state = params.get("state");
                const success = params.get("success");

                if (error) {
                    console.error("OAuth error:", error);
                    navigate("/auth?error=oauth_rejected");
                    return;
                }

                const expectedState = localStorage.getItem("oauthState");
                const provider = localStorage.getItem("oauthProvider");

                if (state !== expectedState || !provider) {
                    console.error("Invalid state or missing provider");
                    navigate("/auth?error=oauth_state_invalid");
                    return;
                }

                // Clean up OAuth state data
                localStorage.removeItem("oauthState");
                localStorage.removeItem("oauthProvider");

                if (success === "true") {
                    // OAuth was successful, and HTTP-only cookie should be set by the server
                    console.log("OAuth authentication successful");


                    // Redirect to home or dashboard
                    navigate("/", { replace: true });
                } else {
                    console.error("OAuth process did not return success status");
                    navigate("/auth?error=oauth_failed");
                }

            } catch (error) {
                console.error("OAuth processing error:", error);
                navigate("/auth/login?error=oauth_processing_error");
            } finally {
                setIsProcessingOAuth(false);
            }
        };

        handleOAuthCallback();
    }, [location, navigate, queryClient]);

    // Function to initiate OAuth login
    const initiateOAuthLogin = useCallback((provider) => {
        // Generate a secure state parameter using crypto API when available
        let state;
        if (window.crypto && window.crypto.randomUUID) {
            state = window.crypto.randomUUID();
        } else {
            // Fallback for older browsers
            state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        }

        localStorage.setItem("oauthState", state);
        localStorage.setItem("oauthProvider", provider);

        const baseUrl = "https://hirex-production.up.railway.app/api/v1/auth";
        const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback`);

        // Start the OAuth flow
        window.location.href = `${baseUrl}/${provider}?state=${state}&redirect_uri=${redirectUri}`;
    }, []);

    return {
        initiateOAuthLogin,
        isProcessingOAuth
    };
};