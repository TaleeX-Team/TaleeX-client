import { Globe } from "@/components/Globe";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@radix-ui/react-tabs";
import { ExternalLink, MapPin } from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";

export default function AboutTab({
  description,
  values,
  website,
  address,
  name,
}) {
  return (
    <TabsContent value="about" className="space-y-8">
      <div className="bg-card rounded-lg shadow-sm border p-6 space-y-2">
        <h2 className="text-xl font-semibold mb-4">About {name}</h2>
        <p className="text-muted-foreground whitespace-pre-line">
          {description}
        </p>
        {values && values.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium mb-3">Company Values</h3>
            <div className="flex flex-wrap gap-2">
              {values.map((value, index) => (
                <Badge
                  key={index}
                  className="bg-primary/10 text-primary border-primary/20"
                >
                  {value}
                </Badge>
              ))}
            </div>
          </div>
        )}
        <Separator className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-4">Contact Information</h3>
            <div className="space-y-3">
              {website && (
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center"
                  >
                    {website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4">Company Details</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
  );
}
