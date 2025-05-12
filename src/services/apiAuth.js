import axios from "axios";
import TokenService from "@/lib/TokenService.js";

const MODE =
  import.meta.env.MODE || import.meta.env.VITE_NODE_ENV || "development";
export const BASE_URL =
  MODE === "production"
    ? "https://taleex-staging.up.railway.app"
    : "https://taleex-development.up.railway.app";

// Create a function to generate an axios instance with the right configuration
const createApiClient = (pathPrefix = "/api/v1") => {
  const instance = axios.create({
    baseURL: `${BASE_URL}${pathPrefix}`,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    withCredentials: true, // Critical for sending cookies with cross-origin request
  });

  // Setup request interceptor
  instance.interceptors.request.use(
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

  return instance;
};

// Flag to prevent multiple simultaneous refresh requests
let isRefreshing = false;
// Queue of failed requests to retry after token refresh
let failedQueue = [];

// Process the failed queue
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Create the main API client instances
const apiClient = createApiClient("/api/v1");
export const adminApiClient = createApiClient("/admin/v1");

// Setup response interceptor for both clients
[apiClient, adminApiClient].forEach((client) => {
  client.interceptors.response.use(
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
      console.log(
        `Error response from2 ${error.config?.url}:`,
        error.response?.status
      );

      const originalRequest = error.config;

      // If error is 401 and we haven't tried to refresh the token yet
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          console.log("Token refresh already in progress, queuing request");
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              console.log("Retrying request with new token");
              if (token) {
                originalRequest.headers["Authorization"] = `Bearer ${token}`;
              }
              return axios(originalRequest);
            })
            .catch((err) => Promise.reject(err));
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
            `${BASE_URL}/api/v1/auth/refresh-token`,
            isOAuth ? {} : { refreshToken }, // Only send refresh token for non-OAuth flow
            {
              withCredentials: true, // Always include cookies
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
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${response.data.accessToken}`;

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
          return axios(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError.message);
          processQueue(refreshError);
          isRefreshing = false;

          // Clear tokens from localStorage
          TokenService.clearTokens();
          TokenService.setOAuthAuthenticated(false);

          // Dispatch an event that auth has failed
          window.dispatchEvent(new CustomEvent("auth:failed"));

          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
});

// Create a unified API object that routes to the correct client
const api = {
  get: (url, config) => {
    if (url.startsWith("/admin/")) {
      // Remove the /admin/v1 prefix since it's already in the baseURL
      const adminUrl = url.replace(/^\/admin\/v1/, "");
      return adminApiClient.get(adminUrl, config);
    }
    return apiClient.get(url, config);
  },
  post: (url, data, config) => {
    if (url.startsWith("/admin/")) {
      const adminUrl = url.replace(/^\/admin\/v1/, "");
      return adminApiClient.post(adminUrl, data, config);
    }
    return apiClient.post(url, data, config);
  },
  put: (url, data, config) => {
    if (url.startsWith("/admin/")) {
      const adminUrl = url.replace(/^\/admin\/v1/, "");
      return adminApiClient.put(adminUrl, data, config);
    }
    return apiClient.put(url, data, config);
  },
  patch: (url, data, config) => {
    if (url.startsWith("/admin/")) {
      const adminUrl = url.replace(/^\/admin\/v1/, "");
      return adminApiClient.patch(adminUrl, data, config);
    }
    return apiClient.patch(url, data, config);
  },
  delete: (url, config) => {
    if (url.startsWith("/admin/")) {
      const adminUrl = url.replace(/^\/admin\/v1/, "");
      return adminApiClient.delete(adminUrl, config);
    }
    return apiClient.delete(url, config);
  },
};

// Login API - keeping the same implementation but using the unified api object
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

export const loginAdmin = async (credentials) => {
  console.log("Attempting login");
  const response = await adminApiClient.post("/auth/login", credentials);

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

    const response = await api.post("/auth/register", formData.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
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

    if (error?.response?.data?.message === "Network Error") {
      throw new Error(
        "Unable to connect to the server. Please check your internet connection."
      );
    }

    throw new Error(
      error?.response?.data?.message || "An unexpected error occurred."
    );
  }
};
export const verifyEmail = async (verificationToken) => {
  try {
    const response = await api.get(`/auth/verify-email/${verificationToken}`);
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      throw error.response.data;
    }
    throw new Error(error?.response?.data?.message || "Verification failed");
  }
};

// Logout API
export const logoutUser = async (refreshToken) => {
  try {
    console.log("Logging out");
    // Include refresh token in the request if your API requires it
    const response = await api.post("/auth/logout", { refreshToken });

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
      const { data } = error.response;
      let message = "Logout failed";

      if (data.message) {
        message = data.message;
      } else if (data.details) {
        message = Object.values(data.details).join(", ");
      }

      throw new Error(message);
    }

    if (error?.response?.data?.message === "Network Error") {
      throw new Error(
        "Unable to connect to the server. Please check your internet connection."
      );
    }

    throw new Error(
      error?.response?.data?.message ||
        "An unexpected error occurred during logout."
    );
  }
};

export const forgotPassword = async (payload) => {
  try {
    console.log("Requesting password reset for:", payload.email);
    const response = await api.post("/auth/forgot-password", payload);
    console.log("Password reset email sent:", response.status);
    return response.data;
  } catch (error) {
    console.error(
      "Forgot‑password request failed:",
      error.response?.data || error?.response?.data?.message
    );

    if (error.response) {
      const { status, data } = error.response;
      if (status === 400 && data.errors) {
        throw new Error(Object.values(data.errors).join(", "));
      }
      if (data.message) {
        throw new Error(data.message);
      }
    }

    if (error?.response?.data?.message === "Network Error") {
      throw new Error(
        "Unable to connect to the server. Check your internet connection."
      );
    }

    throw new Error(
      error?.response?.data?.message ||
        "An unexpected error occurred when requesting password reset."
    );
  }
};

export async function resetPassword({ token, password, confirmPassword }) {
  try {
    const response = await api.post(`/auth/reset-password/${token}`, {
      password,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    const msg = error.response?.data?.message || "Failed to reset password";
    throw new Error(msg);
  }
}

export const loginWithOAuthCode = async (code) => {
  const res = await axios.post("/api/v1/auth/oauth-callback", { code });
  return res.data;
};

export const sendVerificationEmail = async (email) => {
  try {
    console.log("Requesting email verification for:", email);
    const formData = new URLSearchParams();
    formData.append("email", email);

    const response = await api.post(
      "/auth/request-email-verification",
      formData.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log("Verification email sent:", response.status);
    return response.data;
  } catch (error) {
    console.error(
      "Verification email request failed:",
      error.response?.data || error?.response?.data?.message
    );

    if (error.response) {
      const { status, data } = error.response;
      if (status === 400 && data.errors) {
        throw new Error(Object.values(data.errors).join(", "));
      }
      if (data.message) {
        throw new Error(data.message);
      }
    }

    if (error?.response?.data?.message === "Network Error") {
      throw new Error(
        "Unable to connect to the server. Check your internet connection."
      );
    }

    throw new Error(
      error?.response?.data?.message ||
        "An unexpected error occurred when requesting email verification."
    );
  }
};

export const setPassword = async (newPassword) => {
  try {
    console.log("Setting new password");
    const formData = new URLSearchParams();
    formData.append("newPassword", newPassword);

    const response = await api.post("/auth/set-password", formData.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    console.log("Password set successfully:", response.status);
    return response.data;
  } catch (error) {
    console.error(
      "Set password request failed:",
      error.response?.data || error?.response?.data?.message
    );

    if (error.response) {
      const { status, data } = error.response;
      if (status === 400 && data.errors) {
        throw new Error(Object.values(data.errors).join(", "));
      }
      if (data.message) {
        throw new Error(data.message);
      }
    }

    if (error?.response?.data?.message === "Network Error") {
      throw new Error(
        "Unable to connect to the server. Check your internet connection."
      );
    }

    throw new Error(
      error?.response?.data?.message ||
        "An unexpected error occurred when setting your password."
    );
  }
};

export const changePassword = async ({ oldPassword, newPassword }) => {
  try {
    console.log("Changing password");
    const formData = new URLSearchParams();
    formData.append("oldPassword", oldPassword);
    formData.append("newPassword", newPassword);

    const response = await api.post(
      "/auth/change-password",
      formData.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log("Password changed successfully:", response.status);
    return response.data;
  } catch (error) {
    console.error(
      "Change password request failed:",
      error.response?.data || error?.response?.data?.message
    );

    if (error.response) {
      const { status, data } = error.response;
      if (status === 400 && data.errors) {
        throw new Error(Object.values(data.errors).join(", "));
      }
      if (data.message) {
        throw new Error(data.message);
      }
    }

    if (error?.response?.data?.message === "Network Error") {
      throw new Error(
        "Unable to connect to the server. Check your internet connection."
      );
    }

    throw new Error(
      error?.response?.data?.message ||
        "An unexpected error occurred when changing your password."
    );
  }
};

export const getUsers = async () => {
  const response = await adminApiClient.get("/users");
  return response.data;
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch user");
  }
};

// Update user
export const updateUser = async ({ userId, userData }) => {
  try {
    const response = await api.patch(`/users/${userId}`, userData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "API Error:",
      error.response?.data || error?.response?.data?.message
    );
    throw error;
  }
};

// Delete user
export const deleteUser = async ({ userId }) => {
  const response = await api.delete(`/users/${userId}`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return response.data;
};

export const deleteAdminUser = async ({ userId }) => {
  const response = await adminApiClient.delete(`/users/${userId}`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return response.data;
};

// Promote user
export const promoteUser = async (userId) => {
  const response = await adminApiClient.patch(`/users/promote/${userId}`);
  return response.data;
};

// Company functions - now using the correct paths
export const getAllCompanies = async () => {
  try {
    // Use the admin path directly
    const response = await api.get("/admin/v1/companies");
    return response.data;
  } catch (error) {
    console.error(
      "Failed to fetch companies:",
      error.response?.data || error?.response?.data?.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch companies"
    );
  }
};

// Verify or reject a company
export const verifyCompany = async ({ id, status, reason }) => {
  try {
    if (!id) {
      throw new Error("Company ID is required for verification");
    }

    const formData = new URLSearchParams();
    formData.append("action", status === "verified" ? "approve" : "reject"); // Convert status to action
    if (reason) {
      formData.append("reason", reason);
    }

    console.log(
      `Verifying company with ID: ${id}, action: ${
        status === "verified" ? "approve" : "reject"
      }`
    );

    const response = await api.post(
      `/admin/v1/companies/${id}/verification`,
      formData.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Company verification failed for ID ${id}:`,
      error.response?.data || error?.response?.data?.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to verify company"
    );
  }
};
// Filter companies with various parameters
export const filterCompanies = async (filters = {}) => {
  try {
    // Convert filters object to URL query parameters
    const params = new URLSearchParams();

    // Map filter keys to API parameter names
    const parameterMapping = {
      name: "name",
      address: "address",
      website: "website",
      verificationStatus: "verificationStatus",
      verificationMethod: "verificationMethod",
      createdBy: "createdBy",
      createdAtFrom: "createdAtFrom",
      createdAtTo: "createdAtTo",
    };

    // Process all filters, skipping null, undefined, and empty strings
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        const apiParamName = parameterMapping[key] || key;

        // Handle arrays (like multiple status values)
        if (Array.isArray(value)) {
          value.forEach((item) => params.append(`${apiParamName}`, item));
        } else {
          params.append(apiParamName, value);
        }
      }
    });

    // Log the request for debugging
    console.log(
      "Filtering companies with params:",
      Object.fromEntries(params.entries())
    );

    const response = await api.get(`/admin/v1/companies/filter`, { params });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to filter companies";
    console.error("Failed to filter companies:", errorMessage, error);
    throw new Error(errorMessage);
  }
};
// Get company statistics
export const getCompanyStatistics = async () => {
  try {
    const response = await api.get("/admin/v1/companies/statistics");
    return response.data;
  } catch (error) {
    console.error(
      "Failed to fetch company statistics:",
      error.response?.data || error?.response?.data?.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch company statistics"
    );
  }
};

