// This file contains utility functions for formatting data for charts
// These can be used by both the admin dashboard and analytics page

export const formatApplicationsByStageForChart = (applicationsByStageData) => {
    if (!applicationsByStageData?.length) return []
    return applicationsByStageData.map((item) => ({
        name: item.stage.charAt(0).toUpperCase() + item.stage.slice(1).replace("-", " "),
        value: item.count,
    }))
}

export const formatInterviewsByStateForChart = (interviewsByStateData) => {
    if (!interviewsByStateData?.length) return []
    return interviewsByStateData.map((item) => ({
        name: item.state.charAt(0).toUpperCase() + item.state.slice(1).replace("-", " "),
        value: item.count,
    }))
}

export const formatConversionFunnelForChart = (conversionFunnelData) => {
    if (!conversionFunnelData?.length) return []
    return conversionFunnelData.map((item) => ({
        name: item.stage.charAt(0).toUpperCase() + item.stage.slice(1).replace("-", " "),
        count: item.count,
        rate: item.rate,
    }))
}

export const formatTopAppliedJobsForChart = (topAppliedJobsData, limit = 5) => {
    if (!topAppliedJobsData?.length) return []
    return topAppliedJobsData.slice(0, limit).map((item) => ({
        name: item.jobTitle,
        applications: item.count,
    }))
}

export const formatDailyApplicationsForChart = (dailyApplicationsData) => {
    if (!dailyApplicationsData?.length) return []
    return dailyApplicationsData.map((item) => ({
        name: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        applications: item.count,
    }))
}

export const formatJobsByCompanyForChart = (jobsByCompanyData) => {
    if (!jobsByCompanyData?.length) return []
    return jobsByCompanyData.map((item) => ({
        name: item.company,
        value: item.count,
    }))
}

export const formatDailyRegistrationsForChart = (dailyRegistrationsData) => {
    if (!dailyRegistrationsData?.length) return []
    return dailyRegistrationsData.map((item) => ({
        name: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        registrations: item.count,
    }))
}

// Calculate totals for statistics
export const calculateTotalApplications = (applicationsByStageData) => {
    return applicationsByStageData?.reduce((sum, item) => sum + item.count, 0) || 0
}

export const calculateTotalInterviews = (interviewsByStateData) => {
    return interviewsByStateData?.reduce((sum, item) => sum + item.count, 0) || 0
}

export const findPendingApplications = (applicationsByStageData) => {
    return (
        applicationsByStageData?.find(
            (item) =>
                item.stage.toLowerCase() === "sending interview" ||
                item.stage.toLowerCase() === "pending" ||
                item.stage.toLowerCase() === "in-progress",
        )?.count || 0
    )
}

export const findRejectedApplications = (applicationsByStageData) => {
    return applicationsByStageData?.find((item) => item.stage.toLowerCase() === "rejected")?.count || 0
}
