import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  Briefcase,
  MapPin,
  Clock,
  Users,
  Calendar,
  Globe,
  CreditCard,
  GraduationCap,
  Building,
  Link as LinkIcon,
  X,
} from "lucide-react";
import { formatOpenTime } from "@/lib/utils.js";

const JobDetailsDialog = ({ isOpen, onClose, job }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !job) return null;

  const getStatusStyles = (status) => {
    switch (status) {
      case "open":
        return "bg-green-500/20 text-green-600 dark:text-green-400";
      case "closed":
        return "bg-gray-500/20 text-gray-600 dark:text-gray-400";
      case "paused":
        return "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400";
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
    }
  };

  // Format salary display
  const formatSalary = (salary) => {
    if (!salary || !salary.currency) return "Not specified";

    const minSalary = salary.min ? `${salary.min.toLocaleString()}` : "";
    const maxSalary = salary.max ? `${salary.max.toLocaleString()}` : "";

    if (minSalary && maxSalary) {
      return `${minSalary} - ${maxSalary} ${salary.currency}`;
    } else if (minSalary) {
      return `From ${minSalary} ${salary.currency}`;
    } else if (maxSalary) {
      return `Up to ${maxSalary} ${salary.currency}`;
    }

    return `${salary.currency}`;
  };

  // Format company name
  const getCompanyName = () => {
    if (!job.company) return "Unknown Company";

    if (typeof job.company === "object" && job.company !== null) {
      return job.company.name || "Unnamed Company";
    }

    if (typeof job.company === "string") {
      return job.company;
    }

    return "Unknown Company";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[96vh] p-0 overflow-hidden border-border shadow-lg">
        {/* Header with job title and status */}
        <DialogHeader className="p-6 pb-2 space-y-2 border-b border-border bg-gradient-to-r from-background to-muted/30">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
              {job.title}
            </DialogTitle>
            <Badge
              variant="outline"
              className={`${getStatusStyles(
                job.status
              )} capitalize border-none px-3 py-1`}
            >
              {job.status}
            </Badge>
          </div>
          <DialogDescription className="text-base text-muted-foreground flex items-center">
            <Briefcase className="h-4 w-4 mr-2" />
            {getCompanyName()}
          </DialogDescription>
        </DialogHeader>

        {/* Main content grid */}
        <div className="grid grid-cols-3 gap-6 p-6">
          {/* Left column - Job details */}
          <div className="col-span-2 space-y-6">
            {/* Company section */}
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center text-foreground">
                <Building className="h-5 w-5 mr-2 text-muted-foreground" />
                Company Information
              </h3>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex gap-4 items-center">
                  <Avatar className="h-12 w-12 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                    <span className="text-lg font-semibold">
                      {job.company && job.company.name
                        ? job.company.name.charAt(0)
                        : "C"}
                    </span>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{getCompanyName()}</h4>
                    {job.company && job.company.address && (
                      <p className="text-sm text-muted-foreground flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {job.company.address}
                      </p>
                    )}
                    {job.company && job.company.website && (
                      <p className="text-sm text-muted-foreground flex items-center mt-1">
                        <Globe className="h-3 w-3 mr-1" />
                        {job.company.website}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Description section */}
            <div>
              <h3 className="text-lg font-medium mb-3 text-foreground">
                Description
              </h3>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {job.description || "No description provided."}
                </p>
              </div>
            </div>

            {/* Requirements section */}
            <div>
              <h3 className="text-lg font-medium mb-3 text-foreground">
                Requirements
              </h3>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {job.requirements || "No specific requirements listed."}
                </p>
              </div>
            </div>
          </div>

          {/* Right column - Job metadata */}
          <div className="col-span-1 space-y-4">
            {/* Key details card */}
            <div className="bg-muted/30 rounded-lg p-4 border border-border space-y-4">
              <h3 className="font-medium border-b border-border pb-2 text-foreground">
                Job Details
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Job Type</p>
                    <p className="text-sm font-medium capitalize">
                      {job.jobType || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Work Location
                    </p>
                    <p className="text-sm font-medium capitalize">
                      {job.workPlaceType || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CreditCard className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Salary</p>
                    <p className="text-sm font-medium">
                      {formatSalary(job.salary)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <GraduationCap className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Experience Level
                    </p>
                    <p className="text-sm font-medium">
                      {job.experienceLevel || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Hiring</p>
                    <p className="text-sm font-medium">
                      {job.hiringTarget
                        ? `${job.hiringCount || 0}/${
                            job.hiringTarget
                          } positions filled`
                        : "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Posted</p>
                    <p className="text-sm font-medium">
                      {formatOpenTime(job.openTime)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Posted by */}
            {job.createdBy && (
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <h3 className="font-medium border-b border-border pb-2 mb-3 text-foreground">
                  Posted By
                </h3>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 bg-primary/10 text-primary flex items-center justify-center">
                    <span className="text-sm font-semibold">
                      {job.createdBy.firstName
                        ? job.createdBy.firstName.charAt(0)
                        : "U"}
                    </span>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {job.createdBy.firstName} {job.createdBy.lastName}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tags */}
            {job.tags && job.tags.length > 0 && (
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <h3 className="font-medium border-b border-border pb-2 mb-3 text-foreground">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-primary/5 border-primary/20 text-primary"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer with action buttons */}
        <DialogFooter className="px-6 py-4 border-t border-border bg-muted/30 flex flex-row justify-between items-center">
          {job.applicationLink && (
            <div className="flex items-center text-xs text-muted-foreground">
              <LinkIcon className="h-3 w-3 mr-1" />
              <span className="truncate max-w-[300px]">
                {job.applicationLink}
              </span>
            </div>
          )}
          <div className="flex gap-3">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="border-border hover:bg-accent transition-colors duration-200"
              >
                Close
              </Button>
            </DialogClose>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-200"
              onClick={() => window.open(job.applicationLink, "_blank")}
              disabled={!job.applicationLink}
            >
              Apply Now
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsDialog;
