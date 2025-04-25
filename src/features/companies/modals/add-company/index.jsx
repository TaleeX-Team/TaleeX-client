import React, { use, useState } from "react";
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
import { Label } from "@/components/ui/label";
import { MapPin, Globe, Upload, Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { useCompanies } from "../../features";

const formSchema = z.object({
  image: z.any().refine((file) => file instanceof File || file === null, {
    message: "Please upload a valid image file.",
  }),
  name: z.string().min(2, {
    message: "Name must contain only letters and is no less than 3 letters.",
  }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long." }),
  address: z.string().min(5, { message: "Address is required." }),
  website: z
    .string()
    .url({ message: "Please enter a valid website URL." })
    .optional(),
});
export default function AddCompany() {
  const [logoPreview, setLogoPreview] = useState(null);
  const { createCompanyMutation } = useCompanies();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: null,
      name: "",
      description: "",
      address: "",
      website: "",
    },
  });

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
      form.setValue("image", file);
    }
  };

  const onSubmit = (values) => {
    console.log("Form submitted:", values);
    createCompanyMutation.mutate(values, {
      onSuccess: () => {
        toast.success("Company created successfully!");
      },
      onError: (error) => {
        console.error("Error creating company:", error);
        toast.error(
          error.response?.data?.message ||
            "Failed to create company. Please try again."
        );
      },
    });

    form.reset();
    setLogoPreview(null);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-4 md:mt-0 bg-primary text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" /> Add Company
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add Company</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new company to the directory.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Logo Upload */}
            <div className="space-y-2">
              <Label htmlFor="logo-upload">Company Logo</Label>
              <div className="flex flex-col items-center">
                <div className="border-2 border-dashed rounded-md p-6 w-40 h-40 flex flex-col items-center justify-center text-center">
                  {logoPreview ? (
                    <img
                      src={logoPreview || "/placeholder.svg"}
                      alt="Logo preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">
                        Upload logo
                      </span>
                    </>
                  )}
                </div>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/png, image/jpeg"
                  className="hidden"
                  onChange={handleLogoChange}
                />
                <label
                  htmlFor="logo-upload"
                  className="mt-2 text-sm text-primary cursor-pointer"
                >
                  Upload logo
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended: 400x400px, PNG or JPG
                </p>
                {form.formState.errors.image && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.image.message}
                  </p>
                )}
              </div>
            </div>

            {/* Company Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Website */}
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="e.g. https://www.example.com"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the company"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="e.g. San Francisco, CA"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="sm:justify-end">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-primary text-primary-foreground"
              >
                Create Company
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
