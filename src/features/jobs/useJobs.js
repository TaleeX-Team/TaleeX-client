"use client"

import { getJobs, createJob, deleteJob, updateJob, shareJobToLinkedIn, filterJobs } from "@/services/apiJobs"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

export const useJobs = (initialFilters = {}) => {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState(initialFilters)

  // Fetch all jobs
  const jobsQuery = useQuery({
    queryKey: ["jobs"],
    queryFn: getJobs,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
    onSuccess: (data) => {
      console.log("Jobs fetched:", data)
    },
    onError: (error) => {
      console.error("Fetch jobs failed:", error.message)
    },
  })

  // Create a job
  const createJobMutation = useMutation({
    mutationFn: createJob,
    onSuccess: (newJob) => {
      console.log("Job created:", newJob)
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
      queryClient.invalidateQueries({ queryKey: ["filteredJobs"] })
    },
    onError: (error) => {
      console.error("Create job failed:", error.message)
    },
  })

  // Delete a job
  const deleteJobMutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: (deletedJob) => {
      console.log("Job deleted:", deletedJob)
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
      queryClient.invalidateQueries({ queryKey: ["filteredJobs"] })
    },
    onError: (error) => {
      console.error("Delete job failed:", error.message)
    },
  })

  // Update a job
  const updateJobMutation = useMutation({
    mutationFn: updateJob,
    onSuccess: (updatedJob) => {
      console.log("Job updated:", updatedJob)
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
      queryClient.invalidateQueries({ queryKey: ["filteredJobs"] })
    },
    onError: (error) => {
      console.error("Update job failed:", error.message)
    },
  })

  // Share to LinkedIn
  const shareJobMutation = useMutation({
    mutationFn: shareJobToLinkedIn,
    onSuccess: (res) => {
      console.log("Job shared to LinkedIn:", res)
    },
    onError: (error) => {
      console.error("Share to LinkedIn failed:", error.message)
    },
  })

  // Clean up filters by removing empty values
  const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => {
        // Keep values that are not empty strings, null, or undefined
        if (value === null || value === undefined || value === "") return false
        // For arrays, keep only if they have items
        if (Array.isArray(value)) return value.length > 0
        return true
      }),
  )

  // Check if we have any filters to apply
  const hasFilters = Object.keys(cleanFilters).length > 0

  const filteredJobsQuery = useQuery({
    queryKey: ["jobs", "filter", cleanFilters],
    queryFn: () => filterJobs(cleanFilters),
    enabled: hasFilters, // Only run if we have filters
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
    onSuccess: (data) => {
      console.log("Filtered jobs fetched:", data)
    },
    onError: (error) => {
      console.error("Filter jobs failed:", error.message)
    },
  })

  const setFilter = (newFilters) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }))
  }

  return {
    jobsQuery, // { data, isLoading, isError }
    createJobMutation,
    deleteJobMutation,
    updateJobMutation,
    shareJobMutation,
    filteredJobsQuery,
    setFilter,
  }
}
