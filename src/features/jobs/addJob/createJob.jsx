import React, { useState, useRef } from "react";
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
import { Plus, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as z from "zod";
import { toast } from "sonner";
import { gsap } from "gsap";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useCompanies } from "@/hooks/useCompanies";
import { useJobs } from "../useJobs";




const formSchema = z.object({
  title: z.string().min(3, { message: "Title is required" }),
  description: z.string().min(10, { message: "Description is required" }),
  requirements: z.string().min(10, { message: "Requirements are required" }),
  company: z.string().min(1, { message: "Company is required" }),


  workPlaceType: z.enum(["remote","hybrid", "on-site"]),

  jobType: z.enum(["full-time", "part-time","contract","internship","temporary","freelance"]),

  experienceLevel: z.enum(["intern","Entry-Level", "Junior", "Mid-Level", "Senior","Lead", "Staff","Principal", "Manager", "Director", "Vice President", "C-Level"]),

  tags: z.array(z.string()).optional(),

  salary: z
  .object({
    min: z.coerce.number().min(0, { message: "Minimum salary is required" }),
    max: z.coerce.number().min(0, { message: "Maximum salary is required" }),
    currency: z.enum(["USD", "EUR", "SAR", "AED", "KWD", "EGP"]).optional(),
  })
  .optional(),
//optianal
  hiringTarget: z.string().optional(),
});


export default function AddJob() {
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const formContainerRef = useRef(null);

  const {createJobMutation} = useJobs()
  const { companies =[{id:'test',name:"gggg"}] } =useCompanies();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      requirements: "",
      company: "",
      workPlaceType: "remote",
      jobType: "full-time",
      experienceLevel: "intern",
      tags: [],
      salary: {
        min: "",
        max: "",
        currency: "USD",
      },
      hiringTarget: "",
    },
  });

  const onSubmit = (values) => {
    createJobMutation.mutate(values);
    const result = formSchema.safeParse(values);
    if (!result.success) {
      console.log("Invalid form data");
      return;
    }

    toast.success("Job added successfully!");
    console.log(values);
    form.reset();
    setTags([]);
    setOpen(false);
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      const newTags = [...tags, currentTag.trim()];
      setTags(newTags);
      form.setValue("tags", newTags);
      setCurrentTag("");
      gsap.fromTo(
        ".job-tag-badge:last-child",
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3 }
      );
    }
  };

  const handleRemoveTag = (tag) => {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
    form.setValue("tags", newTags);
  };
  // console.log(companies ,companies.length)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" className="mt-4 md:mt-0 ml-2 bg-primary text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" /> Post a Job
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] p-0 overflow-y-auto scrollbar-none"
        style={{
          overscrollBehavior: "contain",
          maxHeight: "90vh",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}>
        <div ref={formContainerRef}>
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl">Add New Job</DialogTitle>
            <DialogDescription>
              Fill in the job details to add a new position.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="px-6 py-4 max-h-[70vh]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Frontend Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Job description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="requirements" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requirements *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Job requirements" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

<FormField
  control={form.control}
  name="company"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Company *</FormLabel>
      <Select onValueChange={field.onChange} value={field.value || ""}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select a company" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {companies.length > 0 ? (
            companies.map((comp) =>
              comp?._id && comp?.name ? (
                <SelectItem key={comp._id} value={comp._id}>
                  {comp.name}
                </SelectItem>
              ) : null
            )
          ) : (
            <SelectItem disabled value="no-companies">
              No companies available
            </SelectItem>
          )}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>

<FormField control={form.control} name="workPlaceType" render={({ field }) => (
  <FormItem>
    <FormLabel>Workplace Type *</FormLabel>
    <Select onValueChange={field.onChange} defaultValue={field.value}>
      <FormControl>
        <SelectTrigger>
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
)} />


                <FormField control={form.control} name="jobType" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
        <SelectItem value="part-time">Part-time</SelectItem>
        <SelectItem value="contract">Contract</SelectItem>
        <SelectItem value="internship">Internship</SelectItem>
        <SelectItem value="temporary">Temporary</SelectItem>
        <SelectItem value="freelance">Freelance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="experienceLevel" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience Level *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                      <SelectItem  value="intern">Intern</SelectItem>
        <SelectItem value="Entry-Level">Entry-Level</SelectItem>
        <SelectItem value="Junior">Junior</SelectItem>
        <SelectItem value="Mid-Level">Mid-Level</SelectItem>
        <SelectItem value="Senior">Senior</SelectItem>
        <SelectItem value="Lead">Lead</SelectItem>
        <SelectItem value="Staff">Staff</SelectItem>
        <SelectItem value="Principal">Principal</SelectItem>
        <SelectItem value="Manager">Manager</SelectItem>
        <SelectItem value="Director">Director</SelectItem>
        <SelectItem value="Vice President">Vice President</SelectItem>
        <SelectItem value="C-Level">C-Level</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Tags */}
                <div className="space-y-2">
                  <FormLabel>Tags</FormLabel>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag, i) => (
                      <Badge key={i} className="job-tag-badge flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 rounded-full hover:bg-primary/20 p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="e.g. React, Node"
                    />
                    <Button type="button" variant="outline" size="icon" onClick={handleAddTag}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Salary */}
                <div className="grid grid-cols-3 gap-2">
                  <FormField
                    control={form.control}
                    name="salary.min"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Salary</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g. 1000" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="salary.max"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Salary</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g. 5000" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="salary.currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem  value="USD">USD</SelectItem>
          <SelectItem value="EUR">EUR</SelectItem>
          <SelectItem value="SAR">SAR</SelectItem>
          <SelectItem value="AED">AED</SelectItem>
          <SelectItem value="KWD">KWD</SelectItem>
          <SelectItem value="EGP">EGP</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Hiring Target */}
                <FormField
                  control={form.control}
                  name="hiringTarget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hiring Target</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 3" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <DialogFooter className="py-4">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" className="bg-primary text-primary-foreground">
                    Submit Job
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

