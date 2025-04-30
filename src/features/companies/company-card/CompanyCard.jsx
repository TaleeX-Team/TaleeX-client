import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  MapPin,
  Globe,
  ExternalLink,
  Trash2,
  Info,
  Briefcase,
  MoreHorizontal,
  Star,
  StarOff,
} from "lucide-react";
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
import { statusBadgeStyles } from "@/utils/statusBadgeStyles";
import { StatusIcon } from "@/components/StatusIcon";

export default function CompanyCard({ company, handleDelete }) {
  // Add fallback for company to prevent errors if it's undefined
  if (!company) {
    return null; // Or render a placeholder/skeleton
  }

  const {
    name = "",
    _id,
    description = "",
    website,
    image,
    address,
    verification,
    values,
  } = company;
  const [isFavorite, setIsFavorite] = useState(false);

  // Refs for animations
  const cardRef = useRef(null);
  const contentRef = useRef(null);
  const logoRef = useRef(null);

  // For handling card hover animations
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

  // Initial animation when component mounts
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

  // Handle company delete
  //   const handleDelete = () => {
  //     console.log("Delete company", id);
  //     setShowDeleteDialog(false);

  //     // Animation for card removal
  //     if (cardRef.current) {
  //       gsap.to(cardRef.current, {
  //         opacity: 0,
  //         y: -20,
  //         scale: 0.95,
  //         duration: 0.5,
  //         onComplete: () => {
  //           // Here you would actually remove the company from your state or database
  //           console.log("Company removed from UI");
  //         },
  //       });
  //     }
  //   };

  // Toggle favorite status
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);

    // Animation for favorite button
    gsap.fromTo(
      ".favorite-icon",
      { scale: 0.8, rotation: -10 },
      { scale: 1.2, rotation: 0, duration: 0.3, yoyo: true, repeat: 1 }
    );
  };

  // Format website URL for display
  const formatWebsiteUrl = (url) => {
    if (!url) return "";

    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  // Get initials safely
  const getInitials = () => {
    if (!name) return "??";
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <Card
        ref={cardRef}
        className="overflow-hidden flex flex-col relative border border-border hover:border-border/80 transition-all duration-300"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Actions Menu */}
        <div className="absolute top-2 right-2 flex gap-2">
          {/* <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleFavorite}
                  className="p-1.5 rounded-full bg-background/80 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                >
                  {isFavorite ? (
                    <Star className="h-4 w-4 text-amber-400 favorite-icon" />
                  ) : (
                    <StarOff className="h-4 w-4 favorite-icon" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {isFavorite ? "Remove from favorites" : "Add to favorites"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider> */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-1.5 rounded-full bg-background/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground transition-colors"
                aria-label="Company actions"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="cursor-pointer">
                <Info className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Briefcase className="mr-2 h-4 w-4" /> Add Job
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer"
                onClick={() => handleDelete(company)}
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
              {image ? (
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${name} logo`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-lg font-medium">{getInitials()}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{name}</h3>
                {verification?.status && (
                  <Badge className={statusBadgeStyles[verification?.status]}>
                    <StatusIcon status={verification?.status} />
                    {verification?.status.charAt(0).toUpperCase() +
                      verification?.status.slice(1)}
                  </Badge>
                )}
              </div>
              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary flex items-center hover:underline"
                >
                  <Globe className="mr-1 h-3 w-3" />
                  {formatWebsiteUrl(website)}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent ref={contentRef} className="pb-2 flex-1">
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground line-clamp-3">
              {description || "No description available"}
            </p>
            {address && (
              <div className="flex items-center text-muted-foreground">
                <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">{address}</span>
              </div>
            )}
          </div>
          {values && values.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {values.slice(0, 3).map((value, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/20"
                >
                  {value}
                </Badge>
              ))}
              {values.length > 3 && (
                <Badge
                  variant="outline"
                  className="bg-primary/5 text-primary/70 border-primary/10"
                >
                  +{values.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between pt-4 mt-auto">
          <Button variant="outline" size="sm" className="gap-1">
            <Briefcase className="h-4 w-4" />
            <span>Add Job</span>
          </Button>
          <Link to={`/companies/${_id}`}>
            <Button variant="default" size="sm" className="gap-1">
              <Info className="h-4 w-4" />
              <span>Details</span>
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </>
  );
}
