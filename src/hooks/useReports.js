import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {adminApiClient} from "@/services/apiAuth.js";

// API functions
const fetchReports = async (params) => {
    const { data } = await adminApiClient.get("/reports", { params })
    return data
}

const fetchFilteredReports = async (params) => {
    const { data } = await adminApiClient.get("/reports/filter", { params })
    return data
}

const fetchReportById = async (id) => {
    if (!id) return null
    const { data } = await adminApiClient.get(`reports/${id}`)
    return data
}

const updateReportStatus = async ({ id, status }) => {
    const { data } = await adminApiClient.patch(
        `reports/${id}/status`,
        { status },
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        },
    )
    return data
}

export const useGetReports = (params) => {
    return useQuery({
        queryKey: ["reports", params],
        queryFn: () => fetchReports(params || undefined),
        enabled: params !== null,
    })
}

export const useFilterReports = (params) => {
    return useQuery({
        queryKey: ["filteredReports", params],
        queryFn: () => fetchFilteredReports(params ),
        enabled: params !== null,
})
}

export const useGetReportById = (id) => {
    return useQuery({
        queryKey: ["report", id],
        queryFn: () => fetchReportById(id),
        enabled: !!id,
    })
}

export const useUpdateReportStatus = (options) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: updateReportStatus,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["reports"] })
            queryClient.invalidateQueries({ queryKey: ["filteredReports"] })
            queryClient.invalidateQueries({ queryKey: ["report", variables.id] })

            if (options?.onSuccess) {
                options.onSuccess(data)
            }
        },
        onError: (error) => {
            if (options?.onError) {
                options.onError(error)
            }
        },
    })
}
