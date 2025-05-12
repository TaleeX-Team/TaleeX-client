import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createTokenPack, updateTokenPack, deleteTokenPack } from "@/services/apiAuth.js"
import { toast } from "sonner"
import {getTokenPacks} from "@/services/apiTokens.js";

export function useTokenPacks() {
    const queryClient = useQueryClient()

    // Fetch token packs
    const {
        data: packs = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ["tokenPacks"],
        queryFn: getTokenPacks,
    })

    // Create token pack
    const createPackMutation = useMutation({
        mutationFn: (pack) => createTokenPack(pack),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tokenPacks"] })
            toast.success("Token pack created successfully")
        },
        onError: (error) => {
            toast.error(`Failed to create token pack: ${error.message}`)
        },
    })

    // Update token pack
    const updatePackMutation = useMutation({
        mutationFn: ({ id, pack }) => updateTokenPack(id, pack),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tokenPacks"] })
            toast.success("Token pack updated successfully")
        },
        onError: (error) => {
            toast.error(`Failed to update token pack: ${error.message}`)
        },
    })

    // Delete token pack
    const deletePackMutation = useMutation({
        mutationFn: (id) => deleteTokenPack(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tokenPacks"] })
            toast.success("Token pack deleted successfully")
        },
        onError: (error) => {
            toast.error(`Failed to delete token pack: ${error.message}`)
        },
    })

    return {
        packs,
        isLoading,
        error,
        createPack: createPackMutation.mutate,
        updatePack: updatePackMutation.mutate,
        deletePack: deletePackMutation.mutate,
        isCreating: createPackMutation.isPending,
        isUpdating: updatePackMutation.isPending,
        isDeleting: deletePackMutation.isPending,
    }
}
