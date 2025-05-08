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
                <CardTitle>Apply for this position</CardTitle>
                <CardDescription>Fill out the form below to submit your application</CardDescription>
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
                                        <FormLabel>Full Name</FormLabel>
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
                                        <FormLabel>Email</FormLabel>
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
                                    <FormLabel>LinkedIn Profile (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://linkedin.com/in/johndoe" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Share your LinkedIn profile to help the employer learn more about you
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
                                    <FormLabel>Resume/CV</FormLabel>
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
                                    <FormDescription>Upload your resume or CV (PDF files only)</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Additional Notes (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Share any additional information that might be relevant to your application"
                                            className="min-h-[120px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>Maximum 500 characters</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </CardContent>
                    <CardFooter className="mt-4 flex justify-between">
                        <p className="text-xs">
                            By submitting this application, you consent to Taleex sharing your information with the company posting this job.
                        </p>
                        <Button type="submit" className="w-auto" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                "Submit Application"
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}
