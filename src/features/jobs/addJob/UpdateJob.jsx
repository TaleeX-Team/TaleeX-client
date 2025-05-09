"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Edit, X, Loader2, Briefcase } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as z from "zod";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useNonRejectedCompanies } from "@/hooks/useNonRejectedCompanies";
import { useJobs } from "@/features/jobs/useJobs.js";

const formSchema = z
  .object({
    title: z
      .string()
      .min(3, { message: "Title must be at least 3 characters" }),
    description: z
      .string()
      .min(10, { message: "Description must be at least 10 characters" }),
    requirements: z
      .string()
      .min(10, { message: "Requirements must be at least 10 characters" }),
    company: z.string().min(1, { message: "Company is required" }),
    workPlaceType: z.enum(["remote", "on-site", "hybrid"], {
      message: "Workplace type is required",
    }),
    jobType: z.enum(
      [
        "full-time",
        "part-time",
        "contract",
        "internship",
        "temporary",
        "freelance",
      ],
      {
        message: "Job type is required",
      }
    ),
    experienceLevel: z.enum(
      [
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
      ],
      { message: "Experience level is required" }
    ),
    status: z
      .enum(["open", "paused", "closed"], {
        message: "Status is required",
      })
      .optional(),
    tags: z.array(z.string()).optional(),
    salary: z
      .object({
        min: z.string().optional(),
        max: z.string().optional(),
        currency: z.enum(["USD", "EUR", "SAR", "AED", "KWD", "EGP"]).optional(),
      })
      .optional(),
    hiringTarget: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.salary?.min && data.salary?.max) {
        return (
          Number.parseFloat(data.salary.min) <=
          Number.parseFloat(data.salary.max)
        );
      }
      return true;
    },
    {
      message: "Minimum salary must be less than or equal to maximum salary",
      path: ["salary.max"],
    }
  );

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

