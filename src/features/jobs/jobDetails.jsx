import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
      parts.push(`${openTime.days} ${t('days')}`);
    }
    if (openTime.hours > 0) {
      parts.push(`${openTime.hours} ${t('hours')}`);
    }
    if (openTime.minutes > 0) {
      parts.push(
        `${openTime.minutes} ${t('minutes')}`
      );
    }

    return parts.length > 0 ? parts.join(", ") : t('Just now');
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6 order-2 lg:order-1 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                {t('Job Description')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                {description}
              </p>
            </CardContent>
          </Card>

          {requirements && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  {t('Requirements')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                  {requirements}
                </p>
              </CardContent>
            </Card>
          )}

          {((Tags && Tags.length > 0) || (tags && tags.length > 0)) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LucideTag className="h-5 w-5 text-primary" />
                  {t('Required Skills')}
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

        <div className="space-y-6 order-1 lg:order-2">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>{t('Job Details')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
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
                      {applicants} {t('applicants')}
                    </span>
                  </div>
                )}

                {hiringCount > 0 && (
                  <div className="flex items-start">
                    <BarChart className="w-4 h-4 mr-3 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">
                      {t('Hiring')} {hiringCount} {t('positions')}
                    </span>
                  </div>
                )}

                {openTime && (
                  <div className="flex items-start">
                    <Calendar className="w-4 h-4 mr-3 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">
                      {t('Posted')} {formatTimeOpen(openTime)} {t('ago')}
                    </span>
                  </div>
                )}

                {typeof salary?.min === "number" &&
                  typeof salary?.max === "number" &&
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
            </CardContent>
          </Card>
        </div>
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
          Error loading job:{" "}
          {error?.response?.data?.message || "Unknown error occurred"}
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
