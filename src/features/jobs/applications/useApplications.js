import { advanceToCVReview } from "@/services/apiApplications";
import {toast} from "sonner";

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
      toast.error(`${error?.response?.data?.message}`)
    },
  });

  return {
    advanceToCVReviewMutation,
  };
};

export default useApplications;
