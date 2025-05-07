import React, { useRef, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Info,
  Trash2,
  Briefcase,
  MoreHorizontal,
  Laptop,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { gsap } from "gsap";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

// Badge styles
const jobTypeColors = {
  "Full-time": "bg-primary/10 text-primary border-primary/20",
  "Part-time": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
};

const statusColors = {
  open: "bg-emerald-500 text-white dark:bg-emerald-600 dark:text-white",
  closed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  draft: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
};

export default function JobCard({ job, handleDelete }) {
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
    );
  }, []);

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      y: -5,
      boxShadow:
        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      duration: 0.3,
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      boxShadow:
        "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      duration: 0.3,
    });
  };

  if (!job) return null;

  const {
    title,
    company,
    description,
    workPlaceType,
    jobType,
    experienceLevel,
    tags,
    salary,
    applicationLink,
    status,
  } = job;

  return (
    <Card
      ref={cardRef}
      className="overflow-hidden flex flex-col relative border border-border hover:border-border/80 transition-all duration-300"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Actions */}
      <div className="absolute top-2 right-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="p-1.5 rounded-full bg-background/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground transition-colors"
              aria-label="Job actions"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <Info className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive cursor-pointer"
              onClick={() => handleDelete?.(job)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Job
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Header */}
      <CardHeader className="pb-1">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center flex-wrap gap-2">
              <h3 className="font-semibold text-lg text-foreground">{title}</h3>
              {jobType && (
                <Badge
                  className={`px-2 py-0.5 text-xs ${jobTypeColors[jobType] || "bg-muted text-muted-foreground"
                    }`}
                >
                  {jobType}
                </Badge>
              )}
              {status && (
                <Badge
                  className={`px-2 py-0.5 text-xs ${statusColors[status.toLowerCase()] ||
                    "bg-muted text-muted-foreground"
                    }`}
                >
                  {status}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Laptop className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground capitalize">
                {workPlaceType || "N/A"}
              </span>
            </div>
            {company && (
              <div className="text-sm text-muted-foreground mt-1">
                Company:{" "}
                <span className="font-medium">
                  {typeof company === "string" ? company : company.name}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Body */}
      <CardContent className="pb-2 flex-1">
        <div className="space-y-2 text-sm">
          <p className="text-muted-foreground line-clamp-3">
            {description || "No description provided."}
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

      {/* Footer */}
      <CardFooter className="flex justify-between pt-4 mt-auto">
        <Link to={`${job._id}`}>
          {" "}
          <Button variant="default" size="sm" className="gap-1">
            {" "}
            <Info className="h-4 w-4" /> <span>See Details</span>{" "}
          </Button>{" "}
        </Link>
        {applicationLink && (
          <a
            href={applicationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary flex items-center hover:underline"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            <span>Link</span>
          </a>
        )}
      </CardFooter>
    </Card>
  );
}
