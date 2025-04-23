import { useOAuth } from "../hooks/useOAuth";

const OAuthCallback = () => {
    const { isProcessingOAuth } = useOAuth();

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="p-8 max-w-md w-full bg-white rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4 text-center">
                    Completing Authentication
                </h2>
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-600">
                        {isProcessingOAuth
                            ? "Please wait while we complete your authentication..."
                            : "Redirecting..."}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OAuthCallback;
