import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
const OAUTH_URLS = {
  google: "https://taleex-development.up.railway.app/api/v1/auth/google",
  linkedin: "https://taleex-development.up.railway.app/api/v1/auth/linkedin",
};

const redirectToOAuth = async (provider) => {
  const url = OAUTH_URLS[provider];
  if (!url) throw new Error("Unsupported OAuth provider");

  await new Promise((resolve) => setTimeout(resolve, 500));
  window.location.href = url;
};

export const useOAuth = () => {
  const mutation = useMutation({
    mutationFn: redirectToOAuth,
    onError: (error) => {
      toast.error(error.message || "OAuth login failed");
    },
  });

  return {
    initiateOAuthLogin: mutation.mutate,
    isProcessingOAuth: mutation.isPending,
  };
};
