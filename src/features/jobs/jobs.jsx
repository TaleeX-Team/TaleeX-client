
import { useState } from "react";
import { useJobs } from "./useJobs";
import JobsHeaderWithFilters from "./jobheaderandfilter";
import JobCard from "./job-card";

export default function JobsPage() {
const [filters, setFilters] = useState({});
const { jobsQuery, filterJobsQuery } = useJobs();

const isFiltering = Object.values(filters).some((val) => val?.trim?.() !== "");

// const {
// data: jobData,
// isLoading,
// isError,
// } = isFiltering ? filterJobsQuery(filters) : jobsQuery;
const {
  data: jobData,
  isLoading,
  isError,
  } = isFiltering ? filterJobsQuery(filters) : jobsQuery;

return (
<div className="p-6">
<JobsHeaderWithFilters onFilterChange={setFilters} />

  {isLoading ? (
    <p>Loading jobs...</p>
  ) : isError ? (
    <p>Failed to load jobs.</p>
  ) : jobData?.jobs?.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobData.jobs.map((job) => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  ) : (
    <p className="text-muted-foreground">No jobs found for the selected filters.</p>
  )}
</div>)}