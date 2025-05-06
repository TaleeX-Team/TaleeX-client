import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/hooks/useUser.js";
import { toast } from "sonner";
import { Loader2, ImagePlus } from "lucide-react";
import { useProfile } from "../features";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingIndicator } from "@/components/LoadingButton.jsx";

// Create a schema for form validation with the new requirements
// All fields are optional for update, but if provided must follow validation rules
const profileSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "First name can only contain letters and spaces.",
    })
    .optional()
    .or(z.literal("")),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Last name can only contain letters and spaces.",
    })
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .min(11, { message: "Phone number must be at least 10 digits." })
    .regex(/^\+?[0-9]+$/, {
      message:
        "Phone number must contain only digits with an optional + prefix.",
    })
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .optional()
    .or(z.literal("")),
  image: z.any().optional(),
});

export default function ProfilePage() {
  const { data: user } = useUser();
  const { updateUserMutation } = useProfile();
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [originalPhone, setOriginalPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const isLoading = updateUserMutation.isLoading;

  // Initialize form with empty values, using user data as placeholders
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      image: null,
    },
  });

  // Set original phone when user data is available
  useEffect(() => {
    if (user?.phone) {
      setOriginalPhone(user.phone);
    }
  }, [user]);

  // Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      form.setValue("image", file);
    }
  };

  // Open file dialog when "Change Avatar" button is clicked
  const handleAvatarButtonClick = () => {
    fileInputRef.current.click();
  };

  // Handle form submission
  const onSubmit = (data) => {
    // Only check if phone number is the same as the original when a value is provided
    if (data.phone && data.phone === originalPhone) {
      setPhoneError(
        "Please enter a different phone number than your current one."
      );
      return;
    }

    // Filter out empty strings to avoid unnecessary updates
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== undefined && value !== "" && value !== null
      )
    );

    // Don't submit if no changes were made
    if (Object.keys(cleanedData).length === 0 && !data.image) {
      toast.info("No changes to save");
      return;
    }

    // Create a FormData object if there's an avatar to upload
    let formData = null;

    if (data.image) {
      formData = new FormData();
      formData.append("image", data.image);

      // Add other fields to the FormData only if they have values
      if (data.firstName) formData.append("firstName", data.firstName);
      if (data.lastName) formData.append("lastName", data.lastName);
      if (data.phone) formData.append("phone", data.phone);
      if (data.email) formData.append("email", data.email);
    }

    // Use the mutation to update the user
    updateUserMutation.mutate(
      {
        userId: user?.id,
        userData: formData || cleanedData,
      },
      {
        onSuccess: () => {
          toast.success("Profile updated successfully!");
          // Reset the avatar preview if needed
          // Update the original phone number with the new one
          setOriginalPhone(data.phone);
          setPhoneError("");
        },
        onError: (error) => {
          console.error("Error updating profile:", error);
          toast.error(
            error.response?.data?.message ||
              "Failed to update profile. Please try again."
          );
        },
      }
    );
  };

  // Handle phone input changes to clear custom error
  const handlePhoneChange = (e) => {
    form.setValue("phone", e.target.value);
    // Only check against original phone if there's a value
    if (!e.target.value || e.target.value !== originalPhone) {
      setPhoneError("");
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Account Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <Card>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal information and how others see you on the
              platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-10">
            <div className="flex flex-col md:flex-row gap-6 ">
              <div className="flex flex-col items-center space-y-2">
                <div className="relative">
                  <Avatar className="w-24 h-24 border-2 border-muted">
                    {avatarPreview ? (
                      <AvatarImage src={avatarPreview} alt="Profile Preview" />
                    ) : (
                      <>
                        <AvatarImage
                          src={
                            user?.imageUrl ||
                            "/placeholder.svg?height=96&width=96"
                          }
                          alt="Profile"
                        />
                        <AvatarFallback className="text-xl">
                          {user?.firstName?.[0] || ""}
                          {user?.lastName?.[0] || "U"}
                        </AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1 shadow-md">
                    <ImagePlus className="h-4 w-4" />
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/svg+xml"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAvatarButtonClick}
                >
                  Change Avatar
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-1">
                  Recommended: Square image, JPG or PNG
                </p>
                {form.formState.errors.image && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.image.message}
                  </p>
                )}
              </div>

              <div className="grid gap-4 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className={
                        form.formState.errors.firstName
                          ? "text-destructive"
                          : ""
                      }
                    >
                      First Name*
                    </Label>
                    <Input
                      id="firstName"
                      placeholder={user?.firstName || "John"}
                      {...form.register("firstName")}
                      className={
                        form.formState.errors.firstName
                          ? "border-destructive"
                          : ""
                      }
                    />
                    {form.formState.errors.firstName && (
                      <p className="text-xs text-destructive">
                        {form.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="lastName"
                      className={
                        form.formState.errors.lastName ? "text-destructive" : ""
                      }
                    >
                      Last Name*
                    </Label>
                    <Input
                      id="lastName"
                      placeholder={user?.lastName || "Doe"}
                      {...form.register("lastName")}
                      className={
                        form.formState.errors.lastName
                          ? "border-destructive"
                          : ""
                      }
                    />
                    {form.formState.errors.lastName && (
                      <p className="text-xs text-destructive">
                        {form.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className={
                      form.formState.errors.email ? "text-destructive" : ""
                    }
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    placeholder={user?.email || "john.doe@example.com"}
                    {...form.register("email")}
                    className={
                      form.formState.errors.email ? "border-destructive" : ""
                    }
                  />
                  {form.formState.errors.email && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className={
                      form.formState.errors.phone || phoneError
                        ? "text-destructive"
                        : ""
                    }
                  >
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    placeholder={user?.phone || "+1 (555) 123-4567"}
                    {...form.register("phone")}
                    onChange={handlePhoneChange}
                    className={
                      form.formState.errors.phone || phoneError
                        ? "border-destructive"
                        : ""
                    }
                  />
                  {form.formState.errors.phone && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.phone.message}
                    </p>
                  )}
                  {phoneError && (
                    <p className="text-xs text-destructive">{phoneError}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between mt-6">
            <Button className="ml-auto" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoadingIndicator className="mr-2" />
                  Processing
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
