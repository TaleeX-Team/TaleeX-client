import { advanceToCVReview } from "@/services/apiApplications";

const { useMutation, useQueryClient } = import("@tanstack/react-query");
const useApplications = () => {
  const queryClient = useQueryClient();

  const advanceToCVReviewMutation = useMutation({
    mutationFn: ({ jobId, applicationIds }) =>
      advanceToCVReview(jobId, applicationIds),
    onSuccess: (response) => {
      console.log("Applications advanced to CV review:", response);
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobApplications"] });
    },
    onError: (error) => {
      console.error(
        "Failed to advance applications to CV review:",
        error.message
      );
    },
  });

  return {
    advanceToCVReviewMutation,
  };
};

export default useApplications;
