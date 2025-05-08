import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Building2, Clock, ExternalLink, Edit, ShieldCheck } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UpdateJob from "@/features/jobs/addJob/UpdateJob.jsx";
import JobStatusBadge from "../../ui/JobStatusBadge";

export default function JobCard({ job }) {
  const {
    _id,
    title,
    company,
    jobType,
    experienceLevel,
    status,
    openTime,
    tags,
    description,
  } = job;
  const { id } = useParams();
  const formatOpenTime = (openTime) => {
    if (!openTime) return "Recently";

    if (openTime.days > 0) {
      return `${openTime.days} day${openTime.days > 1 ? "s" : ""} ago`;
    } else if (openTime.hours > 0) {
      return `${openTime.hours} hour${openTime.hours > 1 ? "s" : ""} ago`;
    } else {
      return `${openTime.minutes} minute${openTime.minutes > 1 ? "s" : ""} ago`;
    }
  };

  return (
    <Card className="overflow-hidden flex flex-col relative border border-border hover:border-border/80 transition-all duration-300">
      <CardHeader className="pb-1">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center flex-wrap gap-2">
              <h3 className="font-semibold text-lg text-foreground">{title}</h3>
              {jobType && (
                <Badge className="px-2 py-0.5 text-xs bg-muted text-muted-foreground capitalize">
                  {jobType}
                </Badge>
              )}
              {experienceLevel && (
                <Badge
                  className={`px-2 py-0.5 text-xs bg-muted text-muted-foreground capitalize`}
                >
                  {experienceLevel}
                </Badge>
              )}
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-0.5">
              <Building2 className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
              <span className="line-clamp-1 truncate">{company.name}</span>
              {company?.verification?.status === "verified" && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ShieldCheck className="text-blue-700 border-blue-200 text-xs py-0 0 dark:text-blue-300 dark:border-blue-900 h-5">

                      </ShieldCheck>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Verified Company</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
          <JobStatusBadge initialStatus={status} jobId={_id} />
        </div>
      </CardHeader>

      <CardContent className="pb-2 flex-1">
        <div className="space-y-2 text-sm">
          <p className="text-muted-foreground line-clamp-3">
            {description || ""}
          </p>
        </div>

        <div className="flex flex-wrap gap-1 mt-3">
          {tags?.length > 0 &&
            tags.slice(0, 3).map((tag, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="px-2 py-0.5 text-xs bg-primary/10 text-primary border-primary/20"
              >
                {tag}
              </Badge>
            ))}
          {tags?.length > 3 && (
            <Badge
              variant="outline"
              className="px-2 py-0.5 text-xs bg-primary/5 text-primary/70 border-primary/10"
            >
              +{tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-3 border-t">
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5 mr-1.5" />
          <span>{formatOpenTime(openTime)}</span>
        </div>
        {status !== "closed"}
        <div className="flex gap-2">
          {/* Edit Job Button with UpdateJob Dialog */}
          {status !== "closed" && (
            <UpdateJob
              jobId={_id}
              trigger={
                <Button variant="outline" size="sm">
                  <Edit className="h-3.5 w-3.5 mr-1" />
                  Edit
                </Button>
              }
            />
          )}

          {/* View Details Button */}
          <Button asChild variant="outline" size="sm">
            {!id ? (
              <Link to={`/app/jobs/${_id}`}>
                View Details
                <ExternalLink className="h-3.5 w-3.5 ml-1" />
              </Link>
            ) : (
              <Link to={`${_id}`}>
                View Details
                <ExternalLink className="h-3.5 w-3.5 ml-1" />
              </Link>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
