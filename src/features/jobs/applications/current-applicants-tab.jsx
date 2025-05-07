import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Filter,
  Save,
  UserPlus,
  Mail,
  Video,
  Download,
  ArrowUpDown,
  Newspaper,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import CVFeedbackPage from "@/features/feedback/cv-feedback";
import BehavioralFeedbackPage from "@/features/feedback/behavioral-feedback";
import FinalFeedbackPage from "@/features/feedback/final-feedback";
import TechnicalFeedbackPage from "@/features/feedback/technicall-feedback";

export function ApplicantsTab({
  PHASES,
  phaseCounts,
  filteredApplicants,
  selectedApplicants,
  searchQuery,
  setSearchQuery,
  toggleSelectAll,
  toggleSelectApplicant,
  moveToCVReview,
  rejectApplicants,
  activePhase,
  setActivePhase,
  onSendInterview,
  offerApplicants,
  isLoadingMutation,
  sendToFinalFeedback,
}) {
  const [sortOrder, setSortOrder] = useState("desc");
  const [open, setOpen] = useState(false);
  const [interviewTypes, setInterviewTypes] = useState([]);
  const [questionCount, setQuestionCount] = useState(5);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const sortedApplicants = [...filteredApplicants].sort((a, b) => {
    console.log("Sorting applicants:", a.cvScore, b.cvScore);
    if (activePhase !== "CV Review") return 0;
    const scoreA = a.cvScore || 0;
    const scoreB = b.cvScore || 0;
    return sortOrder === "asc" ? scoreA - scoreB : scoreB - scoreA;
  });

  // Helper function to determine score text color
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  // Handle interview type toggle
  const toggleInterviewType = (type) => {
    setInterviewTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Handle form submission
  const handleSubmitInterview = () => {
    if (interviewTypes.length === 0) {
      alert("Please select at least one interview type.");
      return;
    }
    onSendInterview({ interviewTypes, questionCount, selectedApplicants });
    setOpen(false);
    setInterviewTypes([]);
    setQuestionCount(5);
  };

  return (
    <div className="mt-6">
      {/* Phase navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {PHASES.map((phase, index) => (
          <Button
            key={phase}
            variant={activePhase === phase ? "default" : "outline"}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap",
              activePhase === phase
                ? "bg-gray-900 dark:bg-gray-700 dark:text-white"
                : "bg-white dark:bg-transparent dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800"
            )}
            onClick={() => setActivePhase(phase)}
          >
            <span
              className={cn(
                "flex items-center justify-center h-5 w-5 rounded-full text-xs font-medium",
                activePhase === phase
                  ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                  : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-300"
              )}
            >
              {phaseCounts[phase] || 0}
            </span>
            {phase}
            {index < PHASES.length - 1 && (
              <ArrowRight className="h-4 w-4 ml-2 text-gray-400" />
            )}
          </Button>
        ))}
      </div>

      {/* Search and actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Input
            placeholder="Find email or name..."
            className="pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 absolute left-3 top-3 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <Filter className="h-4 w-4" />
            Add Filter
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <Save className="h-4 w-4" />
            Save Filter
          </Button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {activePhase !== "CV Review" &&
          activePhase !== "Sending Interview" &&
          activePhase !== "Interview Feedback" &&
          activePhase !== "Final Feedback" && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800 disabled:opacity-50 dark:disabled:hover:bg-transparent"
              onClick={moveToCVReview}
              disabled={selectedApplicants.length === 0 || isLoadingMutation}
            >
              <ArrowRight className="h-4 w-4" />
              Move to CV Review
            </Button>
          )}
        {activePhase === "Interview Feedback" && (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800 disabled:opacity-50 dark:disabled:hover:bg-transparent"
            onClick={sendToFinalFeedback}
            disabled={selectedApplicants.length === 0 || isLoadingMutation}
          >
            <ArrowRight className="h-4 w-4" />
            Send to final feedback
          </Button>
        )}
        {(activePhase === "CV Review" || activePhase === "Applications") && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800"
                disabled={selectedApplicants.length === 0 || isLoadingMutation}
              >
                <Video className="h-4 w-4" />
                {isLoadingMutation ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Moving Applicant...
                  </>
                ) : (
                  "Send Video Interview"
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] dark:bg-gray-800 dark:text-gray-200">
              <DialogHeader>
                <DialogTitle>Send Video Interview</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Interview Type</Label>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="technical"
                        checked={interviewTypes.includes("technical")}
                        onCheckedChange={() => toggleInterviewType("technical")}
                        className="dark:border-gray-600"
                      />
                      <Label htmlFor="technical">Technical</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="behavioral"
                        checked={interviewTypes.includes("behavioral")}
                        onCheckedChange={() =>
                          toggleInterviewType("behavioral")
                        }
                        className="dark:border-gray-600"
                      />
                      <Label htmlFor="behavioral">Behavioral</Label>
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Number of Questions: {questionCount}</Label>
                  <Slider
                    value={[questionCount]}
                    onValueChange={(value) => setQuestionCount(value[0])}
                    min={5}
                    max={15}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="dark:text-gray-300 dark:border-gray-700"
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmitInterview}>Send</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 dark:border-gray-700 dark:hover:bg-gray-800 disabled:opacity-50 dark:disabled:hover:bg-transparent"
          onClick={rejectApplicants}
          disabled={selectedApplicants.length === 0 || isLoadingMutation}
        >
          Reject
        </Button>
        <Button
          variant="outline"
          size="sm"
          //success
          className="flex items-center gap-1 text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300 dark:border-gray-700 dark:hover:bg-gray-800 disabled:opacity-50 dark:disabled:hover:bg-transparent"
          onClick={offerApplicants}
          disabled={selectedApplicants.length === 0 || isLoadingMutation}
        >
          Offer
        </Button>
      </div>

      {/* Applicants table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="py-2 px-4 text-left">
                <Checkbox
                  checked={
                    selectedApplicants.length > 0 &&
                    filteredApplicants.every((applicant) =>
                      selectedApplicants.some(
                        (selected) => selected.id === applicant.id
                      )
                    )
                  }
                  onCheckedChange={(checked) => toggleSelectAll(checked)}
                  className="dark:border-gray-600"
                />
              </th>
              <th className="py-2 px-4 text-left font-medium dark:text-gray-200">
                Name
              </th>
              <th className="py-2 px-4 text-left font-medium dark:text-gray-200">
                Email
              </th>
              <th className="py-2 px-4 text-left font-medium dark:text-gray-200">
                Applied at
              </th>
              <th className="py-2 px-4 text-left font-medium dark:text-gray-200">
                Feedbacks
              </th>
              <th className="py-2 px-4 text-left font-medium dark:text-gray-200">
                CV
              </th>
              <th className="py-2 px-4 text-left font-medium dark:text-gray-200">
                Phase
              </th>
              <th
                className="py-2 px-4 text-left font-medium dark:text-gray-200 cursor-pointer flex items-center gap-1"
                onClick={toggleSortOrder}
              >
                Score
                <ArrowUpDown className="h-4 w-4" />
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedApplicants.length > 0 ? (
              sortedApplicants.map((applicant) => (
                <tr
                  key={applicant.id}
                  className="border-b hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50"
                >
                  <td className="py-3 px-4">
                    <Checkbox
                      checked={selectedApplicants.some(
                        (a) => a.id === applicant.id
                      )}
                      onCheckedChange={(checked) =>
                        toggleSelectApplicant(applicant.id, checked)
                      }
                      className="dark:border-gray-600"
                    />
                  </td>
                  <td className="py-3 px-4 font-medium dark:text-gray-200">
                    {applicant.name}
                  </td>
                  <td className="py-3 px-4 dark:text-gray-300">
                    {applicant.email}
                  </td>
                  <td className="py-3 px-4 dark:text-gray-300">
                    {applicant.applied}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      {applicant?.feedback?.cv && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-3"
                              disabled={!applicant?.feedback?.cv}
                            >
                              CV
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="!w-full !max-w-5xl max-h-[90vh] overflow-y-auto">
                            <CVFeedbackPage
                              feedback={applicant?.feedback?.cv}
                            />
                          </DialogContent>
                        </Dialog>
                      )}
                      {applicant?.feedback?.interview && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-3"
                            >
                              Feedback
                            </Button>
                          </DialogTrigger>

                          <DialogContent className="!w-full !max-w-5xl max-h-[90vh] overflow-y-auto">
                            {applicant?.feedback?.interview?.type ===
                            "behavioral" ? (
                              <BehavioralFeedbackPage
                                feedback={applicant?.feedback?.interview}
                              />
                            ) : (
                              <TechnicalFeedbackPage
                                feedback={applicant?.feedback?.interview}
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                      )}
                      {applicant?.feedback?.final && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-3"
                            >
                              Final Feedback
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="!w-full !max-w-5xl max-h-[90vh] overflow-y-auto">
                            <FinalFeedbackPage
                              feedback={applicant?.feedback?.final}
                            />
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {applicant.cvUrl ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 p-2"
                              asChild
                            >
                              <a
                                href={applicant.cvUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Newspaper className="h-3.5 w-3.5" />
                                <span className="sr-only">Open CV</span>
                              </a>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Open CV</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">
                        No CV
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant="outline"
                      className={(() => {
                        switch (applicant.phase) {
                          case "Applications":
                            return "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800";
                          case "CV Review":
                            return "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800";
                          case "Sending Interview":
                            return "bg-lime-50 text-lime-700 border-lime-200 dark:bg-lime-900/20 dark:text-lime-400 dark:border-lime-800";
                          case "Interview Feedback":
                            return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800";
                          case "Final Feedback":
                            return "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900/20 dark:text-sky-400 dark:border-sky-800";
                          case "offer":
                            return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
                          case "rejected":
                            return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
                          default:
                            return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800";
                        }
                      })()}
                    >
                      {applicant.phase}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    {applicant.cvScore !== undefined ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <span
                              className={cn(
                                "font-medium",
                                getScoreColor(applicant.cvScore) // Fixed the syntax issue here
                              )}
                            >
                              {Math.round(applicant.cvScore)}%
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            Score: {applicant.cvScore.toFixed(1)}%
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">
                        -
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="py-4 text-center text-gray-500 dark:text-gray-400"
                >
                  No applicants found in this phase.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
