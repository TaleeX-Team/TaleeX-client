import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { MapPin, Briefcase, Clock, DollarSign, Users, ArrowLeft, Share2, CheckCircle, Linkedin, LinkIcon, Building, BookOpen, LucideTag, Globe, Calendar, User, BarChart } from 'lucide-react';
import { getJobById } from "@/services/apiJobs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useShareJob } from "@/hooks/useShareJob.js";

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
      parts.push(`${openTime.days} day${openTime.days !== 1 ? 's' : ''}`);
    }
    if (openTime.hours > 0) {
      parts.push(`${openTime.hours} hour${openTime.hours !== 1 ? 's' : ''}`);
    }
    if (openTime.minutes > 0) {
      parts.push(`${openTime.minutes} minute${openTime.minutes !== 1 ? 's' : ''}`);
    }

    return parts.length > 0 ? parts.join(', ') : 'Just now';
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
      <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white pb-16">
        {/* Header with blur effect */}
        <div className="sticky top-0 z-10 backdrop-blur-md bg-black/70 border-b border-zinc-800">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white flex items-center gap-2"
                onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <div className="hidden sm:flex items-center gap-3">
              <Badge variant="outline" className="bg-zinc-800 border-zinc-700 capitalize">
                {status || "Active"}
              </Badge>
              {workPlaceType && (
                  <Badge variant="outline" className="bg-zinc-800 border-zinc-700">
                    {workPlaceType}
                  </Badge>
              )}
              {openTime && (
                  <Badge variant="outline" className="bg-emerald-900/40 border-emerald-800 text-emerald-300">
                    <Clock className="h-3 w-3 mr-1" /> Posted {formatTimeOpen(openTime)} ago
                  </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 pt-8">
          {/* Job Title and Company Section */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-4xl font-bold tracking-tight mr-3">{title}</h1>
              <Badge variant="secondary" className="bg-indigo-900/30 border-indigo-800 text-indigo-200">
                {experienceLevel}
              </Badge>
            </div>

            {company && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-gray-400">
                  <div className="flex items-center">
                    <Building className="w-5 h-5 mr-2 text-indigo-400" />
                    <span className="text-lg">{company.name || "Unknown Company"}</span>
                  </div>

                  {company.address && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-indigo-400" />
                        <span>{company.address}</span>
                      </div>
                  )}

                  {company.website && (
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 mr-2 text-indigo-400" />
                        <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-indigo-300 transition-colors"
                        >
                          {company.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                  )}
                </div>
            )}

            {createdBy && (
                <div className="flex items-center text-gray-400">
                  <User className="w-4 h-4 mr-2 text-indigo-400" />
                  <span>Posted by {createdBy.firstName} {createdBy.lastName}</span>
                </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Job Details */}
            <div className="space-y-6 order-2 lg:order-1 lg:col-span-2">
              {/* Job Description */}
              <Card className="bg-zinc-900/80 border-zinc-800 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-indigo-400" />
                    Job Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 whitespace-pre-line leading-relaxed">{description}</p>
                </CardContent>
              </Card>

              {/* Requirements */}
              {requirements && (
                  <Card className="bg-zinc-900/80 border-zinc-800 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-indigo-400" />
                        Requirements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 whitespace-pre-line leading-relaxed">{requirements}</p>
                    </CardContent>
                  </Card>
              )}

              {/* Skills */}
              {((Tags && Tags.length > 0) || (tags && tags.length > 0)) && (
                  <Card className="bg-zinc-900/80 border-zinc-800 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <LucideTag className="h-5 w-5 text-indigo-400" />
                        Required Skills
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {Tags && Tags.length > 0 ? Tags.map((tag, idx) => (
                            <Badge
                                key={idx}
                                variant="secondary"
                                className="bg-indigo-900/30 hover:bg-indigo-800/50 text-indigo-200 border-indigo-800 px-3 py-1"
                            >
                              {tag}
                            </Badge>
                        )) : tags.map((tag, idx) => (
                            <Badge
                                key={idx}
                                variant="secondary"
                                className="bg-indigo-900/30 hover:bg-indigo-800/50 text-indigo-200 border-indigo-800 px-3 py-1"
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
              <Card className="bg-zinc-900/80 border-zinc-800 shadow-xl sticky top-20">
                <CardHeader className="pb-2">
                  <CardTitle>Job Details</CardTitle>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge className="bg-indigo-600 text-white">
                      {status?.toUpperCase() || "OPEN"}
                    </Badge>
                    <Badge className="bg-zinc-700 text-white">
                      {jobType?.replace('-', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Job Metadata */}
                  <div className="space-y-4 text-sm">
                    {location && (
                        <div className="flex items-start">
                          <MapPin className="w-4 h-4 mr-3 text-indigo-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-200">{location}</span>
                        </div>
                    )}

                    {workPlaceType && (
                        <div className="flex items-start">
                          <Building className="w-4 h-4 mr-3 text-indigo-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-200">{workPlaceType}</span>
                        </div>
                    )}

                    {jobType && (
                        <div className="flex items-start">
                          <Briefcase className="w-4 h-4 mr-3 text-indigo-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-200">{jobType}</span>
                        </div>
                    )}

                    {experienceLevel && (
                        <div className="flex items-start">
                          <BookOpen className="w-4 h-4 mr-3 text-indigo-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-200">{experienceLevel}</span>
                        </div>
                    )}

                    {applicants && (
                        <div className="flex items-start">
                          <Users className="w-4 h-4 mr-3 text-indigo-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-200">{applicants} applicants</span>
                        </div>
                    )}

                    {hiringCount > 0 && (
                        <div className="flex items-start">
                          <BarChart className="w-4 h-4 mr-3 text-indigo-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-200">Hiring {hiringCount} positions</span>
                        </div>
                    )}

                    {openTime && (
                        <div className="flex items-start">
                          <Calendar className="w-4 h-4 mr-3 text-indigo-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-200">Posted {formatTimeOpen(openTime)} ago</span>
                        </div>
                    )}

                    {salary && (
                        <div className="flex items-start">
                          <DollarSign className="w-4 h-4 mr-3 text-indigo-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-200">
                        {salary.currency} {salary.min.toLocaleString()} - {salary.max.toLocaleString()}
                      </span>
                        </div>
                    )}
                  </div>

                  <Separator className="bg-zinc-800" />

                  {/* Application Link */}
                  {applicationLink && (
                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm text-gray-400">Application Link:</p>
                          {openTime && (
                              <span className="text-xs text-emerald-400 flex items-center">
                          <Clock className="h-3 w-3 mr-1" /> Active for {formatTimeOpen(openTime)}
                        </span>
                          )}
                        </div>
                        <div className="w-full bg-zinc-800 border border-zinc-700 rounded-md shadow-sm overflow-hidden group hover:border-indigo-700 transition-colors duration-200">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 p-2 bg-zinc-800 border-r border-zinc-700 group-hover:bg-indigo-900/30 transition-colors duration-200">
                              <LinkIcon className="h-4 w-4 text-indigo-400" />
                            </div>

                            <div className="flex-1 px-3 py-2 truncate">
                              <p className="text-sm text-gray-300 truncate">{applicationLink}</p>
                            </div>

                            <div className="flex border-l border-zinc-700">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                        onClick={copyToClipboard}
                                        className="p-2 hover:bg-zinc-700 transition-colors duration-200"
                                    >
                                      {copied ? (
                                          <CheckCircle className="h-4 w-4 text-green-500" />
                                      ) : (
                                          <Share2 className="h-4 w-4 text-gray-400 group-hover:text-indigo-400 transition-colors duration-200" />
                                      )}
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Copy link</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                        onClick={handleShareOnLinkedIn}
                                        className="p-2 hover:bg-zinc-700 transition-colors duration-200 border-l border-zinc-700"
                                        disabled={isSharing}
                                    >
                                      <Linkedin className={`h-4 w-4 ${isSharing ? "text-blue-300" : "text-blue-500"}`} />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Share on LinkedIn</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        </div>

                        {copied && (
                            <div className="mt-2 text-xs text-green-500 flex items-center justify-end">
                              <CheckCircle className="h-3 w-3 mr-1" /> Copied to clipboard
                            </div>
                        )}
                      </div>
                  )}

                  <Button
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                      onClick={() => window.open(applicationLink, "_blank")}
                      disabled={!applicationLink}
                  >
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
  );
}

function LoadingState() {
  return (
      <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-10">
            <Skeleton className="h-10 w-28 bg-zinc-800" />
          </div>

          <div className="mb-10">
            <Skeleton className="h-12 w-3/4 bg-zinc-800 mb-4" />
            <Skeleton className="h-6 w-1/3 bg-zinc-800" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-zinc-900/80 border-zinc-800">
                <CardHeader>
                  <Skeleton className="h-8 w-40 bg-zinc-800" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full bg-zinc-800" />
                  <Skeleton className="h-4 w-full bg-zinc-800" />
                  <Skeleton className="h-4 w-3/4 bg-zinc-800" />
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="bg-zinc-900/80 border-zinc-800">
                <CardHeader>
                  <Skeleton className="h-8 w-32 bg-zinc-800" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2, 3, 4].map(i => (
                      <div key={i} className="flex items-center">
                        <Skeleton className="h-5 w-5 bg-zinc-800 mr-3" />
                        <Skeleton className="h-4 w-3/4 bg-zinc-800" />
                      </div>
                  ))}
                  <Skeleton className="h-10 w-full bg-zinc-800 mt-4" />
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
      <div className="flex items-center justify-center min-h-screen bg-black/95">
        <Alert variant="destructive" className="max-w-md bg-zinc-900 border-red-900">
          <AlertDescription className="text-red-400">
            Error loading job: {error.message || "Unknown error occurred"}
          </AlertDescription>
        </Alert>
      </div>
  );
}

function NotFoundState() {
  return (
      <div className="flex items-center justify-center min-h-screen bg-black/95">
        <Alert className="max-w-md bg-zinc-900 border-zinc-800">
          <AlertDescription className="text-gray-400">
            Job not found. It may have been removed or is no longer available.
          </AlertDescription>
        </Alert>
      </div>
  );
}
