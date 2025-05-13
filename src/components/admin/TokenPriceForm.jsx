"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import {
  PoundSterlingIcon as CurrencyPound,
  DollarSign,
  Euro,
  PoundSterling,
} from "lucide-react";

const formSchema = z.object({
  tokenValue: z.coerce.number().positive().min(0.001, {
    message: "Token value must be at least 0.001.",
  }),
  currency: z.string().min(3, {
    message: "Currency code must be at least 3 characters.",
  }),
});
export default function TokenPriceForm({
  onSubmit,
  tokenPrice,
  isSubmitting = false,
  defaultCurrency = "EGP",
  supportedCurrencies = ["EGP", "USD", "EUR", "GBP"],
}) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tokenValue:
        tokenPrice?.tokenValue ||
        (typeof tokenPrice === "number" ? tokenPrice : 0.1),
      currency: tokenPrice?.currency || defaultCurrency,
    },
  });

  // Update form when defaultCurrency changes
  useEffect(() => {
    if (defaultCurrency) {
      form.setValue("currency", defaultCurrency);
    }
  }, [defaultCurrency, form]);

  // Update form when tokenPrice changes
  useEffect(() => {
    if (tokenPrice) {
      const value =
        tokenPrice?.tokenValue ||
        (typeof tokenPrice === "number" ? tokenPrice : 0.1);
      form.setValue("tokenValue", value);
    }
  }, [tokenPrice, form]);

  const handleFormSubmit = (values) => {
    onSubmit(values);
    // Don't reset the form as we want to keep the values visible
  };

  const isEGP = form.watch("currency") === "EGP";
  const currentCurrency = form.watch("currency");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800 mb-4">
          <div className="flex items-start gap-3">
            {currentCurrency === "EGP" ? (
              <CurrencyPound className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5" />
            ) : currentCurrency === "USD" ? (
              <DollarSign className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5" />
            ) : currentCurrency === "EUR" ? (
              <Euro className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5" />
            ) : (
              <PoundSterling className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5" />
            )}
            <div>
              <h4 className="text-sm font-medium text-amber-800 dark:text-amber-500">
                Updating {currentCurrency} Token Pricing
              </h4>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                You are updating the token value for{" "}
                {currentCurrency === "EGP"
                  ? "Egyptian Pound (EGP)"
                  : currentCurrency === "USD"
                  ? "US Dollar (USD)"
                  : currentCurrency === "EUR"
                  ? "Euro (EUR)"
                  : "British Pound (GBP)"}
                . This will affect all token purchases made in this currency.
              </p>
            </div>
          </div>
        </div>

        <FormField
          control={form.control}
          name="tokenValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Token Value in {currentCurrency}</FormLabel>
              <FormControl>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">
                      {isEGP
                        ? "£E"
                        : currentCurrency === "USD"
                        ? "$"
                        : currentCurrency === "EUR"
                        ? "€"
                        : "£"}
                    </span>
                  </div>
                  <Input
                    type="number"
                    step="0.001" // Changed from 0.01 to 0.001 for higher precision
                    min="0.001" // Changed from 0.01 to 0.001
                    placeholder="0.001" // Updated placeholder to reflect minimum value
                    className="pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormDescription>
                This is the amount in {currentCurrency} that a single token will
                cost.
              </FormDescription>
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
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {supportedCurrencies.includes("EGP") && (
                    <SelectItem value="EGP">EGP - Egyptian Pound</SelectItem>
                  )}
                  {supportedCurrencies.includes("USD") && (
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                  )}
                  {supportedCurrencies.includes("EUR") && (
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                  )}
                  {supportedCurrencies.includes("GBP") && (
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting
            ? "Updating..."
            : `Update ${currentCurrency} Token Value`}
        </Button>
      </form>
    </Form>
  );
}
