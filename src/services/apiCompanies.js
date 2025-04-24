import { useQuery } from "@tanstack/react-query";
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

// For creating a new company
export const createCompany = async (companyData) => {
  try {
    console.log("Creating company:", companyData);
    const response = await apiClient.post("/companies", companyData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Company created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to create company:", error.message);
    throw error;
  }
};
