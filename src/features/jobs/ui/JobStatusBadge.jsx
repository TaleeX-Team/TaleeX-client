import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { useJobs } from "../useJobs";
import { useParams } from "react-router-dom";

const statusConfig = {
  open: {
    label: "Open",
    color:
      "text-green-700 border-green-200 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
    dotColor: "bg-green-500",
  },
  pending: {
    label: "Pending",
    color:
      "text-yellow-700 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
    dotColor: "bg-yellow-500",
  },
  closed: {
    label: "Closed",
    color:
      "text-rose-800 border-rose-200 bg-rose-100 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800",
    dotColor: "bg-rose-500",
  },
};

export default function JobStatusBadge({ initialStatus = "open", jobId }) {
  const { id } = useParams();
  const hasId = Boolean(id);
  const [status, setStatus] = useState(initialStatus);
  const { updateJobMutation } = useJobs();

  const handleStatusChange = async (newStatus) => {
    if (newStatus === status) return;
    console.log("Submitting job update:", updateJobMutation);

    const jobData = {
      id: jobId,
      updates: { status: newStatus },
    };

    try {
      await updateJobMutation.mutateAsync(jobData);
      setStatus(newStatus);
    } catch (error) {
      console.error("Failed to update job status:", error);
    }
  };

  const currentConfig = statusConfig[status] || statusConfig.open;

  // Decide size based on whether we're in a details view (has ID) or list view
  const sizeClasses = hasId
    ? "px-3 py-2 text-sm" // Larger for detail view
    : "px-2 py-1 text-xs"; // Smaller for list view

  // Dot size based on context
  const dotSize = hasId ? "h-3 w-3" : "h-2 w-2";

  // Icon size based on context
  const iconSize = hasId ? "h-4 w-4" : "h-3 w-3";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="focus:outline-none"
        disabled={updateJobMutation.isPending}
      >
        <Badge
          variant="outline"
          className={`flex items-center gap-2 cursor-pointer ${sizeClasses} ${currentConfig.color}`}
        >
          {updateJobMutation.isPending ? (
            <Loader2 className={`${iconSize} mr-1 animate-spin`} />
          ) : (
            <span
              className={`${dotSize} rounded-full ${currentConfig.dotColor}`}
            ></span>
          )}
          {currentConfig.label}
          <ChevronDown className={`${iconSize} ml-1`} />
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={hasId ? "w-40" : "w-32"}>
        {Object.entries(statusConfig).map(([key, config]) => (
          <DropdownMenuItem
            key={key}
            className={`flex items-center justify-between ${
              hasId ? "py-2" : "py-1"
            }`}
            onClick={() => handleStatusChange(key)}
            disabled={updateJobMutation.isLoading}
          >
            <div className="flex items-center gap-2">
              <span
                className={`${dotSize} rounded-full ${config.dotColor}`}
              ></span>
              {config.label}
            </div>
            {status === key && <Check className={iconSize} />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
