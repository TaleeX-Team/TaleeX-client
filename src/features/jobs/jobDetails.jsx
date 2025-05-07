import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Users,
  ArrowLeft,
  Share2,
  CheckCircle,
  Linkedin,
  LinkIcon,
  Building,
  BookOpen,
  LucideTag,
  Globe,
  Calendar,
  User,
  BarChart,
  Building2,
  Copy,
} from "lucide-react";
import { getJobById } from "@/services/apiJobs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useShareJob } from "@/hooks/useShareJob.js";
import { Input } from "@/components/ui/input";

export default function JobDetailsPage() {
  const { id } = useParams();
  const [copied, setCopied] = useState(false);
  const { shareOnLinkedIn, isSharing } = useShareJob();

  const {
    data: job,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["job", id],
    queryFn: () => getJobById(id),
    enabled: !!id,
  });

  const copyToClipboard = () => {
    if (!job?.applicationLink) return;
    navigator.clipboard.writeText(job.applicationLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const handleShareOnLinkedIn = async () => {
    try {
      await shareOnLinkedIn(id);
    } catch (error) {
      console.error("Error sharing job:", error);
    }
  };

  const formatTimeOpen = (openTime) => {
    if (!openTime) return null;

    const parts = [];
    if (openTime.days > 0) {
      parts.push(`${openTime.days} day${openTime.days !== 1 ? "s" : ""}`);
    }
    if (openTime.hours > 0) {
      parts.push(`${openTime.hours} hour${openTime.hours !== 1 ? "s" : ""}`);
    }
    if (openTime.minutes > 0) {
      parts.push(
        `${openTime.minutes} minute${openTime.minutes !== 1 ? "s" : ""}`
      );
    }

    return parts.length > 0 ? parts.join(", ") : "Just now";
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState error={error} />;
  }

  if (!job) {
    return <NotFoundState />;
  }

  const {
    title,
    description,
    requirements,
    company,
    workPlaceType,
    jobType,
    experienceLevel,
    Tags,
    tags = [],
    salary,
    applicationLink,
    status,
    location,
    department,
    applicants,
    postedDate,
    createdBy,
    openTime,
    hiringCount,
  } = job;

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      {/* Header with blur effect */}
      {/* <div className="sticky top-0 z-10 backdrop-blur-md bg-background/70 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground flex items-center gap-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="hidden sm:flex items-center gap-3">
            <Badge variant="outline" className="capitalize">
              {status || "Active"}
            </Badge>
            {workPlaceType && <Badge variant="outline">{workPlaceType}</Badge>}
            {openTime && (
              <Badge variant="secondary" className="text-primary">
                <Clock className="h-3 w-3 mr-1" /> Posted{" "}
                {formatTimeOpen(openTime)} ago
              </Badge>
            )}
          </div>
        </div>
      </div> */}

      {/* <div className="max-w-6xl mx-auto px-4 pt-8"> */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Job Details */}
        <div className="space-y-6 order-2 lg:order-1 lg:col-span-2">
          {/* Job Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Job Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                {description}
              </p>
            </CardContent>
          </Card>

          {/* Requirements */}
          {requirements && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                  {requirements}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Skills */}
          {((Tags && Tags.length > 0) || (tags && tags.length > 0)) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LucideTag className="h-5 w-5 text-primary" />
                  Required Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Tags && Tags.length > 0
                    ? Tags.map((tag, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1"
                      >
                        {tag}
                      </Badge>
                    ))
                    : tags.map((tag, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1"
                      >
                        {tag}
                      </Badge>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Job Metadata */}
        <div className="space-y-6 order-1 lg:order-2">
          {/* Job Details Card */}
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              {/* <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge className="bg-primary text-primary-foreground">
                    {status?.toUpperCase() || "OPEN"}
                  </Badge>
                  <Badge variant="secondary">
                    {jobType?.replace("-", " ")}
                  </Badge>
                </div> */}
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Job Metadata */}
              <div className="space-y-4 text-sm">
                {location && (
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 mr-3 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{location}</span>
                  </div>
                )}

                {workPlaceType && (
                  <div className="flex items-start">
                    <Building className="w-4 h-4 mr-3 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{workPlaceType}</span>
                  </div>
                )}

                {jobType && (
                  <div className="flex items-start">
                    <Briefcase className="w-4 h-4 mr-3 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{jobType}</span>
                  </div>
                )}

                {experienceLevel && (
                  <div className="flex items-start">
                    <BookOpen className="w-4 h-4 mr-3 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{experienceLevel}</span>
                  </div>
                )}

                {applicants && (
                  <div className="flex items-start">
                    <Users className="w-4 h-4 mr-3 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">
                      {applicants} applicants
                    </span>
                  </div>
                )}

                {hiringCount > 0 && (
                  <div className="flex items-start">
                    <BarChart className="w-4 h-4 mr-3 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">
                      Hiring {hiringCount} positions
                    </span>
                  </div>
                )}

                {openTime && (
                  <div className="flex items-start">
                    <Calendar className="w-4 h-4 mr-3 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">
                      Posted {formatTimeOpen(openTime)} ago
                    </span>
                  </div>
                )}
                {typeof salary?.min === 'number' &&
                  typeof salary?.max === 'number' &&
                  salary.min > 0 &&
                  salary.max > 0 && (
                    <div className="flex items-start">
                      <DollarSign className="w-4 h-4 mr-3 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">
                        {salary.currency || "USD"}{" "}
                        {Number(salary.min).toLocaleString()} -{" "}
                        {Number(salary.max).toLocaleString()}
                      </span>
                    </div>
                  )}
              </div>

              <Separator />
              {/* {applicationLink && (
                  <div className="mt-6">
                    <div className="flex items-center gap-2">
                      <Input readOnly value={applicationLink} className="flex-1 text-sm" />
                      <Button className="inline-flex items-center px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90" variant="secondary" onClick={copyToClipboard}>
                        <Copy className="h-4 w-4 mr-1" /> Copy Link
                      </Button>
                    </div>
                  </div>
                )} */}
              {/* Application Link */}
              {applicationLink && (
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-muted-foreground">
                      Application Link:
                    </p>
                    {openTime && (
                      <span className="text-xs text-success flex items-center">
                        <Clock className="h-3 w-3 mr-1" /> Active for{" "}
                        {formatTimeOpen(openTime)}
                      </span>
                    )}
                  </div>
                  <div className="w-full border border-border rounded-md shadow-sm overflow-hidden group transition-colors duration-200">
                    <div className="flex items-center">
                      <Input readOnly value={applicationLink}
                        className="flex-1 text-sm dark:bg-transparent border-none ring-0 outline-none focus:ring-0 focus:outline-none focus:ring-transparent focus-visible:ring-0 focus-visible:outline-none shadow-none cursor-default"
                      />
                      <div className="flex border-l ">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={copyToClipboard}
                                className="p-2"
                              >
                                {copied ? (
                                  <CheckCircle className="h-4 w-4 text-success" />
                                ) : (
                                  <LinkIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                                )}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Copy link</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {/* <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={handleShareOnLinkedIn}
                                  className="p-2 hover:bg-accent transition-colors duration-200 border-l border-border"
                                  disabled={isSharing}
                                >
                                  <Linkedin className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Share on LinkedIn</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider> */}
                      </div>
                    </div>
                  </div>

                  {copied && (
                    <div className="mt-2 text-xs text-success flex items-center justify-end">
                      <CheckCircle className="h-3 w-3 mr-1" /> Copied to
                      clipboard
                    </div>
                  )}
                </div>
              )}
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleShareOnLinkedIn}
                disabled={isSharing}
              >

                <div className="flex items-center w-full justify-center">
                  <p className="text-center text-lg">Share on LinkedIn</p>
                  <Linkedin className="text-white fill-current absolute left-10" style={{ width: '22px', height: '22px' }} />
                </div>


              </Button>
            </CardContent>
          </Card>
        </div>
        {/* </div> */}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-10">
          <Skeleton className="h-10 w-28" />
        </div>

        <div className="mb-10">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/3" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-40" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center">
                    <Skeleton className="h-5 w-5 mr-3" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))}
                <Skeleton className="h-10 w-full mt-4" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ error }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Alert variant="destructive">
        <AlertDescription>
          Error loading job: {error?.response?.data?.message || "Unknown error occurred"}
        </AlertDescription>
      </Alert>
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Alert>
        <AlertDescription className="text-muted-foreground">
          Job not found. It may have been removed or is no longer available.
        </AlertDescription>
      </Alert>
    </div>
  );
}
