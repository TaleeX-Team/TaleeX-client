import axios from "axios";

// Create an axios instance with base URL
const apiClient = axios.create({
  baseURL: "https://hirex-production.up.railway.app/api/v1",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
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

// Token refresh function with correct URL
export const refreshUserToken = async (refreshToken) => {
  // Use the base axios to prevent interceptor loops
  const response = await axios.post(
      "https://hirex-production.up.railway.app/api/v1/auth/refresh-token",
      { refreshToken },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      }
  );
  return response.data;
};

// Setup request interceptor
apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
);

// Setup response interceptor
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If error is 401 and we haven't tried to refresh the token yet
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // If refresh is in progress, add this request to queue
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
              .then(token => {
                originalRequest.headers["Authorization"] = `Bearer ${token}`;
                return apiClient(originalRequest);
              })
              .catch(err => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) {
            throw new Error("No refresh token available");
          }

          const tokenData = await refreshUserToken(refreshToken);
          const { accessToken, refreshToken: newRefreshToken } = tokenData;

          localStorage.setItem("accessToken", accessToken);
          if (newRefreshToken) {
            localStorage.setItem("refreshToken", newRefreshToken);
          }

          // Update authorization header
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

          // Process all queued requests
          processQueue(null, accessToken);
          isRefreshing = false;

          // Retry original request
          return apiClient(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");

          processQueue(refreshError, null);
          isRefreshing = false;

           window.location.href = 'auth';

          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
);

// Login API
export const loginUser = async (credentials) => {
  const response = await apiClient.post("/auth/login", credentials);
  return response.data;
};

// Register API
export const registerUser = async (userData) => {
  try {
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
      const { status, data } = error.response;
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

// Fetch Current User API
export const fetchCurrentUser = async () => {
  const response = await apiClient.get("/auth/me");
  return response.data;
};

// Logout API
export const logoutUser = async (refreshToken) => {
  try {
    const formData = new URLSearchParams();
    formData.append('refreshToken', refreshToken);

    const response = await apiClient.post(
        "/auth/logout",
        formData.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/x-www-form-urlencoded"
          },
        }
    );

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    return response.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
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

export default apiClient;