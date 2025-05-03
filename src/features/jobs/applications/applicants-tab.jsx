import { useState } from "react";

import { Button } from "@/components/ui/button";

import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import JobOverview from "../jobDetails";

import { RejectedApplicantsTab } from "./rejected-applicants-tab.jsx";
import { ApplicantsTab } from "./current-applicants-tab.jsx";
import {JobDetails} from "@/features/jobs/form/components/JobDetails.jsx";
import JobDetailsPage from "../jobDetails";

// Define the applicant type
const PHASES = [
  "Applications",
  "CV Review",
  "Pending Interview",
  "Interview Feedback",
  "Final Feedback",
];

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Create dummy applicants data
const applicantsData = [
  {
    id: generateId(),
    name: "Tommy T.",
    email: "tommy@example.com",
    applied: "May 1, 2023",
    atPhaseSince: "May 1, 2023",
    assignee: null,
    score: 3,
    phase: "Applications",
    rejected: false,
  },
  {
    id: generateId(),
    name: "Michael O.",
    email: "michael@example.com",
    applied: "Apr 26, 2023",
    atPhaseSince: "Apr 30, 2023",
    assignee: "Susan Hayden",
    score: 5,
    phase: "Applications",
    rejected: false,
  },
  {
    id: generateId(),
    name: "Olivia C.",
    email: "olivia@example.com",
    applied: "Apr 20, 2023",
    atPhaseSince: "Apr 20, 2023",
    assignee: "Ron Weasley",
    score: 1,
    phase: "Applications",
    rejected: false,
  },
  {
    id: generateId(),
    name: "Ryan P.",
    email: "ryan@example.com",
    applied: "Apr 15, 2023",
    atPhaseSince: "Apr 16, 2023",
    assignee: null,
    score: 4,
    phase: "Applications",
    rejected: false,
  },
  {
    id: generateId(),
    name: "Sophia M.",
    email: "sophia@example.com",
    applied: "Apr 10, 2023",
    atPhaseSince: "Apr 12, 2023",
    assignee: null,
    score: 3,
    phase: "Applications",
    rejected: false,
  },
  {
    id: generateId(),
    name: "Grace B.",
    email: "grace@example.com",
    applied: "Apr 5, 2023",
    atPhaseSince: "Apr 7, 2023",
    assignee: null,
    score: 2,
    phase: "CV Review",
    rejected: false,
  },
  {
    id: generateId(),
    name: "Arthur M.",
    email: "arthur@example.com",
    applied: "Apr 1, 2023",
    atPhaseSince: "Apr 3, 2023",
    assignee: null,
    score: 3,
    phase: "CV Review",
    rejected: false,
  },
  {
    id: generateId(),
    name: "Emma W.",
    email: "emma@example.com",
    applied: "Mar 28, 2023",
    atPhaseSince: "Mar 30, 2023",
    assignee: "Susan Hayden",
    score: 4,
    phase: "CV Review",
    rejected: false,
  },
  {
    id: generateId(),
    name: "Daniel K.",
    email: "daniel@example.com",
    applied: "Mar 25, 2023",
    atPhaseSince: "Mar 27, 2023",
    assignee: "Ron Weasley",
    score: 5,
    phase: "Pending Interview",
    rejected: false,
  },
  {
    id: generateId(),
    name: "Ava J.",
    email: "ava@example.com",
    applied: "Mar 20, 2023",
    atPhaseSince: "Mar 22, 2023",
    assignee: null,
    score: 4,
    phase: "Pending Interview",
    rejected: false,
  },
  {
    id: generateId(),
    name: "Noah S.",
    email: "noah@example.com",
    applied: "Mar 15, 2023",
    atPhaseSince: "Mar 18, 2023",
    assignee: "Susan Hayden",
    score: 3,
    phase: "Pending Interview",
    rejected: false,
  },
  {
    id: generateId(),
    name: "Isabella R.",
    email: "isabella@example.com",
    applied: "Mar 10, 2023",
    atPhaseSince: "Mar 12, 2023",
    assignee: "Ron Weasley",
    score: 4,
    phase: "Pending Interview",
    rejected: false,
  },
  {
    id: generateId(),
    name: "Liam T.",
    email: "liam@example.com",
    applied: "Mar 5, 2023",
    atPhaseSince: "Mar 8, 2023",
    assignee: "Susan Hayden",
    score: 5,
    phase: "Interview Feedback",
    rejected: false,
  },
  {
    id: generateId(),
    name: "Charlotte D.",
    email: "charlotte@example.com",
    applied: "Mar 1, 2023",
    atPhaseSince: "Mar 3, 2023",
    assignee: null,
    score: 4,
    phase: "Interview Feedback",
    rejected: false,
  },
  {
    id: generateId(),
    name: "Ethan H.",
    email: "ethan@example.com",
    applied: "Feb 25, 2023",
    atPhaseSince: "Feb 28, 2023",
    assignee: "Ron Weasley",
    score: 3,
    phase: "Final Feedback",
    rejected: false,
  },
  {
    id: generateId(),
    name: "Amelia G.",
    email: "amelia@example.com",
    applied: "Feb 20, 2023",
    atPhaseSince: "Feb 22, 2023",
    assignee: "Susan Hayden",
    score: 5,
    phase: "Final Feedback",
    rejected: false,
  },
  {
    id: generateId(),
    name: "Benjamin F.",
    email: "benjamin@example.com",
    applied: "Feb 15, 2023",
    atPhaseSince: "Feb 18, 2023",
    assignee: null,
    score: 2,
    phase: "Applications",
    rejected: true,
    rejectedOn: "Feb 20, 2023",
    rejectedBy: "Susan Hayden",
  },
  {
    id: generateId(),
    name: "Mia E.",
    email: "mia@example.com",
    applied: "Feb 10, 2023",
    atPhaseSince: "Feb 12, 2023",
    assignee: "Ron Weasley",
    score: 1,
    phase: "CV Review",
    rejected: true,
    rejectedOn: "Feb 15, 2023",
    rejectedBy: "Ron Weasley",
  },
  {
    id: generateId(),
    name: "James D.",
    email: "james@example.com",
    applied: "Feb 5, 2023",
    atPhaseSince: "Feb 8, 2023",
    assignee: "Susan Hayden",
    score: 2,
    phase: "Pending Interview",
    rejected: true,
    rejectedOn: "Feb 10, 2023",
    rejectedBy: "Susan Hayden",
  },
  {
    id: generateId(),
    name: "Evelyn C.",
    email: "evelyn@example.com",
    applied: "Feb 1, 2023",
    atPhaseSince: "Feb 3, 2023",
    assignee: null,
    score: 3,
    phase: "Interview Feedback",
    rejected: true,
    rejectedOn: "Feb 5, 2023",
    rejectedBy: "Ron Weasley",
  },
];

