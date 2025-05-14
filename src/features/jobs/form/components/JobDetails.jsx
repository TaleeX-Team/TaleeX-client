import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Briefcase, Building2, CheckCircle, Clock, Globe, MapPin, ShieldCheck, User } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ReportJobDialog } from "./ReportJobDialog";
import { useTranslation } from "react-i18next";

export function JobDetails({ job }) {
  const { t } = useTranslation();
  const { id } = useParams();

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "paused":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "closed":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const formatOpenTime = (openTime) => {
    if (openTime.days > 0) {
      return `${openTime.days} ${t('days')}`;
    } else if (openTime.hours > 0) {
      return `${openTime.hours} ${t('hours')}`;
    } else {
      return `${openTime.minutes} ${t('minutes')}`;
    }
  };

  const getInitials = (name) => {
    if (!name) return "CO";
    const words = name.split(" ");
    if (words.length === 1) {
      return name.substring(0, 2).toUpperCase();
    }
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  const companyInitials = getInitials(job.company.name);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:gap-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{job.title}</h1>
          <div className="flex items-center gap-3">
            <Badge className={`${getStatusColor(job.status)} capitalize`}>
              {t(job.status)}
            </Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <ReportJobDialog
                      jobId={id}
                      defaultName=""
                      defaultEmail=""
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('Report this job if it seems suspicious or inappropriate')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Building2 className="h-4 w-4" />
          <span>{job?.company?.name}</span>
          {job?.company?.verification?.status === "verified" && (
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              {t('Verified')}
            </Badge>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('Company Information')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 w-24 h-24 relative rounded-md overflow-hidden border">
              {job.company.image && job.company.image.url ? (
                <img
                  src={job.company.image.url || "/placeholder.svg"}
                  alt={job.company.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-2xl">
                  {companyInitials}
                </div>
              )}
            </div>
            <div className="space-y-3 flex-1">
              <div>
                <h3 className="font-semibold">{job.company.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {job.company.description}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{job.company.address}</span>
                </div>
                {job.company.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <Link
                      to={job.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {t('Company Website')}
                    </Link>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {t('Posted by')} {job.createdBy.firstName} {job.createdBy.lastName}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{t('Posted')} {formatOpenTime(job.openTime)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('Job Details')}</CardTitle>
          <CardDescription>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="secondary" className="capitalize">
                <Briefcase className="h-3 w-3 mr-1" />
                {t(job.jobType.replace("-", " "))}
              </Badge>
              <Badge variant="secondary" className="capitalize">
                <MapPin className="h-3 w-3 mr-1" />
                {t(job.workPlaceType)}
              </Badge>
              <Badge variant="secondary" className="capitalize">
                <User className="h-3 w-3 mr-1" />
                {t(job.experienceLevel)}
              </Badge>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">{t('Description')}</h3>
            <p className="text-sm whitespace-pre-line">{job.description}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">{t('Requirements')}</h3>
            <p className="text-sm whitespace-pre-line">{job.requirements}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
