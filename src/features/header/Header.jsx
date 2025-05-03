import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import UserAvatar from "./user-avatar/UserAvatar";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200">
      <div className="flex items-center justify-between w-full px-4 md:px-6">
        {/* Left Section with Logo and Mobile Menu */}
        <div className="flex items-center gap-4">
          {/* Hamburger Menu for Smaller Screens */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-background hover:bg-muted transition-colors">
                  <Menu className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 p-2">
                <DropdownMenuItem
                  asChild
                  className="flex h-9 cursor-pointer items-center rounded-md px-3 text-sm font-medium"
                >
                  <Link to="companies">Companies</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="flex h-9 cursor-pointer items-center rounded-md px-3 text-sm font-medium"
                >
                  <Link to="jobs">Jobs</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Project Name */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold tracking-tight">
              <span className="text-foreground">Talee</span>
              <span className="text-primary">x</span>
            </h1>
          </div>

          {/* Header Links for Larger Screens */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="companies"
              className="px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors"
            >
              Companies
            </Link>
            <Link
              to="jobs"
              className="px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors"
            >
              Jobs
            </Link>
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Separator orientation="vertical" className="h-6 hidden md:block" />
          <UserAvatar />
        </div>
      </div>
    </header>
  );
}
