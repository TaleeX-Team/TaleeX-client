import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Filter,
  Save,
  UserPlus,
  Mail,
  Video,
  Download,
  Link,
} from "lucide-react";

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
}) {
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
        {activePhase !== "CV Review" && (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800 disabled:opacity-50 dark:disabled:hover:bg-transparent"
            onClick={moveToCVReview}
            disabled={selectedApplicants.length === 0}
          >
            <ArrowRight className="h-4 w-4" />
            Move to CV Review
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 dark:border-gray-700 dark:hover:bg-gray-800 disabled:opacity-50 dark:disabled:hover:bg-transparent"
          onClick={rejectApplicants}
          disabled={selectedApplicants.length === 0}
        >
          Reject
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          <Video className="h-4 w-4" />
          Send Video Interview
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          <Download className="h-4 w-4" />
          Export
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
                    selectedApplicants.length === filteredApplicants.length
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
                Actions
              </th>
              <th className="py-2 px-4 text-left font-medium dark:text-gray-200">
                CV
              </th>
              <th className="py-2 px-4 text-left font-medium dark:text-gray-200">
                Phase
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
                    {applicant.name}
                  </td>
                  <td className="py-3 px-4 dark:text-gray-300">
                    {applicant.email}
                  </td>
                  <td className="py-3 px-4 dark:text-gray-300">
                    {new Date(applicant.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 px-3">
                        Profile
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 px-3">
                        Notes
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 px-3">
                        History
                      </Button>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {applicant.cvUrl ? (
                      <a
                        href={applicant.cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1"
                        >
                          <Link className="h-3.5 w-3.5" />
                          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Open CV
                          </span>
                        </Button>
                      </a>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">
                        No CV
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant="outline"
                      className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800"
                    >
                      {applicant.phase}
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
