"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
import { Plus, X, Loader2, Briefcase } from "lucide-react";
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
    const { t } = useTranslation();
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

    const formSchema = z
        .object({
            title: z
                .string()
                .min(3, { message: t("addJob.validation.title.min") }),
            description: z
                .string()
                .min(10, { message: t("addJob.validation.description.min") }),
            requirements: z
                .string()
                .min(10, { message: t("addJob.validation.requirements.min") }),
            company: z.string().min(1, { message: t("addJob.validation.company.required") }),
            workPlaceType: z.enum(["remote", "on-site", "hybrid"], {
                message: t("addJob.validation.workPlaceType.required"),
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
                    message: t("addJob.validation.jobType.required"),
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
                { message: t("addJob.validation.experienceLevel.required") }
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
                message: t("addJob.validation.salary.max"),
                path: ["salary.max"],
            }
        );

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
            toast.success(t("addJob.toast.success"));
            form.reset();
            setTags([]);
            setOpen(false);
        } catch (error) {
            console.error("Job submission error:", error);
            toast.error(t("addJob.toast.error", { message: error?.response?.data?.message || t("addJob.toast.errorDefault") }));
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
                <Button className="mt-4 md:mt-0 bg-primary hover:bg-primary text-primary-foreground">
                    <Plus className="mr-2 h-4 w-4" /> {t("addJob.button.postJob")}
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
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                                <Briefcase className="h-5 w-5 text-primary" />
                            </div>
                            <DialogTitle className="text-2xl font-semibold">
                                {t("addJob.dialog.title")}
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-muted-foreground">
                            {t("addJob.dialog.description")}
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="basics" className="w-full px-6">
                        <TabsList className="grid w-full grid-cols-3 mb-4 bg-secondary/50 dark:bg-card">
                            <TabsTrigger value="basics">{t("addJob.tabs.basics")}</TabsTrigger>
                            <TabsTrigger value="details">{t("addJob.tabs.details")}</TabsTrigger>
                            <TabsTrigger value="additional">{t("addJob.tabs.additional")}</TabsTrigger>
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
                                                        {t("addJob.form.title.label")} *
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder={t("addJob.form.title.placeholder")}
                                                            className="bg-input"
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
                                                            {t("addJob.form.company.label")} *
                                                        </FormLabel>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            value={field.value}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="w-full sm:w-[268px] bg-input">
                                                                    <SelectValue placeholder={t("addJob.form.company.placeholder")} />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {isCompaniesLoading ? (
                                                                    <SelectItem disabled value="loading">
                                                                        <div className="flex items-center">
                                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                            {t("addJob.form.company.loading")}
                                                                        </div>
                                                                    </SelectItem>
                                                                ) : isCompaniesError ? (
                                                                    <SelectItem disabled value="error">
                                                                        {t("addJob.form.company.error")}
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
                                                                        {t("addJob.form.company.noCompanies")}
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
                                                            {t("addJob.form.jobType.label")} *
                                                        </FormLabel>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            value={field.value}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="w-full sm:w-[268px] bg-input">
                                                                    <SelectValue placeholder={t("addJob.form.jobType.placeholder")} />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="full-time">
                                                                    {t("addJob.form.jobType.options.fullTime")}
                                                                </SelectItem>
                                                                <SelectItem value="part-time">
                                                                    {t("addJob.form.jobType.options.partTime")}
                                                                </SelectItem>
                                                                <SelectItem value="contract">
                                                                    {t("addJob.form.jobType.options.contract")}
                                                                </SelectItem>
                                                                <SelectItem value="internship">
                                                                    {t("addJob.form.jobType.options.internship")}
                                                                </SelectItem>
                                                                <SelectItem value="temporary">
                                                                    {t("addJob.form.jobType.options.temporary")}
                                                                </SelectItem>
                                                                <SelectItem value="freelance">
                                                                    {t("addJob.form.jobType.options.freelance")}
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
                                                            {t("addJob.form.workPlaceType.label")} *
                                                        </FormLabel>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            value={field.value}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="w-full sm:w-[268px] bg-input">
                                                                    <SelectValue placeholder={t("addJob.form.workPlaceType.placeholder")} />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="remote">{t("addJob.form.workPlaceType.options.remote")}</SelectItem>
                                                                <SelectItem value="hybrid">{t("addJob.form.workPlaceType.options.hybrid")}</SelectItem>
                                                                <SelectItem value="on-site">{t("addJob.form.workPlaceType.options.onSite")}</SelectItem>
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
                                                            {t("addJob.form.experienceLevel.label")} *
                                                        </FormLabel>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            value={field.value}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="w-full sm:w-[268px] bg-input">
                                                                    <SelectValue placeholder={t("addJob.form.experienceLevel.placeholder")} />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="Intern">{t("addJob.form.experienceLevel.options.intern")}</SelectItem>
                                                                <SelectItem value="Entry-Level">{t("addJob.form.experienceLevel.options.entryLevel")}</SelectItem>
                                                                <SelectItem value="Junior">{t("addJob.form.experienceLevel.options.junior")}</SelectItem>
                                                                <SelectItem value="Mid-Level">{t("addJob.form.experienceLevel.options.midLevel")}</SelectItem>
                                                                <SelectItem value="Senior">{t("addJob.form.experienceLevel.options.senior")}</SelectItem>
                                                                <SelectItem value="Lead">{t("addJob.form.experienceLevel.options.lead")}</SelectItem>
                                                                <SelectItem value="Principal">{t("addJob.form.experienceLevel.options.principal")}</SelectItem>
                                                                <SelectItem value="Staff">{t("addJob.form.experienceLevel.options.staff")}</SelectItem>
                                                                <SelectItem value="Manager">{t("addJob.form.experienceLevel.options.manager")}</SelectItem>
                                                                <SelectItem value="Director">{t("addJob.form.experienceLevel.options.director")}</SelectItem>
                                                                <SelectItem value="Vice President">{t("addJob.form.experienceLevel.options.vicePresident")}</SelectItem>
                                                                <SelectItem value="C-Level">{t("addJob.form.experienceLevel.options.cLevel")}</SelectItem>
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
                                                        {t("addJob.form.description.label")} *
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder={t("addJob.form.description.placeholder")}
                                                            className="min-h-[150px] bg-input"
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
                                                        {t("addJob.form.requirements.label")} *
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder={t("addJob.form.requirements.placeholder")}
                                                            className="min-h-[150px] bg-input"
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
                                                {t("addJob.form.tags.label")}
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
                                                    placeholder={t("addJob.form.tags.placeholder")}
                                                    className="bg-input"
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
                                                            placeholder={t("addJob.form.tags.searchPlaceholder")}
                                                            className="h-10"
                                                        />
                                                        <CommandList>
                                                            <CommandEmpty>{t("addJob.form.tags.noTags")}</CommandEmpty>
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
                                                {t("addJob.form.salary.label")}
                                            </h3>
                                            <div className="grid grid-cols-3 gap-3 flex justify-between">
                                                <FormField
                                                    control={form.control}
                                                    name="salary.min"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-sm font-medium">
                                                                {t("addJob.form.salary.min.label")}
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    placeholder={t("addJob.form.salary.min.placeholder")}
                                                                    className="bg-input"
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
                                                                {t("addJob.form.salary.max.label")}
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    placeholder={t("addJob.form.salary.max.placeholder")}
                                                                    className="bg-input"
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
                                                                {t("addJob.form.salary.currency.label")}
                                                            </FormLabel>
                                                            <Select
                                                                onValueChange={field.onChange}
                                                                defaultValue="USD"
                                                                value={field.value}
                                                            >
                                                                <FormControl>
                                                                    <SelectTrigger className="bg-input">
                                                                        <SelectValue placeholder={t("addJob.form.salary.currency.placeholder")} />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="USD">{t("addJob.form.salary.currency.options.usd")}</SelectItem>
                                                                    <SelectItem value="EUR">{t("addJob.form.salary.currency.options.eur")}</SelectItem>
                                                                    <SelectItem value="SAR">{t("addJob.form.salary.currency.options.sar")}</SelectItem>
                                                                    <SelectItem value="AED">{t("addJob.form.salary.currency.options.aed")}</SelectItem>
                                                                    <SelectItem value="KWD">{t("addJob.form.salary.currency.options.kwd")}</SelectItem>
                                                                    <SelectItem value="EGP">{t("addJob.form.salary.currency.options.egp")}</SelectItem>
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
                                                        {t("addJob.form.hiringTarget.label")}
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder={t("addJob.form.hiringTarget.placeholder")}
                                                            className="bg-input"
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
                                                {t("addJob.form.cancel")}
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
                                                    {t("addJob.form.submitting")}
                                                </>
                                            ) : (
                                                t("addJob.form.submit")
                                            )}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </ScrollArea>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
}