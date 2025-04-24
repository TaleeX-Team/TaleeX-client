import apiClient from "./apiAuth";

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
