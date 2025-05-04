import { useQuery } from '@tanstack/react-query';
import { getInterviewHeaderInfo, getInterviewQuestions } from "@/services/apiAuth.js";

export const useInterviewData = (interviewId) => {
    return useQuery({
        queryKey: ['interview', interviewId],
        queryFn: () => getInterviewHeaderInfo(interviewId),
        enabled: !!interviewId,
        retry: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useStartInterview = (interviewId) => {
    return useQuery({
        queryKey: ['startInterview', interviewId],
        queryFn: () => getInterviewQuestions(interviewId),
        enabled: false,
        retry: false,
        staleTime: 5 * 60 * 1000,
    });
};