import apiClient from "./apiAuth";

//Get all jobs
export const getJobs = async () => {
  try {
    console.log("Fetching jobs");
    const response = await apiClient.get("/jobs");
    console.log("Jobs fetched successfully:", response.data);
    console.log("Jobs fetched successfully");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch jobs:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch jobs");
  }
};

// Create a new job
export const createJob = async (jobData) => {
  try {
    console.log("Creating job:", jobData);
    const response = await apiClient.post("/jobs", jobData);
    console.log("Job created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to create job:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to create job");
  }
};

// Get a single job by ID
export const getJobById = async (id) => {
  try {
    console.log(`Fetching job with ID: ${id}`);
    const response = await apiClient.get(`/jobs/${id}`);
    console.log("Job fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch job ${id}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch job");
  }
};

// Update a job
export const updateJob = async ({ id, updates }) => {
  try {
    console.log(`Updating job with ID: ${id}`, updates);
    const response = await apiClient.patch(`/jobs/${id}`, updates);
    console.log("Job updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Failed to update job ${id}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update job");
  }
};

//Delete (soft delete) a job
export const deleteJob = async (id) => {
  try {
    console.log(`Deleting job with ID: ${id}`);
    const response = await apiClient.delete(`/jobs/${id}`);
    console.log("Job deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Failed to delete job ${id}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to delete job");
  }
};

// 🔹 Filter jobs (for authenticated user)
export const filterJobs = async (filters = {}) => {
  try {
    console.log("Filtering jobs with filters:", filters);
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        params.append(key, value);
      }
    });

    const response = await apiClient.get("/jobs/filter", { params });
    console.log("Jobs filtered successfully:", response.data);
    return response.data || { jobs: [] };
  } catch (error) {
    console.error("Failed to filter jobs:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to filter jobs");
  }
};

//  Share job to LinkedIn
export const shareJobToLinkedIn = async (id) => {
  try {
    console.log(`Sharing job with ID: ${id} to LinkedIn`);
    const response = await apiClient.get(`/jobs/${id}/share/linkedin`);
    console.log("Job shared to LinkedIn successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Failed to share job ${id} on LinkedIn:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to share job on LinkedIn");
  }
};