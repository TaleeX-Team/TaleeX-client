import { useState } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { getJobApplicationForm, submitJobApplication } from "@/services/apiAuth.js"

export function useJobApplication(jobId) {
    const [isSubmitSuccess, setIsSubmitSuccess] = useState(false)

    // Fetch job details
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["jobApplication", jobId],
        queryFn: async () => {
            return await getJobApplicationForm(jobId)
        },
        enabled: !!jobId,
        retry: 1,
    })

    // Submit application mutation
    const { mutateAsync, isPending: isSubmitting } = useMutation({
        mutationFn: async (formData) => {
            return await submitJobApplication(jobId, formData)
        },
        onSuccess: () => {
            setIsSubmitSuccess(true)
            // Scroll to top to show success message
            window.scrollTo({ top: 0, behavior: "smooth" })
        },
    })

    const submitApplication = async (formData) => {
        try {
            await mutateAsync(formData)
        } catch (error) {
            console.error("Failed to submit application:", error)
            throw error
        }
    }

    return {
        jobData: data,
        isLoading,
        isError,
        error,
        submitApplication,
        isSubmitting,
        isSubmitSuccess,
    }
}
