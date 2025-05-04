import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Briefcase,
  Building2,
  Clock,
  DollarSign,
  MapPin,
  User,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function JobCard({ job }) {
  const {
    _id,
    title,
    company,
    workPlaceType,
    jobType,
    experienceLevel,
    applicationLink,
    status,
    salary,
    openTime,
  } = job;

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 hover:bg-emerald-100/80 dark:hover:bg-emerald-950/70";
      case "pending":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 hover:bg-amber-100/80 dark:hover:bg-amber-950/70";
      case "closed":
        return "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 hover:bg-rose-100/80 dark:hover:bg-rose-950/70";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/70";
    }
  };

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

  // Get first two capital letters of company name for the fallback avatar
  const getInitials = (name) => {
    if (!name) return "CO";
    const words = name.split(" ");
    if (words.length === 1) {
      return name.substring(0, 2).toUpperCase();
    }
    return (words[0][0] + (words[1] ? words[1][0] : words[0][1])).toUpperCase();
  };

  const companyInitials = getInitials(company.name);

  return (
    <Card className="overflow-hidden hover:shadow-lg dark:hover:shadow-slate-900/30 transition-all duration-300 flex flex-col h-full border-slate-200 dark:border-slate-800 group">
      <CardHeader className="pb-2 pt-5 px-5 space-y-2">
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Avatar className="h-12 w-12 rounded-md border-2 border-slate-100 dark:border-slate-700 shadow-sm">
              <AvatarImage
                src={company.image?.url}
                alt={company.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-primary/10 text-primary font-bold rounded-md dark:bg-primary/20">
                {companyInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg leading-tight line-clamp-1 text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">
                {title}
              </h3>
              <div className="flex items-center text-sm text-muted-foreground mt-0.5">
                <Building2 className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                <span className="line-clamp-1 truncate">{company.name}</span>
                {company.verification.status === "verified" && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge
                          variant="outline"
                          className="ml-1.5 bg-blue-50 text-blue-700 border-blue-200 text-xs py-0 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900"
                        >
                          ✓
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Verified Company</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          </div>
          <Badge
            className={`${getStatusColor(
              status
            )} capitalize text-xs font-medium px-2.5 py-1`}
          >
            {status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="px-5 py-3 flex-grow">
        <div className="grid grid-cols-2 gap-y-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <MapPin className="h-3.5 w-3.5" />
            </div>
            <span className="text-slate-700 dark:text-slate-300 capitalize">
              {workPlaceType}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Briefcase className="h-3.5 w-3.5" />
            </div>
            <span className="text-slate-700 dark:text-slate-300 capitalize">
              {jobType.replace("-", " ")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <User className="h-3.5 w-3.5" />
            </div>
            <span className="text-slate-700 dark:text-slate-300">
              {experienceLevel}
            </span>
          </div>

          {salary && (
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <DollarSign className="h-3.5 w-3.5" />
              </div>
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                {salary?.currency} {salary?.min?.toLocaleString()}-
                {salary?.max?.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5 mr-1.5" />
          <span>{formatOpenTime(openTime)}</span>
        </div>

        <Button
          asChild
          variant="outline"
          size="sm"
          className="gap-1.5 font-medium border-slate-200 dark:border-slate-700 hover:bg-primary/5 hover:text-primary hover:border-primary/30 dark:hover:bg-primary/10 dark:hover:border-primary/30"
        >
          <Link to={`${_id}`}>
            View Details
            <ExternalLink className="h-3.5 w-3.5 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
