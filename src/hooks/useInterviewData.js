import {useMutation, useQuery} from '@tanstack/react-query';
import {getInterviewHeaderInfo, getInterviewQuestions} from "@/services/apiAuth.js";


export const useInterviewData = (interviewId) => {
    return useQuery({
        queryKey: ['interview', interviewId],
        queryFn:getInterviewHeaderInfo,
        enabled: !!interviewId,
        retry: 1,
        staleTime: 5 * 60 * 1000,
    });
};


export const useStartInterview = (interviewId) => {
    return useMutation({
        mutationKey: ['startInterview', interviewId],
        mutationFn: getInterviewQuestions,
        onError: (error) => {
            console.error('Error starting interview:', error);
        }
    });
};