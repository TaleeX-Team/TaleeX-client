"use client";

import { useTranslation } from "react-i18next";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Filter, Newspaper, Save } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import CVFeedbackPage from "@/features/feedback/cv-feedback";
import BehavioralFeedbackPage from "@/features/feedback/behavioral-feedback";
import FinalFeedbackPage from "@/features/feedback/final-feedback";
import TechnicalFeedbackPage from "@/features/feedback/technicall-feedback";

export function RejectedApplicantsTab({
  filteredApplicants,
  selectedApplicants,
  searchQuery,
  onSearchChange,
  toggleSelectAll,
  toggleSelectApplicant,
}) {
  const { t } = useTranslation();

  return (
    <div>
      {/* Search for rejected */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Input
            placeholder={t("reject.rejectedApplicantss.searchPlaceholder")}
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
      </div>

      {/* Rejected applicants table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="py-2 px-4 text-left">
                <Checkbox
                  checked={
                    selectedApplicants.length > 0 &&
                    selectedApplicants.length === filteredApplicants.length
                  }
                  onCheckedChange={(checked) => toggleSelectAll(checked)}
                  className="dark:border-gray-600"
                />
              </th>
              <th className="py-2 px-4 text-left font-medium dark:text-gray-200">
                {t("reject.rejectedApplicantss.table.name")}
              </th>
              <th className="py-2 px-4 text-left font-medium dark:text-gray-200">
                {t("reject.rejectedApplicantss.table.email")}
              </th>
              <th className="py-2 px-4 text-left font-medium dark:text-gray-200">
                {t("reject.rejectedApplicantss.table.applied")}
              </th>
              <th className="py-2 px-4 text-left font-medium dark:text-gray-200">
                {t("reject.rejectedApplicantss.table.Feedbacks")}
              </th>
              <th className="py-2 px-4 text-left font-medium dark:text-gray-200">
                {t("reject.rejectedApplicantss.table.CV")}
              </th>
              <th className="py-2 px-4 text-left font-medium dark:text-gray-200">
                {t("reject.rejectedApplicantss.table.lastPhase")}
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
                      checked={selectedApplicants.includes(applicant.id)}
                      onCheckedChange={(checked) =>
                        toggleSelectApplicant(applicant.id, checked)
                      }
                      className="dark:border-gray-600"
                    />
                  </td>
                  <td className="py-3 px-4 font-medium dark:text-gray-200">
                    {applicant?.name}
                  </td>
                  <td className="py-3 px-4 dark:text-gray-300">
                    <div className="flex items-center">
                      {applicant?.email}
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
                    {applicant?.applied}
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
                              {t(
                                "reject.rejectedApplicantss.table.feedbacks.cv"
                              )}
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
                              {t(
                                "reject.rejectedApplicantss.table.feedbacks.feedback"
                              )}
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
                              {t(
                                "reject.rejectedApplicantss.table.feedbacks.finalFeedback"
                              )}
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
                                href={applicant?.cvUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Newspaper className="h-3.5 w-3.5" />
                                <span className="sr-only">
                                  {t(
                                    "reject.rejectedApplicantss.table.cv.open"
                                  )}
                                </span>
                              </a>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {t("reject.rejectedApplicantss.table.cv.open")}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">
                        {t("reject.reject.rejectedApplicantss.table.cv.noCV")}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant="outline"
                      className={(() => {
                        switch (applicant.phase) {
                          case t("reject.phases.applications"):
                            return "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800";
                          case t("reject.phases.cvReview"):
                            return "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800";
                          case t("reject.phases.sendingInterview"):
                            return "bg-lime-50 text-lime-700 border-lime-200 dark:bg-lime-900/20 dark:text-lime-400 dark:border-lime-800";
                          case t("reject.phases.interviewFeedback"):
                            return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800";
                          case t("reject.phases.finalFeedback"):
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
                      {applicant?.phase}
                    </Badge>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="py-4 text-center text-gray-500 dark:text-gray-400"
                >
                  {t("reject.rejectedApplicantss.table.noApplicants")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
