import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import {loginWithOAuthCode} from "@/services/apiAuth.js";

const OAuthCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [error, setError] = useState(null);

    useEffect(() => {
        const oauthError = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        if (oauthError) {
            const fullError = `OAuth failed: ${errorDescription || oauthError}`;
            toast.error(fullError);
            setError(fullError);
            return;
        }

        const code = searchParams.get('code');
        const provider = searchParams.get('provider');

        if (!code) {
            const fallbackError = "No code found in the callback URL.";
            toast.error(fallbackError);
            setError(fallbackError);
            return;
        }

        loginWithOAuthCode(code, provider)
            .then(() => {
                navigate('/');
            })
            .catch((err) => {
                const loginError = err?.message || "OAuth login failed.";
                toast.error(loginError);
                setError(loginError);
            });
    }, [searchParams]);

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="p-6 bg-white shadow-md rounded-lg max-w-md w-full text-center">
                    <div className="text-red-500 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold mb-2">Authentication Error</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => navigate('/auth')}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        Return to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="p-6 bg-white shadow-md rounded-lg max-w-md w-full text-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-xl font-bold mb-2">Completing Authentication</h2>
                <p className="text-gray-600">Please wait while we verify your login...</p>
            </div>
        </div>
    );
};

export default OAuthCallback;
