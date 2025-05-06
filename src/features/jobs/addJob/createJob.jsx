"use client";

import React, { useState, useRef, useEffect } from "react";
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
import { Plus, X, Loader2 } from "lucide-react";
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
import { useJobs } from "../useJobs";

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
                return parseFloat(data.salary.min) <= parseFloat(data.salary.max);
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

export default function AddJob() {
    const [open, setOpen] = useState(false);
    const [tags, setTags] = useState([]);
    const [currentTag, setCurrentTag] = useState("");
    const [showTagSuggestions, setShowTagSuggestions] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const formContainerRef = useRef(null);

    const { createJobMutation } = useJobs();
    const {
        data: companies = [],
        isLoading: isCompaniesLoading,
        isError: isCompaniesError,
    } = useNonRejectedCompanies();

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
            tags: [],
            salary: {
                min: "",
                max: "",
                currency: "USD",
            },
            hiringTarget: "",
        },
    });

    // Update form tags when tags state changes
    useEffect(() => {
        form.setValue("tags", tags);
    }, [tags, form]);

    // If dialog closes, reset form
    useEffect(() => {
        if (!open) {
            setTimeout(() => {
                form.reset();
                setTags([]);
            }, 300);
        }
    }, [open, form]);

    const onSubmit = async (values) => {
        try {
            setIsSubmitting(true);

            // Transform form values to match API body
            const transformedValues = {
                title: values.title,
                description: values.description,
                requirements: values.requirements,
                company: values.company,
                workPlaceType: values.workPlaceType,
                jobType: values.jobType,
                experienceLevel: values.experienceLevel,
                tags: values.tags?.length ? values.tags : [],
                ...(values.salary?.min || values.salary?.max || values.salary?.currency
                    ? {
                        salary: {
                            ...(values.salary.min && { min: parseFloat(values.salary.min) }),
                            ...(values.salary.max && { max: parseFloat(values.salary.max) }),
                            ...(values.salary.currency && {
                                currency: values.salary.currency,
                            }),
                        },
                    }
                    : {}),
                ...(values.hiringTarget && {
                    hiringTarget: parseInt(values.hiringTarget, 10),
                }),
            };

            await createJobMutation.mutateAsync(transformedValues);
            toast.success("Job added successfully!");
            form.reset();
            setTags([]);
            setOpen(false);
        } catch (error) {
            console.error("Job submission error:", error);
            toast.error(`Failed to add job: ${error.message || "Unknown error"}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddTag = (tag) => {
        if (tag.trim() && !tags.includes(tag.trim())) {
            const newTags = [...tags, tag.trim()];
            setTags(newTags);
            form.setValue("tags", newTags);
            setCurrentTag("");
        }
        setShowTagSuggestions(false);
    };

    const handleRemoveTag = (tag) => {
        const newTags = tags.filter((t) => t !== tag);
        setTags(newTags);
        form.setValue("tags", newTags);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="mt-4 md:mt-0 ml-2 bg-primary hover:bg-primary text-primary-foreground">
                    <Plus className="mr-2 h-4 w-4" /> Post a Job
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] p-0 overflow-y-auto scrollbar-none"
                style={{
                    overscrollBehavior: "contain",
                    maxHeight: "90vh",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}
            >
                <div ref={formContainerRef}>
                    <DialogHeader className="px-6 pt-6 pb-2">
                        <DialogTitle className="text-2xl font-semibold">
                            Create New Job
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Fill in the details to track applications and candidate progress.
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="basic" className="w-full px-6">

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
                                                            className="border-input"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-destructive" />
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
                                                                <SelectTrigger className="w-full sm:w-[268px] border-input">
                                                                    <SelectValue placeholder="Select a company" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {isCompaniesLoading ? (
                                                                    <SelectItem disabled value="loading">
                                                                        <div className="flex items-center">
                                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                            Loading companies...
                                                                        </div>
                                                                    </SelectItem>
                                                                ) : isCompaniesError ? (
                                                                    <SelectItem disabled value="error">
                                                                        Failed to load companies
                                                                    </SelectItem>
                                                                ) : companies.length > 0 ? (
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
                                                        <FormMessage className="text-destructive" />
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
                                                                <SelectTrigger className="w-full sm:w-[268px] border-input">
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
                                                        <FormMessage className="text-destructive" />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex justify-between">
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
                                                                <SelectTrigger className="w-full sm:w-[268px] border-input">
                                                                    <SelectValue placeholder="Select type" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="remote">Remote</SelectItem>
                                                                <SelectItem value="hybrid">Hybrid</SelectItem>
                                                                <SelectItem value="on-site">On-site</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage className="text-destructive" />
                                                    </FormItem>
                                                )}
                                            />

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
                                                                <SelectTrigger className="w-full sm:w-[268px] border-input">
                                                                    <SelectValue placeholder="Select level" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="Intern">Intern</SelectItem>
                                                                <SelectItem value="Entry-Level">
                                                                    Entry-Level
                                                                </SelectItem>
                                                                <SelectItem value="Junior">Junior</SelectItem>
                                                                <SelectItem value="Mid-Level">
                                                                    Mid-Level
                                                                </SelectItem>
                                                                <SelectItem value="Senior">Senior</SelectItem>
                                                                <SelectItem value="Lead">Lead</SelectItem>
                                                                <SelectItem value="Principal">
                                                                    Principal
                                                                </SelectItem>
                                                                <SelectItem value="Staff">Staff</SelectItem>
                                                                <SelectItem value="Manager">Manager</SelectItem>
                                                                <SelectItem value="Director">
                                                                    Director
                                                                </SelectItem>
                                                                <SelectItem value="Vice President">
                                                                    Vice President
                                                                </SelectItem>
                                                                <SelectItem value="C-Level">C-Level</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage className="text-destructive" />
                                                    </FormItem>
                                                )}
                                            />
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
                                                            className="min-h-[150px] border-input"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-destructive" />
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
                                                            className="min-h-[150px] border-input"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-destructive" />
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
                                                    placeholder="e.g. React, Node.js"
                                                    className="border-input"
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            e.preventDefault();
                                                            handleAddTag(currentTag);
                                                        }
                                                    }}
                                                />
                                                {showTagSuggestions && (
                                                    <Command className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-md">
                                                        <CommandInput
                                                            placeholder="Search tags..."
                                                            className="h-10"
                                                        />
                                                        <CommandList>
                                                            <CommandEmpty>No tags found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {COMMON_TAGS.filter(
                                                                    (tag) =>
                                                                        !tags.includes(tag) &&
                                                                        tag
                                                                            .toLowerCase()
                                                                            .includes(currentTag.toLowerCase())
                                                                ).map((tag) => (
                                                                    <CommandItem
                                                                        key={tag}
                                                                        value={tag}
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
                                                                    className="border-input"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage className="text-destructive" />
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
                                                                    className="border-input"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage className="text-destructive" />
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
                                                                defaultValue="USD"
                                                                value={field.value}
                                                            >
                                                                <FormControl>
                                                                    <SelectTrigger className="border-input">
                                                                        <SelectValue placeholder="Select currency" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="USD">USD</SelectItem>
                                                                    <SelectItem value="EUR">EUR</SelectItem>
                                                                    <SelectItem value="SAR">SAR</SelectItem>
                                                                    <SelectItem value="AED">AED</SelectItem>
                                                                    <SelectItem value="KWD">KWD</SelectItem>
                                                                    <SelectItem value="EGP">EGP</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage className="text-destructive" />
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
                                                            className="border-input"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-destructive" />
                                                </FormItem>
                                            )}
                                        />
                                    </TabsContent>

                                    <DialogFooter className="py-4 flex justify-between sm:justify-end gap-2 border-t">
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
                                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                            disabled={
                                                isSubmitting ||
                                                isCompaniesLoading ||
                                                isCompaniesError ||
                                                !form.formState.isValid ||
                                                companies.length === 0
                                            }
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                "Submit Job"
                                            )}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </ScrollArea>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog >
    );
}