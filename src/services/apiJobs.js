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
export async function filterJobs(filters = {}) {
  try {
    const params = new URLSearchParams();

    // Add each filter to the params
    Object.entries(filters).forEach(([key, value]) => {
      // Handle arrays (like tags)
      if (Array.isArray(value)) {
        value.forEach(item => params.append(key, item));
      } else {
        params.append(key, value);
      }
    });

    // Log the request for debugging
    console.log("Filtering jobs with params:", Object.fromEntries(params.entries()));

    const response = await apiClient.get(`/jobs/filter`, { params });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error(error.response?.data?.message || "Failed to filter jobs");
  }
}

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