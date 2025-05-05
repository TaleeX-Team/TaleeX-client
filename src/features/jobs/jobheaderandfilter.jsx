"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Search,
  Filter,
  Briefcase,
  Building,
  Calendar,
  DollarSign,
  Tag,
} from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { debounce } from "lodash";
import AddJob from "@/features/jobs/addJob/createJob.jsx";

const WORKPLACE_TYPES = ["remote", "on-site", "hybrid"];
const JOB_TYPES = [
  "full-time",
  "part-time",
  "contract",
  "internship",
  "temporary",
  "freelance",
];
const EXPERIENCE_LEVELS = [
  "Intern",
  "Entry-Level",
  "Junior",
  "Mid-Level",
  "Senior",
  "Lead",
  "Principal",
  "Staff",
  "Manager",
  "Director",
  "Vice President",
  "C-Level",
];
const JOB_STATUS = ["open", "pending", "closed"];
const COMMON_TAGS = [
  "JavaScript",
  "React",
  "Node.js",
  "Python",
  "Java",
  "DevOps",
  "AWS",
  "UI/UX",
  "Product Management",
  "Marketing",
];

export default function JobsHeaderWithFilters({
  onFilterChange,
  clearFilters,
}) {
  const [title, setTitle] = useState("");
  const [requirements, setRequirements] = useState("");
  const [company, setCompany] = useState("");
  const [workPlaceType, setWorkPlaceType] = useState("");
  const [jobType, setJobType] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [status, setStatus] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [createdAtFrom, setCreatedAtFrom] = useState(null);
  const [createdAtTo, setCreatedAtTo] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);

  const debouncedFilterChange = useCallback(
    debounce((filters) => {
      if (onFilterChange) {
        onFilterChange(filters);
      }
    }, 300),
    [onFilterChange]
  );

  useEffect(() => {
    const newActiveFilters = [];
    if (title) newActiveFilters.push({ type: "title", value: title });
    if (requirements)
      newActiveFilters.push({ type: "requirements", value: requirements });
    if (company) newActiveFilters.push({ type: "company", value: company });
    if (workPlaceType)
      newActiveFilters.push({ type: "workPlaceType", value: workPlaceType });
    if (jobType) newActiveFilters.push({ type: "jobType", value: jobType });
    if (experienceLevel)
      newActiveFilters.push({
        type: "experienceLevel",
        value: experienceLevel,
      });
    if (status) newActiveFilters.push({ type: "status", value: status });
    if (selectedTags.length > 0)
      newActiveFilters.push({
        type: "tags",
        value: `${selectedTags.length} tags`,
      });
    if (salaryMin)
      newActiveFilters.push({ type: "salaryMin", value: `$${salaryMin}` });
    if (salaryMax)
      newActiveFilters.push({ type: "salaryMax", value: `$${salaryMax}` });
    if (createdAtFrom)
      newActiveFilters.push({
        type: "createdAtFrom",
        value: format(createdAtFrom, "MMM d, yyyy"),
      });
    if (createdAtTo)
      newActiveFilters.push({
        type: "createdAtTo",
        value: format(createdAtTo, "MMM d, yyyy"),
      });

    setActiveFilters(newActiveFilters);
  }, [
    title,
    requirements,
    company,
    workPlaceType,
    jobType,
    experienceLevel,
    status,
    selectedTags,
    salaryMin,
    salaryMax,
    createdAtFrom,
    createdAtTo,
  ]);

  useEffect(() => {
    const filters = {
      ...(title && { title }),
      ...(requirements && { requirements }),
      ...(company && { company }),
      ...(workPlaceType && { workPlaceType }),
      ...(jobType && { jobType }),
      ...(experienceLevel && { experienceLevel }),
      ...(status && { status }),
      ...(selectedTags.length > 0 && { tags: selectedTags }),
      ...(salaryMin && { salaryMin: parseInt(salaryMin, 10) }),
      ...(salaryMax && { salaryMax: parseInt(salaryMax, 10) }),
      ...(createdAtFrom && { createdAtFrom: createdAtFrom.toISOString() }),
      ...(createdAtTo && { createdAtTo: createdAtTo.toISOString() }),
    };

    debouncedFilterChange(filters);

    return () => {
      debouncedFilterChange.cancel();
    };
  }, [
    title,
    requirements,
    company,
    workPlaceType,
    jobType,
    experienceLevel,
    status,
    selectedTags,
    salaryMin,
    salaryMax,
    createdAtFrom,
    createdAtTo,
    debouncedFilterChange,
  ]);

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput) {
      e.preventDefault();
      if (!selectedTags.includes(tagInput)) {
        setSelectedTags((prev) => [...prev, tagInput]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setSelectedTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const clearFilter = (type) => {
    switch (type) {
      case "title":
        setTitle("");
        break;
      case "requirements":
        setRequirements("");
        break;
      case "company":
        setCompany("");
        break;
      case "workPlaceType":
        setWorkPlaceType("");
        break;
      case "jobType":
        setJobType("");
        break;
      case "experienceLevel":
        setExperienceLevel("");
        break;
      case "status":
        setStatus("");
        break;
      case "tags":
        setSelectedTags([]);
        break;
      case "salaryMin":
        setSalaryMin("");
        break;
      case "salaryMax":
        setSalaryMax("");
        break;
      case "createdAtFrom":
        setCreatedAtFrom(null);
        break;
      case "createdAtTo":
        setCreatedAtTo(null);
        break;
      default:
        break;
    }
  };

  const clearAllFilters = () => {
    setTitle("");
    setRequirements("");
    setCompany("");
    setWorkPlaceType("");
    setJobType("");
    setExperienceLevel("");
    setStatus("");
    setSelectedTags([]);
    setSalaryMin("");
    setSalaryMax("");
    setCreatedAtFrom(null);
    setCreatedAtTo(null);
    setActiveFilters([]);
    if (clearFilters) {
      clearFilters();
    }
    debouncedFilterChange.cancel();
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 m-5">
        <div>
          <h1 className="text-3xl font-bold">Job Listings</h1>
          <p className="text-muted-foreground mt-1">
            Find your next career opportunity
          </p>
        </div>
        <div className="flex gap-2 mt-3 md:mt-0">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          {showFilters && (
            <Button
              variant="outline"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              {showAdvancedFilters ? "Basic Filters" : "Advanced Filters"}
            </Button>
          )}
          <AddJob />
        </div>
      </div>

      <div className="flex flex-col space-y-4 mx-4">
        <div className="flex w-full gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs by title"
              className="pl-10"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <Button>Search</Button>
        </div>

        {showFilters && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <Select value={workPlaceType} onValueChange={setWorkPlaceType}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Workplace Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {WORKPLACE_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type
                          .split("-")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={experienceLevel}
                  onValueChange={setExperienceLevel}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Experience Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERIENCE_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {showAdvancedFilters && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Job Requirements"
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Company ID"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Job Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {JOB_STATUS.map((stat) => (
                          <SelectItem key={stat} value={stat}>
                            {stat.charAt(0).toUpperCase() + stat.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center">
                      <Tag className="h-4 w-4 mr-2" />
                      Tags (Skills or Keywords)
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:bg-muted rounded-full"
                            aria-label={`Remove ${tag} tag`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a tag"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                      />
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {COMMON_TAGS.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="cursor-pointer hover:bg-accent"
                          onClick={() => {
                            if (!selectedTags.includes(tag)) {
                              setSelectedTags((prev) => [...prev, tag]);
                            }
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium flex items-center mb-2">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Salary Range
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          type="number"
                          placeholder="Min Salary"
                          value={salaryMin}
                          onChange={(e) => setSalaryMin(e.target.value)}
                        />
                        <Input
                          type="number"
                          placeholder="Max Salary"
                          value={salaryMax}
                          onChange={(e) => setSalaryMax(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium flex items-center mb-2">
                          <Calendar className="h-4 w-4 mr-2" />
                          Posted After
                        </label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              {createdAtFrom ? (
                                format(createdAtFrom, "PPP")
                              ) : (
                                <span className="text-muted-foreground">
                                  Pick a date
                                </span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                              mode="single"
                              selected={createdAtFrom}
                              onSelect={setCreatedAtFrom}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <label className="text-sm font-medium flex items-center mb-2">
                          <Calendar className="h-4 w-4 mr-2" />
                          Posted Before
                        </label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              {createdAtTo ? (
                                format(createdAtTo, "PPP")
                              ) : (
                                <span className="text-muted-foreground">
                                  Pick a date
                                </span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                              mode="single"
                              selected={createdAtTo}
                              onSelect={setCreatedAtTo}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {activeFilters.length > 0 && (
        <div className="mt-4">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">
              Active filters:
            </span>
            {activeFilters.map((filter) => (
              <Badge
                key={filter.type}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {filter.type === "title"
                  ? "Title"
                  : filter.type === "requirements"
                  ? "Requirements"
                  : filter.type === "company"
                  ? "Company"
                  : filter.type === "workPlaceType"
                  ? "Workplace"
                  : filter.type === "jobType"
                  ? "Job Type"
                  : filter.type === "experienceLevel"
                  ? "Experience"
                  : filter.type === "status"
                  ? "Status"
                  : filter.type === "tags"
                  ? "Tags"
                  : filter.type === "salaryMin"
                  ? "Min Salary"
                  : filter.type === "salaryMax"
                  ? "Max Salary"
                  : filter.type === "createdAtFrom"
                  ? "From Date"
                  : "To Date"}
                : {filter.value}
                <button
                  type="button"
                  onClick={() => clearFilter(filter.type)}
                  className="ml-1 hover:bg-muted rounded-full"
                  aria-label={`Clear ${filter.type} filter`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={clearAllFilters}
              className="text-xs hover:bg-muted"
            >
              Clear all
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
