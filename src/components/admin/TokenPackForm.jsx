"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Pack name must be at least 2 characters.",
    }),
    price: z.coerce.number().positive({
        message: "Price must be a positive number.",
    }),
    currency: z.string().min(3, {
        message: "Currency code must be at least 3 characters.",
    }),
    tokens: z.coerce.number().int().positive({
        message: "Tokens must be a positive integer.",
    }),
    isActive: z.boolean(),
})

export default function TokenPackForm({
                                          onSubmit,
                                          pack,
                                          isSubmitting = false,
                                          supportedCurrencies = ["EGP", "USD", "EUR", "GBP"],
                                      }) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: pack?.name || "",
            price: pack?.price || 19.99,
            currency: pack?.currency || "EGP",
            tokens: pack?.tokens || 100,
            isActive: pack?.isActive ?? true,
        },
    })

    const handleFormSubmit = (values) => {
        onSubmit({
            _id: pack?._id,
            ...values,
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Pack Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Starter Pack" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" min="0.01" placeholder="19.99" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Currency</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select currency" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {supportedCurrencies.includes("EGP") && <SelectItem value="EGP">EGP</SelectItem>}
                                        {supportedCurrencies.includes("USD") && <SelectItem value="USD">USD</SelectItem>}
                                        {supportedCurrencies.includes("EUR") && <SelectItem value="EUR">EUR</SelectItem>}
                                        {supportedCurrencies.includes("GBP") && <SelectItem value="GBP">GBP</SelectItem>}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="tokens"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Number of Tokens</FormLabel>
                            <FormControl>
                                <Input type="number" min="1" placeholder="100" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Active Status</FormLabel>
                                <FormDescription>Make this token pack available for purchase</FormDescription>
                            </div>
                            <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : pack ? "Update Pack" : "Add Pack"}
                </Button>
            </form>
        </Form>
    )
}
