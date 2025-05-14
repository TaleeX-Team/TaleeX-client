import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth.js";
import { useUser } from "@/hooks/useUser";
import { useTranslation } from "react-i18next"; // Import translation hook

const UserAvatar = () => {
  const { t } = useTranslation(); // Initialize translation hook
  const { logout } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const { data: user } = useUser();

  const handleLogout = () => {
    logout.mutate();
    setOpenDialog(false);
  };

  const getInitials = (name) => name?.charAt(0).toUpperCase() || "U"; // Fallback to 'U' if name is empty

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer ring-offset-background transition-opacity hover:opacity-80">
          <AvatarImage src={user?.imageUrl} alt="@shadcn" />
          <AvatarFallback>{getInitials(user?.firstName)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t("userAvatar.myAccount")}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setOpenDialog(true);
          }}
          className="text-red-600 focus:bg-red-100 dark:focus:bg-red-900 cursor-pointer"
        >
          {t("userAvatar.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("userAvatar.confirmLogoutTitle")}</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenDialog(false)}>
              {t("userAvatar.cancel")}
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              {t("userAvatar.logout")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DropdownMenu>
  );
};

export default UserAvatar;
