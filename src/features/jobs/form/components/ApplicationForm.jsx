"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { FileUpload } from "@/features/jobs/form/components/FileUpload.jsx";
import { useTranslation } from "react-i18next"; // Import useTranslation

const applicationSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    linkedIn: z.string().min(20, { message: "Please enter a valid LinkedIn URL" }).optional().or(z.literal("")),
    notes: z.string().max(500, { message: "Notes must be less than 500 characters" }).optional(),
    document: z
        .instanceof(File, { message: "Please upload your resume/CV" })
        .refine((file) => file.type === "application/pdf", { message: "Only PDF files are accepted" }),
})

export function ApplicationForm({ jobId, onSubmit, isSubmitting }) {
    const { t } = useTranslation(); // Initialize t function for translation
    const [file, setFile] = useState(null)

    const form = useForm({
        resolver: zodResolver(applicationSchema),
        defaultValues: {
            name: "",
            email: "",
            linkedIn: "",
            notes: "",
        },
    })

    const handleSubmit = async (values) => {
        const formData = new FormData()
        formData.append("name", values.name)
        formData.append("email", values.email)

        if (values.linkedIn) {
            formData.append("linkedIn", values.linkedIn)
        }

        if (values.notes) {
            formData.append("notes", values.notes)
        }

        if (file) {
            formData.append("document", file)
        }

        await onSubmit(formData)
    }

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>{t("applicationForm.title")}</CardTitle>
                <CardDescription>{t("applicationForm.description")}</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("applicationForm.fullName")}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("applicationForm.email")}</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="john.doe@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="linkedIn"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("applicationForm.linkedIn")}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://linkedin.com/in/johndoe" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        {t("applicationForm.linkedInDescription")}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="document"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("applicationForm.resume")}</FormLabel>
                                    <FormControl>
                                        <FileUpload
                                            value={file}
                                            onChange={(file) => {
                                                setFile(file)
                                                field.onChange(file)
                                            }}
                                            accept=".pdf"
                                        />
                                    </FormControl>
                                    <FormDescription>{t("applicationForm.resumeDescription")}</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("applicationForm.additionalNotes")}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={t("applicationForm.additionalNotes")}
                                            className="min-h-[120px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>{t("applicationForm.additionalNotesDescription")}</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </CardContent>
                    <CardFooter className="mt-4 flex justify-between">
                        <p className="text-xs">
                            {t("applicationForm.consent")}
                        </p>
                        <Button type="submit" className="w-auto" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t("applicationForm.submitting")}
                                </>
                            ) : (
                                t("applicationForm.submit")
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}