export default function UpdateJob({ jobId, trigger }) {
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);

  const { updateJobMutation, fetchJob } = useJobs();
  const { data: companies = [], isLoading: isCompaniesLoading } =
    useNonRejectedCompanies();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      requirements: "",
      company: "",
      workPlaceType: "remote",
      jobType: "full-time",
      experienceLevel: "Intern",
      status: "open",
      tags: [],
      salary: {
        min: "",
        max: "",
        currency: "USD",
      },
      hiringTarget: "",
    },
  });

  const loadJobData = useCallback(async () => {
    if (!jobId) return;

    setIsLoading(true);
    try {
      const data = await fetchJob(jobId);
      if (!data) throw new Error("Job not found");

      const companyId =
        typeof data.company === "object"
          ? data.company?.id || data.company?._id
          : data.company;

      form.reset({
        title: data.title || "",
        description: data.description || "",
        requirements: data.requirements || "",
        company: companyId || "",
        workPlaceType: data.workPlaceType || "remote",
        jobType: data.jobType || "full-time",
        experienceLevel: data.experienceLevel || "Intern",
        status: data.status || "open",
        tags: data.tags || [],
        salary: {
          min: data.salary?.min?.toString() || "",
          max: data.salary?.max?.toString() || "",
          currency: data.salary?.currency || "USD",
        },
        hiringTarget: data.hiringTarget?.toString() || "",
      });

      setTags(data.tags || []);
      setHasLoadedInitialData(true);
    } catch (error) {
      console.error("Error loading job:", error);
      toast.error(`Failed to load job: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [jobId, fetchJob, form]);

  useEffect(() => {
    if (open && !hasLoadedInitialData) {
      loadJobData();
    }
  }, [open, hasLoadedInitialData, loadJobData]);

  useEffect(() => {
    if (!open) {
      setTags([]);
      setCurrentTag("");
      setShowTagSuggestions(false);
      setHasLoadedInitialData(false);
      form.reset();
    }
  }, [open, form]);

  useEffect(() => {
    form.setValue("tags", tags);
  }, [tags, form]);

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);

      const transformedValues = {
        id: jobId,
        title: values.title,
        description: values.description,
        requirements: values.requirements,
        company: values.company,
        workPlaceType: values.workPlaceType,
        jobType: values.jobType,
        experienceLevel: values.experienceLevel,
        status: values.status || "open",
        tags: values.tags || [],
        salary: {
          min: values.salary?.min
            ? Number.parseFloat(values.salary.min)
            : undefined,
          max: values.salary?.max
            ? Number.parseFloat(values.salary.max)
            : undefined,
          currency: values.salary?.currency || undefined,
        },
        hiringTarget: values.hiringTarget
          ? Number.parseInt(values.hiringTarget, 10)
          : undefined,
      };

      // Remove undefined values for cleaner API payload
      if (
        !transformedValues.salary.min &&
        !transformedValues.salary.max &&
        !transformedValues.salary.currency
      ) {
        delete transformedValues.salary;
      }

      const jobData = {
        id: transformedValues.id,
        updates: {
          title: transformedValues.title,
          description: transformedValues.description,
          requirements: transformedValues.requirements,
          company: transformedValues.company,
          workPlaceType: transformedValues.workPlaceType,
          jobType: transformedValues.jobType,
          experienceLevel: transformedValues.experienceLevel,
          status: transformedValues.status,
          tags: transformedValues.tags,
          salary: transformedValues.salary,
          hiringTarget: transformedValues.hiringTarget,
        },
      };

      console.log("Submitting job update:", jobData);
      await updateJobMutation.mutateAsync(jobData);
      setOpen(false);
    } catch (error) {
      console.error("Job update error:", error);
      toast.error(
        `Update failed: ${error?.response?.data?.message || "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = (tag) => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      const newTags = [...tags, tag.trim()];
      setTags(newTags);
      setCurrentTag("");
    }
    setShowTagSuggestions(false);
  };

  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const filteredTags = COMMON_TAGS.filter(
    (tag) =>
      !tags.includes(tag) &&
      tag.toLowerCase().includes(currentTag.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" /> Edit Job
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[600px] p-0 overflow-y-auto scrollbar-none"
        style={{
          overscrollBehavior: "contain",
          maxHeight: "90vh",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <DialogHeader className="px-6 pt-6 pb-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-semibold">
              Update Job Posting
            </DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground">
            Edit the details of this job posting.
          </DialogDescription>
        </DialogHeader>

        {isLoading && !hasLoadedInitialData ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading job details...</span>
          </div>
        ) : (
          <Tabs defaultValue="basics" className="w-full px-6">
            <TabsList className="grid w-full grid-cols-3 mb-4 bg-secondary/50 dark:bg-card">
              <TabsTrigger value="basics">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Job Details</TabsTrigger>
              <TabsTrigger value="additional">Additional Info</TabsTrigger>
            </TabsList>

            <ScrollArea className="max-h-[65vh]">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <TabsContent value="basics" className="space-y-4 py-2">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Job Title *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Frontend Developer"
                              className="bg-input"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex justify-between">
                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              Company *
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full bg-input">
                                  <SelectValue placeholder="Select a company" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {isCompaniesLoading ? (
                                  <div className="flex items-center p-2 text-sm">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Loading companies...
                                  </div>
                                ) : companies.length > 0 ? (
                                  companies.map((comp) => (
                                    <SelectItem
                                      key={comp.id || comp._id}
                                      value={comp.id || comp._id}
                                    >
                                      {comp.name}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <div className="p-2 text-sm">
                                    No companies available
                                  </div>
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="jobType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              Job Type *
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full sm:w-[268px] bg-input">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="full-time">
                                  Full-time
                                </SelectItem>
                                <SelectItem value="part-time">
                                  Part-time
                                </SelectItem>
                                <SelectItem value="contract">
                                  Contract
                                </SelectItem>
                                <SelectItem value="internship">
                                  Internship
                                </SelectItem>
                                <SelectItem value="temporary">
                                  Temporary
                                </SelectItem>
                                <SelectItem value="freelance">
                                  Freelance
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex justify-between">
                      <FormField
                        control={form.control}
                        name="experienceLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              Experience Level *
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full sm:w-[268px] bg-input">
                                  <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {[
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
                                ].map((level) => (
                                  <SelectItem key={level} value={level}>
                                    {level}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="workPlaceType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              Workplace Type *
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full sm:w-[268px] bg-input">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="remote">Remote</SelectItem>
                                <SelectItem value="hybrid">Hybrid</SelectItem>
                                <SelectItem value="on-site">On-site</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              Status
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full sm:w-[268px] bg-input">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      /> */}
                    </div>
                  </TabsContent>

                  <TabsContent value="details" className="space-y-4 py-2">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Description *
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the job responsibilities and role"
                              className="min-h-[150px] bg-input"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="requirements"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Requirements *
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="List the required skills and qualifications"
                              className="min-h-[150px] bg-input"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="additional" className="space-y-6 py-2">
                    <div className="space-y-2">
                      <FormLabel className="text-sm font-medium">
                        Tags
                      </FormLabel>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="flex items-center gap-1 bg-secondary text-secondary-foreground"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1 rounded-full hover:bg-secondary/20 p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="relative">
                        <Input
                          value={currentTag}
                          onChange={(e) => setCurrentTag(e.target.value)}
                          onFocus={() => setShowTagSuggestions(true)}
                          onBlur={() =>
                            setTimeout(() => setShowTagSuggestions(false), 200)
                          }
                          placeholder="e.g. React, Node.js"
                          className="bg-input"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddTag(currentTag);
                            }
                          }}
                        />
                        {showTagSuggestions && filteredTags.length > 0 && (
                          <Command className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-md">
                            <CommandList>
                              <CommandGroup>
                                {filteredTags.map((tag) => (
                                  <CommandItem
                                    key={tag}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onSelect={() => handleAddTag(tag)}
                                    className="cursor-pointer"
                                  >
                                    {tag}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-sm font-medium mb-3">
                        Salary Information
                      </h3>
                      <div className="grid grid-cols-3 gap-3 flex justify-between">
                        <FormField
                          control={form.control}
                          name="salary.min"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Min Salary
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="e.g. 50000"
                                  className="bg-input"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="salary.max"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Max Salary
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="e.g. 100000"
                                  className="bg-input"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="salary.currency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Currency
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-input">
                                    <SelectValue placeholder="Select currency" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {[
                                    "USD",
                                    "EUR",
                                    "SAR",
                                    "AED",
                                    "KWD",
                                    "EGP",
                                  ].map((curr) => (
                                    <SelectItem key={curr} value={curr}>
                                      {curr}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="hiringTarget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Hiring Target
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g. 3"
                              className="bg-input"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <DialogFooter className="px-6 py-4 flex justify-between sm:justify-end gap-2 border-t">
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="border-input hover:bg-muted"
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      disabled={
                        isLoading ||
                        isCompaniesLoading ||
                        !form.formState.isValid
                      }
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Job"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </ScrollArea>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
