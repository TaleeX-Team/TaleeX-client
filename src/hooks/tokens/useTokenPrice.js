import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { updateTokenPrice } from "@/services/apiAuth.js"
import { toast } from "sonner"
import {getTokenPrice} from "@/services/apiTokens.js";

export function useTokenPrice(currency = "EGP") {
    const queryClient = useQueryClient()

    // Fetch token price
    const {
        data: tokenPrice,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["tokenPrice", currency],
        queryFn: () => getTokenPrice(currency),
    });

    // Update token price
    const updatePriceMutation = useMutation({
        mutationFn: (price) => updateTokenPrice(price),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tokenPrice"] })
            toast.success("Token price updated successfully")
        },
        onError: (error) => {
            toast.error(`Failed to update token price: ${error.message}`)
        },
    })

    return {
        tokenPrice,
        isLoading,
        error,
        updatePrice: updatePriceMutation.mutate,
        isUpdating: updatePriceMutation.isPending,
    }
}
