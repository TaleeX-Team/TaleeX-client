// apiClient.js - Updated version
import axios from "axios";

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

// Token helper functions
export const TokenService = {
    getAccessToken: () => localStorage.getItem('accessToken'),
    setAccessToken: (token) => {
        if (token) {
            localStorage.setItem('accessToken', token);
        } else {
            localStorage.removeItem('accessToken');
        }
    },
    getRefreshToken: () => localStorage.getItem('refreshToken'),
    setRefreshToken: (token) => {
        if (token) {
            localStorage.setItem('refreshToken', token);
        } else {
            localStorage.removeItem('refreshToken');
        }
    },
    clearTokens: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }
};

// Setup request interceptor to include the token in every request
apiClient.interceptors.request.use(
    (config) => {
        // Debug log request URL
        console.log(`Making request to: ${config.url}`);

        // Get token from localStorage for every request
        const token = TokenService.getAccessToken();

        // If we have a token, add it to the headers
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
            console.log("Adding Authorization header");
        } else {
            console.log("No token available for request");
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
                // If refresh is in progress, add this request to queue
                return new Promise((resolve, reject) => {
                    failedQueue.push({resolve, reject});
                })
                    .then(token => {
                        console.log("Retrying request with new token");
                        originalRequest.headers["Authorization"] = `Bearer ${token}`;
                        return apiClient(originalRequest);
                    })
                    .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;
            console.log("Starting token refresh process");

            try {
                // Use refresh token from localStorage if available
                const refreshToken = TokenService.getRefreshToken();

                // Call refresh endpoint
                console.log("Calling refresh token endpoint");
                const response = await axios.post(
                    "https://hirex-production.up.railway.app/api/v1/auth/refresh-token",
                    { refreshToken }, // Include refresh token in request body if needed by your API
                    {
                        withCredentials: true
                    }
                );

                console.log("Refresh token response:", response.status);

                // The server might return a new token in the response
                const { accessToken, refreshToken: newRefreshToken } = response.data;

                if (accessToken) {
                    console.log("New token received from refresh");
                    // Store the new tokens in localStorage
                    TokenService.setAccessToken(accessToken);

                    // If server also returns a new refresh token
                    if (newRefreshToken) {
                        TokenService.setRefreshToken(newRefreshToken);
                    }

                    // Add it to the original request
                    originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

                    // Process all queued requests with the new token
                    processQueue(null, accessToken);
                } else {
                    console.log("No token in refresh response");
                    // If no token in response but request succeeded, proceed anyway
                    processQueue(null, TokenService.getAccessToken());
                }

                isRefreshing = false;

                // Retry original request
                return apiClient(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError.message);
                processQueue(refreshError);
                isRefreshing = false;

                // Clear the tokens from localStorage
                TokenService.clearTokens();

                // Dispatch an event that auth has failed
                window.dispatchEvent(new CustomEvent('auth:failed'));

                return Promise.reject(refreshError);
            }
        } else if (error.response?.status === 403) {
            console.error("Permission denied (403). Token may be invalid or expired.");
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
        console.log("Logged out, tokens cleared");

        return response.data;
    } catch (error) {
        // Even if server logout fails, clear tokens
        TokenService.clearTokens();

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

// For fetching protected resources
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