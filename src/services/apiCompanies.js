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
export const getNonRejectedCompanies = async () => {
  try {
    console.log("Fetching companies");
    const response = await apiClient.get("/companies/non-rejected");
    console.log("Companies fetched successfully");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch companies:", error.message);
    throw error;
  }
};

export const acceptJobInvitation = async ({ applicationId, newJobId }) => {
  const response = await apiClient.get(
      `/applications/accept`,
      {
        params: { applicationId, newJobId },
      }
  );
  return response.data;
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

export const deleteCompany = async (companyId) => {
  try {
    console.log("Deleting company with ID:", companyId);
    const response = await apiClient.delete(`/companies/${companyId}`);
    console.log("Company deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to delete company:", error.message);
    throw error;
  }
};

export const requestDomainVerification = async (companyId, data) => {
  try {
    console.log(
      `Requesting domain verification for company ID: ${companyId}`,
      data
    );
    const response = await apiClient.post(
      `/companies/${companyId}/verification/domain/request`,
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log("Domain verification code requested successfully");
    return response.data;
  } catch (error) {
    console.error("Failed to request domain verification code:", error.message);
    throw error;
  }
};
export const confirmDomainVerification = async (companyId, data) => {
  try {
    console.log(`Confirming domain verification for company ID: ${companyId}`);
    const response = await apiClient.post(
      `/companies/${companyId}/verification/domain/confirm`,
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log("Domain verification confirmed successfully");
    return response.data;
  } catch (error) {
    console.error("Failed to confirm domain verification:", error.message);
    throw error;
  }
};
export const requestVerification = async (companyId, document) => {
  try {
    console.log(
      `Requesting verification for company ID: ${companyId}`,
      document
    );
    const response = await apiClient.post(
      `/companies/${companyId}/verification/request`,
      document,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log("Verification requested successfully");
    return response.data;
  } catch (error) {
    console.error("Failed to request verification:", error);
    throw error;
  }
};
