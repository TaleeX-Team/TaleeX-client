import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getInterviewHeaderInfo,
  getInterviewQuestions,
} from "@/services/apiAuth.js";
import apiClient from "@/services/apiAuth.js";
import { toast } from "sonner";
export const useInterviewData = (interviewId) => {
  return useQuery({
    queryKey: ["interview", interviewId],
    queryFn: () => getInterviewHeaderInfo(interviewId),
    enabled: !!interviewId,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useStartInterview = (interviewId) => {
  return useQuery({
    queryKey: ["startInterview", interviewId],
    queryFn: () => getInterviewQuestions(interviewId),
    enabled: false,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};

export function useEndInterview() {
  return useMutation({
    mutationFn: async ({ interviewId, transcript, images }) => {
      // Create a new FormData instance
      const formData = new FormData();

      // Append transcript data
      formData.append("transcript", transcript || "");

      // Process images (limit to 3)
      if (images && images.length > 0) {
        const imagesToUpload = images.slice(0, 3);

        // Convert base64 images to File objects
        await Promise.all(
          imagesToUpload.map(async (image, index) => {
            if (image instanceof File) {
              // If already a File object, append it
              formData.append("images", image);
            } else if (
              typeof image === "string" &&
              image.startsWith("data:image/")
            ) {
              // Handle base64 data URLs
              try {
                const response = await fetch(image);
                if (!response.ok) {
                  toast.error("Failed to fetch image data");
                }
                const blob = await response.blob();
                const file = new File([blob], `screenshot-${index + 1}.jpeg`, {
                  type: "image/jpeg",
                });
                formData.append("images", file);
                console.log(
                  `Converted screenshot-${index + 1}.jpeg to File object`
                );
              } catch (error) {
                console.error(
                  `Error converting screenshot ${index + 1} to File:`,
                  error
                );
                // Skip invalid screenshots instead of throwing
              }
            } else {
              console.warn(
                `Invalid image format for screenshot ${index + 1}:`,
                image
              );
              // Skip non-base64 strings or invalid data
            }
          })
        );
      }

      // Log FormData contents for debugging
      const formDataEntries = {};
      for (const [key, value] of formData.entries()) {
        formDataEntries[key] =
          value instanceof File ? `File: ${value.name}` : value;
      }
      console.log("FormData contents:", formDataEntries);
      console.log("Submitting interview data:", {
        interviewId,
        hasTranscript: !!transcript,
        imageCount: images?.length || 0,
      });

      try {
        // Make the API request
        const response = await apiClient.post(
          `https://taleex-development.up.railway.app/api/v1/interviews/${interviewId}/end`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        return response.data;
      } catch (error) {
        // Axios error handling
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to end interview";
        throw new Error(errorMessage);
      }
    },
    onSuccess: (data) => {
      // Handle successful submission
      toast.success("Interview data submitted successfully!");
      console.log("Interview ended successfully:", data);
    },
    onError: (error) => {
      // Handle errors
      toast.error(error.message || "Failed to submit interview data");
      console.error("Error ending interview:", error);
    },
  });
}