export default function JobApplicationManager() {
  const [activeTab, setActiveTab] = useState("overview");
  const [applicants, setApplicants] = useState(applicantsData);
  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [activePhase, setActivePhase] = useState("Applications");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter applicants based on active phase and rejected status
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

  // Handle moving applicants to the next phase
  const moveToNextPhase = () => {
    if (selectedApplicants.length === 0) return;

    const currentPhaseIndex = PHASES.indexOf(activePhase);
    if (currentPhaseIndex >= PHASES.length - 1) return;

    const nextPhase = PHASES[currentPhaseIndex + 1];

    setApplicants((prev) =>
      prev.map((applicant) =>
        selectedApplicants.includes(applicant.id)
          ? {
              ...applicant,
              phase: nextPhase,
              atPhaseSince: new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }),
            }
          : applicant
      )
    );

    setSelectedApplicants([]);
  };

  // Handle rejecting applicants
  const rejectApplicants = () => {
    if (selectedApplicants.length === 0) return;

    setApplicants((prev) =>
      prev.map((applicant) =>
        selectedApplicants.includes(applicant.id)
          ? {
              ...applicant,
              rejected: true,
              rejectedOn: new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }),
              rejectedBy: "Current User",
            }
          : applicant
      )
    );

    setSelectedApplicants([]);
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
  return (
    <div className="container mx-auto px-4 py-6 dark:text-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold dark:text-white">
          Sales Representative
        </h1>
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
        </div>

        {activeTab === "overview" && (
          <div className="mt-6">
            <JobDetailsPage/>
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
            moveToNextPhase={moveToNextPhase}
            rejectApplicants={rejectApplicants}
            activePhase={activePhase}
            setActivePhase={setActivePhase}
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
      </div>
    </div>
  );
}
