// pages/Jobs.tsx
import React from "react";
// import JobCard from "@/components/jobs/job-card/JobCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import JobCard from "./job-card";

export default function Jobs() {
  const navigate = useNavigate();

  // Dummy jobs array
  const dummyJobs = [
    {
      _id: "1",
      title: "Frontend Developer",
      company: { name: "TechCorp" },
      description: "We are looking for a passionate frontend developer with React experience.",
      location: "Remote",
      type: "Full-time",
      website: "https://techcorp.com",
      isFavorite: false,
    },
    {
      _id: "2",
      title: "UI/UX Designer",
      company: { name: "Designify" },
      description: "Create modern interfaces and collaborate with product teams.",
      location: "San Francisco, CA",
      type: "Part-time",
      website: "https://designify.io",
      isFavorite: true,
    },
    {
      _id: "3",
      title: "Backend Developer",
      company: { name: "DevSolutions" },
      description: "Work on scalable backend systems using Node.js and MongoDB.",
      location: "Berlin, Germany",
      type: "Contract",
      website: "https://devsolutions.de",
      isFavorite: false,
    },
  ];

  const handleDelete = (job) => {
    console.log("Delete job:", job);
    // You can later integrate actual delete functionality here
  };

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">Jobs</h2>
        <div className="flex gap-2">
          <Button onClick={() => navigate("/add-job")} size="sm">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Job
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input placeholder="Search jobs..." className="pl-9" />
      </div>

      {/* Jobs Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {dummyJobs.map((job) => (
          <JobCard key={job._id} job={job} handleDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
