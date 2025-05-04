import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ApplicantsTab } from "./current-applicants-tab.jsx";
import { RejectedApplicantsTab } from "./rejected-applicants-tab.jsx";
import { AllApplicantsTab } from "./all-applicants-tab.jsx";
import JobDetailsPage from "../jobDetails";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
  getJobApplications,
  advanceToCVReview,
  scheduleInterviews,
  changeApplicationStage,
  // sendVideoInterview,
} from "@/services/apiApplications";
import { getJobById } from "@/services/apiJobs.js";

// Define the application phases
const PHASES = [
  "Applications",
  "CV Review",
  "Sending Interview",
  "Interview Feedback",
  "Final Feedback",
];

// Generate a unique ID for client-side operations
const generateId = () => Math.random().toString(36).substring(2, 9);

export default function JobApplicationManager() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [activePhase, setActivePhase] = useState("Applications");
  const [searchQuery, setSearchQuery] = useState("");
  const { id } = useParams();
  const queryClient = useQueryClient();

  // Fetch job applications using react-query
  const {
    data: applicantsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["job/applicants", id],
    queryFn: () => getJobApplications(id),
    enabled: !!id,
  });
  const { data: job } = useQuery({
    queryKey: ["job", id],
    queryFn: () => getJobById(id),
    enabled: !!id,
  });

  // Mutation for advancing applications to CV Review
  const advanceToCVReviewMutation = useMutation({
    mutationFn: ({ jobId, applicationIds }) =>
      advanceToCVReview(jobId, applicationIds),
    onMutate: async ({ jobId, applicationIds }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["job/applicants", id] });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(["job/applicants", id]);

      // Optimistically update the cache
      queryClient.setQueryData(["job/applicants", id], (old) => {
        if (!old || !old.applications) return old;
        return {
          ...old,
          applications: old.applications.map((app) =>
            applicationIds.includes(app._id)
              ? {
                  ...app,
                  stage: "cv review",
                  updatedAt: new Date().toISOString(),
                }
              : app
          ),
        };
      });

      // Clear selected applicants optimistically
      setSelectedApplicants([]);

      // Return context with previous data for rollback
      return { previousData };
    },
    onSuccess: () => {
      // Invalidate to refetch and sync with server
      queryClient.invalidateQueries({ queryKey: ["job/applicants", id] });
    },
    onError: (err, variables, context) => {
      // Rollback to previous data on error
      queryClient.setQueryData(["job/applicants", id], context.previousData);
      console.error(
        "Failed to advance applications to CV review:",
        err.message
      );
    },
    onSettled: () => {
      // Ensure queries are invalidated after success or error
      queryClient.invalidateQueries({ queryKey: ["job/applicants", id] });
    },
  });

  const sendVideoInterviewMutation = useMutation({
    mutationFn: ({ jobId, applicationIds, interviewTypes, questionCount }) =>
      scheduleInterviews(jobId, applicationIds, interviewTypes, questionCount),
    onMutate: async ({ jobId, applicationIds }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["job/applicants", id] });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(["job/applicants", id]);

      // Optimistically update the cache
      queryClient.setQueryData(["job/applicants", id], (old) => {
        if (!old || !old.applications) return old;
        return {
          ...old,
          applications: old.applications.map((app) =>
            applicationIds.includes(app._id)
              ? {
                  ...app,
                  stage: "Pending Interview",
                  updatedAt: new Date().toISOString(),
                }
              : app
          ),
        };
      });

      // Clear selected applicants optimistically
      setSelectedApplicants([]);

      // Return context with previous data for rollback
      return { previousData };
    },
    onSuccess: () => {
      // Invalidate to refetch and sync with server
      queryClient.invalidateQueries({ queryKey: ["job/applicants", id] });
    },
    onError: (err, variables, context) => {
      // Rollback to previous data on error
      queryClient.setQueryData(["job/applicants", id], context.previousData);
      console.error("Failed to send video interviews:", err.message);
    },
    onSettled: () => {
      // Ensure queries are invalidated after success or error
      queryClient.invalidateQueries({ queryKey: ["job/applicants", id] });
    },
  });
  const rejectApplicationsMutation = useMutation({
    mutationFn: ({ applicantIds }) =>
      changeApplicationStage(applicantIds, "reject"),
    onMutate: async ({ applicantIds }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["job/applicants", id] });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(["job/applicants", id]);

      // Optimistically update the cache
      queryClient.setQueryData(["job/applicants", id], (old) => {
        if (!old || !old.applications) return old;
        return {
          ...old,
          applications: old.applications.map((app) =>
            applicantIds.includes(app._id)
              ? {
                  ...app,
                  stage: "rejected",
                  updatedAt: new Date().toISOString(),
                }
              : app
          ),
        };
      });

      // Clear selected applicants optimistically
      setSelectedApplicants([]);

      // Return context with previous data for rollback
      return { previousData };
    },
    onSuccess: () => {
      // Invalidate to refetch and sync with server
      queryClient.invalidateQueries({ queryKey: ["job/applicants", id] });
    },
    onError: (err, variables, context) => {
      // Rollback to previous data on error
      queryClient.setQueryData(["job/applicants", id], context.previousData);
      console.error("Failed to reject applications:", err.message);
    },
    onSettled: () => {
      // Ensure queries are invalidated after success or error
      queryClient.invalidateQueries({ queryKey: ["job/applicants", id] });
    },
  });

  // Map fetched data to match component's expected structure
  const applicants =
    applicantsData?.applications?.map((app) => ({
      id: app._id || generateId(),
      name: app.name,
      email: app.email,
      applied: app.createdAt,
      assignee: app.group?.[0] || null,
      cvScore: app?.feedback?.cv?.matchScore,
      phase:
        app.stage === "applied"
          ? "Applications"
          : app.stage === "cv review"
          ? "CV Review"
          : app.stage === "sending interview"
          ? "Sending Interview"
          : app.stage,
      rejected: app.stage === "rejected",
      rejectedOn: app.stage === "rejected" ? app.createdAt : null,
      rejectedBy: app.stage === "rejected" ? app.group?.[0] || null : null,
      notes: app.notes,
      linkedIn: app.linkedIn,
      feedback: app.feedback,
      cvUrl: app.cv.file.url,
    })) || [];

  // Filter applicants based on active tab, phase, and search query
  const filteredApplicants = applicants.filter((applicant) => {
    const matchesSearch =
      searchQuery === "" ||
      applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "applicants") {
      return (
        applicant.phase === activePhase && !applicant.rejected && matchesSearch
      );
    } else if (activeTab === "rejected") {
      return applicant.rejected && matchesSearch;
    } else if (activeTab === "all") {
      return matchesSearch;
    }
    return matchesSearch;
  });

  // Count applicants in each phase
  const phaseCounts = PHASES.reduce((acc, phase) => {
    acc[phase] = applicants.filter(
      (a) => a.phase === phase && !a.rejected
    ).length;
    return acc;
  }, {});

  // Handle moving applicants to CV Review
  const moveToCVReview = () => {
    if (selectedApplicants.length === 0) return;
    advanceToCVReviewMutation.mutate({
      jobId: id,
      applicationIds: selectedApplicants,
    });
  };

  // Handle rejecting applicants
  const rejectApplicants = () => {
    if (selectedApplicants.length === 0) return;
    rejectApplicationsMutation.mutate({
      applicantIds: selectedApplicants,
      stage: "reject",
    });
  };
  // Handle sending video interviews
  const handleSendInterview = ({
    interviewTypes,
    questionCount,
    selectedApplicants,
  }) => {
    console.log("Selected applicants for interview:", questionCount);
    sendVideoInterviewMutation.mutate({
      jobId: id,
      applicationIds: selectedApplicants,
      interviewTypes,
      questionCount,
    });
  };

  // Handle selecting all applicants
  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelectedApplicants(filteredApplicants.map((a) => a.id));
    } else {
      setSelectedApplicants([]);
    }
  };

  // Handle selecting individual applicant
  const toggleSelectApplicant = (id, checked) => {
    if (checked) {
      setSelectedApplicants((prev) => [...prev, id]);
    } else {
      setSelectedApplicants((prev) =>
        prev.filter((applicantId) => applicantId !== id)
      );
    }
  };

  // Render loading skeleton
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 dark:text-gray-200">
        <div className="flex justify-between items-center mb-6">
          <div className="h-9 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="w-full">
          <div className="flex items-center border-b dark:border-gray-700 mb-4">
            <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mr-4"></div>
            <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mr-4"></div>
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mr-4"></div>
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="mt-6 space-y-4">
            <div className="h-16 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-16 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-16 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6 dark:text-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold dark:text-white">{job?.title}</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <ExternalLink className="h-4 w-4" />
            Job site
          </Button>
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
          >
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            Open
          </Badge>
        </div>
      </div>

      <div className="w-full">
        <div className="flex items-center border-b dark:border-gray-700 mb-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`relative px-4 py-3 font-medium text-sm transition-colors ${
              activeTab === "overview"
                ? "text-black dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Overview
            {activeTab === "overview" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("applicants")}
            className={`relative px-4 py-3 font-medium text-sm transition-colors ${
              activeTab === "applicants"
                ? "text-black dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Applicants
            {activeTab === "applicants" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("rejected")}
            className={`relative px-4 py-3 font-medium text-sm transition-colors ${
              activeTab === "rejected"
                ? "text-black dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Rejected Applicants
            {activeTab === "rejected" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`relative px-4 py-3 font-medium text-sm transition-colors ${
              activeTab === "all"
                ? "text-black dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            All Applicants
            {activeTab === "all" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white"></span>
            )}
          </button>
        </div>

        {activeTab === "overview" && (
          <div className="mt-6">
            <JobDetailsPage />
          </div>
        )}

        {activeTab === "applicants" && (
          <ApplicantsTab
            PHASES={PHASES}
            phaseCounts={phaseCounts}
            filteredApplicants={filteredApplicants}
            selectedApplicants={selectedApplicants}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            toggleSelectAll={toggleSelectAll}
            toggleSelectApplicant={toggleSelectApplicant}
            moveToCVReview={moveToCVReview}
            rejectApplicants={rejectApplicants}
            activePhase={activePhase}
            setActivePhase={setActivePhase}
            onSendInterview={handleSendInterview}
          />
        )}

        {activeTab === "rejected" && (
          <RejectedApplicantsTab
            filteredApplicants={filteredApplicants}
            selectedApplicants={selectedApplicants}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            toggleSelectAll={toggleSelectAll}
            toggleSelectApplicant={toggleSelectApplicant}
          />
        )}

        {activeTab === "all" && (
          <AllApplicantsTab
            filteredApplicants={filteredApplicants}
            selectedApplicants={selectedApplicants}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            toggleSelectAll={toggleSelectAll}
            toggleSelectApplicant={toggleSelectApplicant}
          />
        )}
      </div>
    </div>
  );
}
