import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { getUserById } from "@/services/apiAuth";
import Cookies from "js-cookie";

export const useUser = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const userData = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      // First check cache
      const cached = queryClient.getQueryData(["user"]);
      if (cached) return cached;

      // Get userId from localStorage
      let userId = Cookies.get("userId");

      if (!userId) {
        userId = localStorage.getItem("userId");
      }

      // Fetch user data from API
      const userData = await getUserById(userId);
      return userData;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    onSuccess: (data) => {
      console.log("User fetched successfully:", data);
    },
    onError: (error) => {
      console.error("Error fetching user:", error);
    },
  });

  return userData;
};
