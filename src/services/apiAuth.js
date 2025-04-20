import axios from "axios";

// Login API
export const loginUser = async (credentials) => {
  const response = await axios.post(
    "https://careerhelper-development.up.railway.app/api/v1/auth/login",
    credentials
  );
  return response.data; // Return token or user data
};

// Fetch Current User API
export const fetchCurrentUser = async () => {
  const response = await axios.get("/api/auth/me", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data;
};

// Logout API (if needed)
export const logoutUser = async () => {
  await axios.post("/api/auth/logout");
};
