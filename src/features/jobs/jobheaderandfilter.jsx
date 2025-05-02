import { useState } from "react";
import { Briefcase, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useCompanies } from "@/hooks/useCompanies";
import AddJob from "./addJob/createJob";

export default function JobsHeaderWithFilters({ onFilterChange }) {
  const { companies, loading } = useCompanies();

  const [filters, setFilters] = useState({
    search: "",
    jobType: "",
    company: "",
  });

  const handleChange = (field, value) => {
    const updated = { ...filters, [field]: value };
    setFilters(updated);
    onFilterChange?.(updated);
  };

  return (
    <div className="bg-muted/20 p-4 md:p-6 rounded-xl shadow-sm mb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-primary/10 p-3 rounded-lg mr-4">
            <Briefcase className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Jobs</h1>
            <p className="text-muted-foreground">Manage your job listings</p>
          </div>
          
        </div>
        <div className="mt-4 md:mt-0 animate-pulse">
                      <AddJob></AddJob>
             </div>
      </div>

      {/* Filters */}
  <div className="flex flex-col sm:flex-row gap-4">
    {/* Search */}
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search jobs..."
        className="pl-10"
        value={filters.search}
        onChange={(e) => handleChange("search", e.target.value)}
      />
    </div>

    {/* Job Type Filter */}
    <Select onValueChange={(val) => handleChange("jobType", val)}>
      <SelectTrigger className="w-full sm:w-[180px]">
        <SelectValue placeholder="Filter by job type" />
      </SelectTrigger>
      <SelectContent>
       <SelectItem value="full-time">Full-time</SelectItem>
               <SelectItem value="part-time">Part-time</SelectItem>
               <SelectItem value="contract">Contract</SelectItem>
               <SelectItem value="internship">Internship</SelectItem>
               <SelectItem value="temporary">Temporary</SelectItem>
               <SelectItem value="freelance">Freelance</SelectItem>
      </SelectContent>
    </Select>

    {/* Company Filter */}
    <Select onValueChange={(val) => handleChange("company", val)}>
      <SelectTrigger className="w-full sm:w-[200px]">
        <SelectValue placeholder="Filter by company" />
      </SelectTrigger>
      <SelectContent>
        {companies
          .filter((company) => company?.name?.trim())
          .map((company) => (
            <SelectItem key={company._id} value={String(company.name)}>
              {company.name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  </div>
</div>
  );
}