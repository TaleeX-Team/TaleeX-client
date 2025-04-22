import axios from "axios";

// Login API
export const loginUser = async (credentials) => {
  const response = await axios.post(
      "https://careerhelper-development.up.railway.app/api/v1/auth/login",
      credentials
  );
  return response.data;
};

// Register API
export const registerUser = async (userData) => {
  try {
    const formData = new URLSearchParams();
    Object.entries(userData).forEach(([key, value]) => {
      formData.append(key, value);
    })

    const response = await axios.post(
        "https://careerhelper-development.up.railway.app/api/v1/auth/register",
        formData.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
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
export const refreshUserToken = async (refreshToken) => {
  const response = await axios.post('/auth/refresh-token', { refreshToken });
  return response.data;
};

// Fetch Current User API
export const fetchCurrentUser = async () => {
  const response = await axios.get("/api/auth/me", {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
  });
  return response.data;
};

// Logout API
export const logoutUser = async (refreshToken) => {
  try {
    const token = localStorage.getItem("accessToken");

    const formData = new URLSearchParams();
    formData.append('refreshToken', refreshToken);

    const response = await axios.post(
        "https://careerhelper-development.up.railway.app/api/v1/auth/logout",
        formData.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${token}`,
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


