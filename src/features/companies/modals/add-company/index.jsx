"use client";
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Globe,
  Plus,
  Building2,
  Loader2,
  ImagePlus,
  Trash,
  X,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { useCompanies } from "../../features";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";

const formSchema = z.object({
  image: z.any().refine((file) => file instanceof File || file === null, {
    message: "Please upload a valid image file.",
  }),
  name: z.string().min(2, {
    message: "Name must contain only letters and is no less than 2 letters.",
  }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long." })
    .optional()
    .or(z.literal("")),
  address: z.string().min(5, { message: "Address is required." }),
  website: z
    .string()
    .url({ message: "Please enter a valid website URL." })
    .optional()
    .or(z.literal("")),
  values: z.array(z.string()).optional(),
});

export default function AddCompany() {
  const { t } = useTranslation();
  const [logoPreview, setLogoPreview] = useState(null);
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState([]);
  const [currentValue, setCurrentValue] = useState("");
  const { createCompanyMutation } = useCompanies();
  const uploadAreaRef = useRef(null);
  const formContainerRef = useRef(null);

  const isLoading = createCompanyMutation.isLoading;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: null,
      name: "",
      description: "",
      address: "",
      website: "",
      values: [],
    },
  });

  // Handle company values
  const handleAddValue = () => {
    if (currentValue.trim()) {
      const newValue = currentValue.trim();
      if (!values.includes(newValue)) {
        const newValues = [...values, newValue];
        setValues(newValues);
        form.setValue("values", newValues);
        setCurrentValue("");
      }
    }
  };

  const handleRemoveValue = (valueToRemove) => {
    const newValues = values.filter((value) => value !== valueToRemove);
    setValues(newValues);
    form.setValue("values", newValues);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddValue();
    }
  };

  // Handle dialog open/close
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  // Handle logo upload
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
      form.setValue("image", file);
    }
  };

  // Handle logo remove
  const handleRemoveLogo = () => {
    setLogoPreview(null);
    form.setValue("image", null);
  };

  // Handle form submit
  const onSubmit = (values) => {
    createCompanyMutation.mutate(values, {
      onSuccess: () => {
        toast.success(t("companies.toast.createSuccess"));
        setOpen(false);
        form.reset();
        setLogoPreview(null);
        setValues([]);
      },
      onError: (error) => {
        console.error("Error creating company:", error);
        toast.error(
          error.response?.data?.message ||
          t("companies.toast.createError")
        );
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="mt-4 md:mt-0 bg-primary text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" /> {t("companies.addCompany")}
        </Button>
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
        <div ref={formContainerRef}>
          <DialogHeader className="p-6 pb-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <DialogTitle className="text-xl">{t("companies.addNewCompany")}</DialogTitle>
            </div>
            <DialogDescription className="text-sm text-muted-foreground text-left space-y-1">
              <p>{t("companies.descriptionCheck")}</p>
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-2 bg-secondary/50 dark:bg-card">
                <TabsTrigger value="basic">{t("companies.basicInfo")}</TabsTrigger>
                <TabsTrigger value="additional">{t("companies.additionalDetails")}</TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="px-6 py-2 max-h-[70vh]">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <TabsContent value="basic" className="space-y-6 pt-2">
                    {/* Logo Upload */}
                    <div className="space-y-2">
                      <FormLabel htmlFor="logo-upload">{t("companies.companyLogo")}</FormLabel>
                      <div className="flex flex-col items-center">
                        <div
                          ref={uploadAreaRef}
                          className="border-2 border-dashed rounded-lg p-6 w-40 h-40 flex flex-col items-center justify-center text-center relative cursor-pointer"
                        >
                          {logoPreview ? (
                            <div className="relative w-full h-full">
                              <img
                                src={logoPreview}
                                alt="Logo preview"
                                className="max-h-full max-w-full object-contain"
                              />
                              <button
                                type="button"
                                onClick={handleRemoveLogo}
                                className="absolute -top-3 -right-3 p-1 rounded-full bg-background text-destructive shadow-sm border hover:bg-destructive hover:text-destructive-foreground transition-colors"
                              >
                                <Trash className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <ImagePlus className="h-10 w-10 text-muted-foreground mb-2" />
                              <span className="text-sm text-muted-foreground">
                                {t("companies.uploadLogo")}
                              </span>
                            </>
                          )}
                        </div>
                        <input
                          id="logo-upload"
                          type="file"
                          accept="image/png, image/jpeg, image/svg+xml"
                          className="hidden"
                          onChange={handleLogoChange}
                        />
                        <label
                          htmlFor="logo-upload"
                          className="mt-2 text-sm text-primary cursor-pointer hover:underline"
                        >
                          {t("companies.browseFiles")}
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">
                          {t("companies.recommendedSize")}
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
                          <FormLabel>{t("companies.companyName")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("companies.enterCompanyName")}
                              className="bg-input"
                              {...field}
                            />
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
                          <FormLabel>{t("companies.website")}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                placeholder="e.g. https://www.example.com"
                                className="pl-10 bg-input"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            {t("companies.includeUrl")}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Address */}
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("companies.address")}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                placeholder="e.g. San Francisco, CA"
                                className="pl-10 bg-input"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="additional" className="space-y-6 pt-2">
                    {/* Description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("companies.Description")}</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={t("companies.descriptionPlaceholder")}
                              className="min-h-[120px] resize-y bg-input"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            {t("companies.descriptionLimit")}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Company Values */}
                    <div className="space-y-2">
                      <Label htmlFor="values">{t("companies.companyValues")}</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {values.map((value, index) => (
                          <Badge
                            key={index}
                            className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1"
                          >
                            {value}
                            <button
                              type="button"
                              onClick={() => handleRemoveValue(value)}
                              className="ml-1 rounded-full hover:bg-primary/20 p-0.5"
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">{t("common.remove")}</span>
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          id="values"
                          value={currentValue}
                          onChange={(e) => setCurrentValue(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder={t("companies.addValuePlaceholder")}
                          className="bg-input"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={handleAddValue}
                          disabled={!currentValue.trim()}
                        >
                          <Plus className="h-4 w-4" />
                          <span className="sr-only">{t("common.add")}</span>
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t("companies.pressEnter")}
                      </p>
                    </div>
                  </TabsContent>

                  <DialogFooter className="py-4 sticky bottom-0">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        {t("common.cancel")}
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      className="bg-primary text-primary-foreground"
                      disabled={isLoading}
                    >
                      {isLoading ? <>
                        <LoadingIndicator className="mr-2" />
                        {t("companies.processing")}
                      </> : t("companies.createCompany")}
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
