import { useUser } from "@/hooks/userQueries.js";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import {
  Calendar,
  Mail,
  MapPin,
  Phone,
  Globe,
  Briefcase,
  Shield,
  Clock,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";

const UserProfileDialog = ({ userId, isOpen, onClose, onEdit }) => {
  const { data: user, isLoading, error } = useUser(userId);
  console.log("Query result:", { user, isLoading, error });
  const getUserInitials = (user) => {
    if (!user) return "??";
    return (
      `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() ||
      "??"
    );
  };

  // Format the join date
  const formatJoinDate = (dateString) => {
    if (!dateString) return "Unknown";

    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return "Invalid date";

      // Format the date
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
    } catch (error) {
      return "Unknown";
    }
  };

  // Get status styles
  const getStatusStyles = (status) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
      case "inactive":
        return "bg-slate-500/10 text-slate-600 dark:text-slate-400";
      case "pending":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
    }
  };

  // Helper function to get user full name
  const getUserFullName = (user) => {
    if (!user) return "Unknown User";
    return (
      `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown User"
    );
  };

  // Get user status
  const getUserStatus = (user) => {
    if (!user) return "unknown";
    // If there's a status field, use it
    if (user.status) return user.status;

    // Otherwise derive status from other fields
    if (user.isVerified) return "active";
    if (user.lastLoginDate) return "inactive";
    return "pending";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>
            View detailed information about this user
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full bg-muted" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-40 bg-muted" />
                <Skeleton className="h-4 w-32 bg-muted" />
              </div>
            </div>
            <div className="space-y-3 pt-4">
              <Skeleton className="h-4 w-full bg-muted" />
              <Skeleton className="h-4 w-full bg-muted" />
              <Skeleton className="h-4 w-3/4 bg-muted" />
            </div>
          </div>
        ) : error ? (
          <div className="py-6 text-center text-destructive">
            <p>Error loading user profile: {error.message}</p>
          </div>
        ) : user ? (
          <div className="space-y-6">
            {/* User Header */}
            <div className="flex items-start gap-4 pb-2 border-b border-border">
              <Avatar className="h-20 w-20 border border-border ring-2 ring-background">
                <AvatarImage
                  src={user.imageUrl || user.socialLoginAvatar}
                  alt={getUserFullName(user)}
                />
                <AvatarFallback className="bg-muted text-primary text-lg font-medium">
                  {getUserInitials(user)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1 flex-1">
                <h3 className="text-xl font-semibold text-foreground">
                  {getUserFullName(user)}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`${getStatusStyles(
                      getUserStatus(user)
                    )} font-medium capitalize border-none`}
                  >
                    {getUserStatus(user)}
                  </Badge>
                  <span className="text-muted-foreground">•</span>
                  <Badge variant="outline" className="font-medium">
                    {user.role || "User"}
                  </Badge>
                </div>
                <div className="flex items-center text-muted-foreground text-sm mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  Member since {formatJoinDate(user.createdAt)}
                </div>
              </div>
            </div>

            {/* User Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-foreground">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email || "No email provided"}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-2 text-foreground">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{user.phone}</span>
                </div>
              )}
              {user.location && (
                <div className="flex items-center gap-2 text-foreground">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{user.location}</span>
                </div>
              )}
              {user.website && (
                <div className="flex items-center gap-2 text-foreground">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span>{user.website}</span>
                </div>
              )}
              {user.company && (
                <div className="flex items-center gap-2 text-foreground">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{user.company}</span>
                </div>
              )}
              {user.permissions && (
                <div className="flex items-center gap-2 text-foreground">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>{user.permissions}</span>
                </div>
              )}
              {user.lastLoginDate && (
                <div className="flex items-center gap-2 text-foreground">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Last active: {new Date(user.lastLoginDate).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Bio or Additional Info */}
            {user.bio && (
              <div className="pt-2 border-t border-border">
                <h4 className="text-sm font-medium text-foreground mb-2">
                  About
                </h4>
                <p className="text-muted-foreground text-sm">{user.bio}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="py-6 text-center text-muted-foreground">
            <p>User not found</p>
          </div>
        )}

        <DialogFooter className="flex gap-2 justify-between items-center flex-wrap">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {user && (
            <Button
              onClick={() => {
                onClose();
                onEdit(user);
              }}
            >
              Edit User
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileDialog;
