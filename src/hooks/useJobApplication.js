import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getJobApplicationForm,
  submitJobApplication,
} from "@/services/apiAuth.js";
import { toast } from "sonner";

export function useJobApplication(jobId) {
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  // Fetch job details
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["jobApplication", jobId],
    queryFn: async () => {
      try {
        return await getJobApplicationForm(jobId);
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "Failed to fetch job application form"
        );
        throw error;
      }
    },
    enabled: !!jobId,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Submit application mutation
  const { mutateAsync, isPending: isSubmitting } = useMutation({
    mutationFn: async (formData) => await submitJobApplication(jobId, formData),
    onSuccess: () => {
      setIsSubmitSuccess(true);
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onError: (error) => {
      toast.error(
        error?.message || "An unexpected error occurred during submission"
      );
    },
  });

  const submitApplication = async (formData) => {
    try {
      await mutateAsync(formData);
    } catch (error) {
      throw error;
    }
  };

  return {
    jobData: data,
    isLoading,
    isError,
    error,
    submitApplication,
    isSubmitting,
    isSubmitSuccess,
  };
}
