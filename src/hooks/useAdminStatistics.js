import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    getApplicationsByStage, getAvgTimePerStage, getConversionFunnel,
    getDailyApplications,
    getDailyRegistrations, getInterviewsByState,
    getJobsByCompany, getReportsByReason, getTimeToOfferPerJob, getTopAppliedJobs
} from "@/services/apiAuth.js";

// Format date to DD-MM-YYYY
const formatDateParam = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`; //YYYY-MM-DD
};

// Get current date and date 30 days ago
const getDefaultDateRange = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    return {
        from: formatDateParam(thirtyDaysAgo),
        to: formatDateParam(today),
    };
};

// Common query options with error handling
const createQueryOptions = (queryName, options = {}) => ({
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    cacheTime: Infinity,
    onError: (error) => {
        console.error(`Error fetching ${queryName}:`, error);
        toast.error(`Failed to load ${queryName}: ${error.message || 'Unknown error'}`);
    },
    ...options,
});

// Helper function to prepare date range parameters
const prepareDateRange = (from, to) => {
    const defaultRange = getDefaultDateRange();
    return {
        from: typeof from === 'string' && from ? from : defaultRange.from,
        to: typeof to === 'string' && to ? to : defaultRange.to
    };
};

// Hook for applications by stage
export const useApplicationsByStage = (from, to, options = {}) => {
    const dateRange = prepareDateRange(from, to);

    return useQuery({
        queryKey: ["applications-by-stage", dateRange.from, dateRange.to],
        queryFn: () => getApplicationsByStage(dateRange),
        ...createQueryOptions("applications by stage", options),
    });
};

// Hook for daily applications
export const useDailyApplications = (from, to, options = {}) => {
    const dateRange = prepareDateRange(from, to);

    return useQuery({
        queryKey: ["daily-applications", dateRange.from, dateRange.to],
        queryFn: () => getDailyApplications(dateRange),
        ...createQueryOptions("daily applications", options),
    });
};

// Hook for jobs by company
export const useJobsByCompany = (from, to, options = {}) => {
    const dateRange = prepareDateRange(from, to);

    return useQuery({
        queryKey: ["jobs-by-company", dateRange.from, dateRange.to],
        queryFn: () => getJobsByCompany(dateRange),
        ...createQueryOptions("jobs by company", options),
    });
};

// Hook for daily registrations
export const useDailyRegistrations = (from, to, options = {}) => {
    const dateRange = prepareDateRange(from, to);

    return useQuery({
        queryKey: ["daily-registrations", dateRange.from, dateRange.to],
        queryFn: () => getDailyRegistrations(dateRange),
        ...createQueryOptions("daily registrations", options),
    });
};

// Hook for reports by reason
export const useReportsByReason = (from, to, options = {}) => {
    const dateRange = prepareDateRange(from, to);

    return useQuery({
        queryKey: ["reports-by-reason", dateRange.from, dateRange.to],
        queryFn: () => getReportsByReason(dateRange),
        ...createQueryOptions("reports by reason", options),
    });
};

// Hook for interviews by state
export const useInterviewsByState = (from, to, options = {}) => {
    const dateRange = prepareDateRange(from, to);

    return useQuery({
        queryKey: ["interviews-by-state", dateRange.from, dateRange.to],
        queryFn: () => getInterviewsByState(dateRange),
        ...createQueryOptions("interviews by state", options),
    });
};

// Hook for average time per stage
export const useAvgTimePerStage = (from, to, options = {}) => {
    const dateRange = prepareDateRange(from, to);

    return useQuery({
        queryKey: ["avg-time-per-stage", dateRange.from, dateRange.to],
        queryFn: () => getAvgTimePerStage(dateRange),
        ...createQueryOptions("average time per stage", options),
    });
};

// Hook for conversion funnel
export const useConversionFunnel = (from, to, options = {}) => {
    const dateRange = prepareDateRange(from, to);

    return useQuery({
        queryKey: ["conversion-funnel", dateRange.from, dateRange.to],
        queryFn: () => getConversionFunnel(dateRange),
        ...createQueryOptions("conversion funnel", options),
    });
};

// Hook for time to offer per job
export const useTimeToOfferPerJob = (from, to, options = {}) => {
    const dateRange = prepareDateRange(from, to);

    return useQuery({
        queryKey: ["time-to-offer-per-job", dateRange.from, dateRange.to],
        queryFn: () => getTimeToOfferPerJob(dateRange),
        ...createQueryOptions("time to offer per job", options),
    });
};

// Hook for top applied jobs
export const useTopAppliedJobs = (from, to, options = {}) => {
    const dateRange = prepareDateRange(from, to);

    return useQuery({
        queryKey: ["top-applied-jobs", dateRange.from, dateRange.to],
        queryFn: () => getTopAppliedJobs(dateRange),
        ...createQueryOptions("top applied jobs", options),
    });
};

export const useAllStatistics = (dateRange = {}) => {
    const defaultRange = getDefaultDateRange();

    // Extract date strings properly
    let from, to;
    if (dateRange && typeof dateRange === 'object') {
        from = dateRange.from || defaultRange.from;
        to = dateRange.to || defaultRange.to;
    } else {
        from = defaultRange.from;
        to = defaultRange.to;
    }

    const applicationsByStage = useApplicationsByStage(from, to);
    const dailyApplications = useDailyApplications(from, to);
    const jobsByCompany = useJobsByCompany(from, to);
    const dailyRegistrations = useDailyRegistrations(from, to);
    const reportsByReason = useReportsByReason(from, to);
    const interviewsByState = useInterviewsByState(from, to);
    const avgTimePerStage = useAvgTimePerStage(from, to);
    const conversionFunnel = useConversionFunnel(from, to);
    const timeToOfferPerJob = useTimeToOfferPerJob(from, to);
    const topAppliedJobs = useTopAppliedJobs(from, to);

    const queries = [
        applicationsByStage,
        dailyApplications,
        jobsByCompany,
        dailyRegistrations,
        reportsByReason,
        interviewsByState,
        avgTimePerStage,
        conversionFunnel,
        timeToOfferPerJob,
        topAppliedJobs
    ];

    const isLoading = queries.some(query => query.isLoading);
    const isError = queries.some(query => query.isError);
    const errors = queries.filter(query => query.isError).map(query => query.error);

    // Show a comprehensive error toast if multiple statistics fail to load
    if (isError && errors.length > 1) {
        errors.forEach(error => {
            toast.error(error.response?.data?.message || error.message || 'Unknown error');
        });
    }

    return {
        applicationsByStage: applicationsByStage.data?.data || [],
        dailyApplications: dailyApplications.data?.data || [],
        jobsByCompany: jobsByCompany.data?.data || [],
        dailyRegistrations: dailyRegistrations.data?.data || [],
        reportsByReason: reportsByReason.data?.data || [],
        interviewsByState: interviewsByState.data?.data || [],
        avgTimePerStage: avgTimePerStage.data?.data || [],
        conversionFunnel: conversionFunnel.data?.data || [],
        timeToOfferPerJob: timeToOfferPerJob.data?.data || [],
        topAppliedJobs: topAppliedJobs.data?.data || [],
        isLoading,
        isError,
        errors,
        refetch: () => {
            return Promise.all(queries.map(query => query.refetch()))
                .then(() => {
                    toast.success("Statistics refreshed successfully");
                })
                .catch((error) => {
                    toast.error(`Failed to refresh statistics: ${error.message || 'Unknown error'}`);
                });
        },
    };
};