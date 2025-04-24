// OAuthCallback.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const OAuthCallback = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { handleOAuthCallback, isProcessingOAuth } = useAuth();

    useEffect(() => {
        const processCallback = async () => {
            try {
                // Process the OAuth callback
                const success = await handleOAuthCallback();

                if (success) {
                    // Get the redirect target from query params or session storage or default
                    const params = new URLSearchParams(location.search);
                    const redirectTo = params.get('redirect') ||
                        sessionStorage.getItem('auth_redirect') ||
                        '/dashboard';

                    // Clean up
                    sessionStorage.removeItem('auth_redirect');

                    // Redirect to the target page
                    navigate(redirectTo, { replace: true });
                } else {
                    setError('Authentication failed. Please try again.');
                }
            } catch (err) {
                console.error('Error processing OAuth callback:', err);
                setError('An error occurred during authentication.');
            }
        };

        processCallback();
    }, [handleOAuthCallback, navigate, location]);

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