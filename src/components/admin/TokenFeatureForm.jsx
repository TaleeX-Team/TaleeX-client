"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
    feature: z.string().min(2, {
        message: "Feature name must be at least 2 characters.",
    }),
    tokenCost: z.coerce.number().min(1, {
        message: "Token cost must be at least 1.",
    }),
})

export default function TokenFeatureForm({ onSubmit, feature, isSubmitting = false }) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            feature: feature?.feature || "",
            tokenCost: feature?.tokenCost || 1,
        },
    })

    const handleFormSubmit = (values) => {
        onSubmit({
            _id: feature?._id,
            ...values,
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="feature"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Feature Name</FormLabel>
                            <FormControl>
                                <Input placeholder="AI Interview" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tokenCost"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Token Cost</FormLabel>
                            <FormControl>
                                <Input type="number" min="1" placeholder="10" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : feature ? "Update Feature" : "Add Feature"}
                </Button>
            </form>
        </Form>
    )
}
