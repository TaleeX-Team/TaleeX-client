import { useMutation } from "@tanstack/react-query";
import apiClient, { BASE_URL } from "@/services/apiAuth.js";

export function useReportJob() {
  return useMutation({
    mutationFn: async (reportData) => {
      const { jobId, name, email, reason, description } = reportData;

      if (!jobId) {
        throw new Error("Job ID is required");
      }

      if (!name.trim()) {
        throw new Error("Name is required");
      }

      if (!email.trim()) {
        throw new Error("Email is required");
      }

      if (!reason) {
        throw new Error("Reason is required");
      }

      // Create payload
      const payload = {
        jobId,
        name: name.trim(),
        email: email.trim(),
        reason,
        description: description.trim(),
      };

      try {
        const response = await apiClient.post(
          `${BASE_URL}/api/v1/reports`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        return response.data;
      } catch (error) {
        // Enhance error handling
        const errorMessage =
          error.response?.data?.message ||
          error?.response?.data?.message ||
          "Failed to submit report";

        throw new Error(errorMessage);
      }
    },
    onError: (error) => {
      console.error("Report submission failed:", error);
    },
  });
}
