import {
    getTokenPacks,
    buyTokens,
    buyTokenPack,
    getTokenFeatures,
    getTokenPrice,
  } from "@/services/apiTokens";
  
  import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
  import { toast } from "sonner";
  
  export function useTokens(currency = "EGP") {
    const queryClient = useQueryClient();
  
    const {
      data: tokenPrice,
      isLoading: isPriceLoading,
      isError: isPriceError,
      error: priceError,
    } = useQuery({
      queryKey: ["tokenPrice", currency],
      queryFn: () => getTokenPrice(currency),
    });
  
    // Get token packs
    const {
      data: tokenPacksData = [],
      isLoading: packsLoading,
      error: packsError,
    } = useQuery({
      queryKey: ["tokenPacks"],
      queryFn: getTokenPacks,
    });
  
    // Get token features
    const {
      data: tokenFeaturesData = [],
      isLoading: featuresLoading,
      error: featuresError,
    } = useQuery({
      queryKey: ["tokenFeatures"],
      queryFn: getTokenFeatures,
    });
  
    // Buy custom amount
    const buyTokensMutation = useMutation({
      mutationFn: buyTokens,
      onSuccess: (res) => {
        toast.success(res.message || "Tokens purchased successfully");
        queryClient.invalidateQueries(["tokenPacks"]);
      },
      onError: (err) => {
        toast.error(err.message || "Failed to purchase tokens");
      },
    });
  
    // Buy predefined pack
    const buyTokenPackMutation = useMutation({
      mutationFn: buyTokenPack,
      onSuccess: (res) => {
        toast.success(res.message || "Token pack purchased");
        queryClient.invalidateQueries(["tokenPacks"]);
      },
      onError: (err) => {
        toast.error(err.message || "Failed to purchase pack");
      },
    });
  
    return {
      tokenPrice,
      tokenPacks: tokenPacksData,
      tokenFeatures: tokenFeaturesData,
      isLoading: isPriceLoading || packsLoading || featuresLoading,
      isError: isPriceError || packsError || featuresError,
      errors: {
        price: priceError,
        packs: packsError,
        features: featuresError,
      },
      buyTokens: buyTokensMutation.mutate,
      buyTokenPack: buyTokenPackMutation.mutate,
      isBuyingTokens: buyTokensMutation.isLoading,
      isBuyingPack: buyTokenPackMutation.isLoading,
    };
  }
  

