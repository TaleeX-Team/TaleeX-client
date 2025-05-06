"use client"

import {getJobs, createJob, deleteJob, updateJob, shareJobToLinkedIn, filterJobs, getJobById} from "@/services/apiJobs"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import {toast} from "sonner";

export const useJobs = (initialFilters = {}) => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState(initialFilters);

  // Check if there are active filters
  const hasFilters = Object.values(filters).some((value) => {
    if (value === null || value === undefined || value === "") return false;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  });

  // Fetch all jobs
  const jobsQuery = useQuery({
    queryKey: ["jobs"],
    queryFn: getJobs,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });

  // Get job by ID - fixed to properly handle the job ID parameter
  const jobQuery = useQuery({
    queryKey: ["job", null], // Default to null ID to be replaced when needed
    queryFn: ({ queryKey }) => {
      const [_, jobId] = queryKey;
      if (!jobId) return null;
      return getJobById(jobId);
    },
    enabled: false, // Don't run automatically
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });

  // Function to fetch a specific job by ID
  const fetchJob = async (id) => {
    return queryClient.fetchQuery({
      queryKey: ["job", id],
      queryFn: () => getJobById(id),
      staleTime: 5 * 60 * 1000,
    });
  };

  // Clean up filters for the API
  const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => {
        if (value === null || value === undefined || value === "") return false;
        if (Array.isArray(value)) return value.length > 0;
        return true;
      })
  );

  // Fetch filtered jobs only if filters are active
  const filteredJobsQuery = useQuery({
    queryKey: ["jobs", "filter", cleanFilters],
    queryFn: () => filterJobs(cleanFilters),
    enabled: hasFilters,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });

  // Set or update filters
  const setFilter = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    const cleanedUpdatedFilters = Object.fromEntries(
        Object.entries(updatedFilters).filter(([_, value]) => {
          if (value === null || value === undefined || value === "") return false;
          if (Array.isArray(value)) return value.length > 0;
          return true;
        })
    );
    setFilters(cleanedUpdatedFilters);
    queryClient.invalidateQueries({ queryKey: ["jobs", "filter"] });
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
    queryClient.invalidateQueries({ queryKey: ["jobs", "filter"] });
  };

  // Create a job
  const createJobMutation = useMutation({
    mutationFn: createJob,
    onSuccess: (newJob) => {
      console.log("Job created:", newJob)
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
      queryClient.invalidateQueries({ queryKey: ["jobs", "filter"] })
    },
    onError: (error) => {
      toast.error( error?.response?.data?.message)
    },
  })

  // Delete a job
  const deleteJobMutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: (deletedJob) => {
      console.log("Job deleted:", deletedJob)
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
      queryClient.invalidateQueries({ queryKey: ["jobs", "filter"] })
    },
    onError: (error) => {
      toast.error( error?.response?.data?.message)
    },
  })

  // Update a job
  const updateJobMutation = useMutation({
    mutationFn: updateJob,
    onSuccess: (updatedJob) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
      queryClient.invalidateQueries({ queryKey: ["jobs", "filter"] })
      console.log("Job updated:", updatedJob)

    },
    onError: (error) => {
      toast.error( error?.response?.data?.message)
    },
  })

  // Share to LinkedIn
  const shareJobMutation = useMutation({
    mutationFn: shareJobToLinkedIn,
    onSuccess: (res) => {
      console.log("Job shared to LinkedIn:", res)
    },
    onError: (error) => {
      toast.error( error?.response?.data?.message)
    },
  })

  return {
    jobsQuery,
    jobQuery,
    fetchJob, // New utility function to fetch a job by ID
    createJobMutation,
    deleteJobMutation,
    updateJobMutation,
    shareJobMutation,
    filteredJobsQuery,
    clearFilters,
    setFilter,
    hasFilters,
  }
}