import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { MapPin, Globe, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CompanyCard({ company }) {
  const { name, id, description, website, image, address } = company;
  return (
    <Card key={company.id} className="overflow-hidden flex flex-col relative">
      <button
        onClick={() => console.log("Delete company", id)}
        className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
        aria-label={`Delete ${company.name}`}
      >
        <X className="h-4 w-4" />
      </button>
      <CardHeader className="pb-1">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            {image ? (
              <img
                src={image || "/placeholder.svg"}
                alt={`${name} logo`}
                className="h-full w-full object-cover rounded"
              />
            ) : (
              name.substring(0, 2)
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{name}</h3>
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary flex items-center hover:underline"
            >
              <Globe className="mr-1 h-3 w-3" />
              {new URL(website).hostname.replace("www.", "")}
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-1">
        <div className="space-y-2 text-sm">
          <p className="text-muted-foreground line-clamp-3">{description}</p>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4" />
            {address}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-4 mt-auto">
        <Button variant="outline" size="sm">
          Add Job
        </Button>
        <Button variant="default" size="sm">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
