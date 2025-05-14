import { Button } from "@/components/ui/button";
import { Edit, Globe, MapPin } from "lucide-react";
import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Trash2, ExternalLink, Info } from "lucide-react";
import { statusBadgeStyles } from "@/utils/statusBadgeStyles";
import { StatusIcon } from "@/components/StatusIcon";
import { Link } from "react-router-dom";
import { gsap } from "gsap";

export default function CompanyCard({ company, handleDelete }) {
  const { t } = useTranslation();

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
  const getInitials = (name) => {
    if (!name) return "CO";
    const words = name.split(" ");
    if (words.length === 1) {
      return name.substring(0, 2).toUpperCase();
    }
    return (words[0][0] + (words[1] ? words[1][0] : words[0][1])).toUpperCase();
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
        <div className="absolute top-5 right-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-background/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground hover:cursor-pointer transition-colors"
            aria-label={t("common.delete")}
            onClick={() => handleDelete(company)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
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
                <span className="text-lg font-medium">{getInitials(name)}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p>
                  <span className="text-lg font-semibold"> {name} </span>

                  {verification?.status && (
                    <Badge
                      className={`${statusBadgeStyles[verification.status]} `}
                    >
                      <StatusIcon status={verification.status} />
                      {verification.status.charAt(0).toUpperCase() +
                        verification.status.slice(1)}
                    </Badge>
                  )}
                </p>
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

        <CardContent ref={contentRef} className="flex-1">
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground line-clamp-3">
              {description || t("companies.noDescription")}
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

        <CardFooter className="flex justify-end">
          <Link to={`${_id}`}>
            <Button variant="default" size="sm" className="gap-1">
              <Info className="h-4 w-4" />
              <span>{t("common.details")}</span>
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </>
  );
}
