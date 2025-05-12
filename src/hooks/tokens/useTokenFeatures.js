import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createTokenFeature, updateTokenFeature, deleteTokenFeature } from "@/services/apiAuth.js"
import { toast } from "sonner"
import {getTokenFeatures} from "@/services/apiTokens.js";

export function useTokenFeatures() {
    const queryClient = useQueryClient()

    // Fetch token features
    const {
        data: features = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ["tokenFeatures"],
        queryFn: getTokenFeatures,
    })

    // Create token feature
    const createFeatureMutation = useMutation({
        mutationFn: (feature) => createTokenFeature(feature),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tokenFeatures"] })
            toast.success("Token feature created successfully")
        },
        onError: (error) => {
            toast.error(`Failed to create token feature: ${error.message}`)
        },
    })

    // Update token feature
    const updateFeatureMutation = useMutation({
        mutationFn: ({ id, feature }) => updateTokenFeature(id, feature),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tokenFeatures"] })
            toast.success("Token feature updated successfully")
        },
        onError: (error) => {
            toast.error(`Failed to update token feature: ${error.message}`)
        },
    })

    // Delete token feature
    const deleteFeatureMutation = useMutation({
        mutationFn: (id) => deleteTokenFeature(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tokenFeatures"] })
            toast.success("Token feature deleted successfully")
        },
        onError: (error) => {
            toast.error(`Failed to delete token feature: ${error.message}`)
        },
    })

    return {
        features,
        isLoading,
        error,
        createFeature: createFeatureMutation.mutate,
        updateFeature: updateFeatureMutation.mutate,
        deleteFeature: deleteFeatureMutation.mutate,
        isCreating: createFeatureMutation.isPending,
        isUpdating: updateFeatureMutation.isPending,
        isDeleting: deleteFeatureMutation.isPending,
    }
}
