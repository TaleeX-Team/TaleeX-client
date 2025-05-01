import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MapPin, ExternalLink, Info, Trash2, Briefcase, MoreHorizontal, Star, StarOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gsap } from "gsap";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { StatusIcon } from "@/components/StatusIcon";
// import { Job } from "@/lib/types"; // Make sure to define this type

// interface JobCardProps {
//   job: Job;
//   handleDelete: (job: Job) => void;
// }

export default function JobCard({ job, handleDelete }) {
  if (!job) {
    return null; // Or render a placeholder/skeleton
  }

  const {
    title,
    company,
    description,
    location,
    type,
    salary,
    website,
    _id,
    isFavorite: initialFavorite = false,
  } = job;

  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  const cardRef = useRef(null);
  const contentRef = useRef(null);
  const logoRef = useRef(null);

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      duration: 0.3,
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      duration: 0.3,
    });
  };

  useEffect(() => {
    if (logoRef.current && contentRef.current) {
      gsap.fromTo(
        logoRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }
      );

      gsap.fromTo(
        contentRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, delay: 0.2 }
      );
    }
  }, []);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);

    gsap.fromTo(
      ".favorite-icon",
      { scale: 0.8, rotation: -10 },
      { scale: 1.2, rotation: 0, duration: 0.3, yoyo: true, repeat: 1 }
    );
  };

  const formatWebsiteUrl = (url) => {
    if (!url) return "";
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  return (
    <Card
      ref={cardRef}
      className="overflow-hidden flex flex-col relative border border-border hover:border-border/80 transition-all duration-300"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Actions Menu */}
      <div className="absolute top-2 right-2 flex gap-2">
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
            <DropdownMenuItem className="cursor-pointer">
              <Info className="mr-2 h-4 w-4" /> View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
              onClick={() => handleDelete(job)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CardHeader className="pb-1">
        <div className="flex items-start gap-4">
          <div
            ref={logoRef}
            className="h-14 w-14 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shadow-sm overflow-hidden"
          >
            {/* Replace with company logo */}
            <span className="text-lg font-medium">{company?.name?.substring(0, 2).toUpperCase()}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{title}</h3>
            </div>
            {company && (
              <span className="text-sm text-muted-foreground">
                {company.name}
              </span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent ref={contentRef} className="pb-2 flex-1">
        <div className="space-y-2 text-sm">
          <p className="text-muted-foreground line-clamp-3">
            {description || "No description available"}
          </p>
          {location && (
            <div className="flex items-center text-muted-foreground">
              <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-4 mt-auto">
        <Button variant="outline" size="sm" className="gap-1">
          <Briefcase className="h-4 w-4" />
          <span>Apply</span>
        </Button>
        <Link to={`/jobs/${_id}`}>
          <Button variant="default" size="sm" className="gap-1">
            <Info className="h-4 w-4" />
            <span>Details</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
