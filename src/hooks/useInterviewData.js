import {useMutation, useQuery} from '@tanstack/react-query';
import {getInterviewHeaderInfo, getInterviewQuestions} from "@/services/apiAuth.js";
import apiClient from "@/services/apiAuth.js";
import {toast} from "sonner"
export const useInterviewData = (interviewId) => {
    return useQuery({
        queryKey: ['interview', interviewId],
        queryFn: () => getInterviewHeaderInfo(interviewId),
        enabled: !!interviewId,
        retry: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useStartInterview = (interviewId) => {
    return useQuery({
        queryKey: ['startInterview', interviewId],
        queryFn: () => getInterviewQuestions(interviewId),
        enabled: false,
        retry: false,
        staleTime: 5 * 60 * 1000,
    });
};



export function useEndInterview() {
    return useMutation({
        mutationFn: async ({ interviewId, transcript, images }) => {
            const formData = new FormData();

            // Append transcript data
            formData.append("transcript", transcript);

            // Process images (limit to 3)
            if (images && images.length > 0) {
                const imagesToUpload = images.slice(0, 3);

                imagesToUpload.forEach((image, index) => {
                    if (image instanceof File) {
                        formData.append("images", image);
                    } else if (typeof image === 'string' && image.startsWith('data:')) {
                        // Handle base64 data URLs
                        fetch(image)
                            .then(res => res.blob())
                            .then(blob => {
                                const file = new File([blob], `screenshot-${index}.png`, { type: 'image/png' });
                                formData.append("images", file);
                            });
                    } else if (typeof image === 'string') {
                        // For other string URLs
                        formData.append("images", image);
                    }
                });
            }

            // Log the form data for debugging
            console.log("Submitting interview data:", {
                interviewId,
                hasTranscript: !!transcript,
                imageCount: images?.length || 0
            });

            try {
                // Make the API request - Axios specific handling
                const response = await apiClient.post(
                    `https://hirex-production.up.railway.app/api/v1/interviews/${interviewId}/end`,
                    formData
                );

                // Axios returns the data directly in response.data
                return response.data;
            } catch (error) {
                // Axios error handling
                const errorMessage = error.response?.data?.message ||
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
        }
    });
}