export const getJobApplicationForm = async (jobId) => {
  try {
    console.log(`Fetching application form for job: ${jobId}`);
    const response = await api.get(`/jobs/${jobId}/applications/form`);
    return response.data;
  } catch (error) {
    console.error(
      "Failed to fetch job application details:",
      error.response?.data || error?.response?.data?.message
    );

    if (error.response) {
      const { status, data } = error.response;
      if (data.message) {
        throw new Error(data.message);
      }
    }

    if (error?.response?.data?.message === "Network Error") {
      throw new Error(
        "Unable to connect to the server. Please check your internet connection."
      );
    }

    throw new Error(
      error?.response?.data?.message ||
        "Failed to fetch job application details"
    );
  }
};

// Submit job application
export const submitJobApplication = async (jobId, applicationData) => {
  try {
    console.log(`Submitting application for job: ${jobId}`);

    // Ensure we're using the correct content type for file uploads
    const response = await api.post(
      `/jobs/${jobId}/applications/apply`,
      applicationData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Application submitted successfully:", response.status);
    return response.data;
  } catch (error) {
    console.error(
      "Application submission failed:",
      error.response?.data || error?.response?.data?.message
    );

    if (error.response) {
      const { status, data } = error.response;
      if (status === 400 && data.errors) {
        throw new Error(Object.values(data.errors).join(", "));
      }
      if (data.message) {
        throw new Error(data.message);
      }
    }

    if (error?.response?.data?.message === "Network Error") {
      throw new Error(
        "Unable to connect to the server. Please check your internet connection."
      );
    }

    throw new Error(
      error?.response?.data?.message ||
        "An unexpected error occurred when submitting your application."
    );
  }
};
export const shareJobOnLinkedIn = async (jobId) => {
  try {
    console.log(`Sharing job ${jobId} on LinkedIn`);
    const response = await api.get(`/jobs/${jobId}/share/linkedin`);
    return response.data;
  } catch (error) {
    console.error(
      "Failed to share job on LinkedIn:",
      error.response?.data || error?.response?.data?.message
    );

    if (error.response) {
      const { data } = error.response;
      if (data.message) {
        throw new Error(data.message);
      }
    }

    throw new Error("Failed to share job on LinkedIn");
  }
};

export const getInterviewHeaderInfo = async (interviewId) => {
  const response = await apiClient.get(
    `${BASE_URL}/api/v1/interviews/${interviewId}`
  );
  return response.data;
};
export const getInterviewQuestions = async (interviewId) => {
  const response = await apiClient.get(
    `${BASE_URL}/api/v1/interviews/${interviewId}/start`
  );
  return response.data;
};

export const getTokenPackById = async (id) => {
  try {
    const response = await api.get(`/tokens/packs/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Failed to fetch token pack with ID ${id}:`,
      error.response?.data || error.message
    );
    throw new Error("Could not retrieve the token pack.");
  }
};

// === Token Purchasing ===
export const buyTokens = async ({ amountPaid, currency }) => {
  try {
    const response = await api.patch("/users/buy-tokens", {
      amountPaid,
      currency,
    });
    console.log("Tokens purchased successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Failed to buy tokens:",
      error.response?.data || error.message
    );
    throw new Error("Token purchase failed.");
  }
};

export const buyTokenPack = async (packId) => {
  try {
    const response = await api.patch("/users/buy-token-pack", { packId });
    console.log("Token pack purchased successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      `Failed to buy token pack with ID ${packId}:`,
      error.response?.data || error.message
    );
    throw new Error("Token pack purchase failed.");
  }
};

// Get applications by stage with date range
export const getApplicationsByStage = async (params) => {
  // Ensure params is treated as an object
  const safeParams = params || {};

  // Extract strings safely
  const from = safeParams.from || "";
  const to = safeParams.to || "";

  // Construct URL with proper parameters
  const url = `/statistics/applications-by-stage?from=${encodeURIComponent(
    from
  )}&to=${encodeURIComponent(to)}`;

  const response = await adminApiClient.get(url);
  return response.data;
};

// Get daily applications with date range
export const getDailyApplications = async (params) => {
  const safeParams = params || {};

  // Extract strings safely
  const from = safeParams.from || "";
  const to = safeParams.to || "";

  // Construct URL with proper parameters
  const url = `/statistics/daily-applications?from=${encodeURIComponent(
    from
  )}&to=${encodeURIComponent(to)}`;

  const response = await adminApiClient.get(url);
  return response.data;
};

// Get jobs by company with date range
export const getJobsByCompany = async (params) => {
  // Ensure params is treated as an object
  const safeParams = params || {};

  // Extract strings safely
  const from = safeParams.from || "";
  const to = safeParams.to || "";

  // Construct URL with proper parameters
  const url = `/statistics/jobs-by-company?from=${encodeURIComponent(
    from
  )}&to=${encodeURIComponent(to)}`;

  const response = await adminApiClient.get(url);
  return response.data;
};

// Get daily registrations with date range
export const getDailyRegistrations = async (params) => {
  // Ensure params is treated as an object
  const safeParams = params || {};

  // Extract strings safely
  const from = safeParams.from || "";
  const to = safeParams.to || "";

  // Construct URL with proper parameters
  const url = `/statistics/daily-registrations?from=${encodeURIComponent(
    from
  )}&to=${encodeURIComponent(to)}`;

  const response = await adminApiClient.get(url);
  return response.data;
};

// Get reports by reason with date range
export const getReportsByReason = async (params) => {
  // Ensure params is treated as an object
  const safeParams = params || {};

  // Extract strings safely
  const from = safeParams.from || "";
  const to = safeParams.to || "";

  // Construct URL with proper parameters
  const url = `/statistics/reports-by-reason?from=${encodeURIComponent(
    from
  )}&to=${encodeURIComponent(to)}`;

  const response = await adminApiClient.get(url);
  return response.data;
};

// Get interviews by state with date range
export const getInterviewsByState = async (params) => {
  // Ensure params is treated as an object
  const safeParams = params || {};

  // Extract strings safely
  const from = safeParams.from || "";
  const to = safeParams.to || "";

  // Construct URL with proper parameters
  const url = `/statistics/interviews-by-state?from=${encodeURIComponent(
    from
  )}&to=${encodeURIComponent(to)}`;

  const response = await adminApiClient.get(url);
  return response.data;
};

// Get average time per stage with date range
export const getAvgTimePerStage = async (params) => {
  // Ensure params is treated as an object
  const safeParams = params || {};

  // Extract strings safely
  const from = safeParams.from || "";
  const to = safeParams.to || "";

  // Construct URL with proper parameters
  const url = `/statistics/avg-time-per-stage?from=${encodeURIComponent(
    from
  )}&to=${encodeURIComponent(to)}`;

  const response = await adminApiClient.get(url);
  return response.data;
};

// Get conversion funnel with date range
export const getConversionFunnel = async (params) => {
  // Ensure params is treated as an object
  const safeParams = params || {};

  // Extract strings safely
  const from = safeParams.from || "";
  const to = safeParams.to || "";

  // Construct URL with proper parameters
  const url = `/statistics/conversion-funnel?from=${encodeURIComponent(
    from
  )}&to=${encodeURIComponent(to)}`;

  const response = await adminApiClient.get(url);
  return response.data;
};

// Get time to offer per job with date range
export const getTimeToOfferPerJob = async (params) => {
  // Ensure params is treated as an object
  const safeParams = params || {};

  // Extract strings safely
  const from = safeParams.from || "";
  const to = safeParams.to || "";

  // Construct URL with proper parameters
  const url = `/statistics/time-to-offer-per-job?from=${encodeURIComponent(
    from
  )}&to=${encodeURIComponent(to)}`;

  const response = await adminApiClient.get(url);
  return response.data;
};

// Get top applied jobs with date range
export const getTopAppliedJobs = async (params) => {
  // Ensure params is treated as an object
  const safeParams = params || {};

  // Extract strings safely
  const from = safeParams.from || "";
  const to = safeParams.to || "";

  // Construct URL with proper parameters
  const url = `/statistics/top-applied-jobs?from=${encodeURIComponent(
    from
  )}&to=${encodeURIComponent(to)}`;

  const response = await adminApiClient.get(url);
  return response.data;
};
// -------------

// Token Features API
export async function createTokenFeature(feature) {
  try {
    const response = await adminApiClient.post(
      `settings/tokens/features`,
      feature
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to create token feature");
  }
}

export async function updateTokenFeature(id, feature) {
  try {
    const response = await adminApiClient.put(
      `settings/tokens/features/${id}`,
      feature
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to update token feature");
  }
}

export async function deleteTokenFeature(id) {
  try {
    await adminApiClient.delete(`settings/tokens/features/${id}`);
    return true;
  } catch (error) {
    throw new Error("Failed to delete token feature");
  }
}

// Token Price API
export async function updateTokenPrice(tokenPrice) {
  try {
    const response = await adminApiClient.put(
      `settings/tokens/token-price`,
      tokenPrice
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to update token price");
  }
}

// Token Packs API
export async function createTokenPack(pack) {
  try {
    const response = await adminApiClient.post(`settings/tokens/packs`, pack);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create token pack");
  }
}

export async function updateTokenPack(id, pack) {
  try {
    const response = await adminApiClient.put(
      `settings/tokens/packs/${id}`,
      pack
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to update token pack");
  }
}

export async function deleteTokenPack(id) {
  try {
    await adminApiClient.delete(`settings/tokens/packs/${id}`);
    return true;
  } catch (error) {
    throw new Error("Failed to delete token pack");
  }
}

export default apiClient;
