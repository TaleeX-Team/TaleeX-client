import apiClient from "./apiAuth";

// Get all applications for a specific job by ID
export const getJobApplications = async (jobId) => {
  try {
    console.log(`Fetching applications for job ID: ${jobId}`);
    const response = await apiClient.get(`/jobs/${jobId}/applications`);
    console.log("Job applications fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      `Failed to fetch applications for job ${jobId}:`,
      error.response?.data || error?.response?.data?.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch job applications"
    );
  }
};
export const advanceToCVReview = async (jobId, applicationIds) => {
  try {
    console.log("Advancing applications to CV review:", {
      jobId,
      applicationIds,
    });
    const response = await apiClient.post(
      `/jobs/${jobId}/applications/cv-review`,
      { applicationIds },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Applications advanced successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Failed to advance applications:",
      error?.response?.data?.message
    );
    throw error;
  }
};
export const scheduleInterviews = async (
  jobId,
  applicationIds,
  interviewDetails,
  questionCount,
  expiryDate
) => {
  try {
    console.log("Scheduling interviews:", {
      jobId,
      applicationIds,
      interviewDetails,
      questionCount,
      expiryDate,
    });
    const payload = {
      applicationIds,
      type: interviewDetails,
      questionCount,
    };
    if (expiryDate !== null) {
      payload.expiryDate = expiryDate;
    }
    const response = await apiClient.post(
      `/jobs/${jobId}/applications/sending-interview`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Interviews scheduled successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Failed to schedule interviews:",
      error?.response?.data?.message
    );
    throw error;
  }
};
export const changeApplicationStage = async (applicationIds, stage) => {
  try {
    console.log("Changing application stage:", {
      applicationIds,
      stage,
    });
    const response = await apiClient.post(
      `/applications/change-stage`,
      { applicationIds, stage },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Application stage changed successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Failed to change application stage:",
      error?.response?.data?.message
    );
    throw error;
  }
};
export const moveToFinalFeedback = async (applicationIds) => {
  try {
    console.log("Moving to final feedback stage:", {
      applicationIds,
    });
    const response = await apiClient.post(
      `/applications/final-feedback`,
      { applicationIds },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Application stage changed successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Failed to change application stage:",
      error?.response?.data?.message
    );
    throw error;
  }
};
