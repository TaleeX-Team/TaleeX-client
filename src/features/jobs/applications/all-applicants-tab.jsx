"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Filter, Newspaper, Save, Users } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import CVFeedbackPage from "@/features/feedback/cv-feedback";
import BehavioralFeedbackPage from "@/features/feedback/behavioral-feedback";
import FinalFeedbackPage from "@/features/feedback/final-feedback";
import TechnicalFeedbackPage from "@/features/feedback/technicall-feedback";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useJobs } from "../useJobs";
import { useParams } from "react-router-dom";
import { useState } from "react";

export function AllApplicantsTab({
  filteredApplicants,
  selectedApplicants,
  searchQuery,
  onSearchChange,
  toggleSelectAll,
  toggleSelectApplicant,
}) {
  // Static job list for the dropdown
  const [selectedJob, setSelectedJob] = useState();
  const jobOptions = [
    { id: "1", title: "Software Engineer" },
    { id: "2", title: "Product Manager" },
    { id: "3", title: "Data Scientist" },
    { id: "4", title: "UX Designer" },
  ];
  const { id } = useParams();
  const { jobsQuery } = useJobs();
  const jobs = jobsQuery.data.jobs.filter((job) => job._id !== id);
  console.log(selectedJob);
  return (
    <div>
      {/* Search and Invite Button */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <div className="relative flex-1">
          <Input
            placeholder="Find email or name..."
            className="pl-10 bg-input"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
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
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-10 px-4"
              disabled={selectedApplicants.length === 0}
            >
              <Users className="h-4 w-4 mr-2" />
              Invite to Job
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Invite Applicants to Job</DialogTitle>
              <DialogDescription>
                Send job invitations to the selected applicants.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-5">
                <label htmlFor="job" className="col-span-1 ">
                  Job to invite to:
                </label>
                <Select onValueChange={setSelectedJob}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a job" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobs.map((job) => (
                      <SelectItem key={job._id} value={job._id}>
                        {job.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {selectedApplicants.length > 0 && (
              <div className="p-3 rounded-md border bg-muted">
                <p className="text-sm font-medium">Selected Applicants</p>
                <p className="text-xs text-muted-foreground">
                  {selectedApplicants.length} applicant
                  {selectedApplicants.length !== 1 ? "s" : ""} selected
                </p>
              </div>
            )}
            <DialogFooter>
              <Button type="submit">Invite</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* All applicants table */}
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
                Applied
              </th>
              <th className="py-2 px-4 text-left font-medium dark:text-gray-200">
                Feedbacks
              </th>
              <th className="py-2 px-4 text-left font-medium dark:text-gray-200">
                CV
              </th>
              <th className="py-2 px-4 text-left font-medium dark:text-gray-200">
                Current Phase
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredApplicants.length > 0 ? (
              filteredApplicants.map((applicant) => (
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
                    <div className="flex items-center">
                      {applicant.email}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 ml-1 dark:hover:bg-gray-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </Button>
                    </div>
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
                                screenshots={applicant?.images}
                                transcriptText={applicant?.transcript}
                                audio={applicant?.audio}
                                summary={applicant?.summary}
                              />
                            ) : (
                              <TechnicalFeedbackPage
                                feedback={applicant?.feedback?.interview}
                                screenshots={applicant?.images}
                                transcriptText={applicant?.transcript}
                                audio={applicant?.audio}
                                summary={applicant?.summary}
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
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="py-4 text-center text-gray-500 dark:text-gray-400"
                >
                  No applicants found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
