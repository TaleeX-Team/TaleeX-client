import { useEffect, useState } from "react";
import { useUserUpdate } from "@/hooks/userQueries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Form validation schema - only include the allowed fields
const userFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().optional(),
  image: z.any().optional().nullable(),
});

const EditUserDialog = ({ user, isOpen, onClose, onSuccess }) => {
  const updateUserMutation = useUserUpdate();
  const [previewImage, setPreviewImage] = useState(null);

  // Initialize form with react-hook-form
  const form = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      imageUrl: null,
    },
  });

  // Update form values when user changes
  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        imageUrl: null,
      });
      setPreviewImage(null);
    }
  }, [user, form]);

  // Helper function to get user initials for avatar fallback
  const getUserInitials = (user) => {
    if (!user) return "??";
    return (
      `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() ||
      "??"
    );
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      form.setValue("imageUrl", file);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    }
  };

  // Submit form
  const onSubmit = (data) => {
    if (!user) return;

    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);

    // Only append if value exists
    if (data.email) formData.append("email", data.email);
    if (data.phone) formData.append("phone", data.phone);
    if (data.imageUrl) formData.append("imageUrl", data.imageUrl);

    updateUserMutation.mutate(
      {
        userId: user._id,
        userData: formData,
      },
      {
        onSuccess: () => {
          toast.success("User updated successfully");
          onClose();
          if (onSuccess) onSuccess();
          if (previewImage) {
            URL.revokeObjectURL(previewImage);
            setPreviewImage(null);
          }
        },
        onError: (error) => {
          const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error?.details
              ?.map((d) => d.message)
              .join(", ") ||
            "Failed to update user";
          toast.error("Update failed", {
            description: errorMessage,
          });
        },
      }
    );
  };
  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your profile information</DialogDescription>
        </DialogHeader>

        {!user ? (
          <div className="py-6 text-center text-muted-foreground">
            <p>User not found</p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* User Avatar with upload capability */}
              <div className="flex flex-col items-center gap-4 py-2">
                <Avatar className="h-20 w-20 border border-border">
                  <AvatarImage
                    src={
                      previewImage || user.socialLoginAvatar || user.imageUrl
                    }
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                  <AvatarFallback className="bg-muted text-primary text-lg font-medium">
                    {getUserInitials(user)}
                  </AvatarFallback>
                </Avatar>

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 py-1 px-3 rounded-md text-sm inline-flex items-center">
                        Change Photo
                        <Input
                          {...fieldProps}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            handleImageChange(e);
                            onChange(e.target.files[0] || null);
                          }}
                        />
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="flex justify-between mt-5 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateUserMutation.isPending}>
                  {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
