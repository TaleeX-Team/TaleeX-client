import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@radix-ui/react-tabs";
import { Briefcase, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AddJob from "@/features/jobs/addJob/createJob";
const jobTypeColors = {
  "Full-time":
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "Part-time": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Contract:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  Internship:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
};
export default function JobsTab({ jobs }) {
  return (
    <TabsContent value="jobs">
      <div className="bg-card rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Open Positions</h2>
          <AddJob />
        </div>

        {
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <Card key={job._id || job.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <div className="flex items-center mt-1">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {job.location || location}
                        </span>
                      </div>
                    </div>
                    <Badge className={jobTypeColors[job.type] || ""}>
                      {job.type || "Full-time"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {job.description}
                  </p>
                  {job.salary && (
                    <div className="flex items-center mt-3">
                      <div className="text-sm font-medium">{job.salary}</div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between pt-3 border-t">
                  {job.posted && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      Posted {job.posted}
                    </div>
                  )}
                  <Button size="sm">Apply Now</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        }
      </div>
    </TabsContent>
  );
}
