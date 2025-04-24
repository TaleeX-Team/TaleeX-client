// apiClient.js - Updated version with getUser implementation
import axios from "axios";
import TokenService from "@/lib/TokenService.js";

// Create an axios instance with base URL
const apiClient = axios.create({
    baseURL: "https://hirex-production.up.railway.app/api/v1",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    withCredentials: true, // Critical for sending cookies with cross-origin requests
});

// Flag to prevent multiple simultaneous refresh requests
let isRefreshing = false;
// Queue of failed requests to retry after token refresh
let failedQueue = [];

// Process the failed queue
const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Setup request interceptor
apiClient.interceptors.request.use(
    (config) => {
        console.log(`Making request to: ${config.url}`);

        // Get token from localStorage for token-based auth
        const token = TokenService.getAccessToken();

        // If we have a token, add it to the headers
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
            console.log("Adding Authorization header");
        } else {
            console.log("No token available, request will use cookies if present");
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Setup response interceptor
apiClient.interceptors.response.use(
    (response) => {
        console.log(`Response from ${response.config.url}:`, response.status);

        // If the response includes a new token, update it in localStorage
        if (response.data && response.data.accessToken) {
            console.log("Received new access token in response");
            TokenService.setAccessToken(response.data.accessToken);
        }
        return response;
    },
    async (error) => {
        console.log(`Error response from ${error.config?.url}:`, error.response?.status);

        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh the token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                console.log("Token refresh already in progress, queuing request");
                return new Promise((resolve, reject) => {
                    failedQueue.push({resolve, reject});
                })
                    .then(token => {
                        console.log("Retrying request with new token");
                        if (token) {
                            originalRequest.headers["Authorization"] = `Bearer ${token}`;
                        }
                        return apiClient(originalRequest);
                    })
                    .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;
            console.log("Starting token refresh process");

            try {
                // Use refresh token for manual login or OAuth cookie-based refresh
                const refreshToken = TokenService.getRefreshToken();
                const isOAuth = TokenService.isOAuthAuthenticated();

                // Call refresh endpoint
                console.log("Calling refresh token endpoint");
                const response = await axios.post(
                    "https://hirex-production.up.railway.app/api/v1/auth/refresh-token",
                    isOAuth ? {} : { refreshToken }, // Only send refresh token for non-OAuth flow
                    {
                        withCredentials: true // Always include cookies
                    }
                );

                console.log("Refresh token response:", response.status);

                // For token-based auth, update the tokens
                if (response.data && response.data.accessToken) {
                    console.log("New token received from refresh");
                    TokenService.setAccessToken(response.data.accessToken);

                    if (response.data.refreshToken) {
                        TokenService.setRefreshToken(response.data.refreshToken);
                    }

                    // Add it to the original request
                    originalRequest.headers["Authorization"] = `Bearer ${response.data.accessToken}`;

                    // Process all queued requests with the new token
                    processQueue(null, response.data.accessToken);
                } else if (isOAuth) {
                    // For OAuth, we just need to ensure the cookies are sent
                    console.log("OAuth cookie refresh, continuing with request");
                    processQueue(null);
                } else {
                    console.log("No token in refresh response");
                    processQueue(null);
                }

                isRefreshing = false;
                return apiClient(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError.message);
                processQueue(refreshError);
                isRefreshing = false;

                // Clear tokens from localStorage
                TokenService.clearTokens();
                TokenService.setOAuthAuthenticated(false);

                // Dispatch an event that auth has failed
                window.dispatchEvent(new CustomEvent('auth:failed'));

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);


// Login API
export const loginUser = async (credentials) => {
    console.log("Attempting login");
    const response = await apiClient.post("/auth/login", credentials);

    // If the response includes tokens, store them in localStorage
    if (response.data) {
        if (response.data.accessToken) {
            console.log("Login successful, storing access token");
            TokenService.setAccessToken(response.data.accessToken);
        }

        if (response.data.refreshToken) {
            console.log("Storing refresh token");
            TokenService.setRefreshToken(response.data.refreshToken);
        }
    } else {
        console.log("Login successful but no token in response");
    }

    return response.data;
};

// Register API
export const registerUser = async (userData) => {
    try {
        console.log("Attempting registration");
        const formData = new URLSearchParams();
        Object.entries(userData).forEach(([key, value]) => {
            formData.append(key, value);
        });

        const response = await apiClient.post(
            "/auth/register",
            formData.toString(),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        return response.data;
    } catch (error) {
        // Graceful error parsing
        if (error.response) {
            const {status, data} = error.response;
            let message = "Registration failed";

            if (status === 400 && data.errors) {
                message = Object.values(data.errors).join(", ");
            } else if (data.message) {
                message = data.message;
            }

            throw new Error(message);
        }

        if (error.message === "Network Error") {
            throw new Error("Unable to connect to the server. Please check your internet connection.");
        }

        throw new Error(error.message || "An unexpected error occurred.");
    }
};

// Logout API
export const logoutUser = async (refreshToken) => {
    try {
        console.log("Logging out");
        // Include refresh token in the request if your API requires it
        const response = await apiClient.post("/auth/logout", { refreshToken });

        // Clear the tokens
        TokenService.clearTokens();
        TokenService.setOAuthAuthenticated(false); // Also clear OAuth flag
        console.log("Logged out, tokens cleared");

        return response.data;
    } catch (error) {
        // Even if server logout fails, clear tokens
        TokenService.clearTokens();
        TokenService.setOAuthAuthenticated(false);

        if (error.response) {
            const {data} = error.response;
            let message = "Logout failed";

            if (data.message) {
                message = data.message;
            } else if (data.details) {
                message = Object.values(data.details).join(", ");
            }

            throw new Error(message);
        }

        if (error.message === "Network Error") {
            throw new Error("Unable to connect to the server. Please check your internet connection.");
        }

        throw new Error(error.message || "An unexpected error occurred during logout.");
    }
};

export const forgotPassword = async (payload) => {
    try {
        console.log("Requesting password reset for:", payload.email);
        const response = await apiClient.post("/auth/forgot-password", payload);
        console.log("Password reset email sent:", response.status);
        return response.data;
    } catch (error) {
        console.error("Forgot‑password request failed:", error.response?.data || error.message);

        if (error.response) {
            const { status, data } = error.response;
            if (status === 400 && data.errors) {
                throw new Error(Object.values(data.errors).join(", "));
            }
            if (data.message) {
                throw new Error(data.message);
            }
        }

        if (error.message === "Network Error") {
            throw new Error("Unable to connect to the server. Check your internet connection.");
        }

        throw new Error(error.message || "An unexpected error occurred when requesting password reset.");
    }
};

export async function resetPassword({ token, password }) {
    try {
        const response = await apiClient.post("/auth/reset-password", {
            token,
            password
        });

        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        const errorMessage = error.response?.data?.message || "Failed to reset password";
        throw new Error(errorMessage);
    }
}
export const getCompanies = async () => {
    try {
        console.log("Fetching companies");
        const response = await apiClient.get("/companies");
        console.log("Companies fetched successfully");
        return response.data;
    } catch (error) {
        console.error("Failed to fetch companies:", error.message);
        throw error;
    }
};

export default apiClient;