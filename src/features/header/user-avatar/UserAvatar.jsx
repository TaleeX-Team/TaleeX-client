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
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth.js";
import { useUser } from "@/hooks/useUser";

const UserAvatar = () => {
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
        <Avatar className=" w-9 h-9 cursor-pointer ring-offset-background transition-opacity hover:opacity-80">
          <AvatarImage src={user?.imageUrl} alt="@shadcn" />
          <AvatarFallback>{getInitials(user?.firstName)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link to="settings">
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </Link>
        <Link to="/settings/billing">
          <DropdownMenuItem>Billing</DropdownMenuItem>
        </Link>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setOpenDialog(true);
          }}
          className="text-red-600 focus:bg-red-100 dark:focus:bg-red-900 cursor-pointer"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to logout?</DialogTitle>
            <DialogDescription>
              You will be logged out of your account. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DropdownMenu>
  );
};

export default UserAvatar;
