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
import JobCard from "@/features/jobs/form/components/JobCard";
import { useTranslation } from "react-i18next";

const jobTypeColors = {
  "Full-time":
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "Part-time": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Contract:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  Internship:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
};

export default function JobsTab({ jobs, verification }) {
  const { t } = useTranslation();

  return (
    <TabsContent value="jobs">
      <div className="bg-card rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">{t("companies.jobsTabTitle")}</h2>
          {verification.status !== "rejected" && <AddJob />}
        </div>

        {
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        }
      </div>
    </TabsContent>
  );
}
