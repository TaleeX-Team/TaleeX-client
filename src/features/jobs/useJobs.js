import {
    getJobs,
    createJob,
    deleteJob,
    updateJob,
    getJobById,
    shareJobToLinkedIn,
    filterJobs,
  } from "@/services/apiJobs";
  
  import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
  
  export const useJobs = () => {
    const queryClient = useQueryClient();
  
    //Fetch all jobs
    const jobsQuery = useQuery({
      queryKey: ["jobs"],
      queryFn: getJobs,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: false,
      onSuccess: (data) => {
        console.log("Jobs fetched:", data);
      },
      onError: (error) => {
        console.error(" Fetch jobs failed:", error.message);
      },
    });
  
    //Create a job
    const createJobMutation = useMutation({
      mutationFn: createJob,
      onSuccess: (newJob) => {
        console.log("Job created:", newJob);
        queryClient.invalidateQueries({ queryKey: ["jobs"] });
      },
      onError: (error) => {
        console.error(" Create job failed:", error.message);
      },
    });
  
    //  Delete a job
    const deleteJobMutation = useMutation({
      mutationFn: deleteJob,
      onSuccess: (deletedJob) => {
        console.log(" Job deleted:", deletedJob);
        queryClient.invalidateQueries({ queryKey: ["jobs"] });
      },
      onError: (error) => {
        console.error(" Delete job failed:", error.message);
      },
    });
  
    // Update a job
    const updateJobMutation = useMutation({
      mutationFn: updateJob,
      onSuccess: (updatedJob) => {
        console.log(" Job updated:", updatedJob);
        queryClient.invalidateQueries({ queryKey: ["jobs"] });
      },
      onError: (error) => {
        console.error(" Update job failed:", error.message);
      },
    });
  
    //  Share to LinkedIn
    const shareJobMutation = useMutation({
      mutationFn: shareJobToLinkedIn,
      onSuccess: (res) => {
        console.log(" Job shared to LinkedIn:", res);
      },
      onError: (error) => {
        console.error(" Share to LinkedIn failed:", error.message);
      },
    });
  
    // Filter jobs
    const useFilteredJobs = (filters) => {
      return useQuery({
      queryKey: ["jobs", filters],
      queryFn: () => filterJobs(filters),
      enabled:Object.values(filters).some((val)=>val!=="") ,// will only run if filters are applied
      staleTime: 5 * 60 * 1000,
      });
      };
  
    return {
      jobsQuery, // { data, isLoading, isError }
      createJobMutation,
      deleteJobMutation,
      updateJobMutation,
      shareJobMutation,
      useFilteredJobs,
    };
  };