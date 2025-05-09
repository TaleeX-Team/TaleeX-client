import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Building2, ExternalLink, Globe, MapPin } from "lucide-react";
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
  moveToFinalFeedback,
} from "@/services/apiApplications";
import { getJobById } from "@/services/apiJobs.js";
import { toast } from "sonner";
import JobStatusBadge from "../ui/JobStatusBadge.jsx";
import { formatJoinDate } from "@/utils/functions.js";

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
  const [selectedApplicants, setSelectedApplicants] = useState([]); // Now stores { id, name } objects
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
  const { data: job, isLoading: isLoadingJob } = useQuery({
    queryKey: ["job", id],
    queryFn: () => getJobById(id),
    enabled: !!id,
  });

  const advanceToCVReviewMutation = useMutation({
    mutationFn: ({ jobId, applicationIds }) =>
      advanceToCVReview(jobId, applicationIds),
    onSuccess: (data, { jobId, applicationIds }) => {
      queryClient.invalidateQueries({ queryKey: ["job/applicants", id] });

      toast(
        `${selectedApplicants.length} ${
          selectedApplicants.length === 1 ? "applicant" : "applicants"
        } sent to CV Review`,
        {
          description: `${selectedApplicants.map((a) => a.name).join(", ")} ${
            selectedApplicants.length === 1 ? "has" : "have"
          } been sent from ${activePhase} to CV Review`,
          style: {
            backgroundColor: "#195f32",
            color: "white",
          },
        }
      );
      setSelectedApplicants([]);
    },
    onError: (err) => {
      console.error(
        "Failed to advance applications to CV review:",
        err.message
      );
    },
  });

  const sendVideoInterviewMutation = useMutation({
    mutationFn: ({
      jobId,
      applicationIds,
      interviewTypes,
      questionCount,
      expiryDate,
    }) =>
      scheduleInterviews(
        jobId,
        applicationIds,
        interviewTypes,
        questionCount,
        expiryDate
      ),
    onSuccess: (data, { jobId, applicationIds }) => {
      queryClient.invalidateQueries({ queryKey: ["job/applicants", id] });

      toast(
        `${selectedApplicants.length} ${
          selectedApplicants.length === 1 ? "applicant" : "applicants"
        } sent to Interview`,
        {
          description: `${selectedApplicants.map((a) => a.name).join(", ")} ${
            selectedApplicants.length === 1 ? "has" : "have"
          } been sent from ${activePhase} to Interview`,
          style: {
            backgroundColor: "#195f32",
            color: "white",
          },
        }
      );
      setSelectedApplicants([]);
    },
    onError: (err) => {
      console.error("Failed to send video interviews:", err.message);
    },
  });

  const rejectApplicationsMutation = useMutation({
    mutationFn: ({ applicantIds, stage, emailBody, emailSubject }) =>
      changeApplicationStage(applicantIds, stage, emailBody, emailSubject),
    onSuccess: (data, { applicantIds, stage }) => {
      queryClient.invalidateQueries({ queryKey: ["job/applicants", id] });

      toast(
        `${selectedApplicants.length} ${
          selectedApplicants.length === 1 ? "applicant" : "applicants"
        } moved to ${
          stage === "rejected" ? "Rejected Applicants" : "Offered Applicants"
        }`,
        {
          description: `${selectedApplicants.map((a) => a.name).join(", ")} ${
            selectedApplicants.length === 1 ? "has" : "have"
          } been moved from ${activePhase} to ${
            stage === "rejected" ? "Rejected" : "Offered"
          } Applicants`,
          style: {
            backgroundColor: `${stage === "rejected" ? "darkred" : "#195f32"}`,
            color: "white",
          },
        }
      );
      setSelectedApplicants([]);
    },
    onError: (err) => {
      console.error("Failed to reject applications:", err.message);
      toast.error("Failed to reject applications", {
        description: "Please try again later.",
      });
    },
  });

  const finalFeedbackMutation = useMutation({
    mutationFn: ({ applicationIds }) => moveToFinalFeedback(applicationIds),
    onSuccess: (data, { applicationIds }) => {
      queryClient.invalidateQueries({ queryKey: ["job/applicants", id] });

      toast(
        `${selectedApplicants.length} ${
          selectedApplicants.length === 1 ? "applicant" : "applicants"
        } moved to Final Feedback`,
        {
          description: `${selectedApplicants.map((a) => a.name).join(", ")} ${
            selectedApplicants.length === 1 ? "has" : "have"
          } been moved from ${activePhase} to Final Feedback`,
          style: {
            backgroundColor: "#1e88e5",
            color: "white",
          },
        }
      );
      setSelectedApplicants([]);
    },
    onError: (err) => {
      console.error(
        "Failed to move applications to final feedback:",
        err.message
      );
      toast.error("Failed to move applications to final feedback", {
        description: "Please try again later.",
      });
    },
  });

  // Map fetched data to match component's expected structure
  const applicants =
    applicantsData?.applications?.map((app) => ({
      id: app._id || generateId(),
      name: app.name,
      email: app.email,
      applied: formatJoinDate(app.createdAt),
      assignee: app.group?.[0] || null,
      cvScore: app?.feedback?.cv?.matchScore,
      phase:
        app.stage === "applied"
          ? "Applications"
          : app.stage === "cv review"
          ? "CV Review"
          : app.stage === "sending interview"
          ? "Sending Interview"
          : app.stage === "completed interview"
          ? "Interview Feedback"
          : app.stage === "final feedback"
          ? "Final Feedback"
          : app.stage,
      rejected: app.stage === "rejected",
      rejectedOn: app.stage === "rejected" ? app.createdAt : null,
      rejectedBy: app.stage === "rejected" ? app.group?.[0] || null : null,
      notes: app.notes,
      linkedIn: app.linkedIn,
      feedback: app.feedback,
      cvUrl: app.cv.file.url,
      images: app?.interview?.images,
      transcript: app?.interview?.transcript,
      summary: app?.interview?.summary,
      audio: app?.interview?.recordingUrl,
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
      applicationIds: selectedApplicants.map((a) => a.id),
    });
  };

  // Handle rejecting applicants
  const rejectApplicants = () => {
    if (selectedApplicants.length === 0) return;
    rejectApplicationsMutation.mutate({
      applicantIds: selectedApplicants.map((a) => a.id),
      stage: "rejected",
    });
  };

  const offerApplicants = ({ emailSubject, emailBody }) => {
    console.log(emailSubject, emailBody, "asdadsadasdsad");
    if (selectedApplicants.length === 0) return;
    rejectApplicationsMutation.mutate({
      applicantIds: selectedApplicants.map((a) => a.id),
      stage: "offer",
      emailSubject,
      emailBody,
    });
  };

  // Handle sending video interviews
  const handleSendInterview = ({
    interviewTypes,
    questionCount,
    selectedApplicants: selected,
    expiryDate,
  }) => {
    sendVideoInterviewMutation.mutate({
      jobId: id,
      applicationIds: selected.map((a) => a.id),
      interviewTypes,
      expiryDate: expiryDate?.toISOString(),
      questionCount,
    });
  };
  const sendToFinalFeedback = () => {
    if (selectedApplicants.length === 0) return;
    finalFeedbackMutation.mutate({
      applicationIds: selectedApplicants.map((a) => a.id),
    });
  };
  // Handle selecting all applicants
  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelectedApplicants(
        filteredApplicants.map((a) => ({ id: a.id, name: a.name }))
      );
    } else {
      setSelectedApplicants([]);
    }
  };

  // Handle selecting individual applicant
  const toggleSelectApplicant = (id, checked) => {
    if (checked) {
      const applicant = filteredApplicants.find((a) => a.id === id);
      if (applicant) {
        setSelectedApplicants((prev) => [
          ...prev,
          { id: applicant.id, name: applicant.name },
        ]);
      }
    } else {
      setSelectedApplicants((prev) =>
        prev.filter((applicant) => applicant.id !== id)
      );
    }
  };

  // Render loading skeleton
  if (isLoading || isLoadingJob) {
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
    return <div>Error: {error?.response?.data?.message}</div>;
  }
  const isLoadingMutation =
    advanceToCVReviewMutation.isPending ||
    rejectApplicationsMutation.isPending ||
    sendVideoInterviewMutation.isPending ||
    finalFeedbackMutation.isPending;

  console.log(isLoadingMutation);
  return (
    <div className="bg-background p-4 md:p-8 min-h-screen">
      <div className="mx-auto max-w-7xl">
        {/* {isLoadingJob ? (
        <div className="flex justify-between items-center mb-6">
          <div className="h-10 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-9 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      ) : ( */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-row flex-wrap items-center justify-between gap-2 mt-6 rounded-xl">
            <h1 className="text-3xl font-bold dark:text-white">{job?.title}</h1>
            <JobStatusBadge initialStatus={job?.status} jobId={job?._id} />
          </div>
          {job.company && (
            <div className="hidden md:flex flex-col md:flex-row md:items-center md:gap-4 text-muted-foreground">
              <div className="flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-primary" />
                <span className="text-lg">
                  {job?.company?.name || "Unknown Company"}
                </span>
              </div>

              {job.company.address && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-primary" />
                  <span>{job?.company?.address}</span>
                </div>
              )}

              {job?.company?.website && (
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-2 text-primary" />
                  <a
                    href={job?.company?.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    {job?.company?.website.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}
            </div>
          )}
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
            <div>
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
              offerApplicants={offerApplicants}
              activePhase={activePhase}
              setActivePhase={setActivePhase}
              onSendInterview={handleSendInterview}
              isLoadingMutation={isLoadingMutation}
              cvReviewLoading={advanceToCVReviewMutation.isPending}
              finalFeedBackLoading={finalFeedbackMutation.isPending}
              changeStageLoading={rejectApplicationsMutation.isPending}
              sendVideoInterviewLoading={sendVideoInterviewMutation.isPending}
              sendToFinalFeedback={sendToFinalFeedback}
              setSelectedApplicants={setSelectedApplicants}
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
    </div>
  );
}
